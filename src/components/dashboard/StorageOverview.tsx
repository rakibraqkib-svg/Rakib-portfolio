import React from 'react';
import { Image, Video, FileText, Palette, Archive, Music, HardDrive, ArrowRight } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatBytes, calculateStorageStats } from '../../utils/vaultLogic';

export const StorageOverview: React.FC = () => {
  const { files, user, setCurrentView } = useVault();
  const storageLimit = user?.storageLimit || 53687091200;
  const stats = calculateStorageStats(files, storageLimit);

  const categories = [
    {
      key: 'image' as const,
      label: 'Images',
      bytes: stats.byCategory.image.bytes,
      count: stats.byCategory.image.count,
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
      icon: <Image className="h-4 w-4" />,
    },
    {
      key: 'video' as const,
      label: 'Videos',
      bytes: stats.byCategory.video.bytes,
      count: stats.byCategory.video.count,
      color: 'bg-fuchsia-500',
      textColor: 'text-fuchsia-400',
      icon: <Video className="h-4 w-4" />,
    },
    {
      key: 'design' as const,
      label: 'Design & UI',
      bytes: stats.byCategory.design.bytes,
      count: stats.byCategory.design.count,
      color: 'bg-amber-400',
      textColor: 'text-amber-400',
      icon: <Palette className="h-4 w-4" />,
    },
    {
      key: 'document' as const,
      label: 'Documents',
      bytes: stats.byCategory.document.bytes,
      count: stats.byCategory.document.count,
      color: 'bg-cyan-400',
      textColor: 'text-cyan-400',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      key: 'archive' as const,
      label: 'Archives',
      bytes: stats.byCategory.archive.bytes,
      count: stats.byCategory.archive.count,
      color: 'bg-indigo-400',
      textColor: 'text-indigo-400',
      icon: <Archive className="h-4 w-4" />,
    },
    {
      key: 'audio' as const,
      label: 'Audio & Music',
      bytes: stats.byCategory.audio.bytes,
      count: stats.byCategory.audio.count,
      color: 'bg-emerald-400',
      textColor: 'text-emerald-400',
      icon: <Music className="h-4 w-4" />,
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-white">
            <HardDrive className="h-4 w-4 text-purple-400" />
            Storage Breakdown
          </h2>
          <p className="text-xs text-purple-200/60">
            Encrypted client assets hosted with redundant NVMe storage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-white tabular-nums">
            {formatBytes(stats.totalUsed)}
          </span>
          <span className="text-xs text-purple-300/60 font-mono">/ {formatBytes(storageLimit)}</span>
          <button
            onClick={() => setCurrentView('settings')}
            className="ml-2 flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-white"
          >
            Manage <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Multi-segment progress bar */}
      <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-purple-950/70 p-0.5 flex gap-0.5">
        {categories.map((cat) => {
          const widthPct = stats.totalUsed > 0 ? (cat.bytes / stats.totalUsed) * 100 : 0;
          if (widthPct === 0) return null;
          return (
            <div
              key={cat.key}
              title={`${cat.label}: ${formatBytes(cat.bytes)}`}
              className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
              style={{ width: `${Math.max(1, widthPct)}%` }}
            />
          );
        })}
      </div>

      {/* Breakdown Legend Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <div
            key={cat.key}
            onClick={() => setCurrentView('files')}
            className="cursor-pointer rounded-xl border border-purple-500/10 bg-purple-950/20 p-3 transition-colors hover:border-purple-500/30 hover:bg-purple-900/30"
          >
            <div className="flex items-center gap-2">
              <span className={cat.textColor}>{cat.icon}</span>
              <span className="text-xs font-medium text-slate-200">{cat.label}</span>
            </div>
            <div className="mt-2 font-mono text-sm font-semibold text-white tabular-nums">
              {formatBytes(cat.bytes)}
            </div>
            <div className="text-[10px] text-purple-300/60">
              {cat.count} {cat.count === 1 ? 'file' : 'files'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
