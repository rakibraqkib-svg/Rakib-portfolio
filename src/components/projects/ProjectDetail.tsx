import React, { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Users,
  Mail,
  UploadCloud,
  FileStack,
  Calendar,
  Clock,
  History,
  Trash2,
  Edit2,
  Share2,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { FileList } from '../files/FileList';
import { formatBytes } from '../../utils/vaultLogic';

export const ProjectDetail: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    setCurrentView,
    setUploadModalOpen,
    deleteProject,
    activityLogs,
    files,
  } = useVault();

  const project = projects.find((p) => p.id === selectedProjectId);

  if (!project) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center">
        <p className="text-sm text-purple-300">Project not found.</p>
        <button
          onClick={() => setCurrentView('projects')}
          className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const projectFiles = files.filter((f) => f.projectId === project.id && !f.isTrash);
  const projectLogs = activityLogs.filter((l) => l.projectId === project.id || l.projectName === project.name);

  return (
    <div className="space-y-6">
      {/* Top back navigation & action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setSelectedProjectId(null);
            setCurrentView('projects');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-purple-300 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Workspaces</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:scale-[1.02]"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload into Project</span>
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete project "${project.name}"? Files will remain in unassigned vault.`)) {
                deleteProject(project.id);
              }
            }}
            className="rounded-xl border border-pink-500/25 p-2 text-pink-400 hover:bg-pink-950/30"
            title="Delete project"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/20">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl p-0.5 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${project.color}, #1A1435)`,
              }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#14102E]">
                <Briefcase className="h-6 w-6" style={{ color: project.color }} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-white">{project.name}</h1>
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

              <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-purple-200/80">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-purple-400" />
                  Client: <strong>{project.clientName}</strong>
                </span>
                {project.clientEmail && (
                  <span className="flex items-center gap-1.5 text-purple-300/60">
                    <Mail className="h-3.5 w-3.5 text-purple-400" />
                    {project.clientEmail}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-purple-300/60 font-mono">
                  <Calendar className="h-3.5 w-3.5 text-purple-400" />
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-300 leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-purple-950/40 p-3.5 border border-purple-500/15 font-mono text-xs">
            <div className="text-center px-3">
              <span className="text-[10px] text-purple-300/60 uppercase">Files</span>
              <p className="text-sm font-bold text-white mt-0.5">{projectFiles.length}</p>
            </div>
            <div className="h-8 w-px bg-purple-500/20" />
            <div className="text-center px-3">
              <span className="text-[10px] text-purple-300/60 uppercase">Total Size</span>
              <p className="text-sm font-bold text-white mt-0.5">
                {formatBytes(projectFiles.reduce((acc, f) => acc + f.size, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Strip */}
      {projectLogs.length > 0 && (
        <div className="rounded-2xl border border-purple-500/15 bg-purple-950/20 p-4">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
            <History className="h-3.5 w-3.5 text-purple-400" />
            Recent Client Activity
          </h3>
          <div className="flex flex-wrap gap-3">
            {projectLogs.slice(0, 3).map((log) => (
              <div
                key={log.id}
                className="rounded-xl bg-purple-900/30 px-3 py-1.5 text-xs text-slate-300 border border-purple-500/10 flex items-center gap-2"
              >
                <span className="text-purple-400 font-semibold">{log.action}:</span>
                <span className="truncate max-w-xs">{log.fileName || log.clientName || 'Workspace updated'}</span>
                <span className="text-[10px] text-purple-300/50 font-mono">({log.timestamp})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dedicated Project File Library */}
      <div className="pt-2">
        <FileList
          projectId={project.id}
          title={`${project.clientName} Deliverables`}
          subtitle={`Organized assets and client-ready review files for ${project.name}`}
        />
      </div>
    </div>
  );
};
