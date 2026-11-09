import React from 'react';
import {
  X,
  Download,
  Share2,
  Star,
  Trash2,
  Calendar,
  HardDrive,
  Briefcase,
  Eye,
  FileText,
  Palette,
  Video,
  Play,
  ExternalLink,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatBytes } from '../../utils/vaultLogic';

export const FilePreviewModal: React.FC = () => {
  const {
    previewFile,
    setPreviewFile,
    setShareModalFile,
    downloadFile,
    toggleFavorite,
    deleteFile,
  } = useVault();

  if (!previewFile) return null;

  const handleClose = () => setPreviewFile(null);

  const renderPreviewContent = () => {
    // 1. Image preview
    if (previewFile.category === 'image' && (previewFile.previewUrl || previewFile.url)) {
      return (
        <div className="flex h-full w-full items-center justify-center p-4">
          <img
            src={previewFile.previewUrl || previewFile.url}
            alt={previewFile.name}
            className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
      );
    }

    // 2. Video preview player simulation
    if (previewFile.category === 'video') {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="relative flex aspect-video w-full max-w-lg items-center justify-center rounded-2xl bg-[#0d091e] border border-purple-500/20 shadow-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white shadow-xl shadow-purple-600/40">
              <Play className="h-7 w-7 ml-1" />
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/60 px-3 py-1.5 backdrop-blur-md text-[11px] font-mono text-purple-200">
              <span>00:00 / 02:45</span>
              <span>4K UHD 60FPS</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-purple-300/70">
            High bitrate preview stream encoded for client delivery
          </p>
        </div>
      );
    }

    // 3. Document preview mockup
    if (previewFile.category === 'document') {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#171333] border border-purple-500/20 p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
              <span className="text-xs font-mono uppercase text-cyan-300 font-semibold">
                PDF Document Reader
              </span>
              <span className="text-[11px] text-purple-300/60 font-mono">Page 1 of 64</span>
            </div>
            <div className="mt-4 space-y-3">
              <h3 className="text-sm font-bold text-white">{previewFile.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {previewFile.description ||
                  'Executive deliverables package for client review. Includes specification matrices, design guidelines, and verified sign-off checkpoints.'}
              </p>
              <div className="h-2 w-3/4 rounded bg-purple-900/40" />
              <div className="h-2 w-full rounded bg-purple-900/30" />
              <div className="h-2 w-1/2 rounded bg-purple-900/30" />
            </div>
          </div>
        </div>
      );
    }

    // 4. Design & Archive files
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600/40 to-fuchsia-600/30 border border-purple-500/30 text-purple-300 shadow-2xl">
          <Palette className="h-10 w-10" />
        </div>
        <h3 className="mt-4 text-base font-bold text-white">{previewFile.name}</h3>
        <p className="mt-1 text-xs text-purple-200/60 max-w-xs">
          Interactive layer inspection and export tokens ready for download
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel relative flex flex-col lg:flex-row w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-purple-500/25 shadow-2xl">
        {/* Main Preview Stage */}
        <div className="relative flex flex-1 flex-col justify-between overflow-y-auto bg-[#100D25]/90">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-purple-500/15 p-4">
            <div className="flex items-center gap-2 truncate">
              <span className="rounded-md bg-purple-500/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-purple-300">
                {previewFile.type}
              </span>
              <h2 className="truncate text-sm font-bold text-white">{previewFile.name}</h2>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1.5 text-purple-300 hover:bg-purple-900/40 hover:text-white"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Visual Canvas */}
          <div className="flex-1 overflow-auto">{renderPreviewContent()}</div>

          {/* Bottom Quick Controls */}
          <div className="flex items-center justify-between border-t border-purple-500/15 p-4 bg-[#14102E]/60">
            <span className="font-mono text-xs text-purple-300">
              {formatBytes(previewFile.size)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile(previewFile)}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-purple-500"
              >
                <Download className="h-4 w-4" /> Download File
              </button>
            </div>
          </div>
        </div>

        {/* Right Info & Actions Sidebar */}
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-purple-500/15 bg-[#171338]/80 p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300/60">
              Asset Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-purple-300/60">Workspace Project</span>
                <p className="font-medium text-white flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="h-3.5 w-3.5 text-purple-400" />
                  {previewFile.projectName || 'Unassigned'}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-purple-300/60">Upload Date</span>
                <p className="font-mono text-purple-200 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-purple-400" />
                  {new Date(previewFile.uploadDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-purple-300/60">Client Engagement</span>
                <div className="mt-1 flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-purple-300">{previewFile.clientViews} views</span>
                  <span className="text-fuchsia-300">{previewFile.downloadCount} downloads</span>
                </div>
              </div>

              {previewFile.description && (
                <div>
                  <span className="text-[11px] text-purple-300/60">Description</span>
                  <p className="mt-0.5 text-xs text-slate-300">{previewFile.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2 border-t border-purple-500/15 pt-4">
            {!previewFile.isTrash && (
              <button
                onClick={() => {
                  setShareModalFile(previewFile);
                  handleClose();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2.5 text-xs font-bold text-white shadow-md hover:scale-[1.01]"
              >
                <Share2 className="h-4 w-4" /> Share With Client
              </button>
            )}

            <button
              onClick={() => toggleFavorite(previewFile.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-950/30 py-2 text-xs font-semibold text-purple-200 hover:bg-purple-900/40 hover:text-white"
            >
              <Star className={`h-4 w-4 ${previewFile.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
              {previewFile.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
            </button>

            <button
              onClick={() => {
                if (confirm(`Move "${previewFile.name}" to trash?`)) {
                  deleteFile(previewFile.id);
                  handleClose();
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-pink-400 hover:bg-pink-950/30"
            >
              <Trash2 className="h-4 w-4" /> Delete File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
