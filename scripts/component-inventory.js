#!/usr/bin/env node

/**
 * Component Inventory Generator
 * 
 * This script analyzes the shared package and frontend codebase to:
 * 1. Create an inventory of all components, hooks, utilities, and types in the shared package
 * 2. Identify all files in the frontend that could use these shared resources
 * 3. Generate a report to guide the migration process
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const SHARED_DIR = path.join(ROOT_DIR, 'shared/src');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend/src');
const OUTPUT_FILE = path.join(ROOT_DIR, 'docs/component-inventory.md');

// Categories to analyze
const CATEGORIES = [
  { name: 'components', dir: 'components', title: 'UI Components' },
  { name: 'hooks', dir: 'hooks', title: 'React Hooks' },
  { name: 'utils', dir: 'utils', title: 'Utility Functions' },
  { name: 'types', dir: 'types', title: 'TypeScript Types' }
];

/**
 * Find all exported items from a file
 * @param {string} filePath - Path to the file
 * @returns {Array<string>} - Array of exported item names
 */
function findExports(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf-8');
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });
    
    const exports = [];
    
    traverse(ast, {
      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          if (path.node.declaration.type === 'VariableDeclaration') {
            path.node.declaration.declarations.forEach(declaration => {
              if (declaration.id.name) {
                exports.push(declaration.id.name);
              }
            });
          } else if (path.node.declaration.type === 'FunctionDeclaration' || 
                     path.node.declaration.type === 'ClassDeclaration' ||
                     path.node.declaration.type === 'TSInterfaceDeclaration' ||
                     path.node.declaration.type === 'TSTypeAliasDeclaration') {
            if (path.node.declaration.id && path.node.declaration.id.name) {
              exports.push(path.node.declaration.id.name);
            }
          }
        }
        
        if (path.node.specifiers) {
          path.node.specifiers.forEach(specifier => {
            if (specifier.exported && specifier.exported.name) {
              exports.push(specifier.exported.name);
            }
          });
        }
      },
      ExportDefaultDeclaration(path) {
        if (path.node.declaration && path.node.declaration.name) {
          exports.push(path.node.declaration.name);
        } else if (path.node.declaration && path.node.declaration.id && path.node.declaration.id.name) {
          exports.push(path.node.declaration.id.name);
        } else {
          exports.push('default');
        }
      }
    });
    
    return exports;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Find all imports in a file
 * @param {string} filePath - Path to the file
 * @returns {Array<{source: string, imports: Array<string>}>} - Array of import sources and imported items
 */
function findImports(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf-8');
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });
    
    const imports = [];
    
    traverse(ast, {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        const importedItems = [];
        
        path.node.specifiers.forEach(specifier => {
          if (specifier.imported) {
            importedItems.push(specifier.imported.name);
          } else if (specifier.local) {
            importedItems.push(specifier.local.name);
          }
        });
        
        imports.push({
          source,
          imports: importedItems
        });
      }
    });
    
    return imports;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Generate inventory for a category
 * @param {string} categoryName - Category name
 * @param {string} categoryDir - Category directory
 * @returns {Object} - Inventory object
 */
function generateCategoryInventory(categoryName, categoryDir) {
  const categoryPath = path.join(SHARED_DIR, categoryDir);
  if (!fs.existsSync(categoryPath)) {
    return { items: [] };
  }
  
  const files = glob.sync(`${categoryPath}/**/*.{ts,tsx}`);
  const inventory = {
    items: []
  };
  
  files.forEach(file => {
    const relativePath = path.relative(SHARED_DIR, file);
    const exports = findExports(file);
    
    exports.forEach(exportName => {
      inventory.items.push({
        name: exportName,
        file: relativePath,
        importPath: `@keyboard-dojo/shared/${categoryName}`,
        usages: []
      });
    });
  });
  
  return inventory;
}

/**
 * Find usages of shared items in frontend
 * @param {Array<Object>} inventory - Inventory of shared items
 */
function findUsagesInFrontend(inventory) {
  const frontendFiles = glob.sync(`${FRONTEND_DIR}/**/*.{ts,tsx}`);
  
  frontendFiles.forEach(file => {
    const relativePath = path.relative(FRONTEND_DIR, file);
    const imports = findImports(file);
    
    imports.forEach(importInfo => {
      const { source, imports: importedItems } = importInfo;
      
      // Check if any imported items match items in our inventory
      inventory.forEach(category => {
        category.items.forEach(item => {
          if (importedItems.includes(item.name)) {
            // Check if the import is from a local file (not already using shared)
            if (!source.startsWith('@keyboard-dojo/shared')) {
              item.usages.push({
                file: relativePath,
                currentImport: source
              });
            }
          }
        });
      });
    });
  });
}

/**
 * Generate markdown report
 * @param {Array<Object>} inventory - Inventory of shared items
 * @returns {string} - Markdown report
 */
function generateMarkdownReport(inventory) {
  let markdown = '# Component Inventory Report\n\n';
  markdown += 'This report identifies components, hooks, utilities, and types in the shared package and their usage in the frontend.\n\n';
  
  // Table of contents
  markdown += '## Table of Contents\n\n';
  CATEGORIES.forEach(category => {
    markdown += `- [${category.title}](#${category.title.toLowerCase().replace(/\s+/g, '-')})\n`;
  });
  markdown += '\n';
  
  // Generate sections for each category
  CATEGORIES.forEach((category, index) => {
    const categoryInventory = inventory[index];
    
    markdown += `## ${category.title}\n\n`;
    
    if (categoryInventory.items.length === 0) {
      markdown += 'No items found in this category.\n\n';
      return;
    }
    
    markdown += '| Item | Import Path | Frontend Usages |\n';
    markdown += '|------|------------|----------------|\n';
    
    categoryInventory.items.forEach(item => {
      const usageCount = item.usages.length;
      markdown += `| ${item.name} | ${item.importPath} | ${usageCount} |\n`;
    });
    
    markdown += '\n';
    
    // Detailed usage information
    if (categoryInventory.items.some(item => item.usages.length > 0)) {
      markdown += '### Detailed Usage Information\n\n';
      
      categoryInventory.items.forEach(item => {
        if (item.usages.length > 0) {
          markdown += `#### ${item.name}\n\n`;
          markdown += '| Frontend File | Current Import |\n';
          markdown += '|--------------|---------------|\n';
          
          item.usages.forEach(usage => {
            markdown += `| ${usage.file} | ${usage.currentImport} |\n`;
          });
          
          markdown += '\n';
        }
      });
    }
  });
  
  markdown += '## Migration Steps\n\n';
  markdown += '1. Start with low-usage items to minimize impact\n';
  markdown += '2. Update imports in each file to use the shared package\n';
  markdown += '3. Test thoroughly after each change\n';
  markdown += '4. Update documentation to reflect the new import patterns\n\n';
  
  markdown += '## Potential Issues\n\n';
  markdown += '- Components with the same name but different implementations\n';
  markdown += '- Dependencies on frontend-specific features\n';
  markdown += '- Type compatibility issues\n';
  
  return markdown;
}

/**
 * Main function
 */
async function main() {
  console.log('Generating component inventory...');
  
  // Generate inventory for each category
  const inventory = CATEGORIES.map(category => 
    generateCategoryInventory(category.name, category.dir)
  );
  
  console.log('Finding usages in frontend...');
  findUsagesInFrontend(inventory);
  
  console.log('Generating report...');
  const report = generateMarkdownReport(inventory);
  
  fs.writeFileSync(OUTPUT_FILE, report);
  
  console.log(`Inventory report generated at ${OUTPUT_FILE}`);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 