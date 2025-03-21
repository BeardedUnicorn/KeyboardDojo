import { vi } from 'vitest';

// Mock all services
vi.mock('@/services', () => {
  const mockLoggerService = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  const mockAudioService = {
    play: vi.fn(),
    playSound: vi.fn(),
  };

  return {
    loggerService: mockLoggerService,
    audioService: mockAudioService,
    achievementsService: {},
    currencyService: {},
    curriculumService: {},
    gamificationService: {},
    heartsService: {},
    keyboardService: {},
    offlineService: {},
    osDetectionService: {},
    serviceFactory: {
      register: vi.fn(),
      get: vi.fn(),
      initialize: vi.fn(),
      cleanup: vi.fn(),
    },
    spacedRepetitionService: {},
    streakService: {},
    subscriptionService: {},
    updateService: {},
    userProgressService: {},
    windowService: {},
    xpService: {},
    useLogger: vi.fn(() => mockLoggerService),
  };
}); 