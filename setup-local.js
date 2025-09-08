#!/usr/bin/env node

// Local Development Setup Script
// This script prepares the project for local development outside of Replit

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up project for local development...\n');

// Create mock Replit modules
const createMockReplitModules = () => {
  console.log('1. Creating mock Replit modules...');
  const nodeModulesPath = path.join(process.cwd(), 'node_modules/@replit');
  
  if (!fs.existsSync(nodeModulesPath)) {
    fs.mkdirSync(nodeModulesPath, { recursive: true });
  }
  
  // Mock cartographer plugin
  const cartographerPath = path.join(nodeModulesPath, 'vite-plugin-cartographer');
  if (!fs.existsSync(cartographerPath)) {
    fs.mkdirSync(cartographerPath, { recursive: true });
    fs.writeFileSync(path.join(cartographerPath, 'index.js'), `
      module.exports = {
        cartographer: () => ({
          name: 'mock-cartographer',
          configResolved() {}
        })
      };
    `);
    fs.writeFileSync(path.join(cartographerPath, 'package.json'), `{
      "name": "@replit/vite-plugin-cartographer",
      "version": "0.2.7",
      "main": "index.js"
    }`);
  }
  
  // Mock runtime error modal plugin
  const runtimeErrorPath = path.join(nodeModulesPath, 'vite-plugin-runtime-error-modal');
  if (!fs.existsSync(runtimeErrorPath)) {
    fs.mkdirSync(runtimeErrorPath, { recursive: true });
    fs.writeFileSync(path.join(runtimeErrorPath, 'index.js'), `
      module.exports = {
        default: () => ({
          name: 'mock-runtime-error-overlay',
          configResolved() {}
        })
      };
    `);
    fs.writeFileSync(path.join(runtimeErrorPath, 'package.json'), `{
      "name": "@replit/vite-plugin-runtime-error-modal",
      "version": "0.0.3",
      "main": "index.js"
    }`);
  }
  
  console.log('   ✅ Mock Replit modules created\n');
};

// Create development environment file
const createEnvFile = () => {
  console.log('2. Creating .env.example for development...');
  const envContent = `# Local Development Environment Variables
# Copy this file to .env.local and fill in your values

# Database Configuration (MySQL)
MYSQL_HOST=your-mysql-host
MYSQL_PORT=3306
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE=technical_pms

# Development Settings
NODE_ENV=development

# Optional: For production builds
# DATABASE_URL=mysql://username:password@host:port/database
`;
  
  fs.writeFileSync('.env.example', envContent);
  console.log('   ✅ Created .env.example file\n');
};

// Create local development guide
const createDevGuide = () => {
  console.log('3. Creating LOCAL_DEVELOPMENT.md guide...');
  const guideContent = `# Local Development Setup Guide

This guide helps you set up the Maritime PMS project for local development outside of Replit.

## Prerequisites

- Node.js 18+ 
- MySQL database (local or remote)
- Git

## Setup Steps

1. **Clone the repository:**
   \`\`\`bash
   git clone <your-repo-url>
   cd technical_module_test
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run setup script:**
   \`\`\`bash
   node setup-local.js
   \`\`\`

4. **Configure environment:**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your MySQL database credentials
   \`\`\`

5. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Production build with quality checks
- \`npm run build:local\` - Local build (skips some checks)
- \`npm run quality\` - Run TypeScript + ESLint checks
- \`npm run format\` - Fix code formatting
- \`npm run setup:local\` - Setup for local development

## Database Setup

The project uses MySQL with these tables:
- components
- spares  
- running_hours_audit
- change_request
- spares_history
- (and more...)

Tables will be created automatically on first run.

## Production Deployment

For production deployment:

1. Build the project: \`npm run build\`
2. Set production environment variables
3. Deploy \`dist/\` folder and \`dist/index.js\`

## Troubleshooting

### Vite Plugin Errors
If you get Replit plugin errors, run: \`node setup-local.js\`

### TypeScript Errors  
Run: \`npm run quality\` to see all issues

### Formatting Issues
Run: \`npm run format\` to fix formatting

### Database Connection
Check your .env.local file has correct MySQL credentials
`;

  fs.writeFileSync('LOCAL_DEVELOPMENT.md', guideContent);
  console.log('   ✅ Created LOCAL_DEVELOPMENT.md guide\n');
};

// Update package.json scripts
const updatePackageScripts = () => {
  console.log('4. Updating package.json scripts...');
  const packagePath = './package.json';
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Add local development scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    "build:local": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "setup:local": "node setup-local.js",
    "format": "npx prettier --write .",
    "postinstall": "node setup-local.js"
  };
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('   ✅ Updated package.json scripts\n');
};

// Main setup function
const setupLocal = () => {
  try {
    createMockReplitModules();
    createEnvFile();
    createDevGuide();
    updatePackageScripts();
    
    console.log('🎉 Local development setup complete!\n');
    console.log('Next steps:');
    console.log('1. Copy .env.example to .env.local and add your MySQL credentials');
    console.log('2. Run: npm run dev');
    console.log('3. Visit: http://localhost:5000\n');
    console.log('📖 See LOCAL_DEVELOPMENT.md for detailed instructions');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

setupLocal();