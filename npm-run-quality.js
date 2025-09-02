#!/usr/bin/env node
// This script can be called as "npm run quality" equivalent
import { execSync } from 'child_process';

try {
  execSync('node quality.js', { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}