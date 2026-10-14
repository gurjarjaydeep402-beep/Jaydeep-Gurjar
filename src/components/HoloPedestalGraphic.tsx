export function HoloPedestalGraphic({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[180px]"
      >
        <defs>
          {/* Base Platform Ring Glow */}
          <radialGradient id="stageRingsGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Upward Holographic Light Pillar */}
          <linearGradient id="lightColumnGrad" x1="200" y1="170" x2="200" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.05" />
          </linearGradient>

          {/* Floating Card Gradients */}
          <linearGradient id="cardPink" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="cardCyan" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="cardPurple" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="cardGreen" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.75" />
          </linearGradient>

          <filter id="holoBloom" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Upward Holographic Light Pillar */}
        <polygon
          points="130,165 170,25 230,25 270,165"
          fill="url(#lightColumnGrad)"
        />

        {/* Base Cylindrical Rings on Floor */}
        <ellipse cx="200" cy="172" rx="140" ry="24" fill="#081434" stroke="#00f0ff" strokeWidth="1" opacity="0.4" />
        <ellipse cx="200" cy="166" rx="115" ry="20" fill="#0c1d4a" stroke="#38bdf8" strokeWidth="1.8" opacity="0.7" />
        <ellipse cx="200" cy="160" rx="90" ry="16" fill="url(#stageRingsGrad)" stroke="#00f0ff" strokeWidth="2.5" filter="url(#holoBloom)" />
        <ellipse cx="200" cy="155" rx="65" ry="12" fill="#00f0ff" opacity="0.45" filter="url(#holoBloom)" />

        {/* Central Floating Glowing Star / Diamond in Pillar */}
        <g filter="url(#holoBloom)">
          <polygon
            points="200,65 214,85 200,105 186,85"
            fill="#ffffff"
            stroke="#00f0ff"
            strokeWidth="1.5"
            opacity="0.95"
          />
          <circle cx="200" cy="85" r="4.5" fill="#00f0ff" />
        </g>

        {/* 1. Left Upright Floating Pink/Purple Card */}
        <g transform="translate(100, 75) rotate(-12)" filter="url(#holoBloom)">
          <rect
            x="0"
            y="0"
            width="34"
            height="34"
            rx="10"
            fill="url(#cardPink)"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          {/* Chat Bubble Icon */}
          <circle cx="17" cy="17" r="8" fill="#ffffff" opacity="0.9" />
          <polygon points="12,22 17,19 14,15" fill="#f43f5e" />
        </g>

        {/* 2. Left-Center Upright Floating Cyan Card */}
        <g transform="translate(142, 92) rotate(-5)" filter="url(#holoBloom)">
          <rect
            x="0"
            y="0"
            width="32"
            height="32"
            rx="9"
            fill="url(#cardCyan)"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          {/* Code Icon inside */}
          <path d="M12 16L9 19L12 22M20 16L23 19L20 22M17 14L15 24" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* 3. Center Front Floating Large Purple Card */}
        <g transform="translate(182, 60)" filter="url(#holoBloom)">
          <rect
            x="0"
            y="0"
            width="38"
            height="44"
            rx="11"
            fill="url(#cardPurple)"
            stroke="#ffffff"
            strokeWidth="1.6"
          />
          {/* Star / Astra Emblem inside */}
          <circle cx="19" cy="22" r="9" fill="#ffffff" opacity="0.9" />
          <polygon points="19,16 22,25 14,20 24,20 16,25" fill="#7c3aed" />
        </g>

        {/* 4. Right-Center Upright Floating Emerald Card */}
        <g transform="translate(228, 92) rotate(6)" filter="url(#holoBloom)">
          <rect
            x="0"
            y="0"
            width="32"
            height="32"
            rx="9"
            fill="url(#cardGreen)"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          {/* App / Cube Grid inside */}
          <rect x="10" y="10" width="5" height="5" rx="1.5" fill="#ffffff" />
          <rect x="17" y="10" width="5" height="5" rx="1.5" fill="#ffffff" />
          <rect x="10" y="17" width="5" height="5" rx="1.5" fill="#ffffff" />
          <rect x="17" y="17" width="5" height="5" rx="1.5" fill="#ffffff" />
        </g>

        {/* 5. Right Upright Floating Lime/Cyan Card */}
        <g transform="translate(268, 76) rotate(14)" filter="url(#holoBloom)">
          <rect
            x="0"
            y="0"
            width="34"
            height="34"
            rx="10"
            fill="url(#cardCyan)"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          {/* Robot / Bolt Icon */}
          <polygon points="17,8 11,20 16,20 15,26 23,15 18,15" fill="#ffffff" />
        </g>

        {/* Ambient Floating Sparkles */}
        <circle cx="115" cy="55" r="2.5" fill="#ffffff" filter="url(#holoBloom)" />
        <circle cx="285" cy="52" r="2.5" fill="#ffffff" filter="url(#holoBloom)" />
        <circle cx="190" cy="35" r="3" fill="#00f0ff" filter="url(#holoBloom)" />
        <circle cx="215" cy="40" r="2" fill="#d946ef" filter="url(#holoBloom)" />
      </svg>
    </div>
  );
}
