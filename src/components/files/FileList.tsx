import React, { useState } from 'react';
import {
  Grid,
  List as ListIcon,
  Search,
  Filter,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Star,
  Eye,
  Edit2,
  FolderInput,
  CheckSquare,
  Square,
  FileText,
  Image as ImageIcon,
  Video,
  Palette,
  Archive,
  Music,
  FileCode,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { FileItem, FileCategory } from '../../types';
import { formatBytes, filterFiles, sortFiles } from '../../utils/vaultLogic';

interface FileListProps {
  initialCategory?: string;
  projectId?: string;
  isFavoriteFilter?: boolean;
  isTrashFilter?: boolean;
  title?: string;
  subtitle?: string;
}

export const FileList: React.FC<FileListProps> = ({
  initialCategory = 'all',
  projectId,
  isFavoriteFilter,
  isTrashFilter = false,
  title = 'My Files',
  subtitle = 'Manage, organize and secure your creative files',
}) => {
  const {
    files,
    searchQuery,
    setSearchQuery,
    setPreviewFile,
    setShareModalFile,
    toggleFavorite,
    deleteFile,
    restoreFile,
    renameFile,
    moveFileToProject,
    downloadFile,
    projects,
    setUploadModalOpen,
  } = useVault();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [actionMenuFileId, setActionMenuFileId] = useState<string | null>(null);
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameInputValue, setRenameInputValue] = useState('');
  const [movingFileId, setMovingFileId] = useState<string | null>(null);

  // Filter & sort files
  const filtered = filterFiles(files, {
    search: searchQuery,
    category: selectedCategory,
    projectId,
    isFavorite: isFavoriteFilter,
    isTrash: isTrashFilter,
  });

  const sortedFiles = sortFiles(filtered, sortBy, sortDirection);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Files' },
    { key: 'design', label: 'Design & UI' },
    { key: 'image', label: 'Images' },
    { key: 'video', label: 'Video & Motion' },
    { key: 'document', label: 'Documents' },
    { key: 'archive', label: 'Archives' },
  ];

  const handleSelectAll = () => {
    if (selectedFileIds.length === sortedFiles.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(sortedFiles.map((f) => f.id));
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedFileIds.includes(id)) {
      setSelectedFileIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedFileIds((prev) => [...prev, id]);
    }
  };

  const handleBulkDownload = () => {
    const selected = files.filter((f) => selectedFileIds.includes(f.id));
    selected.forEach((f) => downloadFile(f));
  };

  const handleBulkDelete = () => {
    if (confirm(`Move ${selectedFileIds.length} file(s) to trash?`)) {
      selectedFileIds.forEach((id) => deleteFile(id));
      setSelectedFileIds([]);
    }
  };

  const handleStartRename = (file: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingFileId(file.id);
    setRenameInputValue(file.name);
    setActionMenuFileId(null);
  };

  const handleSaveRename = (fileId: string) => {
    if (renameInputValue.trim()) {
      renameFile(fileId, renameInputValue);
    }
    setRenamingFileId(null);
  };

  const getFileBadge = (type: string, category: FileCategory) => {
    const ext = type.toUpperCase();
    switch (category) {
      case 'design':
        return { bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300', icon: <Palette className="h-4 w-4" /> };
      case 'image':
        return { bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300', icon: <ImageIcon className="h-4 w-4" /> };
      case 'video':
        return { bg: 'bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300', icon: <Video className="h-4 w-4" /> };
      case 'document':
        return { bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300', icon: <FileText className="h-4 w-4" /> };
      case 'archive':
        return { bg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300', icon: <Archive className="h-4 w-4" /> };
      case 'audio':
        return { bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300', icon: <Music className="h-4 w-4" /> };
      default:
        return { bg: 'bg-slate-500/15 border-slate-500/30 text-slate-300', icon: <FileCode className="h-4 w-4" /> };
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
          <p className="text-xs text-purple-200/60">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center rounded-xl border border-purple-500/20 bg-[#161233] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-300 hover:text-white'
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-300 hover:text-white'
              }`}
              aria-label="List view"
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Sort selector */}
          <select
            value={`${sortBy}-${sortDirection}`}
            onChange={(e) => {
              const [sb, sd] = e.target.value.split('-') as ['date' | 'name' | 'size', 'asc' | 'desc'];
              setSortBy(sb);
              setSortDirection(sd);
            }}
            className="glass-input rounded-xl px-3 py-2 text-xs text-purple-200"
          >
            <option value="date-desc" className="bg-[#1B1638]">Newest First</option>
            <option value="date-asc" className="bg-[#1B1638]">Oldest First</option>
            <option value="name-asc" className="bg-[#1B1638]">Name (A-Z)</option>
            <option value="name-desc" className="bg-[#1B1638]">Name (Z-A)</option>
            <option value="size-desc" className="bg-[#1B1638]">Largest Size</option>
            <option value="size-asc" className="bg-[#1B1638]">Smallest Size</option>
          </select>

          {!isTrashFilter && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:opacity-90"
            >
              + Upload File
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-purple-500/15 pb-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat.key
                  ? 'bg-purple-600/30 text-white border border-purple-400/50 shadow-sm'
                  : 'text-purple-200/70 hover:bg-purple-900/20 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Bulk Actions if items selected */}
        {selectedFileIds.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-purple-950/70 px-3 py-1.5 border border-purple-500/30 animate-in fade-in">
            <span className="text-xs text-purple-200 font-mono">
              {selectedFileIds.length} selected
            </span>
            <button
              onClick={handleBulkDownload}
              className="flex items-center gap-1 rounded-md bg-purple-600/40 px-2 py-1 text-[11px] font-semibold text-white hover:bg-purple-600/60"
            >
              <Download className="h-3 w-3" /> Download
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 rounded-md bg-pink-600/30 px-2 py-1 text-[11px] font-semibold text-pink-300 hover:bg-pink-600/50"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Files Display */}
      {sortedFiles.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-950/40 text-purple-400">
            <FolderInput className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">No files found</h3>
          <p className="mt-1 max-w-sm text-xs text-purple-200/60">
            {searchQuery
              ? `No files matching "${searchQuery}". Try adjusting your keywords.`
              : 'Upload project files to organize, secure, and share with your clients.'}
          </p>
          {!isTrashFilter && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="mt-5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:scale-105"
            >
              Upload First Asset
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedFiles.map((file) => {
            const badge = getFileBadge(file.type, file.category);
            const isSelected = selectedFileIds.includes(file.id);

            return (
              <div
                key={file.id}
                onClick={() => setPreviewFile(file)}
                className={`glass-card group relative flex flex-col justify-between rounded-2xl p-4 cursor-pointer ${
                  isSelected ? 'border-purple-400 ring-1 ring-purple-400/50 bg-purple-900/30' : ''
                }`}
              >
                <div>
                  {/* Card Header: select checkbox, file type badge, more menu */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => handleToggleSelect(file.id, e)}
                      className="text-purple-300 hover:text-white"
                      aria-label="Select file"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-purple-400" />
                      ) : (
                        <Square className="h-4 w-4 text-purple-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>

                    <div
                      className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-mono font-semibold uppercase border ${badge.bg}`}
                    >
                      {badge.icon}
                      <span>{file.type}</span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionMenuFileId(actionMenuFileId === file.id ? null : file.id);
                        }}
                        className="rounded-lg p-1 text-purple-300 hover:bg-purple-900/40 hover:text-white"
                        aria-label="File actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {actionMenuFileId === file.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="glass-panel absolute right-0 mt-1 w-44 rounded-xl p-1.5 shadow-2xl z-40 animate-in fade-in"
                        >
                          <button
                            onClick={() => {
                              setPreviewFile(file);
                              setActionMenuFileId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-purple-200 hover:bg-purple-900/30 hover:text-white"
                          >
                            <Eye className="h-3.5 w-3.5" /> Preview
                          </button>
                          {!file.isTrash && (
                            <button
                              onClick={() => {
                                setShareModalFile(file);
                                setActionMenuFileId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-purple-200 hover:bg-purple-900/30 hover:text-white"
                            >
                              <Share2 className="h-3.5 w-3.5" /> Share with Client
                            </button>
                          )}
                          <button
                            onClick={() => {
                              downloadFile(file);
                              setActionMenuFileId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-purple-200 hover:bg-purple-900/30 hover:text-white"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
                          </button>
                          <button
                            onClick={(e) => handleStartRename(file, e)}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-purple-200 hover:bg-purple-900/30 hover:text-white"
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Rename
                          </button>
                          <button
                            onClick={() => {
                              toggleFavorite(file.id);
                              setActionMenuFileId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-purple-200 hover:bg-purple-900/30 hover:text-white"
                          >
                            <Star className={`h-3.5 w-3.5 ${file.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                            {file.isFavorite ? 'Unfavorite' : 'Favorite'}
                          </button>
                          <div className="border-t border-purple-500/15 my-1" />
                          {file.isTrash ? (
                            <button
                              onClick={() => {
                                restoreFile(file.id);
                                setActionMenuFileId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 hover:bg-emerald-950/30"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (confirm(`Move "${file.name}" to trash?`)) {
                                  deleteFile(file.id);
                                }
                                setActionMenuFileId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-pink-400 hover:bg-pink-950/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Move to Trash
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail / Visual Area */}
                  <div className="mt-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl bg-purple-950/30 border border-purple-500/10">
                    {file.previewUrl ? (
                      <img
                        src={file.previewUrl}
                        alt={file.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1 text-purple-300/60">
                        {badge.icon}
                        <span className="font-mono text-[10px] tracking-wider uppercase">{file.type}</span>
                      </div>
                    )}
                  </div>

                  {/* File Name & Project */}
                  <div className="mt-3">
                    {renamingFileId === file.id ? (
                      <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1">
                        <input
                          type="text"
                          value={renameInputValue}
                          onChange={(e) => setRenameInputValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(file.id)}
                          autoFocus
                          className="glass-input rounded px-1.5 py-0.5 text-xs text-white w-full"
                        />
                        <button
                          onClick={() => handleSaveRename(file.id)}
                          className="text-[10px] bg-purple-600 px-2 py-1 rounded text-white"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                        {file.name}
                      </h4>
                    )}
                    <p className="text-[11px] text-purple-300/60 truncate mt-0.5">
                      {file.projectName || 'Unassigned Workspace'}
                    </p>
                  </div>
                </div>

                {/* Footer Meta */}
                <div className="mt-4 pt-3 border-t border-purple-500/10 flex items-center justify-between text-[11px] text-purple-300/70 font-mono">
                  <span>{formatBytes(file.size)}</span>
                  <div className="flex items-center gap-2">
                    {file.isFavorite && (
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    )}
                    {file.sharedCount > 0 && (
                      <span className="flex items-center gap-0.5 text-purple-400" title="Active share link">
                        <Share2 className="h-3 w-3" />
                        <span>{file.sharedCount}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="glass-panel overflow-hidden rounded-2xl border border-purple-500/15">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-purple-500/15 bg-purple-950/40 text-purple-300/80">
              <tr>
                <th className="py-3 px-4 w-10">
                  <button onClick={handleSelectAll} aria-label="Select all files">
                    {selectedFileIds.length === sortedFiles.length && sortedFiles.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-purple-400" />
                    ) : (
                      <Square className="h-4 w-4 text-purple-400/40" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold hidden sm:table-cell">Project</th>
                <th className="py-3 px-4 font-semibold hidden md:table-cell">Size</th>
                <th className="py-3 px-4 font-semibold hidden lg:table-cell">Uploaded</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {sortedFiles.map((file) => {
                const badge = getFileBadge(file.type, file.category);
                const isSelected = selectedFileIds.includes(file.id);

                return (
                  <tr
                    key={file.id}
                    onClick={() => setPreviewFile(file)}
                    className={`cursor-pointer transition-colors hover:bg-purple-900/20 ${
                      isSelected ? 'bg-purple-900/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => handleToggleSelect(file.id, e)} aria-label="Select file">
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-purple-400" />
                        ) : (
                          <Square className="h-4 w-4 text-purple-400/40" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg border ${badge.bg}`}>
                          {badge.icon}
                        </div>
                        <div className="truncate max-w-xs sm:max-w-md">
                          <p className="font-semibold text-white truncate">{file.name}</p>
                          <span className="text-[10px] font-mono uppercase text-purple-300/60 sm:hidden">
                            {formatBytes(file.size)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-purple-200/70 hidden sm:table-cell truncate max-w-xs">
                      {file.projectName || '—'}
                    </td>

                    <td className="py-3 px-4 font-mono text-purple-300 hidden md:table-cell">
                      {formatBytes(file.size)}
                    </td>

                    <td className="py-3 px-4 text-purple-300/60 font-mono hidden lg:table-cell">
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleFavorite(file.id)}
                          className="p-1.5 text-purple-300 hover:text-amber-300"
                          title="Favorite"
                        >
                          <Star className={`h-3.5 w-3.5 ${file.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                        {!file.isTrash && (
                          <button
                            onClick={() => setShareModalFile(file)}
                            className="p-1.5 text-purple-300 hover:text-white"
                            title="Share Link"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => downloadFile(file)}
                          className="p-1.5 text-purple-300 hover:text-white"
                          title="Download"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Move "${file.name}" to trash?`)) {
                              deleteFile(file.id);
                            }
                          }}
                          className="p-1.5 text-pink-400 hover:text-pink-300"
                          title="Trash"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
