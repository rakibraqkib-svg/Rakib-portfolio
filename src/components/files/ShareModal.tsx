import React, { useState } from 'react';
import {
  Share2,
  X,
  Lock,
  Calendar,
  Download,
  Copy,
  Check,
  Eye,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { ShareLink } from '../../types';

export const ShareModal: React.FC = () => {
  const {
    shareModalFile,
    setShareModalFile,
    createShareLink,
    setActiveShareToken,
    shareLinks,
  } = useVault();

  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [expiryOption, setExpiryOption] = useState<'24h' | '7d' | '30d' | 'never'>('7d');
  const [allowDownload, setAllowDownload] = useState(true);
  const [generatedLink, setGeneratedLink] = useState<ShareLink | null>(null);
  const [copied, setCopied] = useState(false);

  if (!shareModalFile) return null;

  const handleClose = () => {
    setShareModalFile(null);
    setGeneratedLink(null);
    setPassword('');
    setPasswordEnabled(false);
  };

  const handleGenerate = async () => {
    let expiresAt: string | null = null;
    const now = new Date();
    if (expiryOption === '24h') {
      expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    } else if (expiryOption === '7d') {
      expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (expiryOption === '30d') {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    const link = await createShareLink(shareModalFile.id, {
      password: passwordEnabled ? password : undefined,
      expiresAt,
      allowDownload,
    });

    setGeneratedLink(link);
  };

  const getShareUrl = (token: string) => {
    const origin = window.location.origin;
    return `${origin}/?share=${token}`;
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    const url = getShareUrl(generatedLink.token);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenClientPreview = () => {
    if (!generatedLink) return;
    setActiveShareToken(generatedLink.token);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel relative w-full max-w-lg rounded-3xl border border-purple-500/25 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/30 text-purple-300">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Secure Client Share</h2>
              <p className="text-xs text-purple-200/60 truncate max-w-xs">
                {shareModalFile.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 text-purple-300 hover:bg-purple-900/40 hover:text-white"
            aria-label="Close share modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Configuration or Generated Result */}
        {!generatedLink ? (
          <div className="mt-5 space-y-4">
            {/* Expiration Settings */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Calendar className="h-3.5 w-3.5 text-purple-400" />
                Link Expiration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['24h', '7d', '30d', 'never'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setExpiryOption(opt)}
                    className={`rounded-xl py-2 text-xs font-semibold transition-all ${
                      expiryOption === opt
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/50'
                        : 'border border-purple-500/15 bg-purple-950/20 text-purple-300 hover:bg-purple-900/30'
                    }`}
                  >
                    {opt === '24h'
                      ? '24 Hours'
                      : opt === '7d'
                      ? '7 Days'
                      : opt === '30d'
                      ? '30 Days'
                      : 'Never'}
                  </button>
                ))}
              </div>
            </div>

            {/* Password Protection */}
            <div className="rounded-2xl border border-purple-500/15 bg-purple-950/20 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">Password Protection</p>
                    <p className="text-[11px] text-purple-300/60">
                      Client must enter a secret key to view or download
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={passwordEnabled}
                  onChange={(e) => setPasswordEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-purple-400 text-purple-600 focus:ring-purple-500"
                />
              </div>

              {passwordEnabled && (
                <div className="mt-3 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Enter client password (e.g., vault-secret-2026)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Permissions */}
            <div className="rounded-2xl border border-purple-500/15 bg-purple-950/20 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-cyan-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Allow Client Downloads</p>
                  <p className="text-[11px] text-purple-300/60">
                    If toggled off, clients can only stream/preview in browser
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowDownload}
                onChange={(e) => setAllowDownload(e.target.checked)}
                className="h-4 w-4 rounded border-purple-400 text-purple-600 focus:ring-purple-500"
              />
            </div>

            {/* Create CTA */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={passwordEnabled && !password.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:scale-[1.01] disabled:opacity-50"
              >
                Create Secure Share Link
              </button>
            </div>
          </div>
        ) : (
          /* Link Generated Success View */
          <div className="mt-5 space-y-4 animate-in fade-in">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center">
              <ShieldCheck className="mx-auto h-8 w-8 text-emerald-400" />
              <h3 className="mt-2 text-sm font-bold text-white">
                Share Link Ready for Client
              </h3>
              <p className="mt-0.5 text-xs text-purple-200/70">
                Encrypted end-to-end with ClientVault access token
              </p>
            </div>

            {/* Copy Link Field */}
            <div className="flex items-center gap-2 rounded-xl border border-purple-500/25 bg-[#14102E] p-2">
              <input
                type="text"
                readOnly
                value={getShareUrl(generatedLink.token)}
                className="w-full bg-transparent px-2 text-xs font-mono text-purple-200 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Summary details */}
            <div className="rounded-xl border border-purple-500/10 bg-purple-950/20 p-3 text-xs space-y-1.5 font-mono text-purple-300/80">
              <div className="flex justify-between">
                <span>Password:</span>
                <span className="text-white">
                  {generatedLink.hasPassword ? generatedLink.password : 'None (Public Token)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expires:</span>
                <span className="text-white">
                  {generatedLink.expiresAt
                    ? new Date(generatedLink.expiresAt).toLocaleDateString()
                    : 'Never'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Download Permission:</span>
                <span className="text-white">
                  {generatedLink.allowDownload ? 'Allowed' : 'Preview Only'}
                </span>
              </div>
            </div>

            {/* Test Client View CTA */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleOpenClientPreview}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-purple-400/40 bg-purple-900/30 py-2.5 text-xs font-semibold text-purple-200 hover:bg-purple-800/40 hover:text-white"
              >
                <Eye className="h-4 w-4" />
                <span>Test Client Portal View</span>
              </button>
              <button
                onClick={handleClose}
                className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-500"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
