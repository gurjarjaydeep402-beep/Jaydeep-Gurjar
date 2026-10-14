import React from 'react';
import {
  BarChart3,
  Bot,
  Briefcase,
  ChevronDown,
  Code2,
  Cpu,
  FileText,
  FolderGit2,
  Globe,
  GraduationCap,
  Home,
  Image as ImageIcon,
  LayoutGrid,
  Megaphone,
  MessageSquare,
  Mic2,
  Play,
  Puzzle,
  Search,
  TrendingUp,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { AstraLogo } from './AstraLogo';
import { useCredits } from '../lib/CreditContext';
import type { WorkspaceId } from '../types';

interface SidebarProps {
  activeWorkspace: WorkspaceId;
  isOpen: boolean;
  onSelectWorkspace: (id: WorkspaceId) => void;
  onClose: () => void;
  onUpgradeClick: () => void;
  onOpenForgeClick: () => void;
}

interface NavItem {
  id: WorkspaceId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, accentColor: 'text-cyan-400' },
  { id: 'chat', label: 'Chat', icon: MessageSquare, accentColor: 'text-cyan-400' },
  { id: 'image-generator', label: 'Image Generator', icon: ImageIcon, accentColor: 'text-fuchsia-400' },
  { id: 'video-generator', label: 'Video Generator', icon: Play, accentColor: 'text-rose-400' },
  { id: 'audio', label: 'Audio / Voice', icon: Mic2, accentColor: 'text-violet-400' },
  { id: 'coding', label: 'Code & Dev', icon: Code2, accentColor: 'text-emerald-400' },
  { id: 'app-factory', label: 'App Builder', icon: LayoutGrid, accentColor: 'text-fuchsia-400' },
  { id: 'website-factory', label: 'Website Builder', icon: Globe, accentColor: 'text-sky-400' },
  { id: 'developer-ji', label: 'Agents', icon: Bot, accentColor: 'text-blue-400' },
  { id: 'research', label: 'Research', icon: Search, accentColor: 'text-amber-400' },
  { id: 'files', label: 'Files & Docs', icon: FileText, accentColor: 'text-sky-400' },
  { id: 'projects', label: 'Projects & Forge', icon: FolderGit2, accentColor: 'text-indigo-400' },
  { id: 'automation', label: 'Automator & Chains', icon: Workflow, accentColor: 'text-cyan-400' },
  { id: 'market', label: 'Trading & Finance', icon: TrendingUp, accentColor: 'text-emerald-400' },
  { id: 'affiliate', label: 'Marketing & Affiliate', icon: Megaphone, accentColor: 'text-pink-400' },
  { id: 'game-factory', label: 'Learning & Study', icon: GraduationCap, accentColor: 'text-blue-400' },
  { id: 'connectors', label: 'Business & Productivity', icon: Briefcase, accentColor: 'text-orange-400' },
  { id: 'providers', label: 'AI & Models', icon: Cpu, accentColor: 'text-indigo-400' },
  { id: 'control', label: 'Tools & Plugins', icon: Puzzle, accentColor: 'text-cyan-400' },
];

export function Sidebar({
  activeWorkspace,
  isOpen,
  onSelectWorkspace,
  onClose,
  onUpgradeClick,
  onOpenForgeClick,
}: SidebarProps) {
  const { credits } = useCredits();
  const creditPercentage = Math.min(100, Math.max(15, (credits / 500) * 100));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Chassis with Deep Space Glass-Morphism & Neon Cyan Rim */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[250px] shrink-0 flex flex-col
          bg-gradient-to-b from-[#040c2a]/85 via-[#02071e]/80 to-[#010412]/85
          backdrop-blur-[28px] astra-glass-layer-1
          border-r border-cyan-500/25
          transition-transform duration-300 ease-in-out select-none relative overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          boxShadow:
            'inset 0 1px 1px 0 rgba(34, 211, 238, 0.3), inset -1px 0 24px 0 rgba(34, 211, 238, 0.09), 0 25px 60px -10px rgba(0, 0, 0, 0.85), 0 0 30px rgba(34, 211, 238, 0.08)',
        }}
      >
        {/* Subtle Ambient Edge Glow Streaks */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-cyan-400/40 via-cyan-400/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-cyan-500/[0.06] to-transparent pointer-events-none" />

        {/* Brand Header */}
        <div className="h-[74px] px-5 flex items-center justify-between border-b border-cyan-500/15 relative z-10">
          <button
            type="button"
            onClick={() => onSelectWorkspace('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <AstraLogo size={38} variant="active-glowing" />
            <div>
              <div className="text-xl font-black tracking-[0.16em] bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]">
                ASTRA
              </div>
              <div className="text-[9px] font-mono tracking-[0.22em] text-cyan-200/90 uppercase font-semibold">
                AI PRO ASSISTANT
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.08] lg:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin relative z-10">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspace === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectWorkspace(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
                  transition-all duration-200 text-left cursor-pointer group relative
                  ${
                    isActive
                      ? 'text-white border border-cyan-400/70 shadow-[0_0_20px_rgba(59,130,246,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-cyan-500/[0.07] border border-transparent hover:border-cyan-500/25'
                  }
                `}
                style={
                  isActive
                    ? {
                        background:
                          'linear-gradient(90deg, rgba(29, 78, 216, 0.85) 0%, rgba(67, 56, 202, 0.85) 50%, rgba(109, 40, 217, 0.85) 100%)',
                      }
                    : undefined
                }
              >
                <div
                  className={`
                    w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform
                    ${
                      isActive
                        ? 'text-white scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                        : `${item.accentColor} group-hover:scale-110`
                    }
                  `}
                >
                  <Icon size={16} />
                </div>

                <span
                  className={`truncate tracking-wide ${
                    isActive ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.35)]' : ''
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <div className="ml-auto flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                  </div>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onSelectWorkspace('projects')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-cyan-500/[0.06] border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-slate-400">
              <ChevronDown size={15} />
            </div>
            <span>More</span>
          </button>
        </div>

        {/* Bottom Cards: Storage & ASTRA FORGE */}
        <div className="p-3 space-y-2.5 border-t border-cyan-500/15 bg-[#020516]/95 relative z-10">
          {/* Card 1: Your AI Workspace */}
          <div
            className="p-3.5 rounded-2xl bg-[#060e2a]/90 border border-cyan-500/25 backdrop-blur-md relative overflow-hidden"
            style={{
              boxShadow: 'inset 0 0 16px 0 rgba(34, 211, 238, 0.08), 0 8px 24px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Subtle multi-color top glow */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 opacity-60" />

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                  <AstraLogo size={16} glow={false} />
                </div>
                <div className="text-xs font-bold text-white tracking-wide">
                  Your AI Workspace
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30">
                {credits.toLocaleString()} / 500 Credits
              </span>
            </div>

            {/* Glowing Multi-Color Flowing Brahmastra Fire & Cosmic Gradient Bar */}
            <div className="w-full h-2 bg-slate-950/90 rounded-full overflow-hidden p-0.5 border border-white/15 mb-2.5 relative">
              <div
                className="h-full rounded-full transition-all duration-500 relative"
                style={{
                  width: `${creditPercentage}%`,
                  background: 'linear-gradient(90deg, #00f0ff 0%, #3b82f6 25%, #8b5cf6 50%, #ec4899 75%, #f59e0b 100%)',
                  boxShadow: '0 0 14px rgba(0, 240, 255, 0.9), 0 0 20px rgba(236, 72, 153, 0.7)',
                }}
              >
                {/* Luminous leading pulse particle */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-300">Free Plan</span>
              <button
                type="button"
                onClick={onUpgradeClick}
                className="px-3.5 py-1 rounded-xl text-[10px] font-bold text-white border border-cyan-400/50 hover:border-cyan-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:brightness-110"
                style={{
                  background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                }}
              >
                Upgrade
              </button>
            </div>
          </div>

          {/* Card 2: ASTRA FORGE */}
          <div
            className="relative overflow-hidden p-3.5 rounded-2xl bg-gradient-to-br from-[#1d0c3f]/90 via-[#0e1647]/85 to-[#070e2a]/95 border border-fuchsia-500/35 shadow-[0_4px_24px_rgba(217,70,239,0.2)]"
            style={{
              boxShadow: 'inset 0 0 20px 0 rgba(217, 70, 239, 0.1), 0 4px 20px 0 rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/15 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-2.5 mb-1.5">
              <AstraLogo size={24} variant="active-glowing" />
              <div>
                <div className="text-xs font-black tracking-wider text-white">
                  ASTRA FORGE
                </div>
                <div className="text-[9px] font-mono text-slate-300">
                  Build · Create · Automate
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenForgeClick}
              className="w-full mt-2 py-1.5 px-3 rounded-xl text-[11px] font-bold bg-white/[0.06] hover:bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 hover:border-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.25)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open Workspace</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
