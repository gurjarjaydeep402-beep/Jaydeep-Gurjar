import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ToolIconContainer, ToolAccentColor } from './ToolIconContainer';

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  accent?: ToolAccentColor;
  status?: string;
  shortcut?: string;
  onClick: () => void;
  className?: string;
}

/**
 * ASTRA Unified Tool Card
 * High-precision floating card adhering to Elevation Level 2.
 * Includes controlled capability accent, unboxed metadata, and fluid micro-interaction.
 */
export function ToolCard({
  name,
  description,
  icon,
  accent = 'cyan',
  status,
  shortcut,
  onClick,
  className = '',
}: ToolCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative w-full text-left p-4 rounded-2xl
        bg-[#070e28]/70 hover:bg-[#0b1740]/80
        backdrop-blur-xl border border-white/[0.08] hover:border-cyan-400/40
        shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_24px_rgba(34,211,238,0.15)]
        transition-all duration-200 cursor-pointer select-none
        hover:-translate-y-0.5 flex flex-col justify-between
        ${className}
      `}
      style={{
        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Top Header: Icon Container + Shortcut or Chevron */}
      <div className="flex items-start justify-between gap-3 w-full mb-3">
        <ToolIconContainer icon={icon} accent={accent} size="md" />

        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
          {shortcut && (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-black/40 border border-white/10 rounded">
              {shortcut}
            </kbd>
          )}
          <ChevronRight
            size={15}
            className="text-slate-400 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </div>

      {/* Center: Tool Identity & Functional Description */}
      <div className="w-full">
        <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors tracking-tight flex items-center gap-1.5">
          {name}
        </h3>
        <p className="text-xs text-slate-300/80 mt-1 line-clamp-2 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Bottom Footer: Clean Unboxed Metadata & Status */}
      {status && (
        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_4px_#22d3ee]" />
            <span className="text-slate-300">{status}</span>
          </span>
          <span className="text-[10px] text-cyan-400/70 group-hover:text-cyan-300 font-sans font-medium transition-colors">
            Launch →
          </span>
        </div>
      )}
    </button>
  );
}
