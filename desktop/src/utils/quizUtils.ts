/**
 * Quiz Utilities
 *
 * This file contains shared utilities for quiz functionality across the application.
 * It was created as part of the codebase cleanup to extract common functionality from
 * QuizExercisex and EnhancedQuizExercisex components.
 *
 * The refactoring included:
 * 1. Creating shared interfaces for quiz options, feedback messages, and results
 * 2. Extracting common functions for checking correct options, formatting time, etc.
 * 3. Creating a custom hook (useQuizState) to manage quiz state and interactions
 * 4. Updating both QuizExercise components to use the shared utilities and hook
 */

import { audioService } from '../services';

/**
 * Quiz option interface
 */
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

/**
 * Feedback message interface
 */
export interface FeedbackMessage {
  message: string;
  mascotReaction?: string;
}

/**
 * Quiz result interface
 */
export interface QuizResult {
  isCorrect: boolean;
  selectedOptionId: string;
  correctOptionId: string;
  timeTaken?: number; // in seconds
  attemptsCount: number;
}

/**
 * Checks if an option is correct
 * @param option The option to check
 * @returns Whether the option is correct
 */
export const isCorrectOption = (option: QuizOption): boolean => {
  return option.isCorrect;
};

/**
 * Finds the correct option in a list of options
 * @param options The list of options
 * @returns The correct option or undefined if none is correct
 */
export const findCorrectOption = (options: QuizOption[]): QuizOption | undefined => {
  return options.find(isCorrectOption);
};

/**
 * Finds the index of the correct option in a list of options
 * @param options The list of options
 * @returns The index of the correct option or -1 if none is correct
 */
export const findCorrectOptionIndex = (options: QuizOption[]): number => {
  return options.findIndex(isCorrectOption);
};

/**
 * Converts string options to QuizOption objects
 * @param options The string options
 * @param correctIndex The index of the correct option
 * @returns The converted QuizOption objects
 */
export const convertStringOptionsToObjects = (
  options: string[],
  correctIndex: number,
): QuizOption[] => {
  return options.map((text, index) => ({
    id: index.toString(),
    text,
    isCorrect: index === correctIndex,
  }));
};

/**
 * Plays the appropriate sound for a quiz result
 * @param isCorrect Whether the answer is correct
 */
export const playQuizResultSound = (isCorrect: boolean): void => {
  if (isCorrect) {
    audioService.playSound('success');
  } else {
    audioService.playSound('error');
  }
};

/**
 * Formats time in seconds to a readable string (MM:SS)
 * @param seconds The time in seconds
 * @returns The formatted time string
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * Shuffles an array of quiz options
 * @param options The options to shuffle
 * @returns A new array with the shuffled options
 */
export const shuffleOptions = <T>(options: T[]): T[] => {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Calculates a score based on time taken and attempts
 * @param timeTaken The time taken in seconds
 * @param attempts The number of attempts
 * @param timeLimit The time limit in seconds
 * @param maxScore The maximum possible score
 * @returns The calculated score
 */
export const calculateQuizScore = (
  timeTaken: number,
  attempts: number,
  timeLimit: number = 0,
  maxScore: number = 100,
): number => {
  // If there's no time limit, only consider attempts
  if (timeLimit <= 0) {
    return Math.max(maxScore - (attempts - 1) * 25, 0);
  }

  // Calculate time factor (faster = better)
  const timeFactor = Math.max(1 - timeTaken / timeLimit, 0);

  // Calculate attempts factor (fewer = better)
  const attemptsFactor = Math.max(1 - (attempts - 1) * 0.25, 0);

  // Combine factors
  return Math.round(maxScore * timeFactor * attemptsFactor);
};
