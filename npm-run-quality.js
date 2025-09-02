#!/usr/bin/env node

// This script provides "npm run quality" equivalent functionality
// Usage: node npm-run-quality.js OR npm run quality (when added to package.json)

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Running quality checks (npm run quality equivalent)...');
console.log('');

try {
  // Execute the quality script from the correct directory
  execSync('node quality.js', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('');
  console.log('✅ npm run quality completed successfully!');
  console.log('💡 Alternative: You can also run "node quality.js" directly');
  
} catch (error) {
  console.error('❌ Quality check failed');
  process.exit(1);
}