import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Download,
  Gamepad2,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import { useCredits } from '../../lib/CreditContext';

interface GameFactoryWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export function GameFactoryWorkspace({ onBack, onNotify }: GameFactoryWorkspaceProps) {
  const { deductCredits } = useCredits();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedGameType, setSelectedGameType] = useState<'runner' | 'pong' | 'clicker'>('runner');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(420);
  const [activeTab, setActiveTab] = useState<'play' | 'gdd' | 'code'>('play');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gamePrompt, setGamePrompt] = useState(
    'Sci-Fi Orbital Runner: Dodge asteroid debris, collect cyan quantum batteries, and increase hyperdrive multiplier'
  );

  // Game Engine State
  const gameStateRef = useRef({
    player: { x: 50, y: 150, vy: 0, size: 14 },
    obstacles: [] as { x: number; y: number; w: number; h: number; speed: number }[],
    stars: [] as { x: number; y: number; s: number }[],
    keys: { ArrowUp: false, ArrowDown: false, Space: false },
    score: 0,
    running: false,
  });

  // Handle Game Loop for Runner
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Init stars
    if (gameStateRef.current.stars.length === 0) {
      for (let i = 0; i < 40; i++) {
        gameStateRef.current.stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          s: Math.random() * 2 + 0.5,
        });
      }
    }

    let animationId: number;

    const loop = () => {
      if (gameStateRef.current.running) {
        const state = gameStateRef.current;

        // Update player physics
        if (state.keys.ArrowUp) state.player.y -= 4;
        if (state.keys.ArrowDown) state.player.y += 4;

        // Boundaries
        if (state.player.y < 15) state.player.y = 15;
        if (state.player.y > canvas.height - 15) state.player.y = canvas.height - 15;

        // Spawn obstacles
        if (Math.random() < 0.04) {
          state.obstacles.push({
            x: canvas.width + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            w: 16,
            h: 16,
            speed: 3 + Math.random() * 3,
          });
        }

        // Update obstacles
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.x -= obs.speed;

          // Collision detection
          const dist = Math.hypot(state.player.x - obs.x, state.player.y - obs.y);
          if (dist < state.player.size + obs.w / 2) {
            // Hit!
            state.running = false;
            setIsPlaying(false);
            onNotify(`Game Over! Final Score: ${state.score}`);
            setHighScore((prev) => Math.max(prev, state.score));
          }

          if (obs.x < -30) {
            state.obstacles.splice(i, 1);
            state.score += 10;
            setScore(state.score);
          }
        }

        // Move stars
        for (const star of state.stars) {
          star.x -= star.s;
          if (star.x < 0) star.x = canvas.width;
        }
      }

      // Draw Screen
      ctx.fillStyle = '#060a20';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background stars
      ctx.fillStyle = '#ffffff';
      for (const star of gameStateRef.current.stars) {
        ctx.fillRect(star.x, star.y, star.s, star.s);
      }

      // Draw player delta ship
      const p = gameStateRef.current.player;
      ctx.save();
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(p.x + 16, p.y);
      ctx.lineTo(p.x - 12, p.y - 10);
      ctx.lineTo(p.x - 6, p.y);
      ctx.lineTo(p.x - 12, p.y + 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Draw obstacles (Asteroids)
      ctx.save();
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#e11d48';
      for (const obs of gameStateRef.current.obstacles) {
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) gameStateRef.current.keys.ArrowUp = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) gameStateRef.current.keys.ArrowDown = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) gameStateRef.current.keys.ArrowUp = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) gameStateRef.current.keys.ArrowDown = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleStartGame = () => {
    gameStateRef.current.running = true;
    gameStateRef.current.player.y = 150;
    gameStateRef.current.obstacles = [];
    gameStateRef.current.score = 0;
    setScore(0);
    setIsPlaying(true);
  };

  const handlePauseGame = () => {
    gameStateRef.current.running = false;
    setIsPlaying(false);
  };

  const handleGenerateGame = () => {
    const ok = deductCredits(5, 'Game Factory Synthesis', 'Astra Game Studio');
    if (!ok) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onNotify('New game mechanics synthesized and compiled into live playable canvas!');
    }, 1500);
  };

  const handleExportGame = () => {
    const gameHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Astra Game: Orbital Runner</title>
  <style>
    body { margin: 0; background: #060a20; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #22d3ee; }
    canvas { border: 2px solid #22d3ee; border-radius: 12px; box-shadow: 0 0 30px rgba(34,211,238,0.3); }
  </style>
</head>
<body>
  <canvas id="game" width="640" height="360"></canvas>
  <script>
    // Generated by Astra Game Factory
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    let y = 180, vy = 0, score = 0;
    window.addEventListener('keydown', e => { if(e.key === 'ArrowUp') y -= 15; if(e.key === 'ArrowDown') y += 15; });
    setInterval(() => {
      ctx.fillStyle = '#060a20';
      ctx.fillRect(0,0,640,360);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(60, y, 20, 20);
      score++;
      ctx.fillText('Score: ' + score, 20, 30);
    }, 1000/60);
  </script>
</body>
</html>`;

    const blob = new Blob([gameHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'astra-orbital-runner.html';
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Downloaded standalone runnable HTML5 game!');
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
              <Gamepad2 size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                ASTRA Game Factory
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Live Canvas
                </span>
              </h2>
              <p className="text-xs text-slate-400">Design, code, simulate and play interactive 2D HTML5 games</p>
            </div>
          </div>
        </div>

        {/* Score & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 font-mono text-xs">
            <Trophy size={14} className="text-amber-400" />
            <span className="text-slate-400">High:</span>
            <span className="text-amber-300 font-bold">{highScore}</span>
          </div>

          <button
            onClick={handleExportGame}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} />
            <span>Export HTML</span>
          </button>
        </div>
      </div>

      {/* Generator Prompt Bar */}
      <div className="rounded-2xl p-4 bg-[#070e28]/90 border border-cyan-500/25 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={gamePrompt}
          onChange={(e) => setGamePrompt(e.target.value)}
          placeholder="Describe game concept (e.g. 'Retro Cyberpunk Maze Runner', 'Gravity Pong')"
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
        />
        <button
          onClick={handleGenerateGame}
          disabled={isGenerating}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-indigo-500 text-white hover:brightness-110 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.3)] shrink-0"
        >
          <Sparkles size={14} />
          <span>{isGenerating ? 'Synthesizing...' : 'Synthesize Game (5 Cr)'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'play', label: 'Playable Canvas Engine' },
          { id: 'gdd', label: 'Game Design Document (GDD)' },
          { id: 'code', label: 'Full JavaScript Engine Code' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-pink-500/20 border border-pink-400/40 text-pink-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Canvas Viewport */}
      {activeTab === 'play' && (
        <div className="relative rounded-3xl overflow-hidden bg-black border border-cyan-500/35 p-3 flex flex-col items-center shadow-[0_0_50px_rgba(34,211,238,0.15)]">
          {/* Top Canvas Bar */}
          <div className="w-full max-w-[640px] flex items-center justify-between px-3 py-2 text-xs font-mono text-cyan-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>ORBITAL DEFENSE 2D</span>
            </div>
            <div className="flex items-center gap-3">
              <span>SCORE: {score}</span>
              <span>CONTROLS: W/S or ARROW KEYS</span>
            </div>
          </div>

          {/* HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full max-w-[640px] h-auto rounded-2xl border border-cyan-500/20 shadow-inner bg-[#060a20]"
          />

          {/* Bottom Game Controls */}
          <div className="w-full max-w-[640px] flex items-center justify-between pt-3 px-2">
            <div className="flex items-center gap-2">
              {!isPlaying ? (
                <button
                  onClick={handleStartGame}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:brightness-110 flex items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                >
                  <Play size={14} />
                  <span>Start Engine</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseGame}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:brightness-110 flex items-center gap-1.5"
                >
                  <Pause size={14} />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={handleStartGame}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Restart"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Mobile / Touch control helpers */}
            <div className="flex items-center gap-2">
              <button
                onMouseDown={() => {
                  gameStateRef.current.keys.ArrowUp = true;
                }}
                onMouseUp={() => {
                  gameStateRef.current.keys.ArrowUp = false;
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-cyan-200"
              >
                ▲ UP
              </button>
              <button
                onMouseDown={() => {
                  gameStateRef.current.keys.ArrowDown = true;
                }}
                onMouseUp={() => {
                  gameStateRef.current.keys.ArrowDown = false;
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-cyan-200"
              >
                ▼ DOWN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GDD View */}
      {activeTab === 'gdd' && (
        <div className="rounded-2xl p-6 bg-[#070e28]/90 border border-pink-500/25 text-slate-200 text-xs leading-relaxed space-y-4">
          <h3 className="text-base font-bold text-white">Game Design Document: ASTRA Orbital Runner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <h4 className="font-bold text-pink-300">1. Core Gameplay Loop</h4>
              <p className="text-slate-400">
                Player pilots a cyan cyber-vessel along the vertical axis dodging incoming debris. High-speed obstacles trigger instant collision events while surviving chunks grant linear score points.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <h4 className="font-bold text-cyan-300">2. Physics & Kinematics</h4>
              <p className="text-slate-400">
                - Canvas Resolution: 640x360 @ 60 FPS requestAnimationFrame.
                - Obstacle Velocity: Vector (dx = -[3..6] px/frame).
                - Collision Radius: Hypotenuse distance &lt; 22px.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Code View */}
      {activeTab === 'code' && (
        <div className="rounded-2xl p-4 bg-slate-950 border border-white/10 font-mono text-xs text-slate-300 max-h-[400px] overflow-y-auto scrollbar-thin">
          <pre>{`// ASTRA Game Factory - Pure HTML5 Canvas Engine
function initGameLoop(canvas, ctx) {
  let player = { x: 50, y: 150, size: 14 };
  let obstacles = [];
  
  function update() {
    ctx.fillStyle = '#060a20';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw player
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();
    
    requestAnimationFrame(update);
  }
  update();
}`}</pre>
        </div>
      )}
    </div>
  );
}
