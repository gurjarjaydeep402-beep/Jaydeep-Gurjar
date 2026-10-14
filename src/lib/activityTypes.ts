import type { AstraProject } from './projectTypes';

export type ActivityType =
  | 'commit'
  | 'deploy'
  | 'branch'
  | 'merge'
  | 'status_change'
  | 'ai_code'
  | 'file_edit'
  | 'build_test'
  | 'config';

export type ActivityStatus = 'success' | 'warning' | 'error' | 'in_progress' | 'info';

export interface ProjectActivityItem {
  id: string;
  projectId: string;
  projectName?: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: number;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  branch?: string;
  commitHash?: string;
  status?: ActivityStatus;
  metadata?: {
    environment?: string; // 'production' | 'staging' | 'preview'
    filesCount?: number;
    linesAdded?: number;
    linesRemoved?: number;
    executionTimeMs?: number;
    modelEngine?: string;
    testSummary?: string;
    diffSnippet?: string;
    deployUrl?: string;
    tags?: string[];
  };
  isRealtime?: boolean;
}

const STORAGE_KEY = 'astra_forge_project_activities_v1';

/**
 * Generate rich, realistic historical activities tailored to a specific project.
 */
export function generateInitialHistoryForProject(project: AstraProject): ProjectActivityItem[] {
  const now = Date.now();
  const branch = project.currentBranch || 'main';
  const model = project.modelEngine || 'gemini-3.5-flash';
  const pid = project.id;
  const pName = project.name;

  const baseActivities: ProjectActivityItem[] = [
    {
      id: `act-${pid}-1`,
      projectId: pid,
      projectName: pName,
      type: 'deploy',
      title: project.status === 'deployed' ? 'Deployed to Production Edge' : 'Staging Preview Deployed',
      description: `Automated container build deployed to cloud edge with TLS and zero-downtime health verification.`,
      timestamp: now - 1000 * 60 * 18, // 18m ago
      author: { name: 'Astra CI/CD Runner', role: 'DevOps Agent' },
      branch: branch,
      commitHash: '8f4c2e1',
      status: 'success',
      metadata: {
        environment: project.status === 'deployed' ? 'production' : 'staging',
        deployUrl: `https://${pid}.astra.internal`,
        executionTimeMs: 1420,
        tags: ['Deploy', 'Cloud Run', 'Edge CDN'],
      },
    },
    {
      id: `act-${pid}-2`,
      projectId: pid,
      projectName: pName,
      type: 'commit',
      title: `feat: optimize reactive state pipeline and telemetry handlers`,
      description: `Refactored websocket event stream buffers to reduce UI repaint jank. Added fallback error boundaries.`,
      timestamp: now - 1000 * 60 * 45, // 45m ago
      author: { name: 'Alex Vance', role: 'Core Engineer' },
      branch: branch,
      commitHash: '7a19d0b',
      status: 'success',
      metadata: {
        filesCount: 4,
        linesAdded: 142,
        linesRemoved: 28,
        diffSnippet: `@@ -42,7 +42,9 @@ export function useTelemetryStream() {\n+ const bufferRef = useRef<DataPoint[]>([]);\n+ const flushBatch = useDebouncedCallback(() => dispatch(bufferRef.current), 16);\n- socket.on('data', point => setRawData(prev => [...prev, point]));`,
        tags: ['VCS', 'Commit', 'Performance'],
      },
    },
    {
      id: `act-${pid}-3`,
      projectId: pid,
      projectName: pName,
      type: 'ai_code',
      title: `Gemini Generated Unit Tests & Validation Schemas`,
      description: `${model} analyzed interface contracts and generated 14 test fixtures with full edge-case coverage.`,
      timestamp: now - 1000 * 60 * 115, // ~2h ago
      author: { name: model, role: 'Intelligence Core' },
      branch: branch,
      status: 'success',
      metadata: {
        modelEngine: model,
        executionTimeMs: 890,
        filesCount: 3,
        testSummary: '14 unit test specs generated (100% syntactically valid)',
        tags: ['AI Agent', 'Code Synthesis', 'Quality'],
      },
    },
    {
      id: `act-${pid}-4`,
      projectId: pid,
      projectName: pName,
      type: 'build_test',
      title: `Continuous Integration Test Suite Passed`,
      description: `All automated lint, typecheck, and runtime unit tests passed with zero regression alerts.`,
      timestamp: now - 1000 * 60 * 240, // 4h ago
      author: { name: 'Astra Test Runner', role: 'Automated CI' },
      branch: branch,
      commitHash: '5e381ca',
      status: 'success',
      metadata: {
        testSummary: '42 / 42 passed in 3.14s',
        executionTimeMs: 3140,
        tags: ['CI', 'Tests', 'Verified'],
      },
    },
    {
      id: `act-${pid}-5`,
      projectId: pid,
      projectName: pName,
      type: 'merge',
      title: `Merged branch '${branch}' into 'main'`,
      description: `Fast-forward merge completed after peer review approval and security linting passes.`,
      timestamp: now - 1000 * 60 * 60 * 9, // 9h ago
      author: { name: 'Elena Rostova', role: 'Staff Architect' },
      branch: 'main',
      commitHash: '3c8290f',
      status: 'success',
      metadata: {
        filesCount: 8,
        linesAdded: 310,
        linesRemoved: 45,
        tags: ['Merge', 'Pull Request', 'Approved'],
      },
    },
    {
      id: `act-${pid}-6`,
      projectId: pid,
      projectName: pName,
      type: 'branch',
      title: `Created development branch '${branch}'`,
      description: `Spawned feature branch from main HEAD to isolate modular architecture upgrades.`,
      timestamp: now - 1000 * 60 * 60 * 16, // 16h ago
      author: { name: 'Alex Vance', role: 'Core Engineer' },
      branch: branch,
      status: 'info',
      metadata: {
        tags: ['Branch', 'Git'],
      },
    },
    {
      id: `act-${pid}-7`,
      projectId: pid,
      projectName: pName,
      type: 'file_edit',
      title: `Scaffolded starter template architecture`,
      description: `Initialized project dependencies for ${project.framework} with strict TypeScript configuration and Tailwind styling.`,
      timestamp: now - 1000 * 60 * 60 * 28, // ~1d ago
      author: { name: 'Astra Forge Scaffolder', role: 'Project Engine' },
      branch: 'main',
      status: 'success',
      metadata: {
        filesCount: 12,
        linesAdded: 840,
        linesRemoved: 0,
        tags: ['Scaffold', 'Template', 'Init'],
      },
    },
    {
      id: `act-${pid}-8`,
      projectId: pid,
      projectName: pName,
      type: 'status_change',
      title: `Project workspace initialized`,
      description: `Project "${pName}" registered in Astra Forge database with category '${project.category}'.`,
      timestamp: now - 1000 * 60 * 60 * 32, // ~1.3d ago
      author: { name: 'System Admin', role: 'Workspace' },
      status: 'info',
      metadata: {
        tags: ['System', 'Creation'],
      },
    },
  ];

  return baseActivities;
}

/**
 * Retrieve all activities from localStorage, initializing if empty.
 */
export function getStoredActivities(defaultProjects: AstraProject[]): ProjectActivityItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read project activities from localStorage:', err);
  }

  // Seed default activities for all provided projects
  const allInitial: ProjectActivityItem[] = [];
  defaultProjects.forEach((proj) => {
    allInitial.push(...generateInitialHistoryForProject(proj));
  });

  // Sort newest first
  allInitial.sort((a, b) => b.timestamp - a.timestamp);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allInitial));
  } catch (err) {
    console.warn('Could not write initial activities to localStorage:', err);
  }

  return allInitial;
}

/**
 * Save updated activity list to localStorage.
 */
export function persistActivities(activities: ProjectActivityItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch (err) {
    console.warn('Could not persist activities to localStorage:', err);
  }
}

/**
 * Generate a realistic random real-time activity for a project to simulate live streaming.
 */
export function generateSimulatedRealtimeEvent(project: AstraProject): ProjectActivityItem {
  const branch = project.currentBranch || 'main';
  const model = project.modelEngine || 'gemini-3.5-flash';
  const pid = project.id;
  const pName = project.name;
  const hex = Math.random().toString(16).substring(2, 9);

  const eventTemplates = [
    {
      type: 'commit' as ActivityType,
      title: `git commit: update ${project.category} real-time handlers`,
      description: `Applied atomic update to data sync workers with exponential backoff on retry.`,
      status: 'success' as ActivityStatus,
      author: { name: 'Astra Copilot', role: 'AI Pair Programmer' },
      metadata: {
        filesCount: Math.floor(Math.random() * 4) + 1,
        linesAdded: Math.floor(Math.random() * 60) + 12,
        linesRemoved: Math.floor(Math.random() * 20),
        diffSnippet: `+  const socketHeartbeat = setInterval(pingServer, 15000);\n+  return () => clearInterval(socketHeartbeat);`,
        tags: ['Git', 'Commit', 'Realtime'],
      },
    },
    {
      type: 'deploy' as ActivityType,
      title: `Edge Canary Deployment Healthy (v1.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)})`,
      description: `Canary traffic routing established at 10% on regional cluster with 0 HTTP 5xx errors recorded.`,
      status: 'success' as ActivityStatus,
      author: { name: 'Astra Cloud Engine', role: 'Infrastructure' },
      metadata: {
        environment: 'production',
        deployUrl: `https://${pid}-canary.astra.run`,
        executionTimeMs: Math.floor(Math.random() * 900) + 600,
        tags: ['Deploy', 'Canary', 'Healthy'],
      },
    },
    {
      type: 'ai_code' as ActivityType,
      title: `${model} completed code security & type audit`,
      description: `Scanned AST for vulnerability patterns, SQL injections, and unbounded state loops. Clean report.`,
      status: 'success' as ActivityStatus,
      author: { name: model, role: 'Intelligence Core' },
      metadata: {
        modelEngine: model,
        executionTimeMs: Math.floor(Math.random() * 500) + 300,
        testSummary: 'Zero security warnings across all scanned TypeScript AST nodes',
        tags: ['AI Audit', 'AST', 'Secure'],
      },
    },
    {
      type: 'build_test' as ActivityType,
      title: `Automated Playwright Integration Test Suite Passed`,
      description: `Simulated end-to-end browser user interactions: creation, editing, and state persistence verified.`,
      status: 'success' as ActivityStatus,
      author: { name: 'Playwright Test Runner', role: 'CI Bot' },
      metadata: {
        testSummary: '28 / 28 E2E test specs passed with 0 flaky retries',
        executionTimeMs: 2450,
        tags: ['E2E', 'Playwright', 'Passed'],
      },
    },
    {
      type: 'status_change' as ActivityType,
      title: `Health Check & Latency Metric Verified`,
      description: `Heartbeat ping responded in ${Math.floor(Math.random() * 25) + 12}ms with 100% service uptime.`,
      status: 'info' as ActivityStatus,
      author: { name: 'Astra Sentry', role: 'Health Watcher' },
      metadata: {
        executionTimeMs: Math.floor(Math.random() * 30) + 15,
        tags: ['Telemetry', 'Uptime', 'Healthy'],
      },
    },
  ];

  const picked = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];

  return {
    id: `act-${pid}-rt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    projectId: pid,
    projectName: pName,
    type: picked.type,
    title: picked.title,
    description: picked.description,
    timestamp: Date.now(),
    author: picked.author,
    branch: branch,
    commitHash: hex,
    status: picked.status,
    metadata: picked.metadata,
    isRealtime: true,
  };
}
