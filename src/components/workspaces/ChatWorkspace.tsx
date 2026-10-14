import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import {
  ArrowLeft,
  Bot,
  Copy,
  Download,
  FileCode,
  FileText,
  Image as ImageIcon,
  Mic,
  MicOff,
  Paperclip,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  StopCircle,
  Trash2,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { AstraLogo } from '../AstraLogo';
import { Markdown } from '../Markdown';
import { askGemini } from '../../lib/gemini';
import { useCredits } from '../../lib/CreditContext';
import type { ChatMessage, AstraMode, AttachmentFile } from '../../types';

interface ChatWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
  initialPrompt?: string;
}

const MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Ultra-fast low latency reasoning' },
  { id: 'astra-4', name: 'ASTRA 4 Pro (Adaptive)', desc: 'Multi-modal autonomous intelligence' },
  { id: 'claude-3-5', name: 'Claude 3.5 Sonnet (Routed)', desc: 'Coding and architecture specialist' },
  { id: 'gpt-4o', name: 'GPT-4o Omnimodal (Routed)', desc: 'Complex reasoning and drafting' },
];

const MODES: { id: AstraMode; label: string; desc: string }[] = [
  { id: 'easy', label: 'EASY', desc: 'Simple, concise answers' },
  { id: 'smart', label: 'SMART', desc: 'Balanced articulate assistant' },
  { id: 'tough', label: 'TOUGH', desc: 'Rigorous analysis & critique' },
  { id: 'expert', label: 'EXPERT', desc: 'Staff engineer production code' },
  { id: 'agent', label: 'AGENT', desc: 'Multi-step action plan & QA' },
];

export function ChatWorkspace({ onBack, onNotify, initialPrompt = '' }: ChatWorkspaceProps) {
  const { credits, deductCredits } = useCredits();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('astra-chat-history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: `### Welcome to ASTRA Chat! 👋\n\nI'm **ASTRA**, your AI operating assistant, creative partner, and autonomous engineering engine.\n\nChoose an **Astra Mode** above (Easy, Smart, Tough, Expert, Agent) and attach files or images anytime:\n- **💻 Code & Dev**: Full-stack React, TypeScript, and test generation\n- **📄 Document Analysis**: Upload .pdf, .json, .txt, or codebase files\n- **📈 Market Intel**: NIFTY 50, BTC, and financial models\n- **🤖 Multi-Step Agent**: Autonomous workflows and plan verification`,
        timestamp: Date.now(),
        model: 'ASTRA 4 Pro',
      },
    ];
  });

  const [input, setInput] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [selectedMode, setSelectedMode] = useState<AstraMode>('smart');
  const [isListening, setIsListening] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachmentFile[]>([]);
  const [quotaWarning, setQuotaWarning] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('astra-chat-history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Handle Multi-file attachment
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImg = file.type.startsWith('image/');
      const reader = new FileReader();

      reader.onload = (event) => {
        const resultStr = event.target?.result as string;
        const newAttachment: AttachmentFile = {
          id: `att-${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type || 'text/plain',
          previewUrl: isImg ? resultStr : undefined,
          content: resultStr,
        };
        setAttachedFiles((prev) => [...prev, newAttachment]);
        onNotify(`Attached "${file.name}"`);
      };

      if (isImg) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles((prev) => prev.filter((a) => a.id !== id));
  };

  // Send message
  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input.trim();
    if ((!textToSend && attachedFiles.length === 0) || isLoading) return;

    // Check credits
    const ok = deductCredits(1, 'Astra Chat Query', selectedModel);
    if (!ok) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const filesSnapshot = [...attachedFiles];
    setAttachedFiles([]);
    setIsLoading(true);
    setQuotaWarning(null);

    try {
      const response = await askGemini(textToSend, {
        history: messages,
        modelName: selectedModel,
        mode: selectedMode,
        attachments: filesSnapshot,
        onQuotaError: () => {
          setQuotaWarning(
            'Gemini quota limits exceeded. System automatically transitioned to Astra Adaptive Intelligence Engine.'
          );
        },
      });

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        model: response.modelUsed,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '⚠️ Temporary latency encountered. Astra local engine is active and ready.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Speech-to-text
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onNotify('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        onNotify('Listening... speak your prompt.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text-to-speech read aloud
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean.slice(0, 320));
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
      onNotify('Reading response aloud...');
    }
  };

  const handleExportChat = () => {
    const markdownContent = messages
      .map((m) => `### ${m.role.toUpperCase()} (${new Date(m.timestamp).toLocaleTimeString()}):\n${m.content}\n`)
      .join('\n---\n\n');
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astra-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Exported conversation to Markdown!');
  };

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem('astra-chat-history');
    onNotify('Chat history cleared.');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto animate-fade-in select-text">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-cyan-500/20 mb-3 gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <AstraLogo size={32} />
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                ASTRA Universal Chat
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {credits} Credits
                </span>
              </h2>
              <p className="text-xs text-slate-400">Multi-modal AI with code execution & document ingestion</p>
            </div>
          </div>
        </div>

        {/* Model & Export Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="rounded-xl border border-indigo-500/30 bg-[#081028] px-3 py-1.5 text-xs text-slate-200 outline-none hover:border-cyan-400/40"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportChat}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Export Conversation"
          >
            <Download size={16} />
          </button>

          <button
            onClick={handleClear}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* 5 Astra Modes Selector Tabs */}
      <div className="flex items-center gap-1.5 pb-2 mb-2 overflow-x-auto scrollbar-none border-b border-white/5">
        <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">MODE:</span>
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              setSelectedMode(mode.id);
              onNotify(`Switched to ASTRA ${mode.label} Mode: ${mode.desc}`);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              selectedMode === mode.id
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                : 'bg-[#081232]/80 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Quota Exceeded Notice Banner */}
      {quotaWarning && (
        <div className="p-3 mb-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between animate-fade-in">
          <span>{quotaWarning}</span>
          <button
            onClick={() => setQuotaWarning(null)}
            className="text-amber-400 hover:underline text-[11px] ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                  <AstraLogo size={20} glow={false} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 relative group ${
                  isUser
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg'
                    : 'bg-[#060c24]/90 border border-cyan-500/25 text-slate-100 shadow-[0_0_25px_rgba(34,211,238,0.05)]'
                }`}
              >
                {isUser ? (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                ) : (
                  <Markdown content={msg.content} />
                )}

                <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-white/10 text-[10px] text-slate-400 font-mono">
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.model && ` · ${msg.model}`}
                  </span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Speak Response"
                    >
                      <Volume2 size={12} />
                      <span>Speak</span>
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white shrink-0">
                  JG
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shrink-0 animate-pulse">
              <AstraLogo size={20} glow={false} />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#060c24] border border-cyan-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-cyan-300 ml-2 font-medium">ASTRA thinking in {selectedMode.toUpperCase()} mode...</span>
            </div>
          </div>
        )}
      </div>

      {/* Micro Neon Thumbnail Attachment Previews */}
      {attachedFiles.length > 0 && (
        <div className="flex items-center gap-2 mb-2 p-2 rounded-xl bg-[#081232]/80 border border-cyan-500/30 overflow-x-auto">
          {attachedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/50 border border-cyan-400/40 text-xs text-cyan-200 shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
            >
              {file.previewUrl ? (
                <img src={file.previewUrl} alt={file.name} className="w-6 h-6 rounded object-cover" />
              ) : file.name.endsWith('.json') || file.name.endsWith('.ts') ? (
                <FileCode size={14} className="text-cyan-400" />
              ) : (
                <FileText size={14} className="text-cyan-400" />
              )}
              <span className="truncate max-w-[120px] font-mono text-[11px]">{file.name}</span>
              <button
                onClick={() => removeAttachment(file.id)}
                className="text-slate-400 hover:text-rose-400"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Central Input Terminal */}
      <div className="relative rounded-2xl bg-[#070e28]/95 border border-cyan-400/35 p-2 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          className="hidden"
        />

        <div className="flex items-end gap-2">
          {/* Multi-file attachment button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-white/5 transition-colors relative"
            title="Attach Images (.png, .jpg) or Documents (.txt, .json, .pdf, code)"
          >
            <Plus size={18} />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={`Ask ASTRA anything in ${selectedMode.toUpperCase()} mode... (Shift+Enter for newline)`}
            className="flex-1 bg-transparent py-2.5 px-1 text-sm text-white placeholder:text-slate-500 outline-none resize-none max-h-32"
          />

          {/* Voice Mic */}
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition-colors ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
            }`}
            title={isListening ? 'Stop listening' : 'Voice dictation'}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Submit */}
          <button
            onClick={() => handleSend()}
            disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
