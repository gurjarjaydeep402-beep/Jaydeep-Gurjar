import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Play,
  Ticket,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { useCredits } from '../lib/CreditContext';
import { AstraLogo } from './AstraLogo';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
  onOpenAdModal: () => void;
}

export function PaywallModal({ isOpen, onClose, onNotify, onOpenAdModal }: PaywallModalProps) {
  const { credits, redeemPromoCode, addCredits } = useCredits();

  // Promo code inputs
  const [promoCode, setPromoCode] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const res = redeemPromoCode(promoCode.trim(), userName.trim() || 'Astra Pioneer', phoneNumber.trim());
    setPromoStatus({ success: res.success, message: res.message });

    if (res.success) {
      onNotify(res.message);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const handleSimulateUpgrade = () => {
    addCredits(1000, 'Upgraded to Astra Pro Plan ($29/mo)');
    onNotify('🚀 Upgraded to Astra Pro Plan! +1,000 Credits loaded.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#060a24] border border-cyan-500/35 p-6 sm:p-8 shadow-[0_0_60px_rgba(34,211,238,0.25)] overflow-hidden my-8">
        {/* Glow corners */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <AstraLogo size={22} glow={false} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Astra Forge Power Refill
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {credits} Credits Left
                </span>
              </h2>
              <p className="text-xs text-slate-400">Choose how you would like to continue creating</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 3 Main Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {/* Option A: Watch Quick Ad */}
          <div className="rounded-2xl p-5 bg-[#091338]/80 border border-cyan-500/25 flex flex-col justify-between group hover:border-cyan-400/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  100% FREE
                </span>
                <Play size={16} className="text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Watch Quick Partner Ad</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Watch a short 5-second verified partner sponsor showcase and immediately receive +5 Astra Credits.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenAdModal();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#0d2256] hover:bg-[#133078] text-cyan-200 border border-cyan-400/40 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              <Play size={14} />
              <span>Watch Ad (+5 Credits)</span>
            </button>
          </div>

          {/* Option B: Pro Plan Subscription */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1b0d3e] to-[#0c1844] border border-fuchsia-500/30 flex flex-col justify-between group hover:border-fuchsia-400/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  PRO TIER
                </span>
                <Sparkles size={16} className="text-fuchsia-400" />
              </div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-2xl font-black text-white">$29</span>
                <span className="text-xs text-slate-400">/month</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Unlimited AI interactions, 1,000 monthly credits, priority model routing, and full factory exports.
              </p>
            </div>

            <button
              onClick={handleSimulateUpgrade}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-fuchsia-600 via-pink-600 to-indigo-600 text-white hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.35)]"
            >
              <Zap size={14} />
              <span>Upgrade to Pro</span>
            </button>
          </div>
        </div>

        {/* Promo Code Redemption Form */}
        <div className="rounded-2xl p-5 bg-[#070f2e]/90 border border-indigo-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Ticket size={16} className="text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Redeem Promo Code</h3>
            <span className="text-[10px] text-slate-400 ml-auto">Master Code: "gurjarj44" (+500 Credits)</span>
          </div>

          <form onSubmit={handleRedeem} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo Code (e.g. gurjarj44)"
                className="px-3 py-2 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone (Optional)"
                className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {promoStatus && (
                <div
                  className={`text-xs flex items-center gap-1.5 ${
                    promoStatus.success ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {promoStatus.success ? <CheckCircle2 size={13} /> : <X size={13} />}
                  <span>{promoStatus.message}</span>
                </div>
              )}
              {!promoStatus && <span />}

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.3)] ml-auto"
              >
                <span>Redeem Voucher</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </form>
        </div>

        {/* Non-blocking Footer Notice */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Non-blocking trial system. You can close this dialog at any time.</span>
          </div>
          <button
            onClick={onClose}
            className="text-cyan-400 hover:underline font-medium"
          >
            Continue with remaining ({credits})
          </button>
        </div>
      </div>
    </div>
  );
}
