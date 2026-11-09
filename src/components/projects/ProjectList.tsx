import React from 'react';
import {
  Briefcase,
  Plus,
  Users,
  FileStack,
  HardDrive,
  Calendar,
  MoreVertical,
  ExternalLink,
  Trash2,
  Edit2,
  FolderGit2,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatBytes } from '../../utils/vaultLogic';

export const ProjectList: React.FC = () => {
  const {
    projects,
    setSelectedProjectId,
    setCurrentView,
    setCreateProjectModalOpen,
    deleteProject,
  } = useVault();

  const handleOpenDetail = (id: string) => {
    setSelectedProjectId(id);
    setCurrentView('project-detail');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Client Projects</h1>
          <p className="text-xs text-purple-200/60">
            Dedicated secure workspaces organized by client account
          </p>
        </div>
        <button
          onClick={() => setCreateProjectModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          <span>New Client Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-purple-400/60" />
          <h3 className="mt-4 text-base font-bold text-white">No projects yet</h3>
          <p className="mt-1 text-xs text-purple-200/60">
            Create your first client workspace to start organizing deliverables.
          </p>
          <button
            onClick={() => setCreateProjectModalOpen(true)}
            className="mt-5 rounded-full bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500"
          >
            Create Workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleOpenDetail(project.id)}
              className="glass-card group flex cursor-pointer flex-col justify-between rounded-2xl p-6 transition-all hover:scale-[1.01]"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl p-0.5 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${project.color}, #1A1435)`,
                    }}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#14102E]">
                      <Briefcase className="h-5 w-5" style={{ color: project.color }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize"
                      style={{
                        backgroundColor: `${project.color}20`,
                        color: project.color,
                        border: `1px solid ${project.color}40`,
                      }}
                    >
                      {project.status.replace('-', ' ')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete project "${project.name}"? Files will remain in unassigned vault.`)) {
                          deleteProject(project.id);
                        }
                      }}
                      className="rounded-lg p-1 text-purple-300/60 hover:text-pink-400"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Title & Client */}
                <h3 className="mt-4 text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {project.name}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-xs text-purple-200/80">
                  <Users className="h-3.5 w-3.5 text-purple-400" />
                  <span className="font-medium">{project.clientName}</span>
                  {project.clientEmail && (
                    <span className="text-[11px] text-purple-300/50 truncate">
                      · {project.clientEmail}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-300/80 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Meta Stats Footer */}
              <div className="mt-6 border-t border-purple-500/15 pt-4 flex items-center justify-between text-xs font-mono text-purple-300/70">
                <span className="flex items-center gap-1.5">
                  <FileStack className="h-3.5 w-3.5 text-purple-400" />
                  {project.fileCount} {project.fileCount === 1 ? 'file' : 'files'}
                </span>
                <span>{formatBytes(project.totalSize)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
