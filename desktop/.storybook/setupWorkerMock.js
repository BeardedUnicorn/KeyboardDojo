/**
 * This file sets up the necessary mocks for Storybook to work correctly with Tauri APIs
 */

// Define a simplified version of Jest's functions
window.jest = {
  fn: (impl) => impl || ((...args) => args),
  mock: () => {},
  clearAllMocks: () => {},
  resetAllMocks: () => {},
  restoreAllMocks: () => {},
};

// Provide mock implementations for Tauri APIs
window.mockTauri = {
  window: {
    getCurrent: () => ({
      setTitle: window.jest.fn(async () => {}),
      minimize: window.jest.fn(async () => {}),
      maximize: window.jest.fn(async () => {}),
      unmaximize: window.jest.fn(async () => {}),
      close: window.jest.fn(async () => {}),
      isMaximized: window.jest.fn(async () => false),
      listen: window.jest.fn(async () => () => {}),
      once: window.jest.fn(async () => () => {}),
      show: window.jest.fn(async () => {}),
      hide: window.jest.fn(async () => {}),
      setFocus: window.jest.fn(async () => {}),
      startDragging: window.jest.fn(async () => {}),
    }),
    getAll: window.jest.fn(async () => []),
  },
  path: {
    appDir: window.jest.fn(async () => '/mock/app/dir/'),
    appConfigDir: window.jest.fn(async () => '/mock/app/config/dir/'),
    appDataDir: window.jest.fn(async () => '/mock/app/data/dir/'),
  },
  fs: {
    readTextFile: window.jest.fn(async () => 'Mock file content'),
    readBinaryFile: window.jest.fn(async () => new Uint8Array()),
    exists: window.jest.fn(async () => true),
  },
  dialog: {
    open: window.jest.fn(async () => '/mock/path/to/file.txt'),
    save: window.jest.fn(async () => '/mock/path/to/save/file.txt'),
  },
  notification: {
    isPermissionGranted: window.jest.fn(async () => true),
    requestPermission: window.jest.fn(async () => 'granted'),
    sendNotification: window.jest.fn(),
  },
  os: {
    platform: window.jest.fn(async () => 'darwin'),
    version: window.jest.fn(async () => '12.0.0'),
  },
};

// Apply mock definitions to handle imports 
window.__STORYBOOK_PREVIEW__ = window.__STORYBOOK_PREVIEW__ || {};
window.__STORYBOOK_PREVIEW__.globals = window.__STORYBOOK_PREVIEW__.globals || {};
window.__STORYBOOK_PREVIEW__.globals.__mockTauri = window.mockTauri;

console.log('Storybook worker mock setup complete'); 