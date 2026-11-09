import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  Share2,
  Settings,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { DashboardView } from '../../types';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView } = useVault();

  const items: { id: DashboardView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'files', label: 'Files', icon: <FolderOpen className="h-4 w-4" /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'shared', label: 'Shared', icon: <Share2 className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block border-t border-purple-500/15 bg-[#14102E]/90 px-2 py-2 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-purple-300/60 hover:text-purple-200'
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  isActive ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/40' : ''
                }`}
              >
                {item.icon}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
