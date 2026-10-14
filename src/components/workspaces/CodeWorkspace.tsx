import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Code2,
  Copy,
  Download,
  Play,
  RefreshCw,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { Markdown } from '../Markdown';

interface CodeWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

const TEMPLATES: Record<string, { title: string; lang: string; code: string }> = {
  react: {
    title: 'Modern React Component with Hooks',
    lang: 'typescript',
    code: `import React, { useState, useEffect } from 'react';
import { Sparkles, Activity } from 'lucide-react';

interface QuantumSensorProps {
  channelId: string;
  initialFreq?: number;
}

export function QuantumSensor({ channelId, initialFreq = 432 }: QuantumSensorProps) {
  const [freq, setFreq] = useState(initialFreq);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setFreq((f) => +(f + (Math.random() - 0.5) * 2).toFixed(2));
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="p-5 rounded-2xl bg-[#08102a] border border-cyan-500/30 text-white shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-cyan-300">CHANNEL: {channelId}</span>
        <button
          onClick={() => setActive(!active)}
          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-200"
        >
          {active ? 'ONLINE' : 'STANDBY'}
        </button>
      </div>
      <div className="text-3xl font-black font-mono text-cyan-400">{freq} MHz</div>
      <p className="text-xs text-slate-400 mt-2">Quantum resonance lock stabilized</p>
    </div>
  );
}`,
  },
  python: {
    title: 'High-Throughput Async AI Worker',
    lang: 'python',
    code: `import asyncio
import aiohttp
from typing import List, Dict, Any

class AstraTelemetryPipeline:
    def __init__(self, endpoint: str, auth_token: str):
        self.endpoint = endpoint
        self.token = auth_token
        self.headers = {"Authorization": f"Bearer {self.token}"}

    async def ingest_stream(self, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        async with aiohttp.ClientSession(headers=self.headers) as session:
            payload = {"batch_size": len(records), "data": records}
            async with session.post(f"{self.endpoint}/v1/ingest", json=payload) as resp:
                result = await resp.json()
                print(f"[ASTRA] Batch ingested: status={resp.status}")
                return result

async def main():
    pipeline = AstraTelemetryPipeline("https://api.astra.ai", "ast_live_token")
    await pipeline.ingest_stream([{"sensor": "alpha", "val": 99.4}])

if __name__ == "__main__":
    asyncio.run(main())`,
  },
};

export function CodeWorkspace({ onBack, onNotify }: CodeWorkspaceProps) {
  const [selectedKey, setSelectedKey] = useState('react');
  const [code, setCode] = useState(TEMPLATES.react.code);
  const [prompt, setPrompt] = useState('Add error boundary and toast notification callback');
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLog, setTerminalLog] = useState<string[]>([
    '[ASTRA Compiler] Kernel v4.18 initialized.',
    '[ASTRA Compiler] TypeScript typecheck passed: 0 errors.',
  ]);

  const handleRun = () => {
    setIsRunning(true);
    onNotify('Compiling and executing code block...');
    setTimeout(() => {
      setIsRunning(false);
      setTerminalLog((prev) => [
        ...prev,
        `[ASTRA Execution] Compiled in 184ms.`,
        `[ASTRA Runtime] Output: QuantumSensor component ready for mount.`,
      ]);
      onNotify('Execution completed successfully with exit code 0');
    }, 1200);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    onNotify('ASTRA generating refined code...');
    setTimeout(() => {
      setCode((prev) => prev + `\n// Refactored with: ${prompt}\n// Checked for production deployment`);
      onNotify('Code updated with specified requirements');
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in select-text">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 size={20} className="text-emerald-400" />
              ASTRA Code & Dev Studio
            </h2>
            <p className="text-xs text-slate-400">Write, debug, refactor and test full-stack code</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {Object.entries(TEMPLATES).map(([key, item]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedKey(key);
                setCode(item.code);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
                selectedKey === key
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Prompt Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-2xl overflow-hidden bg-[#050b1e] border border-cyan-500/25 shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-[#091230] border-b border-cyan-500/20 text-xs">
              <span className="font-mono text-cyan-300">{TEMPLATES[selectedKey]?.title}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    onNotify('Code copied to clipboard');
                  }}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                >
                  <Copy size={13} />
                  <span>Copy</span>
                </button>
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Play size={13} />
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              className="w-full bg-transparent p-4 font-mono text-xs text-cyan-100 leading-relaxed outline-none resize-none"
              spellCheck={false}
            />
          </div>

          {/* Quick AI Refactor input */}
          <div className="flex gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask ASTRA to modify or optimize this code..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#070e28] border border-cyan-500/25 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/50"
            />
            <button
              onClick={handleGenerate}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 hover:brightness-110 flex items-center gap-1.5 shrink-0"
            >
              <Sparkles size={14} />
              <span>Refactor</span>
            </button>
          </div>
        </div>

        {/* Terminal output */}
        <div className="rounded-2xl p-4 bg-[#040818] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/5 mb-3 text-xs font-mono text-slate-400">
              <Terminal size={14} className="text-cyan-400" />
              <span>Terminal & Diagnostics</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px] text-cyan-200/80">
              {terminalLog.map((log, i) => (
                <div key={i} className="leading-tight">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500 flex justify-between">
            <span>Node v22 · React 19 · Vite 8</span>
            <span className="text-emerald-400">● Live Preview Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
