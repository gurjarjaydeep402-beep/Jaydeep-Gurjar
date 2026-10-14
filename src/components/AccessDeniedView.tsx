import React from 'react';
import { ArrowLeft, Lock, ShieldAlert, LogIn } from 'lucide-react';
import type { UserRole } from '../types';

interface AccessDeniedViewProps {
  requiredRole: 'OWNER' | 'ADMIN';
  currentRole: UserRole;
  targetFeature: string;
  onBack: () => void;
  onOpenAuth?: () => void;
  onPromoteToOwner?: () => void;
}

export function AccessDeniedView({
  requiredRole,
  currentRole,
  targetFeature,
  onBack,
  onOpenAuth,
  onPromoteToOwner,
}: AccessDeniedViewProps) {
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-[#090b24]/90 border border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.2)] text-center space-y-5 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
        <Lock size={32} />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-500/30">
          Security Boundary: 403 Forbidden
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Access Denied: {requiredRole} Clearance Required
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          The requested module <span className="text-cyan-300 font-mono font-semibold">"{targetFeature}"</span> is strictly restricted to authenticated <span className="text-rose-400 font-bold">{requiredRole}</span> roles.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-left text-xs font-mono space-y-1.5 text-slate-300">
        <div className="flex items-center justify-between text-slate-400">
          <span>Active Session Role:</span>
          <span className="font-bold text-amber-300">{currentRole}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Required Clearance:</span>
          <span className="font-bold text-rose-400">{requiredRole} ONLY</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Authorized Account:</span>
          <span className="font-bold text-cyan-300">gurjarjaydeep402@gmail.com</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Enforcement Level:</span>
          <span className="font-bold text-emerald-400">Server-Side & Firestore RBAC Rules</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pt-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Return to Dashboard</span>
        </button>

        {onPromoteToOwner && (
          <button
            onClick={onPromoteToOwner}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-indigo-600 text-white hover:brightness-110 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShieldAlert size={14} />
            <span>Verify Owner Clearance</span>
          </button>
        )}

        {onOpenAuth && (
          <button
            onClick={onOpenAuth}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-indigo-600 text-white hover:brightness-110 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogIn size={14} />
            <span>Sign In with Owner Account</span>
          </button>
        )}
      </div>
    </div>
  );
}
