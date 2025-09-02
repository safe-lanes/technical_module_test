
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
- **Database**: PostgreSQL (production) / In-memory (development)
- **ORM**: Drizzle ORM
- **Validation**: Zod schemas

### Project Structure
```
server/
├── routes/             # API route handlers
├── storage.ts         # Data access layer interface
├── database.ts        # Database implementation
├── db.ts             # Database connection
├── index.ts          # Server entry point
└── vite.ts           # Development server integration
```

### API Architecture

#### RESTful Endpoints

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
  title: "Success",
  description: "Component updated successfully",
});

// Error notification
toast({
  title: "Error",
  description: "Failed to update component",
  variant: "destructive",
});
```

### Toast Types
- **Success**: Green styling for successful operations
- **Error**: Red styling for errors and failures
- **Warning**: Yellow styling for warnings
- **Info**: Blue styling for informational messages

## Performance Optimizations

### Frontend
1. **React Query Caching**: Automatic data caching and background updates
2. **Component Memoization**: useCallback and useMemo for expensive operations
3. **Lazy Loading**: Route-based code splitting
4. **Optimistic Updates**: Immediate UI updates before server confirmation

### Backend
1. **Database Indexing**: Strategic indexes on frequently queried columns
2. **Connection Pooling**: Efficient database connection management
3. **Request Validation**: Zod schemas for input validation
4. **Error Handling**: Centralized error handling with proper HTTP status codes

## Security Considerations

1. **Input Validation**: Zod schemas validate all inputs
2. **SQL Injection Prevention**: Drizzle ORM with parameterized queries
3. **CORS Configuration**: Proper cross-origin resource sharing setup
4. **Error Information**: Sanitized error messages to prevent information leakage

## Development Environment

### Storage Strategy
- **Development**: In-memory storage for rapid prototyping
- **Production**: PostgreSQL with Drizzle ORM

### Hot Reload
- Vite development server with HMR
- TypeScript compilation on the fly
- Automatic server restart on changes

This documentation provides a comprehensive overview of the Technical Module's architecture, data flow, and implementation details for maritime PMS operations.
