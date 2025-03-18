import { loggerService } from './loggerService';

import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { ShortcutCategory } from '@/types/curriculum/ShortcutCategory';
import type { ISpacedRepetitionSystem } from '@/types/progress/ICurriculum';

/**
 * Performance rating for a review
 * - again: User failed to recall the shortcut
 * - hard: User recalled with significant difficulty
 * - good: User recalled with some effort
 * - easy: User recalled with no difficulty
 */
export type PerformanceRating = 'again' | 'hard' | 'good' | 'easy';

/**
 * Shortcut review item with spaced repetition metadata
 */
export interface ShortcutReviewItem {
  shortcutId: string;
  easeFactor: number; // 1.3 to 2.5
  interval: number; // days
  nextReviewDate: string;
  reviewHistory: {
    date: string;
    performance: PerformanceRating;
  }[];
}

/**
 * Review session configuration
 */
export interface ReviewSessionConfig {
  maxItems?: number;
  includeCategories?: ShortcutCategory[];
  includeDifficulties?: DifficultyLevel[];
  focusOnDifficult?: boolean;
}

/**
 * Review session
 */
export interface ReviewSession {
  id: string;
  date: string;
  shortcuts: IShortcut[];
  completed: boolean;
  results?: {
    shortcutId: string;
    performance: PerformanceRating;
    responseTime: number; // milliseconds
  }[];
}

/**
 * SpacedRepetitionService
 *
 * Implements the SM-2 algorithm for spaced repetition of shortcuts.
 * This service manages the scheduling of shortcut reviews based on user performance.
 */
class SpacedRepetitionService {
  private system: ISpacedRepetitionSystem = {
    shortcuts: [],
  };

  /**
   * Initialize the spaced repetition system
   * @param shortcuts Array of shortcuts to initialize
   */
  public initializeSystem(shortcuts: IShortcut[]): void {
    // Initialize each shortcut with default values
    this.system.shortcuts = shortcuts.map((shortcut) => ({
      shortcutId: shortcut.id,
      easeFactor: 2.5, // Initial ease factor
      interval: 0, // Initial interval (0 days means new)
      nextReviewDate: new Date().toISOString(), // Review immediately
      reviewHistory: [], // No review history yet
    }));
  }

  /**
   * Get the current spaced repetition system
   */
  public getSystem(): ISpacedRepetitionSystem {
    return this.system;
  }

  /**
   * Set the spaced repetition system (e.g., when loading from storage)
   */
  public setSystem(system: ISpacedRepetitionSystem): void {
    this.system = system;
  }

  /**
   * Get shortcuts due for review
   * @param config Review session configuration
   * @returns Array of shortcut IDs due for review
   */
  public getShortcutsDueForReview(config?: ReviewSessionConfig): string[] {
    const now = new Date();

    // Filter shortcuts due for review
    let dueShortcuts = this.system.shortcuts.filter((item) => {
      const nextReviewDate = new Date(item.nextReviewDate);
      return nextReviewDate <= now;
    });

    // Apply additional filters if provided
    if (config) {
      if (config.includeCategories && config.includeCategories.length > 0) {
        // This requires access to the actual shortcuts, which we'd need to get from another service
        // For now, we'll leave this as a placeholder
      }

      if (config.includeDifficulties && config.includeDifficulties.length > 0) {
        // Similar placeholder for difficulty filtering
      }

      if (config.focusOnDifficult) {
        // Sort by ease factor (ascending)
        dueShortcuts.sort((a, b) => a.easeFactor - b.easeFactor);
      }

      // Limit the number of items if specified
      if (config.maxItems && config.maxItems > 0) {
        dueShortcuts = dueShortcuts.slice(0, config.maxItems);
      }
    }

    return dueShortcuts.map((item) => item.shortcutId);
  }

  /**
   * Record the result of a shortcut review and update its scheduling
   * @param shortcutId ID of the reviewed shortcut
   * @param performance Performance rating
   * @param responseTime Response time in milliseconds
   */
  public recordReview(
    shortcutId: string,
    performance: PerformanceRating,
    responseTime: number,
  ): void {
    const shortcutIndex = this.system.shortcuts.findIndex(
      (item) => item.shortcutId === shortcutId,
    );

    if (shortcutIndex === -1) {
      loggerService.error(`Shortcut with ID ${shortcutId} not found in spaced repetition system`, null, {
        component: 'SpacedRepetitionService',
        shortcutId,
        performance,
        responseTime,
      });
      return;
    }

    const shortcut = this.system.shortcuts[shortcutIndex];

    // Record the review
    shortcut.reviewHistory.push({
      date: new Date().toISOString(),
      performance,
    });

    // Update ease factor and interval based on SM-2 algorithm
    this.updateScheduling(shortcut, performance);

    // Update the shortcut in the system
    this.system.shortcuts[shortcutIndex] = shortcut;
  }

  /**
   * Update the scheduling of a shortcut based on the SM-2 algorithm
   * @param shortcut Shortcut review item
   * @param performance Performance rating
   */
  private updateScheduling(
    shortcut: ShortcutReviewItem,
    performance: PerformanceRating,
  ): void {
    // Convert performance rating to numeric quality (0-5)
    let quality: number;
    switch (performance) {
      case 'again': quality = 0; break;
      case 'hard': quality = 3; break;
      case 'good': quality = 4; break;
      case 'easy': quality = 5; break;
      default: quality = 0;
    }

    // Calculate new ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const oldEF = shortcut.easeFactor;
    let newEF = oldEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // Ensure ease factor stays within bounds
    newEF = Math.max(1.3, newEF);
    shortcut.easeFactor = newEF;

    // Calculate new interval
    if (quality < 3) {
      // If quality is less than 3, reset interval to 0 (relearn)
      shortcut.interval = 0;
    } else {
      // Otherwise, calculate new interval based on previous interval
      if (shortcut.interval === 0) {
        shortcut.interval = 1; // First successful review
      } else if (shortcut.interval === 1) {
        shortcut.interval = 6; // Second successful review
      } else {
        // Subsequent reviews: I(n) = I(n-1) * EF
        shortcut.interval = Math.round(shortcut.interval * shortcut.easeFactor);
      }
    }

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + shortcut.interval);
    shortcut.nextReviewDate = nextReviewDate.toISOString();
  }

  /**
   * Create a new review session
   * @param config Review session configuration
   * @returns New review session
   */
  public createReviewSession(config?: ReviewSessionConfig): ReviewSession {
    const dueShortcutIds = this.getShortcutsDueForReview(config);

    // This would normally fetch the actual shortcuts from another service
    // For now, we'll just create a placeholder
    const shortcuts: IShortcut[] = dueShortcutIds.map((id) => ({
      id,
      name: `Shortcut ${id}`,
      shortcutWindows: 'Ctrl+X',
      category: 'navigation',
    }));

    return {
      id: `review-${Date.now()}`,
      date: new Date().toISOString(),
      shortcuts,
      completed: false,
    };
  }

  /**
   * Complete a review session
   * @param session Review session
   * @param results Review results
   */
  public completeReviewSession(
    session: ReviewSession,
    results: { shortcutId: string; performance: PerformanceRating; responseTime: number }[],
  ): void {
    // Record each review result
    results.forEach((result) => {
      this.recordReview(result.shortcutId, result.performance, result.responseTime);
    });

    // Update the session
    session.completed = true;
    session.results = results;
  }

  /**
   * Get statistics about the spaced repetition system
   */
  public getStatistics() {
    const totalShortcuts = this.system.shortcuts.length;
    const dueShortcuts = this.getShortcutsDueForReview().length;

    // Calculate average ease factor
    const totalEaseFactor = this.system.shortcuts.reduce(
      (sum, item) => sum + item.easeFactor,
      0,
    );
    const averageEaseFactor = totalShortcuts > 0
      ? totalEaseFactor / totalShortcuts
      : 0;

    // Calculate mastery level (higher ease factor = higher mastery)
    const masteryLevel = Math.min(100, Math.round((averageEaseFactor - 1.3) / 1.2 * 100));

    return {
      totalShortcuts,
      dueShortcuts,
      averageEaseFactor,
      masteryLevel,
    };
  }
}

export const spacedRepetitionService = new SpacedRepetitionService();
export default spacedRepetitionService;
