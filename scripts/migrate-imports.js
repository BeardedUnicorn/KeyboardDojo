#!/usr/bin/env node

/**
 * Import Migration Script
 * 
 * This script helps migrate frontend imports to use the shared package.
 * It takes a component inventory report and updates imports in specified files.
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend/src');
const INVENTORY_FILE = path.join(ROOT_DIR, 'docs/component-inventory.md');

// Parse command line arguments
const args = process.argv.slice(2);
const targetFile = args[0];
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');

if (!targetFile) {
  console.error('Usage: node migrate-imports.js <target-file> [--dry-run] [--verbose]');
  console.error('  <target-file>: Path to the file to migrate (relative to frontend/src)');
  console.error('  --dry-run: Show changes without applying them');
  console.error('  --verbose: Show detailed information');
  process.exit(1);
}

/**
 * Parse the component inventory to extract migration mappings
 * @returns {Object} - Mapping of component names to shared package paths
 */
function parseInventory() {
  if (!fs.existsSync(INVENTORY_FILE)) {
    console.error(`Inventory file not found: ${INVENTORY_FILE}`);
    console.error('Run the component-inventory.js script first.');
    process.exit(1);
  }

  const inventory = fs.readFileSync(INVENTORY_FILE, 'utf-8');
  const mappings = {};
  
  // Extract component mappings from the inventory markdown
  const categoryRegex = /## ([^\n]+)\n\n(?:(?!##)[^\n]+\n)*/g;
  const tableRowRegex = /\| ([^|]+) \| ([^|]+) \| \d+ \|/g;
  
  let categoryMatch;
  while ((categoryMatch = categoryRegex.exec(inventory)) !== null) {
    const categoryContent = categoryMatch[0];
    let rowMatch;
    
    while ((rowMatch = tableRowRegex.exec(categoryContent)) !== null) {
      const componentName = rowMatch[1].trim();
      const importPath = rowMatch[2].trim();
      
      mappings[componentName] = importPath;
    }
  }
  
  return mappings;
}

/**
 * Migrate imports in a file
 * @param {string} filePath - Path to the file
 * @param {Object} mappings - Mapping of component names to shared package paths
 * @returns {boolean} - Whether the file was modified
 */
function migrateImports(filePath, mappings) {
  const fullPath = path.join(FRONTEND_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    return false;
  }
  
  const code = fs.readFileSync(fullPath, 'utf-8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  });
  
  let modified = false;
  const importChanges = [];
  
  // Track imports to be added to the shared package
  const newImports = {};
  
  // First pass: identify imports to be migrated
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      
      // Skip imports that are already from the shared package
      if (source.startsWith('@keyboard-dojo/shared')) {
        return;
      }
      
      // Check each imported item
      const migratedSpecifiers = [];
      const remainingSpecifiers = [];
      
      path.node.specifiers.forEach(specifier => {
        let importedName;
        
        if (specifier.type === 'ImportSpecifier' && specifier.imported) {
          importedName = specifier.imported.name;
        } else if (specifier.type === 'ImportDefaultSpecifier') {
          importedName = 'default';
        }
        
        if (importedName && mappings[importedName]) {
          migratedSpecifiers.push({
            name: importedName,
            local: specifier.local.name,
            path: mappings[importedName]
          });
          
          // Add to new imports
          if (!newImports[mappings[importedName]]) {
            newImports[mappings[importedName]] = [];
          }
          
          newImports[mappings[importedName]].push({
            name: importedName,
            local: specifier.local.name
          });
          
          modified = true;
        } else {
          remainingSpecifiers.push(specifier);
        }
      });
      
      // Record the changes
      if (migratedSpecifiers.length > 0) {
        importChanges.push({
          source,
          migratedSpecifiers,
          remainingSpecifiers,
          nodePath: path
        });
      }
    }
  });
  
  // If no changes, return early
  if (!modified) {
    console.log(`No imports to migrate in ${filePath}`);
    return false;
  }
  
  // Second pass: update the AST
  importChanges.forEach(change => {
    const { remainingSpecifiers, nodePath } = change;
    
    if (remainingSpecifiers.length === 0) {
      // Remove the entire import declaration
      nodePath.remove();
    } else {
      // Update the import declaration with remaining specifiers
      nodePath.node.specifiers = remainingSpecifiers;
    }
  });
  
  // Add new imports for shared package
  Object.entries(newImports).forEach(([importPath, specifiers]) => {
    const newSpecifiers = specifiers.map(spec => {
      if (spec.name === 'default') {
        return t.importDefaultSpecifier(t.identifier(spec.local));
      } else {
        return t.importSpecifier(
          t.identifier(spec.name),
          t.identifier(spec.local)
        );
      }
    });
    
    const newImport = t.importDeclaration(
      newSpecifiers,
      t.stringLiteral(importPath)
    );
    
    // Add the new import at the top of the file
    const body = ast.program.body;
    let lastImportIndex = -1;
    
    for (let i = 0; i < body.length; i++) {
      if (body[i].type === 'ImportDeclaration') {
        lastImportIndex = i;
      } else {
        break;
      }
    }
    
    body.splice(lastImportIndex + 1, 0, newImport);
  });
  
  // Generate the updated code
  const output = generate(ast, {}, code);
  
  // Log the changes
  if (verbose || dryRun) {
    console.log(`\nChanges for ${filePath}:`);
    
    importChanges.forEach(change => {
      console.log(`\nFrom: ${change.source}`);
      change.migratedSpecifiers.forEach(spec => {
        console.log(`  - ${spec.name} -> ${spec.path}`);
      });
    });
    
    if (dryRun) {
      console.log('\nUpdated code:');
      console.log(output.code);
    }
  }
  
  // Write the changes
  if (!dryRun) {
    fs.writeFileSync(fullPath, output.code);
    console.log(`Updated imports in ${filePath}`);
  } else {
    console.log('Dry run - no changes applied');
  }
  
  return true;
}

/**
 * Main function
 */
async function main() {
  console.log('Parsing component inventory...');
  const mappings = parseInventory();
  
  if (Object.keys(mappings).length === 0) {
    console.error('No component mappings found in the inventory.');
    process.exit(1);
  }
  
  if (verbose) {
    console.log('Component mappings:');
    Object.entries(mappings).forEach(([component, path]) => {
      console.log(`  ${component} -> ${path}`);
    });
  }
  
  console.log(`Migrating imports in ${targetFile}...`);
  const success = migrateImports(targetFile, mappings);
  
  if (success) {
    console.log('Migration completed successfully.');
  } else {
    console.error('Migration failed.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 