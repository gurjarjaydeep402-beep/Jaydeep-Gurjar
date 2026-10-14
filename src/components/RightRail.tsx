import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Database,
  FileCode,
  FileText,
  Globe,
  HardDrive,
  LayoutGrid,
  Network,
  Play,
  Rocket,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Upload,
  Zap,
} from 'lucide-react';
import { GlassPanel } from './ui/GlassPanel';
import { useConnectors } from '../lib/ConnectorsContext';
import type { WorkspaceId } from '../types';

interface RightRailProps {
  onNavigate: (id: WorkspaceId) => void;
  onQuickAction: (actionName: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

/**
 * ASTRA Master Right Rail
 * Exactly matches the 5-panel layout from the reference image:
 * 1. System Status (AI Models, Database, Storage, Network + "View Details")
 * 2. Quick Tools (8-button icon grid: New Project, File Upload, Create App, Deploy, Trading, Analytics, Calendar, Settings)
 * 3. Market & Finance (Neon green sparkline + NIFTY 50, BANKNIFTY, BTC, ETH + "View Market →")
 * 4. Recent Activity (5 color-coded events with timestamps)
 * 5. Mobile & Desktop (Windows, Android, iOS, Web + "Setup Now")
 */
export function RightRail({ onNavigate, onQuickAction }: RightRailProps) {
  const { connectors } = useConnectors();

  const [marketData, setMarketData] = useState([
    { symbol: 'NIFTY 50', price: '24,728.65', change: '+1.34%', up: true },
    { symbol: 'BANKNIFTY', price: '51,892.10', change: '+1.27%', up: true },
    { symbol: 'BTC', price: '68,432.50', change: '+2.18%', up: true },
    { symbol: 'ETH', price: '3,254.76', change: '+1.96%', up: true },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMarketData((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.48) * 0.04;
          const currentChange = parseFloat(item.change);
          const newChange = (currentChange + delta).toFixed(2);
          const isUp = parseFloat(newChange) >= 0;
          return {
            ...item,
            change: `${isUp ? '+' : ''}${newChange}%`,
            up: isUp,
          };
        })
      );
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="w-full xl:w-[285px] shrink-0 space-y-3.5 select-none astra-glass-layer-2">
      {/* 1. System Status Panel */}
      <div className="p-4 rounded-2xl bg-[#03071e]/85 border border-cyan-500/25 shadow-[0_20px_45px_-8px_rgba(0,0,0,0.8),0_6px_18px_-3px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-cyan-400" />
            <h3 className="text-xs font-bold text-white tracking-wide">
              System Status
            </h3>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span>All systems online</span>
          </div>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <Zap size={13} className="text-cyan-400" />
              <span>AI Models</span>
            </div>
            <span className="text-emerald-400 font-semibold">Connected</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <Database size={13} className="text-cyan-400" />
              <span>Database</span>
            </div>
            <span className="text-emerald-400 font-semibold">Connected</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <HardDrive size={13} className="text-cyan-400" />
              <span>Storage</span>
            </div>
            <span className="text-emerald-400 font-semibold">Connected</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <Network size={13} className="text-cyan-400" />
              <span>Network</span>
            </div>
            <span className="text-emerald-400 font-semibold">Online</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('connectors')}
          className="w-full py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-200 border border-white/[0.08] hover:border-cyan-400/40 transition-all text-center cursor-pointer"
        >
          View Details
        </button>
      </div>

      {/* 2. Quick Tools Grid */}
      <div className="p-4 rounded-2xl bg-[#03071e]/85 border border-cyan-500/25 shadow-[0_20px_45px_-8px_rgba(0,0,0,0.8),0_6px_18px_-3px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl space-y-3">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
          <Zap size={15} className="text-fuchsia-400" />
          <h3 className="text-xs font-bold text-white tracking-wide">
            Quick Tools
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'New Project', id: 'projects', icon: FileText, color: 'text-cyan-400' },
            { label: 'File Upload', id: 'files', icon: Upload, color: 'text-cyan-400' },
            { label: 'Create App', id: 'app-factory', icon: LayoutGrid, color: 'text-cyan-400' },
            { label: 'Deploy', id: 'developer-ji', icon: Send, color: 'text-cyan-300' },
            { label: 'Trading', id: 'market', icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Analytics', id: 'connectors', icon: BarChart3, color: 'text-cyan-400' },
            { label: 'Calendar', id: 'chat', icon: Calendar, color: 'text-fuchsia-400' },
            { label: 'Settings', id: 'control', icon: Settings, color: 'text-cyan-400' },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.label}
                type="button"
                onClick={() => onNavigate(tool.id as WorkspaceId)}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/[0.06] hover:border-cyan-400/40 flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className={`p-1.5 rounded-lg bg-black/40 ${tool.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={14} />
                </div>
                <span className="text-[10px] text-slate-300 group-hover:text-white font-medium truncate w-full leading-tight">
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Market & Finance */}
      <div className="p-4 rounded-2xl bg-[#03071e]/85 border border-cyan-500/25 shadow-[0_20px_45px_-8px_rgba(0,0,0,0.8),0_6px_18px_-3px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-emerald-400" />
            <h3 className="text-xs font-bold text-white tracking-wide">
              Market & Finance
            </h3>
          </div>

          {/* Mini Neon Green Sparkline Chart */}
          <svg className="w-16 h-5" viewBox="0 0 60 20" fill="none">
            <path
              d="M0 16 L10 14 L20 17 L30 9 L40 12 L50 4 L60 6"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="space-y-2 text-xs font-mono">
          {marketData.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">{item.symbol}</span>
              <div className="flex items-center gap-3">
                <span className="text-white">{item.price}</span>
                <span className={item.up ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-right pt-1">
          <button
            type="button"
            onClick={() => onNavigate('market')}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            View Market →
          </button>
        </div>
      </div>

      {/* 4. Recent Activity Stream */}
      <div className="p-4 rounded-2xl bg-[#03071e]/85 border border-cyan-500/25 shadow-[0_20px_45px_-8px_rgba(0,0,0,0.8),0_6px_18px_-3px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-amber-400" />
            <h3 className="text-xs font-bold text-white tracking-wide">
              Recent Activity
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
          >
            View All
          </button>
        </div>

        <div className="space-y-2.5">
          {[
            { name: 'Image generated', time: '2 min ago', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { name: 'Video created', time: '12 min ago', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
            { name: 'App deployed', time: '28 min ago', bg: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
            { name: 'Trading analysis completed', time: '1 hr ago', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
            { name: 'Project updated', time: '2 hr ago', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
          ].map((ev) => (
            <div key={ev.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${ev.bg}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
                <span className="text-slate-200 truncate font-medium">{ev.name}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 shrink-0 ml-2">{ev.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Mobile & Desktop Card */}
      <div className="p-4 rounded-2xl bg-[#03071e]/85 border border-cyan-500/25 shadow-[0_20px_45px_-8px_rgba(0,0,0,0.8),0_6px_18px_-3px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl space-y-3">
        <div className="flex items-center gap-2">
          <Smartphone size={15} className="text-cyan-400" />
          <h3 className="text-xs font-bold text-white tracking-wide">
            Mobile & Desktop
          </h3>
        </div>

        <p className="text-[11px] text-slate-300">
          Use ASTRA anywhere — just say it.
        </p>

        <div className="grid grid-cols-4 gap-2 text-center py-1">
          {[
            { name: 'Windows', icon: '⊞' },
            { name: 'Android', icon: '🤖' },
            { name: 'iOS', icon: '' },
            { name: 'Web', icon: '🌐' },
          ].map((platform) => (
            <div
              key={platform.name}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white"
            >
              <span className="text-sm">{platform.icon}</span>
              <span className="text-[10px] font-medium">{platform.name}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onQuickAction('Setup Devices')}
          className="w-full py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:brightness-110 shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-cyan-400/30 transition-all cursor-pointer text-center"
        >
          Setup Now
        </button>
      </div>
    </aside>
  );
}
