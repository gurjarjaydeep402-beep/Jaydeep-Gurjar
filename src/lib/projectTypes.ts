export type ProjectCategory = 'all' | 'web-app' | 'documentation' | 'data-analysis' | 'ai-agent' | 'mobile' | 'finance' | 'audio-video';

export interface AstraProject {
  id: string;
  name: string;
  description: string;
  category: 'web-app' | 'documentation' | 'data-analysis' | 'ai-agent' | 'mobile' | 'finance' | 'audio-video';
  status: 'active' | 'deployed' | 'draft' | 'archived';
  stars: number;
  commitsCount: number;
  currentBranch: string;
  lastUpdated: number;
  framework: string;
  modelEngine: string;
  iconName: string;
  accent: string;
  templateId?: string;
  tags?: string[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  category: 'web-app' | 'documentation' | 'data-analysis' | 'ai-agent' | 'mobile' | 'finance' | 'audio-video';
  badge: string;
  description: string;
  fullOverview: string;
  framework: string;
  recommendedModel: string;
  iconName: string;
  accent: string;
  starterFiles: string[];
  features: string[];
  tags: string[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'tpl-web-app',
    name: 'Web App (SaaS & Dashboard)',
    category: 'web-app',
    badge: 'Popular',
    description: 'Production-ready full-stack React SPA with Tailwind CSS, authentication state, and interactive metrics.',
    fullOverview: 'Complete architecture for building scalable web apps with responsive layouts, real-time reactive state, modular UI components, and API proxy routing.',
    framework: 'React 19 + TypeScript + Vite',
    recommendedModel: 'gemini-3.5-flash',
    iconName: 'LayoutGrid',
    accent: 'cyan',
    starterFiles: ['src/App.tsx', 'src/components/Dashboard.tsx', 'src/lib/api.ts', 'vite.config.ts'],
    features: ['Dark/Light cosmic theme', 'Firebase Auth ready', 'High-throughput client state', 'Responsive navigation'],
    tags: ['Frontend', 'SaaS', 'Tailwind', 'Vite'],
  },
  {
    id: 'tpl-documentation',
    name: 'Documentation & Knowledge Base',
    category: 'documentation',
    badge: 'Clean UI',
    description: 'Markdown-driven documentation portal with instant search, code snippet copying, and table of contents.',
    fullOverview: 'Designed for engineering docs, API reference manuals, developer handbooks, and system architecture guides with high readability and syntax highlighting.',
    framework: 'Next / Vite + Markdown parser',
    recommendedModel: 'gemini-3.5-flash',
    iconName: 'BookOpen',
    accent: 'blue',
    starterFiles: ['docs/getting-started.md', 'docs/api-reference.md', 'src/components/DocsLayout.tsx'],
    features: ['Instant full-text query', 'Multi-language code blocks', 'Interactive TOC', 'Keyboard shortcuts'],
    tags: ['Docs', 'Markdown', 'Guides', 'API'],
  },
  {
    id: 'tpl-data-analysis',
    name: 'Data Analysis & Visual Intel',
    category: 'data-analysis',
    badge: 'Analytics',
    description: 'Quantitative analytics studio with canvas sparklines, statistical charts, CSV parsing, and AI anomaly detection.',
    fullOverview: 'Interactive telemetry dashboard designed for data scientists, financial quants, and growth engineers to parse datasets and visualize trends.',
    framework: 'TypeScript + HTML5 Canvas + D3 algorithms',
    recommendedModel: 'gemini-3.5-flash',
    iconName: 'BarChart2',
    accent: 'emerald',
    starterFiles: ['src/data/telemetry.csv', 'src/lib/analyticsEngine.ts', 'src/components/TimeSeriesChart.tsx'],
    features: ['Interactive time-series canvas', 'Statistical regression metrics', 'Export to CSV / JSON', 'AI trend insights'],
    tags: ['Data', 'Analytics', 'Quant', 'Charts'],
  },
  {
    id: 'tpl-ai-agent',
    name: 'Autonomous Multi-Agent Swarm',
    category: 'ai-agent',
    badge: 'Autonomous',
    description: 'Multi-agent orchestration pipeline with task delegation, tool execution, and verification loops.',
    fullOverview: 'Hierarchical agent network where specialized supervisor and worker agents collaborate to solve complex research and coding operations.',
    framework: 'TypeScript + Gemini GenAI SDK',
    recommendedModel: 'gemini-3.1-pro-preview',
    iconName: 'BrainCircuit',
    accent: 'purple',
    starterFiles: ['src/agents/supervisor.ts', 'src/agents/researcher.ts', 'src/agents/coder.ts'],
    features: ['Supervisor routing logic', 'Grounding tools integration', 'Stateful memory buffer', 'Zero-conflict merge'],
    tags: ['Agents', 'LLM', 'Autonomous', 'Swarm'],
  },
  {
    id: 'tpl-mobile',
    name: 'Cross-Platform Mobile App',
    category: 'mobile',
    badge: 'PWA / Mobile',
    description: 'Touch-optimized mobile application blueprint with offline cache, bottom navigation bar, and gesture interactions.',
    fullOverview: 'Mobile-first PWA architecture ready for packaging to iOS and Android app stores, featuring fluid haptic feedback and offline sync.',
    framework: 'React 19 + PWA + Touch Gestures',
    recommendedModel: 'gemini-3.5-flash',
    iconName: 'Smartphone',
    accent: 'rose',
    starterFiles: ['src/views/MobileHome.tsx', 'src/components/BottomNav.tsx', 'public/manifest.json'],
    features: ['Smooth touch swipe handlers', 'Service worker caching', 'App manifest icons', 'Safe area insets'],
    tags: ['Mobile', 'PWA', 'iOS', 'Android'],
  },
  {
    id: 'tpl-finance',
    name: 'Trading & Algorithmic Finance',
    category: 'finance',
    badge: 'Live Data',
    description: 'Real-time financial market terminal with order book depth, MACD/RSI indicators, and automated paper trading.',
    fullOverview: 'Institutional-grade finance dashboard displaying live crypto, forex, and equities data with automated signal scanners.',
    framework: 'React 19 + High-Freq WebSocket Feeds',
    recommendedModel: 'gemini-3.5-flash',
    iconName: 'TrendingUp',
    accent: 'amber',
    starterFiles: ['src/lib/orderBook.ts', 'src/components/CandlestickChart.tsx', 'src/lib/indicators.ts'],
    features: ['Sub-second feed latency', 'Automated buy/sell simulator', 'Risk stop-loss manager', 'Market tickers'],
    tags: ['Crypto', 'Stocks', 'Trading', 'Finance'],
  },
];
