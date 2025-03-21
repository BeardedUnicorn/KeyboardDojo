/**
 * Script to update baseline images for visual regression testing
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

// Use direct path references instead of ES module approach
const baselineDir = path.join(process.cwd(), 'src/tests/visual-regression/baseline');

// Ensure baseline directory exists
if (!fs.existsSync(baselineDir)) {
  fs.mkdirSync(baselineDir, { recursive: true });
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

// Configuration
const imageExtension = 'png';
const viewportWidth = 1280;
const viewportHeight = 720;
const TIMEOUT = 45000;
const NAVIGATION_TIMEOUT = 60000;

// Sleep function for waiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main function to update baseline images
async function updateBaselines() {
  console.log('Starting baseline image update...');
  
  // Launch browser
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: viewportWidth, height: viewportHeight });
  page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);
  
  try {
    // Process each component
    for (const componentId of criticalComponents) {
      console.log(`Updating baseline for ${componentId}...`);
      
      // Navigate to the story
      const storyUrl = `http://localhost:6006/?path=/story/${componentId}`;
      console.log(`  Navigating to: ${storyUrl}`);
      await page.goto(storyUrl, { 
        waitUntil: 'networkidle0',
        timeout: NAVIGATION_TIMEOUT
      });
      
      // Wait for the story to render
      await page.waitForSelector('#root', { timeout: TIMEOUT });
      
      // Give extra time for animations to complete
      await sleep(1000);
      
      // Take screenshot and save as baseline
      const screenshotPath = path.join(baselineDir, `${componentId}.${imageExtension}`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      
      console.log(`  ✅ Baseline updated: ${screenshotPath}`);
    }
    
    console.log('\nBaseline update complete! ✨');
  } catch (error) {
    console.error(`Error updating baselines: ${error.message}`);
    process.exit(1);
  } finally {
    // Close browser
    await browser.close();
  }
}

// Check if Storybook is running
async function checkStorybookRunning() {
  try {
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:6006', { timeout: 10000 });
    await browser.close();
    return true;
  } catch (error) {
    console.error('❌ Error: Storybook must be running on http://localhost:6006');
    console.error('Please start Storybook with: yarn storybook');
    return false;
  }
}

// Run the script
(async () => {
  const isRunning = await checkStorybookRunning();
  if (isRunning) {
    await updateBaselines();
  } else {
    process.exit(1);
  }
})(); 