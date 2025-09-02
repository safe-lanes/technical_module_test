# Technical Module Documentation

## Overview

The Technical Module is a full-stack maritime Planned Maintenance System (PMS) designed for cargo ship operations. It manages three core aspects: Certificate & Surveys Management, Defect Reporting, and Planned Maintenance System compliance with classification societies (DNV, ABS).

## Frontend Architecture

### Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter (lightweight router)
- **UI Components**: shadcn/ui design system

### Project Structure

```
client/src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── contexts/           # React Context providers
├── services/           # API service layer
├── utils/              # Helper functions
├── lib/                # Third-party integrations
└── styles/             # Global styles
```

### Key Components

#### Core UI Components (shadcn/ui)

- **Button**: Primary interaction component with variants
- **Dialog**: Modal dialogs for forms and confirmations
- **Table**: Data display with sorting and pagination
- **Form**: Form handling with validation
- **Select**: Dropdown selections
- **Input**: Text inputs with validation states
- **Toast**: Notification system
- **Drawer**: Side panels for detailed views
- **Card**: Content containers
- **Badge**: Status indicators

#### Custom Components

- **TopMenuBar**: Main navigation with submodule switching
- **SideMenuBar**: Secondary navigation for module sections
- **ComponentTreeSelector**: Hierarchical component selection
- **TargetPicker**: Cross-module item selection overlay
- **ProposeChanges**: Change request modification interface
- **WorkOrderForm**: Work order creation and editing
- **ComponentRegisterForm**: Component registration interface

### React Hooks

#### Built-in Hooks Used

- `useState`: Local component state management
- `useEffect`: Side effects and lifecycle management
- `useContext`: Context consumption
- `useCallback`: Function memoization for performance
- `useMemo`: Value memoization for expensive computations

#### Custom Hooks

- **useModifyMode**: Manages modify mode state across components
- **use-mobile**: Responsive design breakpoint detection
- **use-toast**: Toast notification management

#### TanStack Query Hooks

- `useQuery`: Data fetching with caching
- `useMutation`: Server state mutations
- `useQueryClient`: Cache management

### Context Providers

#### ChangeRequestContext

```typescript
interface ChangeRequestContextType {
  currentRequest: ChangeRequest | null;
  isCreating: boolean;
  targetSelection: TargetSelection | null;
  proposedChanges: ProposedChange[];
  // ... other state and methods
}
```

#### ChangeModeContext

```typescript
interface ChangeModeContextType {
  isModifyMode: boolean;
  targetType: string | null;
  targetId: string | null;
  fieldChanges: Record<string, any>;
  // ... state management methods
}
```

### State Management Strategy

1. **Server State**: Managed by TanStack Query
   - Automatic caching and invalidation
   - Background refetching
   - Optimistic updates

2. **Local State**: React useState for component-specific state

3. **Global State**: React Context for cross-component communication

### Routing Structure

```
/                           # Main Technical Module
/pms/components            # Components management
/pms/work-orders          # Work orders
/pms/running-hrs          # Running hours tracking
/pms/modify-pms           # Change requests
/spares                   # Spares inventory
/stores                   # Stores inventory
/admin/alerts             # Alert management
```

## Backend Architecture

### Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (production) / MySQL (production) / In-memory (development)
- **ORM**: Drizzle ORM
- **Validation**: Zod schemas
- **Logging**: Winston with daily rotation
- **Authentication**: JWT-based with role-based permissions
- **Error Handling**: Global middleware with custom error classes
- **Build Tools**: Vite + Rollup with quality checks

### Production Features (Enterprise-Grade)

#### Database Connection Pooling

- **MySQL Connection Pool**: Max 20 connections with health checks
- **Auto-reconnection**: Automatic reconnection on connection loss
- **Connection Lifecycle**: Proper connection acquisition and release
- **Health Monitoring**: Connection status monitoring and logging

#### Winston Logging System

- **Structured Logging**: JSON format with detailed request information
- **Daily Rotation**: Automatic log file rotation in `logs/` directory
- **Request Tracking**: Complete HTTP request/response logging
- **Error Logging**: Comprehensive error tracking with stack traces
- **Log Levels**: Configurable logging levels (info, warn, error)

#### Authentication & Authorization

- **JWT Authentication**: JSON Web Token-based user authentication
- **Role-Based Access Control**: Admin, Master, Officer permission levels
- **Permission System**: Granular permissions for different operations
- **Mock Users**: Development-ready authentication with predefined users
- **React Context Integration**: Frontend authentication state management

#### Error Handling Middleware

- **Global Error Handler**: Centralized error processing
- **Custom Error Classes**: AppError, ValidationError, DatabaseError
- **Async Error Wrapper**: Automatic async error catching
- **HTTP Status Mapping**: Proper HTTP status code responses
- **Error Logging**: All errors logged with Winston

#### Migration System

- **Drizzle Migrations**: Type-safe database schema migrations
- **Version Control**: Schema version tracking and management
- **Automated Execution**: Migration runner with rollback support
- **Development Safety**: Safe migration execution in development

### Project Structure

```
server/
├── routes/             # API route handlers
├── middleware/         # Production middleware
│   ├── logger.ts      # Winston request logging
│   ├── errorHandler.ts # Global error handling
│   └── auth.ts        # JWT authentication
├── migrations/         # Database migration system
│   ├── migrationRunner.ts    # Migration execution
│   └── migration_001_*.ts   # Schema migrations
├── utils/              # Utility functions
│   └── errors.ts      # Custom error classes
├── storage.ts         # Data access layer interface
├── database.ts        # Database implementation (MySQL pooling)
├── db.ts             # Database connection
├── index.ts          # Server entry point
└── vite.ts           # Development server integration
```

### API Architecture

#### RESTful Endpoints

**Authentication API**

```
POST   /api/auth/login                     # User authentication
POST   /api/auth/logout                    # User logout
GET    /api/health                         # System health check
```

**Components API**

```
GET    /api/components/:vesselId           # Get vessel components
POST   /api/components                     # Create component
PUT    /api/components/:id                 # Update component
DELETE /api/components/:id                 # Delete component
```

**Running Hours API**

```
GET    /api/running-hours/components/:vesselId    # Get components for RH
POST   /api/running-hours/update/:componentId     # Update RH
POST   /api/running-hours/bulk-update             # Bulk RH update
GET    /api/running-hours/audits/:componentId     # Get audit history
POST   /api/running-hours/utilization-rates      # Calculate utilization
```

**Spares API**

```
GET    /api/spares/:vesselId               # Get vessel spares
GET    /api/spares/item/:id               # Get single spare
POST   /api/spares                        # Create spare
PUT    /api/spares/:id                    # Update spare
DELETE /api/spares/:id                    # Delete spare
POST   /api/spares/:id/consume            # Consume spare
POST   /api/spares/:id/receive            # Receive spare
POST   /api/spares/bulk-update            # Bulk operations
GET    /api/spares/history/:vesselId      # Transaction history
```

**Change Requests API**

```
GET    /api/modify-pms/requests           # Get change requests (with filters)
GET    /api/modify-pms/requests/:id       # Get single request
POST   /api/modify-pms/requests           # Create request (draft)
PUT    /api/modify-pms/requests/:id       # Update request
PUT    /api/modify-pms/requests/:id/target     # Update target
PUT    /api/modify-pms/requests/:id/proposed   # Update proposed changes
PUT    /api/modify-pms/requests/:id/submit     # Submit for review
PUT    /api/modify-pms/requests/:id/approve    # Approve request
PUT    /api/modify-pms/requests/:id/reject     # Reject request
PUT    /api/modify-pms/requests/:id/return     # Return for clarification
DELETE /api/modify-pms/requests/:id            # Delete draft
```

**Alert Management API**

```
GET    /api/alerts/policies              # Get alert policies
POST   /api/alerts/policies              # Create policy
PUT    /api/alerts/policies/:id          # Update policy
DELETE /api/alerts/policies/:id          # Delete policy
GET    /api/alerts/events                # Get alert events
POST   /api/alerts/events/:id/acknowledge # Acknowledge alert
```

### Data Access Layer

#### Storage Interface (IStorage)

```typescript
interface IStorage {
  // Component operations
  getComponents(vesselId: string): Promise<Component[]>;
  createComponent(component: InsertComponent): Promise<Component>;
  updateComponent(id: string, updates: Partial<Component>): Promise<Component>;
  deleteComponent(id: string): Promise<boolean>;

  // Running Hours operations
  createRunningHoursAudit(audit: InsertRunningHoursAudit): Promise<RunningHoursAudit>;
  getRunningHoursAudits(componentId: string, limit?: number): Promise<RunningHoursAudit[]>;

  // Spares operations
  getSpares(vesselId: string): Promise<Spare[]>;
  createSpare(spare: InsertSpare): Promise<Spare>;
  consumeSpare(id: number, qty: number, userId: string, ...): Promise<Spare>;
  receiveSpare(id: number, qty: number, userId: string, ...): Promise<Spare>;

  // Change Request operations
  getChangeRequests(filters: any): Promise<ChangeRequest[]>;
  createChangeRequest(request: InsertChangeRequest): Promise<ChangeRequest>;
  submitChangeRequest(id: number, userId: string): Promise<ChangeRequest>;
  // ... other methods
}
```

## Database Structure

### Core Tables

#### Components Table

```sql
CREATE TABLE components (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  component_code TEXT,
  parent_id TEXT,
  category TEXT NOT NULL,
  current_cumulative_rh DECIMAL(10,2) DEFAULT 0,
  last_updated TEXT,
  vessel_id TEXT NOT NULL DEFAULT 'V001',
  maker TEXT,
  model TEXT,
  serial_no TEXT,
  dept_category TEXT,
  component_category TEXT,
  location TEXT,
  commissioned_date TEXT,
  critical BOOLEAN DEFAULT false,
  class_item BOOLEAN DEFAULT false
);
```

#### Running Hours Audit Table

```sql
CREATE TABLE running_hours_audit (
  id INTEGER PRIMARY KEY,
  vessel_id TEXT NOT NULL,
  component_id TEXT NOT NULL,
  previous_rh DECIMAL(10,2) NOT NULL,
  new_rh DECIMAL(10,2) NOT NULL,
  cumulative_rh DECIMAL(10,2) NOT NULL,
  date_updated_local TEXT NOT NULL,
  date_updated_tz TEXT NOT NULL,
  entered_at_utc TIMESTAMP NOT NULL,
  user_id TEXT NOT NULL,
  source TEXT NOT NULL,
  notes TEXT,
  meter_replaced BOOLEAN DEFAULT false,
  old_meter_final DECIMAL(10,2),
  new_meter_start DECIMAL(10,2),
  version INTEGER DEFAULT 1
);
```

#### Spares Table

```sql
CREATE TABLE spares (
  id INTEGER PRIMARY KEY,
  part_code TEXT NOT NULL,
  part_name TEXT NOT NULL,
  component_id TEXT NOT NULL,
  component_code TEXT,
  component_name TEXT NOT NULL,
  component_spare_code TEXT,
  critical TEXT NOT NULL,
  rob INTEGER DEFAULT 0,
  min INTEGER DEFAULT 0,
  location TEXT,
  vessel_id TEXT NOT NULL DEFAULT 'V001',
  deleted BOOLEAN DEFAULT false
);
```

#### Spares History Table

```sql
CREATE TABLE spares_history (
  id INTEGER PRIMARY KEY,
  timestamp_utc TIMESTAMP NOT NULL,
  vessel_id TEXT NOT NULL,
  spare_id INTEGER NOT NULL,
  event_type TEXT NOT NULL, -- 'CONSUME' | 'RECEIVE' | 'ADJUST'
  qty_change INTEGER NOT NULL,
  rob_after INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  remarks TEXT,
  reference TEXT,
  date_local TEXT,
  tz TEXT,
  place TEXT
);
```

#### Change Request Tables

```sql
CREATE TABLE change_request (
  id INTEGER PRIMARY KEY,
  vessel_id TEXT NOT NULL,
  category TEXT NOT NULL, -- 'components' | 'work_orders' | 'spares'
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  target_type TEXT, -- 'component' | 'spare' | 'work_order'
  target_id TEXT,
  snapshot_before_json JSON,
  proposed_changes_json JSON,
  move_preview_json JSON,
  status TEXT DEFAULT 'draft', -- 'draft' | 'submitted' | 'approved' | 'rejected'
  requested_by_user_id TEXT NOT NULL,
  submitted_at TIMESTAMP,
  reviewed_by_user_id TEXT,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE change_request_attachment (
  id INTEGER PRIMARY KEY,
  change_request_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_by_user_id TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE change_request_comment (
  id INTEGER PRIMARY KEY,
  change_request_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Data Flow

#### Component Management

1. **Create**: POST to `/api/components` → Storage.createComponent() → Database INSERT
2. **Read**: GET `/api/components/:vesselId` → Storage.getComponents() → Database SELECT
3. **Update**: PUT `/api/components/:id` → Storage.updateComponent() → Database UPDATE
4. **Delete**: DELETE `/api/components/:id` → Storage.deleteComponent() → Database DELETE

#### Running Hours Tracking

1. **Update RH**: POST to `/api/running-hours/update/:id`
   - Creates audit entry in `running_hours_audit`
   - Updates `current_cumulative_rh` in `components`
   - Calculates utilization rates

#### Spares Management

1. **Consume**: POST to `/api/spares/:id/consume`
   - Decrements `rob` in `spares` table
   - Creates history entry with negative `qty_change`
   - Validates sufficient stock

2. **Receive**: POST to `/api/spares/:id/receive`
   - Increments `rob` in `spares` table
   - Creates history entry with positive `qty_change`

#### Change Request Workflow

1. **Draft Creation**: Creates entry with status 'draft'
2. **Target Selection**: Updates `target_type`, `target_id`, `snapshot_before_json`
3. **Propose Changes**: Updates `proposed_changes_json`
4. **Submit**: Changes status to 'submitted', sets `submitted_at`
5. **Review**: Updates status to 'approved'/'rejected', sets reviewer info

## Toast Notification System

### Implementation

Uses shadcn/ui toast components with custom hook:

```typescript
// Hook usage
const { toast } = useToast();

// Success notification
toast({
  title: 'Success',
  description: 'Component updated successfully',
});

// Error notification
toast({
  title: 'Error',
  description: 'Failed to update component',
  variant: 'destructive',
});
```

### Toast Types

- **Success**: Green styling for successful operations
- **Error**: Red styling for errors and failures
- **Warning**: Yellow styling for warnings
- **Info**: Blue styling for informational messages

## Build System & Quality Assurance

### Production Build Pipeline

#### Build Commands

- **Quality Check**: `node quality.js`
  - TypeScript type checking with `--skipLibCheck`
  - ESLint validation with React and TypeScript rules
  - Build configuration validation
- **Full Production Build**: `node build.js`
  - Step 1: Quality checks execution
  - Step 2: Frontend build with Vite (optimized bundles)
  - Step 3: Backend build with Rollup (with esbuild fallback)
  - Step 4: Source map generation

- **Build Command Equivalent**: `node npm-run-quality.js && rollup -c`

#### Build Configuration Files

- **`rollup.config.js`**: Backend bundling configuration
  - TypeScript compilation with source maps
  - JSON file support via `@rollup/plugin-json`
  - Terser compression for production
  - External dependency handling
- **`quality.js`**: Code quality validation script
  - Non-blocking TypeScript checks
  - ESLint validation with max 50 warnings
  - Build readiness verification

- **`.eslintrc.json`**: Code quality rules
  - TypeScript and React-specific rules
  - Import/export validation
  - Code style enforcement

#### Build Outputs

- **Frontend**: `dist/public/` - Optimized Vite build with asset chunking
- **Backend**: `dist/index.js` - Bundled Express server with source maps
- **Source Maps**: Generated for both frontend and backend debugging

### Code Quality Features

- **TypeScript Strict Mode**: Enhanced type safety and error detection
- **ESLint Integration**: Automated code style and error checking
- **Path Aliases**: Clean import statements with `@assets/*` support
- **Build Validation**: Pre-build quality checks ensure deployability

## Performance Optimizations

### Frontend

1. **React Query Caching**: Automatic data caching and background updates
2. **Component Memoization**: useCallback and useMemo for expensive operations
3. **Lazy Loading**: Route-based code splitting
4. **Optimistic Updates**: Immediate UI updates before server confirmation
5. **Asset Optimization**: Vite-powered bundle splitting and compression

### Backend

1. **Database Indexing**: Strategic indexes on frequently queried columns
2. **Connection Pooling**: MySQL connection pool with max 20 connections
3. **Request Validation**: Zod schemas for input validation
4. **Error Handling**: Centralized error handling with proper HTTP status codes
5. **Request Logging**: Winston-based structured logging with minimal overhead

## Security Considerations

1. **Input Validation**: Zod schemas validate all inputs
2. **SQL Injection Prevention**: Drizzle ORM with parameterized queries
3. **CORS Configuration**: Proper cross-origin resource sharing setup
4. **Error Information**: Sanitized error messages to prevent information leakage
5. **JWT Authentication**: Token-based authentication with role verification
6. **Password Security**: Secure password validation (mock implementation)
7. **Session Management**: JWT token expiration and validation
8. **Route Protection**: Middleware-based authentication for protected routes

## Authentication System Details

### Mock Authentication Setup

The system includes a complete authentication implementation for development and testing:

#### User Accounts (Mock)

- **Admin User**: `admin` / `password123`
  - Full system access
  - User management capabilities
  - All module permissions
- **Master User**: `master` / `password123`
  - Senior officer access level
  - Most operations permitted
  - Limited administrative functions
- **Officer User**: `officer` / `password123`
  - Standard user access
  - Basic operations only
  - View and edit permissions

#### JWT Token System

- **Token Generation**: Issued upon successful login
- **Token Validation**: Middleware validates tokens on protected routes
- **Role-Based Access**: Tokens include user role for permission checking
- **Expiration**: Configurable token expiration (default: 24 hours)

#### Frontend Authentication

- **AuthContext**: React context for authentication state management
- **Login Component**: User authentication interface
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Permission Checking**: Component-level role-based rendering

### Converting Mock Authentication to Real Authentication

The current system uses mock authentication for development. To implement real authentication in production:

#### Backend Authentication Changes

**Step 1: Replace Mock User Store**

```typescript
// server/middleware/auth.ts - Remove mock users
// Replace mockUsers Map with database user lookup

// Example implementation:
export const authenticateUser = async (
  username: string,
  password: string
): Promise<AuthUser | null> => {
  // Replace with real database user lookup
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    permissions: await getUserPermissions(user.id),
    vesselId: user.vesselId,
  };
};
```

**Step 2: Add Password Hashing**

```bash
npm install bcryptjs @types/bcryptjs
```

**Step 3: User Database Schema**

```typescript
// shared/schema.ts - Add users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull(), // 'admin' | 'master' | 'officer'
  vesselId: text('vessel_id').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  lastLogin: timestamp('last_login'),
});
```

**Step 4: Implement User Registration**

```typescript
// Add registration endpoint in routes
app.post('/api/auth/register', async (req, res) => {
  const { username, password, role, vesselId } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db
    .insert(users)
    .values({
      id: generateId(),
      username,
      passwordHash,
      role,
      vesselId,
    })
    .returning();

  res.json({ success: true, user: omit(user, ['passwordHash']) });
});
```

#### Frontend Authentication Changes

**Step 1: Update Login Component**

- Remove hardcoded password (`password123`)
- Add proper form validation
- Handle authentication errors appropriately

**Step 2: Add Registration Component** (if needed)

```typescript
// For admin user creation in production
export function UserRegistration() {
  // Form for creating new users with proper validation
}
```

#### Environment Configuration

```env
# Production environment variables
JWT_SECRET=your-secure-random-secret-key-here
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
```

### Deployment Architecture Options

The Technical Module can be deployed in two primary configurations:

#### Option 1: Standalone Module Deployment

**Configuration:**

```javascript
// For standalone deployment
const config = {
  standalone: true,
  authentication: 'internal', // Uses internal JWT system
  database: 'dedicated', // Own database instance
  port: 5000,
};
```

**Features:**

- **Independent Authentication**: Complete JWT-based auth system
- **Dedicated Database**: Own PostgreSQL/MySQL instance
- **Full API Surface**: All REST endpoints exposed
- **Direct Access**: Direct URL access to all functionality
- **Resource Isolation**: Independent resource management

**Use Case:** Independent vessel management or separate deployment requirements

#### Option 2: Microfrontend Integration

**Configuration:**

```javascript
// micro-frontend.config.js
export const moduleFederationConfig = {
  name: 'technical-module',
  filename: 'remoteEntry.js',
  exposes: {
    './TechnicalModule': './client/src/App.tsx',
    './ComponentsModule': './client/src/pages/Components.tsx',
    './SparesModule': './client/src/pages/Spares.tsx',
    './RunningHoursModule': './client/src/pages/RunningHours.tsx',
    './ChangeRequestsModule': './client/src/pages/ModifyPMS.tsx',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    '@tanstack/react-query': { singleton: true },
  },
};
```

**Integration with Host Application:**

```typescript
// Host application integration
import { lazy } from 'react';

const TechnicalModule = lazy(() => import('technical-module/TechnicalModule'));
const ComponentsModule = lazy(() => import('technical-module/ComponentsModule'));

// In host routing
<Route path="/technical" element={<TechnicalModule />} />
<Route path="/technical/components" element={<ComponentsModule />} />
```

**Features:**

- **Shared Authentication**: Uses host application authentication
- **Shared Navigation**: Integrated with main application navigation
- **Resource Sharing**: Shared React instances and dependencies
- **Unified Experience**: Seamless integration with other modules
- **Cross-Module Communication**: Shared state and events

#### Authentication Integration for Microfrontend

**Shared Authentication Context:**

```typescript
// Host application provides authentication
const TechnicalModuleWrapper = () => {
  const { user, token } = useHostAuth(); // From parent application

  return (
    <AuthProvider value={{ user, token, isAuthenticated: !!user }}>
      <TechnicalModule />
    </AuthProvider>
  );
};
```

**API Integration:**

```typescript
// Technical module uses host authentication
const apiClient = {
  baseURL: process.env.TECHNICAL_MODULE_API_URL,
  headers: {
    Authorization: `Bearer ${getHostAuthToken()}`,
  },
};
```

#### Production Deployment Considerations

**Standalone Deployment:**

- **Pros**: Independent scaling, isolated resources, full control
- **Cons**: Separate authentication, potential UI inconsistency
- **Best For**: Dedicated vessel systems, independent maritime operations

**Microfrontend Deployment:**

- **Pros**: Unified UX, shared authentication, consistent branding
- **Cons**: Deployment coordination, shared dependency management
- **Best For**: Fleet management systems, integrated maritime platforms

Both deployment options maintain full functionality with the same codebase, differing only in configuration and integration approach.

## Logging System (Winston)

### Production Logging Features

The application includes comprehensive logging with Winston:

#### Log Configuration

- **Format**: Structured JSON logging for production
- **Rotation**: Daily log rotation with automatic cleanup
- **Location**: All logs stored in `logs/` directory
- **Levels**: Configurable log levels (info, warn, error)

#### Log Types

- **Request Logs**: All HTTP requests with timing and response codes
- **Error Logs**: Complete error tracking with stack traces
- **Authentication Logs**: Login attempts and JWT validation
- **Database Logs**: Connection status and query performance
- **Application Logs**: Business logic events and system status

#### Log File Structure

```
logs/
├── application-2024-01-01.log    # Daily application logs
├── error-2024-01-01.log         # Daily error logs
└── combined-2024-01-01.log      # Combined application logs
```

#### Development vs Production

- **Development**: Console output with readable format
- **Production**: JSON format with structured fields
- **Debug Mode**: Additional verbose logging when enabled

## Development Environment

### Storage Strategy

- **Development**: In-memory storage for rapid prototyping
- **Production**: PostgreSQL/MySQL with Drizzle ORM

### Hot Reload

- Vite development server with HMR
- TypeScript compilation on the fly
- Automatic server restart on changes
- Winston logging active in development mode

## API Code Locations

### Primary API Routes

All API endpoints are defined in the following files:

#### Main Routes File

- **File**: `server/routes.ts`
- **Contains**: Core API endpoints for all modules
  - Components API (`/api/components/`)
  - Running Hours API (`/api/running-hours/`)
  - Spares API (`/api/spares/`)
  - Change Requests API (`/api/modify-pms/`)

#### Modular Route Files

- **File**: `server/routes/bulk.ts`
  - Bulk import/export operations
  - File upload handling
  - Import history management

- **File**: `server/routes/alerts.ts`
  - Alert policies management
  - Alert events handling
  - Notification acknowledgments

- **File**: `server/routes/forms.ts`
  - Form configuration APIs
  - Dynamic form management
  - Form validation endpoints

- **File**: `server/routes/changeRequests.ts`
  - Extended change request operations
  - Advanced workflow management
  - Approval process handling

### API Entry Point

- **File**: `server/index.ts`
  - Express server configuration
  - Middleware setup
  - Route registration
  - Error handling

### Data Access Layer

- **File**: `server/storage.ts`
  - Storage interface definition (IStorage)
  - In-memory storage implementation
  - Business logic abstraction

- **File**: `server/database.ts`
  - MySQL database implementation
  - Database connection management
  - SQL query implementations

## Database Migration to MySQL

### Prerequisites

1. MySQL 5.7+ or MariaDB 10.2+ installed
2. Database admin access
3. Node.js 18+ with npm

### Step 1: Create MySQL Database

```sql
-- Connect to MySQL as root or admin user
CREATE DATABASE technical_pms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user (recommended)
CREATE USER 'tech_admin'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON technical_pms.* TO 'tech_admin'@'localhost';
FLUSH PRIVILEGES;
```

### Step 2: Install MySQL Dependencies

```bash
npm install mysql2 drizzle-orm
```

### Step 3: Configure Environment Variables

Create `.env` file in project root:

```env
DATABASE_URL="mysql://tech_admin:secure_password_here@localhost:3306/technical_pms"
NODE_ENV="production"
PORT="5000"
```

### Step 4: Update Database Configuration

- **File**: `drizzle.config.ts` - Already configured for MySQL
- **File**: `server/database.ts` - Contains MySQL implementation
- **File**: `shared/schema.ts` - Database schema definitions

### Step 5: Initialize Database Schema

```bash
# Push schema to database (creates tables)
npm run db:push

# Alternative: Generate and run migrations
npm run db:generate
npm run db:migrate
```

### Step 6: Update Storage Implementation

In `server/routes.ts`, the system automatically detects MySQL and uses database storage instead of in-memory storage.

### Step 7: Test Database Connection

```bash
npm run dev
```

Check console for:

- ✅ "Database connected successfully"
- ⚠️ "Technical Module using in-memory storage" (indicates connection issue)

### Database Schema Migration

The system includes automatic schema creation for all tables:

- `components` - Ship component hierarchy
- `running_hours_audit` - Running hours tracking
- `spares` - Spare parts inventory
- `spares_history` - Transaction history
- `change_request` - Change request management
- `change_request_attachment` - File attachments
- `change_request_comment` - Comments and reviews

## Deployment Instructions

### Development Server Deployment

#### Local Development on Replit

1. **Environment Setup**:

   ```bash
   # No additional setup needed - uses in-memory storage
   npm run dev
   ```

2. **With MySQL on Replit**:

   ```bash
   # Set environment variables in Replit Secrets
   # DATABASE_URL=mysql://username:password@host:port/database
   npm run dev
   ```

3. **Port Configuration**:
   - Development server runs on port 5000
   - Replit automatically forwards port 5000 to public URL
   - Access via: `https://<repl-name>.<username>.replit.dev`

#### Development Features

- Hot module replacement (HMR) via Vite
- Automatic TypeScript compilation
- In-memory storage (no persistence)
- Auto-restart on file changes
- Console logging for API calls

### Production Server Deployment

#### Replit Deployment (Recommended)

1. **Build Application**:

   ```bash
   npm run build
   ```

2. **Configure Deployment**:
   - Use **Autoscale Deployment** for web applications
   - Set run command: `npm start`
   - Set build command: `npm run build`
   - Configure environment variables in Replit Secrets

3. **Environment Variables for Production**:

   ```env
   NODE_ENV=production
   DATABASE_URL=mysql://username:password@host:port/database
   PORT=5000
   ```

4. **Database Setup for Production**:
   - Use Replit PostgreSQL (recommended) or external MySQL
   - Configure connection string in secrets
   - Run database initialization: `npm run db:push`

5. **Deployment Configuration**:

   ```bash
   # Build command
   npm run build

   # Run command
   npm start
   ```

#### Production Optimization Features

- Compiled TypeScript to JavaScript
- Minified frontend assets
- Static file serving
- Production error handling
- Database connection pooling
- Automatic HTTPS on Replit

#### Database Options for Production

**Option 1: Replit PostgreSQL (Recommended)**

- Built-in PostgreSQL service
- Automatic backups
- High availability
- Update `drizzle.config.ts` to use PostgreSQL dialect

**Option 2: External MySQL**

- Cloud MySQL (AWS RDS, Google Cloud SQL)
- Self-hosted MySQL server
- Configure DATABASE_URL in secrets

**Option 3: Replit Database (KV Store)**

- For simple key-value storage needs
- Limited SQL capabilities
- Good for caching and sessions

### Deployment Best Practices

1. **Security**:
   - Store all sensitive data in Replit Secrets
   - Use strong database passwords
   - Enable SSL/TLS for database connections
   - Configure CORS for production domains

2. **Performance**:
   - Enable database connection pooling
   - Configure appropriate timeout values
   - Use indexes on frequently queried columns
   - Monitor memory usage

3. **Monitoring**:
   - Check deployment logs regularly
   - Monitor database performance
   - Set up error alerts
   - Track API response times

4. **Backup Strategy**:
   - Regular database backups
   - Export critical configuration data
   - Version control for all code changes
   - Document deployment procedures

### Troubleshooting Production Issues

1. **Database Connection Issues**:

   ```bash
   # Check environment variables
   echo $DATABASE_URL

   # Test database connection
   npm run db:push
   ```

2. **Build Failures**:

   ```bash
   # Check TypeScript compilation
   npm run check

   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Runtime Errors**:
   - Check deployment logs in Replit console
   - Verify all environment variables are set
   - Ensure database is accessible
   - Check API endpoint responses

This documentation provides a comprehensive overview of the Technical Module's architecture, data flow, API locations, database migration steps, and deployment procedures for maritime PMS operations.
