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
  rob INT NOT NULL DEFAULT 0,
  min_qty INT NOT NULL DEFAULT 0,
  max_qty INT NOT NULL DEFAULT 0,
  unit VARCHAR(50),
  location VARCHAR(100),
  supplier VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

### Running Hours Endpoints

#### GET `/api/running-hours/components/:vesselId`
Fetches all components for a vessel with their current running hours.

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
Updates running hours for a single component.

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
Retrieves audit history for a component.

#### POST `/api/running-hours/utilization-rates`
Calculates utilization rates for components.

### Data Type Conversions

**MySQL Compatibility:**
- Decimal fields (previousRH, newRH, cumulativeRH) → Stored as strings
- Timestamp fields (enteredAtUTC) → Converted to Date objects
- Boolean fields → Native boolean values
- JSON fields → Stored as JSON strings

## Frontend Architecture

### Component Structure

```
client/src/
├── pages/pms/
│   ├── RunningHours.tsx      # Main running hours management
│   ├── Components.tsx        # Component hierarchy management
│   ├── Spares.tsx           # Spares inventory management
│   └── ModifyPMS/           # Change request system
├── components/
│   ├── common/              # Shared components
│   └── ui/                  # shadcn/ui components
└── lib/
    ├── queryClient.ts       # TanStack Query configuration
    └── utils.ts             # Utility functions
```

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

*This documentation reflects the current production-ready implementation with MySQL RDS integration, enterprise-grade features, and comprehensive maritime PMS functionality.*