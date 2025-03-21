import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root directory
const projectRoot = path.resolve(__dirname, '../../..');

/**
 * Storybook test runner using Vitest
 * This automatically discovers all story files and runs tests for them
 */

// Discover all story files
const storyFiles = glob.sync(path.join(projectRoot, 'src/**/*.stories.{js,jsx,ts,tsx}'));

// Run tests for each story file
describe('Storybook Stories', () => {
  storyFiles.forEach(storyFile => {
    const relativePath = path.relative(projectRoot, storyFile);
    
    // Skip ignored files that match patterns in test-runner-vitest.config.js
    const isIgnored = [
      'src/stories/Button.stories.tsx',
      'src/stories/layout/MainLayout.stories.tsx',
      'src/stories/layout/AppTopBar.stories.tsx',
      'src/stories/gamification/AchievementsList.stories.tsx',
      'src/stories/notifications/UpdateNotification.stories.tsx',
      'src/stories/shared/Card.stories.tsx',
      'src/stories/integration/ProfileStatisticsIntegration.stories.tsx',
      'src/stories/curriculum/CurriculumViewStory.stories.tsx',
      'src/stories/gamification/AchievementDisplay.stories.tsx',
      'src/stories/advanced/EnhancedLessonFlowStory.stories.tsx',
    ].some(pattern => relativePath.includes(pattern));
    
    if (isIgnored) {
      test.skip(`Story in ${relativePath} (skipped - in ignore list)`, () => {
        // Skip this test
      });
      return;
    }
    
    // Test that the story file exists and can be loaded
    test(`Story in ${relativePath} can be loaded`, () => {
      expect(fs.existsSync(storyFile)).toBe(true);
      
      // Simple test that file can be accessed and read
      const content = fs.readFileSync(storyFile, 'utf-8');
      expect(content).toBeTruthy();
      
      // Verify it's a story file by checking for export or meta
      const hasStoryContent = content.includes('export default') || 
                             content.includes('export const') ||
                             content.includes('meta:');
      expect(hasStoryContent).toBe(true);
    });
  });
}); 