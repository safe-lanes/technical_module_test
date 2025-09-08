# Cross-Platform NPM Scripts Fix
# The current package.json scripts use Unix syntax that won't work on Windows.
# Here are the Windows-compatible versions:

## Manual Fix for package.json:

Replace these scripts in your package.json:

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development tsx server/index.ts",
    "start": "cross-env NODE_ENV=production node dist/index.js",
    "build": "npm run quality && vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "build:local": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "build:micro-frontend": "vite build --mode micro-frontend", 
    "check": "tsc",
    "quality": "node quality.js",
    "format": "npx prettier --write .",
    "setup:local": "node setup-local.js",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "setup-microfrontend": "node scripts/setup-microfrontend.js"
  }
}
```

## Windows Batch Files (Alternative):
