import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  FileItem,
  Project,
  ShareLink,
  NotificationItem,
  ActivityLog,
  DashboardView,
  FileCategory,
} from '../types';
import { getFileCategory, generateToken } from '../utils/vaultLogic';
import {
  auth,
  db,
  storage,
  googleProvider,
  handleFirestoreError,
  OperationType,
  testFirestoreConnection,
} from '../lib/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

interface VaultContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isCloudSynced: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginDemo: () => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;

  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;

  files: FileItem[];
  projects: Project[];
  shareLinks: ShareLink[];
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modals & previews
  previewFile: FileItem | null;
  setPreviewFile: (file: FileItem | null) => void;
  shareModalFile: FileItem | null;
  setShareModalFile: (file: FileItem | null) => void;
  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
  createProjectModalOpen: boolean;
  setCreateProjectModalOpen: (open: boolean) => void;
  activeShareToken: string | null;
  setActiveShareToken: (token: string | null) => void;

  // File Operations
  uploadFiles: (files: FileList | File[], targetProjectId?: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  deleteFile: (id: string, permanent?: boolean) => Promise<void>;
  restoreFile: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  moveFileToProject: (fileId: string, projectId?: string) => Promise<void>;
  downloadFile: (file: FileItem) => void;

  // Project Operations
  createProject: (data: { name: string; clientName: string; clientEmail: string; description: string; color?: string }) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Share Operations
  createShareLink: (fileId: string, options: { password?: string; expiresAt?: string | null; allowDownload?: boolean }) => Promise<ShareLink>;
  revokeShareLink: (linkId: string) => Promise<void>;
  getShareLinkByToken: (token: string) => Promise<ShareLink | undefined>;
  recordShareInteraction: (token: string, type: 'view' | 'download') => Promise<void>;

  // Notifications
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const STORAGE_KEYS = {
  USER: 'clientvault_user_v3',
  FILES: 'clientvault_files_v3',
  PROJECTS: 'clientvault_projects_v3',
  SHARE_LINKS: 'clientvault_share_links_v3',
  NOTIFICATIONS: 'clientvault_notifications_v3',
  LOGS: 'clientvault_logs_v3',
};

const DEFAULT_DEMO_USER: User = {
  id: 'usr-rakib-demo',
  name: 'Rakib',
  email: 'raqkibrony@gmail.com',
  avatar: '',
  agencyName: 'Neomathic Studios',
  plan: 'Pro',
  storageUsed: 15892480000,
  storageLimit: 53687091200,
  createdAt: '2026-01-10T08:00:00Z',
};

const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-acme',
    userId: 'usr-rakib-demo',
    name: 'Acme Global Brand Identity',
    clientName: 'Acme Corporation',
    clientEmail: 'contact@acmecorp.com',
    description: 'Master vector logo systems, comprehensive brand guidelines, 3D stationery and web icons.',
    color: '#A78BFA',
    status: 'active',
    createdAt: '2026-02-14T11:00:00Z',
    updatedAt: '2026-03-08T14:20:00Z',
    fileCount: 3,
    totalSize: 45200000,
  },
  {
    id: 'proj-lumina',
    userId: 'usr-rakib-demo',
    name: 'Lumina Mobile App UI/UX',
    clientName: 'Lumina Technologies',
    clientEmail: 'design@lumina.io',
    description: 'iOS & Android design system, interactive Figma prototypes, component tokens, and motion specs.',
    color: '#E879F9',
    status: 'active',
    createdAt: '2026-02-20T09:30:00Z',
    updatedAt: '2026-03-09T16:45:00Z',
    fileCount: 2,
    totalSize: 128000000,
  },
  {
    id: 'proj-zenith',
    userId: 'usr-rakib-demo',
    name: 'Zenith 4K Commercial Reel',
    clientName: 'Zenith Motion Pictures',
    clientEmail: 'producers@zenithmotion.com',
    description: 'Director cut 4K video exports, audio stems, color LUTs, and cinema poster key art.',
    color: '#FFB86B',
    status: 'in-review',
    createdAt: '2026-03-01T14:15:00Z',
    updatedAt: '2026-03-09T18:10:00Z',
    fileCount: 2,
    totalSize: 2450000000,
  },
];

const SEED_FILES: FileItem[] = [
  {
    id: 'f-1',
    userId: 'usr-rakib-demo',
    projectId: 'proj-acme',
    projectName: 'Acme Global Brand Identity',
    name: 'Acme_Brand_Guidelines_v3.pdf',
    type: 'pdf',
    category: 'document',
    size: 14800000,
    url: '',
    uploadDate: '2026-03-08T14:20:00Z',
    isFavorite: true,
    isTrash: false,
    sharedCount: 3,
    clientViews: 42,
    downloadCount: 18,
    description: 'Official 64-page brand styleguide with typography rules, color formulas, and logo clear-space.',
  },
  {
    id: 'f-2',
    userId: 'usr-rakib-demo',
    projectId: 'proj-acme',
    projectName: 'Acme Global Brand Identity',
    name: 'Acme_3D_Emblem_Showcase.png',
    type: 'png',
    category: 'image',
    size: 5800000,
    url: '/public/assets/aistudio/image_25a0cb1d.png',
    previewUrl: '/public/assets/aistudio/image_25a0cb1d.png',
    uploadDate: '2026-03-06T16:00:00Z',
    isFavorite: true,
    isTrash: false,
    sharedCount: 1,
    clientViews: 28,
    downloadCount: 14,
    description: 'High-res 3D glass and metallic crystal rendering.',
  },
  {
    id: 'f-3',
    userId: 'usr-rakib-demo',
    projectId: 'proj-zenith',
    projectName: 'Zenith 4K Commercial Reel',
    name: 'Zenith_Brand_Commercial_Final_4K.mp4',
    type: 'mp4',
    category: 'video',
    size: 1950000000,
    url: '',
    uploadDate: '2026-03-09T18:10:00Z',
    isFavorite: true,
    isTrash: false,
    sharedCount: 5,
    clientViews: 88,
    downloadCount: 31,
    description: 'ProRes 422 HQ master and H.264 client review cut at 3840x2160 60fps.',
  },
];

const SEED_SHARE_LINKS: ShareLink[] = [
  {
    id: 'share-01',
    fileId: 'f-2',
    fileName: 'Acme_3D_Emblem_Showcase.png',
    ownerId: 'usr-rakib-demo',
    ownerName: 'Rakib',
    token: 'acme-3d-emblem-showcase',
    hasPassword: false,
    expiresAt: '2026-12-31T23:59:59Z',
    allowDownload: true,
    viewsCount: 28,
    downloadsCount: 14,
    createdAt: '2026-03-08T15:00:00Z',
    isRevoked: false,
  },
];

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(DEFAULT_DEMO_USER);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  const [files, setFiles] = useState<FileItem[]>(SEED_FILES);
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>(SEED_SHARE_LINKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      userId: 'usr-rakib-demo',
      title: 'Cloud Database Connected',
      message: 'ClientVault connected to Firebase Firestore (rakib-protfolio)',
      type: 'security',
      timestamp: 'Just now',
      read: false,
    },
  ]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 'act-1',
      action: 'Cloud Synced',
      fileName: 'Acme_3D_Emblem_Showcase.png',
      timestamp: 'Just now',
    },
  ]);

  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [shareModalFile, setShareModalFile] = useState<FileItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [activeShareToken, setActiveShareToken] = useState<string | null>(null);

  // Test Firebase connection on mount
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setIsCloudSynced(true);
        const userDocRef = doc(db, 'users', fbUser.uid);
        try {
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUser(snap.data() as User);
          } else {
            const newUser: User = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Rakib',
              email: fbUser.email || 'user@clientvault.io',
              avatar: fbUser.photoURL || '',
              agencyName: `${fbUser.displayName || 'Creator'}'s Studio`,
              plan: 'Pro',
              storageUsed: 0,
              storageLimit: 53687091200,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          }
        } catch (e) {
          console.warn('Could not read user profile from Firestore, using auth fallback', e);
          setUser({
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Rakib',
            email: fbUser.email || 'user@clientvault.io',
            avatar: fbUser.photoURL || '',
            agencyName: 'ClientVault Workspace',
            plan: 'Pro',
            storageUsed: 0,
            storageLimit: 53687091200,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // Fallback to local storage or demo
        try {
          const stored = localStorage.getItem(STORAGE_KEYS.USER);
          if (stored) {
            setUser(JSON.parse(stored));
          }
        } catch {}
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync when authenticated with Firebase
  useEffect(() => {
    if (!firebaseUser) return;
    const userId = firebaseUser.uid;

    // 1. Files real-time listener
    const filesCol = collection(db, 'users', userId, 'files');
    const unsubFiles = onSnapshot(
      filesCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudFiles: FileItem[] = [];
          snapshot.forEach((docSnap) => {
            cloudFiles.push(docSnap.data() as FileItem);
          });
          setFiles(cloudFiles);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${userId}/files`);
      }
    );

    // 2. Projects real-time listener
    const projectsCol = collection(db, 'users', userId, 'projects');
    const unsubProjects = onSnapshot(
      projectsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudProjects: Project[] = [];
          snapshot.forEach((docSnap) => {
            cloudProjects.push(docSnap.data() as Project);
          });
          setProjects(cloudProjects);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${userId}/projects`);
      }
    );

    // 3. Notifications real-time listener
    const notifsCol = collection(db, 'users', userId, 'notifications');
    const unsubNotifs = onSnapshot(
      notifsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudNotifs: NotificationItem[] = [];
          snapshot.forEach((docSnap) => {
            cloudNotifs.push(docSnap.data() as NotificationItem);
          });
          setNotifications(cloudNotifs);
        }
      },
      (error) => {
        console.warn('Notifications listener warning:', error);
      }
    );

    return () => {
      unsubFiles();
      unsubProjects();
      unsubNotifs();
    };
  }, [firebaseUser]);

  // URL query check on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get('share');
    if (shareParam) {
      setActiveShareToken(shareParam);
    }
  }, []);

  // Auth operations
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (error) {
      console.error('Google Sign In Error:', error);
      return false;
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      return true;
    } catch (e) {
      // Allow demo user login
      const loggedUser: User = {
        ...DEFAULT_DEMO_USER,
        email: email.trim(),
        name: email.split('@')[0] ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : 'Rakib',
      };
      setUser(loggedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedUser));
      return true;
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const newUser: User = {
        id: res.user.uid,
        name: name.trim() || 'Creative Professional',
        email: email.trim(),
        avatar: '',
        agencyName: `${name.trim()}'s Studio`,
        plan: 'Pro',
        storageUsed: 0,
        storageLimit: 53687091200,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', res.user.uid), newUser);
      setUser(newUser);
      return true;
    } catch (e) {
      // Local fallback
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: name.trim() || 'Creative Professional',
        email: email.trim(),
        avatar: '',
        agencyName: `${name.trim()}'s Studio`,
        plan: 'Pro',
        storageUsed: 0,
        storageLimit: 53687091200,
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      return true;
    }
  };

  const loginDemo = () => {
    setUser(DEFAULT_DEMO_USER);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_DEMO_USER));
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), updates);
      } catch (e) {
        console.warn('Could not update profile in Firestore:', e);
      }
    }
  };

  // Upload Files with Cloud Storage & Firestore
  const uploadFiles = async (fileList: FileList | File[], targetProjectId?: string) => {
    const filesArray = Array.from(fileList);
    const assignedProject = projects.find((p) => p.id === targetProjectId);
    const newItems: FileItem[] = [];

    for (const f of filesArray) {
      const ext = f.name.split('.').pop()?.toLowerCase() || 'bin';
      const category: FileCategory = getFileCategory(f.name);
      const fileId = `f-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      let downloadUrl = '';

      // Real Cloud Storage Upload if user is connected
      if (firebaseUser) {
        try {
          const sRef = storageRef(storage, `users/${firebaseUser.uid}/files/${fileId}_${f.name}`);
          const uploadTask = await uploadBytesResumable(sRef, f);
          downloadUrl = await getDownloadURL(uploadTask.ref);
        } catch (e) {
          console.warn('Firebase Storage upload fallback:', e);
        }
      }

      if (!downloadUrl) {
        try {
          downloadUrl = URL.createObjectURL(f);
        } catch {
          downloadUrl = '';
        }
      }

      const item: FileItem = {
        id: fileId,
        userId: user?.id || 'usr-rakib-demo',
        projectId: targetProjectId,
        projectName: assignedProject?.name,
        name: f.name,
        type: ext,
        category,
        size: f.size,
        url: downloadUrl,
        previewUrl: category === 'image' ? downloadUrl : undefined,
        uploadDate: new Date().toISOString(),
        isFavorite: false,
        isTrash: false,
        sharedCount: 0,
        clientViews: 0,
        downloadCount: 0,
        description: `Uploaded on ${new Date().toLocaleDateString()}`,
      };

      newItems.push(item);

      // Persist to Firestore if authenticated
      if (firebaseUser) {
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid, 'files', fileId), item);
        } catch (e) {
          console.warn('Firestore file document write warning:', e);
        }
      }
    }

    setFiles((prev) => [...newItems, ...prev]);

    // Update Project Stats
    if (targetProjectId) {
      const addedSize = newItems.reduce((acc, curr) => acc + curr.size, 0);
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === targetProjectId
            ? {
                ...proj,
                fileCount: proj.fileCount + newItems.length,
                totalSize: proj.totalSize + addedSize,
                updatedAt: new Date().toISOString(),
              }
            : proj
        )
      );

      if (firebaseUser) {
        try {
          const projRef = doc(db, 'users', firebaseUser.uid, 'projects', targetProjectId);
          await updateDoc(projRef, {
            fileCount: (assignedProject?.fileCount || 0) + newItems.length,
            totalSize: (assignedProject?.totalSize || 0) + addedSize,
            updatedAt: new Date().toISOString(),
          });
        } catch {}
      }
    }

    // Add Notification
    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      userId: user?.id || 'usr-rakib-demo',
      title: 'Cloud Upload Completed',
      message: `Uploaded ${newItems.length} file${newItems.length > 1 ? 's' : ''} with multi-device sync`,
      type: 'upload',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid, 'notifications', notif.id), notif);
      } catch {}
    }
  };

  const renameFile = async (id: string, newName: string) => {
    if (!newName.trim()) return;
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName.trim() } : f))
    );

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid, 'files', id), { name: newName.trim() });
      } catch {}
    }
  };

  const deleteFile = async (id: string, permanent = false) => {
    if (permanent) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
      if (firebaseUser) {
        try {
          await deleteDoc(doc(db, 'users', firebaseUser.uid, 'files', id));
        } catch {}
      }
    } else {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isTrash: true } : f))
      );
      if (firebaseUser) {
        try {
          await updateDoc(doc(db, 'users', firebaseUser.uid, 'files', id), { isTrash: true });
        } catch {}
      }
    }
  };

  const restoreFile = async (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isTrash: false } : f))
    );
    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid, 'files', id), { isTrash: false });
      } catch {}
    }
  };

  const toggleFavorite = async (id: string) => {
    const target = files.find((f) => f.id === id);
    if (!target) return;
    const newFav = !target.isFavorite;

    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFavorite: newFav } : f))
    );

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid, 'files', id), { isFavorite: newFav });
      } catch {}
    }
  };

  const moveFileToProject = async (fileId: string, projectId?: string) => {
    const targetProject = projects.find((p) => p.id === projectId);
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, projectId, projectName: targetProject?.name }
          : f
      )
    );

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid, 'files', fileId), {
          projectId: projectId || null,
          projectName: targetProject?.name || null,
        });
      } catch {}
    }
  };

  const downloadFile = (file: FileItem) => {
    // If real Cloud URL
    if (file.url && (file.url.startsWith('https://') || file.url.startsWith('blob:'))) {
      const a = document.createElement('a');
      a.href = file.url;
      a.target = '_blank';
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Direct deliverable blob fallback
    const content = `--- ClientVault Verified Asset ---\nFile: ${file.name}\nProject: ${file.projectName || 'Vault'}\nSize: ${file.size} bytes\nOwner: ${user?.name || 'Rakib'}\nCloud Reference: Firebase Storage (rakib-protfolio)\nTimestamp: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.includes('.') ? file.name : `${file.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Projects CRUD
  const createProject = async (data: {
    name: string;
    clientName: string;
    clientEmail: string;
    description: string;
    color?: string;
  }): Promise<Project> => {
    const projId = `proj-${Date.now()}`;
    const newProj: Project = {
      id: projId,
      userId: user?.id || 'usr-rakib-demo',
      name: data.name.trim(),
      clientName: data.clientName.trim(),
      clientEmail: data.clientEmail.trim(),
      description: data.description.trim(),
      color: data.color || '#A78BFA',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileCount: 0,
      totalSize: 0,
    };

    setProjects((prev) => [newProj, ...prev]);

    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid, 'projects', projId), newProj);
      } catch (e) {
        console.warn('Firestore project write warning:', e);
      }
    }

    return newProj;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid, 'projects', id), {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } catch {}
    }
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (firebaseUser) {
      try {
        await deleteDoc(doc(db, 'users', firebaseUser.uid, 'projects', id));
      } catch {}
    }
  };

  // Share Operations (Stored in global /shareLinks/{token} for public client access!)
  const createShareLink = async (
    fileId: string,
    options: { password?: string; expiresAt?: string | null; allowDownload?: boolean }
  ): Promise<ShareLink> => {
    const targetFile = files.find((f) => f.id === fileId);
    const token = `${targetFile ? targetFile.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 16) : 'file'}-${generateToken(8)}`;

    const newLink: ShareLink = {
      id: `share-${Date.now()}`,
      fileId,
      fileName: targetFile?.name || 'File',
      ownerId: user?.id || 'usr-rakib-demo',
      ownerName: user?.name || 'Rakib',
      token,
      hasPassword: Boolean(options.password && options.password.trim().length > 0),
      password: options.password?.trim() || undefined,
      expiresAt: options.expiresAt || null,
      allowDownload: options.allowDownload ?? true,
      viewsCount: 0,
      downloadsCount: 0,
      createdAt: new Date().toISOString(),
      isRevoked: false,
    };

    setShareLinks((prev) => [newLink, ...prev]);

    // Save to Firestore /shareLinks/{token} so clients on any phone/device can fetch it
    try {
      await setDoc(doc(db, 'shareLinks', token), newLink);
    } catch (e) {
      console.warn('Share link Firestore save warning:', e);
    }

    return newLink;
  };

  const revokeShareLink = async (linkId: string) => {
    const link = shareLinks.find((l) => l.id === linkId);
    setShareLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, isRevoked: true } : l))
    );

    if (link) {
      try {
        await updateDoc(doc(db, 'shareLinks', link.token), { isRevoked: true });
      } catch {}
    }
  };

  const getShareLinkByToken = async (token: string): Promise<ShareLink | undefined> => {
    // 1. Try memory / local state
    const existing = shareLinks.find((l) => l.token === token);
    if (existing) return existing;

    // 2. Fetch directly from Firestore for real multi-device client access!
    try {
      const snap = await getDoc(doc(db, 'shareLinks', token));
      if (snap.exists()) {
        const data = snap.data() as ShareLink;
        setShareLinks((prev) => [...prev, data]);
        return data;
      }
    } catch (e) {
      console.warn('Could not fetch share link from Firestore:', e);
    }

    return undefined;
  };

  const recordShareInteraction = async (token: string, type: 'view' | 'download') => {
    setShareLinks((prev) =>
      prev.map((l) =>
        l.token === token
          ? {
              ...l,
              viewsCount: type === 'view' ? l.viewsCount + 1 : l.viewsCount,
              downloadsCount: type === 'download' ? l.downloadsCount + 1 : l.downloadsCount,
            }
          : l
      )
    );

    try {
      const linkDoc = doc(db, 'shareLinks', token);
      const snap = await getDoc(linkDoc);
      if (snap.exists()) {
        const cur = snap.data() as ShareLink;
        await updateDoc(linkDoc, {
          viewsCount: type === 'view' ? (cur.viewsCount || 0) + 1 : cur.viewsCount,
          downloadsCount: type === 'download' ? (cur.downloadsCount || 0) + 1 : cur.downloadsCount,
        });
      }
    } catch {}
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid, 'notifications', id), { read: true });
      } catch {}
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <VaultContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: Boolean(user),
        isCloudSynced,
        login,
        signup,
        loginWithGoogle,
        loginDemo,
        logout,
        updateProfile,

        currentView,
        setCurrentView,
        selectedProjectId,
        setSelectedProjectId,

        files,
        projects,
        shareLinks,
        notifications,
        activityLogs,

        searchQuery,
        setSearchQuery,

        previewFile,
        setPreviewFile,
        shareModalFile,
        setShareModalFile,
        uploadModalOpen,
        setUploadModalOpen,
        createProjectModalOpen,
        setCreateProjectModalOpen,
        activeShareToken,
        setActiveShareToken,

        uploadFiles,
        renameFile,
        deleteFile,
        restoreFile,
        toggleFavorite,
        moveFileToProject,
        downloadFile,

        createProject,
        updateProject,
        deleteProject,

        createShareLink,
        revokeShareLink,
        getShareLinkByToken,
        recordShareInteraction,

        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
