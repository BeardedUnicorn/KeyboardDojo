/**
 * Mock implementation of Tauri API for Storybook
 * This allows components that use Tauri APIs to work in Storybook without errors
 */

import { vi } from 'vitest';

// Mock Window API
vi.mock('@tauri-apps/api/window', () => ({
  Window: {
    getCurrent: () => ({
      setTitle: vi.fn().mockResolvedValue(undefined),
      minimize: vi.fn().mockResolvedValue(undefined),
      maximize: vi.fn().mockResolvedValue(undefined),
      unmaximize: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
      isMaximized: vi.fn().mockResolvedValue(false),
      listen: vi.fn().mockResolvedValue(() => {}),
      once: vi.fn().mockResolvedValue(() => {}),
      show: vi.fn().mockResolvedValue(undefined),
      hide: vi.fn().mockResolvedValue(undefined),
      setFocus: vi.fn().mockResolvedValue(undefined),
      startDragging: vi.fn().mockResolvedValue(undefined),
    }),
    getAll: vi.fn().mockResolvedValue([]),
  },
  WebviewWindow: vi.fn().mockImplementation(() => ({
    listen: vi.fn().mockResolvedValue(() => {}),
    once: vi.fn().mockResolvedValue(() => {}),
    emit: vi.fn().mockResolvedValue(() => {}),
  })),
  getCurrent: vi.fn().mockImplementation(() => ({
    listen: vi.fn().mockResolvedValue(() => {}),
    once: vi.fn().mockResolvedValue(() => {}),
    emit: vi.fn().mockResolvedValue(() => {}),
  })),
}));

// Mock Path API
vi.mock('@tauri-apps/api/path', () => ({
  appDir: vi.fn().mockResolvedValue('/mock/app/dir/'),
  appConfigDir: vi.fn().mockResolvedValue('/mock/app/config/dir/'),
  appDataDir: vi.fn().mockResolvedValue('/mock/app/data/dir/'),
  appLocalDataDir: vi.fn().mockResolvedValue('/mock/app/local/data/dir/'),
  appCacheDir: vi.fn().mockResolvedValue('/mock/app/cache/dir/'),
  appLogDir: vi.fn().mockResolvedValue('/mock/app/log/dir/'),
  audioDir: vi.fn().mockResolvedValue('/mock/audio/dir/'),
  cacheDir: vi.fn().mockResolvedValue('/mock/cache/dir/'),
  configDir: vi.fn().mockResolvedValue('/mock/config/dir/'),
  dataDir: vi.fn().mockResolvedValue('/mock/data/dir/'),
  desktopDir: vi.fn().mockResolvedValue('/mock/desktop/dir/'),
  documentDir: vi.fn().mockResolvedValue('/mock/document/dir/'),
  downloadDir: vi.fn().mockResolvedValue('/mock/download/dir/'),
  executableDir: vi.fn().mockResolvedValue('/mock/executable/dir/'),
  fontDir: vi.fn().mockResolvedValue('/mock/font/dir/'),
  homeDir: vi.fn().mockResolvedValue('/mock/home/dir/'),
  localDataDir: vi.fn().mockResolvedValue('/mock/local/data/dir/'),
  pictureDir: vi.fn().mockResolvedValue('/mock/picture/dir/'),
  publicDir: vi.fn().mockResolvedValue('/mock/public/dir/'),
  resourceDir: vi.fn().mockResolvedValue('/mock/resource/dir/'),
  runtimeDir: vi.fn().mockResolvedValue('/mock/runtime/dir/'),
  templateDir: vi.fn().mockResolvedValue('/mock/template/dir/'),
  videoDir: vi.fn().mockResolvedValue('/mock/video/dir/'),
  basename: vi.fn().mockImplementation((path) => path.split('/').pop()),
  dirname: vi.fn().mockImplementation((path) => path.split('/').slice(0, -1).join('/')),
  extname: vi.fn().mockImplementation((path) => {
    const parts = path.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : '';
  }),
  join: vi.fn().mockImplementation((...parts) => parts.join('/')),
  normalize: vi.fn().mockImplementation((path) => path.replace(/\/+/g, '/')),
  resolve: vi.fn().mockImplementation((...parts) => parts.join('/')),
}));

// Mock FS API
vi.mock('@tauri-apps/api/fs', () => ({
  readTextFile: vi.fn().mockResolvedValue('Mock file content'),
  readBinaryFile: vi.fn().mockResolvedValue(new Uint8Array()),
  writeTextFile: vi.fn().mockResolvedValue(undefined),
  writeBinaryFile: vi.fn().mockResolvedValue(undefined),
  readDir: vi.fn().mockResolvedValue([]),
  createDir: vi.fn().mockResolvedValue(undefined),
  removeDir: vi.fn().mockResolvedValue(undefined),
  removeFile: vi.fn().mockResolvedValue(undefined),
  renameFile: vi.fn().mockResolvedValue(undefined),
  copyFile: vi.fn().mockResolvedValue(undefined),
  exists: vi.fn().mockResolvedValue(true),
}));

// Mock OS API
vi.mock('@tauri-apps/api/os', () => ({
  platform: vi.fn().mockResolvedValue('darwin'),
  version: vi.fn().mockResolvedValue('12.0.0'),
  type: vi.fn().mockResolvedValue('Darwin'),
  arch: vi.fn().mockResolvedValue('x86_64'),
  tempdir: vi.fn().mockResolvedValue('/mock/temp/dir/'),
}));

// Mock Dialog API
vi.mock('@tauri-apps/api/dialog', () => ({
  open: vi.fn().mockResolvedValue('/mock/path/to/file.txt'),
  save: vi.fn().mockResolvedValue('/mock/path/to/save/file.txt'),
  message: vi.fn().mockResolvedValue(true),
  confirm: vi.fn().mockResolvedValue(true),
  ask: vi.fn().mockResolvedValue('Mock user input'),
}));

// Mock notification API
vi.mock('@tauri-apps/api/notification', () => ({
  isPermissionGranted: vi.fn().mockResolvedValue(true),
  requestPermission: vi.fn().mockResolvedValue('granted'),
  sendNotification: vi.fn(),
}));
