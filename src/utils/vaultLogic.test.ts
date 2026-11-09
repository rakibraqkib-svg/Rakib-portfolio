import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBytes,
  getFileCategory,
  filterFiles,
  sortFiles,
  calculateStorageStats,
  validateShareAccess,
} from './vaultLogic';
import { FileItem, ShareLink } from '../types';

test('formatBytes formats bytes into human-readable strings', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1048576 * 15), '15 MB');
  assert.equal(formatBytes(1073741824 * 2.5), '2.5 GB');
});

test('getFileCategory maps extensions to appropriate categories', () => {
  assert.equal(getFileCategory('hero_banner.png'), 'image');
  assert.equal(getFileCategory('brand_guidelines.pdf'), 'document');
  assert.equal(getFileCategory('commercial_reel.mov'), 'video');
  assert.equal(getFileCategory('identity_system.ai'), 'design');
  assert.equal(getFileCategory('assets_bundle.zip'), 'archive');
  assert.equal(getFileCategory('voiceover.mp3'), 'audio');
  assert.equal(getFileCategory('unknown_binary.xyz'), 'other');
});

test('filterFiles accurately filters by search, category, and trash status', () => {
  const mockFiles: FileItem[] = [
    {
      id: 'f1',
      userId: 'u1',
      projectId: 'p1',
      projectName: 'Acme Brand',
      name: 'Logo-vector.ai',
      type: 'ai',
      category: 'design',
      size: 4500000,
      url: '/files/logo.ai',
      uploadDate: '2026-03-01T10:00:00Z',
      isFavorite: true,
      isTrash: false,
      sharedCount: 1,
      clientViews: 5,
      downloadCount: 2,
    },
    {
      id: 'f2',
      userId: 'u1',
      projectId: 'p2',
      projectName: 'Lumina App',
      name: 'Screenshots.zip',
      type: 'zip',
      category: 'archive',
      size: 25000000,
      url: '/files/screens.zip',
      uploadDate: '2026-03-02T12:00:00Z',
      isFavorite: false,
      isTrash: false,
      sharedCount: 0,
      clientViews: 0,
      downloadCount: 0,
    },
    {
      id: 'f3',
      userId: 'u1',
      projectId: 'p1',
      projectName: 'Acme Brand',
      name: 'Old-draft.pdf',
      type: 'pdf',
      category: 'document',
      size: 1200000,
      url: '/files/old.pdf',
      uploadDate: '2026-02-15T08:00:00Z',
      isFavorite: false,
      isTrash: true,
      sharedCount: 0,
      clientViews: 0,
      downloadCount: 0,
    },
  ];

  // Active files only (exclude trash by default)
  const active = filterFiles(mockFiles, {});
  assert.equal(active.length, 2);

  // Search by project name
  const acmeOnly = filterFiles(mockFiles, { search: 'Acme' });
  assert.equal(acmeOnly.length, 1);
  assert.equal(acmeOnly[0].id, 'f1');

  // Search by category
  const archives = filterFiles(mockFiles, { category: 'archive' });
  assert.equal(archives.length, 1);
  assert.equal(archives[0].id, 'f2');

  // Favorites only
  const favs = filterFiles(mockFiles, { isFavorite: true });
  assert.equal(favs.length, 1);
  assert.equal(favs[0].id, 'f1');

  // Trash only
  const trash = filterFiles(mockFiles, { isTrash: true });
  assert.equal(trash.length, 1);
  assert.equal(trash[0].id, 'f3');
});

test('calculateStorageStats computes category usage and percentages', () => {
  const mockFiles: FileItem[] = [
    {
      id: 'f1',
      userId: 'u1',
      name: 'img.jpg',
      type: 'jpg',
      category: 'image',
      size: 1000,
      url: '',
      uploadDate: '2026-01-01',
      isFavorite: false,
      isTrash: false,
      sharedCount: 0,
      clientViews: 0,
      downloadCount: 0,
    },
    {
      id: 'f2',
      userId: 'u1',
      name: 'vid.mp4',
      type: 'mp4',
      category: 'video',
      size: 4000,
      url: '',
      uploadDate: '2026-01-01',
      isFavorite: false,
      isTrash: false,
      sharedCount: 0,
      clientViews: 0,
      downloadCount: 0,
    },
  ];

  const stats = calculateStorageStats(mockFiles, 10000);
  assert.equal(stats.totalUsed, 5000);
  assert.equal(stats.percentage, 50);
  assert.equal(stats.byCategory.image.bytes, 1000);
  assert.equal(stats.byCategory.video.bytes, 4000);
});

test('validateShareAccess checks expiration, revocation and passwords correctly', () => {
  const validLink: ShareLink = {
    id: 'l1',
    fileId: 'f1',
    fileName: 'Deck.pdf',
    ownerId: 'u1',
    ownerName: 'Rakib',
    token: 'tok123',
    hasPassword: true,
    password: 'secretPassword123',
    expiresAt: '2099-01-01T00:00:00Z',
    allowDownload: true,
    viewsCount: 0,
    downloadsCount: 0,
    createdAt: '2026-01-01',
    isRevoked: false,
  };

  // Password required
  assert.deepEqual(validateShareAccess(validLink, ''), { allowed: false, reason: 'password_required' });
  // Invalid password
  assert.deepEqual(validateShareAccess(validLink, 'wrong'), { allowed: false, reason: 'invalid_password' });
  // Valid password
  assert.deepEqual(validateShareAccess(validLink, 'secretPassword123'), { allowed: true });

  // Expired link
  const expiredLink: ShareLink = {
    ...validLink,
    expiresAt: '2020-01-01T00:00:00Z',
  };
  assert.deepEqual(validateShareAccess(expiredLink, 'secretPassword123'), { allowed: false, reason: 'expired' });

  // Revoked link
  const revokedLink: ShareLink = {
    ...validLink,
    isRevoked: true,
  };
  assert.deepEqual(validateShareAccess(revokedLink, 'secretPassword123'), { allowed: false, reason: 'revoked' });
});
