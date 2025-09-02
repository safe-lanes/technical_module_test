#!/usr/bin/env node
import { execSync } from 'child_process';

console.log('🚀 Starting production build process...');

try {
  // Step 1: Run quality checks
  console.log('\n📋 Step 1: Quality Checks');
  execSync('node quality.js', { stdio: 'inherit' });

  // Step 2: Build frontend with Vite
  console.log('\n📦 Step 2: Building Frontend');
  execSync('vite build', { stdio: 'inherit' });

  // Step 3: Build backend using existing esbuild (fallback from rollup)
  console.log('\n🔧 Step 3: Building Backend (using esbuild fallback)');
  try {
    execSync('rollup -c', { stdio: 'inherit' });
    console.log('✅ Backend built successfully with Rollup');
  } catch (rollupError) {
    console.log('⚠️  Rollup build failed, falling back to esbuild...');
    execSync(
      'esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --sourcemap',
      { stdio: 'inherit' }
    );
    console.log('✅ Backend built successfully with esbuild fallback');
  }

  console.log('\n✅ Production build completed successfully!');
  console.log('📁 Frontend built to: dist/public/');
  console.log('📁 Backend built to: dist/index.js');
  console.log('🚀 Ready for production deployment!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
