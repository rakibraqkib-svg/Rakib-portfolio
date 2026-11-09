import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Building,
  KeyRound,
  Bell,
  HardDrive,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatBytes } from '../../utils/vaultLogic';

export const SettingsView: React.FC = () => {
  const { user, updateProfile, files } = useVault();

  const [name, setName] = useState(user?.name || 'Rakib');
  const [email, setEmail] = useState(user?.email || 'raqkibrony@gmail.com');
  const [agencyName, setAgencyName] = useState(user?.agencyName || 'Neomathic Studios');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Notifications
  const [notifyDownloads, setNotifyDownloads] = useState(true);
  const [notifyViews, setNotifyViews] = useState(true);
  const [notifyStorage, setNotifyStorage] = useState(true);

  const activeFiles = files.filter((f) => !f.isTrash);
  const totalBytes = activeFiles.reduce((acc, f) => acc + f.size, 0);
  const storageLimit = user?.storageLimit || 53687091200;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      agencyName,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">Account Settings &amp; Vault Profile</h1>
        <p className="text-xs text-purple-200/60">
          Manage your freelancer credentials, client notification triggers, and encrypted storage
        </p>
      </div>

      {/* Profile Form */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/20">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <UserIcon className="h-4 w-4 text-purple-400" />
          Freelancer Profile Details
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-300 mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-purple-400" /> Agency / Studio Brand Name
            </label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
              placeholder="e.g., Neomathic Creative Lab"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-in fade-in">
                <Check className="h-4 w-4" /> Profile updated successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="rounded-xl bg-purple-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-purple-500 transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Storage Tier Information */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-fuchsia-400" />
            Storage Plan &amp; Vault Allocation
          </h2>
          <span className="rounded-full bg-purple-600/30 border border-purple-400/50 px-3 py-0.5 text-xs font-semibold text-purple-300">
            {user?.plan || 'Pro'} Plan
          </span>
        </div>

        <div className="rounded-2xl bg-purple-950/30 p-4 border border-purple-500/15">
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-slate-300">Used: {formatBytes(totalBytes)}</span>
            <span className="text-purple-300 font-semibold">Limit: {formatBytes(storageLimit)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-purple-950 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400"
              style={{ width: `${Math.min(100, (totalBytes / storageLimit) * 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl border border-purple-500/10 bg-purple-950/20 p-3">
            <h4 className="font-bold text-white">Starter</h4>
            <p className="text-purple-300/60 font-mono mt-0.5">10 GB Storage</p>
            <span className="text-[10px] text-slate-400 mt-2 block">For individual solos</span>
          </div>
          <div className="rounded-xl border border-purple-400/40 bg-purple-900/30 p-3 ring-1 ring-purple-400/30">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-white">Pro Vault</h4>
              <span className="text-[10px] font-semibold text-amber-300 uppercase">Active</span>
            </div>
            <p className="text-purple-300 font-mono mt-0.5">50 GB Storage</p>
            <span className="text-[10px] text-slate-300 mt-2 block">Full password links &amp; 4K stream</span>
          </div>
          <div className="rounded-xl border border-purple-500/10 bg-purple-950/20 p-3">
            <h4 className="font-bold text-white">Agency Unlimited</h4>
            <p className="text-purple-300/60 font-mono mt-0.5">2 TB Dedicated</p>
            <span className="text-[10px] text-slate-400 mt-2 block">Custom domain &amp; team roles</span>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/20">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <KeyRound className="h-4 w-4 text-amber-400" />
          Security &amp; Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-300 mb-1 block">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 mb-1 block">New Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 mb-1 block">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-xs text-pink-400 font-medium">{passwordError}</p>
          )}

          {passwordSuccess && (
            <p className="text-xs text-emerald-400 font-medium">
              Password updated successfully!
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl border border-purple-400/40 bg-purple-900/30 px-5 py-2 font-semibold text-purple-200 hover:bg-purple-800/40 hover:text-white"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Notifications Preferences */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/20">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-cyan-400" />
          Client Activity Alerts
        </h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between rounded-xl bg-purple-950/20 p-3 border border-purple-500/10 cursor-pointer">
            <div>
              <p className="font-semibold text-white">Client Download Notifications</p>
              <p className="text-[11px] text-purple-300/60">
                Receive instant alert when a client retrieves a delivered file
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyDownloads}
              onChange={(e) => setNotifyDownloads(e.target.checked)}
              className="h-4 w-4 rounded border-purple-400 text-purple-600 focus:ring-purple-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl bg-purple-950/20 p-3 border border-purple-500/10 cursor-pointer">
            <div>
              <p className="font-semibold text-white">Client Portal Views</p>
              <p className="text-[11px] text-purple-300/60">
                Notify when a client opens and inspects a secure shared link
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyViews}
              onChange={(e) => setNotifyViews(e.target.checked)}
              className="h-4 w-4 rounded border-purple-400 text-purple-600 focus:ring-purple-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl bg-purple-950/20 p-3 border border-purple-500/10 cursor-pointer">
            <div>
              <p className="font-semibold text-white">Storage Threshold Alerts</p>
              <p className="text-[11px] text-purple-300/60">
                Alert when vault reaches 80% and 95% capacity
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyStorage}
              onChange={(e) => setNotifyStorage(e.target.checked)}
              className="h-4 w-4 rounded border-purple-400 text-purple-600 focus:ring-purple-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
