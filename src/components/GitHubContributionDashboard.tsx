import React, { useState } from 'react';
import { OAuthConnectedAccount, RepoItem } from '../types';
import { GitHubRealtimeMiniDashboard } from './GitHubRealtimeMiniDashboard';
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
  GitFork,
  Activity,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

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
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [heatmapRange, setHeatmapRange] = useState<'3months' | '6months' | '1year'>('1year');
  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string;
    count: number;
    level: number;
    weekNum: number;
    dayName: string;
  } | null>(null);

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
  const generateContributionWeeks = () => {
    const weeks = [];
    const seed = selectedUser === 'dlinacre' ? 12 : selectedUser === 'lin4cre' ? 24 : 36;
    let totalContribs = 0;
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const today = new Date();
    // Start 364 days ago
    const startDate = new Date();
    startDate.setDate(today.getDate() - 363);

    let dayCounter = 0;

    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + dayCounter);
        dayCounter++;

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
        days.push({
          level,
          count,
          dateStr: currentDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          dayName: dayNames[currentDate.getDay()],
          weekNum: w + 1,
        });
      }
      weeks.push(days);
    }

    return { weeks, totalContribs };
  };

  const { weeks, totalContribs } = generateContributionWeeks();

  // Filter weeks by selected heatmap range
  const visibleWeeks =
    heatmapRange === '3months'
      ? weeks.slice(39)
      : heatmapRange === '6months'
      ? weeks.slice(26)
      : weeks;

  const visibleContribs = visibleWeeks.reduce(
    (acc, week) => acc + week.reduce((wAcc, day) => wAcc + day.count, 0),
    0
  );
  const totalDaysInRange = visibleWeeks.length * 7;
  const avgDailyContribs = (visibleContribs / (totalDaysInRange || 1)).toFixed(1);

  // Generate 30-day commit trend data for Recharts comparison
  const generateTrendData = () => {
    const data = [];
    const seed = selectedUser === 'dlinacre' ? 5 : selectedUser === 'lin4cre' ? 15 : 25;
    const now = new Date();

    let totalRecent = 0;
    let totalPrior = 0;

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Daily commit counts generated deterministically
      const recentCommits = Math.max(
        0,
        Math.floor(Math.sin(i * 0.5 + seed) * 6 + Math.cos(i * 0.3) * 4 + 7)
      );
      const priorCommits = Math.max(
        0,
        Math.floor(Math.sin(i * 0.4 + seed + 2) * 4 + Math.cos(i * 0.2) * 3 + 4)
      );

      totalRecent += recentCommits;
      totalPrior += priorCommits;

      data.push({
        date: dateLabel,
        'Last 30 Days (Current)': recentCommits,
        'Prior 30 Days (Previous)': priorCommits,
        'Rolling Avg': Math.round(((recentCommits + priorCommits) / 2) * 10) / 10,
      });
    }

    const velocityChange = Math.round(((totalRecent - totalPrior) / (totalPrior || 1)) * 100);

    return { data, totalRecent, totalPrior, velocityChange };
  };

  const { data: trendData, totalRecent, totalPrior, velocityChange } = generateTrendData();

  // Mock API Fetch Handler
  const handleFetchLatestActivity = () => {
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      const timeStr = new Date().toLocaleTimeString();
      setLastSyncTime(timeStr);
      setSyncToast(
        `Fetched GraphQL API v4 contribution metrics for ${
          selectedUser === 'all' ? 'All Accounts' : `@${selectedUser}`
        }`
      );
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
              Live contribution heatmap matrix, 30-day commit trend analytics, and active streak monitoring.
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

      {/* RECHARTS: 30-Day Repository Commit Frequency Trend Chart */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold font-mono text-white flex items-center gap-2">
              <span>30-Day Commit Frequency & Velocity Analysis</span>
              <span className="text-[10px] text-emerald-400 font-normal px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                Recharts Visualizer
              </span>
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-gray-400">30d Velocity:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded ${
                  velocityChange >= 0
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-950 text-red-300 border border-red-500/40'
                }`}
              >
                {velocityChange >= 0 ? `+${velocityChange}%` : `${velocityChange}%`} vs prior month
              </span>
            </div>

            {/* Chart type toggle */}
            <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg p-0.5">
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all ${
                  chartType === 'area'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Area Trend
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all ${
                  chartType === 'bar'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Bar Compare
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRecent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPrior" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="Last 30 Days (Current)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRecent)"
                />
                <Area
                  type="monotone"
                  dataKey="Prior 30 Days (Previous)"
                  stroke="#38bdf8"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  fillOpacity={1}
                  fill="url(#colorPrior)"
                />
              </AreaChart>
            ) : (
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} />
                <Bar dataKey="Last 30 Days (Current)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Prior 30 Days (Previous)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-gray-400 pt-2 border-t border-gray-800/80 gap-2">
          <span>
            Current Period Velocity: <strong className="text-emerald-400">{totalRecent} commits</strong>
          </span>
          <span>
            Prior Period Benchmark: <strong className="text-cyan-400">{totalPrior} commits</strong>
          </span>
          <span>
            Daily Velocity Average:{' '}
            <strong className="text-white">{(totalRecent / 30).toFixed(1)} commits / day</strong>
          </span>
        </div>
      </div>

      {/* Contribution Heatmap Visualization Box */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <div>
              <h4 className="font-bold text-gray-200 text-xs font-mono flex items-center gap-2">
                <span>GitHub Contribution Heatmap Grid</span>
                <span className="text-[10px] text-emerald-300 font-normal px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  {heatmapRange === '3months' ? 'Past 3 Months (13 Wks)' : heatmapRange === '6months' ? 'Past 6 Months (26 Wks)' : 'Past 1 Year (52 Wks)'}
                </span>
              </h4>
              <p className="text-[10px] text-gray-400 font-mono">
                {visibleContribs.toLocaleString()} contributions across {visibleWeeks.length} weeks (Avg: {avgDailyContribs}/day)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Time Range Selector Buttons */}
            <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setHeatmapRange('3months')}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all ${
                  heatmapRange === '3months'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                3 Months
              </button>
              <button
                type="button"
                onClick={() => setHeatmapRange('6months')}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all ${
                  heatmapRange === '6months'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                6 Months
              </button>
              <button
                type="button"
                onClick={() => setHeatmapRange('1year')}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all ${
                  heatmapRange === '1year'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                1 Year
              </button>
            </div>

            {/* Intensity Legend */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 pl-2 border-l border-gray-800">
              <span>Less</span>
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-950 border border-slate-900 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-950 border border-emerald-900 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-800 border border-emerald-700 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 border border-emerald-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 border border-emerald-300 inline-block"></span>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Hover Inspector HUD */}
        <div className="h-8 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-[11px] font-mono">
          {hoveredCell ? (
            <div className="flex items-center gap-3 text-emerald-300">
              <span className="font-bold text-white">{hoveredCell.dateStr} ({hoveredCell.dayName}):</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold">
                {hoveredCell.count} {hoveredCell.count === 1 ? 'contribution' : 'contributions'}
              </span>
              <span className="text-gray-400 text-[10px]">
                Intensity level: {hoveredCell.level}/4 • Week #{hoveredCell.weekNum}
              </span>
            </div>
          ) : (
            <span className="text-gray-500 text-[10px]">
              Hover over any square in the graph below to inspect detailed daily contribution counts & dates...
            </span>
          )}
          <span className="text-gray-500 text-[10px] hidden sm:inline">
            Last synced: {lastSyncTime}
          </span>
        </div>

        {/* Matrix Scrollable Container */}
        <div className="overflow-x-auto scrollbar-thin pb-2">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1 min-w-[300px]">
            {visibleWeeks.map((week, wIdx) =>
              week.map((day, dIdx) => (
                <div
                  key={`${wIdx}-${dIdx}`}
                  onMouseEnter={() =>
                    setHoveredCell({
                      dateStr: day.dateStr,
                      count: day.count,
                      level: day.level,
                      weekNum: day.weekNum,
                      dayName: day.dayName,
                    })
                  }
                  onMouseLeave={() => setHoveredCell(null)}
                  title={`${day.dateStr}: ${day.count} contributions`}
                  className={`w-3 h-3 rounded-xs border transition-all hover:scale-150 hover:z-10 cursor-pointer ${getCellColor(
                    day.level
                  )}`}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Real-time GitHub API Live Star & Commit Dashboard Section */}
      <GitHubRealtimeMiniDashboard defaultRepo="DLinacre/glitch-tech-ui" />
    </div>
  );
};

