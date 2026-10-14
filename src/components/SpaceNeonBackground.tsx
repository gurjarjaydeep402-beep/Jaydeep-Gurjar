export function SpaceNeonBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Deep Cosmic Indigo & Violet Foundation */}
      <div className="absolute inset-0 bg-[#060a24]" />

      {/* 2. Full-Screen Radiant Colorful Aurora Mesh Gradients */}

      {/* Aurora Layer A: Electric Cyan & Turquoise Galactic Ribbon (Top-Left to Center) */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[75vw] h-[75vw] max-w-[1000px] max-h-[1000px] rounded-full blur-[110px] opacity-90"
        style={{
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.45) 0%, rgba(6, 182, 212, 0.35) 35%, rgba(59, 130, 246, 0.2) 65%, transparent 85%)',
          animation: 'float-slow 22s ease-in-out infinite alternate',
        }}
      />

      {/* Aurora Layer B: Hot Magenta, Vivid Fuchsia & Pink Flare (Top-Right) */}
      <div
        className="absolute -top-[5%] right-[-8%] w-[70vw] h-[70vw] max-w-[950px] max-h-[950px] rounded-full blur-[115px] opacity-85"
        style={{
          background: 'radial-gradient(circle, rgba(255, 0, 128, 0.45) 0%, rgba(217, 70, 239, 0.38) 40%, rgba(168, 85, 247, 0.22) 70%, transparent 85%)',
          animation: 'float-reverse 26s ease-in-out infinite alternate',
        }}
      />

      {/* Aurora Layer C: Electric Violet, Deep Purple & Cosmic Indigo (Center & Full Body) */}
      <div
        className="absolute top-[20%] left-[15%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full blur-[120px] opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(99, 102, 241, 0.3) 45%, rgba(147, 51, 234, 0.18) 70%, transparent 88%)',
          animation: 'aurora-wave 18s ease-in-out infinite alternate',
        }}
      />

      {/* Aurora Layer D: Radiant Neon Emerald & Mint Aqua Stardust (Bottom-Right) */}
      <div
        className="absolute -bottom-[20%] right-[-5%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full blur-[120px] opacity-85"
        style={{
          background: 'radial-gradient(circle, rgba(0, 245, 212, 0.38) 0%, rgba(16, 185, 129, 0.3) 45%, rgba(6, 182, 212, 0.18) 70%, transparent 85%)',
          animation: 'float-reverse 24s ease-in-out infinite alternate',
        }}
      />

      {/* Aurora Layer E: Cosmic Coral, Warm Rose & Amber Glow (Bottom-Left) */}
      <div
        className="absolute -bottom-[10%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full blur-[115px] opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.38) 0%, rgba(192, 132, 252, 0.3) 45%, rgba(59, 130, 246, 0.18) 70%, transparent 85%)',
          animation: 'float-slow 20s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Aurora Layer F: Vibrant Center-Upper Cyan/Purple Laser Swirl */}
      <div
        className="absolute top-[10%] left-[30%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full blur-[95px] opacity-75"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.45) 0%, rgba(168, 85, 247, 0.35) 50%, transparent 80%)',
          animation: 'float-gentle 16s ease-in-out infinite alternate',
        }}
      />

      {/* 3. Luminous Cosmic Angled Beams / Streaks of Light */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        {/* Beam 1: Cyan / Blue Diagonal Light Sheet */}
        <div
          className="absolute -top-[30%] left-[10%] w-[25vw] h-[160vh] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent rotate-[35deg] blur-[50px]"
          style={{ animation: 'float-slow 25s ease-in-out infinite alternate' }}
        />
        {/* Beam 2: Magenta / Pink Diagonal Light Sheet */}
        <div
          className="absolute -top-[30%] right-[15%] w-[25vw] h-[160vh] bg-gradient-to-r from-transparent via-fuchsia-500/25 to-transparent rotate-[-35deg] blur-[55px]"
          style={{ animation: 'float-reverse 27s ease-in-out infinite alternate' }}
        />
      </div>

      {/* 4. Planetary Celestial Spheres with Vivid Neon Halos */}

      {/* Celestial Sphere 1: Top-Right Vibrant Violet Planet with Planetary Ring */}
      <div className="absolute top-[5%] right-[15%] w-36 h-36 rounded-full opacity-65 hidden md:block">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-300 via-purple-700 to-[#070b28] shadow-[0_0_70px_rgba(217,70,239,0.5)] border border-cyan-300/40 relative overflow-hidden">
          {/* Inner atmospheric illumination */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.7)_0%,transparent_60%)]" />
          {/* Glowing planetary ring */}
          <div className="absolute -inset-x-10 top-1/2 -translate-y-1/2 h-2.5 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent rotate-[-22deg] blur-[0.5px]" />
          <div className="absolute -inset-x-12 top-1/2 -translate-y-1/2 h-1 bg-white/90 rotate-[-22deg]" />
        </div>
      </div>

      {/* Celestial Sphere 2: Top-Left Radiant Cyan Moon with Neon Ring */}
      <div className="absolute top-[15%] left-[5%] w-18 h-18 rounded-full opacity-60 hidden lg:block">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-100 via-blue-600 to-[#050c26] shadow-[0_0_45px_rgba(34,211,238,0.6)] border border-cyan-300/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.85)_0%,transparent_50%)]" />
          {/* Subtle moon ring */}
          <div className="absolute -inset-x-4 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent rotate-[-15deg]" />
        </div>
      </div>

      {/* Celestial Sphere 3: Bottom-Right Small Emerald Moon */}
      <div className="absolute bottom-[12%] right-[8%] w-14 h-14 rounded-full opacity-50 hidden lg:block">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-200 via-emerald-600 to-[#041220] shadow-[0_0_35px_rgba(16,185,129,0.5)] border border-teal-300/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.75)_0%,transparent_50%)]" />
        </div>
      </div>

      {/* 5. Vivid Multi-Colored Twinkling Starfield */}
      <div className="absolute inset-0 opacity-95">
        {/* Bright Multi-Color Starlight Points */}
        <div
          className="absolute top-[7%] left-[14%] w-2 h-2 bg-cyan-200 rounded-full shadow-[0_0_14px_#00f0ff]"
          style={{ animation: 'twinkle 3.5s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[12%] left-[45%] w-2 h-2 bg-white rounded-full shadow-[0_0_16px_#ffffff]"
          style={{ animation: 'twinkle 5.2s ease-in-out infinite 0.8s' }}
        />
        <div
          className="absolute top-[20%] left-[84%] w-2.5 h-2.5 bg-fuchsia-300 rounded-full shadow-[0_0_18px_#ff007f]"
          style={{ animation: 'twinkle 4.5s ease-in-out infinite 1.8s' }}
        />
        <div
          className="absolute top-[30%] left-[10%] w-1.5 h-1.5 bg-cyan-200 rounded-full shadow-[0_0_10px_#67e8f9]"
          style={{ animation: 'twinkle 6s ease-in-out infinite 0.4s' }}
        />
        <div
          className="absolute top-[45%] left-[68%] w-2.5 h-2.5 bg-purple-200 rounded-full shadow-[0_0_16px_#c084fc]"
          style={{ animation: 'twinkle 4s ease-in-out infinite 1.2s' }}
        />
        <div
          className="absolute top-[56%] left-[25%] w-2 h-2 bg-white rounded-full shadow-[0_0_12px_#ffffff]"
          style={{ animation: 'twinkle 5s ease-in-out infinite 2.2s' }}
        />
        <div
          className="absolute top-[72%] left-[87%] w-2.5 h-2.5 bg-cyan-200 rounded-full shadow-[0_0_18px_#00f0ff]"
          style={{ animation: 'twinkle 5.5s ease-in-out infinite 2.8s' }}
        />
        <div
          className="absolute top-[78%] left-[48%] w-2 h-2 bg-pink-300 rounded-full shadow-[0_0_12px_#f472b6]"
          style={{ animation: 'twinkle 3.8s ease-in-out infinite 1.5s' }}
        />
        <div
          className="absolute top-[88%] left-[13%] w-2.5 h-2.5 bg-blue-300 rounded-full shadow-[0_0_16px_#60a5fa]"
          style={{ animation: 'twinkle 4.7s ease-in-out infinite 0.6s' }}
        />
        <div
          className="absolute top-[26%] left-[62%] w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_10px_#22d3ee]"
          style={{ animation: 'twinkle 6.2s ease-in-out infinite 3.2s' }}
        />
        <div
          className="absolute top-[50%] left-[93%] w-2 h-2 bg-white rounded-full shadow-[0_0_12px_#ffffff]"
          style={{ animation: 'twinkle 4s ease-in-out infinite 2.1s' }}
        />
        <div
          className="absolute top-[66%] left-[4%] w-2.5 h-2.5 bg-fuchsia-300 rounded-full shadow-[0_0_18px_#ff007f]"
          style={{ animation: 'twinkle 5.4s ease-in-out infinite 1.1s' }}
        />
        <div
          className="absolute top-[38%] left-[40%] w-2 h-2 bg-amber-200 rounded-full shadow-[0_0_12px_#fbbf24]"
          style={{ animation: 'twinkle 4.8s ease-in-out infinite 2.5s' }}
        />
        <div
          className="absolute top-[82%] left-[75%] w-2 h-2 bg-emerald-200 rounded-full shadow-[0_0_14px_#34d399]"
          style={{ animation: 'twinkle 5.8s ease-in-out infinite 1.7s' }}
        />

        {/* Ambient Subtle Multi-color Star Clusters */}
        <div className="absolute top-[17%] left-[28%] w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]" />
        <div className="absolute top-[22%] left-[21%] w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_6px_#22d3ee]" />
        <div className="absolute top-[35%] left-[46%] w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]" />
        <div className="absolute top-[41%] left-[17%] w-1.5 h-1.5 bg-purple-300 rounded-full shadow-[0_0_6px_#c084fc]" />
        <div className="absolute top-[55%] left-[82%] w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]" />
        <div className="absolute top-[69%] left-[62%] w-1.5 h-1.5 bg-cyan-200 rounded-full shadow-[0_0_6px_#67e8f9]" />
        <div className="absolute top-[81%] left-[76%] w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]" />
        <div className="absolute top-[89%] left-[36%] w-1.5 h-1.5 bg-pink-300 rounded-full shadow-[0_0_6px_#f472b6]" />
      </div>

      {/* 6. Subtle Cybernetic Perspective Grid */}
      <div
        className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#d946ef_1px,transparent_1px)] bg-[size:4rem_4rem]"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 90%)',
        }}
      />
    </div>
  );
}
