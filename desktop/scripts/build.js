#!/usr/bin/env node

/**
 * Build script for Keyboard Dojo desktop app
 * This script builds the app for different platforms
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  appName: 'Keyboard Dojo',
  appVersion: '1.0.0',
  platforms: ['macos', 'windows', 'linux'],
  outputDir: path.join(__dirname, '../dist'),
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

/**
 * Run a command and log the output
 * @param {string} command The command to run
 * @param {object} options Options for child_process.execSync
 * @returns {Buffer} The command output
 */
function runCommand(command, options = {}) {
  console.log(`Running: ${command}`);
  return execSync(command, {
    stdio: 'inherit',
    ...options,
  });
}

/**
 * Build the app for a specific platform
 * @param {string} platform The platform to build for (macos, windows, linux)
 */
async function buildForPlatform(platform) {
  console.log(`\n=== Building for ${platform} ===\n`);

  try {
    // Set environment variables for the build
    const env = {
      ...process.env,
      TAURI_PLATFORM: platform,
      TAURI_PRIVATE_KEY: process.env.TAURI_PRIVATE_KEY || '',
      TAURI_KEY_PASSWORD: process.env.TAURI_KEY_PASSWORD || '',
    };

    // Platform-specific build options
    let buildCommand = 'npm run tauri:build';

    switch (platform) {
      case 'macos':
        buildCommand += ' -- --target aarch64-apple-darwin';
        break;
      case 'windows':
        buildCommand += ' -- --target x86_64-pc-windows-msvc';
        break;
      case 'linux':
        buildCommand += ' -- --target x86_64-unknown-linux-gnu';
        break;
    }

    // Run the build
    runCommand(buildCommand, { env });

    console.log(`\n✅ Successfully built for ${platform}\n`);
  } catch (error) {
    console.error(`\n❌ Failed to build for ${platform}: ${error.message}\n`);
    process.exit(1);
  }
}

/**
 * Build the app for all platforms or a specific platform
 */
async function build() {
  const targetPlatform = process.argv[2];

  // Check if we're building for a specific platform
  if (targetPlatform && config.platforms.includes(targetPlatform)) {
    await buildForPlatform(targetPlatform);
    return;
  }

  // Build for all platforms
  for (const platform of config.platforms) {
    await buildForPlatform(platform);
  }

  console.log('\n=== All builds completed ===\n');
}

// Run the build
build().catch((error) => {
  console.error(`\n❌ Build failed: ${error.message}\n`);
  process.exit(1);
});
