import { useState, useEffect, useRef } from 'react';
import {
  Activity,
  AlertCircle,
  Archive,
  ArrowDown,
  ArrowUp,
  Bot,
  BrainCircuit,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Filter,
  Flame,
  FolderGit2,
  GitBranch,
  GitCommit,
  GitMerge,
  Globe,
  Layers,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Rocket,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
  User,
  X,
  Zap,
} from 'lucide-react';
import type { AstraProject } from '../lib/projectTypes';
import type { ActivityType, ActivityStatus, ProjectActivityItem } from '../lib/activityTypes';
import {
  generateSimulatedRealtimeEvent,
  generateInitialHistoryForProject,
  getStoredActivities,
  persistActivities,
} from '../lib/activityTypes';

interface ProjectActivityLogProps {
  project: AstraProject;
  onNotify: (msg: string) => void;
  onNavigateToVcs?: () => void;
  onNavigateToCode?: () => void;
  onClose?: () => void;
}

export function ProjectActivityLog({
  project,
  onNotify,
  onNavigateToVcs,
  onNavigateToCode,
  onClose,
}: ProjectActivityLogProps) {
  // Activities state
  const [activities, setActivities] = useState<ProjectActivityItem[]>(() => {
    const all = getStoredActivities([project]);
    const filtered = all.filter((a) => a.projectId === project.id);
    return filtered.length > 0 ? filtered : generateInitialHistoryForProject(project);
  });

  // Real-time tracking toggle
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [liveEventsCount, setLiveEventsCount] = useState(0);
  const [latestLiveEvent, setLatestLiveEvent] = useState<ProjectActivityItem | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ActivityStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expandedActivityIds, setExpandedActivityIds] = useState<string[]>([]);
  const [isCustomEventModalOpen, setIsCustomEventModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom Event Form State
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customType, setCustomType] = useState<ActivityType>('commit');
  const [customStatus, setCustomStatus] = useState<ActivityStatus>('success');
  const [customBranch, setCustomBranch] = useState(project.currentBranch || 'main');

  // Sync to persistence when activities change
  useEffect(() => {
    const allStored = getStoredActivities([project]);
    // Replace current project's activities while keeping others
    const otherProjectsActivities = allStored.filter((a) => a.projectId !== project.id);
    const merged = [...activities, ...otherProjectsActivities];
    persistActivities(merged);
  }, [activities, project.id]);

  // Real-time auto-streaming simulation
  useEffect(() => {
    if (!isLiveActive) return;

    // Stream a new simulated event every 14 seconds
    const interval = setInterval(() => {
      const newEvent = generateSimulatedRealtimeEvent(project);
      setActivities((prev) => [newEvent, ...prev]);
      setLiveEventsCount((prev) => prev + 1);
      setLatestLiveEvent(newEvent);

      // Auto-clear banner after 6 seconds
      setTimeout(() => {
        setLatestLiveEvent((current) => (current?.id === newEvent.id ? null : current));
      }, 6000);
    }, 14000);

    return () => clearInterval(interval);
  }, [isLiveActive, project]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onNotify('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle expanded card
  const toggleExpand = (id: string) => {
    setExpandedActivityIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Manual Trigger: Commit
  const handleTriggerCommit = () => {
    const hex = Math.random().toString(16).substring(2, 9);
    const newCommit: ProjectActivityItem = {
      id: `act-${project.id}-commit-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      type: 'commit',
      title: `commit ${hex}: update components & reactive hooks`,
      description: `Committed changes to branch '${project.currentBranch || 'main'}'. Auto-generated checksum and staging manifest.`,
      timestamp: Date.now(),
      author: { name: 'You (Active Developer)', role: 'Owner' },
      branch: project.currentBranch || 'main',
      commitHash: hex,
      status: 'success',
      metadata: {
        filesCount: 3,
        linesAdded: 84,
        linesRemoved: 12,
        diffSnippet: `+  export function useProjectTelemetry() {\n+    const [metrics, setMetrics] = useState(null);\n+    return { metrics, isConnected: true };\n+  }`,
        tags: ['Git', 'Manual Commit'],
      },
      isRealtime: true,
    };
    setActivities((prev) => [newCommit, ...prev]);
    setLiveEventsCount((prev) => prev + 1);
    setLatestLiveEvent(newCommit);
    onNotify(`Simulated Git commit ${hex} pushed!`);
  };

  // Manual Trigger: Deployment
  const handleTriggerDeploy = () => {
    const deployId = `act-${project.id}-deploy-${Date.now()}`;
    const newDeploy: ProjectActivityItem = {
      id: deployId,
      projectId: project.id,
      projectName: project.name,
      type: 'deploy',
      title: `Production Edge Deployment Triggered`,
      description: `Container build queued on Asia-Southeast cluster with zero-downtime rolling update.`,
      timestamp: Date.now(),
      author: { name: 'Astra Cloud Run', role: 'DevOps Agent' },
      branch: project.currentBranch || 'main',
      status: 'success',
      metadata: {
        environment: 'production',
        deployUrl: `https://${project.id}.astra.run`,
        executionTimeMs: 1820,
        tags: ['Deploy', 'Edge', 'Zero-Downtime'],
      },
      isRealtime: true,
    };
    setActivities((prev) => [newDeploy, ...prev]);
    setLiveEventsCount((prev) => prev + 1);
    setLatestLiveEvent(newDeploy);
    onNotify(`Deployment to production edge initiated!`);
  };

  // Manual Trigger: AI Code Review
  const handleTriggerAiReview = () => {
    const model = project.modelEngine || 'gemini-3.5-flash';
    const newAiEvent: ProjectActivityItem = {
      id: `act-${project.id}-ai-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      type: 'ai_code',
      title: `${model} Generated Automated Architecture Review`,
      description: `Audited 18 files. Verified memory leaks, async race conditions, and Tailwind class consistency. No critical warnings found.`,
      timestamp: Date.now(),
      author: { name: model, role: 'AI Assistant' },
      branch: project.currentBranch || 'main',
      status: 'success',
      metadata: {
        modelEngine: model,
        executionTimeMs: 740,
        testSummary: '18 files inspected · 0 critical alerts · 1 minor refactor suggested',
        tags: ['Gemini', 'Code Audit', 'Clean'],
      },
      isRealtime: true,
    };
    setActivities((prev) => [newAiEvent, ...prev]);
    setLiveEventsCount((prev) => prev + 1);
    setLatestLiveEvent(newAiEvent);
    onNotify(`AI code review audit logged!`);
  };

  // Manual Trigger: CI Test Run
  const handleTriggerTest = () => {
    const newTest: ProjectActivityItem = {
      id: `act-${project.id}-test-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      type: 'build_test',
      title: `Automated Test Runner Executed (All Passed)`,
      description: `Executed unit, typecheck, and integration tests across 24 test suites. 100% assertions green.`,
      timestamp: Date.now(),
      author: { name: 'Astra CI Bot', role: 'Automated CI' },
      branch: project.currentBranch || 'main',
      status: 'success',
      metadata: {
        testSummary: '24 suites · 58 specs passed in 2.18s',
        executionTimeMs: 2180,
        tags: ['Tests', 'CI/CD', 'Passing'],
      },
      isRealtime: true,
    };
    setActivities((prev) => [newTest, ...prev]);
    setLiveEventsCount((prev) => prev + 1);
    setLatestLiveEvent(newTest);
    onNotify(`Test suite run completed and logged!`);
  };

  // Create custom event handler
  const handleCreateCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const customItem: ProjectActivityItem = {
      id: `act-${project.id}-custom-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      type: customType,
      title: customTitle.trim(),
      description: customDesc.trim() || 'Custom operational event logged manually.',
      timestamp: Date.now(),
      author: { name: 'You (Developer)', role: 'Admin' },
      branch: customBranch.trim() || project.currentBranch || 'main',
      status: customStatus,
      isRealtime: true,
      metadata: {
        tags: ['Custom Event', customType],
      },
    };

    setActivities((prev) => [customItem, ...prev]);
    setLiveEventsCount((prev) => prev + 1);
    setLatestLiveEvent(customItem);
    setIsCustomEventModalOpen(false);
    setCustomTitle('');
    setCustomDesc('');
    onNotify(`Custom activity event logged!`);
  };

  // Reset sample history
  const handleResetHistory = () => {
    const sample = generateInitialHistoryForProject(project);
    setActivities(sample);
    setLiveEventsCount(0);
    setLatestLiveEvent(null);
    onNotify(`Reset activity history to default showcase log.`);
  };

  // Export as JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(activities, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-activity-log.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Exported project activity log as JSON!');
  };

  // Filtered & Sorted activities
  const filteredActivities = activities
    .filter((item) => {
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.commitHash && item.commitHash.toLowerCase().includes(q)) ||
        (item.branch && item.branch.toLowerCase().includes(q)) ||
        item.author.name.toLowerCase().includes(q);
      return matchesType && matchesStatus && matchesSearch;
    })
    .sort((a, b) => (sortOrder === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp));

  // Metrics summary
  const totalCount = activities.length;
  const commitsCount = activities.filter((a) => a.type === 'commit').length;
  const deploysCount = activities.filter((a) => a.type === 'deploy').length;
  const aiEventsCount = activities.filter((a) => a.type === 'ai_code').length;

  // Render type icon & colors
  const getTypeConfig = (type: ActivityType) => {
    switch (type) {
      case 'commit':
        return {
          icon: GitCommit,
          color: 'text-cyan-300',
          bg: 'bg-cyan-500/20 border-cyan-500/40',
          badgeText: 'Commit',
        };
      case 'deploy':
        return {
          icon: Rocket,
          color: 'text-emerald-300',
          bg: 'bg-emerald-500/20 border-emerald-500/40',
          badgeText: 'Deployment',
        };
      case 'ai_code':
        return {
          icon: BrainCircuit,
          color: 'text-purple-300',
          bg: 'bg-purple-500/20 border-purple-500/40',
          badgeText: 'AI Core',
        };
      case 'build_test':
        return {
          icon: CheckCircle2,
          color: 'text-teal-300',
          bg: 'bg-teal-500/20 border-teal-500/40',
          badgeText: 'Build / CI',
        };
      case 'merge':
        return {
          icon: GitMerge,
          color: 'text-indigo-300',
          bg: 'bg-indigo-500/20 border-indigo-500/40',
          badgeText: 'Merge',
        };
      case 'branch':
        return {
          icon: GitBranch,
          color: 'text-sky-300',
          bg: 'bg-sky-500/20 border-sky-500/40',
          badgeText: 'Branch',
        };
      case 'status_change':
        return {
          icon: ShieldCheck,
          color: 'text-amber-300',
          bg: 'bg-amber-500/20 border-amber-500/40',
          badgeText: 'Status',
        };
      case 'file_edit':
        return {
          icon: Code2,
          color: 'text-blue-300',
          bg: 'bg-blue-500/20 border-blue-500/40',
          badgeText: 'File Edit',
        };
      default:
        return {
          icon: Activity,
          color: 'text-slate-300',
          bg: 'bg-slate-500/20 border-slate-500/40',
          badgeText: 'System',
        };
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 1000 * 60) return 'Just now';
    if (diff < 1000 * 60 * 60) {
      const mins = Math.floor(diff / (1000 * 60));
      return `${mins}m ago`;
    }
    if (diff < 1000 * 60 * 60 * 24) {
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      return `${hrs}h ago`;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days}d ago`;
  };

  return (
    <div className="space-y-5 animate-fade-in select-text">
      {/* Top Banner: Project Title & Real-Time Status Toggle */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#070e2a] via-[#09153b] to-[#04091e] border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {project.category}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <GitBranch size={13} className="text-cyan-400" />
              <span>{project.currentBranch || 'main'}</span>
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize ${
                project.status === 'deployed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : project.status === 'archived'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              ● {project.status}
            </span>
          </div>

          <h3 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
            <Activity size={22} className="text-cyan-400" />
            <span>Activity Log & Telemetry Stream</span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time update listener & audit timeline for{' '}
            <strong className="text-cyan-200">{project.name}</strong>
          </p>
        </div>

        {/* Right Action Controls: Live Stream Toggle & Simulator buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Live Stream Switch Button */}
          <button
            onClick={() => {
              setIsLiveActive(!isLiveActive);
              onNotify(
                !isLiveActive
                  ? 'Connected: Listening for real-time project updates'
                  : 'Paused live real-time event listener'
              );
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              isLiveActive
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isLiveActive ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
              {isLiveActive && (
                <span className="absolute w-4 h-4 rounded-full bg-emerald-400/50 animate-ping" />
              )}
            </div>
            <span>{isLiveActive ? 'Live Stream: Active' : 'Live Stream: Paused'}</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportJson}
            title="Export activity history as JSON"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Reset / Reseed Button */}
          <button
            onClick={handleResetHistory}
            title="Reset to default sample activities"
            className="p-2 rounded-xl text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <RefreshCw size={13} />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Metric Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#060c24]/90 border border-cyan-500/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Total Events</span>
            <span className="text-base font-bold text-white">{totalCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#060c24]/90 border border-cyan-500/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
            <Rocket size={18} />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Deployments</span>
            <span className="text-base font-bold text-emerald-300">{deploysCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#060c24]/90 border border-cyan-500/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
            <BrainCircuit size={18} />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">AI Operations</span>
            <span className="text-base font-bold text-purple-300">{aiEventsCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#060c24]/90 border border-cyan-500/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
            <GitCommit size={18} />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Commits Logged</span>
            <span className="text-base font-bold text-indigo-300">{commitsCount}</span>
          </div>
        </div>
      </div>

      {/* Simulator Toolbar: Trigger Real-time Events */}
      <div className="p-3.5 rounded-2xl bg-[#050b20]/80 border border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400" />
          <span className="text-xs font-bold text-white">Simulate Real-Time Event:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={handleTriggerCommit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-500/30 transition-all hover:scale-[1.02]"
          >
            <GitCommit size={13} />
            <span>Simulate Commit</span>
          </button>

          <button
            onClick={handleTriggerDeploy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/30 transition-all hover:scale-[1.02]"
          >
            <Rocket size={13} />
            <span>Trigger Deploy</span>
          </button>

          <button
            onClick={handleTriggerAiReview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 border border-purple-500/30 transition-all hover:scale-[1.02]"
          >
            <BrainCircuit size={13} />
            <span>AI Code Audit</span>
          </button>

          <button
            onClick={handleTriggerTest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium bg-teal-500/15 hover:bg-teal-500/25 text-teal-200 border border-teal-500/30 transition-all hover:scale-[1.02]"
          >
            <CheckCircle2 size={13} />
            <span>Run Tests</span>
          </button>

          <button
            onClick={() => setIsCustomEventModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 hover:brightness-110 transition-all"
          >
            <Plus size={13} />
            <span>Custom Event</span>
          </button>
        </div>
      </div>

      {/* Live Incoming Event Alert Banner */}
      {latestLiveEvent && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-[#07193b] to-indigo-950/80 border border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.3)] animate-pulse flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
              <Zap size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/40">
                  Incoming Live Event
                </span>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>
              <p className="text-xs font-bold text-white mt-0.5">{latestLiveEvent.title}</p>
            </div>
          </div>
          <button
            onClick={() => setLatestLiveEvent(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#060c24]/90 p-3 rounded-2xl border border-cyan-500/20 text-xs">
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'commit', label: 'Commits' },
            { id: 'deploy', label: 'Deploys' },
            { id: 'ai_code', label: 'AI Operations' },
            { id: 'build_test', label: 'Tests / CI' },
            { id: 'merge', label: 'Merges' },
            { id: 'branch', label: 'Branches' },
            { id: 'status_change', label: 'Status' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
                selectedType === cat.id
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs, hashes..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#091230] border border-cyan-500/20 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/50"
            />
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            title={sortOrder === 'desc' ? 'Showing newest first' : 'Showing oldest first'}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center gap-1 text-[11px]"
          >
            {sortOrder === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Main Historical Activity Stream */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#060c24]/50 border border-white/5 text-center space-y-2.5">
            <Activity size={32} className="mx-auto text-slate-600" />
            <h4 className="text-sm font-semibold text-slate-300">No activity events found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No historical logs match your search or category filter. Try clearing filters or simulate a new event.
            </p>
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-xs font-semibold border border-cyan-500/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="relative pl-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/40 before:via-indigo-500/25 before:to-transparent space-y-4">
            {filteredActivities.map((act) => {
              const { icon: TypeIcon, color, bg, badgeText } = getTypeConfig(act.type);
              const isExpanded = expandedActivityIds.includes(act.id);

              return (
                <div key={act.id} className="relative group">
                  {/* Timeline dot / icon */}
                  <div
                    className={`absolute -left-6 top-3 w-6 h-6 rounded-full flex items-center justify-center border shadow-md ${bg} group-hover:scale-110 transition-transform`}
                  >
                    <TypeIcon size={12} className={color} />
                  </div>

                  {/* Card Container */}
                  <div
                    onClick={() => toggleExpand(act.id)}
                    className={`p-4 rounded-2xl bg-[#060c24]/90 border transition-all cursor-pointer ${
                      act.isRealtime
                        ? 'border-cyan-400/60 bg-[#071333]/90 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                        : 'border-white/5 hover:border-cyan-500/30 hover:bg-[#071131]/80'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase font-semibold border ${bg} ${color}`}
                        >
                          {badgeText}
                        </span>

                        {act.branch && (
                          <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            <GitBranch size={11} />
                            <span>{act.branch}</span>
                          </span>
                        )}

                        {act.commitHash && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(act.commitHash!, act.id);
                            }}
                            className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10 hover:border-cyan-400 transition-colors"
                          >
                            <GitCommit size={11} className="text-cyan-400" />
                            <span>{act.commitHash}</span>
                            {copiedId === act.id ? (
                              <Check size={11} className="text-emerald-400" />
                            ) : (
                              <Copy size={11} className="text-slate-500" />
                            )}
                          </div>
                        )}

                        {act.metadata?.environment && (
                          <span className="text-[10px] font-mono text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase">
                            {act.metadata.environment}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-slate-500" />
                          <span>{act.author.name}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock size={12} className="text-slate-500" />
                          <span>{formatRelativeTime(act.timestamp)}</span>
                        </span>
                        <ChevronRight
                          size={14}
                          className={`text-slate-500 transition-transform ${
                            isExpanded ? 'rotate-90 text-cyan-400' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                      {act.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{act.description}</p>

                    {/* Expandable Details Section */}
                    {isExpanded && (
                      <div className="mt-3.5 pt-3.5 border-t border-white/10 space-y-3 animate-fade-in text-xs">
                        {/* Diff Snippet / Terminal log if present */}
                        {act.metadata?.diffSnippet && (
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                              <span className="flex items-center gap-1.5">
                                <Terminal size={12} className="text-cyan-400" />
                                <span>Code / Telemetry Diff</span>
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(act.metadata!.diffSnippet!, `${act.id}-diff`);
                                }}
                                className="hover:text-white flex items-center gap-1"
                              >
                                <Copy size={11} />
                                <span>Copy Diff</span>
                              </button>
                            </div>
                            <pre className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-cyan-200 overflow-x-auto whitespace-pre leading-relaxed">
                              {act.metadata.diffSnippet}
                            </pre>
                          </div>
                        )}

                        {/* Test Summary */}
                        {act.metadata?.testSummary && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-300">
                            <span className="flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-emerald-400" />
                              <span>{act.metadata.testSummary}</span>
                            </span>
                            {act.metadata.executionTimeMs && (
                              <span className="text-slate-400 font-mono">
                                {act.metadata.executionTimeMs}ms
                              </span>
                            )}
                          </div>
                        )}

                        {/* Deploy URL */}
                        {act.metadata?.deployUrl && (
                          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-[11px]">
                            <span className="flex items-center gap-2 text-cyan-300">
                              <Globe size={14} className="text-cyan-400" />
                              <span>Production URL:</span>
                              <a
                                href={act.metadata.deployUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="underline font-mono text-cyan-200 hover:text-white"
                              >
                                {act.metadata.deployUrl}
                              </a>
                            </span>
                            <ExternalLink size={12} className="text-slate-500" />
                          </div>
                        )}

                        {/* Tag Pills & Timestamps */}
                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {act.metadata?.tags?.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <span className="font-mono text-[10px] text-slate-500">
                            {new Date(act.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Event Creation Modal */}
      {isCustomEventModalOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsCustomEventModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#060c24] border border-cyan-500/35 p-6 shadow-[0_0_50px_rgba(34,211,238,0.25)] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus size={16} className="text-cyan-400" />
                  <span>Log Custom Project Event</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Emit an operational event directly into {project.name}'s real-time stream.
                </p>
              </div>
              <button
                onClick={() => setIsCustomEventModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Event Title</label>
                <input
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. feat: integrate OpenAI/Gemini dual routing"
                  className="w-full p-2.5 rounded-xl bg-[#08102e] border border-cyan-500/30 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Event Type</label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#08102e] border border-cyan-500/30 text-white outline-none"
                  >
                    <option value="commit">Git Commit</option>
                    <option value="deploy">Deployment</option>
                    <option value="ai_code">AI Code Synthesis</option>
                    <option value="build_test">Test / CI Run</option>
                    <option value="merge">Branch Merge</option>
                    <option value="branch">Branch Creation</option>
                    <option value="status_change">Status Change</option>
                    <option value="file_edit">File Modification</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Branch</label>
                  <input
                    value={customBranch}
                    onChange={(e) => setCustomBranch(e.target.value)}
                    placeholder="main"
                    className="w-full p-2.5 rounded-xl bg-[#08102e] border border-cyan-500/30 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Event Description & Details
                </label>
                <textarea
                  rows={3}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Detailed notes, error codes, commit highlights, or test results..."
                  className="w-full p-2.5 rounded-xl bg-[#08102e] border border-cyan-500/30 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-slate-950 hover:brightness-110 shadow-lg transition-all"
              >
                Emit Real-Time Event to Stream
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
