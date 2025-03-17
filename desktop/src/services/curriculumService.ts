/**
 * Curriculum Service
 * 
 * This service manages the curriculum data, including application tracks,
 * lessons, and user progress.
 */

import { 
  Curriculum, 
  ApplicationTrack, 
  Module, 
  Lesson, 
  Shortcut,
  ApplicationType,
  UserProgress,
  MasteryChallenge,
  CurriculumType,
  CurriculumMetadata,
  LessonStep,
  LessonStepType
} from '../types/curriculum';

// Import sample data
import { vscodeTrack } from '../data/vscode-track';
import { intellijTrack } from '../data/intellij-track';
import { cursorTrack } from '../data/cursor-track';

class CurriculumService {
  private curriculums: Curriculum[];
  private activeCurriculumId: string;
  private userProgress: UserProgress | null = null;
  
  constructor() {
    // Initialize with IDE shortcuts curriculum
    const ideShortcutsCurriculum: Curriculum = {
      id: 'ide-shortcuts-2023',
      metadata: {
        id: 'ide-shortcuts-2023',
        name: 'IDE Shortcuts Mastery',
        description: 'Master keyboard shortcuts for popular code editors',
        type: CurriculumType.IDE_SHORTCUTS,
        icon: 'keyboard',
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        author: 'Keyboard Dojo Team',
        tags: ['shortcuts', 'productivity', 'ide'],
        isActive: true,
        isDefault: true
      },
      tracks: [vscodeTrack, intellijTrack, cursorTrack]
    };
    
    this.curriculums = [ideShortcutsCurriculum];
    this.activeCurriculumId = ideShortcutsCurriculum.id;
  }
  
  /**
   * Get all available curriculums
   */
  getAllCurriculums(): Curriculum[] {
    return this.curriculums;
  }
  
  /**
   * Get curriculum metadata for all curriculums
   */
  getCurriculumMetadata(): CurriculumMetadata[] {
    return this.curriculums.map(curriculum => curriculum.metadata);
  }
  
  /**
   * Get a specific curriculum by ID
   */
  getCurriculumById(curriculumId: string): Curriculum | undefined {
    return this.curriculums.find(curriculum => curriculum.id === curriculumId);
  }
  
  /**
   * Get the active curriculum
   */
  getActiveCurriculum(): Curriculum {
    const activeCurriculum = this.curriculums.find(
      curriculum => curriculum.id === this.activeCurriculumId
    );
    
    if (!activeCurriculum) {
      // Fallback to the first curriculum if active one is not found
      return this.curriculums[0];
    }
    
    return activeCurriculum;
  }
  
  /**
   * Set the active curriculum
   */
  setActiveCurriculum(curriculumId: string): boolean {
    const curriculumExists = this.curriculums.some(
      curriculum => curriculum.id === curriculumId
    );
    
    if (curriculumExists) {
      this.activeCurriculumId = curriculumId;
      return true;
    }
    
    return false;
  }
  
  /**
   * Register a new curriculum
   */
  registerCurriculum(curriculum: Curriculum): boolean {
    // Check if curriculum with same ID already exists
    const exists = this.curriculums.some(c => c.id === curriculum.id);
    
    if (exists) {
      return false;
    }
    
    this.curriculums.push(curriculum);
    return true;
  }
  
  /**
   * Update an existing curriculum
   */
  updateCurriculum(curriculum: Curriculum): boolean {
    const index = this.curriculums.findIndex(c => c.id === curriculum.id);
    
    if (index === -1) {
      return false;
    }
    
    this.curriculums[index] = curriculum;
    return true;
  }
  
  /**
   * Get all application tracks from the active curriculum
   */
  getApplicationTracks(): ApplicationTrack[] {
    return this.getActiveCurriculum().tracks;
  }
  
  /**
   * Get a specific application track by ID from the active curriculum
   */
  getApplicationTrack(trackId: ApplicationType): ApplicationTrack | undefined {
    return this.getActiveCurriculum().tracks.find(track => track.id === trackId);
  }
  
  /**
   * Get all modules for a specific application track
   */
  getModules(trackId: ApplicationType): Module[] {
    const track = this.getApplicationTrack(trackId);
    return track ? track.modules : [];
  }
  
  /**
   * Get a specific module by ID
   */
  getModule(trackId: ApplicationType, moduleId: string): Module | undefined {
    const modules = this.getModules(trackId);
    return modules.find(module => module.id === moduleId);
  }
  
  /**
   * Get all lessons for a specific module
   */
  getLessons(trackId: ApplicationType, moduleId: string): Lesson[] {
    const module = this.getModule(trackId, moduleId);
    return module ? module.lessons : [];
  }
  
  /**
   * Get a specific lesson by ID
   */
  getLesson(curriculumId: string, trackId: ApplicationType, lessonId: string): Lesson | undefined {
    // Find the curriculum
    const curriculum = this.getCurriculumById(curriculumId);
    if (!curriculum) return undefined;
    
    // Find the track
    const track = curriculum.tracks.find(t => t.id === trackId);
    if (!track) return undefined;
    
    // Search through all modules to find the lesson
    for (const module of track.modules) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) {
        // If the lesson doesn't have steps, create some sample steps
        if (!lesson.steps || lesson.steps.length === 0) {
          lesson.steps = this.createSampleSteps(lesson);
        }
        return lesson;
      }
    }
    
    return undefined;
  }
  
  /**
   * Create sample steps for a lesson (for demo purposes)
   */
  private createSampleSteps(lesson: Lesson): LessonStep[] {
    const steps: LessonStep[] = [];
    
    // Add a text step
    steps.push({
      id: `${lesson.id}-step-1`,
      title: 'Introduction',
      type: LessonStepType.TEXT,
      description: `Welcome to the lesson on ${lesson.title}. In this lesson, you will learn about various shortcuts related to ${lesson.category}.`
    });
    
    // Add shortcut steps based on the lesson's shortcuts
    lesson.shortcuts.forEach((shortcut, index) => {
      steps.push({
        id: `${lesson.id}-step-${index + 2}`,
        title: shortcut.name,
        type: LessonStepType.SHORTCUT,
        description: shortcut.description,
        instructions: `Try using the ${shortcut.name} shortcut. ${shortcut.context || ''}`,
        shortcut: {
          windows: shortcut.shortcutWindows,
          mac: shortcut.shortcutMac || shortcut.shortcutWindows,
          linux: shortcut.shortcutLinux || shortcut.shortcutWindows
        }
      });
    });
    
    // Add a quiz step
    steps.push({
      id: `${lesson.id}-step-${lesson.shortcuts.length + 2}`,
      title: 'Knowledge Check',
      type: LessonStepType.QUIZ,
      description: 'Let\'s test your knowledge of the shortcuts you just learned.',
      question: `Which shortcut is used for ${lesson.shortcuts[0].name}?`,
      options: [
        lesson.shortcuts[0].shortcutWindows,
        'Ctrl+X',
        'Alt+F4',
        'Shift+Tab'
      ],
      correctAnswer: 0
    });
    
    return steps;
  }
  
  /**
   * Get user progress
   */
  getUserProgress(): UserProgress | null {
    return this.userProgress;
  }
  
  /**
   * Set user progress
   */
  setUserProgress(progress: UserProgress): void {
    this.userProgress = progress;
  }
  
  /**
   * Check if a module is unlocked
   */
  isModuleUnlocked(trackId: ApplicationType, moduleId: string): boolean {
    // For demo purposes, all modules are unlocked
    return true;
  }
  
  /**
   * Check if a lesson is unlocked
   */
  isLessonUnlocked(trackId: ApplicationType, moduleId: string, lessonId: string): boolean {
    // For demo purposes, all lessons are unlocked
    return true;
  }
}

// Export singleton instance
export const curriculumService = new CurriculumService(); 