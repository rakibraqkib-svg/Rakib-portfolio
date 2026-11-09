import { FileCategory, FileItem, ShareLink } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const idx = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, idx)).toFixed(dm))} ${sizes[idx]}`;
}

export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase() || '';
}

export function getFileCategory(fileName: string): FileCategory {
  const ext = getFileExtension(fileName);
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webp':
    case 'bmp':
    case 'tiff':
    case 'ico':
      return 'image';
    case 'mp4':
    case 'mov':
    case 'avi':
    case 'mkv':
    case 'webm':
    case 'm4v':
      return 'video';
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
    case 'rtf':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
    case 'csv':
      return 'document';
    case 'psd':
    case 'ai':
    case 'fig':
    case 'xd':
    case 'sketch':
    case 'blend':
    case 'obj':
    case 'fbx':
      return 'design';
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return 'archive';
    case 'mp3':
    case 'wav':
    case 'aac':
    case 'flac':
    case 'ogg':
      return 'audio';
    default:
      return 'other';
  }
}

export interface FilterOptions {
  search?: string;
  category?: string;
  projectId?: string;
  isFavorite?: boolean;
  isTrash?: boolean;
}

export function filterFiles(files: FileItem[], filters: FilterOptions): FileItem[] {
  return files.filter((file) => {
    // Trash filter: if isTrash filter is explicitly true, show only trash; otherwise exclude trash
    if (filters.isTrash === true) {
      if (!file.isTrash) return false;
    } else {
      if (file.isTrash) return false;
    }

    if (filters.isFavorite && !file.isFavorite) {
      return false;
    }

    if (filters.projectId && file.projectId !== filters.projectId) {
      return false;
    }

    if (filters.category && filters.category !== 'all' && file.category !== filters.category) {
      return false;
    }

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const matchName = file.name.toLowerCase().includes(q);
      const matchProject = file.projectName?.toLowerCase().includes(q);
      const matchType = file.type.toLowerCase().includes(q);
      if (!matchName && !matchProject && !matchType) {
        return false;
      }
    }

    return true;
  });
}

export function sortFiles(
  files: FileItem[],
  sortBy: 'name' | 'size' | 'date',
  direction: 'asc' | 'desc' = 'desc'
): FileItem[] {
  const sorted = [...files];
  const mult = direction === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name) * mult;
    }
    if (sortBy === 'size') {
      return (a.size - b.size) * mult;
    }
    if (sortBy === 'date') {
      return (new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()) * mult;
    }
    return 0;
  });

  return sorted;
}

export function calculateStorageStats(files: FileItem[], storageLimit: number) {
  const activeFiles = files.filter((f) => !f.isTrash);
  const totalUsed = activeFiles.reduce((acc, f) => acc + f.size, 0);
  const percentage = Math.min(100, Math.round((totalUsed / (storageLimit || 1)) * 100));

  const byCategory: Record<FileCategory, { count: number; bytes: number }> = {
    image: { count: 0, bytes: 0 },
    video: { count: 0, bytes: 0 },
    document: { count: 0, bytes: 0 },
    design: { count: 0, bytes: 0 },
    archive: { count: 0, bytes: 0 },
    audio: { count: 0, bytes: 0 },
    other: { count: 0, bytes: 0 },
  };

  for (const file of activeFiles) {
    if (byCategory[file.category]) {
      byCategory[file.category].count += 1;
      byCategory[file.category].bytes += file.size;
    }
  }

  return {
    totalUsed,
    storageLimit,
    percentage,
    remaining: Math.max(0, storageLimit - totalUsed),
    byCategory,
  };
}

export function validateShareAccess(
  link: ShareLink,
  providedPassword?: string
): { allowed: boolean; reason?: 'expired' | 'revoked' | 'password_required' | 'invalid_password' } {
  if (link.isRevoked) {
    return { allowed: false, reason: 'revoked' };
  }

  if (link.expiresAt && new Date(link.expiresAt).getTime() < Date.now()) {
    return { allowed: false, reason: 'expired' };
  }

  if (link.hasPassword) {
    if (!providedPassword || providedPassword.trim() === '') {
      return { allowed: false, reason: 'password_required' };
    }
    if (link.password && link.password !== providedPassword) {
      return { allowed: false, reason: 'invalid_password' };
    }
  }

  return { allowed: true };
}

export function generateToken(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
