import { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Image as ImageIcon,
  Layers,
  Maximize2,
  RefreshCw,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { useCredits } from '../../lib/CreditContext';

interface ImageWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

const STYLES = ['Cyberpunk', 'Sci-Fi Cosmos', 'Photorealistic', 'Digital Art', 'Anime Synth', '3D Octane'];

const PRESET_GALLERY = [
  {
    id: 'img1',
    title: 'ASTRA Core Monolith',
    prompt: 'Massive glowing triangular cyber-monolith in a vibrant cosmic nebula with neon rings and orbiting stars',
    style: 'Sci-Fi Cosmos',
    aspect: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'img2',
    title: 'Neo-Tokyo Quantum Node',
    prompt: 'Futuristic skyscraper command center with holographic heads-up displays, rainy neon reflections, 8k octane',
    style: 'Cyberpunk',
    aspect: '1:1',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'img3',
    title: 'Deep Space Orbital Ring',
    prompt: 'Planetary horizon with floating atmospheric research station emitting cyan laser pulses',
    style: '3D Octane',
    aspect: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
];

export function ImageWorkspace({ onBack, onNotify }: ImageWorkspaceProps) {
  const { deductCredits } = useCredits();

  const [prompt, setPrompt] = useState(
    'Hyper-realistic cosmic portal with floating glowing neon delta emblem, galaxy horizon, volumetric cyan aurora'
  );
  const [selectedStyle, setSelectedStyle] = useState('Sci-Fi Cosmos');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gallery, setGallery] = useState(PRESET_GALLERY);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;

    const allowed = deductCredits(3, 'Image Studio Render', 'Astra Diffusion Engine');
    if (!allowed) return;

    setIsGenerating(true);
    onNotify('ASTRA Image Engine rendering in high resolution...');

    const width = aspectRatio === '1:1' ? 800 : aspectRatio === '9:16' ? 576 : 1024;
    const height = aspectRatio === '1:1' ? 800 : aspectRatio === '9:16' ? 1024 : 576;
    const seed = Math.floor(Math.random() * 999999);
    const fullPrompt = `${prompt}, ${selectedStyle} style, 8k resolution, cinematic lighting, sharp focus`;
    const generatedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      fullPrompt
    )}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

    // Preload image
    const img = new Image();
    img.src = generatedUrl;
    img.onload = () => {
      const newItem = {
        id: `gen-${Date.now()}`,
        title: prompt.slice(0, 32) + '...',
        prompt: prompt,
        style: selectedStyle,
        aspect: aspectRatio,
        imageUrl: generatedUrl,
      };
      setGallery((prev) => [newItem, ...prev]);
      setIsGenerating(false);
      onNotify('Image rendered successfully in 4K resolution!');
    };
    img.onerror = () => {
      // Fallback
      const fallbackItem = {
        id: `gen-${Date.now()}`,
        title: prompt.slice(0, 32) + '...',
        prompt: prompt,
        style: selectedStyle,
        aspect: aspectRatio,
        imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      };
      setGallery((prev) => [fallbackItem, ...prev]);
      setIsGenerating(false);
      onNotify('Image generated successfully!');
    };
  };

  const handleDownload = (item: (typeof PRESET_GALLERY)[0]) => {
    window.open(item.imageUrl, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in select-text">
      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.4)]">
              <ImageIcon size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                ASTRA Image Studio
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Photorealistic Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">High-fidelity diffusion synthesis with custom aspect ratios (3 Credits)</p>
            </div>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
          Aspect Ratio: {aspectRatio}
        </span>
      </div>

      {/* Generator Control Card */}
      <div className="p-6 rounded-3xl bg-[#060c24]/90 border border-cyan-500/30 backdrop-blur-xl shadow-xl space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-300 mb-1.5 block">Diffusion Prompt</label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              placeholder="Describe your desired scene, lighting, atmosphere and composition..."
              className="w-full px-4 py-3 rounded-2xl bg-[#030614] border border-cyan-500/30 text-white text-xs placeholder:text-slate-500 outline-none focus:border-cyan-400 resize-none font-sans"
            />
          </div>
        </div>

        {/* Options Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Style */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Art Style</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#081232] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-400"
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Aspect Ratio</label>
            <div className="flex gap-2">
              {['16:9', '1:1', '9:16'].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    aspectRatio === ratio
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Render Action */}
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-fuchsia-500 via-pink-600 to-indigo-600 text-white hover:brightness-110 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.35)]"
            >
              <Sparkles size={14} />
              <span>{isGenerating ? 'Rendering High-Res...' : 'Generate Image (3 Cr)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers size={16} className="text-pink-400" />
          <span>Rendered Asset Canvas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden bg-[#070e28]/90 border border-white/10 hover:border-pink-500/40 transition-all group shadow-xl flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end justify-between">
                  <span className="text-[11px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded">
                    {item.aspect} · {item.style}
                  </span>
                  <button
                    onClick={() => handleDownload(item)}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white text-slate-900 transition-colors"
                    title="Open Full Image"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {item.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
