import React from 'react';

export type ToolAccentColor =
  | 'cyan'
  | 'violet'
  | 'indigo'
  | 'fuchsia'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'sky'
  | 'blue';

interface ToolIconContainerProps {
  icon: React.ReactNode;
  accent?: ToolAccentColor;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  className?: string;
}

/**
 * ASTRA Tool Icon Container
 * Floating glass receptacle for tool modules with soft ambient glow,
 * specular highlight, and tailored capability accent color.
 */
export function ToolIconContainer({
  icon,
  accent = 'cyan',
  size = 'md',
  active = false,
  className = '',
}: ToolIconContainerProps) {
  const accentConfigs: Record<
    ToolAccentColor,
    {
      bgGrad: string;
      border: string;
      glow: string;
      text: string;
      activeGlow: string;
    }
  > = {
    cyan: {
      bgGrad: 'bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-indigo-950/40',
      border: 'border-cyan-400/30 group-hover:border-cyan-400/60',
      glow: 'group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]',
      text: 'text-cyan-300 group-hover:text-cyan-200',
      activeGlow: 'shadow-[0_0_24px_rgba(34,211,238,0.45)] border-cyan-400/70 text-cyan-100',
    },
    violet: {
      bgGrad: 'bg-gradient-to-br from-violet-500/20 via-purple-600/10 to-indigo-950/40',
      border: 'border-violet-400/30 group-hover:border-violet-400/60',
      glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]',
      text: 'text-violet-300 group-hover:text-violet-200',
      activeGlow: 'shadow-[0_0_24px_rgba(139,92,246,0.45)] border-violet-400/70 text-violet-100',
    },
    indigo: {
      bgGrad: 'bg-gradient-to-br from-indigo-500/20 via-blue-700/10 to-slate-950/40',
      border: 'border-indigo-400/30 group-hover:border-indigo-400/60',
      glow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]',
      text: 'text-indigo-300 group-hover:text-indigo-200',
      activeGlow: 'shadow-[0_0_24px_rgba(99,102,241,0.45)] border-indigo-400/70 text-indigo-100',
    },
    fuchsia: {
      bgGrad: 'bg-gradient-to-br from-fuchsia-500/20 via-pink-600/10 to-purple-950/40',
      border: 'border-fuchsia-400/30 group-hover:border-fuchsia-400/60',
      glow: 'group-hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]',
      text: 'text-fuchsia-300 group-hover:text-fuchsia-200',
      activeGlow: 'shadow-[0_0_24px_rgba(217,70,239,0.45)] border-fuchsia-400/70 text-fuchsia-100',
    },
    emerald: {
      bgGrad: 'bg-gradient-to-br from-emerald-500/20 via-teal-600/10 to-slate-950/40',
      border: 'border-emerald-400/30 group-hover:border-emerald-400/60',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      text: 'text-emerald-300 group-hover:text-emerald-200',
      activeGlow: 'shadow-[0_0_24px_rgba(16,185,129,0.45)] border-emerald-400/70 text-emerald-100',
    },
    amber: {
      bgGrad: 'bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-amber-950/40',
      border: 'border-amber-400/30 group-hover:border-amber-400/60',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      text: 'text-amber-300 group-hover:text-amber-200',
      activeGlow: 'shadow-[0_0_24px_rgba(245,158,11,0.45)] border-amber-400/70 text-amber-100',
    },
    rose: {
      bgGrad: 'bg-gradient-to-br from-rose-500/20 via-red-600/10 to-rose-950/40',
      border: 'border-rose-400/30 group-hover:border-rose-400/60',
      glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]',
      text: 'text-rose-300 group-hover:text-rose-200',
      activeGlow: 'shadow-[0_0_24px_rgba(244,63,94,0.45)] border-rose-400/70 text-rose-100',
    },
    sky: {
      bgGrad: 'bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-slate-950/40',
      border: 'border-sky-400/30 group-hover:border-sky-400/60',
      glow: 'group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]',
      text: 'text-sky-300 group-hover:text-sky-200',
      activeGlow: 'shadow-[0_0_24px_rgba(56,189,248,0.45)] border-sky-400/70 text-sky-100',
    },
    blue: {
      bgGrad: 'bg-gradient-to-br from-blue-500/20 via-indigo-600/10 to-slate-950/40',
      border: 'border-blue-400/30 group-hover:border-blue-400/60',
      glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      text: 'text-blue-300 group-hover:text-blue-200',
      activeGlow: 'shadow-[0_0_24px_rgba(59,130,246,0.45)] border-blue-400/70 text-blue-100',
    },
  };

  const current = accentConfigs[accent] || accentConfigs.cyan;

  const sizeStyles = {
    sm: 'w-7 h-7 rounded-lg text-sm',
    md: 'w-10 h-10 rounded-xl text-base',
    lg: 'w-12 h-12 rounded-2xl text-lg',
  };

  return (
    <div
      className={`
        relative shrink-0 flex items-center justify-center
        backdrop-blur-xl border transition-all duration-300
        ${sizeStyles[size]}
        ${current.bgGrad}
        ${active ? current.activeGlow : `${current.border} ${current.glow} ${current.text}`}
        ${className}
      `}
      style={{
        boxShadow: active
          ? undefined
          : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
      }}
    >
      <div className="relative z-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        {icon}
      </div>
    </div>
  );
}
