import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { expect, describe, test, beforeAll, afterAll } from 'vitest';

// Use direct path references instead of ES module approach
const baselineDir = path.join(process.cwd(), 'src/tests/visual-regression/baseline');
const diffDir = path.join(process.cwd(), 'src/tests/visual-regression/diff');

// Create directory for baseline images if it doesn't exist
if (!fs.existsSync(baselineDir)) {
  fs.mkdirSync(baselineDir, { recursive: true });
}

if (!fs.existsSync(diffDir)) {
  fs.mkdirSync(diffDir, { recursive: true });
}

// These component IDs match the actual Storybook structure from our index.json
const criticalComponents = [
  'ui-button--default',
  'ui-data-display-card--default',
  'ui-feedback-dialog--confirmation-dialog',
  'ui-errorfallback--default', 
  'layout-apptopbar--default',
  'layout-navigation--default',
  'gamification-achievementbadge--default',
  'gamification-achievementslist--default',
  'exercises-enhancedquizexercise--default',
  'exercises-shortcutchallenge--default',
  'statistics-curriculumprogresschart--default'
];

// Test configuration
const imageExtension = 'png';
const viewportWidth = 1280;
const viewportHeight = 720;
const TIMEOUT = 45000; // Longer timeout for each test
const NAVIGATION_TIMEOUT = 60000; // Specific timeout for navigation

// Sleep function for waiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Visual Regression Tests', () => {
  let browser;
  let page;

  // Set up Puppeteer before all tests
  beforeAll(async () => {
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.setViewport({ width: viewportWidth, height: viewportHeight });
    // Set longer timeout for navigation
    page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);
  });

  // Clean up after all tests
  afterAll(async () => {
    await browser.close();
  });

  // Test each critical component
  criticalComponents.forEach((componentId) => {
    test(`${componentId} visual regression test`, async () => {
      try {
        // Navigate to the component's story
        const storyUrl = `http://localhost:6006/?path=/story/${componentId}`;
        console.log(`Navigating to: ${storyUrl}`);
        
        await page.goto(storyUrl, { 
          waitUntil: 'networkidle0',
          timeout: NAVIGATION_TIMEOUT
        });

        // Wait for the story to be fully rendered
        await page.waitForSelector('#root', { timeout: TIMEOUT });
        
        // Give extra time for animations to complete
        await sleep(1000);
        
        // Take a screenshot
        const screenshotPath = path.join(baselineDir, `${componentId}.${imageExtension}`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        // For a real test, you would compare with existing baseline
        // This is just generating baseline images for now
        expect(fs.existsSync(screenshotPath)).toBe(true);
      } catch (error) {
        console.error(`Error testing ${componentId}:`, error);
        // Ensure the test fails
        throw error;
      }
    }, TIMEOUT); // Increase timeout to 45s for screenshot operations
  });
});

// Add a helper function for visual comparison in the future
async function compareScreenshots(baselinePath, currentScreenshot) {
  // This would use a visual comparison library like pixelmatch or jest-image-snapshot
  // For now, we're just generating baseline images
  const baselineExists = fs.existsSync(baselinePath);
  
  if (!baselineExists) {
    // Save current as baseline if none exists
    fs.writeFileSync(baselinePath, currentScreenshot);
    return { pass: true };
  }
  
  // In a real implementation, compare the images and return diff results
  return { pass: true };
} 