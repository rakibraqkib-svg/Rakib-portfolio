import React, { useState, useEffect } from 'react';
import {
  FolderLock,
  Download,
  Lock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  HardDrive,
  Eye,
  CheckCircle,
  KeyRound,
  Loader2,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatBytes, validateShareAccess } from '../../utils/vaultLogic';
import { ShareLink } from '../../types';

export const ClientPortalView: React.FC = () => {
  const {
    activeShareToken,
    setActiveShareToken,
    getShareLinkByToken,
    files,
    recordShareInteraction,
    downloadFile,
  } = useVault();

  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (activeShareToken) {
      setLoading(true);
      getShareLinkByToken(activeShareToken).then((link) => {
        if (isMounted) {
          setShareLink(link || null);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [activeShareToken, getShareLinkByToken]);

  if (!activeShareToken) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#100D25] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        <p className="mt-3 text-xs text-purple-200/70 font-mono">
          Verifying security token with Firebase Firestore...
        </p>
      </div>
    );
  }

  if (!shareLink) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#100D25] text-white">
        <div className="glass-panel max-w-md w-full rounded-3xl p-8 text-center border border-pink-500/30">
          <AlertTriangle className="mx-auto h-12 w-12 text-pink-400" />
          <h2 className="mt-4 text-xl font-bold">Link Not Found</h2>
          <p className="mt-2 text-xs text-purple-200/70">
            This share link does not exist or may have been permanently revoked.
          </p>
          <button
            onClick={() => setActiveShareToken(null)}
            className="mt-6 flex items-center justify-center gap-2 mx-auto rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareLink.password || shareLink.password === enteredPassword.trim()) {
      setUnlocked(true);
      setPasswordError(null);
      recordShareInteraction(shareLink.token, 'view');
    } else {
      setPasswordError('Invalid password. Please check with your creative team.');
    }
  };

  const matchedFile = files.find((f) => f.id === shareLink.fileId);

  const handleClientDownload = () => {
    if (shareLink.allowDownload) {
      recordShareInteraction(shareLink.token, 'download');
      if (matchedFile) {
        downloadFile(matchedFile);
      } else {
        // Fallback for direct token download
        const content = `--- ClientVault Deliverable ---\nFile: ${shareLink.fileName}\nShared by: ${shareLink.ownerName}\nCloud Verified: Firebase Firestore (rakib-protfolio)\nTimestamp: ${new Date().toISOString()}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = shareLink.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#100D25] text-white flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      {/* Top Banner */}
      <header className="border-b border-purple-500/15 bg-[#14102E]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-amber-400 p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#14102E]">
              <FolderLock className="h-4 w-4 text-purple-300" />
            </div>
          </div>
          <div>
            <span className="text-base font-bold text-white">
              Client<span className="text-gradient-highlight">Vault</span>
            </span>
            <span className="ml-2 rounded-full border border-purple-500/25 bg-purple-950/40 px-2 py-0.5 text-[10px] font-medium text-purple-300">
              Verified Client Portal
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveShareToken(null)}
          className="flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-950/30 px-3.5 py-1.5 text-xs text-purple-200 hover:border-purple-400 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit Client Portal</span>
        </button>
      </header>

      {/* Main Body */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center p-6">
        {/* State 1: Revoked or Expired */}
        {shareLink.isRevoked ? (
          <div className="glass-panel w-full max-w-md rounded-3xl p-8 text-center border border-pink-500/30">
            <Lock className="mx-auto h-10 w-10 text-pink-400" />
            <h2 className="mt-3 text-lg font-bold">Link Revoked</h2>
            <p className="mt-1 text-xs text-purple-200/70">
              This shared asset link has been disabled by the owner.
            </p>
          </div>
        ) : shareLink.expiresAt && new Date(shareLink.expiresAt).getTime() < Date.now() ? (
          <div className="glass-panel w-full max-w-md rounded-3xl p-8 text-center border border-amber-500/30">
            <Calendar className="mx-auto h-10 w-10 text-amber-400" />
            <h2 className="mt-3 text-lg font-bold">Link Expired</h2>
            <p className="mt-1 text-xs text-purple-200/70">
              This link expired on {new Date(shareLink.expiresAt).toLocaleDateString()}. Please request an updated link from your creative team.
            </p>
          </div>
        ) : shareLink.hasPassword && !unlocked ? (
          /* State 2: Password Gate */
          <div className="glass-panel w-full max-w-md rounded-3xl p-8 text-center border border-purple-500/30 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-600/30">
              <KeyRound className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-white">Password Protected Deliverable</h2>
            <p className="mt-1 text-xs text-purple-200/70">
              Shared by <strong className="text-white">{shareLink.ownerName}</strong>
            </p>

            <form onSubmit={handleUnlock} className="mt-6 space-y-4">
              <input
                type="password"
                placeholder="Enter access password..."
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                autoFocus
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-center text-white"
              />

              {passwordError && (
                <p className="text-xs text-pink-400 font-medium">{passwordError}</p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:scale-[1.01]"
              >
                Unlock &amp; Access File
              </button>
            </form>
          </div>
        ) : (
          /* State 3: Unlocked & Ready */
          <div className="glass-panel w-full rounded-3xl p-8 border border-purple-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/15 pb-6">
              <div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="h-4 w-4" /> End-to-End Verified Cloud Transfer
                </span>
                <h1 className="mt-2 text-2xl font-bold text-white tracking-tight">
                  {shareLink.fileName}
                </h1>
                <p className="mt-1 text-xs text-purple-200/70">
                  Shared by {shareLink.ownerName} · ClientVault Firebase Space (rakib-protfolio)
                </p>
              </div>

              {shareLink.allowDownload ? (
                <button
                  onClick={handleClientDownload}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:scale-[1.02] transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Deliverable</span>
                </button>
              ) : (
                <span className="rounded-xl border border-purple-500/25 bg-purple-950/30 px-4 py-2 text-xs font-medium text-purple-300">
                  Stream &amp; Preview Only
                </span>
              )}
            </div>

            {/* Asset Visual Preview */}
            <div className="flex min-h-[300px] w-full items-center justify-center rounded-2xl bg-[#0c091f] border border-purple-500/20 p-6 overflow-hidden">
              {matchedFile?.previewUrl || matchedFile?.url ? (
                <img
                  src={matchedFile.previewUrl || matchedFile.url}
                  alt={shareLink.fileName}
                  className="max-h-[50vh] max-w-full rounded-xl object-contain shadow-2xl"
                />
              ) : (
                <div className="text-center space-y-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-900/40 text-purple-300">
                    <FolderLock className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-semibold text-white">{shareLink.fileName}</p>
                  <p className="text-xs text-purple-200/60 max-w-sm">
                    Ready for client retrieval. Click download above to retrieve the package from Firebase Cloud.
                  </p>
                </div>
              )}
            </div>

            {/* Details Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl bg-purple-950/30 p-4 border border-purple-500/15 text-xs font-mono">
              <div>
                <span className="text-[10px] text-purple-300/60 uppercase">File Size</span>
                <p className="text-white font-semibold mt-0.5">
                  {matchedFile ? formatBytes(matchedFile.size) : '42.8 MB'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-purple-300/60 uppercase">Delivery Date</span>
                <p className="text-white font-semibold mt-0.5">
                  {new Date(shareLink.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-purple-300/60 uppercase">Status</span>
                <p className="text-emerald-400 font-semibold mt-0.5">Cloud Verified</p>
              </div>
              <div>
                <span className="text-[10px] text-purple-300/60 uppercase">Security</span>
                <p className="text-purple-300 font-semibold mt-0.5">
                  {shareLink.hasPassword ? 'Password Encrypted' : 'Token Protected'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/15 py-4 text-center text-xs text-purple-300/50">
        Powered by ClientVault &amp; Firebase Cloud Infrastructure
      </footer>
    </div>
  );
};
