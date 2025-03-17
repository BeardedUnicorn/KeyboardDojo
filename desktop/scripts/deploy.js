#!/usr/bin/env node

/**
 * Deployment script for Keyboard Dojo desktop app
 * This script deploys the app to distribution channels
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import https from 'https';
import { createReadStream } from 'fs';
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
  releaseServer: 'https://releases.keyboarddojo.com',
  releaseApiKey: process.env.RELEASE_API_KEY || '',
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
 * Upload a file to the release server
 * @param {string} filePath Path to the file to upload
 * @param {string} platform The platform (macos, windows, linux)
 * @param {string} arch The architecture (x64, arm64)
 * @returns {Promise<string>} The URL of the uploaded file
 */
function uploadFile(filePath, platform, arch) {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(filePath);
    const fileSize = fs.statSync(filePath).size;
    
    const options = {
      hostname: new URL(config.releaseServer).hostname,
      port: 443,
      path: `/upload/${platform}/${arch}/${config.appVersion}/${fileName}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileSize,
        'Authorization': `Bearer ${config.releaseApiKey}`,
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Upload failed with status code: ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.url);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Upload request failed: ${error.message}`));
    });

    const readStream = createReadStream(filePath);
    readStream.pipe(req);
    
    readStream.on('error', (error) => {
      reject(new Error(`Failed to read file: ${error.message}`));
    });
  });
}

/**
 * Deploy the app for macOS
 */
async function deployMacOS() {
  console.log('\n=== Deploying for macOS ===\n');

  try {
    // Find the DMG file
    const dmgPath = path.join(config.buildDir, 'dmg', `${config.appName}_${config.appVersion}_universal.dmg`);
    
    if (!fs.existsSync(dmgPath)) {
      throw new Error(`DMG not found at ${dmgPath}`);
    }

    // Upload the DMG
    const dmgUrl = await uploadFile(dmgPath, 'macos', 'universal');
    console.log(`Uploaded DMG to: ${dmgUrl}`);

    // Find the updater files
    const updaterPath = path.join(config.buildDir, 'macos', `${config.appName}.app.tar.gz`);
    const sigPath = path.join(config.buildDir, 'macos', `${config.appName}.app.tar.gz.sig`);
    
    if (fs.existsSync(updaterPath) && fs.existsSync(sigPath)) {
      // Upload the updater files
      const updaterUrl = await uploadFile(updaterPath, 'macos', 'universal');
      console.log(`Uploaded updater to: ${updaterUrl}`);
      
      const sigUrl = await uploadFile(sigPath, 'macos', 'universal');
      console.log(`Uploaded signature to: ${sigUrl}`);
    } else {
      console.warn('Updater files not found, skipping updater upload');
    }

    console.log('\n✅ Successfully deployed for macOS\n');
  } catch (error) {
    console.error(`\n❌ Failed to deploy for macOS: ${error.message}\n`);
    throw error;
  }
}

/**
 * Deploy the app for Windows
 */
async function deployWindows() {
  console.log('\n=== Deploying for Windows ===\n');

  try {
    // Find the MSI file
    const msiPath = path.join(config.buildDir, 'msi', `${config.appName}_${config.appVersion}_x64_en-US.msi`);
    
    if (!fs.existsSync(msiPath)) {
      throw new Error(`MSI not found at ${msiPath}`);
    }

    // Upload the MSI
    const msiUrl = await uploadFile(msiPath, 'windows', 'x64');
    console.log(`Uploaded MSI to: ${msiUrl}`);

    // Find the updater files
    const updaterPath = path.join(config.buildDir, 'windows', `${config.appName}_${config.appVersion}_x64_en-US.msi.zip`);
    const sigPath = path.join(config.buildDir, 'windows', `${config.appName}_${config.appVersion}_x64_en-US.msi.zip.sig`);
    
    if (fs.existsSync(updaterPath) && fs.existsSync(sigPath)) {
      // Upload the updater files
      const updaterUrl = await uploadFile(updaterPath, 'windows', 'x64');
      console.log(`Uploaded updater to: ${updaterUrl}`);
      
      const sigUrl = await uploadFile(sigPath, 'windows', 'x64');
      console.log(`Uploaded signature to: ${sigUrl}`);
    } else {
      console.warn('Updater files not found, skipping updater upload');
    }

    console.log('\n✅ Successfully deployed for Windows\n');
  } catch (error) {
    console.error(`\n❌ Failed to deploy for Windows: ${error.message}\n`);
    throw error;
  }
}

/**
 * Deploy the app for Linux
 */
async function deployLinux() {
  console.log('\n=== Deploying for Linux ===\n');

  try {
    // Find the AppImage file
    const appImagePath = path.join(config.buildDir, 'appimage', `${config.appName.toLowerCase()}_${config.appVersion}_amd64.AppImage`);
    
    if (!fs.existsSync(appImagePath)) {
      throw new Error(`AppImage not found at ${appImagePath}`);
    }

    // Upload the AppImage
    const appImageUrl = await uploadFile(appImagePath, 'linux', 'x64');
    console.log(`Uploaded AppImage to: ${appImageUrl}`);

    // Find the DEB file
    const debPath = path.join(config.buildDir, 'deb', `${config.appName.toLowerCase()}_${config.appVersion}_amd64.deb`);
    
    if (fs.existsSync(debPath)) {
      // Upload the DEB
      const debUrl = await uploadFile(debPath, 'linux', 'x64');
      console.log(`Uploaded DEB to: ${debUrl}`);
    } else {
      console.warn('DEB file not found, skipping DEB upload');
    }

    // Find the updater files
    const updaterPath = path.join(config.buildDir, 'appimage', `${config.appName.toLowerCase()}_${config.appVersion}_amd64.AppImage.tar.gz`);
    const sigPath = path.join(config.buildDir, 'appimage', `${config.appName.toLowerCase()}_${config.appVersion}_amd64.AppImage.tar.gz.sig`);
    
    if (fs.existsSync(updaterPath) && fs.existsSync(sigPath)) {
      // Upload the updater files
      const updaterUrl = await uploadFile(updaterPath, 'linux', 'x64');
      console.log(`Uploaded updater to: ${updaterUrl}`);
      
      const sigUrl = await uploadFile(sigPath, 'linux', 'x64');
      console.log(`Uploaded signature to: ${sigUrl}`);
    } else {
      console.warn('Updater files not found, skipping updater upload');
    }

    console.log('\n✅ Successfully deployed for Linux\n');
  } catch (error) {
    console.error(`\n❌ Failed to deploy for Linux: ${error.message}\n`);
    throw error;
  }
}

/**
 * Deploy the app for all platforms or a specific platform
 */
async function deploy() {
  const targetPlatform = process.argv[2];
  
  // Check if API key is set
  if (!config.releaseApiKey) {
    console.error('\n❌ RELEASE_API_KEY environment variable not set\n');
    process.exit(1);
  }
  
  try {
    // Check if we're deploying for a specific platform
    if (targetPlatform) {
      switch (targetPlatform) {
        case 'macos':
          await deployMacOS();
          break;
        case 'windows':
          await deployWindows();
          break;
        case 'linux':
          await deployLinux();
          break;
        default:
          throw new Error(`Unknown platform: ${targetPlatform}`);
      }
      return;
    }
    
    // Deploy for all platforms
    await deployMacOS();
    await deployWindows();
    await deployLinux();
    
    console.log('\n=== All deployments completed ===\n');
  } catch (error) {
    console.error(`\n❌ Deployment failed: ${error.message}\n`);
    process.exit(1);
  }
}

// Run the deployment process
deploy().catch(error => {
  console.error(`\n❌ Deployment failed: ${error.message}\n`);
  process.exit(1);
});
