import React from 'react';
import { Files, HardDrive, Briefcase, Share2, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatBytes } from '../../utils/vaultLogic';

export const StatCards: React.FC = () => {
  const { files, projects, shareLinks, user, setCurrentView } = useVault();

  const activeFiles = files.filter((f) => !f.isTrash);
  const totalFilesCount = activeFiles.length;
  const totalBytes = activeFiles.reduce((acc, f) => acc + f.size, 0);
  const storageLimit = user?.storageLimit || 53687091200;
  const storagePercent = Math.min(100, Math.round((totalBytes / storageLimit) * 100));

  const activeProjectsCount = projects.filter((p) => p.status === 'active').length;
  const activeShareLinks = shareLinks.filter((l) => !l.isRevoked);
  const totalDownloads = shareLinks.reduce((acc, l) => acc + l.downloadsCount, 0);

  const stats = [
    {
      id: 'files',
      title: 'Total Files',
      value: totalFilesCount.toString(),
      subtext: `${files.filter((f) => f.isFavorite).length} favorites`,
      icon: <Files className="h-5 w-5 text-purple-300" />,
      accentGradient: 'from-purple-500/20 via-purple-600/10 to-transparent',
      borderColor: 'border-purple-500/25',
      iconBg: 'from-purple-600 to-indigo-600',
      action: () => setCurrentView('files'),
      trend: '+12% this month',
    },
    {
      id: 'storage',
      title: 'Storage Used',
      value: formatBytes(totalBytes),
      subtext: `${storagePercent}% of ${formatBytes(storageLimit)}`,
      icon: <HardDrive className="h-5 w-5 text-fuchsia-300" />,
      accentGradient: 'from-fuchsia-500/20 via-pink-600/10 to-transparent',
      borderColor: 'border-fuchsia-500/25',
      iconBg: 'from-fuchsia-600 to-pink-600',
      action: () => setCurrentView('settings'),
      trend: `${formatBytes(storageLimit - totalBytes)} free`,
    },
    {
      id: 'projects',
      title: 'Active Projects',
      value: activeProjectsCount.toString(),
      subtext: `${projects.length} total client workspaces`,
      icon: <Briefcase className="h-5 w-5 text-amber-300" />,
      accentGradient: 'from-amber-500/20 via-orange-600/10 to-transparent',
      borderColor: 'border-amber-500/25',
      iconBg: 'from-amber-500 to-orange-600',
      action: () => setCurrentView('projects'),
      trend: '4 active clients',
    },
    {
      id: 'shared',
      title: 'Shared Links',
      value: activeShareLinks.length.toString(),
      subtext: `${totalDownloads} client downloads`,
      icon: <Share2 className="h-5 w-5 text-cyan-300" />,
      accentGradient: 'from-cyan-500/20 via-blue-600/10 to-transparent',
      borderColor: 'border-cyan-500/25',
      iconBg: 'from-cyan-500 to-blue-600',
      action: () => setCurrentView('shared'),
      trend: 'Encrypted & active',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          onClick={stat.action}
          className={`glass-card group relative cursor-pointer overflow-hidden rounded-2xl p-5 ${stat.borderColor} bg-gradient-to-br ${stat.accentGradient}`}
        >
          {/* Subtle ambient light dot in corner */}
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-white/[0.02] blur-xl" />

          <div className="flex items-center justify-between">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr ${stat.iconBg} p-0.5 shadow-md shadow-black/40`}
            >
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#14102E]/80 backdrop-blur-sm">
                {stat.icon}
              </div>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-medium text-purple-300/70 transition-colors group-hover:text-purple-200">
              <span>{stat.trend}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-medium text-slate-300">{stat.title}</h3>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
                {stat.value}
              </span>
            </div>
            <p className="mt-1 text-xs text-purple-200/60">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
