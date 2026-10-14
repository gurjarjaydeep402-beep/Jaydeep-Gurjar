import React from 'react';
import { History, Mic, MicOff, Volume2, X } from 'lucide-react';

interface VoiceVisualizerPillProps {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  audioLevel: number; // 0 to 100
  isSupported: boolean;
  onToggle: () => void;
  onStop: () => void;
  onOpenLogs?: () => void;
  logsCount?: number;
}

export function VoiceVisualizerPill({
  isListening,
  transcript,
  interimTranscript,
  audioLevel,
  isSupported,
  onToggle,
  onStop,
  onOpenLogs,
  logsCount = 0,
}: VoiceVisualizerPillProps) {
  if (!isSupported) {
    return null;
  }

  // Active listening state with pulsing cosmic visualizer
  if (isListening) {
    const currentText = interimTranscript || transcript || 'Listening... Say "Go to Chat" or "Ask ASTRA..."';

    return (
      <div
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#050c26]/95 border border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] astra-glass-layer-3 animate-fade-in z-40 max-w-xs sm:max-w-md md:max-w-lg transition-all"
        style={{
          boxShadow: '0 0 25px rgba(34, 211, 238, 0.35), inset 0 0 12px rgba(217, 70, 239, 0.25)',
        }}
      >
        {/* Pulsing Recording Beacon */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
          </span>
          <span className="text-[10px] font-mono font-bold text-rose-300 hidden sm:inline tracking-wider">
            VOICE
          </span>
        </div>

        {/* Dynamic Pulsing Frequency Equalizer Bars */}
        <div className="flex items-center gap-[3px] h-5 px-1 shrink-0">
          {[0.6, 1.1, 0.8, 1.4, 0.9, 1.3, 0.7, 1.0].map((factor, idx) => {
            // Compute dynamic height based on audioLevel and multiplier
            const baseLevel = Math.max(15, audioLevel);
            const computedHeight = Math.min(
              20,
              Math.max(4, Math.round((baseLevel / 100) * 18 * factor))
            );

            const gradients = [
              'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
              'bg-indigo-400 shadow-[0_0_8px_#818cf8]',
              'bg-purple-400 shadow-[0_0_8px_#c084fc]',
              'bg-fuchsia-400 shadow-[0_0_8px_#e879f9]',
              'bg-pink-400 shadow-[0_0_8px_#f472b6]',
              'bg-cyan-300 shadow-[0_0_8px_#67e8f9]',
              'bg-emerald-400 shadow-[0_0_8px_#34d399]',
              'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
            ];

            return (
              <span
                key={idx}
                className={`w-[3px] rounded-full transition-all duration-75 ease-out ${gradients[idx % gradients.length]}`}
                style={{
                  height: `${computedHeight}px`,
                }}
              />
            );
          })}
        </div>

        {/* Live Transcript / Prompt Preview */}
        <div className="min-w-0 flex-1 truncate">
          <p className="text-xs text-cyan-200 font-sans truncate font-medium">
            {currentText}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {onOpenLogs && (
            <button
              type="button"
              onClick={onOpenLogs}
              className="p-1 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer"
              title="Open Voice Command Logs"
              aria-label="Open Voice Logs"
            >
              <History size={14} />
            </button>
          )}

          {/* Stop Listening Button */}
          <button
            type="button"
            onClick={onStop}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Stop Listening"
            aria-label="Stop Listening"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Idle trigger button group in top navigation bar
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#070e28]/70 hover:bg-[#0a153c]/90 border border-cyan-500/30 hover:border-cyan-400/60 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-[0_2px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] group cursor-pointer"
        title="Voice Command (Web Speech API) - Say 'Go to Chat', 'Open Projects', or 'Ask ASTRA...'"
        aria-label="Activate Voice Command"
      >
        <div className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 group-hover:text-cyan-200 transition-all">
          <Mic size={12} />
        </div>
        <span className="hidden md:inline font-sans text-xs tracking-wide">
          Voice
        </span>
      </button>

      {onOpenLogs && (
        <button
          type="button"
          onClick={onOpenLogs}
          className="relative p-1.5 rounded-full bg-[#070e28]/70 hover:bg-[#0a153c]/90 border border-cyan-500/25 hover:border-cyan-400/50 text-slate-400 hover:text-cyan-200 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.3)] cursor-pointer"
          title="Voice Logs & History - Tap past commands to re-trigger"
          aria-label="Open Voice Logs"
        >
          <History size={14} />
          {logsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-500 text-[8px] font-mono font-bold text-black shadow-[0_0_6px_#22d3ee]">
              {logsCount > 9 ? '9+' : logsCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
