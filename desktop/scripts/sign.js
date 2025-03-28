#!/usr/bin/env node

/**
 * Code signing script for Keyboard Dojo desktop app
 * This script signs the app for different platforms
 */

import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
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
  buildDir: path.join(__dirname, '../src-tauri/target/release/bundle'),
};

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
 * Sign the app for macOS
 * @param {string} appPath Path to the .app file
 */
async function signMacOS(appPath) {
  console.log('\n=== Signing for macOS ===\n');

  try {
    // Check if the app exists
    if (!fs.existsSync(appPath)) {
      throw new Error(`App not found at ${appPath}`);
    }

    // Get signing identity from environment variable or prompt
    const signingIdentity = process.env.MACOS_SIGNING_IDENTITY;
    if (!signingIdentity) {
      throw new Error('MACOS_SIGNING_IDENTITY environment variable not set');
    }

    // Sign the app
    runCommand(`codesign --force --deep --sign "${signingIdentity}" "${appPath}"`);

    // Verify the signature
    runCommand(`codesign --verify --verbose "${appPath}"`);

    console.log('\n✅ Successfully signed for macOS\n');
  } catch (error) {
    console.error(`\n❌ Failed to sign for macOS: ${error.message}\n`);
    throw error;
  }
}

/**
 * Sign the app for Windows
 * @param {string} msiPath Path to the .msi file
 */
async function signWindows(msiPath) {
  console.log('\n=== Signing for Windows ===\n');

  try {
    // Check if the MSI exists
    if (!fs.existsSync(msiPath)) {
      throw new Error(`MSI not found at ${msiPath}`);
    }

    // Get signing certificate from environment variables
    const certificatePath = process.env.WINDOWS_CERTIFICATE_PATH;
    const certificatePassword = process.env.WINDOWS_CERTIFICATE_PASSWORD;

    if (!certificatePath || !certificatePassword) {
      throw new Error('Windows signing certificate environment variables not set');
    }

    // Sign the MSI using signtool
    runCommand(`signtool sign /f "${certificatePath}" /p "${certificatePassword}" /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 "${msiPath}"`);

    // Verify the signature
    runCommand(`signtool verify /pa "${msiPath}"`);

    console.log('\n✅ Successfully signed for Windows\n');
  } catch (error) {
    console.error(`\n❌ Failed to sign for Windows: ${error.message}\n`);
    throw error;
  }
}

/**
 * Sign the app for Linux
 * @param {string} debPath Path to the .deb file
 * @param {string} appImagePath Path to the .AppImage file
 */
async function signLinux(debPath, appImagePath) {
  console.log('\n=== Signing for Linux ===\n');

  try {
    // Check if the files exist
    const debExists = fs.existsSync(debPath);
    const appImageExists = fs.existsSync(appImagePath);

    if (!debExists && !appImageExists) {
      throw new Error('No Linux packages found to sign');
    }

    // Get GPG key from environment variable
    const gpgKeyId = process.env.LINUX_GPG_KEY_ID;
    if (!gpgKeyId) {
      throw new Error('LINUX_GPG_KEY_ID environment variable not set');
    }

    // Sign the .deb package if it exists
    if (debExists) {
      runCommand(`dpkg-sig --sign builder -k "${gpgKeyId}" "${debPath}"`);
      console.log(`Signed ${debPath}`);
    }

    // Sign the AppImage if it exists
    if (appImageExists) {
      runCommand(`gpg --detach-sign --armor -u "${gpgKeyId}" "${appImagePath}"`);
      console.log(`Signed ${appImagePath}`);
    }

    console.log('\n✅ Successfully signed for Linux\n');
  } catch (error) {
    console.error(`\n❌ Failed to sign for Linux: ${error.message}\n`);
    throw error;
  }
}

/**
 * Sign the app for all platforms or a specific platform
 */
async function sign() {
  const targetPlatform = process.argv[2];
  
  try {
    // Check if we're signing for a specific platform
    if (targetPlatform) {
      switch (targetPlatform) {
        case 'macos': {
          const macAppPath = path.join(config.buildDir, 'macos', `${config.appName}.app`);
          await signMacOS(macAppPath);
          break;
        }
        case 'windows': {
          const msiPath = path.join(config.buildDir, 'msi', `${config.appName}_${config.appVersion}_x64_en-US.msi`);
          await signWindows(msiPath);
          break;
        }
        case 'linux': {
          const debPath = path.join(config.buildDir, 'deb', `${config.appName.toLowerCase()}_${config.appVersion}_amd64.deb`);
          const appImagePath = path.join(config.buildDir, 'appimage', `${config.appName.toLowerCase()}_${config.appVersion}_amd64.AppImage`);
          await signLinux(debPath, appImagePath);
          break;
        }
        default:
          throw new Error(`Unknown platform: ${targetPlatform}`);
      }
      return;
    }
    
    // Sign for all platforms
    const currentPlatform = os.platform();
    
    if (currentPlatform === 'darwin') {
      const macAppPath = path.join(config.buildDir, 'macos', `${config.appName}.app`);
      await signMacOS(macAppPath);
    } else if (currentPlatform === 'win32') {
      const msiPath = path.join(config.buildDir, 'msi', `${config.appName}_${config.appVersion}_x64_en-US.msi`);
      await signWindows(msiPath);
    } else if (currentPlatform === 'linux') {
      const debPath = path.join(config.buildDir, 'deb', `${config.appName.toLowerCase()}_${config.appVersion}_amd64.deb`);
      const appImagePath = path.join(config.buildDir, 'appimage', `${config.appName.toLowerCase()}_${config.appVersion}_amd64.AppImage`);
      await signLinux(debPath, appImagePath);
    } else {
      throw new Error(`Unsupported platform: ${currentPlatform}`);
    }
    
    console.log('\n=== All signing completed ===\n');
  } catch (error) {
    console.error(`\n❌ Signing failed: ${error.message}\n`);
    process.exit(1);
  }
}

// Run the signing process
sign().catch((error) => {
  console.error(`\n❌ Signing failed: ${error.message}\n`);
  process.exit(1);
});
