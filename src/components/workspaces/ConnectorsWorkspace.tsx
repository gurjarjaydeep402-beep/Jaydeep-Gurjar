import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  FileText,
  Flame,
  Globe,
  HardDrive,
  Key,
  Mail,
  MapPin,
  PlaySquare,
  Power,
  Server,
  Video,
  Zap,
  GitBranch,
  Cloud,
  Cpu,
  Layers,
  CreditCard,
  Container,
  Send,
  Sparkles,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Play,
  X,
  Eye,
  EyeOff,
  Check,
  Terminal,
  Activity,
  Lock,
} from 'lucide-react';
import { useConnectors } from '../../lib/ConnectorsContext';
import type {
  IntegrationDefinition,
  IntegrationStatus,
} from '../../lib/integrationRegistryTypes';

interface ConnectorsWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

// Icon mapper for dynamic registry
function getIntegrationIcon(iconName: string): React.ComponentType<{ size?: number | string; className?: string }> {
  switch (iconName) {
    case 'Flame':
      return Flame;
    case 'Sparkles':
      return Sparkles;
    case 'GitBranch':
      return GitBranch;
    case 'CreditCard':
      return CreditCard;
    case 'Send':
      return Send;
    case 'Zap':
      return Zap;
    case 'Cpu':
      return Cpu;
    case 'Database':
      return Database;
    case 'Layers':
      return Layers;
    case 'Container':
      return Container;
    case 'Cloud':
      return Cloud;
    case 'MapPin':
      return MapPin;
    case 'HardDrive':
      return HardDrive;
    case 'FileSpreadsheet':
      return FileSpreadsheet;
    case 'FileText':
      return FileText;
    case 'Calendar':
      return Calendar;
    case 'Mail':
      return Mail;
    case 'CheckSquare':
      return CheckCircle2;
    case 'StickyNote':
      return FileText;
    case 'Video':
      return Video;
    case 'PlaySquare':
      return PlaySquare;
    default:
      return Globe;
  }
}

export function ConnectorsWorkspace({ onBack, onNotify }: ConnectorsWorkspaceProps) {
  const {
    connectors,
    loading,
    connectedCount,
    totalCount,
    refreshRegistry,
    testConnection,
    testAll,
    configureConnector,
    disconnectConnector,
    executeAction,
  } = useConnectors();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Active testing states
  const [testingId, setTestingId] = useState<string | null>(null);
  const [isTestingAll, setIsTestingAll] = useState(false);

  // Modals
  const [configModalIntegration, setConfigModalIntegration] = useState<IntegrationDefinition | null>(null);
  const [secretInputs, setSecretInputs] = useState<Record<string, string>>({});
  const [showSecretValues, setShowSecretValues] = useState<Record<string, boolean>>({});
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Playground / Action Runner Modal
  const [playgroundIntegration, setPlaygroundIntegration] = useState<IntegrationDefinition | null>(null);
  const [selectedActionId, setSelectedActionId] = useState<string>('');
  const [actionParams, setActionParams] = useState<Record<string, any>>({});
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [actionResult, setActionResult] = useState<any | null>(null);

  // Vault overview drawer
  const [showVaultDrawer, setShowVaultDrawer] = useState(false);

  // Filter integrations
  const filteredIntegrations = connectors.filter((c) => {
    // Category match
    if (selectedCategory !== 'ALL') {
      if (selectedCategory === 'AI & MODELS' && c.category !== 'AI') return false;
      if (selectedCategory === 'GOOGLE WORKSPACE' && c.category !== 'GOOGLE WORKSPACE') return false;
      if (selectedCategory === 'DEVELOPMENT' && c.category !== 'DEVELOPMENT') return false;
      if (selectedCategory === 'DATABASE' && c.category !== 'DATABASE') return false;
      if (selectedCategory === 'STORAGE' && c.category !== 'STORAGE') return false;
      if (selectedCategory === 'COMMUNICATION' && c.category !== 'COMMUNICATION') return false;
      if (selectedCategory === 'PAYMENTS' && c.category !== 'PAYMENTS') return false;
    }

    // Status match
    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'CONNECTED' && c.status !== 'CONNECTED') return false;
      if (selectedStatus === 'SETUP_REQUIRED' && c.status !== 'SETUP_REQUIRED') return false;
      if (selectedStatus === 'AUTHORIZATION_REQUIRED' && c.status !== 'AUTHORIZATION_REQUIRED') return false;
      if (selectedStatus === 'ERROR' && !['INVALID_CREDENTIALS', 'QUOTA_EXCEEDED', 'TEMPORARILY_UNAVAILABLE'].includes(c.status)) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchProvider = c.provider.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchCaps = c.capabilities.some((cap) => cap.toLowerCase().includes(q));
      const matchSecrets = c.requiredSecrets.some((s) => s.envVar.toLowerCase().includes(q));
      return matchName || matchProvider || matchDesc || matchCaps || matchSecrets;
    }

    return true;
  });

  // Handle individual connection test
  const handleTestConnection = async (integration: IntegrationDefinition) => {
    setTestingId(integration.id);
    try {
      const res = await testConnection(integration.id);
      if (res.success) {
        onNotify(`✓ ${integration.name}: Connected cleanly (${res.latency})`);
      } else {
        onNotify(`ℹ ${integration.name}: ${res.status} — ${res.message}`);
      }
    } catch (err: any) {
      onNotify(`⚠ Test failed: ${err.message}`);
    } finally {
      setTestingId(null);
    }
  };

  // Handle Test All
  const handleTestAll = async () => {
    setIsTestingAll(true);
    onNotify('Initiating comprehensive health probes across all 22 integrations...');
    try {
      await testAll();
      onNotify('✓ Health checks completed across all dynamic integration providers.');
    } catch (err: any) {
      onNotify(`⚠ Test all completed with errors: ${err.message}`);
    } finally {
      setIsTestingAll(false);
    }
  };

  // Open Configure Modal
  const handleOpenConfig = (integration: IntegrationDefinition) => {
    setConfigModalIntegration(integration);
    const initialInputs: Record<string, string> = {};
    for (const sec of integration.requiredSecrets) {
      initialInputs[sec.envVar] = '';
    }
    setSecretInputs(initialInputs);
  };

  // Save Configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configModalIntegration) return;

    setIsSavingConfig(true);
    try {
      const res = await configureConnector(configModalIntegration.id, secretInputs);
      if (res.success) {
        onNotify(`✓ Credentials verified for ${configModalIntegration.name}.`);
        setConfigModalIntegration(null);
      } else {
        onNotify(`ℹ ${res.message}`);
      }
    } catch (err: any) {
      onNotify(`⚠ Failed to save credentials: ${err.message}`);
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Disconnect
  const handleDisconnect = async (integration: IntegrationDefinition) => {
    if (integration.id === 'firebase') {
      onNotify('ℹ Firebase is integrated into the core platform runtime and cannot be decoupled.');
      return;
    }

    try {
      const res = await disconnectConnector(integration.id);
      onNotify(res.message);
    } catch (err: any) {
      onNotify(`⚠ Error: ${err.message}`);
    }
  };

  // Open Playground
  const handleOpenPlayground = (integration: IntegrationDefinition) => {
    setPlaygroundIntegration(integration);
    const firstAction = integration.supportedActions[0];
    setSelectedActionId(firstAction?.id || '');
    const defaultParams: Record<string, any> = {};
    if (firstAction) {
      for (const p of firstAction.params) {
        if (p.defaultValue !== undefined) {
          defaultParams[p.name] = p.defaultValue;
        }
      }
    }
    setActionParams(defaultParams);
    setActionResult(null);
  };

  // Execute Action
  const handleExecuteAction = async () => {
    if (!playgroundIntegration || !selectedActionId) return;

    setIsExecutingAction(true);
    setActionResult(null);
    try {
      const res = await executeAction(playgroundIntegration.id, selectedActionId, actionParams);
      setActionResult(res);
      if (res.success) {
        onNotify(`✓ Action executed successfully on ${playgroundIntegration.name}`);
      } else {
        onNotify(`ℹ Action error: ${res.message}`);
      }
    } catch (err: any) {
      setActionResult({ success: false, error: err.message });
      onNotify(`⚠ Execution error: ${err.message}`);
    } finally {
      setIsExecutingAction(false);
    }
  };

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case 'CONNECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs shadow-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CONNECTED
          </span>
        );
      case 'SETUP_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            SETUP REQUIRED
          </span>
        );
      case 'AUTHORIZATION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            OAUTH REQUIRED
          </span>
        );
      case 'INVALID_CREDENTIALS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            INVALID CREDENTIALS
          </span>
        );
      case 'QUOTA_EXCEEDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            QUOTA EXCEEDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            NOT CONNECTED
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950/70 p-4 sm:p-6 md:p-8 space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                ASTRA Control Hub & Integrations
              </h1>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wide uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v4.5 Live Central
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Live neural connectors, cloud storage, Google Workspace, payment gateways, and autonomous tool routing.
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowVaultDrawer(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-white/10 transition-all hover:border-cyan-500/40"
          >
            <Key size={16} className="text-cyan-400" />
            <span>Secrets Vault</span>
          </button>
          <button
            onClick={handleTestAll}
            disabled={isTestingAll}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={isTestingAll ? 'animate-spin' : ''} />
            <span>{isTestingAll ? 'Testing 22 Services...' : 'Test All Connections'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 relative overflow-hidden">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Total Registered</div>
          <div className="text-3xl font-extrabold text-white mt-1 font-mono">{totalCount}</div>
          <div className="text-xs text-slate-500 mt-1">Official cloud & workspace APIs</div>
        </div>

        <div className="bg-emerald-950/20 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/20 relative overflow-hidden">
          <div className="text-xs uppercase tracking-wider text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active & Verified
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{connectedCount}</div>
          <div className="text-xs text-emerald-300/70 mt-1">Verified connection health</div>
        </div>

        <div className="bg-amber-950/20 backdrop-blur-md rounded-2xl p-4 border border-amber-500/20 relative overflow-hidden">
          <div className="text-xs uppercase tracking-wider text-amber-400 font-medium">Setup Required</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">
            {connectors.filter((c) => c.status === 'SETUP_REQUIRED').length}
          </div>
          <div className="text-xs text-amber-300/70 mt-1">API Key or Token needed</div>
        </div>

        <div className="bg-cyan-950/20 backdrop-blur-md rounded-2xl p-4 border border-cyan-500/20 relative overflow-hidden">
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-medium">OAuth Pending</div>
          <div className="text-3xl font-extrabold text-cyan-400 mt-1 font-mono">
            {connectors.filter((c) => c.status === 'AUTHORIZATION_REQUIRED').length}
          </div>
          <div className="text-xs text-cyan-300/70 mt-1">Workspace Bearer token required</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by provider, capability, secret..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {['ALL', 'CONNECTED', 'SETUP_REQUIRED', 'AUTHORIZATION_REQUIRED', 'ERROR'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedStatus === st
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 scrollbar-none">
          {[
            'ALL',
            'AI & MODELS',
            'GOOGLE WORKSPACE',
            'DEVELOPMENT',
            'DATABASE',
            'STORAGE',
            'COMMUNICATION',
            'PAYMENTS',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
          <RefreshCw className="animate-spin text-cyan-400" size={32} />
          <p className="text-sm">Synchronizing Dynamic Integration Registry...</p>
        </div>
      ) : filteredIntegrations.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-2xl border border-white/5 p-8">
          <Activity size={36} className="mx-auto text-slate-600 mb-2" />
          <h3 className="text-base font-semibold text-slate-300">No matching integrations found</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing your search query or switching category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredIntegrations.map((item) => {
            const Icon = getIntegrationIcon(item.iconName);
            const isCurrentlyTesting = testingId === item.id;
            const isConnected = item.status === 'CONNECTED';

            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  isConnected
                    ? 'bg-slate-900/70 border-emerald-500/25 hover:border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                          isConnected
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-white/5 text-slate-300 border border-white/10'
                        }`}
                      >
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-base leading-tight group-hover:text-cyan-200 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{item.provider}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Required Secrets / Auth Type Info */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Key size={11} className="text-cyan-400" />
                      Required Secrets:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.requiredSecrets.map((sec) => (
                        <span
                          key={sec.envVar}
                          className={`text-[11px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                            sec.isConfigured
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : 'bg-slate-800/80 text-amber-300 border-amber-500/20'
                          }`}
                          title={`${sec.label} (${sec.isConfigured ? 'Configured' : 'Missing'})`}
                        >
                          {sec.isConfigured && <Check size={10} className="text-emerald-400" />}
                          {sec.envVar}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Capabilities Tags */}
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {item.capabilities.slice(0, 3).map((cap, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                        >
                          {cap}
                        </span>
                      ))}
                      {item.capabilities.length > 3 && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white/5 text-slate-500">
                          +{item.capabilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Error Message if any */}
                  {item.errorMessage && item.status !== 'CONNECTED' && (
                    <div className="mt-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-start gap-1.5">
                      <AlertTriangle size={13} className="shrink-0 mt-0.5 text-rose-400" />
                      <span>{item.errorMessage}</span>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 font-mono">
                    {item.latency !== '—' ? `Latency: ${item.latency}` : 'Standby'}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Test Connection Button */}
                    <button
                      onClick={() => handleTestConnection(item)}
                      disabled={isCurrentlyTesting}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1 transition-colors disabled:opacity-50"
                      title="Run live ping/health check"
                    >
                      <RefreshCw size={12} className={isCurrentlyTesting ? 'animate-spin text-cyan-400' : ''} />
                      <span>Test</span>
                    </button>

                    {/* Configure Secrets Button */}
                    <button
                      onClick={() => handleOpenConfig(item)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 flex items-center gap-1 transition-colors"
                      title="Configure API key / token"
                    >
                      <Key size={12} />
                      <span>Configure</span>
                    </button>

                    {/* Playground / Action Runner */}
                    {item.supportedActions.length > 0 && (
                      <button
                        onClick={() => handleOpenPlayground(item)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 flex items-center gap-1 transition-colors"
                        title="Run real provider actions"
                      >
                        <Play size={12} />
                        <span>Run</span>
                      </button>
                    )}

                    {/* Disconnect button if connected */}
                    {isConnected && item.id !== 'firebase' && (
                      <button
                        onClick={() => handleDisconnect(item)}
                        className="p-1.5 rounded-lg text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
                        title="Disconnect and clear secrets"
                      >
                        <Power size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIGURE SECRETS MODAL */}
      {/* ========================================================================= */}
      {configModalIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">
                    Configure {configModalIntegration.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Secure credentials saved to server-side encrypted vault.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfigModalIntegration(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveConfig} className="p-6 space-y-4">
              <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-white/5 leading-relaxed">
                <div className="font-semibold text-cyan-300 mb-1">Security Guarantee:</div>
                Private keys and OAuth tokens are never returned in plain text or leaked to client scripts. They are safely kept server-side in the ASTRA Enclave.
              </div>

              {configModalIntegration.requiredSecrets.map((sec) => {
                const isMasked = !showSecretValues[sec.envVar];
                return (
                  <div key={sec.envVar} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                        <span>{sec.label}</span>
                        <code className="text-[10px] text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded font-mono">
                          {sec.envVar}
                        </code>
                      </label>
                      {sec.docUrl && (
                        <a
                          href={sec.docUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>Get key</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{sec.description}</p>
                    <div className="relative">
                      <input
                        type={isMasked ? 'password' : 'text'}
                        value={secretInputs[sec.envVar] || ''}
                        onChange={(e) =>
                          setSecretInputs((prev) => ({ ...prev, [sec.envVar]: e.target.value }))
                        }
                        placeholder={sec.previewMasked ? `Currently: ${sec.previewMasked}` : 'Paste secret key here...'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSecretValues((prev) => ({
                            ...prev,
                            [sec.envVar]: !prev[sec.envVar],
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {isMasked ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setConfigModalIntegration(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingConfig ? <RefreshCw size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                  <span>{isSavingConfig ? 'Verifying...' : 'Save & Verify Connection'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PLAYGROUND / ACTION RUNNER MODAL */}
      {/* ========================================================================= */}
      {playgroundIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <Terminal size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">
                    {playgroundIntegration.name} Playground
                  </h3>
                  <p className="text-xs text-slate-400">
                    Execute real server actions via official provider endpoints.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPlaygroundIntegration(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Action Selection */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Select Action to Execute:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {playgroundIntegration.supportedActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => {
                        setSelectedActionId(action.id);
                        const defaultParams: Record<string, any> = {};
                        for (const p of action.params) {
                          if (p.defaultValue !== undefined) {
                            defaultParams[p.name] = p.defaultValue;
                          }
                        }
                        setActionParams(defaultParams);
                        setActionResult(null);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedActionId === action.id
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200'
                          : 'bg-slate-950 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white">{action.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {action.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Parameter Form */}
              {(() => {
                const currentAction = playgroundIntegration.supportedActions.find(
                  (a) => a.id === selectedActionId
                );
                if (!currentAction || currentAction.params.length === 0) return null;

                return (
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <div className="text-xs font-semibold text-slate-300">Action Parameters:</div>
                    {currentAction.params.map((param) => (
                      <div key={param.name} className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                          <span>{param.label}</span>
                          {param.required && (
                            <span className="text-[10px] text-rose-400">Required</span>
                          )}
                        </label>
                        {param.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            value={actionParams[param.name] ?? ''}
                            onChange={(e) =>
                              setActionParams((prev) => ({
                                ...prev,
                                [param.name]: e.target.value,
                              }))
                            }
                            placeholder={param.placeholder || ''}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 font-mono"
                          />
                        ) : (
                          <input
                            type={param.type === 'number' ? 'number' : 'text'}
                            value={actionParams[param.name] ?? ''}
                            onChange={(e) =>
                              setActionParams((prev) => ({
                                ...prev,
                                [param.name]:
                                  param.type === 'number'
                                    ? parseInt(e.target.value, 10) || 0
                                    : e.target.value,
                              }))
                            }
                            placeholder={param.placeholder || ''}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 font-mono"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Execution Output */}
              {actionResult && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">Response Payload:</span>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        actionResult.success
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {actionResult.status || (actionResult.success ? 'SUCCESS' : 'FAILED')}
                    </span>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-white/10 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-48 scrollbar-thin">
                    {JSON.stringify(actionResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setPlaygroundIntegration(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={isExecutingAction}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isExecutingAction ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <Play size={13} />
                )}
                <span>{isExecutingAction ? 'Executing Tool...' : 'Execute Tool Action'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECRETS VAULT AUDIT DRAWER */}
      {/* ========================================================================= */}
      {showVaultDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">
                    Master Integration Secrets Registry
                  </h3>
                  <p className="text-xs text-slate-400">
                    Comprehensive audit of all 22 required server-side credentials and masked previews.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVaultDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="p-6 overflow-y-auto space-y-2">
              <div className="text-xs text-slate-400 mb-2">
                Configure these environment variables in your deployment or click "Configure" to inject them securely at runtime.
              </div>

              {connectors.flatMap((item) =>
                item.requiredSecrets.map((sec) => (
                  <div
                    key={`${item.id}-${sec.envVar}`}
                    className="p-3 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          sec.isConfigured ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono font-bold text-white">
                            {sec.envVar}
                          </code>
                          <span className="text-[10px] text-slate-500 font-medium">
                            ({item.name})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{sec.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400">
                        {sec.previewMasked || '(not configured)'}
                      </span>
                      <button
                        onClick={() => {
                          setShowVaultDrawer(false);
                          handleOpenConfig(item);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-white/10 flex items-center justify-end shrink-0">
              <button
                onClick={() => setShowVaultDrawer(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white"
              >
                Close Registry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
