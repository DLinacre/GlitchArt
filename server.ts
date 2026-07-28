import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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
