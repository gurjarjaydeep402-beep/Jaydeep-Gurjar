import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Copy,
  FileCode,
  FileDiff,
  FolderGit2,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Plus,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Tag,
  Trash2,
} from 'lucide-react';
import type { BranchItem, CommitItem } from '../../lib/vcsTypes';

interface VersionControlWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

const INITIAL_BRANCHES: BranchItem[] = [
  { name: 'main', isDefault: true, lastCommitHash: 'a7f9c2d', updatedAt: Date.now() - 1000 * 60 * 15 },
  { name: 'feature/neural-voice-agent', isDefault: false, lastCommitHash: '8b3e10f', updatedAt: Date.now() - 1000 * 60 * 60 },
  { name: 'experiment/quantum-router', isDefault: false, lastCommitHash: '3d51aa2', updatedAt: Date.now() - 1000 * 60 * 180 },
];

const INITIAL_COMMITS: CommitItem[] = [
  {
    id: 'c1',
    hash: 'a7f9c2d',
    branch: 'main',
    author: 'Jay Gurjar',
    message: 'feat(core): stabilize multi-agent execution pipeline & telemetry',
    timestamp: Date.now() - 1000 * 60 * 15,
    filesChanged: 4,
    tags: ['v1.4.0', 'stable'],
    diffPreview: `+ import { AstraAgentRouter } from '@/lib/agents';
+ export const router = new AstraAgentRouter({ concurrency: 16 });
- const legacyQueue = [];`,
  },
  {
    id: 'c2',
    hash: '8b3e10f',
    branch: 'feature/neural-voice-agent',
    author: 'Jay Gurjar',
    message: 'feat(audio): add ElevenLabs WebSocket streaming and voice cloning buffer',
    timestamp: Date.now() - 1000 * 60 * 60,
    filesChanged: 3,
    diffPreview: `+ async function streamVoiceBuffer(sampleRate = 48000) {
+   const socket = new WebSocket('wss://api.elevenlabs.io/v1/stream');
+ }`,
  },
  {
    id: 'c3',
    hash: '5e4b901',
    branch: 'main',
    author: 'ASTRA Engine',
    message: 'refactor(auth): integrate Firebase Auth rules and encrypted user profile store',
    timestamp: Date.now() - 1000 * 60 * 120,
    filesChanged: 6,
    tags: ['security'],
    diffPreview: `+ match /users/{userId} {
+   allow read, write: if request.auth.uid == userId;
+ }`,
  },
  {
    id: 'c4',
    hash: '3d51aa2',
    branch: 'experiment/quantum-router',
    author: 'Jay Gurjar',
    message: 'perf: benchmark sub-10ms prompt routing with zero-alloc ring buffer',
    timestamp: Date.now() - 1000 * 60 * 180,
    filesChanged: 2,
    diffPreview: `+ class FastRingBuffer {
+   constructor(size = 1024) { this.buffer = new Uint8Array(size); }
+ }`,
  },
];

export function VersionControlWorkspace({ onBack, onNotify }: VersionControlWorkspaceProps) {
  const [branches, setBranches] = useState<BranchItem[]>(INITIAL_BRANCHES);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [commits, setCommits] = useState<CommitItem[]>(INITIAL_COMMITS);
  const [activeTab, setActiveTab] = useState<'history' | 'branches' | 'merge' | 'commit'>('history');

  // New commit input state
  const [commitMessage, setCommitMessage] = useState('');
  const [stagedFiles, setStagedFiles] = useState([
    'src/components/workspaces/ChatWorkspace.tsx',
    'src/lib/gemini.ts',
    'firestore.rules',
  ]);
  const [newBranchName, setNewBranchName] = useState('');
  const [mergeSource, setMergeSource] = useState('feature/neural-voice-agent');
  const [mergeTarget, setMergeTarget] = useState('main');
  const [selectedCommit, setSelectedCommit] = useState<CommitItem | null>(INITIAL_COMMITS[0]);

  // Create commit
  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;

    const newHash = Math.random().toString(16).substring(2, 9);
    const newCommit: CommitItem = {
      id: `c-${Date.now()}`,
      hash: newHash,
      branch: currentBranch,
      author: 'Jay Gurjar',
      message: commitMessage.trim(),
      timestamp: Date.now(),
      filesChanged: stagedFiles.length || 1,
      diffPreview: `+ // Committed on branch: ${currentBranch}\n+ // Message: ${commitMessage}\n+ // Files: ${stagedFiles.join(', ')}`,
    };

    setCommits([newCommit, ...commits]);
    setSelectedCommit(newCommit);
    setCommitMessage('');
    onNotify(`Commit ${newHash} created successfully on ${currentBranch}!`);
    setActiveTab('history');
  };

  // Create branch
  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newBranchName.trim().replace(/\s+/g, '-').toLowerCase();
    if (!clean) return;
    if (branches.some((b) => b.name === clean)) {
      onNotify(`Branch "${clean}" already exists.`);
      return;
    }

    const newBranch: BranchItem = {
      name: clean,
      isDefault: false,
      lastCommitHash: commits[0]?.hash || 'HEAD',
      updatedAt: Date.now(),
    };

    setBranches([...branches, newBranch]);
    setCurrentBranch(clean);
    setNewBranchName('');
    onNotify(`Switched to new branch "${clean}".`);
    setActiveTab('history');
  };

  // Merge branches
  const handleMerge = () => {
    if (mergeSource === mergeTarget) {
      onNotify('Source and target branches cannot be identical.');
      return;
    }

    const mergeHash = Math.random().toString(16).substring(2, 9);
    const mergeCommit: CommitItem = {
      id: `m-${Date.now()}`,
      hash: mergeHash,
      branch: mergeTarget,
      author: 'ASTRA Merge Bot',
      message: `Merge branch '${mergeSource}' into ${mergeTarget}`,
      timestamp: Date.now(),
      filesChanged: 5,
      tags: ['merge'],
      diffPreview: `+ // Successfully resolved & merged changes from ${mergeSource} into ${mergeTarget}\n+ // Automated zero-conflict merge performed by ASTRA VCS engine.`,
    };

    setCommits([mergeCommit, ...commits]);
    setCurrentBranch(mergeTarget);
    setSelectedCommit(mergeCommit);
    onNotify(`Successfully merged ${mergeSource} into ${mergeTarget}!`);
    setActiveTab('history');
  };

  const filteredCommits = commits.filter(
    (c) => activeTab !== 'history' || currentBranch === 'all' || c.branch === currentBranch || c.branch === 'main'
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in select-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderGit2 size={20} className="text-cyan-400" />
              ASTRA Version Control System (VCS)
            </h2>
            <p className="text-xs text-slate-400">
              Commit history, branching, automated diffs & intelligent multi-version merging
            </p>
          </div>
        </div>

        {/* Current Branch Selector Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091438] border border-cyan-500/30 text-xs">
            <GitBranch size={14} className="text-cyan-300" />
            <span className="text-slate-400">Branch:</span>
            <select
              value={currentBranch}
              onChange={(e) => {
                setCurrentBranch(e.target.value);
                onNotify(`Switched active working branch to ${e.target.value}`);
              }}
              className="bg-transparent text-white font-mono font-bold outline-none cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b.name} value={b.name} className="bg-[#060c24] text-white">
                  {b.name} {b.isDefault ? '(default)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveTab('commit')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
          >
            <GitCommit size={14} />
            <span>Commit Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2 text-xs">
        {[
          { id: 'history', label: 'Commit History', icon: Clock },
          { id: 'branches', label: 'Branches', icon: GitBranch },
          { id: 'merge', label: 'Merge & Pull Requests', icon: GitMerge },
          { id: 'commit', label: 'New Commit', icon: Plus },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Commit History + Diff Viewer */}
      {activeTab === 'history' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Commits List */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Commits on {currentBranch}</span>
              <span className="font-mono text-cyan-300">{filteredCommits.length} commits</span>
            </div>

            {filteredCommits.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCommit(c)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedCommit?.id === c.id
                    ? 'bg-[#0a1845] border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                    : 'bg-[#060c24]/90 border-white/5 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GitCommit size={14} className="text-cyan-400 shrink-0" />
                    <span className="font-mono text-xs text-cyan-200 font-bold">{c.hash}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs font-semibold text-white mt-1.5 line-clamp-1">{c.message}</p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                  <span className="text-slate-300">{c.author}</span>
                  <div className="flex items-center gap-1.5">
                    {c.tags?.map((t) => (
                      <span key={t} className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono">
                        {t}
                      </span>
                    ))}
                    <span className="font-mono text-[10px] text-emerald-400">+{c.filesChanged} files</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Diff & Snapshot Preview */}
          <div className="lg:col-span-7">
            {selectedCommit ? (
              <div className="rounded-2xl bg-[#060c24]/90 border border-cyan-500/25 p-5 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-cyan-300 font-bold">
                        commit {selectedCommit.hash}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-200 border border-cyan-500/25 font-mono">
                        {selectedCommit.branch}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white mt-1">{selectedCommit.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Authored by <strong className="text-slate-200">{selectedCommit.author}</strong> on{' '}
                      {new Date(selectedCommit.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedCommit.hash);
                      onNotify(`Commit hash ${selectedCommit.hash} copied to clipboard`);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                    title="Copy Commit SHA"
                  >
                    <Copy size={15} />
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      <FileDiff size={14} className="text-cyan-400" />
                      Diff Changeset ({selectedCommit.filesChanged} files modified)
                    </span>
                    <button
                      onClick={() => onNotify(`Reverted working tree to commit ${selectedCommit.hash}`)}
                      className="text-xs text-rose-300 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw size={12} />
                      <span>Revert to this snapshot</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-black/50 border border-cyan-500/20 text-xs font-mono text-cyan-100 overflow-x-auto leading-relaxed">
                    <code>{selectedCommit.diffPreview || '// No detailed diff recorded for this commit'}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">Select a commit from the left to inspect its diff.</div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Branches Management */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Project Branches ({branches.length})
            </h3>

            {branches.map((b) => (
              <div
                key={b.name}
                className="p-4 rounded-xl bg-[#060c24]/90 border border-white/5 hover:border-cyan-500/30 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <GitBranch
                    size={18}
                    className={b.name === currentBranch ? 'text-cyan-400' : 'text-slate-500'}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">{b.name}</span>
                      {b.isDefault && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          default
                        </span>
                      )}
                      {b.name === currentBranch && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          HEAD
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Last commit: <span className="font-mono text-cyan-300">{b.lastCommitHash}</span> · Updated{' '}
                      {new Date(b.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {b.name !== currentBranch && (
                    <button
                      onClick={() => {
                        setCurrentBranch(b.name);
                        onNotify(`Switched to branch ${b.name}`);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-200 transition-colors"
                    >
                      Checkout
                    </button>
                  )}
                  {!b.isDefault && (
                    <button
                      onClick={() => {
                        setBranches(branches.filter((x) => x.name !== b.name));
                        if (currentBranch === b.name) setCurrentBranch('main');
                        onNotify(`Deleted branch ${b.name}`);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete branch"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Create Branch Card */}
          <div className="p-5 rounded-2xl bg-[#060c24]/90 border border-cyan-500/25 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus size={15} className="text-cyan-400" />
              Create New Branch
            </h4>
            <p className="text-xs text-slate-300">
              Branch off <strong>{currentBranch}</strong> to isolate an experimental feature or AI agent flow.
            </p>

            <form onSubmit={handleCreateBranch} className="space-y-3">
              <input
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="e.g. feature/multimodal-tts"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08102e] border border-cyan-500/25 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 hover:brightness-110 transition-all"
              >
                Create & Switch Branch
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Merge & Pull Requests */}
      {activeTab === 'merge' && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#060c24]/90 border border-cyan-500/25 backdrop-blur-xl shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitMerge size={18} className="text-cyan-400" />
              Merge Branches
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Merge changes from one branch into another with automated conflict detection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Source Branch</label>
              <select
                value={mergeSource}
                onChange={(e) => setMergeSource(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#08102e] border border-cyan-500/30 text-xs text-white outline-none"
              >
                {branches.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Target Branch</label>
              <select
                value={mergeTarget}
                onChange={(e) => setMergeTarget(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#08102e] border border-cyan-500/30 text-xs text-white outline-none"
              >
                {branches.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2.5">
            <Check size={16} className="text-emerald-400 shrink-0" />
            <span>ASTRA automated pre-merge check: Able to merge cleanly. 0 conflicting files detected.</span>
          </div>

          <button
            onClick={handleMerge}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2"
          >
            <GitMerge size={16} />
            <span>Execute Merge into {mergeTarget}</span>
          </button>
        </div>
      )}

      {/* Tab 4: New Commit */}
      {activeTab === 'commit' && (
        <form
          onSubmit={handleCommit}
          className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#060c24]/90 border border-cyan-500/25 backdrop-blur-xl shadow-xl space-y-5"
        >
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitCommit size={18} className="text-cyan-400" />
              Stage & Commit on [{currentBranch}]
            </h3>
            <p className="text-xs text-slate-400 mt-1">Record a permanent snapshot of modified files.</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Commit Message</label>
            <textarea
              required
              rows={3}
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="e.g. feat(pipeline): implement real-time streaming parser with WebSocket fallback"
              className="w-full p-3 rounded-xl bg-[#08102e] border border-cyan-500/30 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Staged Files ({stagedFiles.length})
            </label>
            <div className="space-y-1.5">
              {stagedFiles.map((file) => (
                <div
                  key={file}
                  className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 text-xs font-mono text-cyan-200"
                >
                  <span className="flex items-center gap-2">
                    <FileCode size={13} className="text-cyan-400" />
                    {file}
                  </span>
                  <span className="text-[10px] text-emerald-400">modified</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white hover:brightness-110 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2"
          >
            <GitCommit size={16} />
            <span>Create Commit on {currentBranch}</span>
          </button>
        </form>
      )}
    </div>
  );
}
