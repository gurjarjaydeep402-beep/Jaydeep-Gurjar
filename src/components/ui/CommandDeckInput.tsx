import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  Bot,
  ChevronDown,
  CornerDownLeft,
  FileCode,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Plus,
  Radio,
  Send,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AstraLogo } from '../AstraLogo';

interface CommandDeckInputProps {
  onSubmit: (prompt: string) => void;
  onAttach?: () => void;
  onVoiceToggle?: () => void;
  onQuickAction?: (action: string) => void;
  isVoiceActive?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * ASTRA Central OS Command Deck Input
 * The primary neuro-symbolic command interface for the ASTRA OS.
 * Features:
 * - Active model indicator (Gemini 2.5 Flash / Pro Auto-Routing)
 * - Deep multi-layered glass surface with ambient border glow
 * - Attachment context dispatch
 * - Voice acoustic audio trigger
 * - Integrated execution button with keyboard (Enter) listener
 */
export function CommandDeckInput({
  onSubmit,
  onAttach,
  onVoiceToggle,
  onQuickAction,
  isVoiceActive = false,
  placeholder = 'Instruct ASTRA OS... (e.g. "Build a financial agent", "Audit smart contracts")',
  className = '',
}: CommandDeckInputProps) {
  const [value, setValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('Gemini 2.5 Auto');
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto adjust height up to 160px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const models = [
    { id: 'gemini-auto', name: 'Gemini 2.5 Auto', badge: 'Fast · Reasoning', provider: 'Google' },
    { id: 'gemini-pro', name: 'Gemini 2.5 Pro', badge: 'Deep Logic · Coding', provider: 'Google' },
    { id: 'gemini-flash', name: 'Gemini 2.5 Flash', badge: 'Ultra Latency', provider: 'Google' },
  ];

  return (
    <div className={`relative w-full max-w-4xl mx-auto select-none ${className}`}>
      {/* Outer ambient glow field on focus */}
      <div
        className={`absolute -inset-1 rounded-3xl transition-opacity duration-300 blur-xl pointer-events-none ${
          isFocused
            ? 'opacity-70 bg-gradient-to-r from-cyan-500/25 via-indigo-500/20 to-violet-500/25'
            : 'opacity-20 bg-gradient-to-r from-cyan-500/10 via-transparent to-indigo-500/10'
        }`}
      />

      {/* Main Glass Command Chassis */}
      <div
        className={`
          relative rounded-2xl sm:rounded-3xl
          bg-[#060c28]/90 backdrop-blur-2xl
          border transition-all duration-200
          ${
            isFocused
              ? 'border-cyan-400/60 shadow-[0_0_35px_rgba(34,211,238,0.22)]'
              : 'border-white/[0.12] hover:border-white/[0.22] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          }
        `}
        style={{
          boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Top Control Bar: Active Model Selector & System Telemetry */}
        <div className="flex items-center justify-between px-3 sm:px-5 pt-3 pb-1 border-b border-white/[0.06] text-xs">
          {/* Model Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsModelMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all text-xs font-mono"
            >
              <AstraLogo size={14} glow={false} />
              <span className="font-semibold text-cyan-300">{selectedModel}</span>
              <ChevronDown size={12} className="opacity-60" />
            </button>

            {isModelMenuOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl bg-[#081232]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] p-1.5 z-50">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1">
                  Active Intelligence Engine
                </div>
                {models.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(m.name);
                      setIsModelMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      selectedModel === m.name
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
                        : 'text-slate-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{m.name}</div>
                      <div className="text-[10px] text-slate-400">{m.badge}</div>
                    </div>
                    {selectedModel === m.name && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Real-time Assistant State */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              <span>Astra Engine 4.5 Online</span>
            </span>
          </div>
        </div>

        {/* Center: Command Textarea */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4">
          <textarea
            ref={textareaRef}
            rows={2}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-slate-400 resize-none outline-none leading-relaxed font-sans selection:bg-cyan-500/30 selection:text-cyan-200"
            style={{ minHeight: '48px' }}
          />

          {/* Bottom Action Deck */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.04]">
            {/* Attachment & Tool Input Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={onAttach}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-colors"
                title="Add Context / Document"
                aria-label="Add Context Document"
              >
                <Plus size={17} className="text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={onVoiceToggle}
                className={`p-2 rounded-xl transition-all ${
                  isVoiceActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10'
                }`}
                title="Acoustic Voice Control"
                aria-label="Acoustic Voice Control"
              >
                <Mic size={17} className={isVoiceActive ? 'text-rose-400 animate-pulse' : 'text-slate-300'} />
              </button>

              <button
                type="button"
                onClick={() => onQuickAction && onQuickAction('code')}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-colors"
                title="Code Mode"
              >
                <FileCode size={13} className="text-cyan-400" />
                <span>Code</span>
              </button>

              <button
                type="button"
                onClick={() => onQuickAction && onQuickAction('image')}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono text-slate-300 hover:text-fuchsia-300 hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-colors"
                title="Image Studio"
              >
                <ImageIcon size={13} className="text-fuchsia-400" />
                <span>Studio</span>
              </button>
            </div>

            {/* Execute Command Button */}
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex text-[11px] font-mono text-slate-500 items-center gap-1">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 text-[10px]">
                  ↵
                </kbd>
                <span>to dispatch</span>
              </span>

              <button
                type="submit"
                disabled={!value.trim()}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold
                  transition-all duration-200 select-none
                  ${
                    value.trim()
                      ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white shadow-[0_0_24px_rgba(34,211,238,0.4)] hover:brightness-110 active:scale-95 cursor-pointer'
                      : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                  }
                `}
                aria-label="Dispatch Command to ASTRA"
              >
                <span>Execute</span>
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
