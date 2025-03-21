# Visual Regression Testing Workflow

This document outlines the workflow for visual regression testing in the Keyboard Dojo application.

## Overview

Visual regression testing ensures that UI components render consistently across changes to the codebase. It works by:

1. Capturing baseline screenshots of UI components in a known good state
2. Comparing new screenshots against these baselines when code changes
3. Flagging visual differences that might indicate unwanted UI changes

## Setup

The visual regression testing infrastructure includes:

- **Storybook**: Our component development environment where we can isolate components
- **Puppeteer**: Headless browser that captures screenshots of components
- **Jest**: Testing framework that coordinates the testing process
- **Visual comparison tools**: For detecting pixel differences between images

## Directory Structure

```
src/tests/visual-regression/
├── baseline/               # Baseline screenshots (committed to git)
├── diff/                   # Difference images (generated during testing, not committed)
├── visual-regression.test.js  # Test script that runs the visual regression tests
└── README.md               # This documentation file
```

## Workflow

### 1. Creating Baseline Images

Initial baseline images are created when you first run the tests:

```bash
# Start Storybook (in one terminal)
npm run storybook

# In another terminal, run the visual regression tests
npm run test:visual
```

The first run will create baseline images for all critical components in the `baseline/` directory.

### 2. Running Visual Regression Tests

During regular development, run the tests to check for visual changes:

```bash
npm run test:visual
```

If the test finds visual differences:
1. Difference images will be generated in the `diff/` directory
2. The test will fail, highlighting which components have changed

### 3. Reviewing Visual Changes

When visual differences are detected:

1. Review the diff images to determine if the changes are intentional
2. If changes are expected and approved, update the baselines:
   ```bash
   npm run test:visual:update
   ```
3. If changes are unintended, fix the UI issues in your code

## Critical Components

We maintain visual regression tests for these critical components:

- Core UI components (buttons, cards, dialogs, etc.)
- Layout components (app bar, navigation)
- Curriculum components (curriculum view)
- Exercise components (quiz, shortcut challenge)
- Gamification components (achievements)
- Statistics components (progress charts)

## Best Practices

1. **Run tests locally** before submitting PRs
2. **Review visual changes carefully** - small pixel differences can indicate larger issues
3. **Keep baseline images updated** when intentional design changes are made
4. **Consider device/viewport variations** for responsive components
5. **Maintain a controlled test environment** for consistent screenshots (fonts, rendering engines, etc.)

## Troubleshooting

- **Inconsistent rendering**: Ensure your test environment is stable (no animations, consistent fonts)
- **False positives**: Adjust tolerance thresholds for comparison if necessary
- **Test failures in CI**: Consider environment differences between local and CI 