# Element Crew Appraisals System

## Overview

This is a full-stack web application for managing crew appraisals in the maritime industry. The application is built with a React frontend using TypeScript and modern UI components, backed by an Express.js server with PostgreSQL database integration. The system appears to be designed for tracking and managing crew member performance evaluations across different vessels.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend:

- **Frontend**: React 18 with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Library**: Extensive use of shadcn/ui components providing a consistent design system
- **Styling**: Tailwind CSS with CSS variables for theming support
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query for efficient server state management
- **Icons**: Lucide React for consistent iconography

### Backend Architecture
- **API Server**: Express.js with TypeScript for type safety
- **Database Layer**: Drizzle ORM with PostgreSQL dialect
- **Development Setup**: In-memory storage fallback for development
- **Middleware**: Custom logging middleware for API request tracking

### Database Schema
The application uses a simple user-based schema with:
- Users table with id, username, and password fields
- Drizzle ORM for type-safe database operations
- Migration support through drizzle-kit

## Data Flow

1. **Client Requests**: Frontend makes API calls to `/api/*` endpoints
2. **Server Processing**: Express server handles requests with custom middleware
3. **Data Storage**: Storage interface abstracts database operations
4. **Response Handling**: TanStack Query manages response caching and error states
5. **UI Updates**: React components re-render based on query state changes

## External Dependencies

### Frontend Dependencies
- **@radix-ui/***: Accessible UI primitive components
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing solution
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

### Backend Dependencies
- **express**: Web application framework
- **drizzle-orm**: Type-safe ORM
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **connect-pg-simple**: PostgreSQL session store

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration tool

## Deployment Strategy

The application is configured for modern deployment with:

- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Environment**: Supports both development and production modes
- **Database**: Configured for PostgreSQL with environment variable connection
- **Static Assets**: Frontend builds to `dist/public` for serving
- **Process Management**: Separate dev and production start scripts

The architecture supports deployment to platforms like Replit, with specific configurations for development tooling and runtime error handling in the Replit environment.

## Changelog

```
Changelog:
- July 02, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```