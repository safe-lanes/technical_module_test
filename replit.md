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

## Crew Appraisals Data Population

### Table Data Source
- **Primary Source**: Data populated from submitted appraisal forms
- **One-to-One Relationship**: Each table row corresponds to one completed appraisal form
- **Auto-populated Fields**:
  - **Crew ID**: Auto-populated from database based on selected crew member name
  - **Vessel Type**: Auto-populated from database based on selected vessel
- **Form-derived Fields**: All other fields populated from form submission data

### Filter Functionality
- **Toggle Behavior**: Filters button shows/hides the filter row
- **Filter Types Available**:
  - Name search (text input)
  - Rank selection
  - Vessel type selection
  - Nationality selection
  - Appraisal type selection
  - Rating range selection
- **Filter Actions**: Apply and Clear buttons to manage filter state

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

## Admin Module

### Architecture
- **Route**: `/admin` - dedicated admin submodule
- **Navigation**: Clickable Admin menu item in top navigation bar
- **Left Sidebar**: Contains multiple admin function icons (Forms currently implemented)
- **Default View**: Opens Forms configuration by default when accessing admin

### Forms Configuration
- **Purpose**: Configure various forms used across other sub-modules
- **Data Model**: Forms table with id, name, versionNo, versionDate fields
- **UI Components**: Reuses exact same table components as Appraisals module
- **API Endpoints**: Full CRUD operations at `/api/forms`
- **Features**:
  - Table view with Form, Version No, Version Date columns
  - Edit button opens form configuration editor modal
  - Loading states and error handling
  - Pagination display
  - Consistent styling with Appraisals table

### Form Editor Modal
- **Purpose**: Customize crew appraisal forms for different configurations
- **Structure**: Exact copy of crew appraisal form (Parts A-G) from appraisal section
- **Version Control**: 
  - Initial version starts at Version 0
  - Subsequent versions will have version number and date tracking
- **Parts Include**:
  - Part A: Seafarer's Information
  - Part B: Information at Start of Appraisal Period  
  - Part C: Competence Assessment (Professional Knowledge & Skills)
  - Part D: Behavioural Assessment (Soft Skills)
  - Part E: Training Needs & Development
  - Part F: Summary & Recommendations
  - Part G: Office Review & Followup
- **UI Features**:
  - Left sidebar navigation between form sections
  - Modal overlay design
  - Save draft functionality
  - Form validation with Zod schema
  - Responsive layout matching original appraisal form

### Configurable Rank Groups
- **Purpose**: Dynamic configuration of rank groups for different form types
- **Add Rank Group**: '+' button next to form names opens dialog for creating new rank groups
- **Rank Selection**: Multi-select interface with all available maritime ranks
- **Available Ranks**: Predefined ranks including Master, Chief Officer, Engineers, Officers, Bosun, AB, OS, Oiler, Wiper
- **View Functionality**: Eye icon next to rank group names shows hover tooltip with assigned ranks
- **Data Structure**: 
  - Forms table links to rank groups via foreign key
  - Rank groups store array of assigned rank names
  - Available ranks categorized by Senior Officers, Junior Officers, Ratings
- **UI Features**:
  - Dialog-based rank group creation with form validation
  - Tooltip hover display of ranks per group
  - Checkbox multi-select for rank assignment
  - Real-time rank group management

### Data Flow
1. **Navigation**: Top menu Admin → Left sidebar Forms (default)
2. **Data Fetching**: TanStack Query fetches from `/api/forms`
3. **Backend**: Express routes handle CRUD operations
4. **Storage**: In-memory storage with sample data initialization

## Database Integration Status

### Current Implementation: MySQL Database (Production-Ready)
- **Database Type**: MySQL (compatible with Angular 19/NestJS stack)
- **Connection**: Fully integrated with persistent data storage
- **Schema**: Complete MySQL schema with auto-increment IDs and proper foreign keys
- **Data Persistence**: All data persists across application restarts
- **Seeding**: Automatic database seeding with sample data on first run
- **Fallback**: Graceful fallback to in-memory storage if MySQL unavailable
- **Status**: ✅ Production-ready with MySQL integration

### Database Tables Created:
- `users` - User authentication and management
- `forms` - Form configurations and version control
- `available_ranks` - Maritime rank definitions
- `rank_groups` - Configurable rank groupings per form
- `crew_members` - Crew member profiles and information
- `appraisal_results` - Completed appraisal evaluations and ratings

### API Endpoints (All Functional):
- `/api/crew-members` - Full CRUD operations for crew management
- `/api/appraisals` - Complete appraisal results management
- `/api/forms` - Form configuration management
- `/api/available-ranks` - Rank management system
- `/api/rank-groups` - Dynamic rank group configuration

### Sample Data Available:
- 3 crew members with complete profiles
- 3 corresponding appraisal results with ratings
- 12 maritime ranks across all categories
- 1 configured form with rank groups
- All data sourced from database, no static/mock data

## Changelog

```
Changelog:
- July 02, 2025. Initial setup
- July 07, 2025. Added Admin submodule with Forms configuration table
- July 07, 2025. Added Form Editor modal with exact copy of crew appraisal form (Parts A-G), version control starting at v0
- July 07, 2025. Fixed Part G table alignment issue - G2 Training Followup table now appears correctly below heading, resolved JSX syntax errors, maintained consolidated G1/G2 structure with blue #16569e headings
- July 07, 2025. Added "Rank Group" column to Admin Forms table, positioned between Form and Version No columns, displays "All Ranks" value for each form
- July 07, 2025. Implemented configurable rank groups functionality with '+' button for adding rank groups, view button with hover tooltips showing assigned ranks, dialog-based rank group creation with multi-select rank assignment, and backend API endpoints for rank groups and available ranks management
- July 08, 2025. Implemented enhanced version control UI with proper state management, single interactive bar in configuration mode, multiple clickable bars in normal mode when draft exists, automatic switching to draft version when saving, and proper "Release Ver"/"Discard Ver" functionality
- July 08, 2025. Added configurable fields functionality with "Hide Field" button for Personality Index (PI) Category field - button appears only in configuration mode with #52baf3 color, fields and labels are completely hidden when not in config mode, field state persists across mode changes
- July 08, 2025. Implemented "Hide Section" buttons for Part B main section, B1 subsection, and B2 subsection with #52baf3 styling, grayed-out placeholders for hidden sections in configuration mode, and dynamic section renumbering system where hidden sections completely disappear outside configuration mode and remaining sections renumber sequentially (e.g., when Part B is hidden, Part C becomes Part B)
- July 08, 2025. Implemented configurable Part C and Part D table functionality with "Add Criterion" buttons, empty tables by default, unlimited row addition, editable Assessment Criteria and Weight fields with blue #52baf3 text in configuration mode, weight validation requiring 100% total for each section, warning dialog with equal distribution option, and delete buttons for criteria in configuration mode
- July 09, 2025. Enhanced Part F2 recommendations system with default non-deletable recommendations, configurable additional recommendations with blue #52baf3 styling, proper AlertDialog for configuration mode prompts, placeholder text behavior for new recommendations, and editable/non-editable field functionality with Edit button control
- July 09, 2025. Added comprehensive validation system for blank assessment criteria fields in Parts C and D, blank custom recommendation fields in Part F, preventing save draft or configuration mode exit until all required fields are filled, with clear error dialog showing specific validation issues
- July 09, 2025. Implemented configurable dropdown functionality for "Appraisal Type" field with blue #52baf3 highlighting in configuration mode, clickable label and dropdown opens dialog for editing dropdown options with add/edit/delete capabilities
- July 09, 2025. Extended configurable dropdown functionality to "Personality Index (PI) Category" field with same blue styling and dialog-based option management
- July 09, 2025. Implemented configurable "Effectiveness" Rating dropdown common across Parts B, C, and D tables - blue indication shown only in first row of each table, single configuration affects all tables with shared rating options
- July 09, 2025. Added configurable dropdown functionality for "Category" and "Status" fields in Part G2 Training Followup table - blue indication shown only in first row, separate configuration dialogs for each field type with add/edit/delete capabilities
- July 09, 2025. **PRODUCTION DEPLOYMENT**: Complete PostgreSQL database integration with real data persistence, automatic seeding, all API endpoints functional, crew members and appraisals loading from database with full CRUD operations
- July 09, 2025. **MYSQL MIGRATION**: Successfully converted from PostgreSQL to MySQL for Angular 19/NestJS stack compatibility, maintained all functionality including data persistence, API endpoints, CRUD operations, automatic seeding, and micro frontend capabilities
- July 09, 2025. **ENHANCED COMMENT FUNCTIONALITY**: Improved comment system with click-to-edit behavior - comments display as uneditable text when not in edit mode, clicking comment text enables editing with textarea, only delete button remains on right side, comments auto-save when focus is lost
- July 09, 2025. **COMPLETE CONFIRMATION DIALOGS**: Added confirmation dialogs ("Do you want to delete? Yes/No") to all delete functions across the entire application - training records, targets, training needs, competence/behavioral assessments, recommendations, office reviews, training followups, all comment deletions, and all FormEditor configuration options - prevents accidental deletions throughout the system
- July 09, 2025. **UNIFIED REACT DIALOGS**: Successfully replaced all browser window.confirm() popups with proper React AlertDialog components across both AppraisalForm.tsx and FormEditor.tsx - 12 different delete functions now use consistent "Delete [Item]" / "Are you sure you want to delete..." dialog pattern with Yes/No buttons, improving user experience and maintaining design consistency
- July 09, 2025. **OPERATIONAL FILTERS**: Implemented fully functional filter system for Crew Appraisals table - added state management for all filter inputs (Search Name, Rank, Vessel Type, Nationality, Appraisal Type, Rating), real-time filtering logic, and Clear button functionality - filters now work immediately as users type or select options, providing dynamic table filtering experience
- July 09, 2025. **RESPONSIVE FORM EDITOR**: Made Admin Sub-module's Crew Appraisal Form Editor fully responsive and mobile-friendly - enhanced modal dialog structure with responsive sizing (max-w-[95vw] on mobile), mobile-optimized sidebar navigation with collapsible behavior, responsive grid layouts for form sections, horizontal scrolling tables for mobile interaction, mobile-compatible configuration dialogs, and touch-friendly button sizing throughout
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```