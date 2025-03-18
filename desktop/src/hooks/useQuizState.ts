import { useState, useEffect, useCallback } from 'react';

import { 
  playQuizResultSound, 
  findCorrectOption, 
  convertStringOptionsToObjects, 
} from '../utils/quizUtils';

import type { 
  QuizOption, 
  FeedbackMessage } from '../utils/quizUtils';

interface QuizStateOptions {
  /**
   * The quiz options
   */
  options: string[] | QuizOption[];
  
  /**
   * The index of the correct option (only used if options are strings)
   */
  correctAnswerIndex?: number;
  
  /**
   * Time limit in seconds (0 means no time limit)
   */
  timeLimit?: number;
  
  /**
   * Whether to play sounds on success/failure
   */
  playSounds?: boolean;
  
  /**
   * Callback when the quiz is answered correctly
   */
  onSuccess?: () => void;
  
  /**
   * Callback when the quiz is answered incorrectly
   */
  onFailure?: () => void;
  
  /**
   * Feedback message for success
   */
  feedbackSuccess?: FeedbackMessage;
  
  /**
   * Feedback message for failure
   */
  feedbackFailure?: FeedbackMessage;
}

/**
 * Custom hook for managing quiz state
 * 
 * @param options Configuration options
 * @returns Object with quiz state and methods
 */
export const useQuizState = (options: QuizStateOptions) => {
  // Convert string options to QuizOption objects if needed
  const quizOptions: QuizOption[] = Array.isArray(options.options) && options.options.length > 0 && typeof options.options[0] === 'string'
    ? convertStringOptionsToObjects(options.options as string[], options.correctAnswerIndex || 0)
    : options.options as QuizOption[];
  
  const {
    timeLimit = 0,
    playSounds = true,
    onSuccess,
    onFailure,
    feedbackSuccess = { message: 'Correct! Well done!' },
    feedbackFailure = { message: 'Incorrect. Try again!' },
  } = options;
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [mascotMessage, setMascotMessage] = useState('');
  const [showMascot, setShowMascot] = useState(false);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isTimerActive, setIsTimerActive] = useState(timeLimit > 0);
  
  // Get the correct option
  const correctOption = findCorrectOption(quizOptions);
  
  // Handle timer countdown
  useEffect(() => {
    if (!isTimerActive || timeLimit <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isTimerActive, timeLimit]);
  
  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (isSubmitted) return;
    
    // Play error sound
    if (playSounds) {
      playQuizResultSound(false);
    }
    
    // Show failure feedback
    setFeedback({
      message: 'Time\'s up! You didn\'t answer in time.',
      isSuccess: false,
    });
    
    // Show mascot reaction if available
    if (feedbackFailure.mascotReaction) {
      setMascotMessage(feedbackFailure.mascotReaction);
      setShowMascot(true);
    }
    
    // Call onFailure callback
    if (onFailure) {
      onFailure();
    }
    
    setIsSubmitted(true);
  }, [isSubmitted, playSounds, feedbackFailure, onFailure]);
  
  // Handle option selection
  const handleOptionSelect = useCallback((optionId: string) => {
    if (isSubmitted) return;
    setSelectedOption(optionId);
  }, [isSubmitted]);
  
  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!selectedOption || isSubmitted) return;
    
    // Stop the timer
    setIsTimerActive(false);
    
    // Increment attempts
    setAttempts((prev) => prev + 1);
    
    // Find the selected option
    const selected = quizOptions.find((option) => option.id === selectedOption);
    const isAnswerCorrect = selected?.isCorrect || false;
    
    // Set correct state
    setIsCorrect(isAnswerCorrect);
    
    // Play sound
    if (playSounds) {
      playQuizResultSound(isAnswerCorrect);
    }
    
    // Show feedback
    setFeedback({
      message: isAnswerCorrect ? feedbackSuccess.message : feedbackFailure.message,
      isSuccess: isAnswerCorrect,
    });
    
    // Show animation if correct
    if (isAnswerCorrect) {
      setShowAnimation(true);
    }
    
    // Show mascot message if available
    if (isAnswerCorrect && feedbackSuccess.mascotReaction) {
      setMascotMessage(feedbackSuccess.mascotReaction);
      setShowMascot(true);
    } else if (!isAnswerCorrect && feedbackFailure.mascotReaction) {
      setMascotMessage(feedbackFailure.mascotReaction);
      setShowMascot(true);
    }
    
    // Show explanation after second attempt or if correct
    if (isAnswerCorrect || attempts >= 1) {
      setShowExplanation(true);
    }
    
    // Call appropriate callback
    if (isAnswerCorrect && onSuccess) {
      onSuccess();
    } else if (!isAnswerCorrect && onFailure) {
      onFailure();
    }
    
    setIsSubmitted(true);
  }, [
    selectedOption, 
    isSubmitted, 
    quizOptions, 
    playSounds, 
    feedbackSuccess, 
    feedbackFailure, 
    attempts, 
    onSuccess, 
    onFailure,
  ]);
  
  // Reset the quiz state
  const resetQuiz = useCallback(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setFeedback(null);
    setShowExplanation(false);
    setShowAnimation(false);
    setMascotMessage('');
    setShowMascot(false);
    setTimeRemaining(timeLimit);
    setIsTimerActive(timeLimit > 0);
  }, [timeLimit]);
  
  return {
    // State
    selectedOption,
    isSubmitted,
    isCorrect,
    attempts,
    feedback,
    showExplanation,
    showAnimation,
    mascotMessage,
    showMascot,
    timeRemaining,
    isTimerActive,
    quizOptions,
    correctOption,
    
    // Methods
    handleOptionSelect,
    handleSubmit,
    resetQuiz,
    
    // Setters
    setShowExplanation,
    setShowAnimation,
    setShowMascot,
  };
}; 
