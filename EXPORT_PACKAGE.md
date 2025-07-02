# Element Crew Appraisals System - Export Package

## Overview
This package contains the complete Element Crew Appraisals System that can be imported into another Replit project.

## System Requirements
- Node.js 20+
- PostgreSQL (optional, uses in-memory storage by default)

## Installation Instructions

### 1. Create New Replit Project
1. Create a new Replit project
2. Select "Node.js" template
3. Copy all files from this export package to your new project

### 2. Install Dependencies
Run the following command to install all required packages:
```bash
npm install
```

### 3. Start the Application
```bash
npm run dev
```

## File Structure
```
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # UI components (shadcn/ui)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   ├── pages/         # Application pages
│   │   └── main.tsx       # Entry point
│   └── index.html
├── server/                # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage interface
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and types
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Key Features
- Full-stack TypeScript application
- React frontend with shadcn/ui components
- Express.js backend with type-safe APIs
- PostgreSQL support with in-memory fallback
- Responsive design with Tailwind CSS
- Crew appraisal management system

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query

## Environment Variables (Optional)
```
DATABASE_URL=your_postgresql_connection_string
```

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Notes
- The system uses in-memory storage by default for development
- All UI components are from shadcn/ui library
- The application is configured for Replit deployment
- Includes comprehensive crew appraisal management features

## Support
This is a complete working system ready for deployment and further development.