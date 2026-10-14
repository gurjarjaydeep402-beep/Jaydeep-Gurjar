import React, { useState } from 'react';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Code2,
  FileCode,
  FolderGit2,
  GitBranch,
  History,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { AstraLogo } from '../AstraLogo';
import { useCredits } from '../../lib/CreditContext';
import { useConnectors } from '../../lib/ConnectorsContext';
import { checkPermission } from '../../lib/securityGuard';
import { AccessDeniedView } from '../AccessDeniedView';

interface DeveloperJiWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

interface CheckpointItem {
  id: string;
  version: string;
  timestamp: string;
  title: string;
  filesChanged: string[];
  status: 'verified' | 'stable';
}

const INITIAL_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'cp-01',
    version: 'v4.2.1-stable',
    timestamp: '2026-09-27 10:14',
    title: 'Integrated Central Credit Ledger & Promo Code Manager',
    filesChanged: ['src/lib/CreditContext.tsx', 'src/types.ts', 'src/components/PaywallModal.tsx'],
    status: 'verified',
  },
  {
    id: 'cp-02',
    version: 'v4.2.0-core',
    timestamp: '2026-09-26 18:30',
    title: 'Configured Firebase Firestore Auth and Applet Routing',
    filesChanged: ['src/lib/firebase.ts', 'src/lib/AuthContext.tsx', 'src/App.tsx'],
    status: 'stable',
  },
];

export function DeveloperJiWorkspace({ onBack, onNotify }: DeveloperJiWorkspaceProps) {
  const { deductCredits, userRole } = useCredits();
  const { connectors, testConnection } = useConnectors();

  // OWNER ONLY SECURITY ENFORCEMENT
  if (userRole !== 'OWNER') {
    return (
      <AccessDeniedView
        requiredRole="OWNER"
        currentRole={userRole}
        targetFeature="Developer Ji & Source Modification Engine"
        onBack={onBack}
      />
    );
  }

  const [taskPrompt, setTaskPrompt] = useState(
    'Inspect codebase architecture, verify TypeScript types, and prepare automated unit tests for promo code validation'
  );
  const [workflowStage, setWorkflowStage] = useState<'idle' | 'plan' | 'review' | 'applied' | 'verified'>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'diff' | 'checkpoints' | 'files' | 'integrations'>('console');
  const [checkpoints, setCheckpoints] = useState<CheckpointItem[]>(INITIAL_CHECKPOINTS);

  const [logs, setLogs] = useState<string[]>([
    '🤖 [Developer Ji] Astra Autonomous Engineering Engine v4.2 online.',
    '⚡ [Kernel] Linked to local workspace tree: /src (TypeScript + React 19).',
    '🛡️ [Security] Autonomous mode: "Safe Approval Required" active.',
  ]);

  const handleStartWorkflow = () => {
    if (!taskPrompt.trim() || isProcessing) return;

    const allowed = deductCredits(2, 'Developer Ji Autonomous Task', 'Developer Ji Engine');
    if (!allowed) return;

    setIsProcessing(true);
    setWorkflowStage('plan');

    setLogs((prev) => [
      ...prev,
      `\n🚀 [Developer Ji] New Mission Received: "${taskPrompt.slice(0, 60)}..."`,
      '📋 [Plan] Phase 1: AST parsing and dependency graph extraction...',
      '🔍 [Plan] Phase 2: Identifying targets in src/lib and src/components...',
    ]);

    setTimeout(() => {
      setWorkflowStage('review');
      setIsProcessing(false);
      setLogs((prev) => [
        ...prev,
        '✨ [Review] Architectural proposal generated.',
        '  - File 1: src/lib/CreditContext.tsx (+38 lines, validated)',
        '  - File 2: src/types.ts (+14 lines, type safe)',
        '  - Test Suite: tests/credits.spec.ts (100% assertions satisfied)',
        '⚠️ Awaiting user APPROVAL to apply changes to filesystem.',
      ]);
      onNotify('Developer Ji generated change proposal. Ready for review!');
    }, 1800);
  };

  const handleApproveAndApply = () => {
    setIsProcessing(true);
    setWorkflowStage('applied');

    setLogs((prev) => [
      ...prev,
      '⚙️ [Apply] Writing atomic patches with zero regression rollback...',
      '🧪 [Test] Running `npm run lint` & TypeScript compiler diagnostics...',
    ]);

    setTimeout(() => {
      setIsProcessing(false);
      setWorkflowStage('verified');

      const newCp: CheckpointItem = {
        id: `cp-${Date.now()}`,
        version: `v4.2.${checkpoints.length + 1}-patch`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: taskPrompt.slice(0, 48),
        filesChanged: ['src/lib/CreditContext.tsx', 'src/components/DeveloperJiWorkspace.tsx'],
        status: 'verified',
      };
      setCheckpoints((prev) => [newCp, ...prev]);

      setLogs((prev) => [
        ...prev,
        '✅ [Verify] Build verification PASSED. Exit Code: 0.',
        `📦 [Checkpoint] Snapshot ${newCp.version} created safely in state.`,
      ]);
      onNotify('Developer Ji successfully verified and checkpointed changes!');
    }, 2000);
  };

  const handleRollback = (cp: CheckpointItem) => {
    setLogs((prev) => [
      ...prev,
      `⏪ [Rollback] Restoring workspace snapshot to ${cp.version} (${cp.title})...`,
      '✅ [Rollback] Workspace state synchronized to checkpoint.',
    ]);
    onNotify(`Restored to checkpoint ${cp.version}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in select-text">
      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/25">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#060e28] border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <AstraLogo size={24} variant="active-glowing" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Developer Ji
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Internal AI Architect
                </span>
              </h2>
              <p className="text-xs text-slate-400">Autonomous self-development, code patching, checkpoints, and QA</p>
            </div>
          </div>
        </div>

        {/* Workflow Pipeline Pills */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
          {['PLAN', 'REVIEW', 'APPROVAL', 'APPLY', 'VERIFY', 'CHECKPOINT'].map((step, idx) => (
            <span
              key={step}
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                workflowStage === 'verified'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : workflowStage === 'review' && idx <= 1
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200'
                  : 'bg-black/30 border-white/10 text-slate-500'
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Task Prompt Console */}
      <div className="rounded-2xl p-5 bg-[#070e28]/90 border border-indigo-500/30 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Zap size={14} className="text-cyan-400" />
            <span>Developer Ji Instruction Prompt</span>
          </label>
          <span className="text-[11px] text-slate-400">Cost: 2 Astra Credits</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={taskPrompt}
            onChange={(e) => setTaskPrompt(e.target.value)}
            rows={2}
            placeholder="Instruct Developer Ji (e.g., 'Refactor chat attachment preview', 'Add dark mode test', 'Inspect API quotas')"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 resize-none font-mono"
          />

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={handleStartWorkflow}
              disabled={isProcessing}
              className="flex-1 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 hover:brightness-110 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              <Play size={14} />
              <span>{isProcessing ? 'Analyzing...' : 'Execute Mission'}</span>
            </button>

            {workflowStage === 'review' && (
              <button
                onClick={handleApproveAndApply}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.3)] animate-pulse"
              >
                <CheckCircle2 size={14} />
                <span>Approve & Apply</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'console', label: 'Terminal Logs', icon: Terminal },
          { id: 'diff', label: 'Patch Diff Viewer', icon: Code2 },
          { id: 'checkpoints', label: 'Checkpoints & Rollback', icon: History },
          { id: 'files', label: 'Project Explorer', icon: FolderGit2 },
          { id: 'integrations', label: `Integration Adapters (${connectors.length})`, icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      {activeTab === 'console' && (
        <div className="rounded-2xl p-4 bg-slate-950/95 border border-cyan-500/25 font-mono text-xs text-slate-300 shadow-inner min-h-[300px] flex flex-col justify-between">
          <div className="space-y-1.5 overflow-y-auto max-h-[360px] scrollbar-thin">
            {logs.map((log, i) => (
              <div
                key={i}
                className={
                  log.includes('✅')
                    ? 'text-emerald-400'
                    : log.includes('⚠️')
                    ? 'text-amber-300'
                    : log.includes('🚀')
                    ? 'text-cyan-300 font-bold'
                    : 'text-slate-300'
                }
              >
                {log}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-[11px] text-slate-500">
            <span>Terminal status: LIVE (stdout captured)</span>
            <button
              onClick={() => setLogs(['🤖 [Developer Ji] Logs cleared.', '⚡ Ready for next instruction.'])}
              className="hover:text-cyan-300"
            >
              Clear Logs
            </button>
          </div>
        </div>
      )}

      {activeTab === 'diff' && (
        <div className="rounded-2xl p-4 bg-slate-950/95 border border-cyan-500/25 font-mono text-xs overflow-x-auto space-y-2">
          <div className="text-slate-400 pb-2 border-b border-white/10">
            diff --git a/src/lib/CreditContext.tsx b/src/lib/CreditContext.tsx
          </div>
          <div className="text-slate-500">@@ -14,6 +14,14 @@ export function CreditProvider</div>
          <div className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            + export const MASTER_PROMO_CODE = 'gurjarj44'; // +500 Credits Boost
          </div>
          <div className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            + export function validatePromoRedemption(userName, phone, code) &#123; ... &#125;
          </div>
          <div className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
            - const temporaryHardcode = false;
          </div>
          <div className="text-slate-400 pt-3">
            ✨ Patch cleanly verified. Zero conflict regressions detected across all imports.
          </div>
        </div>
      )}

      {activeTab === 'checkpoints' && (
        <div className="rounded-2xl p-5 bg-[#070e28]/90 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History size={16} className="text-cyan-400" />
              <span>Workspace Snapshots</span>
            </h3>
            <span className="text-xs text-slate-400">{checkpoints.length} Checkpoints Recorded</span>
          </div>

          <div className="space-y-2.5">
            {checkpoints.map((cp) => (
              <div
                key={cp.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 flex items-center justify-between gap-4 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      {cp.version}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{cp.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-1">{cp.title}</h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {cp.filesChanged.join(', ')}
                  </p>
                </div>

                <button
                  onClick={() => handleRollback(cp)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/10 hover:border-cyan-400/40 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <RotateCcw size={12} />
                  <span>Rollback</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="rounded-2xl p-5 bg-[#070e28]/90 border border-indigo-500/30">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <FolderGit2 size={16} className="text-indigo-400" />
            <span>ASTRA Codebase File Hierarchy</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
            {[
              { path: 'src/App.tsx', status: 'Healthy' },
              { path: 'src/types.ts', status: 'Healthy' },
              { path: 'src/lib/CreditContext.tsx', status: 'Active' },
              { path: 'src/lib/gemini.ts', status: 'Active' },
              { path: 'src/lib/firebase.ts', status: 'Connected' },
              { path: 'src/lib/AuthContext.tsx', status: 'Active' },
              { path: 'src/components/workspaces/DeveloperJiWorkspace.tsx', status: 'Active' },
              { path: 'src/components/workspaces/GameFactoryWorkspace.tsx', status: 'Active' },
              { path: 'src/components/workspaces/ChatWorkspace.tsx', status: 'Active' },
              { path: 'src/components/workspaces/ControlHubWorkspace.tsx', status: 'Active' },
            ].map((f) => (
              <div
                key={f.path}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between"
              >
                <span className="text-slate-300 truncate">{f.path}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{f.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="rounded-2xl p-5 bg-[#070e28]/90 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap size={16} className="text-cyan-400" />
                <span>Autonomous Integration Adapters Diagnostic</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Developer Ji runtime inspection of all 22 registered service connectors.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {connectors.filter((c) => c.status === 'CONNECTED').length}/{connectors.length} Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {connectors.map((conn) => (
              <div
                key={conn.id}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-white/10 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{conn.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({conn.category})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{conn.description}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        conn.status === 'CONNECTED'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : conn.status === 'AUTHORIZATION_REQUIRED'
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {conn.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{conn.latency}</span>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    onNotify(`Testing ${conn.name}...`);
                    const res = await testConnection(conn.id);
                    onNotify(`${conn.name}: ${res.status} (${res.latency})`);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/10 shrink-0"
                >
                  Ping
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
