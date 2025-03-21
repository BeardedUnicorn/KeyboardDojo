import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EnhancedQuizExercise from '../../components/exercises/EnhancedQuizExercise';
import type { QuizOption } from '../../utils/quizUtils';

// Define proper FeedbackMessage type with optional hint
interface ExtendedFeedbackMessage {
  message: string;
  mascotReaction?: string;
  hint?: string;
}

// Mock callback functions for stories
const onSuccessMock = () => {
  // Use empty function to avoid console spam during testing
};

const onFailureMock = () => {
  // Use empty function to avoid console spam during testing
};

// Define metadata for the EnhancedQuizExercise stories
const meta = {
  title: 'Exercises/EnhancedQuizExercise',
  component: EnhancedQuizExercise,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the quiz exercise',
    },
    question: {
      control: 'text',
      description: 'The question being asked',
    },
    options: {
      control: 'object',
      description: 'The answer options for the quiz',
    },
    difficulty: {
      control: 'select',
      options: ['beginner', 'intermediate', 'advanced', 'expert'],
      description: 'The difficulty level of the exercise',
    },
    timeLimit: {
      control: 'number',
      description: 'Time limit in seconds (0 means no limit)',
    },
    explanation: {
      control: 'text',
      description: 'Additional explanation for the answer',
    },
    imageUrl: {
      control: 'text',
      description: 'Optional image URL to display with the question',
    },
    onSuccess: { action: 'success' },
    onFailure: { action: 'failure' },
  },
} satisfies Meta<typeof EnhancedQuizExercise>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample quiz options
const sampleOptions: QuizOption[] = [
  { id: 'a', text: 'console.log()', isCorrect: true },
  { id: 'b', text: 'print()', isCorrect: false },
  { id: 'c', text: 'System.out.println()', isCorrect: false },
  { id: 'd', text: 'cout <<', isCorrect: false },
];

// Define the primary story with default args
export const Default: Story = {
  args: {
    title: 'JavaScript Basics Quiz',
    question: 'Which method is used to output messages to the console in JavaScript?',
    options: sampleOptions,
    difficulty: 'beginner',
    timeLimit: 0, // No time limit
    explanation: 'console.log() is a function in JavaScript used to print output to the developer console.',
    feedbackSuccess: {
      message: 'Great job! That\'s correct!',
      mascotReaction: 'You\'re getting good at this!',
    },
    feedbackFailure: {
      message: 'Not quite right. Try again!',
      mascotReaction: 'Don\'t worry, learning takes practice!',
    },
    onSuccess: onSuccessMock,
    onFailure: onFailureMock,
  },
};

// Story with time limit
export const WithTimeLimit: Story = {
  args: {
    ...Default.args,
    title: 'Timed JavaScript Quiz',
    timeLimit: 30, // 30 seconds time limit
  },
};

// Multiple choice quiz with image
export const WithImage: Story = {
  args: {
    ...Default.args,
    title: 'Visual JavaScript Quiz',
    question: 'What does this code snippet output to the console?',
    imageUrl: 'https://via.placeholder.com/400x200?text=JavaScript+Code+Snippet',
    options: [
      { id: 'a', text: '5', isCorrect: false },
      { id: 'b', text: '10', isCorrect: true },
      { id: 'c', text: '15', isCorrect: false },
      { id: 'd', text: 'undefined', isCorrect: false },
    ],
  },
};

// Advanced difficulty quiz
export const AdvancedQuiz: Story = {
  args: {
    title: 'Advanced JavaScript Concepts',
    question: 'Which of the following statements about closures in JavaScript is NOT true?',
    options: [
      { id: 'a', text: 'Closures have access to variables in their outer scope', isCorrect: false },
      { id: 'b', text: 'Closures can access variables from parent functions after they have returned', isCorrect: false },
      { id: 'c', text: 'Closures capture variables by reference', isCorrect: false },
      { id: 'd', text: 'Closures prevent variables from being garbage collected by the browser', isCorrect: true },
    ],
    difficulty: 'advanced',
    timeLimit: 60,
    explanation: 'Closures don\'t prevent garbage collection in all cases. In fact, they can lead to memory leaks if not handled carefully, but they don\'t inherently prevent garbage collection.',
    feedbackSuccess: {
      message: 'Excellent! You understand closures well!',
      mascotReaction: 'That was a tricky one!',
    },
    feedbackFailure: {
      message: 'Not quite right. Closures are a complex topic.',
      mascotReaction: 'JavaScript closures can be confusing!',
    },
    onSuccess: onSuccessMock,
    onFailure: onFailureMock,
  },
};

// Fill-in-blank style quiz
export const FillInBlank: Story = {
  args: {
    title: 'Complete the Code',
    question: 'Which array method should be used to add items to the beginning of an array?',
    options: [
      { id: 'a', text: 'array.push()', isCorrect: false },
      { id: 'b', text: 'array.unshift()', isCorrect: true },
      { id: 'c', text: 'array.concat()', isCorrect: false },
      { id: 'd', text: 'array.splice()', isCorrect: false },
    ],
    difficulty: 'intermediate',
    explanation: 'The unshift() method adds one or more elements to the beginning of an array and returns the new length of the array.',
    feedbackSuccess: {
      message: 'Correct! unshift() adds elements to the beginning of an array.',
      mascotReaction: 'You know your array methods!',
    },
    feedbackFailure: {
      message: 'Not quite. Try to remember which method specifically adds to the beginning.',
      mascotReaction: 'Array methods can be confusing!',
    },
    onSuccess: onSuccessMock,
    onFailure: onFailureMock,
  },
};
