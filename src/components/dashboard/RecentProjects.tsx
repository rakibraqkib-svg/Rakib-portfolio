import React from 'react';
import { Briefcase, ArrowRight, FolderGit2, Users, FileStack } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { formatBytes } from '../../utils/vaultLogic';

export const RecentProjects: React.FC = () => {
  const { projects, setCurrentView, setSelectedProjectId, setCreateProjectModalOpen } = useVault();

  const handleOpenProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentView('project-detail');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Active Client Projects</h2>
          <p className="text-xs text-purple-200/60">Organized asset libraries per client</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateProjectModalOpen(true)}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300"
          >
            + New Project
          </button>
          <button
            onClick={() => setCurrentView('projects')}
            className="flex items-center gap-1 text-xs font-semibold text-white hover:text-purple-200"
          >
            View All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {projects.slice(0, 4).map((project) => (
          <div
            key={project.id}
            onClick={() => handleOpenProject(project.id)}
            className="glass-card group flex cursor-pointer flex-col justify-between rounded-2xl p-5 hover:border-purple-400/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl p-0.5 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${project.color}, #1B1638)`,
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#14102E]">
                    <Briefcase className="h-4 w-4" style={{ color: project.color }} />
                  </div>
                </div>

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
              </div>

              <h3 className="mt-4 text-sm font-bold text-white transition-colors group-hover:text-purple-200 line-clamp-1">
                {project.name}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-purple-200/70">
                <Users className="h-3 w-3 text-purple-400" />
                <span className="truncate">{project.clientName}</span>
              </p>
              <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                {project.description}
              </p>
            </div>

            <div className="mt-5 border-t border-purple-500/10 pt-3 flex items-center justify-between text-xs text-purple-200/60 font-mono">
              <span className="flex items-center gap-1">
                <FileStack className="h-3.5 w-3.5 text-purple-400" />
                {project.fileCount} files
              </span>
              <span>{formatBytes(project.totalSize)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
