import React from 'react';
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Code2,
  Cpu,
  ImageIcon,
  Mic,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  Video,
  Wrench,
} from 'lucide-react';
import { AstraLogo } from './AstraLogo';
import { CosmicHeroGraphic } from './CosmicHeroGraphic';
import { HoloPedestalGraphic } from './HoloPedestalGraphic';
import type { WorkspaceId } from '../types';

export interface FeatureItem {
  id: WorkspaceId;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconShadow: string;
  borderColor: string;
  hoverGlow: string;
  accentColor: string;
}

export function HeroWidget({
  commandInput,
  setCommandInput,
  handleCommandSubmit,
  onNotify,
  onNavigate,
  onVoiceToggle,
  isVoiceListening,
}: {
  commandInput: string;
  setCommandInput: (val: string) => void;
  handleCommandSubmit: (e?: React.FormEvent) => void;
  onNotify: (msg: string) => void;
  onNavigate: (id: WorkspaceId) => void;
  onVoiceToggle?: () => void;
  isVoiceListening: boolean;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#03071d]/95 via-[#040c2e]/90 to-[#020516]/95 border border-cyan-500/30 shadow-[0_28px_70px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(34,211,238,0.16),inset_0_1px_1px_rgba(255,255,255,0.2)] astra-glass-layer-2 min-h-[390px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-8">
      {/* Deep Space Hero Horizon & Giant Holographic "A" Emblem SVG */}
      <div className="absolute inset-0 z-0 opacity-95">
        <CosmicHeroGraphic className="w-full h-full" />
      </div>

      {/* Ambient Top Glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Greetings (Exact Reference Layout) */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left Greeting */}
        <div className="space-y-1.5 max-w-md pt-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-2">
            <span className="text-white">Hello</span>
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Jay Gurjar
            </span>
            <span className="text-2xl sm:text-3xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Your AI assistant, your creative partner,
            <br className="hidden sm:inline" />
            your personal productivity engine.
          </p>
        </div>

        {/* Right Slogan Matching Master Reference Image */}
        <div className="text-left md:text-right space-y-1.5 self-start pt-1">
          <div className="text-sm sm:text-base font-bold italic tracking-wide text-fuchsia-300 drop-shadow-[0_0_12px_rgba(217,70,239,0.5)]">
            “Dream it. Plan it.
          </div>
          <div className="text-sm sm:text-base font-bold italic tracking-wide text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
            ASTRA builds it.”
          </div>
          <div className="w-28 h-0.5 ml-auto bg-gradient-to-r from-fuchsia-500 via-indigo-400 to-cyan-400 rounded-full shadow-[0_0_10px_#38bdf8]" />
        </div>
      </div>

      {/* Center / Bottom: Floating Command Bar & Quick Action Pills */}
      <div className="relative z-10 w-full max-w-2xl mx-auto space-y-3 pt-14 sm:pt-20">
        {/* Main Command Bar Pill with Reference Gradient Rim */}
        <form
          onSubmit={handleCommandSubmit}
          className="relative flex items-center rounded-full p-1.5 transition-all shadow-[0_20px_50px_-10px_rgba(0,0,0,0.95),0_0_35px_rgba(34,211,238,0.35)] astra-glass-layer-3 group"
          style={{
            background:
              'linear-gradient(#050c26, #050c26) padding-box, linear-gradient(to right, #00f0ff 0%, #38bdf8 30%, #818cf8 60%, #c084fc 85%, #ec4899 100%) border-box',
            border: '2px solid transparent',
            borderRadius: '9999px',
          }}
        >
          {/* Round '+' Button */}
          <button
            type="button"
            onClick={() => onNotify('Context attachment added to prompt')}
            className="w-10 h-10 rounded-full bg-[#081335] hover:bg-[#0c1c4d] text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            title="Add Context"
          >
            <Plus size={18} />
          </button>

          {/* Input Field */}
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Ask ASTRA anything..."
            className="flex-1 bg-transparent px-4 py-2 text-sm sm:text-base text-white placeholder:text-slate-400 outline-none font-sans"
          />

          {/* Microphone Button */}
          <button
            type="button"
            onClick={() => {
              if (onVoiceToggle) {
                onVoiceToggle();
              } else {
                onNotify('Voice acoustic recognition active');
              }
            }}
            className={`p-2 rounded-full transition-all cursor-pointer mr-1 ${
              isVoiceListening
                ? 'text-cyan-200 bg-cyan-500/30 shadow-[0_0_15px_#22d3ee] animate-pulse ring-1 ring-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
            title="Voice Input (Web Speech API)"
          >
            <Mic size={18} />
          </button>

          {/* ASTRA Submit Button */}
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-500 hover:brightness-110 text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all cursor-pointer"
            title="Send Prompt"
          >
            <Send size={16} className="-rotate-12 translate-x-px" />
          </button>
        </form>

        {/* Quick Action Chips Row Matching Reference Image */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {[
            { label: 'Think', icon: Brain, action: () => { setCommandInput('Think through architectural strategy for '); onNotify('Intent: Deep Think'); } },
            { label: 'Search', icon: Search, action: () => { setCommandInput('Search Google for live facts on '); onNotify('Intent: Search'); } },
            { label: 'Code', icon: Code2, action: () => onNavigate('coding') },
            { label: 'Tools', icon: Wrench, action: () => onNavigate('control') },
            { label: 'Image', icon: ImageIcon, action: () => onNavigate('image-generator') },
            { label: 'Video', icon: Video, action: () => onNavigate('video-generator') },
            { label: 'Voice', icon: Mic, action: () => onNavigate('audio') },
            { label: 'More', icon: MoreHorizontal, action: () => onNavigate('projects') },
          ].map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.label}
                type="button"
                onClick={btn.action}
                className="px-3.5 py-1.5 rounded-full bg-[#070e28]/85 hover:bg-[#0c1844] text-slate-300 hover:text-white border border-cyan-500/25 hover:border-cyan-400/50 shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Icon size={13} className="text-cyan-400" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FeaturesWidget({
  features,
  onNavigate,
}: {
  features: FeatureItem[];
  onNavigate: (id: WorkspaceId) => void;
}) {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
          Main Features
        </h2>
        <button
          type="button"
          onClick={() => onNavigate('projects')}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 12 Feature Cards Matrix (4 cols x 3 rows matching master reference) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {features.map((feature) => (
          <button
            key={feature.id}
            type="button"
            onClick={() => onNavigate(feature.id)}
            className="relative p-3.5 rounded-2xl bg-[#040a24]/90 hover:bg-[#07133a]/95 astra-glass-card shadow-[0_8px_24px_rgba(0,0,0,0.55)] flex items-center gap-3 text-left transition-all duration-200 group cursor-pointer select-none hover:-translate-y-1 overflow-hidden"
            style={{
              border: `1px solid ${feature.borderColor}`,
              boxShadow: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.14), 0 8px 24px -4px rgba(0, 0, 0, 0.65)`,
            }}
          >
            {/* Subtle Ambient Radial Highlight matching icon color */}
            <div
              className="absolute -top-10 -left-10 w-32 h-32 rounded-full pointer-events-none opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
              style={{ background: feature.accentColor }}
            />

            {/* Colorful 3D App-Style Icon Container */}
            <div
              className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-108 relative z-10"
              style={{
                background: feature.iconBg,
                boxShadow: feature.iconShadow,
              }}
            >
              {feature.icon}
            </div>

            {/* Title & Description */}
            <div className="min-w-0 flex-1 relative z-10">
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors truncate flex items-center gap-1.5">
                <span>{feature.name}</span>
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 mt-0.5 leading-relaxed font-normal">
                {feature.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export function PromoWidget({
  onNavigate,
}: {
  onNavigate: (id: WorkspaceId) => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#040a24]/75 border border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(34,211,238,0.12),inset_0_1px_1px_rgba(255,255,255,0.1)] p-6 astra-glass-layer-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Title & CTA */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.4)]">
              <AstraLogo size={22} variant="active-glowing" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Create Your Own AI Apps
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Build, publish and earn. Turn your ideas into real apps and start generating income.
          </p>

          <button
            type="button"
            onClick={() => onNavigate('app-factory')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white hover:brightness-110 shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-cyan-300/30 transition-all cursor-pointer"
          >
            <span>Start Building</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Center Column: Holographic Platform Visual */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <HoloPedestalGraphic className="w-full max-h-[170px]" />
        </div>

        {/* Right Column: Key Feature Checkmarks */}
        <div className="lg:col-span-3 space-y-2.5 text-xs font-medium">
          {[
            'No coding required',
            'Publish to marketplace',
            'Earn from your creations',
            'Full monetization support',
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ModelsWidget({
  onNavigate,
}: {
  onNavigate: (id: WorkspaceId) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white tracking-wide">
          Latest AI Models & Tools
        </h2>
        <button
          type="button"
          onClick={() => onNavigate('providers')}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Reference-Matched Horizontal Badge Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {[
          {
            name: 'GPT-4o',
            provider: 'OpenAI',
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-300">
                <path d="M22.28 10.4a6.2 6.2 0 0 0-.52-4.94 6.32 6.32 0 0 0-4.06-3.23 6.18 6.18 0 0 0-5.74 1.13A6.2 6.2 0 0 0 7.8 2.5a6.32 6.32 0 0 0-4.8 2.8 6.18 6.18 0 0 0-.84 5.8 6.2 6.2 0 0 0-2.4 4.35 6.32 6.32 0 0 0 .74 5.15 6.18 6.18 0 0 0 4.9 2.92 6.2 6.2 0 0 0 4.16 1.86 6.32 6.32 0 0 0 4.8-2.8 6.18 6.18 0 0 0 .84-5.8 6.2 6.2 0 0 0 2.4-4.35 6.32 6.32 0 0 0-.74-5.15c.34-.53.53-1.14.52-1.78z" />
              </svg>
            ),
            iconBg: 'bg-emerald-950/80 border-emerald-500/40',
          },
          {
            name: 'Claude 3.5',
            provider: 'Anthropic',
            icon: (
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center font-black text-[9px] text-black">
                C
              </div>
            ),
            iconBg: 'bg-amber-950/80 border-amber-500/40',
          },
          {
            name: 'Gemini 1.5',
            provider: 'Google',
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-cyan-300">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            ),
            iconBg: 'bg-cyan-950/80 border-cyan-500/40',
          },
          {
            name: 'Flux',
            provider: 'Image Gen',
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-purple-300">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            ),
            iconBg: 'bg-purple-950/80 border-purple-500/40',
          },
          {
            name: 'Runway',
            provider: 'Video Gen',
            icon: (
              <span className="font-black text-[11px] font-sans text-emerald-400">R</span>
            ),
            iconBg: 'bg-emerald-950/80 border-emerald-500/40',
          },
          {
            name: 'ElevenLabs',
            provider: 'Voice',
            icon: (
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-3.5 bg-white rounded-full" />
                <span className="w-1 h-3.5 bg-white rounded-full" />
              </div>
            ),
            iconBg: 'bg-slate-900 border-white/20',
          },
          {
            name: 'TradingView',
            provider: 'Market Data',
            icon: (
              <TrendingUp size={13} className="text-cyan-400" />
            ),
            iconBg: 'bg-blue-950/80 border-blue-500/40',
          },
          {
            name: 'Midjourney',
            provider: 'Image',
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-white">
                <path d="M4 18L12 4L20 18H4Z" />
                <path d="M12 4V18" />
              </svg>
            ),
            iconBg: 'bg-indigo-950/80 border-indigo-500/40',
          },
          {
            name: 'GitHub',
            provider: 'Code',
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            ),
            iconBg: 'bg-slate-900 border-white/20',
          },
        ].map((tool) => (
          <button
            key={tool.name}
            type="button"
            onClick={() => onNavigate('providers')}
            className="p-2 rounded-xl bg-[#040924]/75 hover:bg-[#07133a]/85 backdrop-blur-lg border border-white/[0.08] hover:border-cyan-400/40 text-left transition-all group cursor-pointer flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          >
            <div className={`w-6 h-6 rounded-lg ${tool.iconBg} border flex items-center justify-center shrink-0`}>
              {tool.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-white truncate">
                {tool.name}
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                {tool.provider}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
