# AG Grid Enterprise Component Guide

This guide provides comprehensive documentation for using the AG Grid Enterprise components in the Element Crew Appraisals System.

## Overview

The system uses AG Grid Enterprise as the standard table component across all modules. The reusable `AgGridTable` component provides consistent implementation with enterprise features pre-configured, optimized for clean appearance and responsive behavior.

## Key Features

- **Enterprise License**: Fully licensed AG Grid Enterprise with all premium features
- **Clean Design**: Single header row, no checkbox columns by default, optimized spacing
- **Dynamic Height**: Auto-adjusting table height with smart scroll behavior
- **Advanced Filtering**: Column filters and advanced filter builder (floating filters disabled)
- **Data Export**: Excel and CSV export capabilities
- **Row Grouping**: Hierarchical data organization
- **Pivoting**: Data summarization and analysis
- **Column Management**: Resizable, sortable, and moveable columns
- **Status Bar**: Row count and aggregation display (selection count hidden when no selection)
- **Side Bar**: Column and filter management panels
- **Responsive Scroll**: Vertical scroll only appears when content exceeds screen height

## Component Architecture

### AgGridTable Component

The main reusable table component with the following props:

```typescript
interface AgGridTableProps {
  rowData: any[];
  columnDefs: ColDef[];
  onGridReady?: (event: GridReadyEvent) => void;
  context?: any;
  height?: string | number;
  width?: string | number;
  className?: string;
  loading?: boolean;
  enableExport?: boolean;
  enableSideBar?: boolean;
  enableStatusBar?: boolean;
  enableRowGrouping?: boolean;
  enablePivoting?: boolean;
  enableAdvancedFilter?: boolean;
  rowSelection?: 'single' | 'multiple' | false;
  theme?: 'alpine' | 'balham' | 'material' | 'legacy';
  gridOptions?: Partial<GridOptions>;
  autoHeight?: boolean;
  maxHeight?: string | number;
  minHeight?: string | number;
  pagination?: boolean;
  paginationPageSize?: number;
  animateRows?: boolean;
  enableRangeSelection?: boolean;
  enableCharts?: boolean;
  suppressRowClickSelection?: boolean;
}
```

### Default Configuration

The component comes with these optimized defaults:

```typescript
// Default prop values
height = '500px'
width = '100%'
className = ''
loading = false
enableExport = true
enableSideBar = true
enableStatusBar = true
enableRowGrouping = false
enablePivoting = true
enableAdvancedFilter = false
rowSelection = false
theme = 'alpine'
autoHeight = false
maxHeight = '600px'
minHeight = '200px'
pagination = false
paginationPageSize = 20
animateRows = false
enableRangeSelection = false
enableCharts = false
suppressRowClickSelection = false
```

**Key Default Features:**
- **Single Header Row**: No floating filters for cleaner appearance
- **No Row Selection**: Checkbox columns disabled by default (rowSelection = false)
- **Export Enabled**: CSV and Excel export available by default
- **Enterprise Features**: Side bar and status bar enabled, pivoting available
- **Dynamic Height**: Can be enabled with autoHeight prop
- **Blue Header**: #52baf3 background with white text
- **Row Hover**: Light gray hover effect on rows
- **No Cell Borders**: Clean appearance without vertical cell borders
- **Rounded Corners**: 8px border radius for modern look
- **Legacy Theme**: Internally uses 'legacy' theme to avoid theming API conflicts

## Real-World Implementation: Crew Appraisals Table

### Complete Configuration Example

The Element Crew Appraisals page demonstrates a comprehensive AG Grid Enterprise implementation with all current best practices:

```tsx
import { ColDef, GridReadyEvent, GridApi, ModuleRegistry } from 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule } from 'ag-grid-community';
import { 
  SetFilterModule, 
  MenuModule, 
  ColumnsToolPanelModule, 
  FiltersToolPanelModule, 
  SideBarModule 
} from 'ag-grid-enterprise';

// Register AG Grid modules - Required for Enterprise features
ModuleRegistry.registerModules([
  AllCommunityModule,
  SetFilterModule,
  MenuModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SideBarModule
]);

// Column definitions with flex sizing and value getters
const columnDefs = [
  { field: 'id', headerName: 'Crew ID', width: 120 },
  { 
    field: 'name', 
    headerName: 'Name', 
    width: 200,
    valueGetter: (params) => {
      const name = params.data?.name;
      if (!name) return '';
      return `${name.first || ''} ${name.middle || ''} ${name.last || ''}`.trim();
    }
  },
  { field: 'rank', headerName: 'Rank', width: 150 },
  { field: 'vessel', headerName: 'Vessel', width: 150 },
  { field: 'appraisalType', headerName: 'Appraisal Type', width: 140 },
  { field: 'nationality', headerName: 'Nationality', width: 130 },
  { field: 'vesselType', headerName: 'Vessel Type', width: 130 }
];

// AG Grid React component implementation
<div style={{ height: '500px', width: '100%' }} className="ag-theme-alpine">
  <AgGridReact
    rowData={crewData}
    columnDefs={columnDefs}
    onGridReady={(params) => {
      setGridApi(params.api);
      params.api.sizeColumnsToFit(); // Auto-resize columns to fill container
    }}
    sideBar={{
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        }
      ],
      defaultToolPanel: null // Sidebar starts closed but buttons visible
    }}
    defaultColDef={{
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,        // Flexible column sizing
      minWidth: 100   // Minimum column width
    }}
  />
</div>
```

### Key Implementation Features

**Module Registration:**
- All Enterprise modules must be registered before use
- Includes SideBarModule for Columns & Filters panels
- SetFilterModule for advanced filtering capabilities

**Sidebar Configuration:**
- `defaultToolPanel: null` - Sidebar starts closed for maximum data viewing space
- Buttons remain visible for user access when needed
- Custom styling positions sidebar below blue header (top: 48px)

**Column Sizing Strategy:**
- `flex: 1` on all columns for responsive width distribution
- `minWidth: 100` prevents columns from becoming too narrow
- `params.api.sizeColumnsToFit()` ensures optimal initial sizing

**Enhanced Styling:**
```css
/* Updated Sidebar Styling for Crew Appraisals */
.ag-grid-container .ag-theme-alpine .ag-side-buttons {
  background-color: white !important;
  top: 48px !important; /* Positioned below blue header */
  border: none !important;
}

.ag-grid-container .ag-theme-alpine .ag-side-button {
  background-color: white !important;
  border: none !important;
  color: #6b7280 !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.ag-grid-container .ag-theme-alpine .ag-side-button.ag-selected {
  background-color: #f3f4f6 !important;
  color: #374151 !important;
}
```

## Usage Examples

### Basic Table

```tsx
import AgGridTable from '@/components/AgGridTable';

const MyComponent = () => {
  const columnDefs = [
    { field: 'name', headerName: 'Name' },
    { field: 'age', headerName: 'Age', filter: 'agNumberColumnFilter' },
    { field: 'country', headerName: 'Country' }
  ];

  const rowData = [
    { name: 'John Doe', age: 30, country: 'USA' },
    { name: 'Jane Smith', age: 25, country: 'UK' }
  ];

  return (
    <AgGridTable
      rowData={rowData}
      columnDefs={columnDefs}
      autoHeight={true}
      theme="alpine"
    />
  );
};
```

### Advanced Table with Enterprise Features

```tsx
const AdvancedTable = () => {
  const columnDefs = [
    {
      field: 'name',
      headerName: 'Name',
      enableRowGroup: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'department',
      headerName: 'Department',
      enableRowGroup: true,
      enablePivot: true
    },
    {
      field: 'salary',
      headerName: 'Salary',
      filter: 'agNumberColumnFilter',
      enableValue: true,
      aggFunc: 'sum'
    }
  ];

  return (
    <AgGridTable
      rowData={employeeData}
      columnDefs={columnDefs}
      enableSideBar={true}
      enableStatusBar={true}
      enableRowGrouping={true}
      enablePivoting={true}
      autoHeight={true}
      maxHeight="600px"
      enableRangeSelection={true}
      animateRows={true}
      pagination={true}
      paginationPageSize={50}
    />
  );
};
```

### Table with Export Actions

```tsx
import AgGridTable from '@/components/AgGridTable';
import AgGridTableActions from '@/components/AgGridTableActions';

const TableWithActions = () => {
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = (event) => {
    setGridApi(event.api);
  };

  return (
    <div>
      <AgGridTable
        rowData={data}
        columnDefs={columns}
        onGridReady={onGridReady}
        autoHeight={true}
      />
      
      <AgGridTableActions
        gridApi={gridApi}
        filename="export_data"
        showExcelExport={true}
        showCsvExport={true}
        showPdfExport={false}
      />
    </div>
  );
};
```

### Custom Cell Renderers

```tsx
import { ICellRendererParams } from 'ag-grid-community';

// Badge cell renderer example
const StatusCellRenderer = (params: ICellRendererParams) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getStatusColor(params.value)}>
      {params.value.toUpperCase()}
    </Badge>
  );
};

// Actions cell renderer with context
const ActionsCellRenderer = (params: ICellRendererParams) => (
  <div className="flex gap-1 justify-center">
    <Button 
      size="sm" 
      variant="outline" 
      onClick={() => params.context.onEdit(params.data)}
    >
      <Edit className="w-3 h-3" />
    </Button>
    <Button 
      size="sm" 
      variant="outline" 
      onClick={() => params.context.onDelete(params.data)}
    >
      <Trash2 className="w-3 h-3" />
    </Button>
  </div>
);

// Column definition with custom renderer
const columnDefs = [
  { field: 'name', headerName: 'Name' },
  { 
    field: 'status', 
    headerName: 'Status',
    cellRenderer: StatusCellRenderer 
  },
  { 
    headerName: 'Actions',
    cellRenderer: ActionsCellRenderer,
    sortable: false,
    filter: false,
    width: 120
  }
];

// Usage with context
<AgGridTable
  rowData={data}
  columnDefs={columnDefs}
  context={{
    onEdit: handleEdit,
    onDelete: handleDelete
  }}
/>
```

## CSS Customization

The component includes custom CSS for optimal appearance:

```css
/* Blue header styling */
.ag-grid-container .ag-theme-alpine .ag-header {
  background-color: #52baf3 !important;
  border-bottom: 1px solid #52baf3 !important;
}

.ag-grid-container .ag-theme-alpine .ag-header-cell {
  background-color: #52baf3 !important;
  color: white !important;
  font-size: 12px !important;
  font-weight: normal !important;
  border-right: none !important;
  border-bottom: 1px solid #52baf3 !important;
}

.ag-grid-container .ag-theme-alpine .ag-header-cell-label {
  color: white !important;
}

.ag-grid-container .ag-theme-alpine .ag-header-cell .ag-header-icon {
  color: white !important;
}

.ag-grid-container .ag-theme-alpine .ag-header-cell .ag-icon {
  color: white !important;
}

.ag-grid-container .ag-theme-alpine .ag-header-cell .ag-icon-filter {
  color: white !important;
}

.ag-grid-container .ag-theme-alpine .ag-header-cell .ag-icon-menu {
  color: white !important;
}

.ag-grid-container .ag-theme-alpine .ag-header-cell .ag-icon-desc,
.ag-grid-container .ag-theme-alpine .ag-header-cell .ag-icon-asc {
  color: white !important;
}

/* Row styling */
.ag-grid-container .ag-theme-alpine .ag-row:hover {
  background-color: #f9fafb !important;
}

.ag-grid-container .ag-theme-alpine .ag-row {
  border-bottom: 1px solid #e5e7eb !important;
}

.ag-grid-container .ag-theme-alpine .ag-row:last-child {
  border-bottom: none !important;
}

/* Cell styling */
.ag-grid-container .ag-theme-alpine .ag-cell {
  border-right: none !important;
  padding: 8px 16px !important;
  font-size: 13px !important;
  color: #4f5863 !important;
}

/* Table container styling */
.ag-grid-container .ag-theme-alpine {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Scroll control */
.ag-grid-container .ag-theme-alpine.no-scroll .ag-body-viewport {
  overflow-y: hidden !important;
}

.ag-grid-container .ag-theme-alpine.needs-scroll .ag-body-viewport {
  overflow-y: auto !important;
}

/* Sidebar Columns & Filters Customization - Current Implementation */
.ag-grid-container .ag-theme-alpine .ag-side-bar {
  background-color: white !important;
  border-left: 1px solid #e5e7eb !important;
}

.ag-grid-container .ag-theme-alpine .ag-side-buttons {
  background-color: white !important;
  top: 48px !important; /* Positioned below blue header for current implementation */
  border: none !important;
}

.ag-grid-container .ag-theme-alpine .ag-side-button {
  background-color: white !important;
  border: none !important;
  color: #6b7280 !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.ag-grid-container .ag-theme-alpine .ag-side-button.ag-selected {
  background-color: #f3f4f6 !important;
  color: #374151 !important;
}

.ag-grid-container .ag-theme-alpine .ag-tool-panel-wrapper {
  background-color: white !important;
  border: none !important;
}
```

## AgGridTableActions Component

Companion component for export functionality:

```typescript
interface AgGridTableActionsProps {
  gridApi: GridApi | null;
  filename?: string;
  showExcelExport?: boolean;
  showCsvExport?: boolean;
  showPdfExport?: boolean;
  customActions?: React.ReactNode;
  className?: string;
}
```

## Props Reference

### Core Props
- `rowData`: Array of data objects to display
- `columnDefs`: Column definitions with field mappings and configurations
- `onGridReady`: Callback when grid is initialized (provides GridApi access)
- `context`: Pass data/functions to custom cell renderers

### Layout & Sizing
- `height`: Fixed table height (string or number)
- `width`: Table width (default: '100%') 
- `autoHeight`: Dynamic height based on content
- `maxHeight`: Maximum height when using autoHeight
- `minHeight`: Minimum height when using autoHeight

### Enterprise Features
- `enableSideBar`: Show columns and filters panel (default: true)
- `enableStatusBar`: Show row count and aggregation info (default: true)
- `enableRowGrouping`: Enable row grouping functionality (default: false)
- `enablePivoting`: Enable pivot functionality (default: true)
- `enableAdvancedFilter`: Show advanced filter builder (default: false)
- `enableRangeSelection`: Multi-cell selection (default: false)
- `enableCharts`: Chart creation from selected data (default: false)

### Data Management
- `pagination`: Enable pagination (default: false)
- `paginationPageSize`: Rows per page when pagination enabled (default: 20)
- `rowSelection`: Enable row selection - 'single', 'multiple', or false (default: false)
- `suppressRowClickSelection`: Prevent selection on row click (default: false)

### Visual & Performance
- `loading`: Show loading state (default: false)
- `animateRows`: Animate row changes (default: false)
- `theme`: Grid theme - 'alpine', 'balham', 'material', 'legacy' (default: 'alpine')
- `className`: Additional CSS classes
- `enableExport`: Enable export functionality (default: true)

### Advanced
- `gridOptions`: Override any AG Grid options directly

## Best Practices

1. **Column Definitions**: Always define proper field names and header names
2. **Module Registration**: Register all required Enterprise modules before using features
3. **Filtering**: Use appropriate filter types (agTextColumnFilter, agNumberColumnFilter, agDateColumnFilter)
4. **Height Management**: Use autoHeight with maxHeight for responsive behavior
5. **Column Sizing**: Use `flex: 1` with `minWidth` for responsive column distribution
6. **Sidebar Behavior**: Set `defaultToolPanel: null` for closed-by-default sidebar
7. **Auto-Resize**: Call `params.api.sizeColumnsToFit()` in onGridReady for optimal initial sizing
8. **Export Naming**: Provide meaningful filenames for exports
9. **Performance**: Use virtual scrolling for large datasets (handled automatically)
10. **Pagination**: Enable for tables with >100 rows to improve performance
11. **Accessibility**: Column headers and data are properly labeled for screen readers
12. **Cell Renderers**: Use context prop to pass callbacks to custom renderers
13. **Value Getters**: Use for complex data transformations (e.g., combining name fields)

## Enterprise Features

- **Set Filtering**: Multi-select dropdown filters
- **Advanced Filtering**: Complex filter expressions
- **Row Grouping**: Hierarchical data organization
- **Pivoting**: Data summarization and analysis
- **Excel Export**: Full Excel export with formatting
- **Range Selection**: Multi-cell selection and operations
- **Status Bar**: Comprehensive data statistics
- **Side Bar**: Advanced column and filter management

## License Configuration

The component automatically handles AG Grid Enterprise licensing:

```typescript
// License is set automatically from environment variables
const licenseKey = import.meta.env.VITE_AG_GRID_LICENSE_KEY || import.meta.env.AG_GRID_LICENSE_KEY;
if (licenseKey) {
  LicenseManager.setLicenseKey(licenseKey);
}
```

Ensure your environment has the `VITE_AG_GRID_LICENSE_KEY` variable set for frontend access.

## Troubleshooting

### License Issues
- Ensure `VITE_AG_GRID_LICENSE_KEY` is set in your environment
- Restart the development server after adding the license key
- Check browser console for license warnings

### Scroll Issues
- Use `autoHeight={true}` for automatic height management
- Set `maxHeight` to prevent tables from becoming too tall
- The component automatically manages scroll behavior based on content size

### Performance
- For large datasets (>1000 rows), consider server-side row model
- Use column virtualization for tables with many columns
- Implement lazy loading for better initial load times