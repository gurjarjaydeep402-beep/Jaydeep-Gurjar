import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  RefreshCw,
  WifiOff,
  Zap,
} from 'lucide-react';

export type SystemStatusType =
  | 'READY'
  | 'CONNECTED'
  | 'PROCESSING'
  | 'SYNCING'
  | 'OFFLINE'
  | 'SETUP_REQUIRED'
  | 'ERROR'
  | 'STANDBY';

interface StatusBadgeProps {
  status: SystemStatusType | string;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * ASTRA System Status Language
 * Truthful, uncluttered status indicator adhering to Anti-Slop Zero-Pill discipline.
 * Renders as a clean inline status with a precision glowing status LED and accessible label.
 */
export function StatusBadge({
  status,
  label,
  showIcon = true,
  size = 'sm',
  className = '',
}: StatusBadgeProps) {
  const normStatus = (status || 'READY').toUpperCase().replace(/\s+/g, '_');

  const config: Record<
    string,
    {
      text: string;
      colorClass: string;
      ledColor: string;
      icon: React.ComponentType<{ size?: number; className?: string }>;
      glow: string;
    }
  > = {
    CONNECTED: {
      text: 'Connected',
      colorClass: 'text-emerald-400',
      ledColor: 'bg-emerald-400',
      icon: CheckCircle2,
      glow: 'shadow-[0_0_8px_#34d399]',
    },
    READY: {
      text: 'Ready',
      colorClass: 'text-cyan-400',
      ledColor: 'bg-cyan-400',
      icon: Zap,
      glow: 'shadow-[0_0_8px_#22d3ee]',
    },
    PROCESSING: {
      text: 'Processing',
      colorClass: 'text-indigo-400',
      ledColor: 'bg-indigo-400',
      icon: Clock,
      glow: 'shadow-[0_0_8px_#818cf8]',
    },
    SYNCING: {
      text: 'Syncing',
      colorClass: 'text-cyan-300',
      ledColor: 'bg-cyan-300',
      icon: RefreshCw,
      glow: 'shadow-[0_0_8px_#67e8f9]',
    },
    OFFLINE: {
      text: 'Offline',
      colorClass: 'text-slate-400',
      ledColor: 'bg-slate-400',
      icon: WifiOff,
      glow: 'shadow-none',
    },
    SETUP_REQUIRED: {
      text: 'Setup Required',
      colorClass: 'text-amber-400',
      ledColor: 'bg-amber-400',
      icon: AlertTriangle,
      glow: 'shadow-[0_0_8px_#f59e0b]',
    },
    AUTHORIZATION_REQUIRED: {
      text: 'Auth Required',
      colorClass: 'text-cyan-400',
      ledColor: 'bg-cyan-400',
      icon: AlertTriangle,
      glow: 'shadow-[0_0_8px_#22d3ee]',
    },
    ERROR: {
      text: 'Error',
      colorClass: 'text-rose-400',
      ledColor: 'bg-rose-400',
      icon: XCircle,
      glow: 'shadow-[0_0_8px_#f43f5e]',
    },
    STANDBY: {
      text: 'Standby',
      colorClass: 'text-slate-400',
      ledColor: 'bg-slate-400',
      icon: Clock,
      glow: 'shadow-none',
    },
  };

  const current = config[normStatus] || config.READY;
  const Icon = current.icon;
  const displayLabel = label || current.text;

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${current.colorClass} font-mono text-xs ${className}`}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      {/* Precision Micro-LED indicator */}
      <span
        className={`inline-block rounded-full ${current.ledColor} ${current.glow} shrink-0 ${
          isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2'
        } ${normStatus === 'PROCESSING' || normStatus === 'SYNCING' ? 'animate-pulse' : ''}`}
      />

      {showIcon && <Icon size={isSmall ? 11 : 13} className="shrink-0 opacity-80" />}

      <span className="font-semibold tracking-wider uppercase text-[10px] sm:text-[11px]">
        {displayLabel}
      </span>
    </div>
  );
}
