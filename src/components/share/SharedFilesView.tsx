import React, { useState } from 'react';
import {
  Share2,
  Lock,
  Calendar,
  Eye,
  Download,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  Ban,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const SharedFilesView: React.FC = () => {
  const {
    shareLinks,
    revokeShareLink,
    setActiveShareToken,
    files,
    setUploadModalOpen,
  } = useVault();

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopy = (token: string) => {
    const origin = window.location.origin;
    const url = `${origin}/?share=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleOpenClientPortal = (token: string) => {
    setActiveShareToken(token);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">Shared Client Deliverables</h1>
        <p className="text-xs text-purple-200/60">
          Monitor password encryption, link expiration, views, and client download activity
        </p>
      </div>

      {shareLinks.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <Share2 className="mx-auto h-12 w-12 text-purple-400/60" />
          <h3 className="mt-4 text-base font-bold text-white">No active shared links</h3>
          <p className="mt-1 text-xs text-purple-200/60">
            Select any file in your vault and click &quot;Share With Client&quot; to generate an encrypted link.
          </p>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden rounded-2xl border border-purple-500/15">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-purple-500/15 bg-purple-950/40 text-purple-300/80">
              <tr>
                <th className="py-3 px-4 font-semibold">Deliverable File</th>
                <th className="py-3 px-4 font-semibold hidden sm:table-cell">Security</th>
                <th className="py-3 px-4 font-semibold hidden md:table-cell">Expires</th>
                <th className="py-3 px-4 font-semibold hidden lg:table-cell">Client Activity</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {shareLinks.map((link) => {
                const isExpired = link.expiresAt && new Date(link.expiresAt).getTime() < Date.now();
                const isInactive = link.isRevoked || isExpired;

                return (
                  <tr key={link.id} className="transition-colors hover:bg-purple-900/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/30 text-purple-300">
                          <Share2 className="h-4 w-4" />
                        </div>
                        <div className="truncate max-w-xs sm:max-w-sm">
                          <p className="font-semibold text-white truncate">{link.fileName}</p>
                          <span className="font-mono text-[10px] text-purple-300/60 truncate block">
                            token: {link.token}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 hidden sm:table-cell">
                      {link.hasPassword ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                          <Lock className="h-3 w-3" /> Password Protected
                        </span>
                      ) : (
                        <span className="text-[11px] text-purple-300/70">Public Token</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-purple-200/80 font-mono text-[11px] hidden md:table-cell">
                      {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : 'Never'}
                    </td>

                    <td className="py-3 px-4 hidden lg:table-cell font-mono text-[11px]">
                      <div className="flex items-center gap-3 text-purple-300">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-purple-400" /> {link.viewsCount} views
                        </span>
                        <span className="flex items-center gap-1 text-fuchsia-300">
                          <Download className="h-3 w-3 text-fuchsia-400" /> {link.downloadsCount} dl
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {link.isRevoked ? (
                        <span className="rounded-full bg-pink-950/50 border border-pink-500/30 px-2 py-0.5 text-[10px] font-semibold text-pink-300">
                          Revoked
                        </span>
                      ) : isExpired ? (
                        <span className="rounded-full bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                          Expired
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopy(link.token)}
                          className="flex items-center gap-1 rounded-lg border border-purple-500/20 bg-purple-950/30 px-2.5 py-1 text-[11px] font-medium text-purple-200 hover:bg-purple-900/40 hover:text-white"
                          title="Copy Link"
                        >
                          {copiedToken === link.token ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{copiedToken === link.token ? 'Copied' : 'Copy'}</span>
                        </button>

                        {!link.isRevoked && (
                          <button
                            onClick={() => handleOpenClientPortal(link.token)}
                            className="flex items-center gap-1 rounded-lg bg-purple-600/30 px-2.5 py-1 text-[11px] font-semibold text-purple-200 hover:bg-purple-600/60 hover:text-white"
                            title="Open Client View"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Client View</span>
                          </button>
                        )}

                        {!link.isRevoked && (
                          <button
                            onClick={() => {
                              if (confirm(`Revoke shared link for "${link.fileName}"? Clients will immediately lose access.`)) {
                                revokeShareLink(link.id);
                              }
                            }}
                            className="rounded-lg p-1 text-pink-400 hover:bg-pink-950/30"
                            title="Revoke link"
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
