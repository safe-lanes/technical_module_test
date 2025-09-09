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

## Local Development Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MySQL Database** (local or RDS instance)
3. **Git** for version control

### Environment Configuration

1. **Create `.env.local`** with your MySQL credentials:
```env
MYSQL_HOST=your-mysql-host
MYSQL_DATABASE=technical_module
MYSQL_USER=your-username
MYSQL_PASSWORD='your-password'
```

**Important**: Wrap passwords containing special characters in single quotes.

### Installation & Setup

1. **Clone and Install**:
```bash
git clone <repository-url>
cd technical_module
npm install
```

2. **Database Setup**:
```bash
# Push database schema to MySQL
npm run db:push
```

3. **Start Development Server**:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Production Deployment with Nginx

#### Nginx Configuration

Add these location blocks to your nginx configuration **before existing location blocks**:

```nginx
# ===============================================
# TECHNICAL MODULE Frontend (Microfrontend)
# ===============================================
location /technical/ {
    proxy_pass http://localhost:5000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS Headers
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";

    # Preflight OPTIONS request handling
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 204;
    }
}

# ===============================================
# TECHNICAL MODULE APIs (Dedicated endpoint)
# ===============================================
location /technical-api/ {
    proxy_pass http://localhost:5000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # CORS headers for API calls
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";

    # Handle preflight OPTIONS requests
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 204;
    }
}
```

#### API Endpoint Configuration

The application uses **centralized API configuration** (`client/src/config/api.ts`):

- **Local Development**: Endpoints use `/api/*`
- **Production (Nginx)**: Automatically switches to `/technical-api/*`
- **Environment Detection**: Automatic based on hostname

#### Access URLs

| Environment | Frontend | API Endpoints |
|-------------|----------|---------------|
| **Local** | `http://localhost:5000/` | `http://localhost:5000/api/*` |
| **Production** | `https://domain.com/technical/` | `https://domain.com/technical-api/*` |

### Database Connection

- **Local Development**: Direct MySQL connection via environment variables
- **Production**: MySQL RDS with connection pooling (max 20 connections)
- **Health Checks**: Automatic connection monitoring and auto-reconnection

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
  - `mysql2` - MySQL database connection
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
