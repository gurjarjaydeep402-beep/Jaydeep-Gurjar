import { useState } from 'react';
import {
  ArrowLeft,
  Bot,
  Check,
  Cpu,
  Database,
  Image,
  Key,
  Mic2,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { ProviderItem } from '../../types';

interface ProviderHubWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

const INITIAL_PROVIDERS: ProviderItem[] = [
  { name: 'Google AI', capabilities: 'Gemini 2.5 Flash, Gemini 1.5 Pro, Imagen, TTS', status: 'connected', keyName: 'GEMINI_API_KEY', accent: 'cyan', category: 'text' },
  { name: 'OpenAI', capabilities: 'GPT-4o, DALL-E 3, TTS, Whisper', status: 'ready', keyName: 'OPENAI_API_KEY', accent: 'emerald', category: 'text' },
  { name: 'Anthropic', capabilities: 'Claude 3.5 Sonnet, Claude 3 Opus', status: 'ready', keyName: 'ANTHROPIC_API_KEY', accent: 'orange', category: 'text' },
  { name: 'Groq', capabilities: 'Llama 3, Mixtral — ultra-fast sub-second inference', status: 'ready', keyName: 'GROQ_API_KEY', accent: 'amber', category: 'text' },
  { name: 'Together AI', capabilities: 'Open-source models, embeddings, DeepSeek', status: 'ready', keyName: 'TOGETHER_API_KEY', accent: 'violet', category: 'text' },
  { name: 'Mistral', capabilities: 'Mistral Large, Codestral, Embed', status: 'ready', keyName: 'MISTRAL_API_KEY', accent: 'rose', category: 'text' },
  { name: 'Stability AI', capabilities: 'Stable Diffusion 3.5, SDXL image gen', status: 'ready', keyName: 'STABILITY_API_KEY', accent: 'pink', category: 'image' },
  { name: 'ElevenLabs', capabilities: 'Voice synthesis, neural voice cloning', status: 'ready', keyName: 'ELEVENLABS_API_KEY', accent: 'teal', category: 'audio' },
  { name: 'Runway', capabilities: 'Video generation, Gen-3 Alpha', status: 'ready', keyName: 'RUNWAY_API_KEY', accent: 'indigo', category: 'video' },
  { name: 'Replicate', capabilities: 'Flux 1.1 Pro, open source diffusion', status: 'ready', keyName: 'REPLICATE_API_KEY', accent: 'blue', category: 'image' },
  { name: 'Perplexity', capabilities: 'Live web citations, online research', status: 'ready', keyName: 'PERPLEXITY_API_KEY', accent: 'cyan', category: 'search' },
  { name: 'GitHub', capabilities: 'Repositories, issues, automated CI/CD', status: 'ready', keyName: 'GITHUB_TOKEN', accent: 'sky', category: 'code' },
  { name: 'TradingView', capabilities: 'Market charts, alerts, indicators', status: 'ready', keyName: 'TRADINGVIEW_API_KEY', accent: 'emerald', category: 'finance' },
  { name: 'Alpha Vantage', capabilities: 'Real-time stocks, forex, crypto quotes', status: 'ready', keyName: 'ALPHA_VANTAGE_API_KEY', accent: 'emerald', category: 'finance' },
  { name: 'Supabase', capabilities: 'Database, Auth, Storage, Edge Functions', status: 'connected', keyName: 'SUPABASE_URL + ANON_KEY', accent: 'emerald', category: 'database' },
];

export function ProviderHubWorkspace({ onBack, onNotify }: ProviderHubWorkspaceProps) {
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [filter, setFilter] = useState<'all' | 'text' | 'image' | 'audio' | 'video' | 'finance'>('all');

  const connectedCount = providers.filter((p) => p.status === 'connected').length;

  const handleToggleConnect = (name: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.name === name) {
          const newStatus = p.status === 'connected' ? 'ready' : 'connected';
          onNotify(`${name} ${newStatus === 'connected' ? 'connected successfully' : 'disconnected'}`);
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
  };

  const filtered = filter === 'all' ? providers : providers.filter((p) => p.category === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in select-text">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Network size={20} className="text-cyan-400" />
              Latest AI Models & Provider Hub
            </h2>
            <p className="text-xs text-slate-400">
              Manage API keys, inference routing, latency & connected neural backends
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span>
            {connectedCount} of {providers.length} Connected
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {['all', 'text', 'image', 'audio', 'video', 'finance'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-3 py-1.5 rounded-xl font-medium capitalize transition-all ${
              filter === tab
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const isConnected = item.status === 'connected';
          return (
            <div
              key={item.name}
              className={`p-5 rounded-2xl bg-[#060c24]/90 border transition-all flex flex-col justify-between ${
                isConnected
                  ? 'border-emerald-500/35 shadow-[0_0_20px_rgba(52,211,153,0.1)]'
                  : 'border-white/5 hover:border-cyan-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-indigo-600/30 border border-cyan-400/30 flex items-center justify-center font-bold text-xs text-cyan-200">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isConnected
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {isConnected ? 'Active & Ready' : 'Key Available'}
                      </span>
                    </div>
                  </div>
                  {isConnected && <Check size={18} className="text-emerald-400" />}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.capabilities}</p>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-cyan-200 mb-4">
                  <div className="text-[10px] text-slate-500 mb-0.5">ENV Variable</div>
                  {item.keyName}
                </div>
              </div>

              <button
                onClick={() => handleToggleConnect(item.name)}
                className={`w-full py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  isConnected
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                    : 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-200 border border-cyan-500/30 hover:bg-cyan-500/30'
                }`}
              >
                <Key size={13} />
                <span>{isConnected ? 'Disconnect' : 'Connect Key'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
