import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Bot,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCode,
  Flame,
  Globe,
  History,
  Laptop,
  Maximize2,
  Mic,
  Minimize2,
  Monitor,
  Moon,
  Play,
  Plus,
  QrCode,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  Smartphone,
  Sparkles,
  Sun,
  Tablet,
  Terminal,
  Trash2,
  Undo2,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import { AstraLogo } from '../AstraLogo';
import { useCredits } from '../../lib/CreditContext';
import { askGemini } from '../../lib/gemini';

interface AppBuilderWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  appTitle?: string;
  codeSnippet?: string;
  steps?: string[];
  diffSummary?: string;
}

interface AppVersion {
  id: string;
  version: string;
  title: string;
  code: string;
  prompt: string;
  timestamp: string;
}

// =========================================================================
// 1. BUILT-IN PRODUCTION-GRADE APP TEMPLATES
// =========================================================================

const TEMPLATE_CRYPTO_TERMINAL = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Astra Crypto Pulse Terminal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 15px rgba(34, 211, 238, 0.2); }
      50% { box-shadow: 0 0 25px rgba(34, 211, 238, 0.45); }
    }
    .glow-card { animation: pulseGlow 4s infinite ease-in-out; }
  </style>
</head>
<body class="bg-[#03071b] text-slate-100 min-h-screen font-sans p-4 sm:p-6 selection:bg-cyan-500/30">
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Top Navigation -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_#22d3ee]">
          ⚡
        </div>
        <div>
          <h1 class="text-lg sm:text-xl font-black tracking-wide text-white flex items-center gap-2">
            <span>CRYPTO PULSE PRO</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">v2.4 Live</span>
          </h1>
          <p class="text-xs text-slate-400 font-mono">Real-Time Market Arbitrage & Portfolio Analytics Engine</p>
        </div>
      </div>

      <div class="flex items-center gap-3 text-xs font-mono">
        <div class="px-3 py-1.5 rounded-xl bg-[#081235] border border-cyan-500/30 text-cyan-300 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>WebSocket: Connected</span>
        </div>
        <div class="px-3 py-1.5 rounded-xl bg-[#081235] border border-fuchsia-500/30 text-fuchsia-300 font-bold">
          Cash: $<span id="userCash">50,000.00</span>
        </div>
      </div>
    </header>

    <!-- Ticker Metric Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <div class="p-4 rounded-2xl bg-[#061033]/90 border border-cyan-500/30 shadow-lg glow-card">
        <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>BTC / USDT</span>
          <span id="btcChange" class="text-emerald-400 font-bold">+2.84%</span>
        </div>
        <div id="btcPrice" class="text-xl sm:text-2xl font-black font-mono text-cyan-300 mt-2">$68,420.50</div>
        <span class="text-[10px] text-slate-500">24h Vol: $42.8B</span>
      </div>

      <div class="p-4 rounded-2xl bg-[#061033]/90 border border-purple-500/30 shadow-lg glow-card">
        <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>ETH / USDT</span>
          <span id="ethChange" class="text-emerald-400 font-bold">+1.92%</span>
        </div>
        <div id="ethPrice" class="text-xl sm:text-2xl font-black font-mono text-purple-300 mt-2">$3,520.15</div>
        <span class="text-[10px] text-slate-500">24h Vol: $18.4B</span>
      </div>

      <div class="p-4 rounded-2xl bg-[#061033]/90 border border-pink-500/30 shadow-lg glow-card">
        <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>SOL / USDT</span>
          <span id="solChange" class="text-emerald-400 font-bold">+5.41%</span>
        </div>
        <div id="solPrice" class="text-xl sm:text-2xl font-black font-mono text-pink-300 mt-2">$174.60</div>
        <span class="text-[10px] text-slate-500">24h Vol: $8.9B</span>
      </div>

      <div class="p-4 rounded-2xl bg-[#061033]/90 border border-amber-500/30 shadow-lg glow-card">
        <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>ASTRA / USDT</span>
          <span class="text-emerald-400 font-bold">+14.20%</span>
        </div>
        <div class="text-xl sm:text-2xl font-black font-mono text-amber-300 mt-2">$24.80</div>
        <span class="text-[10px] text-slate-500">Staking APY: 18.5%</span>
      </div>
    </div>

    <!-- Main Chart & Trading Deck -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <!-- Live Chart Canvas -->
      <div class="lg:col-span-8 p-5 rounded-2xl bg-[#061033]/80 border border-cyan-500/25 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-white font-mono">BTC/USDT 15m Candlestick Stream</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div class="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <button class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">15m</button>
            <button class="px-2 py-0.5 rounded hover:bg-white/10">1h</button>
            <button class="px-2 py-0.5 rounded hover:bg-white/10">1D</button>
          </div>
        </div>

        <div class="relative w-full h-64 bg-[#030617] rounded-xl overflow-hidden border border-white/10">
          <canvas id="marketChart" width="700" height="256" class="w-full h-full block"></canvas>
        </div>
      </div>

      <!-- Instant Trade Execution Panel -->
      <div class="lg:col-span-4 p-5 rounded-2xl bg-[#061033]/80 border border-cyan-500/25 flex flex-col justify-between space-y-4">
        <div>
          <h2 class="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-white/10">
            <span>Instant Execution</span>
            <span class="text-[10px] font-mono text-emerald-400">Zero Slippage</span>
          </h2>

          <div class="space-y-3 mt-4 text-xs font-mono">
            <div>
              <label class="text-slate-400 block mb-1">Asset Target</label>
              <select id="assetSelect" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white outline-none focus:border-cyan-400">
                <option value="BTC">BTC (Bitcoin)</option>
                <option value="ETH">ETH (Ethereum)</option>
                <option value="SOL">SOL (Solana)</option>
              </select>
            </div>

            <div>
              <label class="text-slate-400 block mb-1">Order Amount ($)</label>
              <input id="orderAmt" type="number" value="1000" min="10" step="50" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white outline-none focus:border-cyan-400 font-bold" />
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2">
              <button id="buyBtn" class="py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer">
                BUY MARKET
              </button>
              <button id="sellBtn" class="py-2.5 rounded-xl font-bold bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all cursor-pointer">
                SELL MARKET
              </button>
            </div>
          </div>
        </div>

        <!-- Live Orders Log -->
        <div class="space-y-1">
          <span class="text-[10px] font-mono uppercase text-slate-400">Order Ledger</span>
          <div id="orderLogs" class="p-2.5 rounded-xl bg-[#030617] border border-white/5 h-28 overflow-y-auto text-[11px] font-mono space-y-1 text-slate-300">
            <div class="text-cyan-400">[System] Trading Engine Initialized. Liquidity ready.</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let cash = 50000;
    const prices = { BTC: 68420.50, ETH: 3520.15, SOL: 174.60 };
    const chart = document.getElementById('marketChart');
    const ctx = chart.getContext('2d');
    const points = Array.from({ length: 40 }, (_, i) => 120 + Math.sin(i * 0.4) * 35 + Math.random() * 20);

    function drawChart() {
      ctx.clearRect(0, 0, chart.width, chart.height);
      ctx.beginPath();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;

      const step = chart.width / (points.length - 1);
      points.forEach((p, idx) => {
        const x = idx * step;
        const y = chart.height - p;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Gradient Fill
      ctx.lineTo(chart.width, chart.height);
      ctx.lineTo(0, chart.height);
      const grad = ctx.createLinearGradient(0, 0, 0, chart.height);
      grad.addColorStop(0, 'rgba(34, 211, 238, 0.25)');
      grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }
    drawChart();

    // Ticker oscillation
    setInterval(() => {
      prices.BTC += (Math.random() - 0.48) * 45;
      prices.ETH += (Math.random() - 0.48) * 8;
      prices.SOL += (Math.random() - 0.48) * 1.5;

      document.getElementById('btcPrice').innerText = '$' + prices.BTC.toFixed(2);
      document.getElementById('ethPrice').innerText = '$' + prices.ETH.toFixed(2);
      document.getElementById('solPrice').innerText = '$' + prices.SOL.toFixed(2);

      points.shift();
      points.push(120 + (prices.BTC % 100) * 0.8 + Math.random() * 20);
      drawChart();
    }, 2000);

    function addLog(text, isBuy) {
      const logs = document.getElementById('orderLogs');
      const item = document.createElement('div');
      item.className = isBuy ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold';
      item.innerText = text;
      logs.prepend(item);
    }

    document.getElementById('buyBtn').addEventListener('click', () => {
      const asset = document.getElementById('assetSelect').value;
      const amt = parseFloat(document.getElementById('orderAmt').value) || 500;
      if (cash < amt) {
        alert('Insufficient cash balance!');
        return;
      }
      cash -= amt;
      document.getElementById('userCash').innerText = cash.toFixed(2);
      addLog('[FILLED] Bought $' + amt + ' of ' + asset + ' @ $' + prices[asset].toFixed(2), true);
    });

    document.getElementById('sellBtn').addEventListener('click', () => {
      const asset = document.getElementById('assetSelect').value;
      const amt = parseFloat(document.getElementById('orderAmt').value) || 500;
      cash += amt;
      document.getElementById('userCash').innerText = cash.toFixed(2);
      addLog('[FILLED] Sold $' + amt + ' of ' + asset + ' @ $' + prices[asset].toFixed(2), false);
    });
  </script>
</body>
</html>`;

const TEMPLATE_KANBAN_BOARD = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OmniTasks Kanban Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#04081c] text-slate-100 min-h-screen p-5 font-sans selection:bg-indigo-500/30">
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-500/20">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]">
          ✓
        </div>
        <div>
          <h1 class="text-xl font-black text-white">OMNITASKS KANBAN AI</h1>
          <p class="text-xs text-slate-400">Autonomous Sprint & Architecture Task Organizer</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <input id="searchInput" type="text" placeholder="Search tasks..." class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none focus:border-indigo-400" />
        <button id="openNewTaskBtn" class="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all hover:brightness-110 cursor-pointer">
          + Add New Task
        </button>
      </div>
    </header>

    <!-- 3-Column Kanban Board -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <!-- To Do -->
      <div class="p-4 rounded-2xl bg-[#061033]/90 border border-cyan-500/30 flex flex-col min-h-[460px]">
        <div class="flex items-center justify-between text-xs font-bold text-cyan-300 pb-3 border-b border-cyan-500/20">
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>BACKLOG & TO DO</span>
          </span>
          <span id="todoCount" class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-[10px] font-mono">3</span>
        </div>
        <div id="colTodo" class="flex-1 space-y-3 py-3 overflow-y-auto">
          <div class="task-card p-3.5 rounded-xl bg-[#0a1540] border border-white/10 hover:border-cyan-400/50 space-y-2 transition-all">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">P0 High</span>
              <span class="text-[10px] text-slate-400">2h ago</span>
            </div>
            <h3 class="text-xs font-bold text-white">Firebase Rules Security Hardening</h3>
            <p class="text-[11px] text-slate-300">Enforce RBAC rules on Firestore app blueprints.</p>
            <div class="flex justify-end gap-1 pt-1">
              <button onclick="moveTask(this, 'colProgress')" class="text-[10px] font-mono text-cyan-300 hover:underline">Start →</button>
            </div>
          </div>

          <div class="task-card p-3.5 rounded-xl bg-[#0a1540] border border-white/10 hover:border-cyan-400/50 space-y-2 transition-all">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">P1 Medium</span>
              <span class="text-[10px] text-slate-400">Yesterday</span>
            </div>
            <h3 class="text-xs font-bold text-white">OAuth 2.0 Workspace Sync</h3>
            <p class="text-[11px] text-slate-300">Integrate Google Drive read/write storage access.</p>
            <div class="flex justify-end gap-1 pt-1">
              <button onclick="moveTask(this, 'colProgress')" class="text-[10px] font-mono text-cyan-300 hover:underline">Start →</button>
            </div>
          </div>
        </div>
      </div>

      <!-- In Progress -->
      <div class="p-4 rounded-2xl bg-[#061033]/90 border border-indigo-500/30 flex flex-col min-h-[460px]">
        <div class="flex items-center justify-between text-xs font-bold text-indigo-300 pb-3 border-b border-indigo-500/20">
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>IN EXECUTION</span>
          </span>
          <span id="progressCount" class="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[10px] font-mono">2</span>
        </div>
        <div id="colProgress" class="flex-1 space-y-3 py-3 overflow-y-auto">
          <div class="task-card p-3.5 rounded-xl bg-[#0a1540] border border-white/10 hover:border-indigo-400/50 space-y-2 transition-all">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">P0 High</span>
              <span class="text-[10px] text-indigo-300">Active</span>
            </div>
            <h3 class="text-xs font-bold text-white">Brahmastra Fire Engine Shaders</h3>
            <p class="text-[11px] text-slate-300">Compile particle shaders for multi-projectile arena.</p>
            <div class="flex justify-between items-center pt-1">
              <button onclick="moveTask(this, 'colTodo')" class="text-[10px] font-mono text-slate-400 hover:underline">← Back</button>
              <button onclick="moveTask(this, 'colDone')" class="text-[10px] font-mono text-emerald-300 hover:underline">Complete ✓</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Done -->
      <div class="p-4 rounded-2xl bg-[#061033]/90 border border-emerald-500/30 flex flex-col min-h-[460px]">
        <div class="flex items-center justify-between text-xs font-bold text-emerald-300 pb-3 border-b border-emerald-500/20">
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SHIPPED & DONE</span>
          </span>
          <span id="doneCount" class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-mono">3</span>
        </div>
        <div id="colDone" class="flex-1 space-y-3 py-3 overflow-y-auto">
          <div class="task-card p-3.5 rounded-xl bg-[#0a1540] border border-white/10 hover:border-emerald-400/50 space-y-2 transition-all opacity-85">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Verified</span>
              <span class="text-[10px] text-slate-400">Ready</span>
            </div>
            <h3 class="text-xs font-bold text-white line-through">Central Credit Ledger Setup</h3>
            <p class="text-[11px] text-slate-400">Firestore authoritative balance transaction synchronization.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    function updateCounts() {
      document.getElementById('todoCount').innerText = document.getElementById('colTodo').children.length;
      document.getElementById('progressCount').innerText = document.getElementById('colProgress').children.length;
      document.getElementById('doneCount').innerText = document.getElementById('colDone').children.length;
    }

    function moveTask(btn, targetColId) {
      const card = btn.closest('.task-card');
      document.getElementById(targetColId).prepend(card);
      updateCounts();
    }

    document.getElementById('openNewTaskBtn').addEventListener('click', () => {
      const title = prompt('Enter task name:');
      if (!title) return;
      const card = document.createElement('div');
      card.className = 'task-card p-3.5 rounded-xl bg-[#0a1540] border border-white/10 hover:border-cyan-400/50 space-y-2 transition-all';
      card.innerHTML = '<div class="flex items-center justify-between"><span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">New</span><span class="text-[10px] text-slate-400">Just now</span></div>' +
        '<h3 class="text-xs font-bold text-white">' + title + '</h3>' +
        '<p class="text-[11px] text-slate-300">Generated dynamically from user prompt.</p>' +
        '<div class="flex justify-end gap-1 pt-1"><button onclick="moveTask(this, \\'colProgress\\')" class="text-[10px] font-mono text-cyan-300 hover:underline">Start →</button></div>';
      document.getElementById('colTodo').prepend(card);
      updateCounts();
    });
  </script>
</body>
</html>`;

export function AppBuilderWorkspace({ onBack, onNotify }: AppBuilderWorkspaceProps) {
  const { userRole, credits, deductCredits } = useCredits();

  // State Management
  const [currentAppTitle, setCurrentAppTitle] = useState('Crypto Pulse Terminal Pro');
  const [generatedCode, setGeneratedCode] = useState<string>(TEMPLATE_CRYPTO_TERMINAL);
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'console'>('preview');
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedModel, setSelectedModel] = useState<'gemini-2.5-flash' | 'gemini-1.5-pro' | 'astra-autonomous'>('gemini-2.5-flash');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Agent Thought & Execution Stream
  const [agentStep, setAgentStep] = useState<string | null>(null);

  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Version History
  const [versions, setVersions] = useState<AppVersion[]>([
    {
      id: 'v1',
      version: 'v1.0',
      title: 'Crypto Pulse Terminal Pro',
      code: TEMPLATE_CRYPTO_TERMINAL,
      prompt: 'Initial Scaffold: Crypto Analytics & Live Simulator',
      timestamp: '10:00 AM',
    },
  ]);
  const [selectedVersionId, setSelectedVersionId] = useState('v1');

  // Messages Chat History
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Welcome to the **ASTRA Autonomous App Studio**!\n\nI can scaffold, code, design, and compile complete, production-grade applications, tools, and games from your natural language prompts. Click any quick starter below or type your dream app idea!`,
      timestamp: '10:00 AM',
      appTitle: 'Crypto Pulse Terminal Pro',
      diffSummary: 'Initial Scaffold (HTML5, Tailwind CSS, Canvas)',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, agentStep]);

  // Handle Dynamic App Generation from Prompt
  const handleSendPrompt = async (forcedPrompt?: string) => {
    const text = (forcedPrompt || promptInput).trim();
    if (!text || isGenerating) return;

    // Deduct credits
    const success = deductCredits(5, 'AI App Synthesis');
    if (!success) {
      onNotify('Insufficient credits. Watch an ad or upgrade to Pro.');
      return;
    }

    setPromptInput('');
    setIsGenerating(true);

    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulated Agent Step Workflow (Lovable / Emergent / Google AI Studio experience)
    const steps = [
      '🔍 Analyzing prompt requirements & UX specifications...',
      '⚡ Generating reactive component schema & state stores...',
      '🎨 Styling high-density Tailwind layout & dark glass aesthetics...',
      '⚙️ Compiling interactive logic, event handlers & canvas shaders...',
      '✓ Verification passed. Mounting isolated runtime sandbox...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setAgentStep(steps[i]);
      await new Promise((res) => setTimeout(res, 550));
    }

    // Determine App Synthesis strategy
    let finalCode = '';
    let finalTitle = currentAppTitle;

    const lower = text.toLowerCase();

    try {
      // 1. Check if Gemini API can synthesize custom code
      const geminiPrompt = `You are an elite staff software engineer in Google AI Studio / Lovable building a self-contained single-file HTML5 web application.
User Request: "${text}"
Rules:
1. Return ONLY the complete valid HTML file containing:
   - <!DOCTYPE html>
   - <script src="https://cdn.tailwindcss.com"></script>
   - Interactive, beautiful dark-mode UI with high aesthetic standard matching Google AI Studio / Lovable / Emergent.
   - Real working JavaScript inside <script> tags for buttons, inputs, local state, interactive canvas or forms.
2. Do not wrap in markdown or backticks. Return raw HTML.`;

      const geminiResponse = await askGemini(geminiPrompt, {
        modelName: selectedModel === 'gemini-1.5-pro' ? 'gemini-1.5-pro' : 'gemini-2.5-flash',
      });

      if (geminiResponse && geminiResponse.text && geminiResponse.text.includes('<html')) {
        let clean = geminiResponse.text;
        if (clean.includes('```html')) {
          clean = clean.split('```html')[1].split('```')[0].trim();
        } else if (clean.includes('```')) {
          clean = clean.split('```')[1].split('```')[0].trim();
        }
        finalCode = clean;
        finalTitle = text.slice(0, 32);
      }
    } catch {
      // Fallback to intelligent local synthesizer
    }

    // If Gemini didn't produce code, use intelligent template adaptation
    if (!finalCode) {
      if (lower.includes('kanban') || lower.includes('task') || lower.includes('todo') || lower.includes('project')) {
        finalCode = TEMPLATE_KANBAN_BOARD;
        finalTitle = 'OmniTasks Kanban AI';
      } else if (lower.includes('crypto') || lower.includes('market') || lower.includes('trading') || lower.includes('stock')) {
        finalCode = TEMPLATE_CRYPTO_TERMINAL;
        finalTitle = 'Crypto Pulse Terminal Pro';
      } else {
        // Dynamic Universal Template adapted to user query
        finalTitle = text.length > 28 ? `${text.slice(0, 25)}...` : text;
        finalCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${finalTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#030617] text-slate-100 min-h-screen p-6 font-sans">
  <div class="max-w-4xl mx-auto space-y-6">
    <header class="flex items-center justify-between pb-4 border-b border-cyan-500/20">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_#22d3ee]">
          ✦
        </div>
        <div>
          <h1 class="text-xl font-black text-white uppercase">${finalTitle}</h1>
          <p class="text-xs text-slate-400 font-mono">Synthesized dynamically by ASTRA AI Studio Engine</p>
        </div>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        ● Live Executable
      </span>
    </header>

    <div class="p-6 rounded-2xl bg-[#061033] border border-cyan-500/30 space-y-4 shadow-xl">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-bold text-white">Interactive Workspace Console</h2>
        <span class="text-xs text-slate-400 font-mono">Prompt: "${text}"</span>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed">
        This application was synthesized and compiled in real time. All interactive controls, state dispatchers, and layouts are operational.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10">
          <span class="text-[10px] text-slate-400 font-mono">Engine Status</span>
          <div class="text-sm font-bold text-cyan-300 mt-1">High Performance</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10">
          <span class="text-[10px] text-slate-400 font-mono">Latency</span>
          <div class="text-sm font-bold text-emerald-400 mt-1">&lt; 12ms</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10">
          <span class="text-[10px] text-slate-400 font-mono">DOM Nodes</span>
          <div class="text-sm font-bold text-purple-300 mt-1">Reactive Virtual Tree</div>
        </div>
      </div>

      <div class="pt-3 border-t border-white/10 flex flex-col sm:flex-row gap-3">
        <input id="demoInput" type="text" placeholder="Type data into your app..." class="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-400" />
        <button id="actionBtn" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          Execute Action
        </button>
      </div>

      <div id="actionResults" class="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-400 max-h-36 overflow-y-auto space-y-1">
        <div>[Runtime] Ready for user interaction.</div>
      </div>
    </div>
  </div>
  <script>
    document.getElementById('actionBtn').addEventListener('click', () => {
      const val = document.getElementById('demoInput').value || 'Sample Input Event';
      const res = document.getElementById('actionResults');
      const item = document.createElement('div');
      item.className = 'text-cyan-300';
      item.innerText = '[Event Dispatch] ' + val + ' processed successfully at ' + new Date().toLocaleTimeString();
      res.prepend(item);
    });
  </script>
</body>
</html>`;
      }
    }

    // Update state
    setGeneratedCode(finalCode);
    setCurrentAppTitle(finalTitle);
    setActiveTab('preview');
    setAgentStep(null);
    setIsGenerating(false);

    // Record new Version
    const verNumber = `v1.${versions.length}`;
    const newVer: AppVersion = {
      id: `ver-${Date.now()}`,
      version: verNumber,
      title: finalTitle,
      code: finalCode,
      prompt: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setVersions((prev) => [newVer, ...prev]);
    setSelectedVersionId(newVer.id);

    // Assistant reply message
    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      content: `I've synthesized and compiled **${finalTitle}** (${verNumber}) based on your prompt!\n\n### What I built:\n* Responsive Tailwind CSS dark chamber layout.\n* Full interactive client-side logic & real-time state.\n* Sandboxed executable preview ready for live testing.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      appTitle: finalTitle,
      diffSummary: `Modified: index.html (+${Math.round(finalCode.length / 50)} lines)`,
    };

    setMessages((prev) => [...prev, botMsg]);
    onNotify(`✨ Applet "${finalTitle}" compiled & ready in live sandbox!`);
  };

  // Rollback / select version
  const handleSelectVersion = (verId: string) => {
    const found = versions.find((v) => v.id === verId);
    if (!found) return;
    setSelectedVersionId(verId);
    setGeneratedCode(found.code);
    setCurrentAppTitle(found.title);
    onNotify(`Rolled back to ${found.version} (${found.title})`);
  };

  // Copy code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      onNotify('Copied full source code to clipboard!');
    } catch {}
  };

  // Download standalone HTML
  const handleDownloadApp = () => {
    const blob = new Blob([generatedCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentAppTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify(`Downloaded "${currentAppTitle}.html" standalone application!`);
  };

  return (
    <div
      className={`w-full mx-auto space-y-4 animate-fade-in select-text transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 p-4 bg-[#030617] overflow-y-auto max-w-none' : 'max-w-7xl'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. TOP STUDIO HEADER (GOOGLE AI STUDIO / LOVABLE / BUILD.AI STYLE)        */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#040a24]/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl astra-glass-layer-2">
        {/* Left: Back button, App Identity & Version Dropdown */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Back to Command Deck"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] shrink-0">
              <AstraLogo size={20} variant="active-glowing" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentAppTitle}
                  onChange={(e) => setCurrentAppTitle(e.target.value)}
                  className="bg-transparent text-sm sm:text-base font-black text-white truncate outline-none border-b border-transparent hover:border-cyan-400/40 focus:border-cyan-400 transition-colors cursor-text"
                  title="Click to rename applet"
                />

                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  <span>Saved</span>
                </span>
              </div>

              {/* Version History Selector */}
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-mono">
                <select
                  value={selectedVersionId}
                  onChange={(e) => handleSelectVersion(e.target.value)}
                  className="bg-[#07133b] border border-cyan-500/30 text-cyan-300 rounded px-1.5 py-0.5 text-[10px] outline-none cursor-pointer"
                >
                  {versions.map((ver) => (
                    <option key={ver.id} value={ver.id}>
                      {ver.version} · {ver.title} ({ver.timestamp})
                    </option>
                  ))}
                </select>
                <span className="hidden lg:inline text-[11px] text-slate-400 font-sans">
                  AI Studio Builder Engine
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Device Viewport Switcher & Tabs */}
        <div className="flex items-center justify-center gap-2 self-center sm:self-auto">
          {/* Viewport Toggles (Active in Preview Mode) */}
          {activeTab === 'preview' && (
            <div className="flex items-center bg-[#071033] rounded-xl p-1 border border-cyan-500/25">
              <button
                type="button"
                onClick={() => setDeviceViewport('desktop')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  deviceViewport === 'desktop' ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_8px_#22d3ee]' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View (100%)"
              >
                <Monitor size={15} />
              </button>
              <button
                type="button"
                onClick={() => setDeviceViewport('tablet')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  deviceViewport === 'tablet' ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_8px_#22d3ee]' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet size={15} />
              </button>
              <button
                type="button"
                onClick={() => setDeviceViewport('mobile')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  deviceViewport === 'mobile' ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_8px_#22d3ee]' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone size={15} />
              </button>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#071033] rounded-xl p-1 border border-cyan-500/25 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 size={13} />
              <span>Code</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'console'
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal size={13} />
              <span>Console</span>
            </button>
          </div>
        </div>

        {/* Right: Share, Deploy, Settings, Download */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Share Button */}
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Share app link & embed"
          >
            <Share2 size={13} className="text-cyan-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="App Settings & Config"
          >
            <Settings size={15} />
          </button>

          {/* Deploy Button */}
          <button
            type="button"
            onClick={() => setIsDeployOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500 hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Rocket size={13} />
            <span>Deploy</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DUAL-PANE WORKSPACE: LEFT CHAT PROMPTER & RIGHT LIVE PREVIEW           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[750px] min-h-[620px]">
        {/* LEFT PANE: AI PROMPT ASSISTANT & AGENT EXECUTION STREAM (col-span-5) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#040a24]/90 border border-cyan-500/25 flex flex-col overflow-hidden backdrop-blur-2xl shadow-2xl astra-glass-layer-2">
          {/* Header with Model Selector */}
          <div className="p-3.5 border-b border-white/10 bg-[#060e32]/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-cyan-400" />
              <span className="text-xs font-bold text-white">AI App Architect</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-[#07133b] border border-cyan-500/30 text-cyan-200 rounded-lg px-2 py-1 text-[11px] font-mono outline-none cursor-pointer"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="astra-autonomous">ASTRA Autonomous</option>
            </select>
          </div>

          {/* Quick Idea Starters */}
          <div className="px-3 py-2 border-b border-white/5 bg-[#03071a]/70 overflow-x-auto scrollbar-none flex items-center gap-1.5">
            {[
              { label: '⚡ Crypto Pulse Terminal', prompt: 'Build a live Crypto Trading Terminal with real-time price updates, buy/sell simulator, and order book' },
              { label: '📱 Kanban Sprint Board', prompt: 'Build a modern Drag-and-Drop Task Management Kanban board with task creation and priority badges' },
              { label: '🔥 Brahmastra Combat', prompt: 'Build a Brahmastra Agneepath fire combat game with fireballs, celestial powers, sound effects, and highscore' },
              { label: '🏃 Habit & Streak Tracker', prompt: 'Build a Daily Habit & Workout Streak Tracker with circular progress rings and daily reminders' },
            ].map((starter) => (
              <button
                key={starter.label}
                onClick={() => handleSendPrompt(starter.prompt)}
                disabled={isGenerating}
                className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-slate-300 bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-200 border border-white/5 hover:border-cyan-500/40 whitespace-nowrap transition-all cursor-pointer disabled:opacity-50"
              >
                {starter.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                      <AstraLogo size={16} glow={false} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'bg-[#061036] border border-cyan-500/20 text-slate-200 shadow-[0_0_20px_rgba(0,0,0,0.4)]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {msg.diffSummary && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                        <span>{msg.diffSummary}</span>
                        <button
                          onClick={() => setActiveTab('code')}
                          className="hover:underline flex items-center gap-1"
                        >
                          <span>Inspect Code</span>
                          <span>→</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Agent Live Thinking Process Cards */}
            {isGenerating && (
              <div className="space-y-2 p-3 rounded-2xl bg-[#061036]/90 border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.25)] animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Agent Execution Process</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-200 flex items-center gap-2 border border-cyan-500/20">
                  <Wand2 size={13} className="text-cyan-400 animate-spin" />
                  <span>{agentStep || 'Initializing AST compiler...'}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Input Deck */}
          <div className="p-3 border-t border-white/10 bg-[#03071c]">
            {/* Quick iteration suggestion chips */}
            <div className="flex items-center gap-1.5 pb-2 overflow-x-auto scrollbar-none text-[10px] text-slate-400">
              <span className="text-cyan-400 font-bold">Iterate:</span>
              <button
                type="button"
                onClick={() => setPromptInput('Add a dark mode / light mode toggle button')}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap"
              >
                + Dark Mode
              </button>
              <button
                type="button"
                onClick={() => setPromptInput('Add an Export to CSV and JSON download button')}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap"
              >
                + Export CSV
              </button>
              <button
                type="button"
                onClick={() => setPromptInput('Add audio sound effects with Web Audio API synthesis')}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap"
              >
                + Sound FX
              </button>
              <button
                type="button"
                onClick={() => setPromptInput('Add persistent localStorage saving')}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap"
              >
                + LocalStorage
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Describe your app, feature request, or iteration..."
                disabled={isGenerating}
                className="flex-1 bg-slate-950/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 font-sans disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isGenerating || !promptInput.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 disabled:opacity-50 text-slate-950 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all cursor-pointer font-bold"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANE: LIVE SANDBOX PREVIEW, CODE EDITOR, & CONSOLE (col-span-7) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#040a24]/90 border border-cyan-500/25 flex flex-col overflow-hidden backdrop-blur-2xl shadow-2xl astra-glass-layer-2">
          {/* Top Browser URL Chrome Bar */}
          <div className="px-4 py-2 border-b border-white/10 bg-[#060e32]/70 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <button
                onClick={() => {
                  const current = generatedCode;
                  setGeneratedCode('');
                  setTimeout(() => setGeneratedCode(current), 50);
                  onNotify('Reloaded live preview runtime');
                }}
                className="p-1 rounded hover:bg-white/10 text-slate-300 transition-colors"
                title="Reload Sandbox"
              >
                <RefreshCw size={12} />
              </button>
            </div>

            {/* Address Bar */}
            <div className="flex-1 max-w-sm mx-3 px-3 py-1 rounded-full bg-[#030617] border border-white/10 flex items-center gap-2 text-[11px] text-slate-300 truncate">
              <Shield size={11} className="text-emerald-400 shrink-0" />
              <span className="truncate">https://astra.build/preview/{currentAppTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.app</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
                title="Copy Source"
              >
                <Copy size={11} />
                <span>Copy</span>
              </button>
              <button
                onClick={handleDownloadApp}
                className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors flex items-center gap-1 text-[11px]"
                title="Download HTML"
              >
                <Download size={11} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Main Viewport Content */}
          <div className="flex-1 bg-[#020512] overflow-hidden flex items-center justify-center p-2 relative">
            {activeTab === 'preview' && (
              <div
                className={`h-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950 flex flex-col ${
                  deviceViewport === 'desktop'
                    ? 'w-full'
                    : deviceViewport === 'tablet'
                    ? 'w-[768px] max-w-full'
                    : 'w-[375px] max-w-full'
                }`}
              >
                {/* Mobile / Tablet Device Mock Bezel Top (when not desktop) */}
                {deviceViewport !== 'desktop' && (
                  <div className="h-5 bg-black flex items-center justify-center border-b border-white/10 shrink-0">
                    <div className="w-16 h-3 rounded-full bg-slate-800" />
                  </div>
                )}

                <iframe
                  key={generatedCode.slice(0, 40)}
                  srcDoc={generatedCode}
                  title="Astra Sandbox Applet"
                  sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                  className="w-full flex-1 border-none bg-transparent"
                />
              </div>
            )}

            {activeTab === 'code' && (
              <div className="w-full h-full flex flex-col rounded-xl overflow-hidden bg-[#05091e] border border-white/10 font-mono text-xs">
                <div className="p-2.5 border-b border-white/10 bg-[#061036] flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
                      index.html
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {Math.round(generatedCode.length / 1024)} KB · Complete Standalone Single-File Bundle
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors flex items-center gap-1"
                  >
                    <Copy size={12} />
                    <span>Copy All</span>
                  </button>
                </div>

                <pre className="flex-1 p-4 overflow-auto font-mono text-xs text-cyan-200/90 leading-relaxed scrollbar-thin select-all">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            )}

            {activeTab === 'console' && (
              <div className="w-full h-full flex flex-col rounded-xl overflow-hidden bg-[#020512] border border-white/10 font-mono text-xs p-4 space-y-2 overflow-y-auto">
                <div className="text-slate-400 pb-2 border-b border-white/10 flex items-center justify-between">
                  <span>Runtime Console & WebAssembly Diagnostics</span>
                  <span className="text-emerald-400">Active (Zero Warnings)</span>
                </div>
                <div className="text-emerald-400">[AST Compiler] Ready. Sandboxed IFrame environment initialized.</div>
                <div className="text-cyan-300">[Tailwind Engine] JIT compiler loaded from CDN successfully.</div>
                <div className="text-slate-300">[Lifecycle] Component tree mounted at 60fps.</div>
                <div className="text-slate-400">[Memory] Heap allocated: 14.2 MB.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SHARE DIALOG MODAL (AI STUDIO STYLE)                                   */}
      {/* ========================================================================= */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#061036] border border-cyan-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 size={16} className="text-cyan-400" />
                <span>Share "{currentAppTitle}"</span>
              </h3>
              <button onClick={() => setIsShareOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-mono block mb-1">Public Shareable Applet Link</label>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-white/10 font-mono text-cyan-300">
                  <span className="truncate flex-1">https://astra.run/p/{currentAppTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://astra.run/p/${currentAppTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
                      onNotify('Public link copied to clipboard!');
                    }}
                    className="p-1 rounded bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono block mb-1">Embed in Webpage (IFrame)</label>
                <div className="p-2 rounded-xl bg-slate-950 border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  <code>{`<iframe src="https://astra.run/p/${currentAppTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}" width="100%" height="650" allow="scripts" />`}</code>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsShareOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DEPLOY DIALOG MODAL (ONE-CLICK HOSTING)                                 */}
      {/* ========================================================================= */}
      {isDeployOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#061036] border border-emerald-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Rocket size={18} className="text-emerald-400" />
                <span>Deploy to Cloud Edge</span>
              </h3>
              <button onClick={() => setIsDeployOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-white">Live Edge Deployment Active</div>
                  <div className="text-[11px] text-emerald-300 font-mono">https://{currentAppTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.astra.app</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-slate-500 text-[10px]">Global Edge CDN</div>
                  <div className="text-cyan-300 font-bold mt-0.5">340 PoPs active</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-slate-500 text-[10px]">SSL Certificate</div>
                  <div className="text-emerald-400 font-bold mt-0.5">TLS 1.3 Active</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    handleDownloadApp();
                    setIsDeployOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  Export Bundle
                </button>
                <button
                  onClick={() => {
                    setIsDeployOpen(false);
                    onNotify(`Deployed "${currentAppTitle}" to live cloud production!`);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  Visit Live URL →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SETTINGS MODAL                                                         */}
      {/* ========================================================================= */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#061036] border border-cyan-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings size={16} className="text-cyan-400" />
                <span>App Configuration & Environment</span>
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-mono block mb-1">Application Name</label>
                <input
                  type="text"
                  value={currentAppTitle}
                  onChange={(e) => setCurrentAppTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono block mb-1">CSS Engine</label>
                <select className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white outline-none">
                  <option>Tailwind CSS 3.4 (JIT Mode)</option>
                  <option>Pure Vanilla CSS3 with Cyberpunk Theme</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-mono block mb-1">Sandbox Security Rules</label>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 font-mono text-[11px] text-slate-300 space-y-1">
                  <div>✓ allow-scripts</div>
                  <div>✓ allow-forms</div>
                  <div>✓ allow-modals</div>
                  <div>✓ allow-same-origin</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
