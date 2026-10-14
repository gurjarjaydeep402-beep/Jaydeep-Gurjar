import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AstraLogo } from './AstraLogo';
import { useAuth } from '../lib/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup' | 'reset';
  onNotify: (msg: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = 'login',
  onNotify,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const { login, signup, resetPassword, loginWithGoogle, loginAsGuest } = useAuth();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onNotify('Signed in with Google successfully!');
      onClose();
    } catch (err: any) {
      console.error('Google Auth error:', err);
      if (err.code === 'auth/popup-blocked') {
        setError('Pop-up window was blocked by your browser. Please allow popups or use Demo Session.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was cancelled before completion.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError(
          'Google authentication provider is not enabled in Firebase Console. You can use Demo Session below.'
        );
      } else {
        setError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    loginAsGuest(displayName || 'Jay Gurjar (Demo)', email || 'gurjarjaydeep402@gmail.com');
    onNotify('Entered ASTRA OS in Demo / Guest Session with Full Access.');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || (!email.includes('@') && mode !== 'reset')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onNotify('Signed in to ASTRA OS successfully!');
        onClose();
      } else if (mode === 'signup') {
        await signup(email, password, displayName);
        onNotify('Welcome to ASTRA OS! Your account is active.');
        onClose();
      } else if (mode === 'reset') {
        await resetPassword(email);
        setResetSent(true);
        onNotify('Password reset instructions transmitted to your email.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/operation-not-allowed') {
        msg =
          'Email/Password sign-in is disabled in this Firebase project. Please use "Continue with Google" above (the default configured provider) or use Demo Session.';
      } else if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        msg = 'Invalid email or password combination.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please log in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Access temporarily disabled due to multiple failed attempts. Try again later.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'signup' | 'reset') => {
    setMode(newMode);
    setError(null);
    setResetSent(false);
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#060c24] border border-cyan-500/35 shadow-[0_0_50px_rgba(34,211,238,0.25)] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow corner */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full blur-2xl opacity-30 pointer-events-none" />

        {/* Modal Top Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AstraLogo size={34} variant="active-glowing" />
            <div>
              <h3 className="text-lg font-black tracking-wide text-white flex items-center gap-2">
                ASTRA OS
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Password Reset'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === 'login'
                  ? 'Access your saved workspaces, telemetry, and autonomous agents'
                  : mode === 'signup'
                  ? 'Start building, generating, and automating with ASTRA'
                  : 'Enter your email to receive recovery instructions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-slide-up">
              <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>{error}</p>
                {error.includes('Email/Password') && (
                  <p className="text-[11px] text-cyan-300">
                    💡 Click <strong>Continue with Google</strong> or <strong>Demo Session</strong> below.
                  </p>
                )}
              </div>
            </div>
          )}

          {resetSent && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5 animate-slide-up">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Reset link transmitted</p>
                <p className="mt-0.5 text-[11px] text-slate-300">
                  Check your inbox at <strong>{email}</strong> for instructions to set your new password.
                </p>
              </div>
            </div>
          )}

          {/* Primary Configured Auth Method: Google Sign-In */}
          {mode !== 'reset' && (
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-900 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleGuestSignIn}
                className="w-full py-2 px-3 rounded-xl font-medium text-xs bg-white/[0.04] hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-200 border border-white/[0.08] hover:border-cyan-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={13} className="text-cyan-400" />
                <span>Continue as Jay Gurjar (Demo Session)</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  or with email credentials
                </span>
                <div className="flex-grow border-t border-white/10" />
              </div>
            </div>
          )}

          {/* Form Body for Email / Password */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Full Name / Handle
                </label>
                <div className="relative">
                  <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Jay Gurjar"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091230] border border-cyan-500/25 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091230] border border-cyan-500/25 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('reset')}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#091230] border border-cyan-500/25 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091230] border border-cyan-500/25 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <ShieldCheck size={15} />
                  <span>Sign In with Email</span>
                </>
              ) : mode === 'signup' ? (
                <>
                  <KeyRound size={15} />
                  <span>Register with Email</span>
                </>
              ) : (
                <>
                  <Mail size={15} />
                  <span>Transmit Reset Instructions</span>
                </>
              )}
            </button>
          </form>

          {/* Security and Encryption Assurance */}
          <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>End-to-end encrypted with Firebase Auth & Cloud Firestore</span>
          </div>

          {/* Switch mode links */}
          <div className="pt-2 border-t border-white/5 text-center text-xs text-slate-400">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-cyan-300 font-semibold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an ASTRA account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-cyan-300 font-semibold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-cyan-300 font-semibold hover:underline cursor-pointer"
                >
                  Return to sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
