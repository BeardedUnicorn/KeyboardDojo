#!/usr/bin/env node

/**
 * Batch Import Migration Script
 * 
 * This script automates the migration of multiple frontend files to use the shared package.
 * It analyzes the component inventory and migrates files in batches based on priority.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const INVENTORY_FILE = path.join(ROOT_DIR, 'docs/component-inventory.md');
const MIGRATE_SCRIPT = path.join(__dirname, 'migrate-imports.js');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const batchSize = args.find(arg => arg.startsWith('--batch-size='))
  ? parseInt(args.find(arg => arg.startsWith('--batch-size=')).split('=')[1], 10)
  : 5;
const category = args.find(arg => arg.startsWith('--category='))
  ? args.find(arg => arg.startsWith('--category=')).split('=')[1]
  : null;

/**
 * Parse the component inventory to extract file usage information
 * @returns {Array<{file: string, components: Array<string>, category: string}>} - Files to migrate
 */
function parseInventory() {
  if (!fs.existsSync(INVENTORY_FILE)) {
    console.error(`Inventory file not found: ${INVENTORY_FILE}`);
    console.error('Run the component-inventory.js script first.');
    process.exit(1);
  }

  const inventory = fs.readFileSync(INVENTORY_FILE, 'utf-8');
  const fileUsages = {};
  
  // Extract category sections
  const categoryRegex = /## ([^\n]+)\n\n(?:(?!##)[^\n]+\n)*(?:### Detailed Usage Information\n\n(?:(?!##)[^\n]+\n)*)?/g;
  let categoryMatch;
  
  while ((categoryMatch = categoryRegex.exec(inventory)) !== null) {
    const categoryName = categoryMatch[1].trim();
    const categoryContent = categoryMatch[0];
    
    // Skip if filtering by category and this isn't the one
    if (category && categoryName.toLowerCase() !== category.toLowerCase()) {
      continue;
    }
    
    // Extract component sections
    const componentRegex = /#### ([^\n]+)\n\n\| Frontend File \| Current Import \|\n\|[-\s|]+\n((?:\| [^|]+ \| [^|]+ \|\n)+)/g;
    let componentMatch;
    
    while ((componentMatch = componentRegex.exec(categoryContent)) !== null) {
      const componentName = componentMatch[1].trim();
      const usageTable = componentMatch[2];
      
      // Extract file usages
      const fileRegex = /\| ([^|]+) \| ([^|]+) \|\n/g;
      let fileMatch;
      
      while ((fileMatch = fileRegex.exec(usageTable)) !== null) {
        const file = fileMatch[1].trim();
        const currentImport = fileMatch[2].trim();
        
        if (!fileUsages[file]) {
          fileUsages[file] = {
            file,
            components: [],
            categories: new Set(),
            importCount: 0
          };
        }
        
        fileUsages[file].components.push(componentName);
        fileUsages[file].categories.add(categoryName);
        fileUsages[file].importCount++;
      }
    }
  }
  
  // Convert to array and sort by number of imports (descending)
  return Object.values(fileUsages)
    .map(usage => ({
      ...usage,
      categories: Array.from(usage.categories)
    }))
    .sort((a, b) => b.importCount - a.importCount);
}

/**
 * Migrate imports in a file
 * @param {string} file - Path to the file
 * @param {boolean} dryRun - Whether to perform a dry run
 * @param {boolean} verbose - Whether to show verbose output
 * @returns {boolean} - Whether the migration was successful
 */
function migrateFile(file, dryRun, verbose) {
  try {
    const args = [
      MIGRATE_SCRIPT,
      file,
      dryRun ? '--dry-run' : '',
      verbose ? '--verbose' : ''
    ].filter(Boolean);
    
    const command = `node ${args.join(' ')}`;
    
    if (verbose) {
      console.log(`Executing: ${command}`);
    }
    
    const output = execSync(command, { encoding: 'utf-8' });
    
    if (verbose) {
      console.log(output);
    } else {
      console.log(`Migrated ${file}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error migrating ${file}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Parsing component inventory...');
  const filesToMigrate = parseInventory();
  
  if (filesToMigrate.length === 0) {
    console.log('No files to migrate.');
    return;
  }
  
  console.log(`Found ${filesToMigrate.length} files to migrate.`);
  
  if (category) {
    console.log(`Filtering by category: ${category}`);
  }
  
  console.log(`Processing in batches of ${batchSize}...`);
  
  // Process files in batches
  const totalBatches = Math.ceil(filesToMigrate.length / batchSize);
  let successCount = 0;
  let failureCount = 0;
  
  for (let i = 0; i < totalBatches; i++) {
    const batchStart = i * batchSize;
    const batchEnd = Math.min((i + 1) * batchSize, filesToMigrate.length);
    const batch = filesToMigrate.slice(batchStart, batchEnd);
    
    console.log(`\nBatch ${i + 1}/${totalBatches} (${batchStart + 1}-${batchEnd} of ${filesToMigrate.length}):`);
    
    for (const fileInfo of batch) {
      console.log(`\nMigrating ${fileInfo.file} (${fileInfo.importCount} imports, categories: ${fileInfo.categories.join(', ')})`);
      
      if (verbose) {
        console.log('Components to migrate:', fileInfo.components.join(', '));
      }
      
      const success = migrateFile(fileInfo.file, dryRun, verbose);
      
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
    }
    
    // If not the last batch, prompt to continue
    if (i < totalBatches - 1 && !dryRun) {
      console.log('\nBatch completed. Press Enter to continue to the next batch...');
      await new Promise(resolve => {
        process.stdin.once('data', () => {
          resolve();
        });
      });
    }
  }
  
  console.log('\nMigration summary:');
  console.log(`- Total files: ${filesToMigrate.length}`);
  console.log(`- Successfully migrated: ${successCount}`);
  console.log(`- Failed migrations: ${failureCount}`);
  
  if (dryRun) {
    console.log('\nThis was a dry run. No changes were applied.');
  }
}

// Display help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node batch-migrate.js [options]');
  console.log('\nOptions:');
  console.log('  --dry-run           Show changes without applying them');
  console.log('  --verbose           Show detailed information');
  console.log('  --batch-size=N      Number of files to process in each batch (default: 5)');
  console.log('  --category=NAME     Only migrate files using components from the specified category');
  console.log('  --help, -h          Show this help message');
  process.exit(0);
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 