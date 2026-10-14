import React, { useState } from 'react';
import {
  Briefcase,
  Check,
  Code2,
  Cpu,
  Globe,
  GraduationCap,
  GripVertical,
  Image as ImageIcon,
  LayoutGrid,
  Megaphone,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp,
  Video,
} from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import { ProjectTelemetryMiniDashboard } from './ProjectTelemetryMiniDashboard';
import {
  HeroWidget,
  FeaturesWidget,
  PromoWidget,
  ModelsWidget,
  type FeatureItem,
} from './HomeWidgets';
import { useCredits } from '../lib/CreditContext';
import type { WorkspaceId } from '../types';

export type DashboardWidgetId = 'hero' | 'features' | 'telemetry' | 'promo' | 'models';

const DEFAULT_WIDGET_ORDER: DashboardWidgetId[] = [
  'hero',
  'features',
  'telemetry',
  'promo',
  'models',
];

const WIDGET_TITLES: Record<DashboardWidgetId, string> = {
  hero: 'Command Chamber & Quick Prompting',
  features: 'Main Features & Applications Matrix',
  telemetry: 'Real-Time Project & Build Telemetry',
  promo: 'Astra App Factory Creator Hub',
  models: 'Latest AI Models & Connected Providers',
};

interface ReorderableWidgetWrapperProps {
  id: DashboardWidgetId;
  title: string;
  isCustomizeMode: boolean;
  children: React.ReactNode;
}

function ReorderableWidgetWrapper({
  id,
  title,
  isCustomizeMode,
  children,
}: ReorderableWidgetWrapperProps) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={controls}
      className={`relative rounded-3xl transition-all duration-200 ${
        isCustomizeMode
          ? 'p-2.5 border-2 border-dashed border-cyan-400/40 bg-[#061033]/60 shadow-[0_0_30px_rgba(34,211,238,0.15)] my-3'
          : ''
      }`}
    >
      {/* Visual Drag Bar Header when in customize mode */}
      {isCustomizeMode && (
        <div className="flex items-center justify-between px-4 py-2 mb-3 rounded-2xl bg-gradient-to-r from-[#07133b] via-[#0b1c54] to-[#07133b] border border-cyan-500/40 text-xs select-none shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="font-bold text-white text-xs tracking-wide">{title}</span>
          </div>

          <div
            onPointerDown={(e) => controls.start(e)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/25 hover:bg-cyan-500/40 text-cyan-200 hover:text-white border border-cyan-400/50 cursor-grab active:cursor-grabbing font-bold tracking-wider text-[11px] transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)] group"
            title="Press and drag to move section up or down"
          >
            <GripVertical size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>DRAG WIDGET</span>
          </div>
        </div>
      )}

      {children}
    </Reorder.Item>
  );
}

interface HomeDashboardProps {
  onNavigate: (id: WorkspaceId) => void;
  onAskAstra: (prompt: string) => void;
  onNotify: (msg: string) => void;
  onVoiceToggle?: () => void;
  isVoiceListening?: boolean;
}

export function HomeDashboard({
  onNavigate,
  onAskAstra,
  onNotify,
  onVoiceToggle,
  isVoiceListening = false,
}: HomeDashboardProps) {
  const { userRole } = useCredits();
  const [commandInput, setCommandInput] = useState('');

  const handleCommandSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandInput.trim()) return;
    onAskAstra(commandInput.trim());
    setCommandInput('');
  };

  // Exactly 12 features matching the reference image (4 cols x 3 rows)
  const features: FeatureItem[] = [
    {
      id: 'chat',
      name: 'Chat',
      description: 'General AI chat, solutions, ideas and more.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="12" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
      ),
      iconBg: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 50%, #7c3aed 100%)',
      iconShadow: '0 0 20px rgba(59, 130, 246, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(59, 130, 246, 0.35)',
      hoverGlow: '0 0 25px rgba(59, 130, 246, 0.4)',
      accentColor: '#60a5fa',
    },
    {
      id: 'image-generator',
      name: 'Image Generator',
      description: 'Create stunning images with AI.',
      icon: <ImageIcon className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />,
      iconBg: 'linear-gradient(135deg, #a855f7 0%, #c026d3 50%, #ec4899 100%)',
      iconShadow: '0 0 20px rgba(192, 38, 211, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(192, 38, 211, 0.35)',
      hoverGlow: '0 0 25px rgba(192, 38, 211, 0.4)',
      accentColor: '#f472b6',
    },
    {
      id: 'video-generator',
      name: 'Video Generator',
      description: 'Turn your ideas into amazing videos.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
        </svg>
      ),
      iconBg: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #ea580c 100%)',
      iconShadow: '0 0 20px rgba(244, 63, 94, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(244, 63, 94, 0.35)',
      hoverGlow: '0 0 25px rgba(244, 63, 94, 0.4)',
      accentColor: '#fb7185',
    },
    {
      id: 'audio',
      name: 'Audio / Voice',
      description: 'Text to speech, voice cloning, & more.',
      icon: (
        <div className="flex items-center gap-0.5">
          <span className="w-1 h-3.5 bg-white rounded-full animate-pulse" />
          <span className="w-1 h-5 bg-white rounded-full" />
          <span className="w-1 h-6 bg-white rounded-full" />
          <span className="w-1 h-4 bg-white rounded-full" />
          <span className="w-1 h-2 bg-white rounded-full" />
        </div>
      ),
      iconBg: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #7e22ce 100%)',
      iconShadow: '0 0 20px rgba(168, 85, 247, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(168, 85, 247, 0.35)',
      hoverGlow: '0 0 25px rgba(168, 85, 247, 0.4)',
      accentColor: '#c084fc',
    },
    {
      id: 'coding',
      name: 'Code Assistant',
      description: 'Write, debug, and build code faster.',
      icon: <Code2 className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />,
      iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
      iconShadow: '0 0 20px rgba(16, 185, 129, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
      hoverGlow: '0 0 25px rgba(16, 185, 129, 0.4)',
      accentColor: '#34d399',
    },
    {
      id: 'app-factory',
      name: 'App Builder',
      description: 'Create mobile & web apps with AI.',
      icon: <LayoutGrid className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />,
      iconBg: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
      iconShadow: '0 0 20px rgba(236, 72, 153, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(236, 72, 153, 0.35)',
      hoverGlow: '0 0 25px rgba(236, 72, 153, 0.4)',
      accentColor: '#f472b6',
    },
    {
      id: 'website-factory',
      name: 'Website Builder',
      description: 'Build professional websites in minutes.',
      icon: <Globe className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />,
      iconBg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)',
      iconShadow: '0 0 20px rgba(6, 182, 212, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(6, 182, 212, 0.35)',
      hoverGlow: '0 0 25px rgba(6, 182, 212, 0.4)',
      accentColor: '#22d3ee',
    },
    {
      id: 'developer-ji',
      name: 'Agents',
      description: 'Multi-agent system for complex tasks.',
      icon: <Cpu className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />,
      iconBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #1e40af 100%)',
      iconShadow: '0 0 20px rgba(2, 132, 199, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(2, 132, 199, 0.35)',
      hoverGlow: '0 0 25px rgba(2, 132, 199, 0.4)',
      accentColor: '#38bdf8',
    },
    {
      id: 'market',
      name: 'Trading & Finance',
      description: 'Live data, analysis, signals & insights.',
      icon: <TrendingUp className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />,
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
      iconShadow: '0 0 20px rgba(245, 158, 11, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      hoverGlow: '0 0 25px rgba(245, 158, 11, 0.4)',
      accentColor: '#fbbf24',
    },
    {
      id: 'affiliate',
      name: 'Marketing & Affiliate',
      description: 'Create content, videos, landing pages & more.',
      icon: <Megaphone className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />,
      iconBg: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #e11d48 100%)',
      iconShadow: '0 0 20px rgba(244, 63, 94, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(244, 63, 94, 0.35)',
      hoverGlow: '0 0 25px rgba(244, 63, 94, 0.4)',
      accentColor: '#fb7185',
    },
    {
      id: 'research',
      name: 'Learning & Study',
      description: 'Personalized learning, notes, tutor & courses.',
      icon: <GraduationCap className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />,
      iconBg: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
      iconShadow: '0 0 20px rgba(37, 99, 235, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(37, 99, 235, 0.35)',
      hoverGlow: '0 0 25px rgba(37, 99, 235, 0.4)',
      accentColor: '#60a5fa',
    },
    {
      id: 'connectors',
      name: 'Business & Productivity',
      description: 'Plan, organize, automate and grow.',
      icon: <Briefcase className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />,
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #e11d48 100%)',
      iconShadow: '0 0 20px rgba(245, 158, 11, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      hoverGlow: '0 0 25px rgba(245, 158, 11, 0.4)',
      accentColor: '#fbbf24',
    },
  ];

  // Drag-and-drop workspace widget ordering with persistent localStorage storage
  const [widgetOrder, setWidgetOrder] = useState<DashboardWidgetId[]>(() => {
    try {
      const saved = localStorage.getItem('astra_home_widget_order_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_WIDGET_ORDER.length) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_WIDGET_ORDER;
  });

  const [isCustomizeMode, setIsCustomizeMode] = useState(false);

  const handleReorderWidgets = (newOrder: DashboardWidgetId[]) => {
    setWidgetOrder(newOrder);
    try {
      localStorage.setItem('astra_home_widget_order_v2', JSON.stringify(newOrder));
    } catch {}
    onNotify('Workspace widget order updated & saved');
  };

  const handleResetLayout = () => {
    setWidgetOrder(DEFAULT_WIDGET_ORDER);
    try {
      localStorage.removeItem('astra_home_widget_order_v2');
    } catch {}
    onNotify('Workspace layout reset to default');
  };

  const renderWidgetContent = (widgetId: DashboardWidgetId) => {
    switch (widgetId) {
      case 'hero':
        return (
          <HeroWidget
            commandInput={commandInput}
            setCommandInput={setCommandInput}
            handleCommandSubmit={handleCommandSubmit}
            onNotify={onNotify}
            onNavigate={onNavigate}
            onVoiceToggle={onVoiceToggle}
            isVoiceListening={isVoiceListening}
          />
        );
      case 'features':
        return (
          <FeaturesWidget
            features={features}
            onNavigate={onNavigate}
          />
        );
      case 'telemetry':
        return (
          <ProjectTelemetryMiniDashboard
            onNavigate={onNavigate}
            onNotify={onNotify}
          />
        );
      case 'promo':
        return (
          <PromoWidget
            onNavigate={onNavigate}
          />
        );
      case 'models':
        return (
          <ModelsWidget
            onNavigate={onNavigate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in pb-8">
      {/* Top Customization Toolbar & Quick Action */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            ASTRA Spatial Canvas
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isCustomizeMode ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetLayout}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-rose-500/20 text-slate-300 hover:text-rose-200 border border-white/[0.08] hover:border-rose-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Order</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCustomizeMode(false);
                  onNotify('Layout customized and saved successfully');
                }}
                className="px-3.5 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_12px_rgba(34,211,238,0.4)] hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={13} />
                <span>Done</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsCustomizeMode(true);
                onNotify('Customization mode enabled: Drag widgets to reorder');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#070e28]/70 hover:bg-[#0a153c]/90 text-slate-300 hover:text-cyan-200 border border-cyan-500/25 hover:border-cyan-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all flex items-center gap-1.5 cursor-pointer group"
              title="Customize workspace widget layout using drag and drop"
            >
              <SlidersHorizontal size={13} className="text-cyan-400 group-hover:rotate-90 transition-transform" />
              <span>Customize Layout</span>
            </button>
          )}
        </div>
      </div>

      {/* Customize Mode Instruction Banner */}
      {isCustomizeMode && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-indigo-950/70 to-purple-950/80 border border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.2)] astra-glass-layer-3 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_#22d3ee]">
              <GripVertical size={16} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>Workspace Widget Customizer</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Drag & Drop Active
                </span>
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Grab any widget's "DRAG WIDGET" handle to rearrange its position. Layout saves automatically.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsCustomizeMode(false);
              onNotify('Layout customized and saved successfully');
            }}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Check size={13} />
            <span>Done</span>
          </button>
        </div>
      )}

      {/* Drag-and-Drop Reorder Group */}
      <Reorder.Group
        axis="y"
        values={widgetOrder}
        onReorder={handleReorderWidgets}
        className="space-y-6"
      >
        {widgetOrder.map((widgetId) => (
          <ReorderableWidgetWrapper
            key={widgetId}
            id={widgetId}
            title={WIDGET_TITLES[widgetId]}
            isCustomizeMode={isCustomizeMode}
          >
            {renderWidgetContent(widgetId)}
          </ReorderableWidgetWrapper>
        ))}
      </Reorder.Group>
    </div>
  );
}
