import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Helper to construct WAV header for raw 24kHz 16-bit mono PCM audio from Gemini TTS
function createWavBuffer(pcmData: Buffer, sampleRate = 24000): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmData.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  header.writeUInt16LE(1, 22); // NumChannels (1 = mono)
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28); // ByteRate (sampleRate * 1 * 16/8)
  header.writeUInt16LE(2, 32); // BlockAlign (1 * 16/8)
  header.writeUInt16LE(16, 34); // BitsPerSample
  header.write("data", 36);
  header.writeUInt32LE(pcmData.length, 40);
  return Buffer.concat([header, pcmData]);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  const PORT = 3000;

  // Initialize Gemini client lazily
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Endpoint for Gemini AI Auto-Generate suggestions based on repository context
  app.post("/api/gemini/generate-suggestions", async (req, res) => {
    try {
      const { repoName, repoDescription, repoLanguage, repoTopics, assetType } = req.body;

      const ai = getGeminiClient();

      const prompt = `You are a high-tech UI/UX asset designer specializing in cyberpunk, developer-focused, and open-source project branding.
Analyze the following repository metadata:
- Repository Name: ${repoName || "glitch-tech-ui"}
- Description: ${repoDescription || "Cyberpunk HUD components and high-frequency UI generators for React"}
- Language: ${repoLanguage || "TypeScript"}
- Topics: ${Array.isArray(repoTopics) ? repoTopics.join(", ") : "ui-kit, glitch-art, cyberpunk"}
- Asset Type: ${assetType || "banner"}

Generate 4 distinct, creative, and professional design variations for this repository asset.
For each variation suggest:
1. titleText: Short, punchy main branding title (e.g., GLITCH_TECH, CYBER_CORE)
2. subText: Subtitle/tagline or status line (e.g., // COMPONENT_HUD_V2, REACT_SHADER_LIB)
3. handleText: Developer or organization handle (e.g., @DLinacre, @LIN4CRE)
4. iconStyle: Icon style tag (e.g., terminal, joystick, shield, cpu, code, zap)
5. themePreset: One of the supported palette theme IDs (cyber_cyan, volcanic_red, matrix_green, synth_purple, electric_gold, toxic_lime, ultra_blue, stealth_white)
6. reasoning: A 1-sentence design rationale explaining how this matches the repository purpose.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    titleText: { type: Type.STRING },
                    subText: { type: Type.STRING },
                    handleText: { type: Type.STRING },
                    iconStyle: { type: Type.STRING },
                    themePreset: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                  },
                  required: [
                    "titleText",
                    "subText",
                    "handleText",
                    "iconStyle",
                    "themePreset",
                    "reasoning",
                  ],
                },
              },
            },
            required: ["suggestions"],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini model.");
      }

      const parsedData = JSON.parse(text);
      res.json(parsedData);
    } catch (error: any) {
      console.error("Error in /api/gemini/generate-suggestions:", error);
      res.status(500).json({
        error: error.message || "Failed to generate AI suggestions",
      });
    }
  });

  // Endpoint to generate Glitch-Tech theme audio track using Gemini API
  app.post("/api/gemini/generate-audio", async (req, res) => {
    try {
      const { themeId, themeName, repoName, promptNote } = req.body;
      const ai = getGeminiClient();

      // First, get track metadata & sound design script from Gemini
      const metaPrompt = `You are a synthwave and darksynth sound designer creating a short Glitch-Tech sound effect or background audio track for a cyberpunk UI theme named "${themeName || "Cyber Cyan"}" for repository "${repoName || "GlitchStudio"}".
${promptNote ? `User Directive: ${promptNote}` : ""}

Provide a track title, genre (e.g. Cyberpunk Synth, Glitch Hop, Dark Synthwave, Industrial Glitch), BPM (e.g. 128), voice style name, and a sound script for Gemini TTS audio synthesis.
The sound script should feature high-tech robotic/cyber synth modulations, rhythmic binary counts, glitch sound effects, and sub-bass frequencies.`;

      const metaResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: metaPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trackTitle: { type: Type.STRING },
              genre: { type: Type.STRING },
              bpm: { type: Type.NUMBER },
              soundScript: { type: Type.STRING },
              voiceName: { type: Type.STRING, description: "One of: Fenrir, Zephyr, Kore, Puck, Charon" },
              description: { type: Type.STRING },
            },
            required: ["trackTitle", "genre", "bpm", "soundScript", "voiceName", "description"],
          },
        },
      });

      let trackInfo = {
        trackTitle: `${themeName || "Cyber"} Glitch Sequence`,
        genre: "Cyberpunk Glitch",
        bpm: 128,
        soundScript: `Glitch sequence initialized for ${themeName || "Cyber"}. System operational. Binary sync active: 1 0 1 0... Glitch modulation active!`,
        voiceName: "Fenrir",
        description: `Glitch-tech synth audio designed for ${themeName || "Cyber"} theme.`,
      };

      try {
        if (metaResponse.text) {
          trackInfo = { ...trackInfo, ...JSON.parse(metaResponse.text) };
        }
      } catch (e) {
        console.warn("Could not parse metadata JSON, using defaults.");
      }

      // Generate audio using gemini-3.1-flash-tts-preview
      const voices = ["Fenrir", "Zephyr", "Kore", "Puck", "Charon"];
      const selectedVoice = voices.includes(trackInfo.voiceName) ? trackInfo.voiceName : "Fenrir";

      const audioResponse = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Perform in a rhythmic, low-latency glitch synth style with cyber robotic cadence: ${trackInfo.soundScript}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const base64Pcm = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Pcm) {
        throw new Error("No audio data returned from Gemini TTS model.");
      }

      const pcmBuffer = Buffer.from(base64Pcm, "base64");
      const wavBuffer = createWavBuffer(pcmBuffer, 24000);
      const audioDataUrl = `data:audio/wav;base64,${wavBuffer.toString("base64")}`;

      res.json({
        trackTitle: trackInfo.trackTitle,
        genre: trackInfo.genre,
        bpm: trackInfo.bpm,
        description: trackInfo.description,
        voiceName: selectedVoice,
        audioUrl: audioDataUrl,
      });
    } catch (error: any) {
      console.error("Error in /api/gemini/generate-audio:", error);
      res.status(500).json({
        error: error.message || "Failed to generate theme audio track.",
      });
    }
  });

  // Vite middleware for development vs static build serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
