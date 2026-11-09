import React, { useState } from 'react';
import {
  FolderLock,
  X,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cloud,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const { login, signup, loginWithGoogle, loginDemo } = useVault();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        setIsSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      await signup(name, email, password);
      setIsSubmitting(false);
      onClose();
    } else {
      await login(email, password);
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    const success = await loginWithGoogle();
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const handleInstantDemoLogin = () => {
    loginDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel relative w-full max-w-md rounded-3xl border border-purple-500/25 p-7 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-purple-300 hover:bg-purple-900/40 hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-amber-400 p-[1px] shadow-lg shadow-purple-600/30">
            <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#14102E]">
              <FolderLock className="h-6 w-6 text-purple-300" />
            </div>
          </div>

          <h2 className="mt-3 text-xl font-extrabold text-white">
            {mode === 'signin' ? 'Welcome Back to ClientVault' : 'Create Your Freelance Vault'}
          </h2>
          <p className="mt-1 text-xs text-purple-200/60">
            {mode === 'signin'
              ? 'Multi-device synced with Firebase Firestore'
              : 'Secure client file sharing and cloud asset delivery'}
          </p>
        </div>

        {/* Google Authentication Button */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-purple-400/30 bg-[#1A1438] py-2.5 text-xs font-semibold text-white shadow-sm hover:border-purple-400/60 hover:bg-purple-900/40 transition-all"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
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

          {/* Instant Demo Option */}
          <button
            type="button"
            onClick={handleInstantDemoLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-950/30 py-2 text-[11px] font-semibold text-purple-200 hover:bg-purple-900/30 hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Launch with Demo Account (Rakib)</span>
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-500/15" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#14102E] px-2 text-purple-300/50">Or use email</span>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex rounded-xl border border-purple-500/15 bg-[#14102E] p-1">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === 'signin' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === 'signup' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-purple-400" /> Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Rakib"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-purple-400" /> Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-purple-400" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 pr-10 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-purple-300 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-purple-400" /> Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
          )}

          {mode === 'signin' && (
            <div className="flex items-center justify-between text-[11px] text-purple-300/80">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-purple-500/30 text-purple-600 focus:ring-purple-500"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          {forgotSent && (
            <p className="text-[11px] text-emerald-400 font-medium">
              Password reset link sent to your email.
            </p>
          )}

          {error && <p className="text-[11px] text-pink-400 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {isSubmitting
              ? 'Connecting...'
              : mode === 'signin'
              ? 'Sign In to Vault'
              : 'Create Free Vault Account'}
          </button>
        </form>

        {/* Security badge footer */}
        <div className="mt-4 border-t border-purple-500/15 pt-3 text-center">
          <p className="flex items-center justify-center gap-1.5 text-[10px] text-purple-300/60 font-mono">
            <Cloud className="h-3 w-3 text-cyan-400" />
            Connected to Firebase (rakib-protfolio)
          </p>
        </div>
      </div>
    </div>
  );
};
