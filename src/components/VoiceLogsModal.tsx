import React, { useState } from 'react';
import {
  Compass,
  CornerDownLeft,
  History,
  MessageSquare,
  Mic,
  Play,
  RotateCw,
  Search,
  Sparkles,
  Trash2,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import type { VoiceCommandLog } from '../hooks/useVoiceNavigation';

interface VoiceLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: VoiceCommandLog[];
  onRetrigger: (command: string) => void;
  onClearLogs: () => void;
  isListening: boolean;
  onToggleListening: () => void;
}

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 15) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function VoiceLogsModal({
  isOpen,
  onClose,
  logs,
  onRetrigger,
  onClearLogs,
  isListening,
  onToggleListening,
}: VoiceLogsModalProps) {
  const [filterType, setFilterType] = useState<'all' | 'navigation' | 'prompt' | 'search'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'all') return true;
    return log.type === filterType;
  });

  const handleRun = (text: string, id: string) => {
    setCopiedId(id);
    onRetrigger(text);
    setTimeout(() => setCopiedId(null), 1000);
  };

  const sampleSuggestions = [
    { text: 'Go to Chat', type: 'navigation' },
    { text: 'Open Projects', type: 'navigation' },
    { text: 'Open Code Assistant', type: 'navigation' },
    { text: 'Open Image Studio', type: 'navigation' },
    { text: 'Ask ASTRA: Explain quantum superposition', type: 'prompt' },
    { text: 'Open Trading & Finance', type: 'navigation' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in select-none">
      {/* Outer Dismiss Click Target */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Main Glass Chamber Dialog */}
      <div
        className="w-full max-w-xl max-h-[88vh] rounded-3xl bg-[#040924]/95 border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(34,211,238,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] astra-glass-layer-2 flex flex-col overflow-hidden animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-logs-title"
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between bg-gradient-to-r from-[#061238] via-[#071542] to-[#061238]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-fuchsia-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <History size={18} />
            </div>
            <div>
              <h2 id="voice-logs-title" className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>Voice Logs & Telemetry</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {logs.length} Commands
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Hands-free speech history. Tap any previous voice command to re-trigger.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Voice Logs"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Microphone Status Banner */}
        <div className="px-5 py-3 bg-[#061033]/80 border-b border-cyan-500/15 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isListening ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              )}
            </span>
            <span className="font-mono text-slate-300">
              {isListening ? (
                <span className="text-rose-300 font-bold">Microphone Active (Listening...)</span>
              ) : (
                <span className="text-emerald-300">Voice Recognition Ready</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleListening}
              className={`px-3 py-1 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
              }`}
            >
              <Mic size={12} />
              <span>{isListening ? 'Stop Mic' : 'Start Mic'}</span>
            </button>

            {logs.length > 0 && (
              <button
                type="button"
                onClick={onClearLogs}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
                title="Clear all voice logs"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-5 pt-3 flex items-center gap-1.5 shrink-0">
          {(['all', 'navigation', 'prompt', 'search'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterType === tab
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Log Entries Viewport */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5 scrollbar-thin">
          {filteredLogs.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-3 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
                <Mic size={22} className="text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white">No Voice Logs Recorded Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Speak a command like "Go to Chat", "Open Code", or "Ask ASTRA..." or tap any suggested trigger below.
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isRecent = Date.now() - log.timestamp < 1000 * 60;
              const isCopied = copiedId === log.id;

              return (
                <div
                  key={log.id}
                  onClick={() => handleRun(log.text, log.id)}
                  className="group relative p-3.5 rounded-2xl bg-[#061033]/70 hover:bg-[#091747]/90 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_18px_rgba(34,211,238,0.2)]"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Icon Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        log.type === 'navigation'
                          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                          : log.type === 'prompt'
                          ? 'bg-fuchsia-950/80 border-fuchsia-500/40 text-fuchsia-300'
                          : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                      }`}
                    >
                      {log.type === 'navigation' ? (
                        <Compass size={16} />
                      ) : log.type === 'prompt' ? (
                        <Sparkles size={16} />
                      ) : (
                        <Search size={16} />
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors truncate font-sans">
                          "{log.text}"
                        </span>
                        {isRecent && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            NEW
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 mt-1 text-[11px] font-mono text-slate-400">
                        {log.target && (
                          <span className="text-cyan-300 font-semibold truncate">
                            → {log.target}
                          </span>
                        )}
                        <span>•</span>
                        <span>{formatRelativeTime(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Re-trigger Action Button */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRun(log.text, log.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500 text-white shadow-[0_0_12px_#10b981]'
                          : 'bg-cyan-500/20 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-white border border-cyan-400/30 group-hover:border-transparent shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      }`}
                    >
                      <RotateCw size={12} className={isCopied ? 'animate-spin' : ''} />
                      <span>{isCopied ? 'Running...' : 'Re-trigger'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Quick Trigger Suggestions */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#03081e]/90">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold tracking-wider flex items-center gap-1.5">
              <Zap size={12} className="text-amber-400" />
              <span>Tap to Test / Quick Triggers</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {sampleSuggestions.map((suggestion) => (
              <button
                key={suggestion.text}
                type="button"
                onClick={() => {
                  onRetrigger(suggestion.text);
                }}
                className="px-2.5 py-1 rounded-xl text-xs font-medium bg-[#061238] hover:bg-cyan-950 text-slate-300 hover:text-cyan-200 border border-cyan-500/25 hover:border-cyan-400/50 transition-all flex items-center gap-1 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              >
                <span>{suggestion.text}</span>
                <CornerDownLeft size={10} className="text-cyan-400 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
