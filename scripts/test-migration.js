#!/usr/bin/env node

/**
 * Migration Test Script
 * 
 * This script tests the migration scripts by creating temporary test files
 * and verifying that imports are correctly migrated.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const TEST_DIR = path.join(ROOT_DIR, 'scripts', 'test-migration-files');
const MIGRATE_SCRIPT = path.join(__dirname, 'migrate-imports.js');

// Test cases
const TEST_CASES = [
  {
    name: 'Basic component import',
    file: 'TestComponent.tsx',
    content: `import React from 'react';
import { Button } from '@mui/material';
import { KeyboardVisualizer } from '../../components/KeyboardVisualizer';
import { Typography } from '@mui/material';

const TestComponent = () => {
  return (
    <div>
      <KeyboardVisualizer layout="qwerty" />
      <Button>Click me</Button>
      <Typography>Hello world</Typography>
    </div>
  );
};

export default TestComponent;`,
    expectedImports: [
      `import React from 'react';`,
      `import { Button, Typography } from '@mui/material';`,
      `import { KeyboardVisualizer } from '@keyboard-dojo/shared';`
    ]
  },
  {
    name: 'Multiple component imports',
    file: 'MultipleImports.tsx',
    content: `import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { KeyboardVisualizer } from '../../components/KeyboardVisualizer';
import { ResponsiveLayout } from '../../components/ResponsiveLayout';
import { useTheme } from '@mui/material/styles';

const MultipleImports = () => {
  const theme = useTheme();
  const [state, setState] = useState(false);
  
  useEffect(() => {
    // Do something
  }, []);
  
  return (
    <Container>
      <Box>
        <ResponsiveLayout>
          <KeyboardVisualizer layout="qwerty" />
        </ResponsiveLayout>
      </Box>
    </Container>
  );
};

export default MultipleImports;`,
    expectedImports: [
      `import React, { useState, useEffect } from 'react';`,
      `import { Box, Container } from '@mui/material';`,
      `import { useTheme } from '@mui/material/styles';`,
      `import { KeyboardVisualizer, ResponsiveLayout } from '@keyboard-dojo/shared';`
    ]
  },
  {
    name: 'Utility import',
    file: 'UtilityTest.ts',
    content: `import { formatTime } from '../../utils/formatTime';
import { calculateWPM } from '../../utils/calculateWPM';
import { debounce } from 'lodash';

export function testFunction() {
  const time = formatTime(120);
  const wpm = calculateWPM('test text', 5000);
  const debouncedFn = debounce(() => {}, 300);
  
  return { time, wpm, debouncedFn };
}`,
    expectedImports: [
      `import { formatTime, calculateWPM } from '@keyboard-dojo/shared';`,
      `import { debounce } from 'lodash';`
    ]
  }
];

// Mock inventory content
const MOCK_INVENTORY = `# Component Inventory

## Components

This section lists all components in the shared package and their usage in the frontend.

### Summary

Total components in shared package: 2
Total frontend files using these components: 2

### Detailed Usage Information

#### KeyboardVisualizer

| Frontend File | Current Import |
|---------------|----------------|
| TestComponent.tsx | import { KeyboardVisualizer } from '../../components/KeyboardVisualizer'; |
| MultipleImports.tsx | import { KeyboardVisualizer } from '../../components/KeyboardVisualizer'; |

#### ResponsiveLayout

| Frontend File | Current Import |
|---------------|----------------|
| MultipleImports.tsx | import { ResponsiveLayout } from '../../components/ResponsiveLayout'; |

## Utilities

This section lists all utilities in the shared package and their usage in the frontend.

### Summary

Total utilities in shared package: 2
Total frontend files using these utilities: 1

### Detailed Usage Information

#### formatTime

| Frontend File | Current Import |
|---------------|----------------|
| UtilityTest.ts | import { formatTime } from '../../utils/formatTime'; |

#### calculateWPM

| Frontend File | Current Import |
|---------------|----------------|
| UtilityTest.ts | import { calculateWPM } from '../../utils/calculateWPM'; |
`;

/**
 * Setup test environment
 */
function setup() {
  console.log('Setting up test environment...');
  
  // Create test directory if it doesn't exist
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  } else {
    // Clean up existing test files
    const files = fs.readdirSync(TEST_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(TEST_DIR, file));
    }
  }
  
  // Create test files
  for (const testCase of TEST_CASES) {
    fs.writeFileSync(path.join(TEST_DIR, testCase.file), testCase.content);
  }
  
  // Create mock inventory file
  fs.writeFileSync(path.join(TEST_DIR, 'component-inventory.md'), MOCK_INVENTORY);
  
  console.log(`Created ${TEST_CASES.length} test files in ${TEST_DIR}`);
}

/**
 * Run migration on a test file
 * @param {string} file - Test file name
 * @returns {string} - Migrated file content
 */
function runMigration(file) {
  const filePath = path.join(TEST_DIR, file);
  const inventoryPath = path.join(TEST_DIR, 'component-inventory.md');
  
  // Create a temporary copy of the migration script with modified paths
  const tempScriptPath = path.join(TEST_DIR, 'temp-migrate.js');
  let scriptContent = fs.readFileSync(MIGRATE_SCRIPT, 'utf-8');
  
  // Replace inventory path in the script
  scriptContent = scriptContent.replace(
    /const INVENTORY_FILE = .+;/,
    `const INVENTORY_FILE = '${inventoryPath.replace(/\\/g, '\\\\')}'`
  );
  
  fs.writeFileSync(tempScriptPath, scriptContent);
  
  // Run the migration script
  try {
    execSync(`node ${tempScriptPath} ${filePath}`, { encoding: 'utf-8' });
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error running migration for ${file}:`, error.message);
    return null;
  }
}

/**
 * Verify migration results
 * @param {string} testName - Test case name
 * @param {string} content - Migrated file content
 * @param {Array<string>} expectedImports - Expected import statements
 * @returns {boolean} - Whether the test passed
 */
function verifyMigration(testName, content, expectedImports) {
  console.log(`\nVerifying test case: ${testName}`);
  
  // Extract import statements from the content
  const importLines = content
    .split('\n')
    .filter(line => line.trim().startsWith('import '));
  
  let allFound = true;
  
  // Check if all expected imports are present
  for (const expectedImport of expectedImports) {
    const found = importLines.some(line => line.trim() === expectedImport);
    
    if (!found) {
      console.error(`❌ Missing expected import: ${expectedImport}`);
      allFound = false;
    } else {
      console.log(`✅ Found expected import: ${expectedImport}`);
    }
  }
  
  // Check for unexpected imports
  const unexpectedImports = importLines.filter(line => {
    return !expectedImports.some(expected => expected === line.trim());
  });
  
  if (unexpectedImports.length > 0) {
    console.error('❌ Found unexpected imports:');
    for (const line of unexpectedImports) {
      console.error(`   ${line}`);
    }
    allFound = false;
  }
  
  return allFound;
}

/**
 * Clean up test environment
 */
function cleanup() {
  console.log('\nCleaning up test environment...');
  
  // Remove test directory
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
  
  console.log('Test environment cleaned up.');
}

/**
 * Main function
 */
function main() {
  console.log('Starting migration test...');
  
  try {
    setup();
    
    let passedTests = 0;
    let failedTests = 0;
    
    for (const testCase of TEST_CASES) {
      const migratedContent = runMigration(testCase.file);
      
      if (!migratedContent) {
        console.error(`❌ Test case failed: ${testCase.name} - Migration failed`);
        failedTests++;
        continue;
      }
      
      const passed = verifyMigration(
        testCase.name,
        migratedContent,
        testCase.expectedImports
      );
      
      if (passed) {
        console.log(`✅ Test case passed: ${testCase.name}`);
        passedTests++;
      } else {
        console.error(`❌ Test case failed: ${testCase.name}`);
        failedTests++;
      }
    }
    
    console.log('\nTest summary:');
    console.log(`- Total tests: ${TEST_CASES.length}`);
    console.log(`- Passed: ${passedTests}`);
    console.log(`- Failed: ${failedTests}`);
    
    cleanup();
    
    process.exit(failedTests > 0 ? 1 : 0);
  } catch (error) {
    console.error('Error running tests:', error);
    cleanup();
    process.exit(1);
  }
}

// Run the tests
main(); 