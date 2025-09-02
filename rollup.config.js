import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
  input: 'server/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    json(),
    nodeResolve({
      preferBuiltins: true,
      exportConditions: ['node']
    }),
    commonjs({
      ignoreDynamicRequires: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      inlineSources: true,
      compilerOptions: {
        allowImportingTsExtensions: false,
        skipLibCheck: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        exactOptionalPropertyTypes: false
      }
    }),
    terser({
      compress: {
        drop_console: process.env.NODE_ENV === 'production'
      }
    })
  ],
  external: [
    // Node.js built-ins
    'http',
    'https',
    'fs',
    'path',
    'url',
    'util',
    'events',
    'stream',
    'crypto',
    'os',
    'child_process',
    'cluster',
    'worker_threads',
    // Database dependencies
    'pg',
    '@neondatabase/serverless',
    // Other external dependencies that should not be bundled
    'express',
    'drizzle-orm',
    'winston',
    'jsonwebtoken',
    'bcryptjs',
    'uuid',
    'zod',
    'lodash',
    'multer',
    'passport',
    'passport-local',
    'express-session',
    'connect-pg-simple',
    'memorystore',
    'ws',
    'papaparse',
    'xlsx',
    'mysql2'
  ]
};