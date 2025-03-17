import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Tauri API
vi.mock('@tauri-apps/api', () => {
  return {
    app: {
      getVersion: vi.fn().mockResolvedValue('1.0.0'),
      getName: vi.fn().mockResolvedValue('Keyboard Dojo'),
    },
    window: {
      appWindow: {
        maximize: vi.fn(),
        minimize: vi.fn(),
        close: vi.fn(),
        isMaximized: vi.fn().mockResolvedValue(false),
      },
    },
    fs: {
      readTextFile: vi.fn().mockResolvedValue(''),
      writeTextFile: vi.fn().mockResolvedValue(undefined),
      exists: vi.fn().mockResolvedValue(false),
      createDir: vi.fn().mockResolvedValue(undefined),
      removeFile: vi.fn().mockResolvedValue(undefined),
      removeDir: vi.fn().mockResolvedValue(undefined),
    },
    http: {
      fetch: vi.fn().mockResolvedValue({
        status: 200,
        data: {},
      }),
    },
    notification: {
      sendNotification: vi.fn(),
      requestPermission: vi.fn().mockResolvedValue(true),
    },
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    },
    updater: {
      checkUpdate: vi.fn().mockResolvedValue({
        available: false,
        manifest: null,
      }),
      installUpdate: vi.fn().mockResolvedValue(undefined),
    },
    dialog: {
      open: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(null),
    },
    shell: {
      open: vi.fn().mockResolvedValue(undefined),
    },
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.navigator.onLine
Object.defineProperty(window.navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] || null,
    length: 0,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})); 