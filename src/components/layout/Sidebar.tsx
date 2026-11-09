import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  Share2,
  Star,
  Trash2,
  Settings,
  HelpCircle,
  LogOut,
  HardDrive,
  PlusCircle,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { DashboardView } from '../../types';
import { formatBytes } from '../../utils/vaultLogic';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    files,
    user,
    logout,
    setUploadModalOpen,
    setCreateProjectModalOpen,
  } = useVault();

  const activeFiles = files.filter((f) => !f.isTrash);
  const totalBytes = activeFiles.reduce((acc, f) => acc + f.size, 0);
  const storageLimit = user?.storageLimit || 53687091200; // 50 GB
  const storagePercent = Math.min(100, Math.round((totalBytes / storageLimit) * 100));

  const favoritesCount = activeFiles.filter((f) => f.isFavorite).length;
  const trashCount = files.filter((f) => f.isTrash).length;

  const navItems: { id: DashboardView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'files', label: 'My Files', icon: <FolderOpen className="h-4 w-4" />, badge: activeFiles.length },
    { id: 'projects', label: 'Client Projects', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'shared', label: 'Shared Files', icon: <Share2 className="h-4 w-4" /> },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Star className="h-4 w-4" />,
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: <Trash2 className="h-4 w-4" />,
      badge: trashCount > 0 ? trashCount : undefined,
    },
  ];

  const secondaryItems: { id: DashboardView; label: string; icon: React.ReactNode }[] = [
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle className="h-4 w-4" /> },
  ];

  return (
    <aside className="sticky top-18 flex h-[calc(100vh-4.5rem)] w-64 shrink-0 flex-col justify-between border-r border-purple-500/15 bg-[#14102E]/60 p-4 backdrop-blur-xl">
      <div className="space-y-6">
        {/* Quick action buttons */}
        <div className="space-y-2">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] hover:shadow-purple-500/50"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Upload New File</span>
          </button>
          <button
            onClick={() => setCreateProjectModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-400/25 bg-purple-950/30 py-2 text-xs font-semibold text-purple-200 transition-colors hover:border-purple-400/50 hover:bg-purple-900/40 hover:text-white"
          >
            <span>+ New Client Project</span>
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-purple-300/50 uppercase">
            Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 to-fuchsia-600/20 text-white border border-purple-500/40 shadow-sm shadow-purple-500/20'
                      : 'text-purple-200/80 hover:bg-purple-900/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive ? 'text-purple-300' : 'text-purple-400/70 group-hover:text-purple-300'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-purple-500/30 text-purple-200' : 'bg-purple-950/50 text-purple-400/80'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-purple-300/50 uppercase">
            Preferences
          </p>
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-600/30 text-white border border-purple-500/40'
                      : 'text-purple-200/80 hover:bg-purple-900/20 hover:text-white'
                  }`}
                >
                  <span className={`${isActive ? 'text-purple-300' : 'text-purple-400/70'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Storage & Sign Out Area */}
      <div className="space-y-3 pt-4 border-t border-purple-500/15">
        {/* Storage Widget */}
        <div className="glass-card rounded-2xl p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <HardDrive className="h-3.5 w-3.5 text-purple-400" />
              Storage Used
            </span>
            <span className="font-mono text-[11px] text-amber-300 font-medium">
              {storagePercent}%
            </span>
          </div>

          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-purple-950/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400 transition-all duration-500"
              style={{ width: `${storagePercent}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-purple-300/70 font-mono">
            <span>{formatBytes(totalBytes)}</span>
            <span>{formatBytes(storageLimit)}</span>
          </div>

          <button
            onClick={() => setCurrentView('settings')}
            className="mt-3 w-full rounded-lg bg-purple-900/30 py-1.5 text-center text-[11px] font-medium text-purple-300 transition-colors hover:bg-purple-800/40 hover:text-white"
          >
            Upgrade Plan
          </button>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-pink-950/20 hover:text-pink-300"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
