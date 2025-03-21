import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseService } from '../BaseService';

// Mock dependencies
vi.mock('../loggerService', () => ({
  loggerService: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock curriculum data and registry
vi.mock('@data/curriculum', () => {
  const mockCurriculum = {
    metadata: {
      id: 'test-curriculum',
      name: 'Test Curriculum',
      description: 'Curriculum for testing',
      version: '1.0.0',
    },
    tracks: [
      {
        id: 'vscode',
        name: 'VS Code',
        description: 'Visual Studio Code track',
        modules: [
          {
            id: 'basics',
            name: 'Basics',
            description: 'Basic VS Code shortcuts',
            lessons: [
              {
                id: 'lesson1',
                name: 'First Lesson',
                description: 'Introduction to VS Code',
                shortcuts: ['shortcut1', 'shortcut2'],
              },
              {
                id: 'lesson2',
                name: 'Second Lesson',
                description: 'More VS Code shortcuts',
                shortcuts: ['shortcut3', 'shortcut4'],
              },
            ],
          },
        ],
      },
    ],
    paths: [
      {
        id: 'beginner-path',
        name: 'Beginner Path',
        description: 'Path for beginners',
        trackId: 'vscode',
        nodes: [
          {
            id: 'node1',
            type: 'lesson',
            lessonId: 'lesson1',
          },
          {
            id: 'node2',
            type: 'lesson',
            lessonId: 'lesson2',
          },
        ],
      },
    ],
  };

  return {
    curriculumRegistry: {
      getAllCurriculums: vi.fn().mockReturnValue([mockCurriculum]),
      getCurriculumById: vi.fn().mockImplementation((id) => 
        id === 'test-curriculum' ? mockCurriculum : undefined
      ),
      getActiveCurriculum: vi.fn().mockReturnValue(mockCurriculum),
      setActiveCurriculum: vi.fn().mockReturnValue(true),
      registerCurriculum: vi.fn().mockReturnValue(true),
      clear: vi.fn(),
      getAllTracks: vi.fn().mockReturnValue(mockCurriculum.tracks),
      getTrackById: vi.fn().mockImplementation((id) => 
        mockCurriculum.tracks.find(track => track.id === id)
      ),
      getAllPaths: vi.fn().mockReturnValue(mockCurriculum.paths),
      getPathsByTrackId: vi.fn().mockImplementation((trackId) => 
        mockCurriculum.paths.filter(path => path.trackId === trackId)
      ),
      getPathById: vi.fn().mockImplementation((pathId) => 
        mockCurriculum.paths.find(path => path.id === pathId)
      ),
    },
    initializeCurriculum: vi.fn(),
    findLessonById: vi.fn().mockImplementation((lessonId) => {
      for (const track of mockCurriculum.tracks) {
        for (const module of track.modules) {
          const lesson = module.lessons.find(l => l.id === lessonId);
          if (lesson) return lesson;
        }
      }
      return undefined;
    }),
    findPathNodeById: vi.fn().mockImplementation((nodeId) => {
      for (const path of mockCurriculum.paths) {
        const node = path.nodes.find(n => n.id === nodeId);
        if (node) return node;
      }
      return undefined;
    }),
    getAllShortcuts: vi.fn().mockReturnValue([
      { id: 'shortcut1', key: 'Ctrl+S', description: 'Save file' },
      { id: 'shortcut2', key: 'Ctrl+C', description: 'Copy' },
    ]),
    validateCurriculum: vi.fn().mockReturnValue([]),
    getNextLesson: vi.fn().mockImplementation((moduleId, currentLessonId) => {
      if (moduleId === 'basics' && currentLessonId === 'lesson1') {
        return {
          id: 'lesson2',
          name: 'Second Lesson',
          description: 'More VS Code shortcuts',
          shortcuts: ['shortcut3', 'shortcut4'],
        };
      }
      return undefined;
    }),
    getNextPathNode: vi.fn().mockImplementation((pathId, currentNodeId) => {
      if (pathId === 'beginner-path' && currentNodeId === 'node1') {
        return {
          id: 'node2',
          type: 'lesson',
          lessonId: 'lesson2',
        };
      }
      return undefined;
    }),
  };
});

// Import service after mocking
import { curriculumService } from '../curriculumService';
import { loggerService } from '../loggerService';

describe('CurriculumService', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Reset service status
    (curriculumService as any)._status = { initialized: false };
    
    // Initialize service
    await curriculumService.initialize();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extend BaseService', () => {
    expect(curriculumService).toBeInstanceOf(BaseService);
  });

  it('should initialize correctly', async () => {
    // Service was initialized in beforeEach
    expect(curriculumService.isInitialized()).toBe(true);
    expect(loggerService.info).toHaveBeenCalledWith(
      'Curriculum service initialized',
      expect.any(Object)
    );
  });

  it('should handle cleanup correctly', () => {
    curriculumService.cleanup();
    
    expect(loggerService.info).toHaveBeenCalledWith(
      'Curriculum service cleaned up',
      expect.any(Object)
    );
  });

  it('getLessons returns available lessons', () => {
    const lessons = curriculumService.getLessons('vscode', 'basics');
    
    expect(lessons).toHaveLength(2);
    expect(lessons[0].id).toBe('lesson1');
    expect(lessons[1].id).toBe('lesson2');
  });

  it('getLessonById retrieves specific lesson', () => {
    const lesson = curriculumService.findLessonById('lesson1');
    
    expect(lesson).toBeDefined();
    expect(lesson?.id).toBe('lesson1');
    expect(lesson?.name).toBe('First Lesson');
  });

  it('getNextRecommendedLesson suggests appropriate lesson', () => {
    const nextLesson = curriculumService.getNextLesson('basics', 'lesson1');
    
    expect(nextLesson).toBeDefined();
    expect(nextLesson?.id).toBe('lesson2');
  });

  it('should get all curriculums', () => {
    const curriculums = curriculumService.getAllCurriculums();
    
    expect(curriculums).toHaveLength(1);
    expect(curriculums[0].metadata.id).toBe('test-curriculum');
  });

  it('should get curriculum metadata', () => {
    const metadata = curriculumService.getCurriculumMetadata();
    
    expect(metadata).toHaveLength(1);
    expect(metadata[0].id).toBe('test-curriculum');
    expect(metadata[0].name).toBe('Test Curriculum');
  });

  it('should get curriculum by ID', () => {
    const curriculum = curriculumService.getCurriculumById('test-curriculum');
    
    expect(curriculum).toBeDefined();
    expect(curriculum?.metadata.id).toBe('test-curriculum');
  });

  it('should get active curriculum', () => {
    const curriculum = curriculumService.getActiveCurriculum();
    
    expect(curriculum).toBeDefined();
    expect(curriculum.metadata.id).toBe('test-curriculum');
  });

  it('should set active curriculum', () => {
    const result = curriculumService.setActiveCurriculum('test-curriculum');
    
    expect(result).toBe(true);
  });

  it('should register a new curriculum', () => {
    const mockCurriculum = {
      metadata: {
        id: 'new-curriculum',
        name: 'New Curriculum',
        description: 'New curriculum for testing',
        version: '1.0.0',
      },
      tracks: [],
      paths: [],
    };
    
    const result = curriculumService.registerCurriculum(mockCurriculum);
    
    expect(result).toBe(true);
  });

  it('should get all application tracks', () => {
    const tracks = curriculumService.getApplicationTracks();
    
    expect(tracks).toHaveLength(1);
    expect(tracks[0].id).toBe('vscode');
  });

  it('should get application track by ID', () => {
    const track = curriculumService.getApplicationTrack('vscode');
    
    expect(track).toBeDefined();
    expect(track?.id).toBe('vscode');
    expect(track?.name).toBe('VS Code');
  });

  it('should get modules for a track', () => {
    const modules = curriculumService.getModules('vscode');
    
    expect(modules).toHaveLength(1);
    expect(modules[0].id).toBe('basics');
  });

  it('should get a specific module', () => {
    const module = curriculumService.getModule('vscode', 'basics');
    
    expect(module).toBeDefined();
    expect(module?.id).toBe('basics');
    expect(module?.name).toBe('Basics');
  });

  it('should get a specific lesson', () => {
    const lesson = curriculumService.getLesson('vscode', 'basics', 'lesson1');
    
    expect(lesson).toBeDefined();
    expect(lesson?.id).toBe('lesson1');
    expect(lesson?.name).toBe('First Lesson');
  });

  it('should get all paths', () => {
    const paths = curriculumService.getAllPaths();
    
    expect(paths).toHaveLength(1);
    expect(paths[0].id).toBe('beginner-path');
  });

  it('should get paths by track ID', () => {
    const paths = curriculumService.getPathsByTrackId('vscode');
    
    expect(paths).toHaveLength(1);
    expect(paths[0].id).toBe('beginner-path');
  });

  it('should get path by ID', () => {
    const path = curriculumService.getPathById('beginner-path');
    
    expect(path).toBeDefined();
    expect(path?.id).toBe('beginner-path');
    expect(path?.name).toBe('Beginner Path');
  });

  it('should find path node by ID', () => {
    const node = curriculumService.findPathNodeById('node1');
    
    expect(node).toBeDefined();
    expect(node?.id).toBe('node1');
    expect(node?.type).toBe('lesson');
  });

  it('should get all shortcuts', () => {
    const shortcuts = curriculumService.getAllShortcuts();
    
    expect(shortcuts).toHaveLength(2);
    expect(shortcuts[0].id).toBe('shortcut1');
    expect(shortcuts[1].id).toBe('shortcut2');
  });

  it('should get next path node', () => {
    const nextNode = curriculumService.getNextPathNode('beginner-path', 'node1');
    
    expect(nextNode).toBeDefined();
    expect(nextNode?.id).toBe('node2');
    expect(nextNode?.lessonId).toBe('lesson2');
  });
}); 