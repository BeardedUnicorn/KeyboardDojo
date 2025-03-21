/**
 * This file will be executed before each story test is run.
 * It sets up the mock implementations for dependencies.
 */

// Make jest available globally
global.jest = {
  mock: (modulePath, factory) => {
    // Mock implementation for jest.mock
    console.log(`Mocking module: ${modulePath}`);
    return factory ? factory() : {};
  },
  fn: (impl) => impl || (() => {}),
  spyOn: () => ({ mockImplementation: () => {} }),
};

// Add mock implementations for gamification components
// These will be used when the components are imported
window.__mocks = {
  components: {
    LevelProgressBar: () => ({ 
      __esModule: true,
      default: () => null 
    }),
    StreakDisplay: () => ({ 
      __esModule: true,
      default: () => null 
    }),
    XPDisplay: () => ({ 
      __esModule: true,
      default: () => null 
    }),
  }
}; 