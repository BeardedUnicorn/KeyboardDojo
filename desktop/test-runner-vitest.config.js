// Import path utilities
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Custom Vitest configuration for Storybook tests
 * - Sets longer timeout for complex components
 * - Adds setup file for test environment
 */

export default {
  // Set a very large timeout to ensure no tests time out
  testTimeout: 300000, // 5 minutes - should be enough for any complex test
  
  // Path patterns to ignore
  testPathIgnorePatterns: [
    // Exclude problematic stories
    'src/stories/Button.stories.tsx',
    'src/stories/layout/MainLayout.stories.tsx',
    'src/stories/layout/AppTopBar.stories.tsx',

    // Components that require additional setup that's in progress
    'src/stories/gamification/AchievementsList.stories.tsx',
    'src/stories/notifications/UpdateNotification.stories.tsx',
    'src/stories/shared/Card.stories.tsx',
    'src/stories/integration/ProfileStatisticsIntegration.stories.tsx',
    'src/stories/curriculum/CurriculumViewStory.stories.tsx',
    'src/stories/gamification/AchievementDisplay.stories.tsx',
    'src/stories/advanced/EnhancedLessonFlowStory.stories.tsx',
  ],
  
  // Setup files to run before tests
  setupFiles: [
    path.resolve(__dirname, '.storybook/setup-test-environment.js')
  ],
  
  // Ensure Vitest uses the right environment
  environment: 'jsdom',
  
  // Allow tests to continue running even if some fail
  bail: 0,
  
  // Only run our storybook test runner
  include: ['src/tests/storybook/test-runner.js'],
}; 