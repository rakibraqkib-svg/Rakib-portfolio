import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image,
  Video,
  Palette,
  Archive,
  Briefcase,
  Loader2,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatBytes, getFileCategory } from '../../utils/vaultLogic';

interface UploadProgressItem {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  errorMessage?: string;
}

export const FileUploaderModal: React.FC = () => {
  const {
    uploadModalOpen,
    setUploadModalOpen,
    uploadFiles,
    projects,
    selectedProjectId,
  } = useVault();

  const [targetProjectId, setTargetProjectId] = useState<string>(selectedProjectId || '');
  const [dragActive, setDragActive] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadProgressItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallSuccess, setOverallSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!uploadModalOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (files: File[]) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
    const newItems: UploadProgressItem[] = [];

    for (const f of files) {
      if (f.size > MAX_FILE_SIZE) {
        newItems.push({
          file: f,
          progress: 0,
          status: 'error',
          errorMessage: 'File exceeds 2 GB limit',
        });
      } else {
        newItems.push({
          file: f,
          progress: 0,
          status: 'uploading',
        });
      }
    }

    setUploadQueue((prev) => [...prev, ...newItems]);
    startUploadSimulation(newItems.filter((i) => i.status === 'uploading'), files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleManualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const startUploadSimulation = async (items: UploadProgressItem[], originalFiles: File[]) => {
    setIsUploading(true);

    // Simulate progressive network chunks for realistic upload feedback
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setUploadQueue((prev) =>
        prev.map((item) =>
          item.status === 'uploading'
            ? {
                ...item,
                progress: Math.min(100, currentProgress),
                status: currentProgress >= 100 ? 'completed' : 'uploading',
              }
            : item
        )
      );

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Commit files to state
        uploadFiles(originalFiles, targetProjectId || undefined);
        setIsUploading(false);
        setOverallSuccess(true);
      }
    }, 200);
  };

  const handleClose = () => {
    setUploadModalOpen(false);
    setUploadQueue([]);
    setOverallSuccess(false);
  };

  const getCategoryIcon = (fileName: string) => {
    const cat = getFileCategory(fileName);
    switch (cat) {
      case 'image':
        return <Image className="h-4 w-4 text-purple-400" />;
      case 'video':
        return <Video className="h-4 w-4 text-fuchsia-400" />;
      case 'design':
        return <Palette className="h-4 w-4 text-amber-400" />;
      case 'archive':
        return <Archive className="h-4 w-4 text-indigo-400" />;
      default:
        return <FileText className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel relative w-full max-w-xl rounded-3xl border border-purple-500/25 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/30 text-purple-300">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Upload Client Files</h2>
              <p className="text-xs text-purple-200/60">
                Securely encrypted and organized for client delivery
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 text-purple-300 hover:bg-purple-900/30 hover:text-white"
            aria-label="Close upload modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Project Selector */}
        <div className="mt-4">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
            <Briefcase className="h-3.5 w-3.5 text-purple-400" />
            Assign to Project (Optional)
          </label>
          <select
            value={targetProjectId}
            onChange={(e) => setTargetProjectId(e.target.value)}
            className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="" className="bg-[#1B1638] text-white">
              General Vault (Unassigned)
            </option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id} className="bg-[#1B1638] text-white">
                {proj.name} ({proj.clientName})
              </option>
            ))}
          </select>
        </div>

        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            dragActive
              ? 'border-fuchsia-400 bg-fuchsia-500/10 scale-[1.01]'
              : 'border-purple-500/30 bg-purple-950/20 hover:border-purple-400/50 hover:bg-purple-900/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleManualSelect}
            className="hidden"
          />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-600/30">
            <UploadCloud className="h-7 w-7" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-white">
            Drag &amp; drop client assets here, or <span className="text-purple-400 underline">browse</span>
          </h3>
          <p className="mt-1 text-xs text-purple-200/60">
            Supports JPG, PNG, SVG, WebP, PDF, DOCX, ZIP, MP4, MOV, PSD, AI, FIG (Max 2GB per file)
          </p>
        </div>

        {/* Upload Queue Progress */}
        {uploadQueue.length > 0 && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1">
            <p className="text-xs font-semibold text-purple-300">
              Uploading Files ({uploadQueue.filter((i) => i.status === 'completed').length}/{uploadQueue.length})
            </p>
            {uploadQueue.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-purple-500/15 bg-purple-950/30 p-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  {getCategoryIcon(item.file.name)}
                  <div className="truncate">
                    <p className="truncate font-medium text-white">{item.file.name}</p>
                    <p className="text-[10px] text-purple-300/60 font-mono">
                      {formatBytes(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.status === 'uploading' && (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-purple-300">
                        {item.progress}%
                      </span>
                      <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    </div>
                  )}
                  {item.status === 'completed' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                  {item.status === 'error' && (
                    <div className="flex items-center gap-1 text-pink-400 text-[10px]">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{item.errorMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-purple-500/15 pt-4">
          <span className="text-xs text-purple-300/60">
            {overallSuccess ? 'Upload complete!' : 'ClientVault automatically generates SHA-256 signatures'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="rounded-xl border border-purple-500/25 px-4 py-2 text-xs font-medium text-purple-200 hover:bg-purple-900/30 hover:text-white"
            >
              {overallSuccess ? 'Done' : 'Cancel'}
            </button>
            {overallSuccess && (
              <button
                onClick={() => {
                  setUploadQueue([]);
                  setOverallSuccess(false);
                }}
                className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500"
              >
                Upload More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
