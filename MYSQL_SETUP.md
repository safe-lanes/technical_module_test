
# MySQL Database Setup for Element Crew Appraisals

## Database Migration from PostgreSQL to MySQL

This application has been migrated to use MySQL instead of PostgreSQL while maintaining all existing functionality.

## Setup Instructions

### 1. MySQL Database Setup

#### Option A: Local MySQL Installation
```bash
# Install MySQL (Ubuntu/Debian)
sudo apt update
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Create database and user
sudo mysql -u root -p
```

```sql
CREATE DATABASE element_crew_appraisals;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON element_crew_appraisals.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Option B: Cloud MySQL Services

**PlanetScale (Recommended for production):**
```bash
# Sign up at planetscale.com
# Create a new database
# Get connection string from dashboard
```

**AWS RDS MySQL:**
```bash
# Create RDS MySQL instance in AWS console
# Configure security groups and VPC
# Get endpoint and credentials
```

**Google Cloud SQL:**
```bash
# Create Cloud SQL MySQL instance
# Configure authorized networks
# Get connection details
```

### 2. Environment Configuration

1. Copy the example environment file:
```bash
cp environment.example .env
```

2. Update the DATABASE_URL with your MySQL connection string:
```env
DATABASE_URL=mysql://username:password@localhost:3306/element_crew_appraisals
```

### 3. Database Migration

Run the database migration to create tables:
```bash
npm run db:push
```

### 4. Installation and Startup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# For production
npm run build
npm run start
```

## Micro Frontend Integration

### Standalone Mode (Default)
The application runs as a complete standalone React app with its own routing and state management.

### Micro Frontend Mode
The application can be consumed as a micro frontend in an Angular host application.

#### Integration Steps:

1. **Build for Micro Frontend:**
```bash
npm run build:micro-frontend
```

2. **Host Application Integration (Angular):**
```typescript
// In your Angular app
import { loadRemoteModule } from '@angular-architects/module-federation';

// Load the micro frontend
const elementCrewAppraisals = await loadRemoteModule({
  type: 'module',
  remoteEntry: 'http://localhost:5000/remoteEntry.js',
  exposedModule: './App'
});

// Mount the micro frontend
const { bootstrap } = elementCrewAppraisals;
const unmount = bootstrap({
  apiBaseUrl: 'http://your-api-base',
  authToken: 'your-jwt-token',
  onAuthRequired: () => {
    // Handle authentication
  }
}).mount(document.getElementById('micro-frontend-container'));
```

3. **Component-Level Integration:**
```typescript
// Mount specific components
const { bootstrap } = elementCrewAppraisals;
const unmount = bootstrap().mountComponent(
  'AppraisalForm', 
  document.getElementById('appraisal-form-container'),
  { 
    apiBaseUrl: 'http://your-api-base',
    authToken: 'your-jwt-token' 
  }
);
```

### Authentication Integration

The micro frontend supports token-based authentication:

```typescript
// Update authentication token
window.ElementCrewAppraisals.updateConfig({
  authToken: 'new-jwt-token'
});

// Handle authentication expiry
window.ElementCrewAppraisals.updateConfig({
  onAuthRequired: () => {
    // Redirect to login or refresh token
    window.location.href = '/login';
  }
});
```

### CSS Isolation

The micro frontend automatically isolates its styles to prevent conflicts with the host application:

- All styles are scoped to `.micro-frontend-isolated`
- CSS variables are contained within the micro frontend
- No global style pollution

## Database Schema Changes

### Key Changes from PostgreSQL:
- `serial` replaced with `int AUTO_INCREMENT`
- Array columns converted to JSON strings
- PostgreSQL-specific functions removed
- MySQL-compatible data types used

### Migration Considerations:
- Existing data needs manual migration
- Array fields (like `ranks`) are now JSON strings
- All existing API endpoints remain unchanged
- CRUD operations work identically

## Troubleshooting

### Database Connection Issues:
1. Verify MySQL is running: `sudo systemctl status mysql`
2. Check connection string format
3. Ensure user has proper permissions
4. Verify firewall settings

### Micro Frontend Issues:
1. Check console for Module Federation errors
2. Verify remote entry URL is accessible
3. Ensure shared dependencies are compatible
4. Check authentication token format

### Performance Considerations:
- MySQL performance tuning for production
- Index optimization for large datasets
- Connection pooling configuration
- Query optimization

## Development vs Production

### Development:
- Uses in-memory storage as fallback
- Hot reloading enabled
- Debug logging active

### Production:
- Requires MySQL database
- Optimized builds
- Error handling
- Security headers

## Support

For issues related to:
- Database migration: Check MySQL logs
- Micro frontend: Verify Module Federation setup
- Authentication: Check token format and expiry
- Performance: Monitor database queries
