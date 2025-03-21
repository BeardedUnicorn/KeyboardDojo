import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import CodeExercise from '../../components/exercises/CodeExercise';

// Mock callback functions for stories
const onSuccessMock = () => {
  console.log('Code exercise completed successfully');
};

const onFailureMock = () => {
  console.log('Code exercise attempt failed');
};

// Define metadata for the CodeExercise stories
const meta = {
  title: 'Exercises/CodeExercise',
  component: CodeExercise,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    instructions: {
      control: 'text',
      description: 'Instructions for the exercise',
    },
    initialCode: {
      control: 'text',
      description: 'Initial code provided to the user',
    },
    expectedOutput: {
      control: 'text',
      description: 'Expected output of the code',
    },
    onSuccess: { action: 'success' },
    onFailure: { action: 'failure' },
  },
} satisfies Meta<typeof CodeExercise>;

export default meta;
type Story = StoryObj<typeof meta>;

// Define the primary story with default args
export const Default: Story = {
  args: {
    instructions: 'Write a function that logs "Hello, World!" to the console.',
    initialCode: 'function sayHello() {\n  // Your code here\n}\n\nsayHello();',
    expectedOutput: 'Hello, World!',
    onSuccess: onSuccessMock,
    onFailure: onFailureMock,
  },
};

// Add two numbers example
export const AddTwoNumbers: Story = {
  args: {
    instructions: 'Complete the function to add two numbers and log the result to the console.',
    initialCode: 'function add(a, b) {\n  // Your code here\n}\n\nadd(5, 3);',
    expectedOutput: '8',
    onSuccess: onSuccessMock,
    onFailure: onFailureMock,
  },
};

// String manipulation example
export const StringManipulation: Story = {
  args: {
    instructions: 'Write code to reverse the string "JavaScript" and log the result.',
    initialCode: 'const str = "JavaScript";\n\n// Your code here',
    expectedOutput: 'tpircSavaJ',
    onSuccess: onSuccessMock,
    onFailure: onFailureMock,
  },
};

// Array filtering example
export const ArrayFiltering: Story = {
  args: {
    instructions: 'Filter the array to only include even numbers and log the result.',
    initialCode: 'const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n// Your code here',
    expectedOutput: '2,4,6,8,10',
    onSuccess: onSuccessMock,
    onFailure: onFailureMock,
  },
};
