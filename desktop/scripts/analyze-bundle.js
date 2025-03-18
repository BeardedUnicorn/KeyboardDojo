import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build the project
console.log('Building project...');
execSync('npm run build', { stdio: 'inherit' });

// Analyze bundle sizes
const distDir = path.join(__dirname, '../dist');
const stats = {
  total: 0,
  js: 0,
  css: 0,
  assets: 0,
  chunks: [],
};

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function analyzeFile(filePath) {
  const stats = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath);
  
  return {
    name: fileName,
    size: stats.size,
    type: ext === '.js' ? 'JavaScript' :
          ext === '.css' ? 'CSS' :
          'Asset',
  };
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    
    if (isDirectory) {
      walkDir(filePath);
    } else {
      const fileStats = analyzeFile(filePath);
      stats.total += fileStats.size;
      
      if (fileStats.type === 'JavaScript') {
        stats.js += fileStats.size;
      } else if (fileStats.type === 'CSS') {
        stats.css += fileStats.size;
      } else {
        stats.assets += fileStats.size;
      }
      
      stats.chunks.push(fileStats);
    }
  });
}

// Analyze dist directory
console.log('\nAnalyzing bundle...');
walkDir(distDir);

// Sort chunks by size
stats.chunks.sort((a, b) => b.size - a.size);

// Generate report
const report = {
  totalSize: formatSize(stats.total),
  javascript: formatSize(stats.js),
  css: formatSize(stats.css),
  assets: formatSize(stats.assets),
  chunks: stats.chunks.map((chunk) => ({
    name: chunk.name,
    size: formatSize(chunk.size),
    type: chunk.type,
  })),
};

// Save report
const reportPath = path.join(__dirname, '../bundle-analysis.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

// Print summary
console.log('\nBundle Analysis Summary:');
console.log('-'.repeat(50));
console.log(`Total Size: ${report.totalSize}`);
console.log(`JavaScript: ${report.javascript}`);
console.log(`CSS: ${report.css}`);
console.log(`Assets: ${report.assets}`);

console.log('\nLargest Chunks:');
console.log('-'.repeat(50));
report.chunks.slice(0, 5).forEach((chunk) => {
  console.log(`${chunk.name} (${chunk.type}): ${chunk.size}`);
});

// Check size budgets
const budgets = {
  total: 5 * 1024 * 1024, // 5MB
  js: 2 * 1024 * 1024,    // 2MB
  css: 500 * 1024,        // 500KB
};

console.log('\nSize Budget Analysis:');
console.log('-'.repeat(50));
const warnings = [];

if (stats.total > budgets.total) {
  warnings.push(`Total bundle size exceeds budget: ${formatSize(stats.total)} > ${formatSize(budgets.total)}`);
}
if (stats.js > budgets.js) {
  warnings.push(`JavaScript size exceeds budget: ${formatSize(stats.js)} > ${formatSize(budgets.js)}`);
}
if (stats.css > budgets.css) {
  warnings.push(`CSS size exceeds budget: ${formatSize(stats.css)} > ${formatSize(budgets.css)}`);
}

if (warnings.length > 0) {
  console.log('⚠️ Warnings:');
  warnings.forEach((warning) => console.log(`- ${warning}`));
} else {
  console.log('✅ All bundle sizes are within budget!');
}

console.log(`\nDetailed report saved to: ${reportPath}`); 
