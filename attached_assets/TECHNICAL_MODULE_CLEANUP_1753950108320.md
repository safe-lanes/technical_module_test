# Technical Module Cleanup Guide

This guide helps you clean up the Technical Module fork while preserving shared components and infrastructure.

## Files to DELETE from Technical Module

### 1. Crewing-Specific Pages
Remove these files from `client/src/pages/`:
- `ElementCrewAppraisals.tsx` - Main crew appraisals page
- `AppraisalForm.tsx` - Crew appraisal form
- `AppraisalForm_backup.tsx` - Backup file
- `AppraisalForm_broken.tsx` - Broken file
- `AppraisalForm.tsx.broken` - Another broken file
- `FormEditor.tsx` - Form configuration editor (crew-specific)

### 2. Crewing-Specific Components
Remove these files from `client/src/components/`:
- Any crew-specific components (if created)

### 3. Database Schema Updates
In `shared/schema.ts`, remove these tables:
- `crewMembers` table and related schemas
- `appraisalResults` table and related schemas
- `forms` table (crew appraisal forms)
- `rankGroups` table
- `availableRanks` table

Keep only the `users` table for authentication.

### 4. API Routes Updates
In `server/routes.ts`, remove these routes:
- `/api/crew-members`
- `/api/appraisals`
- `/api/forms`
- `/api/available-ranks`
- `/api/rank-groups`

### 5. Storage Interface Updates
In `server/storage.ts`, remove these methods from IStorage interface:
- Crew member related methods
- Appraisal related methods
- Forms related methods
- Rank related methods

## Files to KEEP (Shared Infrastructure)

### 1. UI Components Library
Keep ALL files in `client/src/components/ui/`:
- All shadcn/ui components
- `form-popup.tsx` - Standard popup component
- All other UI primitives

### 2. Core Infrastructure
Keep these files unchanged:
- `client/src/index.css` - Tailwind and global styles
- `client/src/main.tsx` - App entry point
- `client/src/lib/` - All utilities and query client
- `client/src/hooks/` - All custom hooks
- `client/src/config/` - Design system configuration
- `tailwind.config.ts` - Tailwind configuration
- `vite.config.ts` - Vite configuration
- `package.json` - All dependencies
- `tsconfig.json` - TypeScript configuration

### 3. Backend Infrastructure
Keep these files:
- `server/index.ts` - Express server setup
- `server/vite.ts` - Vite integration
- Database connection logic
- Authentication logic (if any)

### 4. Shared Utilities
Keep these files:
- `client/src/utils/` - May need to remove crew-specific utilities
- `client/src/micro-frontend/` - For future module federation

## After Cleanup Steps

### 1. Update App.tsx
Replace the content with a simple Technical Module landing page:
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route } from "wouter";
import { TechnicalDashboard } from "./pages/TechnicalDashboard";
import { AdminModule } from "./pages/AdminModule";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={TechnicalDashboard} />
          <Route path="/admin" component={AdminModule} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### 2. Create TechnicalDashboard.tsx
Create a new file `client/src/pages/TechnicalDashboard.tsx` as your main page.

### 3. Update AdminModule.tsx
Modify to manage Technical module configurations instead of crew forms.

### 4. Update ModuleNavigator.tsx
Update to show:
- "Technical (PMS)" as current module
- "Crewing" as available module to switch to

### 5. Clean up Database
Run database migrations to remove crew-related tables.

## Verification Checklist

After cleanup, verify:
- [ ] App starts without errors
- [ ] No import errors for deleted files
- [ ] All UI components render correctly
- [ ] Tailwind styles work properly
- [ ] Database connects successfully
- [ ] Admin module loads (if keeping it)

## Benefits of This Approach

1. **Preserved UI Consistency**: All shadcn/ui components remain intact
2. **Maintained Tech Stack**: React, TypeScript, Vite, Tailwind all preserved
3. **Shared Design System**: Same colors, fonts, spacing across modules
4. **Common Infrastructure**: Database patterns, API structure maintained
5. **Easy Development**: Can build Technical features on clean base

This cleanup gives you a clean Technical Module with all the shared components and infrastructure from the Crewing Module, ready for PMS-specific development.