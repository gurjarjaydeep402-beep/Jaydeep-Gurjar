import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Archive,
  ArchiveRestore,
  ArrowLeft,
  BarChart2,
  BookOpen,
  BrainCircuit,
  Check,
  CheckSquare,
  Clock,
  Code2,
  Eye,
  FileCode,
  FolderGit2,
  FolderKanban,
  GitBranch,
  LayoutGrid,
  Plus,
  Radio,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import type { AstraProject, ProjectCategory, ProjectTemplate } from '../../lib/projectTypes';
import { PROJECT_TEMPLATES } from '../../lib/projectTypes';
import type { WorkspaceId } from '../../types';
import { ProjectActivityLog } from '../ProjectActivityLog';
import {
  getStoredActivities,
  persistActivities,
  type ProjectActivityItem,
  type ActivityType,
} from '../../lib/activityTypes';

interface ProjectDashboardWorkspaceProps {
  onBack: () => void;
  onNavigate: (id: WorkspaceId) => void;
  onNotify: (msg: string) => void;
}

const STORAGE_KEY = 'astra_forge_projects_v2';

const INITIAL_PROJECTS: AstraProject[] = [
  {
    id: 'proj-1',
    name: 'Quantum Trading Matrix',
    description: 'Algorithmic multi-asset strategy scanner for NIFTY 50 and BTC with autonomous execution pipelines.',
    category: 'finance',
    status: 'deployed',
    stars: 14,
    commitsCount: 38,
    currentBranch: 'main',
    lastUpdated: Date.now() - 1000 * 60 * 24,
    framework: 'React 19 + TypeScript',
    modelEngine: 'Gemini 3.5 Flash',
    iconName: 'TrendingUp',
    accent: 'emerald',
    templateId: 'tpl-finance',
    tags: ['Crypto', 'Stocks', 'Trading'],
  },
  {
    id: 'proj-2',
    name: 'Astra Voice Copilot',
    description: 'Ultra-low latency speech-to-speech voice assistant with neural ElevenLabs cloning and TTS synthesis.',
    category: 'audio-video',
    status: 'active',
    stars: 29,
    commitsCount: 42,
    currentBranch: 'feature/neural-voice-agent',
    lastUpdated: Date.now() - 1000 * 60 * 65,
    framework: 'Node.js + WebSockets',
    modelEngine: 'gemini-3.8-live + ElevenLabs',
    iconName: 'Mic2',
    accent: 'purple',
    tags: ['Live Audio', 'Speech', 'Voice'],
  },
  {
    id: 'proj-3',
    name: 'Autonomous Research Swarm',
    description: 'Multi-agent network capable of deep academic crawling, citation verification, and markdown synthesis.',
    category: 'ai-agent',
    status: 'active',
    stars: 8,
    commitsCount: 19,
    currentBranch: 'main',
    lastUpdated: Date.now() - 1000 * 60 * 180,
    framework: 'TypeScript + GenAI SDK',
    modelEngine: 'gemini-3.1-pro-preview',
    iconName: 'BrainCircuit',
    accent: 'purple',
    templateId: 'tpl-ai-agent',
    tags: ['Agents', 'Grounding', 'Research'],
  },
  {
    id: 'proj-4',
    name: 'Astra Forge API Documentation',
    description: 'Developer documentation portal with interactive Markdown rendered specs and live code copy snippets.',
    category: 'documentation',
    status: 'deployed',
    stars: 21,
    commitsCount: 31,
    currentBranch: 'main',
    lastUpdated: Date.now() - 1000 * 60 * 210,
    framework: 'Next / Vite + Markdown',
    modelEngine: 'gemini-3.5-flash',
    iconName: 'BookOpen',
    accent: 'blue',
    templateId: 'tpl-documentation',
    tags: ['Docs', 'Markdown', 'API'],
  },
  {
    id: 'proj-5',
    name: 'Neural Telemetry & Data Analysis',
    description: 'Live quantitative analytics dashboard with canvas chart rendering, trend regression and anomaly detection.',
    category: 'data-analysis',
    status: 'active',
    stars: 12,
    commitsCount: 22,
    currentBranch: 'main',
    lastUpdated: Date.now() - 1000 * 60 * 290,
    framework: 'HTML5 Canvas + TypeScript',
    modelEngine: 'gemini-3.5-flash',
    iconName: 'BarChart2',
    accent: 'emerald',
    templateId: 'tpl-data-analysis',
    tags: ['Data Analysis', 'Charts', 'Telemetry'],
  },
  {
    id: 'proj-6',
    name: 'SaaS Launchpad Studio',
    description: 'High-converting responsive landing page generator with Stripe integration and dynamic Tailwind styler.',
    category: 'web-app',
    status: 'deployed',
    stars: 17,
    commitsCount: 27,
    currentBranch: 'main',
    lastUpdated: Date.now() - 1000 * 60 * 360,
    framework: 'Vite + Tailwind CSS',
    modelEngine: 'gemini-3.5-flash',
    iconName: 'LayoutGrid',
    accent: 'cyan',
    templateId: 'tpl-web-app',
    tags: ['SaaS', 'Tailwind', 'Vite'],
  },
];

export function ProjectDashboardWorkspace({
  onBack,
  onNavigate,
  onNotify,
}: ProjectDashboardWorkspaceProps) {
  const [projects, setProjects] = useState<AstraProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved projects from localStorage:', e);
    }
    return INITIAL_PROJECTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deployed' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<AstraProject | null>(null);
  const [selectedProjectDetailTab, setSelectedProjectDetailTab] = useState<'overview' | 'activity' | 'vcs'>('overview');
  const [activityModalProject, setActivityModalProject] = useState<AstraProject | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'projects' | 'templates' | 'activity'>('projects');
  const [feedSelectedProjectId, setFeedSelectedProjectId] = useState<string>('all');

  // Checkbox selection state for bulk actions
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Selected template state for modal creation
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ProjectTemplate | null>(null);

  // New Project Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<AstraProject['category']>('web-app');
  const [newModel, setNewModel] = useState('gemini-3.5-flash');

  // Helper to record activity in the background
  const logProjectActivity = (
    projectId: string,
    projectName: string,
    type: ActivityType,
    title: string,
    description: string,
    status: 'success' | 'info' | 'warning' = 'info'
  ) => {
    try {
      const all = getStoredActivities(projects);
      const newAct: ProjectActivityItem = {
        id: `act-${projectId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        projectId,
        projectName,
        type,
        title,
        description,
        timestamp: Date.now(),
        author: { name: 'Astra Forge Workspace', role: 'Dashboard Bot' },
        status,
        isRealtime: true,
      };
      persistActivities([newAct, ...all]);
    } catch (e) {
      console.warn('Could not log project activity:', e);
    }
  };

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Could not save projects to localStorage:', e);
    }
  }, [projects]);

  const filteredProjects = projects.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.framework.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Boolean(p.tags && p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesStatus && matchesSearch;
  });

  const filteredTemplates = PROJECT_TEMPLATES.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Checkbox selection handlers
  const handleToggleSelectProject = (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedProjectIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const allFilteredSelected =
    filteredProjects.length > 0 &&
    filteredProjects.every((p) => selectedProjectIds.includes(p.id));

  const someFilteredSelected =
    filteredProjects.some((p) => selectedProjectIds.includes(p.id)) && !allFilteredSelected;

  const handleToggleSelectAll = () => {
    const allFilteredIds = filteredProjects.map((p) => p.id);
    if (allFilteredSelected) {
      setSelectedProjectIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedProjectIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  // Bulk Operations
  const selectedProjects = projects.filter((p) => selectedProjectIds.includes(p.id));
  const selectedArchivedCount = selectedProjects.filter((p) => p.status === 'archived').length;
  const selectedNonArchivedCount = selectedProjects.filter((p) => p.status !== 'archived').length;

  const handleBulkArchive = () => {
    if (selectedProjectIds.length === 0) return;
    const count = selectedNonArchivedCount || selectedProjectIds.length;
    setProjects((prev) =>
      prev.map((p) => (selectedProjectIds.includes(p.id) ? { ...p, status: 'archived' } : p))
    );
    selectedProjects.forEach((p) => {
      logProjectActivity(
        p.id,
        p.name,
        'status_change',
        'Batch Archived by User',
        'Project was moved to archived state via dashboard bulk actions toolbar.',
        'warning'
      );
    });
    setSelectedProjectIds([]);
    onNotify(`Successfully archived ${count} project${count > 1 ? 's' : ''}.`);
  };

  const handleBulkRestore = () => {
    if (selectedProjectIds.length === 0) return;
    const count = selectedArchivedCount || selectedProjectIds.length;
    setProjects((prev) =>
      prev.map((p) =>
        selectedProjectIds.includes(p.id) && p.status === 'archived'
          ? { ...p, status: 'active' }
          : p
      )
    );
    selectedProjects.forEach((p) => {
      logProjectActivity(
        p.id,
        p.name,
        'status_change',
        'Batch Restored by User',
        'Project was restored to active status via dashboard bulk actions toolbar.',
        'success'
      );
    });
    setSelectedProjectIds([]);
    onNotify(`Restored ${count} project${count > 1 ? 's' : ''} to active.`);
  };

  const handleConfirmBulkDelete = () => {
    const count = selectedProjectIds.length;
    setProjects((prev) => prev.filter((p) => !selectedProjectIds.includes(p.id)));
    if (selectedProject && selectedProjectIds.includes(selectedProject.id)) {
      setSelectedProject(null);
    }
    setSelectedProjectIds([]);
    setIsBulkDeleteModalOpen(false);
    onNotify(`Permanently deleted ${count} project${count > 1 ? 's' : ''}.`);
  };

  const handleToggleArchiveProject = (proj: AstraProject, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextStatus = proj.status === 'archived' ? 'active' : 'archived';
    setProjects((prev) =>
      prev.map((p) => (p.id === proj.id ? { ...p, status: nextStatus } : p))
    );
    if (selectedProject?.id === proj.id) {
      setSelectedProject({ ...selectedProject, status: nextStatus });
    }
    logProjectActivity(
      proj.id,
      proj.name,
      'status_change',
      nextStatus === 'archived' ? 'Project archived' : 'Project restored to active',
      `User updated project status in dashboard to ${nextStatus}.`,
      nextStatus === 'archived' ? 'warning' : 'success'
    );
    onNotify(
      nextStatus === 'archived'
        ? `Project "${proj.name}" moved to archive.`
        : `Project "${proj.name}" restored to active.`
    );
  };

  const handleOpenCreateWithTemplate = (tpl?: ProjectTemplate) => {
    if (tpl) {
      setSelectedTemplate(tpl);
      setNewName(`${tpl.name} Instance`);
      setNewDesc(tpl.description);
      setNewCategory(tpl.category);
      setNewModel(tpl.recommendedModel);
    } else {
      setSelectedTemplate(null);
      setNewName('');
      setNewDesc('');
      setNewCategory('web-app');
      setNewModel('gemini-3.5-flash');
    }
    setIsCreateModalOpen(true);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: AstraProject = {
      id: `proj-${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim() || 'A new AI-powered project crafted inside Astra Forge.',
      category: newCategory,
      status: 'active',
      stars: 1,
      commitsCount: 1,
      currentBranch: 'main',
      lastUpdated: Date.now(),
      framework: selectedTemplate ? selectedTemplate.framework : 'React 19 + TypeScript',
      modelEngine: newModel,
      iconName: selectedTemplate?.iconName || 'FolderKanban',
      accent:
        selectedTemplate?.accent ||
        (newCategory === 'finance'
          ? 'emerald'
          : newCategory === 'ai-agent'
          ? 'purple'
          : 'cyan'),
      templateId: selectedTemplate?.id,
      tags: selectedTemplate?.tags || ['Custom'],
    };

    setProjects([created, ...projects]);
    logProjectActivity(
      created.id,
      created.name,
      'file_edit',
      `Scaffolded project from ${selectedTemplate ? selectedTemplate.name : 'blank blueprint'}`,
      `Initialized repository with ${created.framework} and ${created.modelEngine} engine on main branch.`,
      'success'
    );
    setIsCreateModalOpen(false);
    setSelectedTemplate(null);
    setNewName('');
    setNewDesc('');
    setActiveView('projects');
    onNotify(`Project "${created.name}" created from template & repository initialized!`);
  };

  const handleDelete = (id: string, name: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    setSelectedProjectIds((prev) => prev.filter((item) => item !== id));
    if (selectedProject?.id === id) setSelectedProject(null);
    if (activityModalProject?.id === id) setActivityModalProject(null);
    onNotify(`Project "${name}" removed from workspace.`);
  };

  const handleResetSampleProjects = () => {
    setProjects(INITIAL_PROJECTS);
    setSelectedProjectIds([]);
    onNotify('Restored default Astra Forge showcase projects.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in select-text pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderKanban size={22} className="text-cyan-400" />
              ASTRA Forge Projects & Templates
            </h2>
            <p className="text-xs text-slate-400">
              Scaffold web apps, documentation, real-time activity stream, and bulk project management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex p-1 rounded-xl bg-[#070e28] border border-cyan-500/25">
            <button
              onClick={() => setActiveView('projects')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'projects'
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveView('templates')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'templates'
                  ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-purple-200 border border-purple-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles size={12} className="text-purple-300" />
              <span>Templates ({PROJECT_TEMPLATES.length})</span>
            </button>
            <button
              onClick={() => setActiveView('activity')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'activity'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity size={12} className="text-cyan-300" />
              <span>Live Activity</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>

          <button
            onClick={() => onNavigate('version-control')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#091438] hover:bg-[#0f215c] text-cyan-300 border border-cyan-500/30 transition-all"
          >
            <FolderGit2 size={15} />
            <span className="hidden sm:inline">VCS</span>
          </button>

          <button
            onClick={() => handleOpenCreateWithTemplate()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 hover:brightness-110 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition-all"
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#060c24]/90 p-3 rounded-2xl border border-cyan-500/20">
        {/* Categories */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'web-app', label: 'Web Apps' },
            { id: 'documentation', label: 'Documentation' },
            { id: 'data-analysis', label: 'Data Analysis' },
            { id: 'ai-agent', label: 'AI Agents' },
            { id: 'finance', label: 'Finance' },
            { id: 'mobile', label: 'Mobile' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, templates or tags..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#091230] border border-cyan-500/20 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/50"
          />
        </div>
      </div>

      {/* View 1: Projects Catalog */}
      {activeView === 'projects' && (
        <div className="space-y-4">
          {/* Subheader with Bulk Selection Controls and Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#060c24]/70 p-3 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Select All Checkbox Button */}
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors border border-white/10"
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                    allFilteredSelected
                      ? 'bg-cyan-400 text-slate-950 font-bold'
                      : someFilteredSelected
                      ? 'bg-cyan-500/40 text-cyan-200 border border-cyan-400'
                      : 'border border-white/30 bg-white/5'
                  }`}
                >
                  {allFilteredSelected && <Check size={11} strokeWidth={3} />}
                  {someFilteredSelected && <span className="block w-2 h-0.5 bg-cyan-200 rounded-full" />}
                </div>
                <span>
                  {allFilteredSelected
                    ? 'Deselect All'
                    : `Select All (${filteredProjects.length})`}
                </span>
              </button>

              {selectedProjectIds.length > 0 && (
                <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
                  {selectedProjectIds.length} selected
                </span>
              )}

              <div className="hidden sm:block h-4 w-px bg-white/10" />

              {/* Status Filters */}
              <div className="flex items-center gap-1 text-xs">
                {(['all', 'active', 'deployed', 'archived'] as const).map((st) => {
                  const count =
                    st === 'all'
                      ? projects.length
                      : projects.filter((p) => p.status === st).length;
                  return (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-xl capitalize transition-all ${
                        statusFilter === st
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {st} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {projects.length === 0 && (
                <button
                  onClick={handleResetSampleProjects}
                  className="text-xs text-amber-300 hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  <span>Restore Demo Projects</span>
                </button>
              )}
              <button
                onClick={() => setActiveView('templates')}
                className="text-xs text-cyan-300 hover:underline flex items-center gap-1"
              >
                <Sparkles size={13} />
                <span>Explore Project Template Library →</span>
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#060c24]/50 border border-white/5 text-center space-y-3">
              <FolderKanban size={36} className="mx-auto text-slate-600" />
              <h4 className="text-sm font-semibold text-slate-300">No projects found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No projects matched your category or search criteria. Try switching filters or creating a new project.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-semibold"
                >
                  Reset Filters
                </button>
                {projects.length === 0 && (
                  <button
                    onClick={handleResetSampleProjects}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-xs font-semibold border border-cyan-500/30"
                  >
                    Restore Demo Projects
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((proj) => {
                const isDeployed = proj.status === 'deployed';
                const isArchived = proj.status === 'archived';
                const isSelected = selectedProjectIds.includes(proj.id);

                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className={`p-5 rounded-2xl bg-[#060c24]/90 border transition-all cursor-pointer flex flex-col justify-between group relative ${
                      isSelected
                        ? 'border-cyan-400 bg-[#091538]/95 shadow-[0_0_25px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/50'
                        : isArchived
                        ? 'border-white/5 opacity-80 hover:opacity-100 hover:border-amber-500/35'
                        : 'border-white/5 hover:border-cyan-500/35 hover:shadow-[0_0_25px_rgba(34,211,238,0.12)]'
                    }`}
                  >
                    <div>
                      {/* Top Bar with Checkbox, Status Badge, and Star / Archive Quick action */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          {/* Card Selection Checkbox */}
                          <button
                            type="button"
                            aria-label={isSelected ? `Deselect ${proj.name}` : `Select ${proj.name}`}
                            onClick={(e) => handleToggleSelectProject(proj.id, e)}
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(34,211,238,0.6)]'
                                : 'bg-white/5 border border-white/20 text-transparent hover:border-cyan-400 hover:bg-white/10'
                            }`}
                          >
                            <Check size={13} strokeWidth={3} className={isSelected ? 'opacity-100' : 'opacity-0'} />
                          </button>

                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isDeployed
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : proj.status === 'active'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : isArchived
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-white/5 text-slate-400'
                            }`}
                          >
                            {proj.status}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 capitalize">
                            {proj.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Quick Archive / Restore Action */}
                          <button
                            type="button"
                            title={isArchived ? 'Restore to active' : 'Archive project'}
                            onClick={(e) => handleToggleArchiveProject(proj, e)}
                            className="p-1 rounded-lg text-slate-500 hover:text-amber-300 hover:bg-white/5 transition-colors"
                          >
                            {isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                          </button>

                          <div className="flex items-center gap-1 text-xs text-amber-300">
                            <Star size={13} fill="currentColor" />
                            <span>{proj.stars}</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>

                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400">
                        <span className="font-mono text-cyan-200 truncate">{proj.framework}</span>
                        <span>·</span>
                        <span className="truncate">{proj.modelEngine}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                        <GitBranch size={13} className="text-cyan-400" />
                        <span>{proj.currentBranch}</span>
                        <span className="text-slate-600">({proj.commitsCount}c)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivityModalProject(proj);
                          }}
                          className="px-2 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-105"
                          title="Open real-time & historical activity log"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <Activity size={12} className="text-cyan-400" />
                          <span>Activity</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(proj);
                            setSelectedProjectDetailTab('overview');
                          }}
                          className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1"
                        >
                          <Eye size={13} />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Floating Bulk Operations Toolbar */}
          {selectedProjectIds.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-bounce-in">
              <div className="p-3 sm:p-4 rounded-2xl bg-[#08102d]/95 backdrop-blur-md border border-cyan-400/50 shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(34,211,238,0.25)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold font-mono">
                    <CheckSquare size={15} className="text-cyan-400" />
                    <span>
                      {selectedProjectIds.length}{' '}
                      {selectedProjectIds.length === 1 ? 'project' : 'projects'} selected
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProjectIds([])}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Clear selection
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Bulk Archive */}
                  <button
                    onClick={handleBulkArchive}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all hover:scale-[1.02] shadow-sm"
                  >
                    <Archive size={14} />
                    <span>Archive ({selectedProjectIds.length})</span>
                  </button>

                  {/* Bulk Restore if any archived selected */}
                  {selectedArchivedCount > 0 && (
                    <button
                      onClick={handleBulkRestore}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all hover:scale-[1.02] shadow-sm"
                    >
                      <ArchiveRestore size={14} />
                      <span>Restore ({selectedArchivedCount})</span>
                    </button>
                  )}

                  {/* Bulk Delete */}
                  <button
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all hover:scale-[1.02] shadow-sm"
                  >
                    <Trash2 size={14} />
                    <span>Delete ({selectedProjectIds.length})</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View 2: Template Library Showcase */}
      {activeView === 'templates' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#110c30] via-[#09153b] to-[#04081c] border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Astra Forge Boilerplate Hub
              </span>
              <h3 className="text-lg font-bold text-white mt-1.5">
                Starter Templates & Architectures
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Select a pre-architected blueprint with scaffolding, routing, schema & recommended Gemini models.
              </p>
            </div>
            <button
              onClick={() => handleOpenCreateWithTemplate()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors shrink-0"
            >
              Start from Scratch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((tpl) => {
              const isWeb = tpl.id === 'tpl-web-app';
              const isDocs = tpl.id === 'tpl-documentation';
              const isData = tpl.id === 'tpl-data-analysis';

              return (
                <div
                  key={tpl.id}
                  className="rounded-2xl p-5 bg-[#060c24]/90 border border-purple-500/20 hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                        {isWeb && <LayoutGrid size={20} />}
                        {isDocs && <BookOpen size={20} />}
                        {isData && <BarChart2 size={20} />}
                        {!isWeb && !isDocs && !isData && <Sparkles size={20} />}
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {tpl.badge}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {tpl.name}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {tpl.description}
                    </p>

                    {/* Features pill list */}
                    <div className="mt-3.5 space-y-1.5">
                      {tpl.features.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                          <Check size={12} className="text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Framework tag */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-cyan-200 truncate">{tpl.framework}</span>
                      <span className="text-slate-500">{tpl.recommendedModel}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2">
                    <button
                      onClick={() => setPreviewTemplate(tpl)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye size={13} />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={() => handleOpenCreateWithTemplate(tpl)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-1"
                    >
                      <Plus size={13} />
                      <span>Use Template</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 3: Live Project Activity Feed */}
      {activeView === 'activity' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#071333] via-[#091845] to-[#04091e] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Real-Time Audit Stream
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Stream Connected</span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1.5 flex items-center gap-2">
                <Activity size={20} className="text-cyan-400" />
                <span>Live Project Activity Feed</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Stream real-time code commits, automated builds, model inferences, and deployment events across all projects.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Active Project:</span>
              <select
                value={feedSelectedProjectId}
                onChange={(e) => setFeedSelectedProjectId(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#09153b] border border-cyan-500/40 text-xs font-semibold text-white outline-none focus:border-cyan-300 shadow-md"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.currentBranch || 'main'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(() => {
            const currentProject =
              projects.find((p) => p.id === feedSelectedProjectId) || projects[0];
            if (!currentProject) {
              return (
                <div className="p-12 text-center text-slate-400 text-xs rounded-2xl bg-[#060c24]/50 border border-white/5">
                  No projects available to track activity.
                </div>
              );
            }
            return (
              <ProjectActivityLog
                key={currentProject.id}
                project={currentProject}
                onNotify={onNotify}
                onNavigateToVcs={() => onNavigate('version-control')}
                onNavigateToCode={() => onNavigate('coding')}
              />
            );
          })()}
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div
          className="fixed inset-0 z-[85] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsBulkDeleteModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#080d28] border border-rose-500/40 p-6 shadow-[0_0_50px_rgba(244,63,94,0.3)] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">
                  Permanently Delete {selectedProjectIds.length}{' '}
                  {selectedProjectIds.length === 1 ? 'Project' : 'Projects'}?
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  This action cannot be undone. All repository history, workspace branches, and project templates for the selected projects will be removed from ASTRA Forge.
                </p>
              </div>
            </div>

            <div className="max-h-36 overflow-y-auto rounded-xl bg-black/40 border border-white/5 p-2.5 space-y-1.5 scrollbar-thin">
              {projects
                .filter((p) => selectedProjectIds.includes(p.id))
                .map((p) => (
                  <div key={p.id} className="text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{p.status}</span>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-red-600 text-white hover:brightness-110 shadow-lg shadow-rose-900/40 transition-all flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>
                  Delete {selectedProjectIds.length}{' '}
                  {selectedProjectIds.length === 1 ? 'Project' : 'Projects'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Inspector Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-[#060c24] border border-purple-500/40 p-6 shadow-[0_0_50px_rgba(168,85,247,0.3)] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase">
                  {previewTemplate.category} Template
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5">{previewTemplate.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{previewTemplate.fullOverview}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-500 block mb-0.5">Scaffold Stack</span>
                <span className="font-semibold text-cyan-300">{previewTemplate.framework}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-500 block mb-0.5">Recommended AI Model</span>
                <span className="font-semibold text-emerald-400">{previewTemplate.recommendedModel}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Pre-configured Starter Files
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {previewTemplate.starterFiles.map((file, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-2 text-cyan-200"
                  >
                    <FileCode size={14} className="text-cyan-400" />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const t = previewTemplate;
                  setPreviewTemplate(null);
                  handleOpenCreateWithTemplate(t);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:brightness-110 shadow-lg"
              >
                Configure & Initialize Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[75] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#060c24] border border-cyan-500/35 p-6 shadow-[0_0_50px_rgba(34,211,238,0.25)] space-y-5 scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5">{selectedProject.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedProject.description}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs: Overview vs Activity Log */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => setSelectedProjectDetailTab('overview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedProjectDetailTab === 'overview'
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview & Specs
              </button>
              <button
                type="button"
                onClick={() => setSelectedProjectDetailTab('activity')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedProjectDetailTab === 'activity'
                    ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-200 border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity size={13} className="text-cyan-400" />
                <span>Activity Log</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            {selectedProjectDetailTab === 'overview' ? (
              <>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Deployment Status</span>
                    <span
                      className={`font-semibold capitalize ${
                        selectedProject.status === 'deployed'
                          ? 'text-emerald-400'
                          : selectedProject.status === 'archived'
                          ? 'text-amber-400'
                          : 'text-cyan-300'
                      }`}
                    >
                      ● {selectedProject.status}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Active Branch</span>
                    <span className="font-mono font-semibold text-cyan-300">
                      {selectedProject.currentBranch}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Runtime Stack</span>
                    <span className="font-semibold text-white">{selectedProject.framework}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Intelligence Model</span>
                    <span className="font-semibold text-white">{selectedProject.modelEngine}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        handleDelete(selectedProject.id, selectedProject.name);
                      }}
                      className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>

                    <button
                      onClick={() => handleToggleArchiveProject(selectedProject)}
                      className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      {selectedProject.status === 'archived' ? (
                        <>
                          <ArchiveRestore size={14} />
                          <span>Restore</span>
                        </>
                      ) : (
                        <>
                          <Archive size={14} />
                          <span>Archive</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProject(null);
                        onNavigate('version-control');
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#091438] hover:bg-[#0f215c] text-cyan-300 border border-cyan-500/30"
                    >
                      <FolderGit2 size={14} />
                      <span>Inspect Commits</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProject(null);
                        onNavigate('coding');
                        onNotify(`Opened ${selectedProject.name} in Code Assistant`);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 hover:brightness-110 shadow-md"
                    >
                      <Code2 size={14} />
                      <span>Open in Studio</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <ProjectActivityLog
                project={selectedProject}
                onNotify={onNotify}
                onNavigateToVcs={() => {
                  setSelectedProject(null);
                  onNavigate('version-control');
                }}
                onNavigateToCode={() => {
                  setSelectedProject(null);
                  onNavigate('coding');
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Standalone Project Activity Log Modal */}
      {activityModalProject && (
        <div
          className="fixed inset-0 z-[85] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActivityModalProject(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#060c24] border border-cyan-400/40 p-6 shadow-[0_0_60px_rgba(34,211,238,0.25)] scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            <ProjectActivityLog
              project={activityModalProject}
              onNotify={onNotify}
              onNavigateToVcs={() => {
                setActivityModalProject(null);
                onNavigate('version-control');
              }}
              onNavigateToCode={() => {
                setActivityModalProject(null);
                onNavigate('coding');
              }}
              onClose={() => setActivityModalProject(null)}
            />
          </div>
        </div>
      )}

      {/* Create New Project Modal with Template Support */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#060c24] border border-cyan-500/35 p-6 shadow-[0_0_50px_rgba(34,211,238,0.25)] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-cyan-400" />
                  {selectedTemplate ? `Initialize with ${selectedTemplate.name}` : 'Initialize New Project'}
                </h3>
                {selectedTemplate && (
                  <p className="text-[11px] text-purple-300">
                    Pre-configured from template: {selectedTemplate.framework}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Project Title
                </label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Next-Gen Documentation Portal"
                  className="w-full p-2.5 rounded-xl bg-[#08102e] border border-cyan-500/30 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#08102e] border border-cyan-500/30 text-xs text-white outline-none"
                >
                  <option value="web-app">Web App (SaaS & Dashboard)</option>
                  <option value="documentation">Documentation & Knowledge Base</option>
                  <option value="data-analysis">Data Analysis & Visual Intel</option>
                  <option value="ai-agent">AI Agent Swarm</option>
                  <option value="finance">Trading & Quantitative Finance</option>
                  <option value="mobile">Cross-Platform Mobile App</option>
                  <option value="audio-video">Media & Voice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Intelligence Core (Gemini SDK)
                </label>
                <select
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#08102e] border border-cyan-500/30 text-xs text-white outline-none"
                >
                  <option value="gemini-3.5-flash">gemini-3.5-flash (Fast, Low latency)</option>
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Standard reasoning)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Advanced coding & math)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra-fast)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Description / Specification
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summarize the core purpose and architecture of this project..."
                  className="w-full p-2.5 rounded-xl bg-[#08102e] border border-cyan-500/30 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              {selectedTemplate && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 text-[11px] text-purple-200">
                  Includes initial files: <strong>{selectedTemplate.starterFiles.join(', ')}</strong>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white hover:brightness-110 shadow-lg transition-all"
              >
                Create Project & Scaffold VCS
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
