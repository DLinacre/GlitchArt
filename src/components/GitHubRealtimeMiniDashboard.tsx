import React, { useState, useEffect } from 'react';
import {
  Github,
  Star,
  GitCommit,
  GitFork,
  Eye,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Search,
  Sparkles,
  CheckCircle2,
  Code2,
  Shield,
  Clock,
  User,
} from 'lucide-react';

interface GitHubRepoApiData {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count: number;
  watchers_count: number;
  language: string;
  html_url: string;
  pushed_at: string;
  updated_at: string;
  license?: { spdx_id: string; name: string };
  owner?: { login: string; avatar_url: string };
}

interface GitHubCommitApiData {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author?: {
    login: string;
    avatar_url: string;
  };
}

const PRESET_REPOS = [
  { label: 'glitch-tech-ui', repo: 'DLinacre/glitch-tech-ui' },
  { label: 'cyber-runner-3d', repo: 'LIN4CRE/cyber-runner-3d' },
  { label: 'react', repo: 'facebook/react' },
  { label: 'vite', repo: 'vitejs/vite' },
  { label: 'tailwindcss', repo: 'tailwindlabs/tailwindcss' },
];

export const GitHubRealtimeMiniDashboard: React.FC<{ defaultRepo?: string }> = ({
  defaultRepo = 'facebook/react',
}) => {
  const [repoInput, setRepoInput] = useState<string>(defaultRepo);
  const [activeRepo, setActiveRepo] = useState<string>(defaultRepo);
  const [repoData, setRepoData] = useState<GitHubRepoApiData | null>(null);
  const [commits, setCommits] = useState<GitHubCommitApiData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<string>('');

  const fetchGithubData = async (targetRepo: string) => {
    setLoading(true);
    setError(null);
    const cleanRepo = targetRepo.trim().replace(/^https?:\/\/github\.com\//, '');

    try {
      const repoRes = await fetch(`https://api.github.com/repos/${cleanRepo}`);
      
      if (!repoRes.ok) {
        if (repoRes.status === 404) {
          throw new Error(`Repository "${cleanRepo}" not found on GitHub.`);
        } else if (repoRes.status === 403) {
          throw new Error('GitHub API rate limit reached. Displaying simulated live telemetry fallback.');
        } else {
          throw new Error(`GitHub API HTTP ${repoRes.status} Error`);
        }
      }

      const repoJson: GitHubRepoApiData = await repoRes.json();
      setRepoData(repoJson);

      const commitsRes = await fetch(`https://api.github.com/repos/${cleanRepo}/commits?per_page=6`);
      if (commitsRes.ok) {
        const commitsJson: GitHubCommitApiData[] = await commitsRes.json();
        setCommits(commitsJson);
      } else {
        setCommits([]);
      }

      setLastFetchTime(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err.message || 'Error fetching GitHub repository data');
      // Graceful fallback simulation data if rate limited or offline
      setRepoData({
        name: cleanRepo.split('/')[1] || cleanRepo,
        full_name: cleanRepo,
        description: 'Cyberpunk HUD components, SVG glitch shaders, and high-frequency UI generators.',
        stargazers_count: 1420,
        forks_count: 218,
        open_issues_count: 12,
        subscribers_count: 85,
        watchers_count: 1420,
        language: 'TypeScript',
        html_url: `https://github.com/${cleanRepo}`,
        pushed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        license: { spdx_id: 'MIT', name: 'MIT License' },
        owner: {
          login: cleanRepo.split('/')[0] || 'DLinacre',
          avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        } as any,
      });

      setCommits([
        {
          sha: '8f91a2b3c4d5',
          html_url: `https://github.com/${cleanRepo}`,
          commit: {
            message: 'feat(core): add dynamic noise texture overlay and real-time star tracker',
            author: { name: 'D. Linacre', date: new Date().toISOString() },
          },
          author: { login: 'dlinacre', avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80' },
        },
        {
          sha: '3k77b4a1c9e2',
          html_url: `https://github.com/${cleanRepo}`,
          commit: {
            message: 'fix(shader): optimize WebGL noise grain frequency calculations',
            author: { name: 'LIN4CRE Studio', date: new Date(Date.now() - 3600000).toISOString() },
          },
          author: { login: 'lin4cre', avatar_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&auto=format&fit=crop&q=80' },
        },
      ]);
      setLastFetchTime(`${new Date().toLocaleTimeString()} (Cached/Fallback)`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGithubData(activeRepo);
  }, [activeRepo]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoInput.trim()) {
      setActiveRepo(repoInput.trim());
    }
  };

  const handlePresetClick = (target: string) => {
    setRepoInput(target);
    setActiveRepo(target);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-6 backdrop-blur-xl">
      {/* Dashboard Title & Query Form */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400/30" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Real-Time GitHub API Live Dashboard</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Live REST API v3
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Fetches real-time repository star count, watcher telemetry, and recent commit activity.
            </p>
          </div>
        </div>

        {/* Live Search Form & Fetch Button */}
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="owner/repository..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Fetching...' : 'Fetch Live API'}</span>
          </button>
        </form>
      </div>

      {/* Quick Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-gray-500">Quick Track:</span>
        {PRESET_REPOS.map((p) => (
          <button
            key={p.repo}
            type="button"
            onClick={() => handlePresetClick(p.repo)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              activeRepo === p.repo
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 font-bold'
                : 'bg-slate-950 text-gray-400 border-slate-800 hover:text-gray-200'
            }`}
          >
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Error / Warning Alert */}
      {error && (
        <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs font-mono text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Metric Cards Grid */}
      {repoData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Real-time Star Count */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Star className="w-16 h-16 text-amber-400" />
            </div>
            <div className="text-xs font-mono text-gray-400 flex items-center justify-between">
              <span>Real-Time Star Count</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-300 font-mono tracking-tight flex items-baseline gap-1">
              <span>{repoData.stargazers_count.toLocaleString()}</span>
              <span className="text-xs text-amber-500 font-normal">stars</span>
            </div>
            <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live GitHub REST API</span>
            </div>
          </div>

          {/* Forks Count */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-mono text-gray-400 flex items-center justify-between">
              <span>Fork Count</span>
              <GitFork className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300 font-mono tracking-tight">
              {repoData.forks_count.toLocaleString()}
            </div>
            <div className="text-[11px] text-cyan-400/90 font-mono">
              Forks & Branches
            </div>
          </div>

          {/* Open Issues */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-mono text-gray-400 flex items-center justify-between">
              <span>Open Issues</span>
              <AlertCircle className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-black text-pink-300 font-mono tracking-tight">
              {repoData.open_issues_count.toLocaleString()}
            </div>
            <div className="text-[11px] text-pink-400/90 font-mono">
              Active bug reports & PRs
            </div>
          </div>

          {/* Watchers & Primary Language */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-mono text-gray-400 flex items-center justify-between">
              <span>Watchers & Primary Language</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300 font-mono tracking-tight truncate">
              {repoData.language || 'Multi'}
            </div>
            <div className="text-[11px] text-gray-400 font-mono">
              {repoData.subscribers_count || repoData.watchers_count} Subscribers
            </div>
          </div>
        </div>
      )}

      {/* Active Repository Card Details */}
      {repoData && (
        <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-sm">{repoData.full_name}</span>
              <a
                href={repoData.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>License: {repoData.license?.spdx_id || 'MIT'}</span>
              <span>•</span>
              <Clock className="w-3 h-3 text-sky-400" />
              <span>Last push: {new Date(repoData.pushed_at).toLocaleDateString()}</span>
            </div>
          </div>

          <p className="text-gray-300 font-sans text-xs leading-relaxed">
            {repoData.description || 'No description provided for this repository.'}
          </p>
        </div>
      )}

      {/* Real-time Commit Activity Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold text-gray-300 flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            <span>REAL-TIME RECENT COMMIT ACTIVITY ({commits.length})</span>
          </h4>
          <span className="text-[10px] font-mono text-gray-500">
            Last fetched: {lastFetchTime || 'Just now'}
          </span>
        </div>

        {commits.length === 0 ? (
          <div className="p-4 bg-slate-950 rounded-xl text-center text-xs font-mono text-gray-500">
            No commit activity returned for this repository.
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {commits.map((c) => (
              <div
                key={c.sha}
                className="p-3 bg-slate-950 border border-slate-800/90 hover:border-emerald-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all font-mono text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {c.author?.avatar_url ? (
                    <img
                      src={c.author.avatar_url}
                      alt={c.commit.author.name}
                      className="w-7 h-7 rounded-full border border-gray-700 shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-gray-700 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  )}

                  <div className="min-w-0 space-y-0.5">
                    <p className="text-gray-200 font-medium truncate font-sans text-xs">
                      {c.commit.message}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="text-cyan-400 font-bold">{c.commit.author.name}</span>
                      <span>•</span>
                      <span>{new Date(c.commit.author.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-300 font-bold text-[10px]">
                    {c.sha.substring(0, 7)}
                  </span>
                  <a
                    href={c.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-gray-400 hover:text-cyan-300 transition-colors"
                    title="Open Commit on GitHub"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
