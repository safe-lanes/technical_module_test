# Seafarer Technical Management System

## Overview

This project is a full-stack Technical Module for a maritime Planned Maintenance System (PMS). It aims to provide a comprehensive solution for managing technical equipment maintenance, scheduling, and performance tracking for maritime professionals. The system will feature a PMS Dashboard, equipment and task management, reporting, and an administration module.

## User Preferences

Preferred communication style: Simple, everyday language.

## Technical Module Context

The SAIL Technical Module manages three core aspects of cargo ship operations:

1. **Certificate & Surveys Management** - Ship's certification and survey tracking
2. **Defect Reporting** - Equipment, machinery and systems defect management
3. **Planned Maintenance System (PMS)** - Compliance with classification society requirements (DNV, ABS)

### Module Hierarchy

- **Technical** (Module)
  - **PMS** (Submodule)
    - **Components** (Sub Submodule)
    - **Work Orders** (Sub Submodule)
    - **Running Hrs** (Sub Submodule)
    - **Spares** (Sub Submodule)
    - **Reports** (Sub Submodule)
    - **Modify PMS** (Sub Submodule)
    - **Admin** (Sub Submodule)

## System Architecture

The application uses a modern full-stack architecture with a React frontend (TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Wouter) and an Express.js backend (TypeScript). It integrates with PostgreSQL via Drizzle ORM for database operations, with an in-memory storage fallback for development. The UI/UX prioritizes a consistent design system through shadcn/ui and Tailwind CSS, following a mobile-first responsive design approach.

### Production Features (Enterprise-Grade):

- **Database Connection Pooling**: MySQL connection pooling with health checks, auto-reconnection, and optimized connection management (max 20 connections)
- **Migration System**: Drizzle-based migration system with automated schema management and version control
- **Winston Logging**: Comprehensive structured logging with daily rotation, request tracking, and JSON format logging to `logs/` directory
- **Error Handling Middleware**: Global error handler with custom error classes (AppError, ValidationError), async wrapper, and structured API responses
- **Authentication System**: JWT-based mock authentication with role-based permissions (admin/master/officer roles) and React context integration
- **Code Quality**: ESLint + TypeScript configuration with strict rules, type checking, and production build validation
- **Build System**: Quality checks + Rollup bundling with esbuild fallback, source maps, and production optimization

### Completed Modules:

- **Components Module**: Full CRUD operations with hierarchical component tree management
- **Running Hours Module**: Equipment tracking with utilization rate calculations and audit history
- **Spares Module**: Comprehensive inventory management with consumption/receive tracking, bulk updates, and complete transaction history
- **Stores Module**: Complete inventory management with transaction history and Excel export
- **Modify PMS - Change Requests Module (Phase 1.0)**: Complete request workflow (draft → submitted → approved/rejected/returned), filtering, CRUD operations
- **Modify PMS - Change Requests Module (Phase 1.1)**: Target Picker overlay functionality for selecting specific PMS items (Component/Work Order/Spare/Store) with snapshot capture
- **Modify PMS - Change Requests Module (Phase 1.2)**: Propose Changes functionality allowing field-specific modifications for selected targets, with review dialog, move preview for components, and impact previews (all read-only, no PMS data modifications)
- **Modify PMS - Change Requests Module (Phase 2.0)**: Cross-module change request system with unified modal workflow, field-level tracking, and modify mode components

### Architecture Features:

- Shared component tree structure used across PMS modules for consistency
- RESTful API design with proper error handling and validation
- Real-time stock status calculations (OK/Low/Minimum)
- Audit trail for all inventory transactions with user tracking
- Optimistic UI updates with TanStack Query for smooth user experience
- Enterprise-grade middleware stack with request logging, authentication, and error handling
- Production-ready build pipeline with quality checks and bundle optimization

## Build System & Development

### Production Build Commands:

- **Quality Check**: `node quality.js` - Runs TypeScript checking and ESLint validation
- **Full Build**: `node build.js` - Executes quality checks + frontend build + backend bundling
- **Build Equivalent**: `node npm-run-quality.js && rollup -c` - Direct command equivalent

### Build Output:

- **Frontend**: `dist/public/` - Optimized Vite build with chunked assets
- **Backend**: `dist/index.js` - Bundled Express server with source maps
- **Logs**: `logs/` - Daily rotating Winston logs with structured JSON format

### Authentication (Mock System):

- **Users**: `admin`, `master`, `officer` (password: `password123`)
- **Permissions**: Role-based access control with JWT tokens
- **Context**: React authentication context with login/logout functionality

## External Dependencies

- **Frontend**:
  - `@radix-ui/*` - UI component primitives
  - `@tanstack/react-query` - Data fetching and caching
  - `wouter` - Client-side routing
  - `tailwindcss` - Utility-first styling
  - `lucide-react` - Icon library
- **Backend**:
  - `express` - Web framework
  - `drizzle-orm` - Type-safe ORM
  - `@neondatabase/serverless` - PostgreSQL database connection
  - `winston` - Enterprise logging
  - `jsonwebtoken` - JWT authentication
  - `connect-pg-simple` - Session storage
- **Development & Build**:
  - `vite` - Frontend build tool
  - `rollup` - Backend bundling
  - `esbuild` - Fast bundling fallback
  - `typescript` - Type safety
  - `eslint` - Code linting
  - `drizzle-kit` - Database migrations

## File Structure Changes (Production Features):

### Server Middleware (`server/middleware/`):

- `logger.ts` - Winston request logging with daily rotation
- `errorHandler.ts` - Global error handling with custom error classes
- `auth.ts` - JWT authentication and role-based permissions

### Database (`server/database.ts`):

- MySQL connection pooling with health checks
- Auto-reconnection and connection lifecycle management

### Migrations (`server/migrations/`):

- `migrationRunner.ts` - Automated migration execution
- `migration_001_initial_tables.ts` - Sample schema migration

### Build Configuration:

- `rollup.config.js` - Production bundling configuration
- `quality.js` - Code quality validation script
- `build.js` - Complete build pipeline
- `.eslintrc.json` - TypeScript and React linting rules
