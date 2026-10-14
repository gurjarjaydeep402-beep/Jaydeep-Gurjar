import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { RightRail } from './components/RightRail';
import { HomeDashboard } from './components/HomeDashboard';
import { CommandPalette } from './components/CommandPalette';
import { AuthModal } from './components/AuthModal';
import { WatchAdModal } from './components/WatchAdModal';
import { PaywallModal } from './components/PaywallModal';

import { ChatWorkspace } from './components/workspaces/ChatWorkspace';
import { ImageWorkspace } from './components/workspaces/ImageWorkspace';
import { VideoWorkspace } from './components/workspaces/VideoWorkspace';
import { CodeWorkspace } from './components/workspaces/CodeWorkspace';
import { TradingWorkspace } from './components/workspaces/TradingWorkspace';
import { AudioWorkspace } from './components/workspaces/AudioWorkspace';
import { AppBuilderWorkspace } from './components/workspaces/AppBuilderWorkspace';
import { ProviderHubWorkspace } from './components/workspaces/ProviderHubWorkspace';
import { GeneralWorkspace } from './components/workspaces/GeneralWorkspace';
import { VersionControlWorkspace } from './components/workspaces/VersionControlWorkspace';
import { ProjectDashboardWorkspace } from './components/workspaces/ProjectDashboardWorkspace';
import { DeveloperJiWorkspace } from './components/workspaces/DeveloperJiWorkspace';
import { GameFactoryWorkspace } from './components/workspaces/GameFactoryWorkspace';
import { WebsiteFactoryWorkspace } from './components/workspaces/WebsiteFactoryWorkspace';
import { ResearchWorkspace } from './components/workspaces/ResearchWorkspace';
import { FilesWorkspace } from './components/workspaces/FilesWorkspace';
import { ConnectorsWorkspace } from './components/workspaces/ConnectorsWorkspace';
import { AdMakerWorkspace } from './components/workspaces/AdMakerWorkspace';
import { ControlHubWorkspace } from './components/workspaces/ControlHubWorkspace';
import { AutomatorWorkspace } from './components/workspaces/AutomatorWorkspace';
import { AccessDeniedView } from './components/AccessDeniedView';

import { AstraBackground } from './components/AstraBackground';
import { AuthProvider } from './lib/AuthContext';
import { CreditProvider, useCredits } from './lib/CreditContext';
import { ConnectorsProvider } from './lib/ConnectorsContext';
import { AtmosphereProvider } from './lib/AtmosphereContext';
import { useVoiceNavigation } from './hooks/useVoiceNavigation';
import { VoiceLogsModal } from './components/VoiceLogsModal';
import type { WorkspaceId } from './types';
import { Check } from 'lucide-react';

function AppContent() {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>(() => {
    try {
      const hash = window.location.hash.replace('#', '') as WorkspaceId;
      if (hash) return hash;
    } catch {}
    return 'home';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [initialChatPrompt, setInitialChatPrompt] = useState('');

  const {
    isPaywallOpen,
    closePaywall,
    openPaywall,
    isAdModalOpen,
    closeAdModal,
    openAdModal,
    userRole,
    setUserRole,
  } = useCredits();

  // Sync hash with activeWorkspace
  useEffect(() => {
    try {
      window.location.hash = activeWorkspace;
    } catch {}
  }, [activeWorkspace]);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setMobileMenuOpen(false);
        setAuthModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subtle CSS parallax listener for UI container (distinct floating glass layers)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      document.documentElement.style.setProperty('--ui-mouse-x', currentX.toFixed(4));
      document.documentElement.style.setProperty('--ui-mouse-y', currentY.toFixed(4));

      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      document.documentElement.style.removeProperty('--ui-mouse-x');
      document.documentElement.style.removeProperty('--ui-mouse-y');
    };
  }, []);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleAskAstra = (prompt: string) => {
    setInitialChatPrompt(prompt);
    setActiveWorkspace('chat');
  };

  // Hands-free Web Speech API Voice Controller
  const voiceNav = useVoiceNavigation({
    onNavigate: (id) => setActiveWorkspace(id),
    onAskAstra: handleAskAstra,
    onOpenSearch: () => setCommandPaletteOpen(true),
    onNotify: notify,
  });

  const openAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden [perspective:1400px]">
      {/* ASTRA Spatial Environmental Canvas */}
      <AstraBackground activeWorkspace={activeWorkspace} />

      {/* Top Navbar */}
      <div className="relative z-20 astra-glass-layer-1">
        <TopBar
          onMenuToggle={() => setMobileMenuOpen(true)}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onOpenNotifications={() => notify('ASTRA 4 Pro model routing & Central Ledger active.')}
          onHomeClick={() => setActiveWorkspace('home')}
          onOpenAuth={openAuth}
          voiceProps={{
            isListening: voiceNav.isListening,
            transcript: voiceNav.transcript,
            interimTranscript: voiceNav.interimTranscript,
            audioLevel: voiceNav.audioLevel,
            isSupported: voiceNav.isSupported,
            onToggle: voiceNav.toggleListening,
            onStop: voiceNav.stopListening,
            onOpenLogs: () => voiceNav.setIsLogsOpen(true),
            logsCount: voiceNav.commandLogs.length,
          }}
        />
      </div>

      {/* Main 3-Column Shell */}
      <div className="flex-1 flex overflow-hidden relative z-10 [perspective:1200px]">
        {/* Left Sidebar */}
        <Sidebar
          activeWorkspace={activeWorkspace}
          isOpen={mobileMenuOpen}
          onSelectWorkspace={(id) => {
            setActiveWorkspace(id);
            setMobileMenuOpen(false);
          }}
          onClose={() => setMobileMenuOpen(false)}
          onUpgradeClick={openPaywall}
          onOpenForgeClick={() => {
            setActiveWorkspace('projects');
            notify('Switched to Astra Forge Projects Studio');
          }}
        />

        {/* Center Main Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 scrollbar-thin">
          <div key={activeWorkspace} className="astra-workspace-transition w-full">
            {activeWorkspace === 'home' && (
            <div className="flex flex-col xl:flex-row gap-6">
              <div className="flex-1 min-w-0">
                <HomeDashboard
                  onNavigate={setActiveWorkspace}
                  onAskAstra={handleAskAstra}
                  onNotify={notify}
                  onVoiceToggle={voiceNav.toggleListening}
                  isVoiceListening={voiceNav.isListening}
                />
              </div>
              <RightRail
                onNavigate={setActiveWorkspace}
                onQuickAction={notify}
                onOpenAuth={openAuth}
              />
            </div>
          )}

          {activeWorkspace === 'projects' && (
            <ProjectDashboardWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNavigate={setActiveWorkspace}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'version-control' && (
            <VersionControlWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'chat' && (
            <ChatWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
              initialPrompt={initialChatPrompt}
            />
          )}

          {activeWorkspace === 'developer-ji' && (
            userRole === 'OWNER' ? (
              <DeveloperJiWorkspace
                onBack={() => setActiveWorkspace('home')}
                onNotify={notify}
              />
            ) : (
              <AccessDeniedView
                requiredRole="OWNER"
                currentRole={userRole}
                targetFeature="Developer Ji & Source Modification Engine"
                onBack={() => setActiveWorkspace('home')}
                onOpenAuth={() => openAuth('login')}
              />
            )
          )}

          {activeWorkspace === 'image-generator' && (
            <ImageWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'video-generator' && (
            <VideoWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'coding' && (
            <CodeWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'game-factory' && (
            <GameFactoryWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'website-factory' && (
            <WebsiteFactoryWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'research' && (
            <ResearchWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'files' && (
            <FilesWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'connectors' && (
            <ConnectorsWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'ad-maker' && (
            <AdMakerWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'market' && (
            <TradingWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'audio' && (
            <AudioWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'app-factory' && (
            <AppBuilderWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {activeWorkspace === 'automation' && (
            <AutomatorWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
              onNavigate={setActiveWorkspace}
            />
          )}

          {activeWorkspace === 'providers' && (
            <ProviderHubWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {(activeWorkspace === 'control' || activeWorkspace === 'settings' || activeWorkspace === 'admin') && (
            <ControlHubWorkspace
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}

          {![
            'home',
            'projects',
            'version-control',
            'chat',
            'developer-ji',
            'image-generator',
            'video-generator',
            'coding',
            'game-factory',
            'website-factory',
            'research',
            'files',
            'connectors',
            'ad-maker',
            'market',
            'audio',
            'app-factory',
            'automation',
            'providers',
            'control',
            'settings',
            'admin',
          ].includes(activeWorkspace) && (
            <GeneralWorkspace
              workspaceId={activeWorkspace}
              onBack={() => setActiveWorkspace('home')}
              onNotify={notify}
            />
          )}
          </div>
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(id) => {
          setActiveWorkspace(id);
          setCommandPaletteOpen(false);
        }}
      />

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
        onNotify={notify}
      />

      {/* Credit Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={closePaywall}
        onNotify={notify}
        onOpenAdModal={openAdModal}
      />

      {/* Rewarded Ad Modal */}
      <WatchAdModal
        isOpen={isAdModalOpen}
        onClose={closeAdModal}
        onNotify={notify}
      />

      {/* Voice Logs & Command History Overlay */}
      <VoiceLogsModal
        isOpen={voiceNav.isLogsOpen}
        onClose={() => voiceNav.setIsLogsOpen(false)}
        logs={voiceNav.commandLogs}
        onRetrigger={(cmd) => {
          voiceNav.retriggerCommand(cmd);
        }}
        onClearLogs={voiceNav.clearLogs}
        isListening={voiceNav.isListening}
        onToggleListening={voiceNav.toggleListening}
      />

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#081232]/95 border border-cyan-400/40 text-cyan-200 text-xs sm:text-sm font-medium shadow-[0_0_30px_rgba(34,211,238,0.25)] backdrop-blur-xl animate-slide-up">
          <div className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-300">
            <Check size={13} />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CreditProvider>
        <ConnectorsProvider>
          <AtmosphereProvider>
            <AppContent />
          </AtmosphereProvider>
        </ConnectorsProvider>
      </CreditProvider>
    </AuthProvider>
  );
}
