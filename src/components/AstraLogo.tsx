import React from 'react';

export type AstraLogoVariant = 'primary' | 'compact' | 'hero' | 'monochrome' | 'active-glowing';

export interface AstraLogoProps {
  size?: number | string;
  variant?: AstraLogoVariant;
  className?: string;
  glow?: boolean;
}

/**
 * AstraLogo — Master Reference-Locked Brand Emblem
 * 
 * Accurately reconstructed from the master reference image:
 * 1. Geometric 3D triangular Delta "A" architecture.
 * 2. Luminous cyan/blue core on the left crystalline wing (#00f0ff -> #0284c7).
 * 3. Energetic violet/magenta neon rim-light on the right wing (#818cf8 -> #c084fc -> #ec4899).
 * 4. 3D planetary orbital loop / energetic ribbon looping through the central aperture.
 * 5. Crystalline 3D faceted spine ridges with light refraction highlights.
 * 6. Radiant apex singularity starburst with dual-axis lens flare spikes.
 * 7. Fully responsive: scales seamlessly via viewBox="0 0 100 100".
 */
export function AstraLogo({
  size,
  variant = 'primary',
  className = '',
  glow = true,
}: AstraLogoProps) {
  const isMonochrome = variant === 'monochrome';
  const isHero = variant === 'hero';
  const isActive = variant === 'active-glowing' || isHero;
  const isGlowing = glow || isActive;

  // Unique ID prefix to avoid gradient/filter conflicts across multiple instances
  const uid = React.useId().replace(/:/g, '');

  const defaultSize = isHero ? 190 : 38;
  const resolvedSize = size !== undefined ? size : defaultSize;
  const sizeStyle = typeof resolvedSize === 'number' ? `${resolvedSize}px` : resolvedSize;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{
        width: sizeStyle,
        height: sizeStyle,
        maxWidth: '100%',
      }}
      aria-label="ASTRA Brand Emblem"
      role="img"
    >
      {/* 1. Volumetric Dual-Spectrum Ambient Glow Aura */}
      {isGlowing && !isMonochrome && (
        <div
          className="absolute inset-0 rounded-full blur-xl pointer-events-none scale-150 opacity-90 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 240, 255, 0.55) 0%, rgba(168, 85, 247, 0.45) 45%, rgba(236, 72, 153, 0.25) 70%, transparent 85%)',
          }}
        />
      )}

      {/* 2. Scalable High-Precision 3D Geometric Vector Emblem */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 overflow-visible transition-all duration-300"
        style={{
          filter:
            isGlowing && !isMonochrome
              ? `drop-shadow(0 0 ${isHero ? 24 : 10}px rgba(0, 240, 255, 0.95)) drop-shadow(0 0 ${isHero ? 45 : 18}px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 ${isHero ? 70 : 30}px rgba(236, 72, 153, 0.5))`
              : undefined,
        }}
      >
        <defs>
          {/* Cyan to Electric Blue Gradient for Left Crystalline Wing */}
          <linearGradient id={`cyanWingGrad_${uid}`} x1="16" y1="86" x2="50" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="25%" stopColor="#00b4d8" />
            <stop offset="65%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>

          {/* Violet to Magenta/Pink Gradient for Right Energetic Wing */}
          <linearGradient id={`violetWingGrad_${uid}`} x1="50" y1="10" x2="84" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="35%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          {/* 3D Looping Planetary Orbital Ring / Helix Crossbar Gradient */}
          <linearGradient id={`orbitLoopGrad_${uid}`} x1="14" y1="62" x2="86" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="20%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="80%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          {/* Inner Delta Void Cosmic Gradient */}
          <linearGradient id={`apertureVoid_${uid}`} x1="50" y1="26" x2="50" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#03081e" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#08041a" stopOpacity="0.95" />
          </linearGradient>

          {/* Neon Bloom Filter for Rim Highlights */}
          <filter id={`rimBloom_${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {isMonochrome ? (
          /* High contrast monochrome fallback */
          <g stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M50 12 L18 84 L32 84 L38 68 L62 68 L68 84 L82 84 Z" />
            <path d="M42 56 L58 56" />
            <ellipse cx="50" cy="58" rx="30" ry="10" strokeWidth="3.5" />
          </g>
        ) : (
          /* Geometric 3D Reference-Locked ASTRA Emblem */
          <g>
            {/* Outer Subtle Ambient Ring Behind the Emblem */}
            <ellipse
              cx="50"
              cy="58"
              rx="42"
              ry="16"
              stroke={`url(#orbitLoopGrad_${uid})`}
              strokeWidth={isHero ? 2.5 : 1.8}
              strokeDasharray={isHero ? '6 6' : undefined}
              opacity="0.6"
              filter={`url(#rimBloom_${uid})`}
            />

            {/* Left Crystalline Wing (Electric Cyan Core & Blue Facets) */}
            <path
              d="M50 10 L16 84 C15 85.5 16.5 86 18.5 86 L31.5 86 C33.5 86 35 84.5 36 82 L43 65 L46 54 L50 10 Z"
              fill={`url(#cyanWingGrad_${uid})`}
              opacity="0.98"
            />

            {/* Right Energetic Wing (Pleiades Violet / Neon Magenta Rim) */}
            <path
              d="M50 10 L84 84 C85 85.5 83.5 86 81.5 86 L68.5 86 C66.5 86 65 84.5 64 82 L57 65 L54 54 L50 10 Z"
              fill={`url(#violetWingGrad_${uid})`}
              opacity="0.98"
            />

            {/* Inner Delta Void Cutout (Cosmic transparency peek) */}
            <path
              d="M50 26 L60 58 L40 58 Z"
              fill={`url(#apertureVoid_${uid})`}
            />

            {/* Left Wing Neon Cyan Outer Rim Stroke */}
            <path
              d="M50 10 L16 84"
              stroke="#00f0ff"
              strokeWidth={isHero ? 2.4 : 1.6}
              strokeLinecap="round"
              filter={`url(#rimBloom_${uid})`}
              opacity="0.95"
            />

            {/* Right Wing Neon Violet/Magenta Outer Rim Stroke */}
            <path
              d="M50 10 L84 84"
              stroke="#ec4899"
              strokeWidth={isHero ? 2.4 : 1.6}
              strokeLinecap="round"
              filter={`url(#rimBloom_${uid})`}
              opacity="0.95"
            />

            {/* 3D Crystalline Prism Facet Ridges */}
            <path
              d="M50 10 L22 84"
              stroke="#ffffff"
              strokeWidth={isHero ? 1.8 : 1.2}
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M50 10 L78 84"
              stroke="#fbcfe8"
              strokeWidth={isHero ? 1.8 : 1.2}
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M50 10 L50 30"
              stroke="#ffffff"
              strokeWidth={isHero ? 2.2 : 1.5}
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* 3D Looping Planetary Orbital Ring / Helix Crossbar */}
            <path
              d="M18 64 C24 53 38 48 50 48 C62 48 76 53 82 64 C76 75 62 80 50 80 C38 80 24 75 18 64 Z"
              stroke={`url(#orbitLoopGrad_${uid})`}
              strokeWidth={isHero ? 4.6 : 3.2}
              fill="none"
              strokeLinecap="round"
              opacity="0.96"
              filter={`url(#rimBloom_${uid})`}
            />

            {/* High-Luminance Pure White Core Beam across Crossbar */}
            <path
              d="M28 60 C34 54 42 51 50 51 C58 51 66 54 72 60"
              stroke="#ffffff"
              strokeWidth={isHero ? 2.2 : 1.5}
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* Apex Singularity Starburst & Diamond Lens Flare */}
            <circle cx="50" cy="12" r={isHero ? 3.5 : 2.4} fill="#ffffff" />
            <circle cx="50" cy="12" r={isHero ? 7.5 : 4.8} fill="#00f0ff" opacity="0.8" />
            <circle cx="50" cy="12" r={isHero ? 13 : 7.5} fill="#c084fc" opacity="0.4" />

            {/* Apex Dual-Axis Diffraction Spikes */}
            <line
              x1={isHero ? 34 : 41}
              y1="12"
              x2={isHero ? 66 : 59}
              y2="12"
              stroke="#ffffff"
              strokeWidth={isHero ? 1.8 : 1.2}
              strokeLinecap="round"
              opacity="0.92"
            />
            <line
              x1="50"
              y1={isHero ? 2 : 5}
              x2="50"
              y2={isHero ? 22 : 19}
              stroke="#00f0ff"
              strokeWidth={isHero ? 1.8 : 1.2}
              strokeLinecap="round"
              opacity="0.92"
            />

            {/* Central Crossing Flare */}
            <circle cx="50" cy="58" r={isHero ? 3 : 2} fill="#ffffff" />
            <circle cx="50" cy="58" r={isHero ? 7 : 4.5} fill="#00f0ff" opacity="0.7" />
          </g>
        )}
      </svg>
    </div>
  );
}
