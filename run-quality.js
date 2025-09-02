#!/usr/bin/env node

// Shorter alias for npm run quality functionality
// Usage: node run-quality.js

import { execSync } from 'child_process';

console.log('🔧 Running quality checks...');

try {
  execSync('node npm-run-quality.js', { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}
