import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useCredits } from '../lib/CreditContext';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  Clock,
  Code2,
  Command,
  CornerDownLeft,
  FileText,
  FolderGit2,
  Gamepad2,
  Globe,
  GraduationCap,
  History,
  Home,
  Image as ImageIcon,
  LayoutGrid,
  Megaphone,
  Mic2,
  Network,
  Play,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import type { WorkspaceId } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: WorkspaceId) => void;
}

export interface CommandItem {
  id: WorkspaceId;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  category: string;
}

const COMMANDS: CommandItem[] = [
  { id: 'home', label: 'Command Deck', desc: 'Main ASTRA OS overview, status and central command input', icon: Home, category: 'Core OS' },
  { id: 'chat', label: 'ASTRA Chat', desc: 'Reasoning, analysis, generative synthesis and complex problem solving', icon: Bot, category: 'Intelligence' },
  { id: 'developer-ji', label: 'Developer Ji', desc: 'Autonomous AI engineer, self-healing code, AST diffs and checkpoints', icon: Bot, category: 'Engineering' },
  { id: 'coding', label: 'Code Assistant', desc: 'Full-stack polyglot coding, refactoring, test suites and audits', icon: Code2, category: 'Engineering' },
  { id: 'projects', label: 'Projects & Forge', desc: 'Autonomous application generator, project records and builds', icon: FolderGit2, category: 'Engineering' },
  { id: 'image-generator', label: 'Image Studio', desc: 'High-fidelity cinematic visuals and spatial artwork', icon: ImageIcon, category: 'Studios' },
  { id: 'video-generator', label: 'Video Studio', desc: 'Generative video scenes, keyframe direction and motion synthesis', icon: Play, category: 'Studios' },
  { id: 'audio', label: 'Voice Engine', desc: 'Neural voice cloning, speech synthesis and acoustic analysis', icon: Mic2, category: 'Studios' },
  { id: 'app-factory', label: 'App Factory', desc: 'Production-ready web and mobile apps from concept to deployment', icon: LayoutGrid, category: 'Studios' },
  { id: 'website-factory', label: 'Website Factory', desc: 'Modern responsive landing pages and commercial portals', icon: Globe, category: 'Studios' },
  { id: 'game-factory', label: 'Game Factory', desc: 'Playable 2D, retro arcade and physics simulations', icon: Gamepad2, category: 'Studios' },
  { id: 'research', label: 'Deep Research Agent', desc: 'Multi-source synthesis, web crawling and verified citations', icon: Search, category: 'Intelligence' },
  { id: 'files', label: 'Files & Vector RAG', desc: 'Codebase, markdown and dataset semantic retrieval', icon: FileText, category: 'Productivity' },
  { id: 'connectors', label: 'Cloud Connectors', desc: '22 verified server adapters: Google Workspace, GitHub, Firebase', icon: ShieldCheck, category: 'System' },
  { id: 'market', label: 'Trading & Finance', desc: 'Live market data, BTC, NIFTY 50, indicators and algorithmic signals', icon: BarChart3, category: 'Finance' },
  { id: 'affiliate', label: 'Marketing & Monetization', desc: 'Viral copywriting, automated campaigns and growth engines', icon: Megaphone, category: 'Growth' },
  { id: 'providers', label: 'AI Models Hub', desc: 'Inspect OpenAI, Gemini, Claude, ElevenLabs & HuggingFace', icon: Network, category: 'System' },
  { id: 'control', label: 'Control Hub & Admin', desc: 'System diagnostics, credit ledgers, promo manager and RBAC', icon: Settings, category: 'System' },
];

interface RecentCommandItem {
  id: WorkspaceId;
  timestamp: number;
}

const RECENT_COMMANDS_KEY = 'astra_recent_commands_v1';
const MAX_RECENT_COMMANDS = 6;

function loadRecentCommands(): RecentCommandItem[] {
  try {
    const raw = localStorage.getItem(RECENT_COMMANDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item) => item && typeof item.id === 'string' && typeof item.timestamp === 'number'
      );
    }
  } catch {
    // ignore parsing errors
  }
  return [];
}

function saveRecentCommands(items: RecentCommandItem[]) {
  try {
    localStorage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [recentCommands, setRecentCommands] = useState<RecentCommandItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { userRole } = useCredits();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sync recent commands from local storage on mount / open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setRecentCommands(loadRecentCommands());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Execute a command, record to recent history, and close
  const executeCommand = useCallback(
    (id: WorkspaceId) => {
      setRecentCommands((prev) => {
        const next: RecentCommandItem[] = [
          { id, timestamp: Date.now() },
          ...prev.filter((p) => p.id !== id),
        ].slice(0, MAX_RECENT_COMMANDS);
        saveRecentCommands(next);
        return next;
      });

      onNavigate(id);
      onClose();
    },
    [onNavigate, onClose]
  );

  // Clear all recent history
  const handleClearHistory = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentCommands([]);
    try {
      localStorage.removeItem(RECENT_COMMANDS_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Remove a single recent command
  const handleRemoveRecentItem = useCallback((e: React.MouseEvent, id: WorkspaceId) => {
    e.stopPropagation();
    setRecentCommands((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveRecentCommands(next);
      return next;
    });
  }, []);

  // Allowed commands based on role
  const allowedCommands = useMemo(() => {
    return COMMANDS.filter((c) => {
      if (c.id === 'developer-ji') return userRole === 'OWNER';
      if (c.id === 'control') return userRole === 'OWNER' || userRole === 'ADMIN';
      return true;
    });
  }, [userRole]);

  // Hydrated recent command items
  const recentCommandItems = useMemo(() => {
    return recentCommands
      .map((r) => {
        const cmd = allowedCommands.find((c) => c.id === r.id);
        if (!cmd) return null;
        return {
          ...cmd,
          timestamp: r.timestamp,
        };
      })
      .filter(Boolean) as (CommandItem & { timestamp: number })[];
  }, [recentCommands, allowedCommands]);

  // Filtered commands when searching
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const recentIdSet = new Set(recentCommands.map((r) => r.id));

    const matches = allowedCommands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );

    // Prioritize commands that are in recent history
    return matches.sort((a, b) => {
      const aIsRecent = recentIdSet.has(a.id) ? 1 : 0;
      const bIsRecent = recentIdSet.has(b.id) ? 1 : 0;
      return bIsRecent - aIsRecent;
    });
  }, [query, allowedCommands, recentCommands]);

  // Compute the flat list of actionable commands currently visible for keyboard navigation
  const flatVisibleCommands: CommandItem[] = useMemo(() => {
    if (query.trim()) {
      return searchResults;
    }
    // When no search query: recent commands first, then remaining commands
    const recentIds = new Set(recentCommandItems.map((r) => r.id));
    const otherCommands = allowedCommands.filter((c) => !recentIds.has(c.id));
    return [...recentCommandItems, ...otherCommands];
  }, [query, searchResults, recentCommandItems, allowedCommands]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex((prev) => {
      if (flatVisibleCommands.length === 0) return 0;
      return Math.min(prev, flatVisibleCommands.length - 1);
    });
  }, [flatVisibleCommands.length]);

  // Scroll selected item into view
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const selectedEl = listEl.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatVisibleCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatVisibleCommands.length) % Math.max(1, flatVisibleCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = flatVisibleCommands[selectedIndex];
      if (current) {
        executeCommand(current.id);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  const isSearching = query.trim().length > 0;
  const recentIdSet = new Set(recentCommands.map((r) => r.id));

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-start justify-center pt-[9vh] px-4 animate-fade-in select-none"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#050b24]/95 border border-cyan-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(34,211,238,0.22)] overflow-hidden backdrop-blur-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.16), 0 25px 70px -15px rgba(0, 0, 0, 0.9)',
        }}
      >
        {/* Top Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-cyan-500/20 bg-gradient-to-r from-[#07133a]/90 via-[#0a1848]/85 to-[#081238]/90">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
            <Search size={16} />
          </div>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Execute command, re-run action, or jump to workspace..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder:text-slate-400 outline-none selection:bg-cyan-500/30 selection:text-cyan-200 font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div
          ref={listRef}
          className="max-h-[58vh] overflow-y-auto p-2.5 space-y-3 scrollbar-thin"
        >
          {/* STATE 1: SEARCH ACTIVE */}
          {isSearching ? (
            searchResults.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center text-slate-400">
                  <Search size={20} />
                </div>
                <div className="text-sm font-semibold text-slate-300">
                  No matching commands for "{query}"
                </div>
                <p className="text-xs text-slate-500">
                  Try searching for tools like "Chat", "Code", "Image", "Video", or "Connectors".
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="px-3 py-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span>Matching Commands ({searchResults.length})</span>
                </div>
                {searchResults.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = selectedIndex === idx;
                  const isRecent = recentIdSet.has(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-index={idx}
                      onClick={() => executeCommand(item.id)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`
                        w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group cursor-pointer border
                        ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] text-white'
                            : 'hover:bg-white/[0.04] border-transparent text-slate-300 hover:text-white'
                        }
                      `}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                          isSelected
                            ? 'bg-gradient-to-br from-cyan-400 to-indigo-600 text-white shadow-[0_0_12px_rgba(34,211,238,0.5)] scale-105'
                            : 'bg-[#0b173e] text-cyan-300 border border-cyan-500/20 group-hover:border-cyan-400/40'
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {item.label}
                          </span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-[10px] font-mono text-cyan-400/80">
                            {item.category}
                          </span>
                          {isRecent && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                              <History size={10} />
                              <span>Recent</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/40">
                            <span>Run</span>
                            <CornerDownLeft size={11} />
                          </span>
                        ) : (
                          <ArrowRight
                            size={14}
                            className="text-slate-600 group-hover:text-cyan-400 transition-colors"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            /* STATE 2: DEFAULT VIEW WITH PERSISTED RECENT COMMANDS */
            <>
              {/* SECTION A: RECENT COMMANDS HISTORY */}
              {recentCommandItems.length > 0 && (
                <div className="space-y-1.5 pb-2 border-b border-cyan-500/15">
                  <div className="px-3 py-1 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                      <Clock size={13} className="text-cyan-400 animate-pulse" />
                      <span>Recent Commands</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                        {recentCommandItems.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-rose-300 transition-colors px-2 py-0.5 rounded hover:bg-rose-500/10 cursor-pointer"
                      title="Clear recent command history"
                    >
                      <Trash2 size={11} />
                      <span>Clear</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 px-1">
                    {recentCommandItems.map((item, idx) => {
                      const Icon = item.icon;
                      const isSelected = selectedIndex === idx;

                      return (
                        <div
                          key={`recent-${item.id}`}
                          data-index={idx}
                          onClick={() => executeCommand(item.id)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`
                            relative flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all duration-150 group cursor-pointer overflow-hidden
                            ${
                              isSelected
                                ? 'bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-cyan-950/50 border-cyan-400/60 shadow-[0_0_18px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/40'
                                : 'bg-[#071133]/70 hover:bg-[#0c1c4d]/85 border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_4px_14px_rgba(0,0,0,0.3)]'
                            }
                          `}
                        >
                          {/* Accent glow corner */}
                          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                              isSelected
                                ? 'bg-gradient-to-br from-cyan-400 to-fuchsia-600 text-white scale-105 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                                : 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-300'
                            }`}
                          >
                            <Icon size={16} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-white truncate group-hover:text-cyan-200 transition-colors">
                                {item.label}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 shrink-0">
                                {formatRelativeTime(item.timestamp)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-mono text-cyan-300/80 truncate">
                                {item.category}
                              </span>
                              <span aria-hidden="true" className="text-slate-600">·</span>
                              <span className="text-[10px] text-slate-400 truncate">
                                Click to re-run
                              </span>
                            </div>
                          </div>

                          {/* Quick Remove Button */}
                          <button
                            type="button"
                            onClick={(e) => handleRemoveRecentItem(e, item.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-300 hover:bg-rose-500/20 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                            title="Remove from history"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION B: ALL AVAILABLE COMMANDS */}
              <div className="space-y-1 pt-1">
                <div className="px-3 py-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span>Available Commands ({allowedCommands.length})</span>
                  <span className="text-[10px] font-mono text-slate-500">All Modules</span>
                </div>

                {allowedCommands.map((item) => {
                  const Icon = item.icon;
                  // Index in the flatVisibleCommands array
                  const itemIndex = flatVisibleCommands.findIndex((cmd) => cmd.id === item.id);
                  const isSelected = selectedIndex === itemIndex;
                  const isRecent = recentIdSet.has(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-index={itemIndex}
                      onClick={() => executeCommand(item.id)}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`
                        w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left transition-all duration-150 group cursor-pointer border
                        ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] text-white'
                            : 'hover:bg-white/[0.04] border-transparent text-slate-300 hover:text-white'
                        }
                      `}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                          isSelected
                            ? 'bg-gradient-to-br from-cyan-400 to-indigo-600 text-white shadow-[0_0_10px_rgba(34,211,238,0.5)] scale-105'
                            : 'bg-[#081232] text-cyan-300 border border-cyan-500/20 group-hover:border-cyan-400/40'
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {item.label}
                          </span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-[10px] font-mono text-cyan-400/80">
                            {item.category}
                          </span>
                          {isRecent && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                              Recent
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/40">
                            <span>Run</span>
                            <CornerDownLeft size={11} />
                          </span>
                        ) : (
                          <ArrowRight
                            size={14}
                            className="text-slate-600 group-hover:text-cyan-400 transition-colors"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer with Keyboard Hints & Recent Indicator */}
        <div className="px-4 py-2.5 bg-[#030718] border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-300">
              <Command size={12} className="text-cyan-400" />
              <span>ASTRA Command Registry</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-400">
              <History size={11} className="text-indigo-400" />
              <span>Persisted History Active</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">↵</kbd>
              <span>Execute</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">ESC</kbd>
              <span>Dismiss</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
