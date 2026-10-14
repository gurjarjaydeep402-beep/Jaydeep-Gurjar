import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileCode,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderOpen,
  HardDrive,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react';
import { useConnectors } from '../../lib/ConnectorsContext';
import type { AttachmentFile } from '../../types';

interface FilesWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
  onSendToChat?: (file: AttachmentFile) => void;
}

interface UploadedFileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  content: string;
  category: 'document' | 'code' | 'image' | 'data';
}

const INITIAL_FILES: UploadedFileRecord[] = [
  {
    id: 'f-1',
    name: 'system_architecture_spec.md',
    size: 14200,
    type: 'text/markdown',
    uploadedAt: 'Today, 11:20 AM',
    content: `# ASTRA Architecture Specification\n\n- Runtime: React 19 + TypeScript + Vite\n- Styling: Tailwind CSS v4 with Obsidian Neon Palette\n- Persistence: Cloud Firestore (ID: ai-studio-b5dc4d15-0567-4e4c-99c3-4a51c6633f36)\n- Central Ledger: CreditContext + Promo Codes Manager\n- AI Engine: Google Gemini 2.5 + Onboard Adaptive Engine`,
    category: 'document',
  },
  {
    id: 'f-2',
    name: 'api_contract_schema.json',
    size: 8900,
    type: 'application/json',
    uploadedAt: 'Yesterday',
    content: `{\n  "endpoints": [\n    { "path": "/api/chat", "method": "POST" },\n    { "path": "/api/promo/redeem", "method": "POST" },\n    { "path": "/api/diagnostics", "method": "GET" }\n  ]\n}`,
    category: 'data',
  },
];

export function FilesWorkspace({ onBack, onNotify, onSendToChat }: FilesWorkspaceProps) {
  const { isServiceConnected, toggleConnector } = useConnectors();
  const isDriveConnected = isServiceConnected('gdrive');

  const [files, setFiles] = useState<UploadedFileRecord[]>(INITIAL_FILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFile, setPreviewFile] = useState<UploadedFileRecord | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    root: true,
    eng: true,
    finance: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    for (let i = 0; i < uploaded.length; i++) {
      const file = uploaded[i];
      const reader = new FileReader();

      const isImage = file.type.startsWith('image/');
      const isCode =
        file.name.endsWith('.ts') ||
        file.name.endsWith('.tsx') ||
        file.name.endsWith('.js') ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.md');

      reader.onload = (event) => {
        const contentStr = event.target?.result as string;
        const newRecord: UploadedFileRecord = {
          id: `file-${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type || 'text/plain',
          uploadedAt: 'Just now',
          content: contentStr || '',
          category: isImage ? 'image' : isCode ? 'code' : 'document',
        };
        setFiles((prev) => [newRecord, ...prev]);
        onNotify(`Uploaded "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
      };

      if (isImage) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImportDriveFile = (fileName: string, contentStr: string) => {
    const newRecord: UploadedFileRecord = {
      id: `drive-${Date.now()}`,
      name: fileName,
      size: 18400,
      type: 'text/markdown',
      uploadedAt: 'Synced from Drive',
      content: contentStr,
      category: 'document',
    };
    setFiles((prev) => [newRecord, ...prev]);
    onNotify(`✓ Synced "${fileName}" from Google Drive into Knowledge Base!`);
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (previewFile?.id === id) setPreviewFile(null);
    onNotify('File removed from knowledge index.');
  };

  const handleDownload = (file: UploadedFileRecord) => {
    const blob = new Blob([file.content], { type: file.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in select-text">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/25">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              <Folder size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Files & Documents Knowledge Base
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {files.length} Indexed
                </span>
              </h2>
              <p className="text-xs text-slate-400">Upload code, datasets, Markdown and images for RAG analysis</p>
            </div>
          </div>
        </div>

        {/* Upload Trigger */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 hover:brightness-110 flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          >
            <UploadCloud size={14} />
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {/* GOOGLE DRIVE CROSS-LINK CLOUD TREE COMPONENT */}
      {isDriveConnected ? (
        <div className="p-5 rounded-2xl bg-[#091538]/90 border border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.15)] space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive size={18} className="text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Google Drive Cloud File Tree (Synchronized)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Drive Connected</span>
            </span>
          </div>

          {/* Interactive Cloud Tree */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-xs text-slate-300 space-y-2">
            {/* Root folder */}
            <div
              onClick={() => toggleFolder('root')}
              className="flex items-center gap-2 cursor-pointer text-cyan-300 font-bold hover:text-white"
            >
              {expandedFolders.root ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <FolderOpen size={15} />
              <span>Google Drive / Astra Shared Storage</span>
            </div>

            {expandedFolders.root && (
              <div className="pl-6 space-y-2 border-l border-white/10 ml-2">
                {/* Engineering Subfolder */}
                <div
                  onClick={() => toggleFolder('eng')}
                  className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-cyan-300 font-semibold"
                >
                  {expandedFolders.eng ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  <Folder size={14} className="text-amber-400" />
                  <span>Engineering Design Specs & Diagrams</span>
                </div>

                {expandedFolders.eng && (
                  <div className="pl-6 space-y-1.5 border-l border-white/5 ml-2 text-[11px]">
                    <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/5">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <FileText size={12} className="text-cyan-400" />
                        <span>astra_v4_core_whitepaper.pdf (1.4 MB)</span>
                      </span>
                      <button
                        onClick={() =>
                          handleImportDriveFile(
                            'astra_v4_core_whitepaper.pdf',
                            '# ASTRA 4 Core Whitepaper\n\nFull autonomous AI engineering specifications and model parallel routing.'
                          )
                        }
                        className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 text-[10px]"
                      >
                        + Import File
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/5">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <FileCode size={12} className="text-emerald-400" />
                        <span>cloud_architecture_topology.json (48 KB)</span>
                      </span>
                      <button
                        onClick={() =>
                          handleImportDriveFile(
                            'cloud_architecture_topology.json',
                            '{\n  "services": ["gemini", "firestore", "cloudsql"],\n  "status": "active"\n}'
                          )
                        }
                        className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 text-[10px]"
                      >
                        + Import File
                      </button>
                    </div>
                  </div>
                )}

                {/* Financial Subfolder */}
                <div
                  onClick={() => toggleFolder('finance')}
                  className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-cyan-300 font-semibold"
                >
                  {expandedFolders.finance ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  <Folder size={14} className="text-emerald-400" />
                  <span>Financial & Quantitative Models</span>
                </div>

                {expandedFolders.finance && (
                  <div className="pl-6 space-y-1.5 border-l border-white/5 ml-2 text-[11px]">
                    <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/5">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <FileSpreadsheet size={12} className="text-emerald-400" />
                        <span>q3_market_quantitative_model.xlsx (620 KB)</span>
                      </span>
                      <button
                        onClick={() =>
                          handleImportDriveFile(
                            'q3_market_quantitative_model.xlsx',
                            'NIFTY 50, BTC, ETH quantitative momentum vectors synced from Google Drive.'
                          )
                        }
                        className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 text-[10px]"
                      >
                        + Import File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#091538]/60 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HardDrive size={18} className="text-slate-400" />
            <div>
              <h4 className="text-xs font-bold text-white">Google Drive Cloud Storage</h4>
              <p className="text-[11px] text-slate-400">
                Connect Google Drive in Cloud Connectors to browse folders and stream cloud files directly into Astra.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              toggleConnector('gdrive');
              onNotify('Google Drive connector activated!');
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 hover:bg-cyan-500/40 transition-colors"
          >
            Connect Drive
          </button>
        </div>
      )}

      {/* Drag & Drop Visual Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="rounded-3xl p-6 border-2 border-dashed border-sky-500/30 hover:border-sky-400/60 bg-[#070e28]/60 hover:bg-[#09153a]/80 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-2xl bg-sky-500/15 group-hover:scale-110 text-sky-400 flex items-center justify-center mb-2 transition-transform">
          <UploadCloud size={24} />
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-white mb-1">Click to browse or drop documents here</h3>
        <p className="text-[11px] text-slate-400 max-w-sm">
          Supports .txt, .md, .json, .csv, .ts, .tsx, and .png/.jpg assets. Content is indexed directly for chat and code tasks.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ingested files by name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
          />
        </div>
        <span className="text-xs text-slate-400">{filteredFiles.length} files matching</span>
      </div>

      {/* Files List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="p-4 rounded-2xl bg-[#070e28]/90 border border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400">
                  {file.category === 'code' ? (
                    <FileCode size={16} />
                  ) : file.category === 'image' ? (
                    <ImageIcon size={16} />
                  ) : (
                    <FileText size={16} />
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setPreviewFile(file)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                    title="Preview Content"
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    onClick={() => handleDownload(file)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                    title="Download"
                  >
                    <Download size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <h4 className="text-xs font-bold text-white truncate" title={file.name}>
                {file.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {(file.size / 1024).toFixed(1)} KB · {file.uploadedAt}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="font-mono text-slate-500 uppercase">{file.category}</span>
              <button
                onClick={() => setPreviewFile(file)}
                className="text-sky-400 hover:underline font-medium"
              >
                Inspect Data
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#070b24] border border-sky-500/35 p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{previewFile.name}</h3>
                <p className="text-xs text-slate-400">
                  {previewFile.type} · {(previewFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto rounded-xl bg-slate-950 p-4 border border-white/10 font-mono text-xs text-slate-300 whitespace-pre-wrap scrollbar-thin">
              {previewFile.content.slice(0, 10000)}
            </div>

            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-white/10">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(previewFile)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-400 text-slate-950 hover:brightness-110"
              >
                Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
