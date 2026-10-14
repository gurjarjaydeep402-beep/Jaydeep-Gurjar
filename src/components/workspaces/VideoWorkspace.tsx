import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clapperboard,
  Download,
  ExternalLink,
  Film,
  Layers,
  Maximize2,
  Mic,
  Music,
  Pause,
  Play,
  PlaySquare,
  Plus,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Subtitles,
  Video,
  Volume2,
  Zap,
} from 'lucide-react';
import { useCredits } from '../../lib/CreditContext';
import { useConnectors } from '../../lib/ConnectorsContext';

interface VideoWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

interface SceneClip {
  id: string;
  title: string;
  duration: string;
  motion: string;
  prompt: string;
  color: string;
}

export function VideoWorkspace({ onBack, onNotify }: VideoWorkspaceProps) {
  const { deductCredits } = useCredits();
  const { isServiceConnected, toggleConnector } = useConnectors();

  const isYouTubeConnected = isServiceConnected('youtube');

  const [prompt, setPrompt] = useState(
    'Cinematic FPV drone shot accelerating through a glowing neon cyberpunk nebula city at midnight, volumetric rain reflections, 4k 60fps photorealistic'
  );
  const [isRendering, setIsRendering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimecode, setCurrentTimecode] = useState('00:00:04:18');
  const [activeStream, setActiveStream] = useState<string | null>(null);

  const [scenes, setScenes] = useState<SceneClip[]>([
    {
      id: 'sc-1',
      title: 'Scene 1: Cyberpunk Orbital Ingress',
      duration: '4.5s',
      motion: 'FPV Dive',
      prompt: 'Cybernetic drop-pod entering planetary atmosphere with orange plasma shield ionization',
      color: 'from-blue-600 to-indigo-800',
    },
    {
      id: 'sc-2',
      title: 'Scene 2: Neon Skyline Flythrough',
      duration: '5.2s',
      motion: 'Pan Left Orbit',
      prompt: 'Gliding between holographic high-rise monoliths with glowing delta logo projections',
      color: 'from-purple-600 to-pink-800',
    },
    {
      id: 'sc-3',
      title: 'Scene 3: Quantum Reactor Core Awakening',
      duration: '6.0s',
      motion: 'Zoom Inward Push',
      prompt: 'Pulsing cyan energy beam focusing into magnetic levitation containment field',
      color: 'from-cyan-600 to-teal-800',
    },
  ]);

  const handleRenderScene = () => {
    if (!prompt.trim() || isRendering) return;

    const ok = deductCredits(5, 'Video Generator Render', 'Astra Cinematic Engine');
    if (!ok) return;

    setIsRendering(true);
    onNotify('ASTRA Cinematic Engine rendering video sequence...');

    setTimeout(() => {
      const newScene: SceneClip = {
        id: `sc-${Date.now()}`,
        title: `Scene ${scenes.length + 1}: ${prompt.slice(0, 24)}...`,
        duration: '5.0s',
        motion: 'Dynamic Dolly',
        prompt: prompt,
        color: 'from-rose-600 to-orange-800',
      };
      setScenes((prev) => [...prev, newScene]);
      setIsRendering(false);
      onNotify('Rendered new video scene successfully in 4K resolution!');
    }, 2200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in select-text bg-[#0C081F] p-6 rounded-3xl border border-indigo-900/40 shadow-2xl">
      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-4 border-b border-indigo-500/25">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)]">
              <Film size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                ASTRA Video Studio & Timeline
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Gen-3 Movie Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">Storyboard assembly, multi-track timeline, camera motion, and stream sync</p>
            </div>
          </div>
        </div>

        {/* YouTube Cross-Link Status indicator */}
        <div className="flex items-center gap-2">
          {isYouTubeConnected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
              <span>YouTube Sync Active</span>
            </div>
          ) : (
            <button
              onClick={() => {
                toggleConnector('youtube');
                onNotify('YouTube Data API connector activated!');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-mono transition-colors"
            >
              <PlaySquare size={14} />
              <span>Enable YouTube Integration</span>
            </button>
          )}
        </div>
      </div>

      {/* YOUTUBE INTEGRATION CROSS-LINK PANEL */}
      {isYouTubeConnected && (
        <div className="p-4 rounded-2xl bg-[#0e163b]/90 border border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.15)] space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlaySquare size={16} className="text-rose-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                YouTube Live Streams & Trending Stream Feeds (Synchronized)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              ● Connected via Cloud Connectors
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                title: 'ASTRA 4 AI Keynote Stream (4K 60fps)',
                url: 'https://youtube.com/live/astra-4-keynote-4k',
                views: '4.2K watching',
              },
              {
                title: 'Quantum Neural Compute Live Simulation',
                url: 'https://youtube.com/live/quantum-neural-compute',
                views: '1.8K watching',
              },
              {
                title: 'Cyberpunk Atmospheric Cinematic Render',
                url: 'https://youtube.com/live/cyberpunk-cinematic-render',
                views: '3.1K watching',
              },
            ].map((stream, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveStream(stream.url);
                  onNotify(`Loaded "${stream.title}" into Video Timeline!`);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  activeStream === stream.url
                    ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900/60 border-white/5 hover:border-cyan-400/40'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-rose-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    LIVE MOCK STREAM
                  </span>
                  <h5 className="text-xs font-semibold text-white mt-1 leading-snug">{stream.title}</h5>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-white/5">
                  <span className="text-cyan-300 font-medium truncate max-w-[140px]">{stream.url}</span>
                  <span className="text-emerald-400">{stream.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Video Viewport & Player Preview */}
      <div className="rounded-3xl p-5 bg-[#070b20] border border-indigo-500/30 shadow-inner flex flex-col items-center">
        {/* Viewport Display */}
        <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#120b2e] via-[#09061c] to-[#04081c] border border-cyan-500/30 flex flex-col justify-between p-6 shadow-2xl">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded-lg bg-black/60 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>4K CINEMATIC PREVIEW</span>
            </span>

            <span className="font-mono text-xs text-slate-300 bg-black/60 px-3 py-1 rounded-lg">
              {currentTimecode}
            </span>
          </div>

          {/* Central Graphics representation */}
          <div className="flex flex-col items-center justify-center my-auto z-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.5)] animate-pulse">
              <Play size={28} className="text-white ml-1" />
            </div>
            <h3 className="text-base font-bold text-white max-w-md">
              {activeStream ? `Broadcasting: ${activeStream}` : scenes[0]?.title}
            </h3>
            <p className="text-xs text-slate-300 max-w-sm">
              Volumetric lighting, 60 FPS motion interpolation, and dynamic camera trajectory active.
            </p>
          </div>

          {/* Bottom Player Controls */}
          <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={() => setCurrentTimecode('00:00:00:00')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <RotateCcw size={15} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Volume2 size={15} />
              <span>Dolby Atmos 7.1</span>
            </div>
          </div>

          {/* Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #f43f5e 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
      </div>

      {/* MOVIE TIMELINE VIEW COMPONENTS & TRACK SLOTS */}
      <div className="rounded-3xl p-5 bg-[#080d26] border border-cyan-500/25 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Multi-Track Movie Timeline
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Total Duration: 15.7s · 3 Scenes</span>
        </div>

        {/* Timeline Tracks */}
        <div className="space-y-3 font-mono text-xs">
          {/* TRACK 1: Video & Storyboard Clips */}
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0 flex items-center gap-1.5 text-rose-300 font-bold text-[11px]">
              <Film size={14} />
              <span>VIDEO TRK</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {scenes.map((scene, i) => (
                <div
                  key={scene.id}
                  className={`p-3 rounded-xl bg-gradient-to-r ${scene.color} border border-white/20 text-white flex flex-col justify-between shadow-md`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold">{scene.title.split(':')[0]}</span>
                    <span>{scene.duration}</span>
                  </div>
                  <p className="text-[11px] font-sans truncate mt-1 text-slate-100">{scene.prompt}</p>
                  <span className="text-[9px] font-mono mt-2 bg-black/40 px-1.5 py-0.5 rounded w-max">
                    Motion: {scene.motion}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TRACK 2: Audio & Waveform */}
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0 flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
              <Music size={14} />
              <span>AUDIO TRK</span>
            </div>
            <div className="flex-1 h-12 rounded-xl bg-slate-950/80 border border-cyan-500/20 p-2 flex items-center justify-between">
              {/* Audio waveform mockup */}
              <div className="flex items-center gap-1 w-full h-full px-2">
                {[12, 28, 40, 18, 34, 48, 22, 36, 14, 42, 20, 30, 45, 16, 26, 38, 50, 24, 18, 32, 44, 28, 14, 38, 46, 20].map(
                  (h, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-cyan-400/70 rounded-full"
                      style={{ height: `${h}%` }}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* TRACK 3: Subtitles / Effects */}
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0 flex items-center gap-1.5 text-purple-300 font-bold text-[11px]">
              <Subtitles size={14} />
              <span>VFX / SUBS</span>
            </div>
            <div className="flex-1 h-10 rounded-xl bg-slate-950/80 border border-purple-500/20 px-3 flex items-center justify-between text-[11px] text-purple-300">
              <span>LUT: Cyberpunk Prism High-Contrast</span>
              <span>Subtitles: English (Auto-Timed)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render Prompt Bar */}
      <div className="rounded-2xl p-4 bg-[#080d26] border border-rose-500/30 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your next cinematic video scene..."
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-rose-400 font-sans"
        />

        <button
          onClick={handleRenderScene}
          disabled={isRendering}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white hover:brightness-110 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.35)] shrink-0"
        >
          <Sparkles size={14} />
          <span>{isRendering ? 'Rendering Scene...' : 'Render Scene (5 Cr)'}</span>
        </button>
      </div>
    </div>
  );
}
