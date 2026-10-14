import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, ShieldCheck, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useCredits } from '../lib/CreditContext';
import { AstraLogo } from './AstraLogo';

interface WatchAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export function WatchAdModal({ isOpen, onClose, onNotify }: WatchAdModalProps) {
  const { watchRewardAdSuccess } = useCredits();
  const [secondsRemaining, setSecondsRemaining] = useState(6);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(6);
      setIsPlaying(true);
      setIsCompleted(false);
    } else {
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || !isPlaying || isCompleted) return;

    if (secondsRemaining <= 0) {
      setIsCompleted(true);
      setIsPlaying(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, isCompleted, secondsRemaining]);

  if (!isOpen) return null;

  const handleClaim = () => {
    watchRewardAdSuccess();
    onNotify('🎉 +5 Astra Credits added to your account balance!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#070b24] border border-cyan-500/30 p-6 shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <AstraLogo size={18} glow={false} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Astra Partner Ad Network
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Verified
                </span>
              </h3>
              <p className="text-xs text-slate-400">Watch short sponsored content to refill Astra Credits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Simulated Ad Player Frame */}
        <div className="relative my-5 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c1844] via-[#08102e] to-[#120a32] border border-cyan-500/20 aspect-video flex flex-col justify-between p-4 shadow-inner">
          {/* Ad Header badge */}
          <div className="flex items-center justify-between z-10">
            <span className="px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-mono font-semibold text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>SPONSORED SHOWCASE</span>
            </span>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>

          {/* Ad Content Visual */}
          <div className="flex flex-col items-center justify-center text-center my-auto z-10 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.5)] animate-pulse">
              <Sparkles size={28} className="text-white" />
            </div>
            <h4 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-200 to-pink-300">
              CloudScale Next-Gen AI Compute
            </h4>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              Deploy high-concurrency LLM inference nodes with 99.99% uptime and zero cold-start latency.
            </p>
          </div>

          {/* Ad Footer status & Timer */}
          <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span className="text-[11px]">Fraud-Proof Verifier</span>
            </div>

            <div className="font-mono text-cyan-300 font-bold text-xs bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              {isCompleted ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Ready to Claim
                </span>
              ) : (
                <span>Reward in: {secondsRemaining}s</span>
              )}
            </div>
          </div>

          {/* Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #22d3ee 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Claim / Close Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400">
            Reward: <span className="text-cyan-300 font-bold">+5 Astra Credits</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleClaim}
              disabled={!isCompleted}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:brightness-110 cursor-pointer animate-bounce'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <Sparkles size={14} />
              <span>Claim +5 Credits</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
