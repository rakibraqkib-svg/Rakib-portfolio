export type FileCategory = 'image' | 'video' | 'document' | 'design' | 'archive' | 'audio' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  agencyName: string;
  plan: 'Starter' | 'Pro' | 'Agency';
  storageUsed: number; // in bytes
  storageLimit: number; // in bytes
  createdAt: string;
}

export interface FileItem {
  id: string;
  userId: string;
  projectId?: string;
  projectName?: string;
  name: string;
  type: string; // extension e.g. 'png', 'pdf', 'mp4'
  category: FileCategory;
  size: number; // in bytes
  url: string;
  previewUrl?: string;
  uploadDate: string;
  isFavorite: boolean;
  isTrash: boolean;
  sharedCount: number;
  clientViews: number;
  downloadCount: number;
  description?: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  clientName: string;
  clientEmail: string;
  description: string;
  color: string;
  status: 'active' | 'in-review' | 'completed';
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  totalSize: number;
}

export interface ShareLink {
  id: string;
  fileId: string;
  fileName: string;
  ownerId: string;
  ownerName: string;
  token: string;
  hasPassword: boolean;
  password?: string;
  expiresAt: string | null; // ISO string or null for never
  allowDownload: boolean;
  viewsCount: number;
  downloadsCount: number;
  createdAt: string;
  isRevoked: boolean;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'share' | 'download' | 'upload' | 'security' | 'project';
  timestamp: string;
  read: boolean;
}

export interface ActivityLog {
  id: string;
  projectId?: string;
  projectName?: string;
  action: string;
  fileName?: string;
  clientName?: string;
  timestamp: string;
}

export type DashboardView =
  | 'dashboard'
  | 'files'
  | 'projects'
  | 'project-detail'
  | 'shared'
  | 'favorites'
  | 'trash'
  | 'settings'
  | 'help';
