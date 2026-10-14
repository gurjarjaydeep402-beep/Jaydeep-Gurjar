import React from 'react';

export type ElevationLevel = 1 | 2 | 3 | 4;

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: ElevationLevel;
  glow?: 'cyan' | 'indigo' | 'violet' | 'fuchsia' | 'emerald' | 'none';
  interactive?: boolean;
  borderAccent?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * ASTRA Glass Depth Language Primitives
 * Elevation Level 1: Application shell & base canvases
 * Elevation Level 2: Floating cards & content modules
 * Elevation Level 3: Active tool panels & inspect surfaces
 * Elevation Level 4: Modals, drawers, and command palette surfaces
 */
export function GlassPanel({
  elevation = 2,
  glow = 'none',
  interactive = false,
  borderAccent = false,
  className = '',
  children,
  ...props
}: GlassPanelProps) {
  // Elevation-specific styling
  const elevationStyles: Record<ElevationLevel, string> = {
    1: 'bg-[#050922]/70 backdrop-blur-xl border border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.35)]',
    2: 'bg-[#070e2c]/65 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.45)]',
    3: 'bg-[#0a153c]/75 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.5)]',
    4: 'bg-[#050c26]/95 backdrop-blur-2xl border border-cyan-400/35 shadow-[0_16px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(34,211,238,0.15)]',
  };

  // Subtle glow accent
  const glowStyles = {
    none: '',
    cyan: 'hover:shadow-[0_0_28px_rgba(34,211,238,0.22)] hover:border-cyan-400/40',
    indigo: 'hover:shadow-[0_0_28px_rgba(99,102,241,0.25)] hover:border-indigo-400/40',
    violet: 'hover:shadow-[0_0_28px_rgba(139,92,246,0.25)] hover:border-violet-400/40',
    fuchsia: 'hover:shadow-[0_0_28px_rgba(217,70,239,0.22)] hover:border-fuchsia-400/40',
    emerald: 'hover:shadow-[0_0_28px_rgba(16,185,129,0.22)] hover:border-emerald-400/40',
  };

  const interactiveStyles = interactive
    ? 'transition-all duration-200 hover:-translate-y-0.5 cursor-pointer hover:bg-[#0c1a4d]/75'
    : '';

  const accentBorder = borderAccent ? 'border-cyan-500/30' : '';

  return (
    <div
      className={`relative rounded-2xl ${elevationStyles[elevation]} ${accentBorder} ${interactiveStyles} ${glowStyles[glow]} ${className}`}
      style={{
        // Inner top specular reflection
        boxShadow:
          elevation >= 2
            ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)'
            : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.04)',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
