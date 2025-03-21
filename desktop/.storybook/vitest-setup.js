import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Import the existing setup to leverage existing mocks
import { setupGlobalMocks } from './setup-test-environment';

// Make vi available globally
global.vi = vi;

// Setup Jest compatibility
global.jest = vi;
global.expect = vi.expect;
global.describe = vi.describe;
global.it = vi.it;
global.test = vi.it;
global.beforeAll = vi.beforeAll;
global.afterAll = vi.afterAll;
global.beforeEach = vi.beforeEach;
global.afterEach = vi.afterEach;

// Setup DOM environment for tests
if (typeof window === 'undefined') {
  // Create a basic mock of window object
  global.window = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setTimeout: vi.fn(),
    clearTimeout: vi.fn(),
    document: {
      createElement: vi.fn(),
      body: {},
    },
    location: {
      href: 'http://localhost/',
    },
  };
  
  // Add required window objects
  global.localStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  
  global.navigator = {
    userAgent: 'node.js',
    platform: 'MacIntel',
  };
  
  global.KeyboardEvent = class KeyboardEvent {
    constructor(type, options = {}) {
      this.type = type;
      this.key = options.key || '';
      this.code = options.code || '';
      this.ctrlKey = options.ctrlKey || false;
      this.altKey = options.altKey || false;
      this.shiftKey = options.shiftKey || false;
      this.metaKey = options.metaKey || false;
      this.repeat = options.repeat || false;
    }
  };
  
  global.MouseEvent = class MouseEvent {
    constructor(type, options = {}) {
      this.type = type;
      this.clientX = options.clientX || 0;
      this.clientY = options.clientY || 0;
    }
  };
  
  global.Audio = class Audio {
    constructor(src) {
      this.src = src;
      this.volume = 1;
      this.play = vi.fn();
      this.pause = vi.fn();
    }
  };
  
  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {
      this.observe = vi.fn();
      this.unobserve = vi.fn();
      this.disconnect = vi.fn();
    }
  };
  
  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {
      this.observe = vi.fn();
      this.unobserve = vi.fn();
      this.disconnect = vi.fn();
    }
  };
}

// Make sure window.matchMedia is a function
if (typeof window !== 'undefined' && (typeof window.matchMedia !== 'function')) {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// Call the setup function from the existing environment
setupGlobalMocks();

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