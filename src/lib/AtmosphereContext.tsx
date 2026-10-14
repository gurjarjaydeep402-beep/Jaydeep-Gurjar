import React, { createContext, useContext, useState, useEffect } from 'react';

interface AtmosphereContextType {
  atmosphericDepth: number; // 0 to 100, default 65
  setAtmosphericDepth: (val: number) => void;
  resetAtmosphericDepth: () => void;
}

const AtmosphereContext = createContext<AtmosphereContextType>({
  atmosphericDepth: 65,
  setAtmosphericDepth: () => {},
  resetAtmosphericDepth: () => {},
});

const STORAGE_KEY = 'astra_atmospheric_depth';

export function AtmosphereProvider({ children }: { children: React.ReactNode }) {
  const [atmosphericDepth, setAtmosphericDepthState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
          return parsed;
        }
      }
    } catch {}
    return 65; // Default 65% balanced atmospheric depth
  });

  const setAtmosphericDepth = (val: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(val)));
    setAtmosphericDepthState(clamped);
    try {
      localStorage.setItem(STORAGE_KEY, clamped.toString());
    } catch {}
  };

  const resetAtmosphericDepth = () => {
    setAtmosphericDepth(65);
  };

  return (
    <AtmosphereContext.Provider
      value={{
        atmosphericDepth,
        setAtmosphericDepth,
        resetAtmosphericDepth,
      }}
    >
      {children}
    </AtmosphereContext.Provider>
  );
}

export function useAtmosphere() {
  const context = useContext(AtmosphereContext);
  if (!context) {
    throw new Error('useAtmosphere must be used within an AtmosphereProvider');
  }
  return context;
}
