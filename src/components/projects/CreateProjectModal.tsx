import React, { useState } from 'react';
import { X, Briefcase, User, Mail, FileText, Palette } from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const CreateProjectModal: React.FC = () => {
  const {
    createProjectModalOpen,
    setCreateProjectModalOpen,
    createProject,
    setSelectedProjectId,
    setCurrentView,
  } = useVault();

  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#A78BFA');

  if (!createProjectModalOpen) return null;

  const colorPalette = ['#A78BFA', '#E879F9', '#FFB86B', '#38BDF8', '#34D399', '#F43F5E'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientName.trim()) return;

    const newProj = await createProject({
      name,
      clientName,
      clientEmail,
      description,
      color,
    });

    setCreateProjectModalOpen(false);
    setName('');
    setClientName('');
    setClientEmail('');
    setDescription('');
    setSelectedProjectId(newProj.id);
    setCurrentView('project-detail');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel relative w-full max-w-lg rounded-3xl border border-purple-500/25 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-purple-500/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/30 text-purple-300">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">New Client Workspace</h2>
              <p className="text-xs text-purple-200/60">Organize and deliver client-specific assets</p>
            </div>
          </div>
          <button
            onClick={() => setCreateProjectModalOpen(false)}
            className="rounded-full p-1.5 text-purple-300 hover:bg-purple-900/40 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 mb-1.5 block">
              Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Acme Global Brand Identity"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input w-full rounded-xl px-3 py-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <User className="h-3 w-3 text-purple-400" /> Client Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Acme Corporation"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="glass-input w-full rounded-xl px-3 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Mail className="h-3 w-3 text-purple-400" /> Client Contact Email
              </label>
              <input
                type="email"
                placeholder="client@acmecorp.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="glass-input w-full rounded-xl px-3 py-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <FileText className="h-3 w-3 text-purple-400" /> Project Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of deliverables, guidelines, or scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-input w-full rounded-xl px-3 py-2 text-white resize-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Palette className="h-3 w-3 text-purple-400" /> Accent Color Theme
            </label>
            <div className="flex items-center gap-3">
              {colorPalette.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#100D25]' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-purple-500/15 pt-4">
            <button
              type="button"
              onClick={() => setCreateProjectModalOpen(false)}
              className="rounded-xl border border-purple-500/25 px-4 py-2 text-purple-200 hover:bg-purple-900/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 px-5 py-2 font-bold text-white shadow-lg shadow-purple-600/30 hover:scale-[1.02]"
            >
              Create Client Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
