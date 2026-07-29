import React, { useState } from 'react';
import { FolderNode, BrandProfile } from '../types';
import { GitBranch, GitCommit, GitPullRequest, GitMerge, Plus, Check, Clock, RotateCcw, ShieldCheck, Sparkles, FolderTree, Play } from 'lucide-react';
import { Tooltip } from './Tooltip';

export interface GitCommitRecord {
  id: string; // short SHA e.g. "a7b3c9f"
  hash: string;
  branch: string;
  author: string;
  message: string;
  timestamp: string;
  nodeSnapshot: FolderNode;
  totalFiles: number;
  totalFolders: number;
}

interface GitBranchingPanelProps {
  currentTree: FolderNode;
  onRestoreTreeSnapshot: (snapshot: FolderNode, commitMsg: string) => void;
  activeProfile: BrandProfile;
}

export const GitBranchingPanel: React.FC<GitBranchingPanelProps> = ({
  currentTree,
  onRestoreTreeSnapshot,
  activeProfile,
}) => {
  const [activeBranch, setActiveBranch] = useState<string>('main');
  const [branches, setBranches] = useState<string[]>(['main', 'v2-redesign', 'feature-3d-assets']);
  const [newBranchName, setNewBranchName] = useState<string>('');
  const [isCreatingBranch, setIsCreatingBranch] = useState<boolean>(false);
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Helper count nodes
  const countNodes = (node: FolderNode) => {
    let files = 0;
    let folders = 0;
    const traverse = (n: FolderNode) => {
      if (n.type === 'file') files++;
      if (n.type === 'folder') folders++;
      if (n.children) n.children.forEach(traverse);
    };
    traverse(node);
    return { files, folders };
  };

  const initialCounts = countNodes(currentTree);

  // Initial Commits History
  const [commitHistory, setCommitHistory] = useState<GitCommitRecord[]>([
    {
      id: 'a7b3c9f',
      hash: 'a7b3c9f42d1e8',
      branch: 'main',
      author: `@${activeProfile}`,
      message: 'Initial 🎨_folder architecture & asset specification setup',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
      nodeSnapshot: JSON.parse(JSON.stringify(currentTree)),
      totalFiles: initialCounts.files,
      totalFolders: initialCounts.folders,
    },
  ]);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Create commit
  const handleCreateCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;

    const shortId = Math.random().toString(16).substring(2, 9);
    const fullHash = `${shortId}${Math.random().toString(16).substring(2, 8)}`;
    const { files, folders } = countNodes(currentTree);

    const newCommit: GitCommitRecord = {
      id: shortId,
      hash: fullHash,
      branch: activeBranch,
      author: `@${activeProfile}`,
      message: commitMessage.trim(),
      timestamp: new Date().toLocaleTimeString(),
      nodeSnapshot: JSON.parse(JSON.stringify(currentTree)),
      totalFiles: files,
      totalFolders: folders,
    };

    setCommitHistory((prev) => [newCommit, ...prev]);
    setCommitMessage('');
    showFeedback(`Committed snapshot [${shortId}] to branch '${activeBranch}'!`);
  };

  // Create Branch
  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newBranchName.trim().toLowerCase().replace(/[\s_]+/g, '-');
    if (!cleanName || branches.includes(cleanName)) return;

    setBranches((prev) => [...prev, cleanName]);
    setActiveBranch(cleanName);
    setNewBranchName('');
    setIsCreatingBranch(false);

    // Create initial commit for new branch based on current tree
    const shortId = Math.random().toString(16).substring(2, 9);
    const { files, folders } = countNodes(currentTree);

    const branchCommit: GitCommitRecord = {
      id: shortId,
      hash: `${shortId}001`,
      branch: cleanName,
      author: `@${activeProfile}`,
      message: `Branch '${cleanName}' created from '${activeBranch}'`,
      timestamp: new Date().toLocaleTimeString(),
      nodeSnapshot: JSON.parse(JSON.stringify(currentTree)),
      totalFiles: files,
      totalFolders: folders,
    };

    setCommitHistory((prev) => [branchCommit, ...prev]);
    showFeedback(`Created and switched to new branch '${cleanName}'!`);
  };

  // Checkout / Restore Commit State
  const handleCheckoutCommit = (commit: GitCommitRecord) => {
    onRestoreTreeSnapshot(commit.nodeSnapshot, commit.message);
    setActiveBranch(commit.branch);
    showFeedback(`Restored folder state from commit [${commit.id}] on branch '${commit.branch}'!`);
  };

  const currentBranchCommits = commitHistory.filter((c) => c.branch === activeBranch);

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <GitBranch className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Git Branch & Revision History Simulator</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-400/30">
                Mock Version Control
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Track file changes, commit folder architecture snapshots, and switch branches to experiment with folder structures safely.
            </p>
          </div>
        </div>

        {/* Branch Switcher & New Branch Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={activeBranch}
              onChange={(e) => setActiveBranch(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-950 border border-gray-700 rounded-xl text-xs font-mono font-bold text-purple-300 focus:outline-none focus:border-purple-400 cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  git branch: {b}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsCreatingBranch((prev) => !prev)}
            className="px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Branch</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* New Branch Form */}
      {isCreatingBranch && (
        <form onSubmit={handleCreateBranch} className="p-4 bg-gray-950 rounded-xl border border-purple-800/80 space-y-3 animate-fadeIn">
          <div className="text-xs font-mono font-bold text-purple-300 flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-purple-400" />
            <span>Create New Branch from '{activeBranch}'</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Branch name (e.g. feature-v3-structure)..."
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              autoFocus
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              disabled={!newBranchName.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
            >
              Branch & Switch
            </button>
          </div>
        </form>
      )}

      {/* Commit Input Form */}
      <form onSubmit={handleCreateCommit} className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-gray-300 font-bold flex items-center gap-1.5">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            <span>Commit Current 🎨_folder State</span>
          </span>
          <span className="text-gray-500">
            Active: <strong className="text-purple-300">git branch --{activeBranch}</strong>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder={`Commit message (e.g., "feat: added bulk rename rules & vector icons")...`}
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="flex-1 px-3.5 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            disabled={!commitMessage.trim()}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-gray-950 text-xs font-mono font-black rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <GitCommit className="w-4 h-4" />
            <span>COMMIT CHANGES</span>
          </button>
        </div>
      </form>

      {/* Commit History Timeline Log */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5 font-bold text-gray-300">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>REVISION LOG ({commitHistory.length} Commits Total)</span>
          </span>
          <span>Showing branch: <strong className="text-purple-300">{activeBranch}</strong></span>
        </div>

        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 max-h-64 overflow-y-auto scrollbar-thin space-y-3">
          {commitHistory.length === 0 ? (
            <div className="text-xs font-mono text-gray-500 italic text-center py-4">
              No commit records found.
            </div>
          ) : (
            commitHistory.map((commit, idx) => (
              <div
                key={commit.id + idx}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  commit.branch === activeBranch
                    ? 'bg-slate-900/90 border-purple-500/40'
                    : 'bg-gray-900/60 border-gray-800 opacity-75'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700 font-bold">
                      commit {commit.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-400 border border-gray-800">
                      {commit.branch}
                    </span>
                    <span className="text-cyan-400 font-bold">{commit.author}</span>
                    <span className="text-gray-500 text-[11px]">{commit.timestamp}</span>
                  </div>

                  <div className="text-xs font-semibold text-gray-200">
                    {commit.message}
                  </div>

                  <div className="text-[11px] font-mono text-gray-500">
                    Snapshot payload: {commit.totalFolders} folders, {commit.totalFiles} files
                  </div>
                </div>

                <Tooltip content={`Restore folder layout to commit state ${commit.id}`} position="left">
                  <button
                    onClick={() => handleCheckoutCommit(commit)}
                    className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-purple-900 hover:text-purple-200 text-gray-300 border border-gray-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                    <span>Checkout</span>
                  </button>
                </Tooltip>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
