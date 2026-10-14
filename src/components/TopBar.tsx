import React from 'react';
import {
  Bell,
  Command,
  Maximize2,
  Menu,
  Minus,
  Search,
  X as CloseIcon,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useCredits } from '../lib/CreditContext';
import { VoiceVisualizerPill } from './VoiceVisualizerPill';

interface TopBarProps {
  onMenuToggle: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onHomeClick: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  voiceProps?: {
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
    audioLevel: number;
    isSupported: boolean;
    onToggle: () => void;
    onStop: () => void;
    onOpenLogs?: () => void;
    logsCount?: number;
  };
}

/**
 * ASTRA Master Top Bar
 * Reconstructed to match the exact ASTRA reference image:
 * - Left: "One Assistant · Infinite Possibilities"
 * - Center: Rounded Search Pill "Search anything... (Ctrl + K)" + Web Speech API Pulsing Visualizer
 * - Right: Notification Bell (with badge), Window controls (- [] x), User chip "JG Jay Gurjar ● Online"
 */
export function TopBar({
  onMenuToggle,
  onOpenSearch,
  onOpenNotifications,
  onOpenAuth,
  voiceProps,
}: TopBarProps) {
  const { currentUser, userProfile } = useAuth();
  const displayName = currentUser?.displayName || userProfile?.displayName || 'Jay Gurjar';

  return (
    <header className="h-[64px] shrink-0 border-b border-cyan-500/20 bg-[#02071d]/75 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6 relative z-30 select-none shadow-[0_4px_30px_rgba(0,0,0,0.5),inset_0_-1px_0_rgba(34,211,238,0.1)]">
      {/* Left: Tagline & Mobile Toggle */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-300 tracking-wide font-sans">
          <span>One Assistant</span>
          <span className="text-cyan-400 font-bold">·</span>
          <span className="text-slate-200">Infinite Possibilities</span>
        </div>
      </div>

      {/* Center: Large Rounded Search Pill & Web Speech API Pulsing Visualizer */}
      <div className="flex-1 max-w-lg mx-3 sm:mx-6 flex items-center justify-center gap-2">
        {voiceProps?.isListening ? (
          <VoiceVisualizerPill
            isListening={voiceProps.isListening}
            transcript={voiceProps.transcript}
            interimTranscript={voiceProps.interimTranscript}
            audioLevel={voiceProps.audioLevel}
            isSupported={voiceProps.isSupported}
            onToggle={voiceProps.onToggle}
            onStop={voiceProps.onStop}
            onOpenLogs={voiceProps.onOpenLogs}
            logsCount={voiceProps.logsCount}
          />
        ) : (
          <>
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex-1 flex items-center justify-between px-4 py-2 rounded-full bg-[#070e28]/70 hover:bg-[#0a153c]/80 border border-indigo-500/30 hover:border-cyan-400/50 text-xs sm:text-sm text-slate-400 hover:text-slate-200 transition-all shadow-[0_2px_15px_rgba(0,0,0,0.4)] group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search size={15} className="text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate">Search anything...</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                (Ctrl + K)
              </span>
            </button>

            {voiceProps && (
              <VoiceVisualizerPill
                isListening={false}
                transcript=""
                interimTranscript=""
                audioLevel={0}
                isSupported={voiceProps.isSupported}
                onToggle={voiceProps.onToggle}
                onStop={voiceProps.onStop}
                onOpenLogs={voiceProps.onOpenLogs}
                logsCount={voiceProps.logsCount}
              />
            )}
          </>
        )}
      </div>

      {/* Right: Notifications, Window Controls & User Identity */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Notification Bell with Badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white shadow-[0_0_8px_#f43f5e]">
            1
          </span>
        </button>

        {/* Window controls (Min, Max, Close) matching reference */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 text-slate-400">
          <button
            type="button"
            className="p-1 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
            title="Minimize"
          >
            <Minus size={13} />
          </button>
          <button
            type="button"
            className="p-1 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
            title="Maximize"
          >
            <Maximize2 size={12} />
          </button>
          <button
            type="button"
            className="p-1 hover:text-rose-400 hover:bg-white/[0.06] rounded transition-colors"
            title="Close"
          >
            <CloseIcon size={13} />
          </button>
        </div>

        {/* User Profile Pill */}
        <button
          type="button"
          onClick={() => onOpenAuth('login')}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-[#081232]/60 hover:bg-[#0c1a4d]/80 border border-white/[0.08] hover:border-cyan-400/40 transition-all cursor-pointer"
        >
          {/* Avatar JG */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)] border border-cyan-300/40">
            JG
          </div>

          <div className="text-left text-xs leading-none">
            <div className="font-semibold text-white truncate max-w-[100px]">
              {displayName}
            </div>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              <span>Online</span>
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
