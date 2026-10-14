import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  Eye,
  Globe,
  Laptop,
  Layers,
  Monitor,
  RefreshCw,
  Smartphone,
  Sparkles,
  Tablet,
} from 'lucide-react';
import { useCredits } from '../../lib/CreditContext';

interface WebsiteFactoryWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export function WebsiteFactoryWorkspace({ onBack, onNotify }: WebsiteFactoryWorkspaceProps) {
  const { deductCredits } = useCredits();

  const [siteType, setSiteType] = useState<'saas' | 'portfolio' | 'crypto' | 'ecommerce'>('saas');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [siteTitle, setSiteTitle] = useState('NexusAI — Autonomous Cloud Intelligence');
  const [siteTagline, setSiteTagline] = useState(
    'Deploy production-ready multi-agent workflows with one click.'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWebsite = () => {
    const ok = deductCredits(5, 'Website Factory Synthesis', 'Astra Web Factory');
    if (!ok) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onNotify('Full website architecture compiled and rendered in preview viewport!');
    }, 1400);
  };

  const handleExportCode = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen">
  <header class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/10">
    <div class="text-xl font-black text-cyan-400">ASTRA / ${siteTitle.split(' ')[0]}</div>
    <nav class="space-x-6 text-sm text-slate-300">
      <a href="#features" class="hover:text-cyan-400">Features</a>
      <a href="#pricing" class="hover:text-cyan-400">Pricing</a>
      <a href="#contact" class="hover:text-cyan-400">Contact</a>
    </nav>
    <button class="px-5 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:brightness-110">Get Started</button>
  </header>
  <main class="max-w-4xl mx-auto px-6 py-20 text-center">
    <h1 class="text-5xl font-black text-white leading-tight mb-4">${siteTitle}</h1>
    <p class="text-lg text-slate-400 max-w-2xl mx-auto mb-8">${siteTagline}</p>
    <button class="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-600 text-slate-950 font-black text-lg hover:scale-105 transition-transform shadow-xl">
      Deploy Infrastructure Now
    </button>
  </main>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${siteType}-landing-page.html`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Exported responsive standalone HTML + Tailwind website!');
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <Globe size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                ASTRA Website Factory
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Responsive Live
                </span>
              </h2>
              <p className="text-xs text-slate-400">Generate modern responsive SaaS landing pages, portfolios, and store layouts</p>
            </div>
          </div>
        </div>

        {/* Viewport switchers & Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-lg transition-colors ${
                deviceView === 'desktop' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop (100%)"
            >
              <Monitor size={15} />
            </button>
            <button
              onClick={() => setDeviceView('tablet')}
              className={`p-1.5 rounded-lg transition-colors ${
                deviceView === 'tablet' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet (768px)"
            >
              <Tablet size={15} />
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-lg transition-colors ${
                deviceView === 'mobile' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile (375px)"
            >
              <Smartphone size={15} />
            </button>
          </div>

          <button
            onClick={handleExportCode}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} />
            <span>Export HTML</span>
          </button>
        </div>
      </div>

      {/* Synthesis Bar */}
      <div className="rounded-2xl p-4 bg-[#070e28]/90 border border-cyan-500/25 flex flex-col sm:flex-row gap-3 items-center">
        <select
          value={siteType}
          onChange={(e) => setSiteType(e.target.value as any)}
          className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-cyan-300 outline-none w-full sm:w-auto"
        >
          <option value="saas">SaaS Tech Platform</option>
          <option value="portfolio">Developer Portfolio</option>
          <option value="crypto">Web3 / Crypto App</option>
          <option value="ecommerce">Digital Storefront</option>
        </select>

        <input
          type="text"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          placeholder="Website Title"
          className="flex-1 w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
        />

        <button
          onClick={handleGenerateWebsite}
          disabled={isGenerating}
          className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-indigo-600 text-slate-950 hover:brightness-110 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] shrink-0"
        >
          <Sparkles size={14} />
          <span>{isGenerating ? 'Generating...' : 'Build Website (5 Cr)'}</span>
        </button>
      </div>

      {/* Live Preview Container */}
      <div className="flex justify-center p-4 bg-slate-950/90 rounded-3xl border border-white/10 shadow-inner overflow-hidden min-h-[500px]">
        <div
          className={`transition-all duration-300 rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#06091f] shadow-2xl flex flex-col ${
            deviceView === 'desktop'
              ? 'w-full'
              : deviceView === 'tablet'
              ? 'w-[720px]'
              : 'w-[360px]'
          }`}
        >
          {/* Mock Browser Header */}
          <div className="h-8 px-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <div className="font-mono text-[10px] text-slate-400 bg-black/40 px-4 py-0.5 rounded-full">
              https://preview.astra.site/{siteType}
            </div>
            <span className="text-[10px]">60 FPS</span>
          </div>

          {/* Rendered Web Content */}
          <div className="p-6 sm:p-10 space-y-8 overflow-y-auto max-h-[550px] scrollbar-thin">
            {/* Nav */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <span className="font-black text-cyan-300 tracking-wider text-sm sm:text-base">
                {siteTitle.split(' ')[0]}
              </span>
              <div className="hidden sm:flex items-center gap-5 text-xs text-slate-300">
                <span>Features</span>
                <span>Benchmarks</span>
                <span>Docs</span>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 text-slate-950">
                Launch App
              </button>
            </div>

            {/* Hero */}
            <div className="text-center py-8 space-y-4 max-w-xl mx-auto">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Autonomous Intelligence v4.0
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {siteTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {siteTagline}
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                  Start Free Sandbox
                </button>
                <button className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10">
                  Read Architecture
                </button>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {[
                { title: 'Sub-millisecond Latency', desc: 'Hybrid tensor parallel execution with edge caching.' },
                { title: 'Full Autonomy', desc: 'Self-repairing checkpoints and continuous QA assertions.' },
                { title: 'Enterprise Security', desc: 'Hardware-level enclave isolation and zero key leaks.' },
              ].map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <h4 className="text-xs font-bold text-cyan-300">{f.title}</h4>
                  <p className="text-[11px] text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
