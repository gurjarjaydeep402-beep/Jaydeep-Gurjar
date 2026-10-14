import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Layout,
  Megaphone,
  Plus,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useCredits } from '../../lib/CreditContext';

interface AdMakerWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export function AdMakerWorkspace({ onBack, onNotify }: AdMakerWorkspaceProps) {
  const { deductCredits } = useCredits();

  const [title, setTitle] = useState('Build Next-Gen Web Apps with ASTRA AI');
  const [description, setDescription] = useState(
    'Autonomous full-stack software development, live code execution, and high-fidelity asset generation in seconds.'
  );
  const [ctaText, setCtaText] = useState('Launch Free Studio');
  const [destinationUrl, setDestinationUrl] = useState('https://astra.ai/forge');
  const [placement, setPlacement] = useState<'sidebar' | 'banner' | 'feed'>('sidebar');
  const [accentColor, setAccentColor] = useState('#22d3ee');

  const [campaigns, setCampaigns] = useState([
    {
      id: 'cmp-1',
      title: 'Astra Forge Developer Launch',
      impressions: 12450,
      clicks: 842,
      ctr: '6.76%',
      status: 'Internal Active',
    },
  ]);

  const handleGenerateAdCopy = () => {
    const ok = deductCredits(2, 'Ad Creative Generation', 'Astra Ad Studio');
    if (!ok) return;

    onNotify('Generated high-converting creative variants!');
    setTitle('Supercharge Your Workflow with Autonomous AI Engineering');
    setDescription(
      'Turn prompts into production apps, deploy websites in 1-click, and let Developer Ji handle the code.'
    );
    setCtaText('Get 100 Free Credits');
  };

  const handleSaveCampaign = () => {
    const newCamp = {
      id: `cmp-${Date.now()}`,
      title: title.slice(0, 32),
      impressions: 0,
      clicks: 0,
      ctr: '0.00%',
      status: 'Draft Scheduled',
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    onNotify('Ad campaign saved to local campaign registry!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in select-text">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/25">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)]">
              <Megaphone size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                ASTRA Ad Maker & Creative Studio
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Creative Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">Design high-CTR sponsored banners, feed cards, and video ad copy</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateAdCopy}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-indigo-500 text-white hover:brightness-110 flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]"
        >
          <Sparkles size={14} />
          <span>AI Ad Copy (2 Cr)</span>
        </button>
      </div>

      {/* 2-Column: Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Form */}
        <div className="rounded-2xl p-6 bg-[#070e28]/90 border border-pink-500/25 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders size={16} className="text-pink-400" />
            <span>Creative Parameters</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Campaign / Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Body Copy / Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white outline-none focus:border-pink-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Call-To-Action (CTA)</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Target URL</label>
                <input
                  type="text"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white outline-none focus:border-pink-400"
                />
              </div>
            </div>

            {/* Placement Switcher */}
            <div>
              <label className="text-xs font-semibold text-slate-300">Preview Placement</label>
              <div className="flex gap-2 mt-1.5">
                {(['sidebar', 'banner', 'feed'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPlacement(mode)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      placement === mode
                        ? 'bg-pink-500/20 border border-pink-400/40 text-pink-200'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveCampaign}
              className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-400 text-slate-950 transition-colors shadow-lg"
            >
              Save to Campaign Registry
            </button>
          </div>
        </div>

        {/* Live Preview Display */}
        <div className="rounded-2xl p-6 bg-[#070e28]/90 border border-cyan-500/25 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye size={16} className="text-cyan-400" />
                <span>Live Rendering Preview ({placement.toUpperCase()})</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                100% Responsive
              </span>
            </div>

            {/* Render Preview according to placement */}
            {placement === 'sidebar' && (
              <div className="w-full max-w-[280px] mx-auto p-4 rounded-2xl bg-gradient-to-br from-[#0c1844] to-[#1a0a38] border border-cyan-500/35 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-cyan-300 font-bold border border-cyan-500/30">
                    SPONSORED
                  </span>
                  <span className="text-[10px] text-slate-400">astra.ai</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{title}</h4>
                <p className="text-[11px] text-slate-300 leading-tight">{description}</p>
                <button className="w-full py-1.5 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 hover:brightness-110 shadow-md">
                  {ctaText}
                </button>
              </div>
            )}

            {placement === 'banner' && (
              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#091538] via-[#1a0a38] to-[#091538] border border-pink-500/35 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-pink-300 font-bold border border-pink-500/30">
                    FEATURED
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{title}</h4>
                  <p className="text-xs text-slate-300">{description.slice(0, 75)}...</p>
                </div>
                <button className="px-5 py-2 rounded-xl text-xs font-bold bg-pink-500 text-slate-950 hover:brightness-110 shrink-0 shadow-md">
                  {ctaText}
                </button>
              </div>
            )}

            {placement === 'feed' && (
              <div className="w-full p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                    AST
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">ASTRA Forge Sponsored</h5>
                    <span className="text-[10px] text-slate-400">Promoted partner announcement</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#0c1844] to-[#120a2e] border border-cyan-500/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{title}</span>
                  <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 text-slate-950">
                    {ctaText}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 text-center pt-3 border-t border-white/5">
            Ad creatives adhere to IAB standard aspect ratios and GDPR consent directives.
          </div>
        </div>
      </div>
    </div>
  );
}
