import React, { useState } from 'react';
import {
  ShieldCheck,
  Bell,
  Search,
  UploadCloud,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings,
  FolderLock,
  ExternalLink,
  Check,
  CheckCheck,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';

interface NavbarProps {
  onOpenAuth?: () => void;
  isLanding?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, isLanding = false }) => {
  const {
    user,
    isAuthenticated,
    logout,
    currentView,
    setCurrentView,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setUploadModalOpen,
    searchQuery,
    setSearchQuery,
  } = useVault();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-500/15 bg-[#100D25]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'dashboard')}
            className="group flex items-center gap-2.5 text-left text-white transition-opacity hover:opacity-90"
            aria-label="ClientVault Home"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-amber-400 p-[1px] shadow-lg shadow-purple-500/25">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#14102E]">
                <FolderLock className="h-5 w-5 text-purple-300 transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">
                Client<span className="text-gradient-highlight">Vault</span>
              </span>
            </div>
          </button>

          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-0.5 text-[10px] font-mono font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firebase Cloud Live (rakib-protfolio)</span>
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links or Dashboard Search */}
        {isLanding ? (
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#features" className="whitespace-nowrap transition-colors hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="whitespace-nowrap transition-colors hover:text-white">
              How It Works
            </a>
            <a href="#projects" className="whitespace-nowrap transition-colors hover:text-white">
              Client Projects
            </a>
            <a href="#pricing" className="whitespace-nowrap transition-colors hover:text-white">
              Pricing
            </a>
          </nav>
        ) : (
          <div className="hidden max-w-md flex-1 items-center md:flex">
            <div
              className={`relative flex w-full items-center rounded-full border transition-all ${
                searchFocused
                  ? 'border-purple-400/60 bg-[#1B1638] shadow-lg shadow-purple-500/15'
                  : 'border-purple-500/20 bg-[#161233]/70 hover:border-purple-400/30'
              }`}
            >
              <Search className="ml-4 h-4 w-4 text-purple-300/70" />
              <input
                type="text"
                placeholder="Search files, client projects, extensions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-purple-200/40 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 text-xs text-purple-300/60 hover:text-white"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Quick Upload Button */}
              <button
                onClick={() => setUploadModalOpen(true)}
                className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02] hover:shadow-purple-500/50 sm:flex"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload Files</span>
              </button>

              {/* Notification Center */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileMenuOpen(false);
                  }}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-purple-500/25 bg-[#1B1638] text-purple-200 transition-colors hover:border-purple-400 hover:text-white"
                  aria-label="View notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm shadow-pink-500/60">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="glass-panel absolute right-0 mt-3 w-80 rounded-2xl p-4 shadow-2xl shadow-black/60 z-50 animate-in fade-in zoom-in-95">
                    <div className="mb-3 flex items-center justify-between border-b border-purple-500/15 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-xs text-purple-300">({unreadCount} new)</span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                        >
                          <CheckCheck className="h-3 w-3" />
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="py-4 text-center text-xs text-purple-300/50">No notifications yet</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`cursor-pointer rounded-xl p-2.5 transition-colors ${
                              notif.read ? 'bg-purple-950/20 text-slate-400' : 'bg-purple-900/30 text-white'
                            } hover:bg-purple-800/40`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-semibold text-purple-200">{notif.title}</span>
                              <span className="text-[10px] text-purple-300/60">{notif.timestamp}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-300/90">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileMenuOpen(!profileMenuOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-purple-500/25 bg-[#1B1638] p-1 pr-3 transition-colors hover:border-purple-400"
                  aria-label="User account menu"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-xs font-bold text-white">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate text-xs font-medium text-white sm:max-w-none">
                    {user.name}
                  </span>
                  <ChevronDown className="h-3 w-3 text-purple-300" />
                </button>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="glass-panel absolute right-0 mt-3 w-56 rounded-2xl p-2 shadow-2xl shadow-black/60 z-50 animate-in fade-in zoom-in-95">
                    <div className="border-b border-purple-500/15 p-2.5">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="truncate text-[11px] text-purple-300/70">{user.email}</p>
                      <span className="mt-1.5 inline-block text-[10px] font-semibold text-amber-300">
                        {user.plan} Plan · 50 GB Vault
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentView('settings');
                          setProfileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-purple-200 transition-colors hover:bg-purple-900/30 hover:text-white"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        Account Settings
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('help');
                          setProfileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-purple-200 transition-colors hover:bg-purple-900/30 hover:text-white"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Help &amp; Security
                      </button>
                    </div>

                    <div className="border-t border-purple-500/15 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-pink-400 transition-colors hover:bg-pink-950/30 hover:text-pink-300"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAuth}
                className="rounded-full px-4 py-2 text-xs font-medium text-purple-200 transition-colors hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.03] hover:shadow-purple-500/50"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
