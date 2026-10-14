import React from 'react';
import { AstraLogo } from './AstraLogo';

/**
 * CosmicHeroGraphic
 * 
 * Recreates the central celestial chamber from the MASTER REFERENCE IMAGE:
 * - Upper-left celestial moon orb with orbital ring
 * - Upper-right large celestial planet sphere with atmospheric rim glow
 * - Concentric glowing neon orbit halos and dashed particle rings
 * - Central large luminous ASTRA A Emblem with cyan-to-magenta crystal wings and orbital loop
 * - Curved celestial horizon arc with vibrant electric cyan neon rim light
 */
export function CosmicHeroGraphic({ className = '' }: { className?: string }) {
  return (
    <div className={`relative pointer-events-none select-none overflow-hidden ${className}`}>
      {/* Background Twinkling Starlight Points */}
      <div className="absolute inset-0 opacity-90">
        <div className="absolute top-[12%] left-[18%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_#ffffff] animate-pulse" />
        <div className="absolute top-[20%] left-[82%] w-2 h-2 bg-cyan-200 rounded-full shadow-[0_0_15px_#22d3ee]" />
        <div className="absolute top-[44%] left-[6%] w-1 h-1 bg-fuchsia-300 rounded-full opacity-80" />
        <div className="absolute top-[14%] left-[36%] w-1.5 h-1.5 bg-blue-100 rounded-full opacity-90" />
        <div className="absolute top-[60%] left-[89%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#ffffff]" />
        <div className="absolute top-[30%] left-[92%] w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_12px_#22d3ee]" />
        <div className="absolute top-[7%] left-[65%] w-1.5 h-1.5 bg-purple-200 rounded-full opacity-80" />
        <div className="absolute top-[36%] left-[24%] w-1 h-1 bg-cyan-100 rounded-full opacity-70" />
      </div>

      {/* SVG Celestial Scene: Planets, Orbit Rings, and Horizon */}
      <svg
        viewBox="0 0 800 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover sm:object-contain"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Planet Horizon Curved Glow */}
          <linearGradient id="heroPlanetGlow" x1="400" y1="260" x2="400" y2="430" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.95" />
            <stop offset="12%" stopColor="#0284c7" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#0c1e4a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#020412" stopOpacity="0.95" />
          </linearGradient>

          {/* Giant Neon Ring Gradient */}
          <linearGradient id="heroNeonRingGrad" x1="220" y1="60" x2="580" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="30%" stopColor="#818cf8" />
            <stop offset="70%" stopColor="#d946ef" />
            <stop offset="90%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Left Celestial Moon Shading */}
          <radialGradient id="heroLeftMoonGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#cffafe" />
            <stop offset="40%" stopColor="#0284c7" />
            <stop offset="75%" stopColor="#081b4b" />
            <stop offset="100%" stopColor="#020515" />
          </radialGradient>

          {/* Right Celestial Sphere Gradient */}
          <radialGradient id="heroRightMoonGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="35%" stopColor="#8b5cf6" />
            <stop offset="75%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#040212" />
          </radialGradient>

          {/* Glow Filters */}
          <filter id="heroSuperGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="16" result="blur1" />
            <feGaussianBlur stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="heroNebulaSoft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="28" />
          </filter>

          <radialGradient id="heroCentralNebula" cx="50%" cy="45%" r="48%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#6366f1" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Central Nebula Aura Cloud */}
        <circle cx="400" cy="190" r="180" fill="url(#heroCentralNebula)" filter="url(#heroNebulaSoft)" />

        {/* Top-Left Celestial Moon Orb */}
        <g opacity="0.95">
          <circle cx="280" cy="85" r="24" fill="url(#heroLeftMoonGrad)" />
          <circle cx="280" cy="85" r="24" stroke="#38bdf8" strokeWidth="1" opacity="0.75" />
          <ellipse
            cx="280"
            cy="85"
            rx="36"
            ry="7"
            stroke="url(#heroNeonRingGrad)"
            strokeWidth="1.4"
            opacity="0.65"
            transform="rotate(-20 280 85)"
          />
        </g>

        {/* Top-Right Large Celestial Planet Sphere */}
        <g opacity="0.95">
          <circle cx="615" cy="105" r="40" fill="url(#heroRightMoonGrad)" />
          <circle cx="615" cy="105" r="40" stroke="#c084fc" strokeWidth="1.2" opacity="0.6" />
          <circle cx="615" cy="105" r="42" stroke="#38bdf8" strokeWidth="1.5" opacity="0.5" filter="url(#heroSuperGlow)" />
          <ellipse
            cx="615"
            cy="105"
            rx="64"
            ry="12"
            stroke="url(#heroNeonRingGrad)"
            strokeWidth="1.8"
            opacity="0.7"
            transform="rotate(-15 615 105)"
          />
        </g>

        {/* Floating Neon Outer Halo Ring around Central Area */}
        <ellipse
          cx="400"
          cy="195"
          rx="165"
          ry="165"
          stroke="url(#heroNeonRingGrad)"
          strokeWidth="3.5"
          filter="url(#heroSuperGlow)"
          opacity="0.88"
        />

        {/* Concentric Thin Laser Orbit Rings */}
        <ellipse
          cx="400"
          cy="195"
          rx="150"
          ry="150"
          stroke="#00f0ff"
          strokeWidth="1.4"
          strokeDasharray="6 8"
          opacity="0.75"
        />
        <ellipse
          cx="400"
          cy="195"
          rx="180"
          ry="180"
          stroke="#e879f9"
          strokeWidth="1"
          strokeDasharray="4 12"
          opacity="0.55"
        />

        {/* Orbit Ring Sparkle Nodes */}
        <circle cx="235" cy="195" r="3.5" fill="#ffffff" filter="url(#heroSuperGlow)" />
        <circle cx="565" cy="195" r="3.5" fill="#ffffff" filter="url(#heroSuperGlow)" />
        <circle cx="400" cy="30" r="4" fill="#38bdf8" filter="url(#heroSuperGlow)" />
        <circle cx="400" cy="360" r="3.5" fill="#e879f9" filter="url(#heroSuperGlow)" />

        {/* Curved Planet Earth / Cosmic Horizon Arc */}
        <path
          d="M-60 410 Q 400 270 860 410 L 860 480 L -60 480 Z"
          fill="url(#heroPlanetGlow)"
        />

        {/* Atmospheric rim line with intense cyan bloom */}
        <path
          d="M-60 410 Q 400 270 860 410"
          stroke="#00f0ff"
          strokeWidth="4"
          filter="url(#heroSuperGlow)"
          opacity="0.98"
        />
        <path
          d="M100 370 Q 400 280 700 370"
          stroke="#ffffff"
          strokeWidth="2"
          opacity="0.85"
        />
      </svg>

      {/* Centerpiece Large Floating ASTRA Emblem */}
      <div className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <AstraLogo size={190} variant="hero" glow={true} className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-[190px] lg:h-[190px]" />
      </div>
    </div>
  );
}
