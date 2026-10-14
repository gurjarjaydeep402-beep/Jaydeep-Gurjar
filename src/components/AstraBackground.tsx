import React, { useEffect, useRef, useState } from 'react';
import { useAtmosphere } from '../lib/AtmosphereContext';

// Real Astrophotography Asset generated directly from user reference
const MILKY_WAY_REFERENCE_BG = '/src/assets/images/astra_cosmic_milky_way_1790865395979.jpg';

interface NebulaGlowNode {
  relX: number;
  relY: number;
  baseRadius: number;
  radiusPulseAmp: number;
  baseAlpha: number;
  alphaPulseAmp: number;
  pulseSpeed: number;
  pulsePhase: number;
  driftVx: number;
  driftVy: number;
  color: string;
}

interface Star {
  x: number;
  y: number;
  ox: number; // offset x from mouse gravitational repulsion
  oy: number; // offset y from mouse gravitational repulsion
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  hasSpikes?: boolean;
  spikeSize?: number;
}

interface CosmicDustParticle {
  x: number;
  y: number;
  ox: number; // offset x from mouse gravitational repulsion
  oy: number; // offset y from mouse gravitational repulsion
  radius: number;
  baseAlpha: number;
  alpha: number;
  vx: number;
  vy: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
}

interface SupernovaSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface SupernovaBurst {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  color: string;
  ringRadius: number;
  maxRingRadius: number;
  sparks: SupernovaSpark[];
}

type CosmicSceneMood = 'balanced' | 'cyan' | 'violet' | 'amber' | 'indigo';

interface AstraBackgroundProps {
  activeWorkspace?: string;
}

function getCosmicMood(workspace: string): CosmicSceneMood {
  switch (workspace) {
    case 'coding':
    case 'developer-ji':
    case 'connectors':
      return 'cyan';
    case 'image-generator':
    case 'video-generator':
    case 'ad-maker':
      return 'violet';
    case 'market':
    case 'audio':
    case 'analytics':
      return 'amber';
    case 'research':
    case 'files':
    case 'settings':
      return 'indigo';
    default:
      return 'balanced';
  }
}

/**
 * ASTRA Reference-Based Living Cosmic Background with Atmospheric Depth Control
 * 
 * Features:
 * 1. Primary Texture: Real high-resolution astrophotography asset based directly
 *    on the user's reference photograph, featuring the sweeping Milky Way galaxy arch.
 * 2. Unbroken Continuous Texture:
 *    - The photographic texture never unloads, blinks, or resets during navigation.
 *    - A multi-layer cross-fade smoothly shifts atmospheric ionization and photographic
 *      tonal grades across 1.2s when navigating between workspaces.
 * 3. Atmospheric Depth Modulation:
 *    - Controlled via useAtmosphere() from Control Hub settings.
 *    - Seamlessly scales cosmic dust motes and canvas oscillating radial nebula shimmer.
 * 4. Living Cosmic Particle Field:
 *    - Persistent canvas particle system with continuous stellar drift & twinkling.
 *    - Gravitational mouse interaction on particles.
 *    - Interactive subtle supernova bursts on background clicks.
 * 5. High-Clarity Glass Transparency:
 *    - Floating glass panels reveal the deep photographic galaxy across all workspaces.
 */
export function AstraBackground({ activeWorkspace = 'home' }: AstraBackgroundProps) {
  const { atmosphericDepth } = useAtmosphere();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const supernovaTriggerRef = useRef<((x: number, y: number) => void) | null>(null);
  const [motionReduced, setMotionReduced] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [transitionPulse, setTransitionPulse] = useState(false);

  // Depth factor: 65 is baseline 1.0; 0 is zero overlay; 100 is 1.54x max richness
  const depthFactor = atmosphericDepth / 65;
  const depthFactorRef = useRef(depthFactor);
  depthFactorRef.current = depthFactor;

  const currentMood = getCosmicMood(activeWorkspace);

  useEffect(() => {
    if (motionReduced) return;
    setTransitionPulse(true);
    const timer = setTimeout(() => {
      setTransitionPulse(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeWorkspace, motionReduced]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionReduced(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setMotionReduced(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    if (motionReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, input, textarea, a, select, [role="button"], [contenteditable="true"]')) {
        return;
      }
      if (supernovaTriggerRef.current) {
        supernovaTriggerRef.current(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [motionReduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let dustParticles: CosmicDustParticle[] = [];
    let bursts: SupernovaBurst[] = [];
    let nebulaNodes: NebulaGlowNode[] = [];

    const starColors = [
      '255, 255, 255', // Pure diamond white
      '224, 242, 254', // Starlight ice
      '186, 230, 253', // Electric Sirius cyan
      '216, 180, 254', // Electric Pleiades violet
      '244, 114, 182', // Ionized magenta
      '254, 240, 138', // Celestial gold
    ];

    supernovaTriggerRef.current = (x: number, y: number) => {
      if (motionReduced) return;

      const sparkCount = 14 + Math.floor(Math.random() * 8);
      const sparks: SupernovaSpark[] = [];
      const palette = ['255, 255, 255', '56, 189, 248', '192, 132, 252', '244, 114, 182', '254, 240, 138'];
      const burstColor = palette[Math.floor(Math.random() * palette.length)];

      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.45;
        const speed = 1.2 + Math.random() * 3.6;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 0.8 + Math.random() * 1.4,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: 0.95,
          decay: 0.016 + Math.random() * 0.018,
        });
      }

      bursts.push({
        x,
        y,
        age: 0,
        maxAge: 46,
        color: burstColor,
        ringRadius: 1.5,
        maxRingRadius: 26 + Math.random() * 12,
        sparks,
      });

      if (bursts.length > 8) {
        bursts.shift();
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Initialize Gentle Oscillating Radial Nebula Nodes
      nebulaNodes = [
        {
          relX: 0.22,
          relY: 0.26,
          baseRadius: Math.min(width, height) * 0.28,
          radiusPulseAmp: Math.min(width, height) * 0.04,
          baseAlpha: 0.055,
          alphaPulseAmp: 0.025,
          pulseSpeed: 0.005,
          pulsePhase: 0,
          driftVx: 0.00004,
          driftVy: 0.00003,
          color: '56, 189, 248', // Sirius cyan
        },
        {
          relX: 0.48,
          relY: 0.16,
          baseRadius: Math.min(width, height) * 0.32,
          radiusPulseAmp: Math.min(width, height) * 0.05,
          baseAlpha: 0.065,
          alphaPulseAmp: 0.03,
          pulseSpeed: 0.0042,
          pulsePhase: 1.8,
          driftVx: -0.00003,
          driftVy: 0.00004,
          color: '129, 140, 248', // Indigo / violet arch
        },
        {
          relX: 0.76,
          relY: 0.32,
          baseRadius: Math.min(width, height) * 0.30,
          radiusPulseAmp: Math.min(width, height) * 0.045,
          baseAlpha: 0.07,
          alphaPulseAmp: 0.035,
          pulseSpeed: 0.006,
          pulsePhase: 3.4,
          driftVx: 0.00003,
          driftVy: -0.00003,
          color: '192, 132, 252', // Pleiades lavender
        },
        {
          relX: 0.88,
          relY: 0.46,
          baseRadius: Math.min(width, height) * 0.24,
          radiusPulseAmp: Math.min(width, height) * 0.035,
          baseAlpha: 0.05,
          alphaPulseAmp: 0.025,
          pulseSpeed: 0.0048,
          pulsePhase: 4.8,
          driftVx: -0.00004,
          driftVy: -0.00002,
          color: '244, 114, 182', // Ionized magenta
        },
        {
          relX: 0.34,
          relY: 0.44,
          baseRadius: Math.min(width, height) * 0.22,
          radiusPulseAmp: Math.min(width, height) * 0.03,
          baseAlpha: 0.045,
          alphaPulseAmp: 0.02,
          pulseSpeed: 0.0055,
          pulsePhase: 2.3,
          driftVx: 0.00002,
          driftVy: 0.00003,
          color: '37, 99, 235', // Deep space cobalt
        },
      ];

      // Stars
      const starCount = Math.min(650, Math.max(220, Math.floor((width * height) / 2800)));
      stars = [];

      for (let i = 0; i < starCount; i++) {
        const t = Math.random();
        const x = t * width;
        const normalizedX = (x / width) - 0.5;
        const archCenterY = height * (0.12 + 0.32 * Math.pow(normalizedX, 2));
        const spread = (Math.random() + Math.random() - 1) * height * 0.25;
        const y = Math.random() < 0.65 ? (archCenterY + spread + height) % height : Math.random() * height;

        const roll = Math.random();
        let size = 0.6 + Math.random() * 0.8;
        let baseAlpha = 0.35 + Math.random() * 0.45;
        let twinkleSpeed = 0.008 + Math.random() * 0.018;
        let color = starColors[Math.floor(Math.random() * starColors.length)];

        const isFocal = roll > 0.92;
        if (isFocal) {
          size = 1.6 + Math.random() * 1.2;
          baseAlpha = 0.8 + Math.random() * 0.2;
          twinkleSpeed = 0.012 + Math.random() * 0.02;
        }

        const hasSpikes = isFocal && Math.random() < 0.45;
        const spikeSize = size * (3.5 + Math.random() * 2);

        stars.push({
          x,
          y,
          ox: 0,
          oy: 0,
          size,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed,
          twinklePhase: Math.random() * Math.PI * 2,
          color,
          hasSpikes,
          spikeSize,
        });
      }

      // Cosmic dust embers
      const dustCount = Math.min(70, Math.max(30, Math.floor((width * height) / 22000)));
      dustParticles = [];

      for (let i = 0; i < dustCount; i++) {
        dustParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          ox: 0,
          oy: 0,
          radius: 1.5 + Math.random() * 2.4,
          baseAlpha: 0.1 + Math.random() * 0.18,
          alpha: 0.14,
          vx: (Math.random() - 0.48) * 0.08,
          vy: (Math.random() - 0.5) * 0.05,
          pulseSpeed: 0.008 + Math.random() * 0.016,
          pulsePhase: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * 3)],
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const currentDepthMultiplier = depthFactorRef.current;

      // 1. RENDER GENTLE OSCILLATING RADIAL NEBULA GLOWS (Atmospheric Shimmer)
      // Scaled by Atmospheric Depth setting
      if (currentDepthMultiplier > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        for (let i = 0; i < nebulaNodes.length; i++) {
          const node = nebulaNodes[i];

          if (!motionReduced) {
            node.pulsePhase += node.pulseSpeed * 60 * dt;
            node.relX += node.driftVx * 60 * dt;
            node.relY += node.driftVy * 60 * dt;

            if (node.relX < 0.12 || node.relX > 0.92) node.driftVx *= -1;
            if (node.relY < 0.08 || node.relY > 0.60) node.driftVy *= -1;
          }

          const cx = node.relX * width;
          const cy = node.relY * height;
          const sinVal = Math.sin(node.pulsePhase);
          const currentRadius = Math.max(50, node.baseRadius + sinVal * node.radiusPulseAmp);
          const currentAlpha = Math.max(0, (node.baseAlpha + sinVal * node.alphaPulseAmp) * currentDepthMultiplier);

          if (currentAlpha > 0.001) {
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, currentRadius);
            grad.addColorStop(0, `rgba(${node.color}, ${currentAlpha})`);
            grad.addColorStop(0.45, `rgba(${node.color}, ${currentAlpha * 0.42})`);
            grad.addColorStop(1, `rgba(${node.color}, 0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, currentRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }

      const mouse = mouseRef.current;
      const hasMouse = mouse.active && !motionReduced;
      const mouseRadius = 145;
      const mouseRadiusSq = mouseRadius * mouseRadius;

      // 2. Render Drifting Cosmic Dust Motes
      // Modulated by Atmospheric Depth slider
      if (currentDepthMultiplier > 0.01) {
        for (let i = 0; i < dustParticles.length; i++) {
          const dust = dustParticles[i];

          if (!motionReduced) {
            dust.x += dust.vx * 60 * dt;
            dust.y += dust.vy * 60 * dt;

            if (dust.x < -20) dust.x = width + 20;
            else if (dust.x > width + 20) dust.x = -20;
            if (dust.y < -20) dust.y = height + 20;
            else if (dust.y > height + 20) dust.y = -20;

            dust.pulsePhase += dust.pulseSpeed * 60 * dt;
            dust.alpha = Math.max(0, (dust.baseAlpha + Math.sin(dust.pulsePhase) * 0.06) * currentDepthMultiplier);

            if (hasMouse) {
              const curX = dust.x + dust.ox;
              const curY = dust.y + dust.oy;
              const dx = curX - mouse.x;
              const dy = curY - mouse.y;
              const distSq = dx * dx + dy * dy;

              if (distSq < mouseRadiusSq && distSq > 0.1) {
                const dist = Math.sqrt(distSq);
                const force = 1 - dist / mouseRadius;
                const pushX = (dx / dist) * force * 30;
                const pushY = (dy / dist) * force * 30;
                dust.ox += (pushX - dust.ox) * 0.14;
                dust.oy += (pushY - dust.oy) * 0.14;
                dust.alpha = Math.min(0.5, dust.alpha + force * 0.1 * currentDepthMultiplier);
              } else {
                dust.ox *= 0.90;
                dust.oy *= 0.90;
              }
            } else {
              dust.ox *= 0.90;
              dust.oy *= 0.90;
            }
          }

          const dustDrawX = dust.x + dust.ox;
          const dustDrawY = dust.y + dust.oy;

          if (dustDrawX < -30 || dustDrawX > width + 30 || dustDrawY < -30 || dustDrawY > height + 30) continue;
          if (dust.alpha <= 0.005) continue;

          ctx.beginPath();
          ctx.arc(dustDrawX, dustDrawY, dust.radius * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dust.color}, ${dust.alpha * 0.35})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(dustDrawX, dustDrawY, dust.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dust.color}, ${dust.alpha})`;
          ctx.fill();
        }
      }

      // 3. Render Sparkling Stars & Diffraction Spikes
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!motionReduced) {
          star.twinklePhase += star.twinkleSpeed * 60 * dt;
          star.alpha = Math.max(0.15, star.baseAlpha + Math.sin(star.twinklePhase) * 0.32);

          star.x = (star.x - 0.008 * 60 * dt + width) % width;

          if (hasMouse) {
            const curX = star.x + star.ox;
            const curY = star.y + star.oy;
            const dx = curX - mouse.x;
            const dy = curY - mouse.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < mouseRadiusSq && distSq > 0.1) {
              const dist = Math.sqrt(distSq);
              const force = 1 - dist / mouseRadius;
              const pushX = (dx / dist) * force * 20;
              const pushY = (dy / dist) * force * 20;
              star.ox += (pushX - star.ox) * 0.12;
              star.oy += (pushY - star.oy) * 0.12;
            } else {
              star.ox *= 0.91;
              star.oy *= 0.91;
            }
          } else {
            star.ox *= 0.91;
            star.oy *= 0.91;
          }
        }

        const drawX = star.x + star.ox;
        const drawY = star.y + star.oy;

        if (drawX < -15 || drawX > width + 15 || drawY < -15 || drawY > height + 15) continue;

        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;

        if (star.hasSpikes && star.spikeSize) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color}, ${star.alpha * 0.3})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
          ctx.fill();

          ctx.strokeStyle = `rgba(${star.color}, ${star.alpha * 0.6})`;
          ctx.lineWidth = 0.8;
          const sp = star.spikeSize;

          ctx.beginPath();
          ctx.moveTo(drawX - sp, drawY);
          ctx.lineTo(drawX + sp, drawY);
          ctx.moveTo(drawX, drawY - sp);
          ctx.lineTo(drawX + sp, drawY);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Render Tiny Supernova Bursts
      for (let b = bursts.length - 1; b >= 0; b--) {
        const burst = bursts[b];
        burst.age += 60 * dt;
        const progress = Math.min(1, burst.age / burst.maxAge);
        const fadeOut = Math.max(0, 1 - progress);

        burst.ringRadius += (burst.maxRingRadius - burst.ringRadius) * 0.14;
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, burst.ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${burst.color}, ${fadeOut * 0.55})`;
        ctx.lineWidth = Math.max(0.4, 1.4 * (1 - progress));
        ctx.stroke();

        if (progress < 0.35) {
          const spikeFade = 1 - progress / 0.35;
          const spikeLen = 14 * spikeFade;
          ctx.strokeStyle = `rgba(255, 255, 255, ${spikeFade * 0.85})`;
          ctx.lineWidth = 0.85;

          ctx.beginPath();
          ctx.moveTo(burst.x - spikeLen, burst.y);
          ctx.lineTo(burst.x + spikeLen, burst.y);
          ctx.moveTo(burst.x, burst.y - spikeLen);
          ctx.lineTo(burst.x + spikeLen, burst.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(burst.x, burst.y, 2.5 * spikeFade, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${spikeFade * 0.9})`;
          ctx.fill();
        }

        for (let s = 0; s < burst.sparks.length; s++) {
          const spark = burst.sparks[s];
          spark.x += spark.vx * 60 * dt;
          spark.y += spark.vy * 60 * dt;
          spark.vx *= 0.94;
          spark.vy *= 0.94;
          spark.alpha = Math.max(0, spark.alpha - spark.decay * 60 * dt);

          if (spark.alpha > 0.02) {
            ctx.beginPath();
            ctx.arc(spark.x, spark.y, spark.size * Math.max(0.4, spark.alpha), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${spark.color}, ${spark.alpha})`;
            ctx.fill();
          }
        }

        if (progress >= 1) {
          bursts.splice(b, 1);
        }
      }

      if (!motionReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (motionReduced) {
      render(performance.now());
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!motionReduced) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [motionReduced]);

  const getImageFilter = () => {
    switch (currentMood) {
      case 'cyan':
        return 'contrast(1.12) brightness(1.05) saturate(1.22) hue-rotate(-7deg)';
      case 'violet':
        return 'contrast(1.11) brightness(1.04) saturate(1.24) hue-rotate(6deg)';
      case 'amber':
        return 'contrast(1.09) brightness(1.06) saturate(1.18) sepia(0.04)';
      case 'indigo':
        return 'contrast(1.14) brightness(1.02) saturate(1.12)';
      default:
        return 'contrast(1.1) brightness(1.04) saturate(1.15)';
    }
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#020514]"
      aria-hidden="true"
    >
      {/* 1. LAYER 1 (z-0): CONTINUOUS REAL ASTROPHOTOGRAPHY MILKY WAY TEXTURE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={MILKY_WAY_REFERENCE_BG}
          alt="ASTRA Cosmic Milky Way Galaxy Reference Sky"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`
            w-full h-full object-cover object-[50%_18%] sm:object-[50%_22%] lg:object-[50%_25%]
            select-none pointer-events-none
            transition-opacity duration-700
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            transform: 'scale(1.04)',
            filter: getImageFilter(),
            transition: 'filter 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease',
            animation: motionReduced ? 'none' : 'astra-photo-breathing 48s ease-in-out infinite alternate',
          }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#050b28] to-[#020412]" />
        )}
      </div>

      {/* 2. LAYER 2 (z-[1]): Atmospheric Shimmer & Ionization Mood Layers (Depth Controlled) */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[75vw] h-[65vh] pointer-events-none mix-blend-screen transition-opacity duration-1000"
        style={{
          background:
            'radial-gradient(ellipse at 35% 40%, rgba(56, 189, 248, 0.42) 0%, rgba(37, 99, 235, 0.25) 35%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: Math.max(0, Math.min(0.85, (currentMood === 'cyan' ? 0.5 : 0.3) * (atmosphericDepth / 65))),
        }}
      />

      <div
        className="absolute -top-[8%] right-[-10%] w-[80vw] h-[70vh] pointer-events-none mix-blend-screen transition-opacity duration-1000"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(192, 132, 252, 0.44) 0%, rgba(217, 70, 239, 0.26) 35%, transparent 75%)',
          filter: 'blur(85px)',
          opacity: Math.max(0, Math.min(0.85, (currentMood === 'violet' ? 0.5 : 0.3) * (atmosphericDepth / 65))),
        }}
      />

      <div
        className="absolute -bottom-[5%] left-[20%] w-[60vw] h-[30vh] pointer-events-none mix-blend-screen transition-opacity duration-1000"
        style={{
          background:
            'radial-gradient(ellipse at 50% 80%, rgba(251, 191, 36, 0.35) 0%, rgba(249, 115, 22, 0.18) 45%, transparent 75%)',
          filter: 'blur(90px)',
          opacity: Math.max(0, Math.min(0.65, (currentMood === 'amber' ? 0.35 : 0.15) * (atmosphericDepth / 65))),
        }}
      />

      <div
        className={`absolute inset-0 z-[1] pointer-events-none mix-blend-screen transition-opacity duration-1000 ${
          transitionPulse ? 'opacity-30' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(224, 242, 254, 0.2) 0%, rgba(56, 189, 248, 0.12) 40%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* 3. LAYER 3 (z-[2]): Canvas Layer with Depth-Controlled Nebula Glows, Dust Motes, Starfield & Bursts */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 1 }}
        />
      </div>

      {/* 4. LAYER 4 (z-[3]): Subtle Edge Vignette */}
      <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_68%,rgba(1,4,15,0.48)_100%)] pointer-events-none" />
    </div>
  );
}

// Backward compatible export
export { AstraBackground as SpaceNeonBackground };
