import React, { useState } from 'react';
import { OAuthConnectedAccount, RepoItem } from '../types';
import {
  Github,
  Star,
  GitCommit,
  Flame,
  TrendingUp,
  RefreshCw,
  Calendar,
  CheckCircle2,
  Award,
  BarChart3,
  Sparkles,
  GitFork
} from 'lucide-react';

interface GitHubContributionDashboardProps {
  accounts: OAuthConnectedAccount[];
  repos: RepoItem[];
}

export const GitHubContributionDashboard: React.FC<GitHubContributionDashboardProps> = ({
  accounts,
  repos,
}) => {
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Filter repos based on selected user
  const targetRepos = repos.filter((r) => {
    if (selectedUser === 'all') return true;
    return r.account === selectedUser;
  });

  // Calculate total stars across target repos
  const totalStars = targetRepos.reduce((acc, r) => acc + r.stars, 0);
  const totalForks = targetRepos.reduce((acc, r) => acc + (r.forksCount || 0), 0);
  const topStarredRepo = [...targetRepos].sort((a, b) => b.stars - a.stars)[0] || repos[0];

  // Generate mock 52-week contribution heat map data (7 rows x 52 columns = 364 days)
  // Seeded intensity levels (0: none, 1: low, 2: medium, 3: high, 4: max)
  const generateContributionWeeks = () => {
    const weeks = [];
    const seed = selectedUser === 'dlinacre' ? 12 : selectedUser === 'lin4cre' ? 24 : 36;
    let totalContribs = 0;

    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        // Pseudo-random deterministic level for visual authenticity
        const value = Math.sin(w * 0.4 + d * 0.7 + seed) * 10 + Math.cos(w * 0.2 + seed) * 5;
        let level = 0;
        let count = 0;

        if (value > 8) {
          level = 4;
          count = Math.floor(value) + 4;
        } else if (value > 4) {
          level = 3;
          count = Math.floor(value) + 2;
        } else if (value > 1) {
          level = 2;
          count = Math.floor(value);
        } else if (value > -2) {
          level = 1;
          count = 1;
        }

        totalContribs += count;
        days.push({ level, count });
      }
      weeks.push(days);
    }

    return { weeks, totalContribs };
  };

  const { weeks, totalContribs } = generateContributionWeeks();

  // Mock API Fetch Handler
  const handleFetchLatestActivity = () => {
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      const timeStr = new Date().toLocaleTimeString();
      setLastSyncTime(timeStr);
      setSyncToast(`Fetched GraphQL API v4 contribution metrics for ${selectedUser === 'all' ? 'All Accounts' : `@${selectedUser}`}`);
      setTimeout(() => setSyncToast(null), 3500);
    }, 600);
  };

  const getCellColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-emerald-400 border-emerald-300 shadow-sm shadow-emerald-400/50';
      case 3:
        return 'bg-emerald-600 border-emerald-500';
      case 2:
        return 'bg-emerald-800 border-emerald-700';
      case 1:
        return 'bg-emerald-950/80 border-emerald-900';
      default:
        return 'bg-slate-950 border-slate-900';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-6">
      
      {/* Top Header & Account Filter */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Github className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>GitHub Contribution Graph & Repo Metrics</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                GraphQL v4 Mock API
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Live contribution heatmap matrix, repository star analytics, and active commit streak monitoring.
            </p>
          </div>
        </div>

        {/* Controls & Sync Button */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            <option value="all">All Accounts ({accounts.length})</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.username}>
                @{acc.username} ({acc.displayName})
              </option>
            ))}
          </select>

          <button
            onClick={handleFetchLatestActivity}
            disabled={isFetching}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-slate-950 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>{isFetching ? 'Fetching API...' : 'Fetch Latest Activity'}</span>
          </button>
        </div>
      </div>

      {/* Sync Toast Alert */}
      {syncToast && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Key Metric Highlights Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Contributions */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Total Contributions</span>
            <GitCommit className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {totalContribs.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400/90 font-mono">
            In past 12 months (52 weeks)
          </div>
        </div>

        {/* Metric 2: Total Star Count */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Repository Star Count</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono tracking-tight flex items-center gap-1">
            <span>{totalStars.toLocaleString()}</span>
            <span className="text-xs font-normal text-amber-500 font-mono">stars</span>
          </div>
          <div className="text-[11px] text-amber-400/90 font-mono">
            Across {targetRepos.length} public repos ({totalForks} forks)
          </div>
        </div>

        {/* Metric 3: Active Streak */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Active Commit Streak</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-300 font-mono tracking-tight">
            34 Days
          </div>
          <div className="text-[11px] text-orange-400/90 font-mono">
            Longest streak: 89 days
          </div>
        </div>

        {/* Metric 4: Top Starred Repo */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Top Starred Repo</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-cyan-300 font-mono truncate">
            {topStarredRepo.name}
          </div>
          <div className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
            <span className="text-amber-300">★ {topStarredRepo.stars}</span>
            <span>•</span>
            <span className="text-cyan-400">{topStarredRepo.language}</span>
          </div>
        </div>
      </div>

      {/* Contribution Heatmap Visualization Box */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-gray-400 gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-gray-200">52-Week GitHub Contribution Activity Graph</span>
            <span className="text-[10px] text-gray-500">
              (Last synced: {lastSyncTime})
            </span>
          </div>
          
          {/* Intensity Legend */}
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-950 border border-slate-900 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-900 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-800 border border-emerald-700 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 border border-emerald-500 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 border border-emerald-300 inline-block"></span>
            <span>More</span>
          </div>
        </div>

        {/* 52-Week Matrix Scrollable Container */}
        <div className="overflow-x-auto scrollbar-thin pb-2">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1 min-w-[700px]">
            {weeks.map((week, wIdx) =>
              week.map((day, dIdx) => (
                <div
                  key={`${wIdx}-${dIdx}`}
                  title={`Week ${wIdx + 1}, Day ${dIdx + 1}: ${day.count} contributions`}
                  className={`w-2.5 h-2.5 rounded-xs border transition-all hover:scale-125 cursor-pointer ${getCellColor(
                    day.level
                  )}`}
                />
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
