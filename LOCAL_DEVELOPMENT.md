# Local Development Setup Guide

This guide helps you set up the Maritime PMS project for local development outside of Replit.

## Prerequisites

- Node.js 18+ 
- MySQL database (local or remote)
- Git

## Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd technical_module_test
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run setup script:**
   ```bash
   node setup-local.js
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your MySQL database credentials
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build with quality checks
- `npm run build:local` - Local build (skips some checks)
- `npm run quality` - Run TypeScript + ESLint checks
- `npm run format` - Fix code formatting
- `npm run setup:local` - Setup for local development

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

1. Build the project: `npm run build`
2. Set production environment variables
3. Deploy `dist/` folder and `dist/index.js`

## Troubleshooting

### Vite Plugin Errors
If you get Replit plugin errors, run: `node setup-local.js`

### TypeScript Errors  
Run: `npm run quality` to see all issues

### Formatting Issues
Run: `npm run format` to fix formatting

### Database Connection
Check your .env.local file has correct MySQL credentials
