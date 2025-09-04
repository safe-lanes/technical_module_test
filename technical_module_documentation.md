# Technical Module Documentation - Maritime PMS

## Overview

The Technical Module is a production-ready, enterprise-grade maritime Planned Maintenance System (PMS) built with modern web technologies and MySQL RDS database integration. The system provides comprehensive management of technical equipment maintenance, scheduling, and performance tracking for maritime vessels.

## System Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite build system with hot module replacement
- TailwindCSS for styling with custom maritime theme
- shadcn/ui component library for consistent UI
- AG Grid Enterprise for advanced data grids
- TanStack Query (React Query) for data fetching and caching
- Wouter for lightweight client-side routing
- React Hook Form with Zod validation

**Backend:**
- Node.js with Express.js framework
- TypeScript for type safety
- MySQL RDS database with persistent storage
- Drizzle ORM for type-safe database operations
- Connection pooling for optimal performance

**Production Features:**
- Winston structured logging with daily rotation
- JWT-based authentication with role-based permissions
- Global error handling middleware
- Request logging and monitoring
- Database connection health checks
- Enterprise-grade build pipeline with quality checks

## Database Architecture

### MySQL RDS Integration

The system uses MySQL RDS (Amazon Relational Database Service) for persistent data storage with the following configuration:

```typescript
// Database Connection Pool Configuration
{
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 20,
  waitForConnections: true,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
}
```

### Database Schema

#### Core Tables

**Components Table**
```sql
CREATE TABLE components (
  id VARCHAR(100) PRIMARY KEY,
  vessel_id VARCHAR(50) NOT NULL DEFAULT 'V001',
  name VARCHAR(255) NOT NULL,
  component_code VARCHAR(50),
  parent_id VARCHAR(100),
  category VARCHAR(100),
  current_cumulative_rh DECIMAL(10,2) DEFAULT '0.00',
  last_updated VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Running Hours Audit Table**
```sql
CREATE TABLE running_hours_audit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vessel_id VARCHAR(50) NOT NULL,
  component_id VARCHAR(100) NOT NULL,
  previous_rh DECIMAL(10,2) NOT NULL,
  new_rh DECIMAL(10,2) NOT NULL,
  cumulative_rh DECIMAL(10,2) NOT NULL,
  date_updated_local VARCHAR(50) NOT NULL,
  date_updated_tz VARCHAR(50) NOT NULL,
  entered_at_utc TIMESTAMP NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  source VARCHAR(20) NOT NULL,
  notes TEXT,
  meter_replaced BOOLEAN NOT NULL DEFAULT FALSE,
  old_meter_final DECIMAL(10,2),
  new_meter_start DECIMAL(10,2),
  version INT NOT NULL DEFAULT 1,
  INDEX idx_component_entered (component_id, entered_at_utc),
  INDEX idx_component_date (component_id, date_updated_local)
);
```

**Spares Table**
```sql
CREATE TABLE spares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vessel_id VARCHAR(50) NOT NULL,
  part_code VARCHAR(100) NOT NULL,
  part_name VARCHAR(255) NOT NULL,
  component_id VARCHAR(100),
  component_code VARCHAR(50),
  component_name VARCHAR(255),
  component_spare_code VARCHAR(100),
  critical ENUM('Critical', 'No', 'Non-Critical') DEFAULT 'No',
  rob INT NOT NULL DEFAULT 0,
  min INT NOT NULL DEFAULT 0,
  location VARCHAR(100),
  deleted BOOLEAN DEFAULT FALSE,
  ihm_presence ENUM('Yes', 'No', 'Unknown', 'Partial') DEFAULT 'Unknown',
  ihm_evidence_type ENUM('Certificate', 'Test Report', 'Visual Inspection', 'None') DEFAULT 'None',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vessel_deleted (vessel_id, deleted),
  INDEX idx_component_id (component_id),
  INDEX idx_part_code (part_code)
);
```

**Spares History Table**
```sql
CREATE TABLE spares_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timestamp_utc TIMESTAMP NOT NULL,
  vessel_id VARCHAR(50) NOT NULL,
  spare_id INT NOT NULL,
  part_code VARCHAR(100) NOT NULL,
  part_name VARCHAR(255) NOT NULL,
  component_id VARCHAR(100),
  component_code VARCHAR(50),
  component_name VARCHAR(255),
  component_spare_code VARCHAR(100),
  event_type ENUM('CONSUME', 'RECEIVE', 'ADJUST') NOT NULL,
  qty_change INT NOT NULL,
  rob_after INT NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  remarks TEXT,
  reference VARCHAR(255),
  date_local VARCHAR(50),
  place VARCHAR(100),
  tz VARCHAR(50)
);
```

**Change Requests Table**
```sql
CREATE TABLE change_request (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vessel_id VARCHAR(50) NOT NULL,
  category ENUM('component', 'work_order', 'spare', 'store') NOT NULL,
  status ENUM('draft', 'submitted', 'approved', 'rejected', 'returned') NOT NULL DEFAULT 'draft',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  justification TEXT,
  target_id VARCHAR(255),
  target_snapshot JSON,
  proposed_changes JSON,
  submitted_at TIMESTAMP NULL,
  reviewed_at TIMESTAMP NULL,
  created_by VARCHAR(100) NOT NULL,
  reviewed_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Architecture

### Authentication Endpoints

**Location:** `server/routes.ts` (Lines 30-52)

#### POST `/api/auth/login`
Authenticates user and returns JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "admin",
    "username": "admin",
    "role": "admin",
    "permissions": ["read", "write", "admin"]
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/logout`
Logs out current user.

### Component Management Endpoints

**Location:** `server/routes.ts` (Lines 52-79)

#### GET `/api/components/:vesselId`
Fetches all components for vessel with hierarchical structure.

**Response:**
```json
[
  {
    "id": "1",
    "vesselId": "V001",
    "name": "Ship General", 
    "componentCode": "SG",
    "parentId": null,
    "category": "Root",
    "currentCumulativeRH": "100.00",
    "lastUpdated": "03 Sept 2025 15:30"
  }
]
```

#### GET `/api/components/vessel/:vesselId`
Alternative endpoint for component fetching.

### Work Orders Endpoints

**Location:** `server/routes.ts` (Lines 90-175)

#### GET `/api/work-orders/:vesselId`
Fetches all work orders for a vessel.

#### POST `/api/work-orders/:vesselId`
Creates new work order.

**Request Body:**
```json
{
  "componentId": "6.1",
  "title": "Engine Maintenance",
  "description": "Regular engine inspection",
  "priority": "High",
  "plannedDate": "2025-09-05",
  "estimatedHours": 4
}
```

#### PUT `/api/work-orders/:vesselId/:workOrderId`
Updates existing work order.

#### DELETE `/api/work-orders/:vesselId/:workOrderId`
Deletes work order.

#### GET `/api/work-orders`
Gets all work orders across vessels.

### Running Hours Endpoints

**Location:** `server/routes.ts` (Lines 175-343)

#### GET `/api/running-hours/components/:vesselId`
Fetches all components with current running hours.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Ship General",
    "componentCode": "SG",
    "currentCumulativeRH": "100.00",
    "lastUpdated": "03 Sept 2025 15:30",
    "vesselId": "V001"
  }
]
```

#### POST `/api/running-hours/update/:componentId`
Updates running hours for single component.

**Request Body:**
```json
{
  "componentId": "1",
  "audit": {
    "vesselId": "V001",
    "componentId": "1",
    "previousRH": 0,
    "newRH": 150,
    "cumulativeRH": 150,
    "dateUpdatedLocal": "03 Sept 2025 15:30",
    "dateUpdatedTZ": "Asia/Kolkata",
    "enteredAtUTC": "2025-09-03T10:00:00.000Z",
    "userId": "current-user",
    "source": "single",
    "notes": "Regular maintenance update",
    "meterReplaced": false,
    "version": 1
  },
  "cumulativeRH": 150,
  "dateUpdatedLocal": "03 Sept 2025 15:30"
}
```

#### POST `/api/running-hours/bulk-update`
Bulk update running hours for multiple components.

**Request Body:**
```json
{
  "updates": [
    {
      "componentId": "1",
      "audit": { /* audit data */ },
      "cumulativeRH": 150,
      "dateUpdatedLocal": "03 Sept 2025 15:30"
    }
  ]
}
```

#### GET `/api/running-hours/audits/:componentId`
Retrieves audit history for component with pagination.

**Query Parameters:**
- `limit`: Number of records (default: 10)

#### POST `/api/running-hours/utilization-rates`
Calculates utilization rates for components over date range.

### Spares Management Endpoints

**Location:** `server/routes.ts` (Lines 343-622)

#### GET `/api/spares/:vesselId`
Fetches all spares for vessel with IHM information.

**Response:**
```json
[
  {
    "id": 1,
    "partCode": "SP-ME-001",
    "partName": "Fuel Injector",
    "componentId": "6.1",
    "componentCode": "6.1",
    "componentName": "Main Engine",
    "componentSpareCode": "SP-6.1-001",
    "critical": "Critical",
    "rob": 2,
    "min": 1,
    "location": "Store Room A",
    "vesselId": "V001",
    "deleted": false,
    "ihmPresence": "Yes",
    "ihmEvidenceType": "Certificate",
    "stockStatus": "OK"
  }
]
```

#### GET `/api/spares/item/:id`
Fetches single spare by ID.

#### POST `/api/spares`
Creates new spare part.

**Request Body:**
```json
{
  "partCode": "SP-NEW-001",
  "partName": "New Spare Part",
  "componentId": "6.1",
  "critical": "No",
  "rob": 5,
  "min": 2,
  "location": "Store Room A",
  "vesselId": "V001",
  "ihmPresence": "Unknown",
  "ihmEvidenceType": "None"
}
```

#### PUT `/api/spares/:id`
Updates existing spare part.

#### DELETE `/api/spares/:id`
Soft deletes spare part.

#### POST `/api/spares/:id/consume`
Consumes quantity from spare inventory.

**Request Body:**
```json
{
  "qty": 1,
  "dateLocal": "04 Sept 2025 13:00",
  "tz": "Asia/Singapore",
  "place": "Engine Room",
  "remarks": "Used for maintenance",
  "userId": "officer1",
  "vesselId": "V001"
}
```

#### POST `/api/spares/:id/receive`
Receives quantity into spare inventory.

**Request Body:**
```json
{
  "qty": 5,
  "dateLocal": "04 Sept 2025 13:00", 
  "tz": "Asia/Singapore",
  "place": "Port Singapore",
  "remarks": "Supply delivery",
  "userId": "officer1",
  "vesselId": "V001"
}
```

#### POST `/api/spares/bulk-update`
Bulk update multiple spares for consume/receive operations.

**Request Body:**
```json
{
  "updates": [
    {
      "componentSpareId": 1,
      "consumed": 2,
      "received": 5,
      "receivedDate": "04 Sept 2025 13:00",
      "receivedPlace": "Port Singapore"
    }
  ],
  "vesselId": "V001"
}
```

#### GET `/api/spares/history/:vesselId`
Fetches transaction history for all spares in vessel.

#### GET `/api/spares/history/spare/:spareId`
Fetches transaction history for specific spare.

### Stores Management Endpoints

**Location:** `server/routes.ts` (Lines 622-695)

#### GET `/api/stores/:vesselId`
Fetches all store items for vessel.

#### POST `/api/stores/:vesselId/transaction`
Records store transaction (consume/receive).

**Request Body:**
```json
{
  "itemCode": "ST-001",
  "type": "consume",
  "quantity": 2,
  "dateLocal": "04 Sept 2025 13:00",
  "reference": "Work Order 123",
  "remarks": "Used for deck maintenance"
}
```

#### GET `/api/stores/:vesselId/history`
Fetches store transaction history.

#### PUT `/api/stores/:vesselId/item/:itemCode`
Updates store item details.

### Change Request (Modify PMS) Endpoints

**Location:** `server/routes.ts` (Lines 695-989)

#### GET `/api/modify-pms/requests`
Fetches all change requests with filtering.

**Query Parameters:**
- `status`: Filter by status (draft, submitted, approved, etc.)
- `category`: Filter by category (component, work_order, spare, store)
- `vesselId`: Filter by vessel

#### GET `/api/modify-pms/requests/:id`
Fetches single change request by ID.

#### POST `/api/modify-pms/requests`
Creates new change request.

**Request Body:**
```json
{
  "vesselId": "V001",
  "category": "spare",
  "title": "Update Spare Part Details",
  "description": "Request to update spare part information",
  "justification": "Incorrect supplier information needs correction"
}
```

#### PUT `/api/modify-pms/requests/:id`
Updates change request details.

#### PUT `/api/modify-pms/requests/:id/target`
Sets target for change request (what item to modify).

**Request Body:**
```json
{
  "targetId": "1",
  "targetSnapshot": {
    "id": 1,
    "partCode": "SP-ME-001", 
    "partName": "Fuel Injector",
    "location": "Store Room A"
  }
}
```

#### PUT `/api/modify-pms/requests/:id/proposed`
Sets proposed changes for request.

**Request Body:**
```json
{
  "proposedChanges": {
    "location": {
      "old": "Store Room A",
      "new": "Store Room B"
    },
    "min": {
      "old": 1,
      "new": 2
    }
  }
}
```

#### PUT `/api/modify-pms/requests/:id/submit`
Submits change request for review.

#### PUT `/api/modify-pms/requests/:id/approve`
Approves change request.

#### PUT `/api/modify-pms/requests/:id/reject`
Rejects change request.

**Request Body:**
```json
{
  "reason": "Insufficient justification provided"
}
```

#### PUT `/api/modify-pms/requests/:id/return`
Returns change request for modifications.

**Request Body:**
```json
{
  "reason": "Please provide more detailed justification"
}
```

#### DELETE `/api/modify-pms/requests/:id`
Deletes change request (draft only).

#### POST `/api/modify-pms/requests/:id/attachments`
Adds attachment to change request.

#### POST `/api/modify-pms/requests/:id/comments`
Adds comment to change request.

**Request Body:**
```json
{
  "comment": "Please review the updated specifications",
  "userId": "admin"
}
```

### Data Type Conversions

**MySQL Compatibility:**
- Decimal fields (previousRH, newRH, cumulativeRH) → Stored as strings
- Timestamp fields (enteredAtUTC) → Converted to Date objects
- Boolean fields → Native boolean values
- JSON fields → Stored as JSON strings

## Frontend Architecture

### File Structure & Implementation

```
client/src/
├── pages/
│   ├── TechnicalModule.tsx               # Main module entry point
│   ├── pms/
│   │   ├── RunningHours.tsx             # Running hours management
│   │   ├── Components.tsx               # Component hierarchy 
│   │   ├── WorkOrders.tsx               # Work order management
│   │   └── ModifyPMS/                   # Change request system
│   │       ├── ModifyPMS.tsx
│   │       ├── ChangeRequestModal.tsx
│   │       └── ProposeChanges.tsx
│   └── spares/
│       ├── SparesNew.tsx               # Primary spares module (Active)
│       └── Spares.tsx                  # Alternative AG Grid implementation
├── components/
│   ├── common/
│   │   ├── AgGridTable.tsx             # Enterprise AG Grid wrapper
│   │   ├── AgGridCellRenderers.tsx     # Custom cell renderers
│   │   └── ComponentTreeSelector.tsx    # Hierarchical component picker
│   ├── modify/
│   │   ├── ModifyFieldWrapper.tsx      # Field-level change tracking
│   │   └── ModifyStickyFooter.tsx      # Change request controls
│   ├── change-request-forms/           # Module-specific change forms
│   │   ├── ComponentChangeRequestForm.tsx
│   │   ├── SparesChangeRequestForm.tsx
│   │   ├── StoresChangeRequestForm.tsx
│   │   └── WorkOrdersChangeRequestForm.tsx
│   └── ui/                             # shadcn/ui components
├── lib/
│   ├── queryClient.ts                  # TanStack Query configuration
│   └── utils.ts                        # Utility functions
└── config/
    └── features.ts                     # Feature flags and configuration
```

### Key Implementation Files

**Server Architecture:**
```
server/
├── index.ts                  # Express server setup
├── routes.ts                 # All API endpoints (30+ routes)
├── database.ts               # MySQL connection & DatabaseStorage class
├── storage.ts                # IStorage interface & MemStorage fallback
└── middleware/               # Authentication, logging, error handling
```

**Database Layer:**
- **Location:** `server/database.ts` 
- **Class:** `DatabaseStorage implements IStorage`
- **Connection:** MySQL RDS with connection pooling
- **Features:** Transaction logging, error handling, type conversion

**API Layer:**
- **Location:** `server/routes.ts`
- **Routes:** 30+ RESTful endpoints across all modules
- **Middleware:** Authentication, request logging, global error handling
- **Validation:** Zod schema validation for all inputs

### State Management

**TanStack Query Keys:**
```typescript
// Component data
['/api/running-hours/components', vesselId]

// Utilization rates
['/api/running-hours/utilization-rates', vesselId]

// Audit history
['/api/running-hours/audits', componentId]
```

### AG Grid Enterprise Integration

**Features Implemented:**
- Server-side data loading
- Advanced filtering and sorting
- Column grouping and aggregation
- CSV export functionality
- Cell renderers for custom data display
- Status indicators and utilization rates

## Authentication & Security

### JWT-Based Authentication
```typescript
// Mock user roles
{
  admin: { permissions: ['read', 'write', 'admin'] },
  master: { permissions: ['read', 'write'] },
  officer: { permissions: ['read'] }
}
```

### Middleware Stack
1. Request logging (Winston)
2. Authentication verification
3. Permission checking
4. Global error handling
5. Response formatting

## Build & Deployment

### Build Pipeline
```bash
# Quality checks
node quality.js          # TypeScript + ESLint validation

# Full build
node build.js           # Quality checks + build + bundle

# Development
npm run dev             # Hot reload development server
```

### Build Output
```
dist/
├── public/             # Frontend assets
├── index.js           # Bundled backend server
└── logs/              # Winston log files
```

### Environment Variables

**Required MySQL Configuration:**
```bash
MYSQL_HOST=your-rds-endpoint
MYSQL_PORT=3306
MYSQL_USER=your-username
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=your-database-name
```

## Performance Optimizations

### Database
- Connection pooling with 20 concurrent connections
- Indexed queries on frequently accessed columns
- Optimistic UI updates with cache invalidation

### Frontend
- Code splitting and lazy loading
- Memoized calculations for utilization rates
- Debounced search and filtering
- Efficient AG Grid virtualization

### Backend
- Structured logging for monitoring
- Request/response compression
- Error aggregation and tracking
- Health check endpoints

## Data Flow Architecture

### Running Hours Update Flow
1. User selects component in AG Grid
2. Opens update dialog with current values from MySQL
3. Validates input and calculates new totals
4. Submits to `/api/running-hours/update/:componentId`
5. Server converts data types for MySQL compatibility
6. Creates audit entry and updates component
7. Frontend cache invalidated and data refreshed
8. AG Grid displays updated values

### Bulk Update Flow
1. User opens bulk update dialog
2. Grid populated with current MySQL data
3. User enters values for multiple components
4. Validation occurs client-side
5. Batch submitted to `/api/running-hours/bulk-update`
6. Server processes each update with audit trail
7. All updates committed or rolled back atomically
8. Cache invalidated and grid refreshed

## Module Integration

### PMS Submodules
- **Components**: Hierarchical equipment management
- **Work Orders**: Maintenance task scheduling
- **Running Hours**: Equipment utilization tracking  
- **Spares**: Inventory management with ROB tracking
- **Reports**: Data export and analytics
- **Modify PMS**: Change request workflow
- **Admin**: System configuration

### Cross-Module Communication
- Shared component tree structure
- Unified change request system
- Consistent audit trails
- Enterprise authentication

## Monitoring & Logging

### Winston Configuration
```typescript
{
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/maritime-pms-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
}
```

### Database Operation Logging
All MySQL operations are logged with:
- Operation type
- Parameters
- Execution time
- Success/failure status

## Error Handling

### Global Error Middleware
```typescript
export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Global error handler', { error, url: req.url });
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};
```

### Frontend Error Boundaries
- React error boundaries for component isolation
- Toast notifications for user feedback
- Automatic retry mechanisms for failed requests
- Graceful degradation for offline scenarios

## Implementation Guidelines for Developers

### Quick Start Setup

1. **Environment Setup:**
```bash
# Required MySQL environment variables
MYSQL_HOST=your-rds-endpoint
MYSQL_PORT=3306
MYSQL_USER=your-username
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=technical_pms
```

2. **Database Initialization:**
```bash
# Database schema will be auto-created on first connection
# IHM fields added via manual migration for compatibility
npm run dev  # Starts development server
```

3. **Key Development Commands:**
```bash
npm run dev              # Development server with hot reload
npm run build           # Production build with quality checks
node quality.js         # TypeScript + ESLint validation
npx prettier --write .  # Code formatting
```

### Development Patterns

#### Adding New API Endpoints
**File:** `server/routes.ts`
```typescript
// Pattern for new endpoint
app.get('/api/new-module/:vesselId', async (req, res) => {
  try {
    const result = await storage.getNewModuleData(req.params.vesselId);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
```

#### Adding Database Methods
**File:** `server/database.ts` (DatabaseStorage class)
```typescript
async getNewModuleData(vesselId: string): Promise<any[]> {
  logDbOperation('getNewModuleData', { vesselId });
  try {
    const result = await this.db
      .select()
      .from(newTable)
      .where(eq(newTable.vesselId, vesselId));
    return result;
  } catch (error) {
    console.error('MySQL Error:', error);
    throw new Error('Failed to fetch new module data');
  }
}
```

#### Frontend Data Fetching
**Pattern:** TanStack Query with React
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['/api/new-module', vesselId],
  queryFn: async () => {
    const response = await fetch(`/api/new-module/${vesselId}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },
});
```

### Testing & Quality Assurance

#### Production Build Pipeline
```bash
# Complete quality & build process
node quality.js && npm run build

# Output validation
✅ TypeScript check passed
✅ ESLint check passed  
✅ Code formatting validated
✅ Production build successful
```

#### Database Testing
```bash
# Test MySQL connection
node -e "require('./server/database.ts')"

# Verify data persistence
curl http://localhost:5000/api/spares/V001
```

### Security Considerations

#### Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Server validates and returns JWT token
3. Frontend stores token in memory (not localStorage)
4. All API calls include Authorization header
5. Server validates JWT on protected routes

#### Data Validation
- All inputs validated with Zod schemas
- SQL injection prevented with parameterized queries
- XSS protection via input sanitization
- CORS configured for production domains

### Performance Optimization

#### Database Performance
- Connection pooling (20 concurrent connections)
- Indexed queries on primary lookup fields
- Audit trail optimized for time-based queries
- Soft deletes instead of hard deletes

#### Frontend Performance  
- Code splitting with dynamic imports
- Memoized calculations for heavy operations
- Debounced search inputs (300ms delay)
- Virtual scrolling for large datasets
- Optimistic UI updates with rollback

### Deployment Architecture

#### Production Environment
```bash
# Build for production
node build.js

# Generated output
dist/
├── public/           # Static frontend assets
├── index.js         # Bundled Node.js server
└── logs/            # Winston structured logs
```

#### Health Checks
- Database connection monitoring
- API endpoint health validation
- Log rotation and cleanup
- Memory usage tracking

### Troubleshooting Guide

#### Common Issues

**Database Connection Failed:**
```bash
# Check environment variables
echo $MYSQL_HOST $MYSQL_DATABASE

# Test connection manually  
node -e "const mysql = require('mysql2/promise'); /* connection test */"
```

**API 500 Errors:**
```bash
# Check server logs
tail -f logs/maritime-pms-$(date +%Y-%m-%d).log

# Verify database schema
DESCRIBE spares; # Should include ihm_presence, ihm_evidence_type
```

**Frontend Build Issues:**
```bash
# Clean and rebuild
rm -rf node_modules dist && npm install && npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

## Future Enhancements

### Planned Features
- Real-time synchronization with WebSocket
- Advanced reporting with charts and analytics  
- Mobile-responsive PWA capabilities
- Integration with external maritime systems
- Multi-vessel support with vessel selection
- Advanced role-based permissions
- Automated maintenance scheduling

### Scalability Considerations
- Database sharding for multi-vessel deployments
- Redis caching layer for high-traffic scenarios
- CDN integration for global deployment
- Microservices architecture for independent scaling
- Event-driven architecture for real-time updates

---

*This documentation reflects the current production-ready implementation with MySQL RDS integration, enterprise-grade features, and comprehensive maritime PMS functionality. Last updated: September 2025.*