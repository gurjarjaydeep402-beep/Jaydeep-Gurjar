import { useState } from 'react';
import {
  ArrowLeft,
  Bot,
  Briefcase,
  Check,
  Code2,
  Copy,
  Download,
  FileText,
  Globe,
  GraduationCap,
  Layers,
  Megaphone,
  Play,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Video,
  Wand2,
  Zap,
} from 'lucide-react';
import type { WorkspaceId } from '../../types';

interface GeneralWorkspaceProps {
  workspaceId: WorkspaceId;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

interface WorkspaceConfig {
  title: string;
  subtitle: string;
  icon: any;
  accent: string;
  modules: string[];
  actionLabel: string;
  defaultPrompt: string;
  sampleResults: string[];
}

const CONFIG: Record<string, WorkspaceConfig> = {
  'video-generator': {
    title: 'ASTRA Video Generator',
    subtitle: 'Generate cinematic AI video scenes, storyboards and motion prompts',
    icon: Video,
    accent: 'rose',
    modules: ['Scene Generator', 'Camera Motion Studio', 'Runway Gen-3 Engine', 'Audio Sync'],
    actionLabel: 'Render Video Scene',
    defaultPrompt: 'Cinematic drone shot flying through a glowing futuristic neon nebula city at night, 4K 60fps photorealistic',
    sampleResults: [
      'Rendered Scene #1: "Cybernetic Horizon at Dusk" [1080p 60fps, 8.4s, Camera: Orbit Inward, Seeds: #89213]',
      'Rendered Scene #2: "Deep Space Quantum Jump" [4K 30fps, 5.0s, Camera: FPV Flythrough, Motion Blur: 0.85]',
      'Rendered Scene #3: "Holographic Monolith Awakening" [1080p 60fps, 10.2s, Volumetric Lighting: Active]',
    ],
  },
  'website-factory': {
    title: 'ASTRA Website Builder',
    subtitle: 'Generate modern responsive websites, landing pages and SaaS templates',
    icon: Globe,
    accent: 'cyan',
    modules: ['Hero Section Generator', 'Tailwind Styler', 'SEO Metadata Injector', '1-Click Deploy'],
    actionLabel: 'Build Responsive Website',
    defaultPrompt: 'Modern high-conversion dark mode SaaS landing page for an AI developer platform with pricing table and testimonial carousel',
    sampleResults: [
      'Generated: "NextGen AI Platform Landing Page" (HTML5 + Tailwind CSS + Responsive Grid, Clean SEO markup)',
      'Generated: "Crypto Web3 Portfolio Page" (Glassmorphism, Live ticker component, Web3 wallet connect)',
      'Generated: "E-Commerce Digital Storefront" (Stripe checkout ready, Product grid, Cart drawer modal)',
    ],
  },
  agents: {
    title: 'Autonomous Multi-Agent Network',
    subtitle: 'Coordinate specialized AI agents executing complex parallel pipelines',
    icon: Bot,
    accent: 'blue',
    modules: ['Research Agent', 'Code Review Agent', 'Security Auditor', 'Data Pipeline Agent'],
    actionLabel: 'Deploy Agent Swarm',
    defaultPrompt: 'Audit authentication architecture and generate unit tests for API route security with 95% coverage target',
    sampleResults: [
      'Agent Alpha (Architect): Analyzed repository topology, identified 3 optimization targets.',
      'Agent Beta (Security): Verified token encryption standards and CORS middleware protection.',
      'Agent Gamma (QA): Generated 24 unit test suites covering edge cases, 100% passing.',
    ],
  },
  research: {
    title: 'ASTRA Deep Research Engine',
    subtitle: 'Multi-source factual web exploration, synthesis, and verified citations',
    icon: Search,
    accent: 'amber',
    modules: ['Web Citation Verifier', 'Academic Papers', 'Market Intel Extractor', 'Executive Summary'],
    actionLabel: 'Execute Deep Research',
    defaultPrompt: 'Analyze recent breakthroughs in multimodal vision-language architectures and quantum LLM inference efficiency',
    sampleResults: [
      'Source: Nature Machine Intelligence (2026) - "Sparse Mixture-of-Experts Scaling Laws"',
      'Source: IEEE Quantum Computing - "Sub-millisecond Latency in Hybrid Tensor Networks"',
      'Key Finding: Multimodal latency reduced by 42% utilizing quantized KV-cache compression algorithms.',
    ],
  },
  files: {
    title: 'Files & Knowledge Base',
    subtitle: 'Upload documents, codebase repos, PDFs and spreadsheets for RAG indexing',
    icon: FileText,
    accent: 'sky',
    modules: ['Vector Database Index', 'Semantic Chunking', 'PDF & Doc Parser', 'Codebase Map'],
    actionLabel: 'Index Knowledge Base',
    defaultPrompt: 'Ingest engineering design docs and system architecture diagrams to build interactive semantic RAG index',
    sampleResults: [
      'Indexed: system_architecture_v3.pdf (142 pages, 1,280 semantic vectors embedded)',
      'Indexed: api_contracts_openapi.json (48 endpoints indexed, ready for instant QA query)',
      'Indexed: database_schema_production.sql (24 relational tables parsed and mapped)',
    ],
  },
  automation: {
    title: 'ASTRA Automation & Workflows',
    subtitle: 'Event-driven triggers, scheduled cron tasks, and webhook pipelines',
    icon: Zap,
    accent: 'indigo',
    modules: ['Webhook Listeners', 'Cron Triggers', 'API Integrations', 'Error Retry Logic'],
    actionLabel: 'Create Workflow Pipeline',
    defaultPrompt: 'When new user signs up, trigger automated welcome email sequence, provision database sandbox, and notify Slack team channel',
    sampleResults: [
      'Workflow #1 [Active]: Auto-Deploy on Git Push to `main` -> Run Tests -> Upload Artifacts -> Notify Discord',
      'Workflow #2 [Scheduled]: Nightly Database Snapshot & Vector Cache Purge at 03:00 UTC',
      'Workflow #3 [Webhook]: Stripe Checkout Completed -> Grant Pro License & Issue PDF Invoice',
    ],
  },
  affiliate: {
    title: 'Marketing & Affiliate Growth OS',
    subtitle: 'Generate high-converting copy, UTM tracking links, and marketing creatives',
    icon: Megaphone,
    accent: 'pink',
    modules: ['Ad Copy Generator', 'UTM Link Architect', 'Conversion Funnels', 'A/B Test Engine'],
    actionLabel: 'Generate Marketing Assets',
    defaultPrompt: 'High-converting viral Twitter thread and LinkedIn post announcing Astra AI 4.0 launch with key metric callouts',
    sampleResults: [
      'Headline A: "Stop Coding From Scratch. Meet ASTRA AI — Your Full-Stack Autonomous Engine."',
      'Headline B: "From Dream to Deployed App in 60 Seconds: How Top Builders Automate Everything."',
      'UTM Link: astra.ai/forge?utm_source=twitter&utm_medium=viral&utm_campaign=launch4',
    ],
  },
  learning: {
    title: 'Learning & Study Tutor',
    subtitle: 'Personalized interactive curricula, spaced repetition and flashcards',
    icon: GraduationCap,
    accent: 'violet',
    modules: ['Adaptive Quizzer', 'Interactive Math/Code Sandbox', 'Summary Notes', 'Syllabus Planner'],
    actionLabel: 'Generate Study Guide',
    defaultPrompt: 'Explain Transformer attention mechanisms mathematically and generate 5 practice questions with step-by-step solutions',
    sampleResults: [
      'Concept: Self-Attention mathematically computes Softmax((Q * K^T) / sqrt(d_k)) * V.',
      'Quiz Q1: Why is the scale factor sqrt(d_k) necessary for high dimensional vectors? [Answer: Prevents vanishing gradients].',
      'Flashcard Deck: "Deep Learning Foundations" (40 cards saved to your study library).',
    ],
  },
  commerce: {
    title: 'Business & Productivity Hub',
    subtitle: 'Organize milestones, track deliverables, and automate operations',
    icon: Briefcase,
    accent: 'orange',
    modules: ['Sprint Planner', 'Automated Invoicing', 'KPI Scorecard', 'Meeting Transcripts'],
    actionLabel: 'Generate Business Blueprint',
    defaultPrompt: 'Q4 Product roadmap with 3 major feature milestones, resource allocation, and risk mitigation strategies',
    sampleResults: [
      'Milestone 1 (Weeks 1-4): Multi-tenant Organization Management & Role-Based Access Control',
      'Milestone 2 (Weeks 5-8): One-Click Cloud Run Deployments & Custom Domain SSL Setup',
      'Milestone 3 (Weeks 9-12): Marketplace Monetization Engine & Developer Payouts Dashboard',
    ],
  },
  tools: {
    title: 'Tools & Plugins Directory',
    subtitle: 'Extend ASTRA with third-party tools, plugins and MCP servers',
    icon: Wand2,
    accent: 'purple',
    modules: ['Model Context Protocol (MCP)', 'REST APIs', 'Custom Webhooks', 'Database Connectors'],
    actionLabel: 'Install & Activate Plugin',
    defaultPrompt: 'Connect PostgreSQL database MCP server and enable real-time natural language query execution',
    sampleResults: [
      'Installed: "PostgreSQL Connector MCP" (Status: Connected, 12 tables accessible)',
      'Installed: "GitHub Repository Tool" (Status: Authenticated, Token active)',
      'Installed: "Brave Search API" (Status: Active, 10,000 queries remaining)',
    ],
  },
  control: {
    title: 'ASTRA Control Hub & System Diagnostics',
    subtitle: 'Audit logs, version checkpoints, token telemetry, and environment variables',
    icon: ShieldCheck,
    accent: 'emerald',
    modules: ['System Health Telemetry', 'Active Tokens & Billing', 'Security Firewall', 'Audit Log'],
    actionLabel: 'Run Full System Diagnostic',
    defaultPrompt: 'Verify all API proxy endpoints, database connectivity, and WebSocket latency metrics',
    sampleResults: [
      'Diagnostic Result: 8/8 services operational. Average API response: 18ms.',
      'Firewall Status: Zero security vulnerabilities detected. SSL/TLS 1.3 enforced.',
      'Database Sync: Cloud Firestore latency: 12ms. All indexes synced.',
    ],
  },
};

export function GeneralWorkspace({ workspaceId, onBack, onNotify }: GeneralWorkspaceProps) {
  const conf = CONFIG[workspaceId] || CONFIG.control;
  const Icon = conf.icon;
  const [activeTab, setActiveTab] = useState(conf.modules[0]);
  const [inputText, setInputText] = useState(conf.defaultPrompt);
  const [results, setResults] = useState<string[]>(conf.sampleResults);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newResult = `Generated Output for [${activeTab}]: "${inputText.slice(0, 70)}..." (${new Date().toLocaleTimeString()})`;
      setResults((prev) => [newResult, ...prev]);
      onNotify(`${conf.actionLabel} completed successfully!`);
    }, 900);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in select-text">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/25">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="Return to Home Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Icon size={22} className="text-cyan-400" />
              {conf.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{conf.subtitle}</p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-300 bg-cyan-500/15 px-3 py-1.5 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Studio</span>
        </span>
      </div>

      {/* Module Selector Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {conf.modules.map((mod) => (
          <button
            key={mod}
            onClick={() => setActiveTab(mod)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
              activeTab === mod
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-cyan-400/40'
                : 'bg-[#070e28]/80 text-slate-400 hover:text-white hover:bg-[#0c1840] border border-white/5'
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Main Execution Console */}
      <div className="p-6 rounded-2xl bg-[#060c22]/90 border border-cyan-500/25 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            <span>Interactive {activeTab} Console</span>
          </h3>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <Check size={14} /> Ready for input
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">
            Prompt / Directives
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enter directives or specifications for ${activeTab}...`}
            rows={3}
            className="w-full rounded-xl bg-[#081232] border border-cyan-500/30 p-3.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.25)] select-text"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAction}
            disabled={isProcessing || !inputText.trim()}
            className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white hover:brightness-110 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Rocket size={14} />
            )}
            <span>{isProcessing ? 'Processing with ASTRA...' : conf.actionLabel}</span>
          </button>
          <button
            onClick={() => {
              setInputText(conf.defaultPrompt);
              onNotify('Reset to default example prompt');
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Live Output Section */}
        <div className="pt-4 border-t border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
              Generated Assets & Activity Stream
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {results.length} outputs ready
            </span>
          </div>

          <div className="space-y-2">
            {results.map((res, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#081335]/70 border border-cyan-500/15 text-xs text-slate-200 flex items-start justify-between gap-3 group hover:border-cyan-400/40 transition-colors"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <p className="leading-relaxed font-mono text-[11px] text-slate-300">
                    {res}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(res);
                    onNotify('Copied output to clipboard!');
                  }}
                  className="p-1 rounded text-slate-400 hover:text-cyan-300 opacity-60 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Copy result"
                >
                  <Copy size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
