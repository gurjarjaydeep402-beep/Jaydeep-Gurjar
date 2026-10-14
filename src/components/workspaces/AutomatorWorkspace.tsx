import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  CornerDownRight,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Flame,
  Globe,
  HelpCircle,
  History,
  Layers,
  LayoutGrid,
  MessageSquare,
  Network,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Shield,
  Shuffle,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  TrendingUp,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { AstraLogo } from '../AstraLogo';
import { useCredits } from '../../lib/CreditContext';
import type { WorkspaceId } from '../../types';

interface AutomatorWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
  onNavigate?: (id: WorkspaceId) => void;
}

export type TriggerApp = 'market' | 'chat' | 'coding' | 'app-factory' | 'files' | 'schedule' | 'webhook';
export type ActionApp = 'chat' | 'market' | 'coding' | 'developer-ji' | 'image' | 'files' | 'connectors' | 'telemetry';

export interface AutomationNode {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'Trading & Market' | 'Code & Dev' | 'App Studio' | 'Workspace Sync' | 'Alerts & Telemetry';
  trigger: {
    app: TriggerApp;
    appLabel: string;
    event: string;
    description: string;
    payloadKey: string;
  };
  condition: {
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'is_not_empty';
    value: string;
    displayExpr: string;
  };
  thenAction: {
    app: ActionApp;
    appLabel: string;
    actionName: string;
    description: string;
    params: Record<string, string>;
  };
  elseAction?: {
    app: ActionApp;
    appLabel: string;
    actionName: string;
    description: string;
    params: Record<string, string>;
  };
  stats: {
    runsCount: number;
    successRate: number;
    lastExecuted: string;
  };
}

export interface ExecutionLog {
  id: string;
  chainId: string;
  chainName: string;
  timestamp: string;
  triggerEvent: string;
  conditionMet: boolean;
  branchTaken: 'THEN' | 'ELSE';
  actionExecuted: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  durationMs: number;
}

// Default Pre-Configured Automation Chains
const DEFAULT_AUTOMATION_CHAINS: AutomationNode[] = [
  {
    id: 'chain-crypto-dip-buyer',
    name: 'Autonomous Crypto Dip Buyer & Alert',
    description: 'Watches BTC spot price. When price drops below $65,000 with high volume, executes a 500 USDT buy order and alerts in ASTRA Chat.',
    enabled: true,
    category: 'Trading & Market',
    trigger: {
      app: 'market',
      appLabel: 'Trading & Finance',
      event: 'market.ticker.update',
      description: 'New real-time price tick evaluated on BTC/USDT',
      payloadKey: 'payload.price',
    },
    condition: {
      field: 'payload.price',
      operator: 'less_than',
      value: '65000',
      displayExpr: 'BTC Spot Price < $65,000.00',
    },
    thenAction: {
      app: 'market',
      appLabel: 'Trading & Finance',
      actionName: 'market.execute_order',
      description: 'Execute instant Market Buy order of 500 USDT with slippage protection',
      params: { asset: 'BTC', amount: '500', type: 'BUY_MARKET' },
    },
    elseAction: {
      app: 'telemetry',
      appLabel: 'Control & Telemetry',
      actionName: 'telemetry.log_heartbeat',
      description: 'Record normal price tick in ledger without triggering capital allocation',
      params: { interval: '60s', level: 'INFO' },
    },
    stats: {
      runsCount: 148,
      successRate: 99.3,
      lastExecuted: '3m ago',
    },
  },
  {
    id: 'chain-dev-lint-healer',
    name: 'Autonomous Code Lint & Bug Healer',
    description: 'When Code Assistant detects a compiler or TypeScript error, automatically dispatches Developer Ji agent to analyze and patch the file.',
    enabled: true,
    category: 'Code & Dev',
    trigger: {
      app: 'coding',
      appLabel: 'Code & Dev',
      event: 'code.compile.error',
      description: 'TypeScript or Vite build error detected in working tree',
      payloadKey: 'error.exitCode',
    },
    condition: {
      field: 'error.exitCode',
      operator: 'greater_than',
      value: '0',
      displayExpr: 'Compiler Exit Code > 0 (Error Detected)',
    },
    thenAction: {
      app: 'developer-ji',
      appLabel: 'Developer Ji Agent',
      actionName: 'agent.autofix_patch',
      description: 'Deploy Developer Ji agent to synthesize bugfix patch and run tests',
      params: { strategy: 'auto_repair', runLintAfter: 'true' },
    },
    elseAction: {
      app: 'chat',
      appLabel: 'ASTRA Chat',
      actionName: 'chat.send_toast',
      description: 'Log clean build verification in project telemetry dashboard',
      params: { message: 'Build verification passed.' },
    },
    stats: {
      runsCount: 64,
      successRate: 96.8,
      lastExecuted: '18m ago',
    },
  },
  {
    id: 'chain-applet-asset-pipeline',
    name: 'App Factory Asset Auto-Synthesizer',
    description: 'When a new web application is compiled in App Studio, automatically generates matching UI marketing banners in Image Studio.',
    enabled: true,
    category: 'App Studio',
    trigger: {
      app: 'app-factory',
      appLabel: 'App Builder',
      event: 'applet.build.success',
      description: 'Standalone HTML5/React applet successfully compiled and saved',
      payloadKey: 'applet.status',
    },
    condition: {
      field: 'applet.category',
      operator: 'contains',
      value: 'game',
      displayExpr: 'App Category contains "game" or "studio"',
    },
    thenAction: {
      app: 'image',
      appLabel: 'Image Studio',
      actionName: 'image.generate_asset',
      description: 'Generate 16:9 holographic cyber art banner for the App Store thumbnail',
      params: { style: 'cyberpunk_neon', resolution: '1024x1024' },
    },
    elseAction: {
      app: 'files',
      appLabel: 'Files & Vector RAG',
      actionName: 'files.index_document',
      description: 'Index applet source code for vector similarity search',
      params: { collection: 'applets_library' },
    },
    stats: {
      runsCount: 32,
      successRate: 100,
      lastExecuted: '1h ago',
    },
  },
  {
    id: 'chain-daily-briefing-scheduler',
    name: 'Daily Executive Briefing Synthesizer',
    description: 'Runs every morning at 09:00 AM. Evaluates market volatility and generates an automated audio podcast briefing via Voice Engine.',
    enabled: false,
    category: 'Workspace Sync',
    trigger: {
      app: 'schedule',
      appLabel: 'Cron Scheduler',
      event: 'cron.schedule.daily',
      description: 'Triggered automatically daily at 09:00:00 UTC',
      payloadKey: 'cron.triggerHour',
    },
    condition: {
      field: 'market.volatility24h',
      operator: 'greater_than',
      value: '2.5',
      displayExpr: 'Market Volatility Index > 2.50%',
    },
    thenAction: {
      app: 'chat',
      appLabel: 'ASTRA Chat',
      actionName: 'chat.dispatch_briefing',
      description: 'Synthesize comprehensive executive audio briefing and push to chat',
      params: { voice: 'Nova', includeCharts: 'true' },
    },
    elseAction: {
      app: 'telemetry',
      appLabel: 'Control & Telemetry',
      actionName: 'telemetry.log_heartbeat',
      description: 'Skip audio synthesis; send standard text recap',
      params: { type: 'silent_recap' },
    },
    stats: {
      runsCount: 28,
      successRate: 100,
      lastExecuted: 'Yesterday',
    },
  },
];

export function AutomatorWorkspace({ onBack, onNotify, onNavigate }: AutomatorWorkspaceProps) {
  const { deductCredits } = useCredits();

  // State Management
  const [chains, setChains] = useState<AutomationNode[]>(() => {
    try {
      const saved = localStorage.getItem('astra_automation_chains_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_AUTOMATION_CHAINS;
  });

  const [selectedChainId, setSelectedChainId] = useState<string>(DEFAULT_AUTOMATION_CHAINS[0].id);
  const [activeTab, setActiveTab] = useState<'visual_canvas' | 'all_chains' | 'execution_logs' | 'templates'>('visual_canvas');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Execution Simulator State
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testExecutionModal, setTestExecutionModal] = useState<{
    open: boolean;
    chain: AutomationNode | null;
    logs: string[];
    resultBranch: 'THEN' | 'ELSE' | null;
    completed: boolean;
  }>({
    open: false,
    chain: null,
    logs: [],
    resultBranch: null,
    completed: false,
  });

  // Create New Chain Modal
  const [isNewChainModalOpen, setIsNewChainModalOpen] = useState(false);
  const [newChainForm, setNewChainForm] = useState({
    name: '',
    description: '',
    category: 'Trading & Market' as AutomationNode['category'],
    triggerApp: 'market' as TriggerApp,
    triggerEvent: 'market.price.drop',
    conditionField: 'price',
    conditionOperator: 'less_than' as AutomationNode['condition']['operator'],
    conditionValue: '65000',
    thenApp: 'chat' as ActionApp,
    thenActionName: 'chat.send_alert',
    elseApp: 'telemetry' as ActionApp,
    elseActionName: 'telemetry.log_event',
  });

  // Recent Execution History
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([
    {
      id: 'log-1',
      chainId: 'chain-crypto-dip-buyer',
      chainName: 'Autonomous Crypto Dip Buyer & Alert',
      timestamp: 'Just now',
      triggerEvent: 'market.ticker.update (BTC @ $64,210.50)',
      conditionMet: true,
      branchTaken: 'THEN',
      actionExecuted: 'market.execute_order (500 USDT BTC)',
      status: 'SUCCESS',
      durationMs: 142,
    },
    {
      id: 'log-2',
      chainId: 'chain-dev-lint-healer',
      chainName: 'Autonomous Code Lint & Bug Healer',
      timestamp: '18m ago',
      triggerEvent: 'code.compile.error (Exit Code 1)',
      conditionMet: true,
      branchTaken: 'THEN',
      actionExecuted: 'developer-ji.autofix_patch (3 files modified)',
      status: 'SUCCESS',
      durationMs: 820,
    },
    {
      id: 'log-3',
      chainId: 'chain-applet-asset-pipeline',
      chainName: 'App Factory Asset Auto-Synthesizer',
      timestamp: '1h ago',
      triggerEvent: 'applet.build.success ("Agneepath Fire Game")',
      conditionMet: true,
      branchTaken: 'THEN',
      actionExecuted: 'image.generate_asset (Thumbnail 1024x1024)',
      status: 'SUCCESS',
      durationMs: 1250,
    },
    {
      id: 'log-4',
      chainId: 'chain-crypto-dip-buyer',
      chainName: 'Autonomous Crypto Dip Buyer & Alert',
      timestamp: '2h ago',
      triggerEvent: 'market.ticker.update (BTC @ $68,400.00)',
      conditionMet: false,
      branchTaken: 'ELSE',
      actionExecuted: 'telemetry.log_heartbeat (Price > $65,000)',
      status: 'SKIPPED',
      durationMs: 38,
    },
  ]);

  // Persist chains to localStorage
  const saveChains = (newChains: AutomationNode[]) => {
    setChains(newChains);
    try {
      localStorage.setItem('astra_automation_chains_v2', JSON.stringify(newChains));
    } catch {}
  };

  // Toggle Chain Enable/Disable
  const toggleChain = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = chains.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c));
    saveChains(updated);
    const target = updated.find((c) => c.id === id);
    onNotify(target?.enabled ? `Automation "${target.name}" activated!` : `Automation "${target?.name}" paused.`);
  };

  // Delete Chain
  const deleteChain = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (chains.length <= 1) {
      onNotify('At least one automation chain must be preserved.');
      return;
    }
    const updated = chains.filter((c) => c.id !== id);
    saveChains(updated);
    if (selectedChainId === id) {
      setSelectedChainId(updated[0].id);
    }
    onNotify('Automation chain deleted.');
  };

  // Selected Chain Object
  const currentChain = chains.find((c) => c.id === selectedChainId) || chains[0];

  // Test Run Simulator
  const handleTestRun = async (chainToRun: AutomationNode) => {
    if (isRunningTest) return;
    setIsRunningTest(true);

    setTestExecutionModal({
      open: true,
      chain: chainToRun,
      logs: ['[0.00s] Initializing execution runner for: ' + chainToRun.name],
      resultBranch: null,
      completed: false,
    });

    await new Promise((r) => setTimeout(r, 400));
    setTestExecutionModal((prev) => ({
      ...prev,
      logs: [
        ...prev.logs,
        `[0.42s] ⚡ Ingested Trigger: ${chainToRun.trigger.event} from ${chainToRun.trigger.appLabel}`,
      ],
    }));

    await new Promise((r) => setTimeout(r, 500));
    const isConditionMet = Math.random() > 0.2; // simulate evaluation
    const branch = isConditionMet ? 'THEN' : 'ELSE';

    setTestExecutionModal((prev) => ({
      ...prev,
      logs: [
        ...prev.logs,
        `[0.95s] 🔀 Evaluating Condition: [${chainToRun.condition.displayExpr}] => ${isConditionMet ? 'TRUE (Condition Met)' : 'FALSE (Fallback Path)'}`,
      ],
    }));

    await new Promise((r) => setTimeout(r, 600));
    const executedAction = isConditionMet ? chainToRun.thenAction : (chainToRun.elseAction || chainToRun.thenAction);

    setTestExecutionModal((prev) => ({
      ...prev,
      logs: [
        ...prev.logs,
        `[1.55s] 🚀 Dispatched ${branch} Action: [${executedAction.actionName}] -> Destination: ${executedAction.appLabel}`,
        `[1.80s] ✓ Task completed with status: SUCCESS (Latency: 142ms)`,
      ],
      resultBranch: branch,
      completed: true,
    }));

    // Update Chain Stats
    const updatedChains = chains.map((c) => {
      if (c.id === chainToRun.id) {
        return {
          ...c,
          stats: {
            ...c.stats,
            runsCount: c.stats.runsCount + 1,
            lastExecuted: 'Just now',
          },
        };
      }
      return c;
    });
    saveChains(updatedChains);

    // Record Log
    const newLog: ExecutionLog = {
      id: `log-${Date.now()}`,
      chainId: chainToRun.id,
      chainName: chainToRun.name,
      timestamp: 'Just now',
      triggerEvent: `${chainToRun.trigger.event} (Simulated Event)`,
      conditionMet: isConditionMet,
      branchTaken: branch,
      actionExecuted: executedAction.actionName,
      status: 'SUCCESS',
      durationMs: 142,
    };
    setExecutionLogs((prev) => [newLog, ...prev.slice(0, 19)]);

    setIsRunningTest(false);
    onNotify(`Automation chain test passed successfully! [${branch} branch executed]`);
  };

  // Create Chain Submission
  const handleCreateNewChain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChainForm.name.trim()) return;

    const newChain: AutomationNode = {
      id: `chain-${Date.now()}`,
      name: newChainForm.name.trim(),
      description: newChainForm.description.trim() || 'Custom user visual automation chain.',
      enabled: true,
      category: newChainForm.category,
      trigger: {
        app: newChainForm.triggerApp,
        appLabel: newChainForm.triggerApp.toUpperCase(),
        event: newChainForm.triggerEvent,
        description: 'User configured event trigger',
        payloadKey: `payload.${newChainForm.conditionField}`,
      },
      condition: {
        field: `payload.${newChainForm.conditionField}`,
        operator: newChainForm.conditionOperator,
        value: newChainForm.conditionValue,
        displayExpr: `${newChainForm.conditionField} ${newChainForm.conditionOperator} ${newChainForm.conditionValue}`,
      },
      thenAction: {
        app: newChainForm.thenApp,
        appLabel: newChainForm.thenApp.toUpperCase(),
        actionName: newChainForm.thenActionName,
        description: 'Automated target action',
        params: {},
      },
      elseAction: {
        app: newChainForm.elseApp,
        appLabel: newChainForm.elseApp.toUpperCase(),
        actionName: newChainForm.elseActionName,
        description: 'Fallback alternative action',
        params: {},
      },
      stats: {
        runsCount: 0,
        successRate: 100,
        lastExecuted: 'Never',
      },
    };

    const updated = [newChain, ...chains];
    saveChains(updated);
    setSelectedChainId(newChain.id);
    setIsNewChainModalOpen(false);
    onNotify(`Created new automation chain: "${newChain.name}"!`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in select-text pb-12">
      {/* ========================================================================= */}
      {/* 1. TOP HERO HEADER & MASTER CONTROLS                                      */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#040b26]/95 via-[#06123d]/90 to-[#03081e]/95 border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_35px_rgba(34,211,238,0.15)] astra-glass-layer-2">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Back to Command Deck"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(34,211,238,0.4)] shrink-0">
            <Workflow size={24} />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2">
                <span>ASTRA Visual Automator & Flows</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold">
                IF / THEN / ELSE Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Build autonomous visual logic chains across workspace tools, triggers & connectors.
            </p>
          </div>
        </div>

        {/* Master Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={() => handleTestRun(currentChain)}
            disabled={isRunningTest}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#07133b] hover:bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400/70 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-50"
          >
            <Play size={13} className={isRunningTest ? 'animate-spin' : ''} />
            <span>{isRunningTest ? 'Executing...' : 'Test Run Chain'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewChainModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 text-white hover:brightness-110 shadow-[0_0_20px_rgba(34,211,238,0.35)] border border-cyan-300/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>New Automation</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-NAVIGATION TABS & METRICS ROW                                      */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-cyan-500/20 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('visual_canvas')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'visual_canvas'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>Visual Flow Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all_chains')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all_chains'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Workflow size={13} />
            <span>Active Chains ({chains.filter((c) => c.enabled).length}/{chains.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('execution_logs')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'execution_logs'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History size={13} />
            <span>Telemetry & Logs</span>
          </button>
        </div>

        {/* Real-time Summary Counters */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span>Engine: 100% Operational</span>
          </span>
          <span className="hidden sm:inline">Total Executions: {chains.reduce((acc, c) => acc + c.stats.runsCount, 0)}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. VISUAL FLOW CANVAS (IF/THEN/ELSE GRAPH)                                */}
      {/* ========================================================================= */}
      {activeTab === 'visual_canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Flow Selector List (col-span-4) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Select Workflow Chain
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">{chains.length} Flows</span>
            </div>

            <div className="space-y-2.5 max-h-[680px] overflow-y-auto scrollbar-thin pr-1">
              {chains.map((chain) => {
                const isSelected = chain.id === currentChain.id;
                return (
                  <div
                    key={chain.id}
                    onClick={() => setSelectedChainId(chain.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none space-y-2.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#071542] via-[#091b54] to-[#071542] border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                        : 'bg-[#040a24]/80 hover:bg-[#07113a]/90 border-cyan-500/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            chain.enabled ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-600'
                          }`}
                        />
                        <h3 className="text-xs sm:text-sm font-bold text-white truncate">{chain.name}</h3>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleChain(chain.id, e)}
                        className="text-slate-400 hover:text-cyan-300 transition-colors"
                        title={chain.enabled ? 'Pause Chain' : 'Activate Chain'}
                      >
                        {chain.enabled ? (
                          <ToggleRight size={22} className="text-emerald-400" />
                        ) : (
                          <ToggleLeft size={22} className="text-slate-500" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{chain.description}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] font-mono text-slate-400">
                      <span className="text-cyan-300">{chain.category}</span>
                      <span>Runs: {chain.stats.runsCount} ({chain.stats.successRate}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Interactive Node Graph (col-span-8) */}
          <div className="lg:col-span-8 rounded-3xl bg-[#040924]/90 border border-cyan-500/30 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden astra-glass-layer-2 min-h-[640px]">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#22d3ee 1px, transparent 1px), radial-gradient(#a855f7 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            {/* Canvas Header */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-500/20">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white">{currentChain.name}</h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      currentChain.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : 'bg-slate-800 text-slate-400 border-slate-600'
                    }`}
                  >
                    {currentChain.enabled ? 'ACTIVE RUNTIME' : 'PAUSED'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{currentChain.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTestRun(currentChain)}
                  disabled={isRunningTest}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.2)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Play size={12} />
                  <span>Run Once</span>
                </button>
              </div>
            </div>

            {/* VISUAL FLOW DIAGRAM NODES */}
            <div className="relative z-10 my-auto py-8 max-w-2xl mx-auto w-full space-y-6">
              {/* NODE 1: TRIGGER [ WHEN ] */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#07133b] to-[#0a1e5c] border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.25)] relative group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <Zap size={13} className="text-cyan-400" />
                    <span>STEP 1: WHEN (TRIGGER EVENT)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                    Source: {currentChain.trigger.appLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold">
                    {currentChain.trigger.app === 'market' ? <TrendingUp size={20} /> : <Zap size={20} />}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono">{currentChain.trigger.event}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{currentChain.trigger.description}</div>
                  </div>
                </div>
              </div>

              {/* CONNECTING ARROW 1 */}
              <div className="flex flex-col items-center justify-center my-1">
                <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-ping" />
              </div>

              {/* NODE 2: CONDITION [ IF / ELSE EVALUATION ] */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#170e33] to-[#261352] border-2 border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.25)] relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <Shuffle size={13} className="text-purple-400" />
                    <span>STEP 2: IF (CONDITION LOGIC)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-200 border border-purple-400/30">
                    Rule Evaluator
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 font-bold">
                    🔀
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono text-amber-300">
                      {currentChain.condition.displayExpr}
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Evaluates payload variable dynamically upon event arrival
                    </div>
                  </div>
                </div>
              </div>

              {/* SPLIT BRANCH ARROWS (THEN vs ELSE) */}
              <div className="grid grid-cols-2 gap-4 my-1">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 mb-1">TRUE (MATCH)</span>
                  <div className="w-0.5 h-6 bg-emerald-400" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono font-bold text-rose-400 mb-1">FALSE (FALLBACK)</span>
                  <div className="w-0.5 h-6 bg-rose-400" />
                </div>
              </div>

              {/* NODE 3: DUAL ACTION BRANCHES (THEN vs ELSE) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 3A: THEN ACTION */}
                <div className="p-3.5 rounded-2xl bg-[#061c2b] border-2 border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.2)] space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 font-bold">
                    <span>STEP 3A: THEN (ACTION)</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20">Destination</span>
                  </div>
                  <div className="text-xs font-bold text-white font-mono">{currentChain.thenAction.actionName}</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{currentChain.thenAction.description}</p>
                </div>

                {/* 3B: ELSE ACTION */}
                <div className="p-3.5 rounded-2xl bg-[#1a0f2b] border-2 border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.15)] space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-rose-300 font-bold">
                    <span>STEP 3B: ELSE (FALLBACK)</span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20">Alternative</span>
                  </div>
                  <div className="text-xs font-bold text-white font-mono">
                    {currentChain.elseAction?.actionName || 'telemetry.log_event'}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {currentChain.elseAction?.description || 'Log event and maintain standby state without side-effects.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Canvas Footer Bar */}
            <div className="relative z-10 pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span>Runs: <b className="text-white">{currentChain.stats.runsCount}</b></span>
                <span>Success: <b className="text-emerald-400">{currentChain.stats.successRate}%</b></span>
                <span>Last run: <b className="text-cyan-300">{currentChain.stats.lastExecuted}</b></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => deleteChain(currentChain.id)}
                  className="px-3 py-1 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Delete Flow</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ACTIVE CHAINS GRID & DIRECTORY VIEW                                     */}
      {/* ========================================================================= */}
      {activeTab === 'all_chains' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chains.map((chain) => (
              <div
                key={chain.id}
                className="p-5 rounded-3xl bg-[#040924]/85 border border-cyan-500/25 hover:border-cyan-400/50 shadow-xl transition-all space-y-3.5 astra-glass-card group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold tracking-wider">
                      {chain.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1 group-hover:text-cyan-200 transition-colors">
                      {chain.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleChain(chain.id, e)}
                    className="cursor-pointer"
                  >
                    {chain.enabled ? (
                      <ToggleRight size={26} className="text-emerald-400" />
                    ) : (
                      <ToggleLeft size={26} className="text-slate-600" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{chain.description}</p>

                {/* Micro Steps Capsule */}
                <div className="p-3 rounded-2xl bg-[#071033] border border-white/5 space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-cyan-300 truncate">
                    <span className="font-bold">WHEN:</span>
                    <span className="truncate">{chain.trigger.event}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300 truncate">
                    <span className="font-bold">IF:</span>
                    <span className="truncate">{chain.condition.displayExpr}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300 truncate">
                    <span className="font-bold">THEN:</span>
                    <span className="truncate">{chain.thenAction.actionName}</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-[11px] font-mono text-slate-400">{chain.stats.runsCount} executions</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTestRun(chain)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 flex items-center gap-1 cursor-pointer"
                    >
                      <Play size={11} />
                      <span>Test</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedChainId(chain.id);
                        setActiveTab('visual_canvas');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 cursor-pointer"
                    >
                      Inspect Flow →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TELEMETRY & EXECUTION LOGS TAB                                         */}
      {/* ========================================================================= */}
      {activeTab === 'execution_logs' && (
        <div className="p-6 rounded-3xl bg-[#040924]/90 border border-cyan-500/25 space-y-4 shadow-xl astra-glass-layer-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <History size={16} className="text-cyan-400" />
                <span>Execution Audit & Telemetry Ledger</span>
              </h2>
              <p className="text-xs text-slate-400">Detailed historical traces of visual chain evaluations and dispatches.</p>
            </div>

            <button
              type="button"
              onClick={() => onNotify('Telemetry ledger exported to CSV.')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer self-start sm:self-auto"
            >
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Automation Chain</th>
                  <th className="py-2.5 px-3">Trigger Event</th>
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">Executed Action</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {executionLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans font-bold text-white">{log.chainName}</td>
                    <td className="py-3 px-3 text-cyan-300">{log.triggerEvent}</td>
                    <td className="py-3 px-3">
                      <span className={log.branchTaken === 'THEN' ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                        {log.branchTaken}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{log.actionExecuted}</td>
                    <td className="py-3 px-3 text-slate-400">{log.durationMs}ms</td>
                    <td className="py-3 px-3 text-slate-500">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TEST EXECUTION RUNNER MODAL                                            */}
      {/* ========================================================================= */}
      {testExecutionModal.open && testExecutionModal.chain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
          <div className="w-full max-w-lg rounded-3xl bg-[#061036] border border-cyan-500/40 p-6 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Play size={16} className="text-cyan-400" />
                <h3 className="text-base font-bold text-white">Live Automation Simulator</h3>
              </div>
              <button
                type="button"
                onClick={() => setTestExecutionModal((prev) => ({ ...prev, open: false }))}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono text-cyan-300 font-bold">{testExecutionModal.chain.name}</div>
              <div className="text-[11px] text-slate-400">{testExecutionModal.chain.description}</div>
            </div>

            {/* Execution Trace Terminal Viewport */}
            <div className="p-3.5 rounded-2xl bg-[#020514] border border-white/10 font-mono text-xs text-slate-300 space-y-2 min-h-[160px] max-h-56 overflow-y-auto">
              {testExecutionModal.logs.map((logItem, idx) => (
                <div
                  key={idx}
                  className={
                    logItem.includes('SUCCESS')
                      ? 'text-emerald-400 font-bold'
                      : logItem.includes('TRUE')
                      ? 'text-cyan-300'
                      : 'text-slate-300'
                  }
                >
                  {logItem}
                </div>
              ))}
              {!testExecutionModal.completed && (
                <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Processing node pipeline...</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                disabled={!testExecutionModal.completed}
                onClick={() => setTestExecutionModal((prev) => ({ ...prev, open: false }))}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CREATE NEW AUTOMATION CHAIN MODAL                                      */}
      {/* ========================================================================= */}
      {isNewChainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
          <div className="w-full max-w-xl rounded-3xl bg-[#061036] border border-cyan-500/40 p-6 space-y-4 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Workflow size={18} className="text-cyan-400" />
                <h3 className="text-base font-bold text-white">Synthesize New Visual Chain</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewChainModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateNewChain} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1 font-sans">Automation Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SOL Profit Taker & Discord Broadcast"
                  value={newChainForm.name}
                  onChange={(e) => setNewChainForm({ ...newChainForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1 font-sans">Description & Intent</label>
                <textarea
                  rows={2}
                  placeholder="Explain when this workflow triggers and what it executes..."
                  value={newChainForm.description}
                  onChange={(e) => setNewChainForm({ ...newChainForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white outline-none focus:border-cyan-400 font-sans resize-none"
                />
              </div>

              {/* 3 Step Visual Builders */}
              <div className="p-3.5 rounded-2xl bg-[#03081e] border border-cyan-500/30 space-y-3">
                <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold">1. Trigger (WHEN)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Source Workspace Tool</label>
                    <select
                      value={newChainForm.triggerApp}
                      onChange={(e) => setNewChainForm({ ...newChainForm, triggerApp: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white outline-none"
                    >
                      <option value="market">Trading & Finance (Market)</option>
                      <option value="chat">ASTRA Chat</option>
                      <option value="coding">Code & Dev</option>
                      <option value="app-factory">App Builder</option>
                      <option value="schedule">Cron Scheduler</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Event Hook</label>
                    <input
                      type="text"
                      value={newChainForm.triggerEvent}
                      onChange={(e) => setNewChainForm({ ...newChainForm, triggerEvent: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#03081e] border border-purple-500/30 space-y-3">
                <span className="text-[10px] font-mono text-purple-300 uppercase font-bold">2. Condition (IF / ELSE)</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Variable Field</label>
                    <input
                      type="text"
                      value={newChainForm.conditionField}
                      onChange={(e) => setNewChainForm({ ...newChainForm, conditionField: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Operator</label>
                    <select
                      value={newChainForm.conditionOperator}
                      onChange={(e) => setNewChainForm({ ...newChainForm, conditionOperator: e.target.value as any })}
                      className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white outline-none font-mono"
                    >
                      <option value="less_than">&lt; Less Than</option>
                      <option value="greater_than">&gt; Greater Than</option>
                      <option value="equals">== Equals</option>
                      <option value="contains">Contains</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Comparison Value</label>
                    <input
                      type="text"
                      value={newChainForm.conditionValue}
                      onChange={(e) => setNewChainForm({ ...newChainForm, conditionValue: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#03081e] border border-emerald-500/30 space-y-3">
                <span className="text-[10px] font-mono text-emerald-300 uppercase font-bold">3. Destination Action (THEN)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Target Workspace Tool</label>
                    <select
                      value={newChainForm.thenApp}
                      onChange={(e) => setNewChainForm({ ...newChainForm, thenApp: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white outline-none"
                    >
                      <option value="chat">ASTRA Chat (Send Message)</option>
                      <option value="market">Trading & Finance (Execute Order)</option>
                      <option value="developer-ji">Developer Ji (Auto-Fix Code)</option>
                      <option value="image">Image Studio (Synthesize Asset)</option>
                      <option value="connectors">Cloud Connectors (Webhook/DB)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Action Method</label>
                    <input
                      type="text"
                      value={newChainForm.thenActionName}
                      onChange={(e) => setNewChainForm({ ...newChainForm, thenActionName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewChainModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:brightness-110 shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer"
                >
                  Save & Activate Chain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
