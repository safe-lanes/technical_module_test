// Local Development Configuration
// This file helps resolve Replit-specific dependencies for local development

const fs = require('fs');
const path = require('path');

// Create mock modules for Replit-specific plugins if they don't exist
const createMockReplitModules = () => {
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
  
  console.log('✅ Mock Replit modules created for local development');
};

module.exports = { createMockReplitModules };

// Run automatically if called directly
if (require.main === module) {
  createMockReplitModules();
}