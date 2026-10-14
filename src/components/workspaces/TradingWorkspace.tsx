import { useState, useEffect, useRef } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart2,
  DollarSign,
  LineChart,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface TradingWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

const ASSETS = [
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 68432.5, change: '+2.18%', positive: true },
  { symbol: 'NIFTY 50', name: 'Nifty 50 Index', price: 24728.65, change: '+1.34%', positive: true },
  { symbol: 'BANKNIFTY', name: 'Bank Nifty', price: 51892.1, change: '+1.27%', positive: true },
  { symbol: 'ETH/USD', name: 'Ethereum', price: 3254.76, change: '+1.96%', positive: true },
  { symbol: 'SOL/USD', name: 'Solana', price: 184.2, change: '+4.12%', positive: true },
];

export function TradingWorkspace({ onBack, onNotify }: TradingWorkspaceProps) {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const [timeframe, setTimeframe] = useState<'1H' | '1D' | '1W' | '1M'>('1D');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate synthetic chart data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 30; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let x = 40; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Generate price curve points
    const pointsCount = 40;
    const points: { x: number; y: number }[] = [];
    let currentY = height * 0.65;

    for (let i = 0; i < pointsCount; i++) {
      const x = (i / (pointsCount - 1)) * width;
      const noise = (Math.sin(i * 0.4) + (Math.random() - 0.48) * 0.8) * 16;
      currentY = Math.max(30, Math.min(height - 40, currentY - noise));
      points.push({ x, y: currentY });
    }

    // Fill gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(34, 211, 238, 0.35)');
    gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.15)');
    gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(width, points[points.length - 1].y);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Stroke line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Pulse dot at current tip
    const last = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(last.x - 4, last.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#67e8f9';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(last.x - 4, last.y, 9, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [selectedAsset, timeframe]);

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
              <TrendingUp size={20} className="text-emerald-400" />
              ASTRA Trading & Finance Engine
            </h2>
            <p className="text-xs text-slate-400">
              Live quantitative analytics, signals, automated risk management
            </p>
          </div>
        </div>

        <button
          onClick={() => onNotify('Refreshed real-time exchange feeds')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 text-xs transition-colors"
        >
          <RefreshCw size={14} />
          <span>Sync Feeds</span>
        </button>
      </div>

      {/* Ticker Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ASSETS.map((asset) => (
          <button
            key={asset.symbol}
            onClick={() => setSelectedAsset(asset)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedAsset.symbol === asset.symbol
                ? 'bg-[#09153a] border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                : 'bg-[#060c24]/80 border-white/5 hover:border-white/15'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">{asset.symbol}</span>
              <span className="text-emerald-400 font-mono text-[11px]">{asset.change}</span>
            </div>
            <p className="text-sm font-black font-mono text-cyan-200 mt-1">
              ${asset.price.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{asset.name}</p>
          </button>
        ))}
      </div>

      {/* Main Chart + Quantitative Signals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Chart Canvas */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#060c24]/90 border border-cyan-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-2xl font-black font-mono text-white">
                  ${selectedAsset.price.toLocaleString()}
                </h3>
                <span className="text-sm font-bold font-mono text-emerald-400 flex items-center">
                  <ArrowUpRight size={16} />
                  {selectedAsset.change} (24h)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedAsset.symbol} · High: ${(selectedAsset.price * 1.025).toFixed(2)} · Low: $
                {(selectedAsset.price * 0.982).toFixed(2)}
              </p>
            </div>

            {/* Timeframe selector */}
            <div className="flex gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
              {(['1H', '1D', '1W', '1M'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                    timeframe === tf
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Render */}
          <div className="relative w-full h-[280px] rounded-xl overflow-hidden bg-black/30 border border-cyan-500/10">
            <canvas ref={canvasRef} width={750} height={280} className="w-full h-full object-cover" />
          </div>

          {/* Quick Indicator Badges */}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5 text-xs">
            <span className="text-slate-400">Indicators:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              RSI (14): 64.2 (Bullish)
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              MACD: Golden Cross
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              EMA 20 &gt; EMA 50
            </span>
          </div>
        </div>

        {/* Signals & Trading Execution Panel */}
        <div className="p-5 rounded-2xl bg-[#060c24]/90 border border-indigo-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                ASTRA Quantitative Signal
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                STRONG BUY
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Algorithmic momentum confirms high-probability continuation with institutional volume
              inflows detected on order books.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-slate-400">Target 1 (TP1)</span>
                <span className="font-mono text-emerald-400 font-bold">
                  ${(selectedAsset.price * 1.035).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-slate-400">Target 2 (TP2)</span>
                <span className="font-mono text-cyan-400 font-bold">
                  ${(selectedAsset.price * 1.068).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-slate-400">Stop Loss (SL)</span>
                <span className="font-mono text-rose-400 font-bold">
                  ${(selectedAsset.price * 0.985).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <button
              onClick={() => onNotify(`Paper trading simulated: BUY order executed for ${selectedAsset.symbol}`)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all"
            >
              Simulate Long Position (Buy)
            </button>
            <button
              onClick={() => onNotify(`Paper trading simulated: SELL order executed for ${selectedAsset.symbol}`)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:brightness-110 transition-all"
            >
              Simulate Short Position (Sell)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
