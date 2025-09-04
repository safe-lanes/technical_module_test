import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  GridOptions,
  ModuleRegistry,
  // GridApi,
  // ColumnApi
} from 'ag-grid-enterprise';
import { AllCommunityModule } from 'ag-grid-community';
import {
  SetFilterModule,
  MenuModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SideBarModule,
  ExcelExportModule,
  CsvExportModule,
  RangeSelectionModule,
  StatusBarModule,
  RowGroupingModule,
  PivotModule,
  ClipboardModule,
} from 'ag-grid-enterprise';

// Register AG Grid modules - Required for Enterprise features
ModuleRegistry.registerModules([
  AllCommunityModule,
  SetFilterModule,
  MenuModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SideBarModule,
  ExcelExportModule,
  CsvExportModule,
  RangeSelectionModule,
  StatusBarModule,
  RowGroupingModule,
  PivotModule,
  ClipboardModule,
]);

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
  onRowClicked?: (event: any) => void;
  onSelectionChanged?: (event: any) => void;
  getRowId?: (params: any) => string;
  suppressHorizontalScroll?: boolean;
  suppressVerticalScroll?: boolean;
}

const AgGridTable: React.FC<AgGridTableProps> = ({
  rowData,
  columnDefs,
  onGridReady,
  context,
  height = '500px',
  width = '100%',
  className = '',
  loading = false,
  enableExport = true,
  enableSideBar = true,
  enableStatusBar = true,
  enableRowGrouping = false,
  enablePivoting = true,
  enableAdvancedFilter = false,
  rowSelection = false,
  theme = 'alpine',
  gridOptions = {},
  autoHeight = false,
  maxHeight = '600px',
  minHeight = '200px',
  pagination = false,
  paginationPageSize = 20,
  animateRows = false,
  enableRangeSelection = false,
  enableCharts = false,
  suppressRowClickSelection = false,
  onRowClicked,
  onSelectionChanged,
  getRowId,
  suppressHorizontalScroll = false,
  // suppressVerticalScroll = false
}) => {
  // Default column definition
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
      floatingFilter: false, // Disabled for cleaner appearance
      suppressMenu: false,
      menuTabs: [
        'filterMenuTab' as any,
        'generalMenuTab' as any,
        'columnsMenuTab' as any,
      ],
    }),
    []
  );

  // Side bar configuration
  const sideBar = useMemo(() => {
    if (!enableSideBar) return false;

    return {
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
        },
      ],
      defaultToolPanel: '', // Sidebar starts closed
    };
  }, [enableSideBar]);

  // Status bar configuration
  const statusBar = useMemo(() => {
    if (!enableStatusBar) return false;

    return {
      statusPanels: [
        {
          statusPanel: 'agTotalAndFilteredRowCountComponent',
          align: 'left',
        },
        {
          statusPanel: 'agSelectedRowCountComponent',
          align: 'center',
        },
        {
          statusPanel: 'agAggregationComponent',
          align: 'right',
        },
      ],
    };
  }, [enableStatusBar]);

  // Grid options
  // @ts-ignore
  const defaultGridOptions: GridOptions = useMemo(
    () => ({
      // Row selection
      rowSelection: rowSelection || 'single',
      suppressRowClickSelection,

      // Pagination
      pagination,
      paginationPageSize,

      // Animation
      animateRows,

      // Range selection
      enableRangeSelection,
      enableRangeHandle: enableRangeSelection,
      enableFillHandle: enableRangeSelection,

      // Charts
      enableCharts,

      // Row grouping
      enableRowGroup: enableRowGrouping,
      groupDefaultExpanded: enableRowGrouping ? 1 : -1,

      // Pivoting
      enablePivot: enablePivoting,

      // Advanced filter
      enableAdvancedFilter,

      // Export
      enableExport,

      // Scrolling
      suppressHorizontalScroll,

      // Auto height settings
      domLayout: autoHeight ? 'autoHeight' : 'normal',

      // Loading
      loadingOverlayComponent: loading ? 'agLoadingOverlay' : undefined,

      // Context
      context,

      // Row ID
      getRowId,

      // Event handlers
      onGridReady: (params: GridReadyEvent) => {
        // Auto-size columns to fit
        params.api.sizeColumnsToFit();

        // Call custom onGridReady if provided
        if (onGridReady) {
          onGridReady(params);
        }
      },

      onRowClicked,
      onSelectionChanged,

      // Override with custom grid options
      ...gridOptions,
    }),
    [
      rowSelection,
      suppressRowClickSelection,
      pagination,
      paginationPageSize,
      animateRows,
      enableRangeSelection,
      enableCharts,
      enableRowGrouping,
      enablePivoting,
      enableAdvancedFilter,
      enableExport,
      suppressHorizontalScroll,
      autoHeight,
      loading,
      context,
      getRowId,
      onGridReady,
      onRowClicked,
      onSelectionChanged,
      gridOptions,
    ]
  );

  // Container style
  const containerStyle = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      width,
      height: autoHeight ? 'auto' : height,
      maxHeight: autoHeight ? maxHeight : undefined,
      minHeight: autoHeight ? minHeight : undefined,
    };

    return baseStyle;
  }, [width, height, autoHeight, maxHeight, minHeight]);

  return (
    <div className='ag-grid-container'>
      <div className={`ag-theme-${theme} ${className}`} style={containerStyle}>
        {/* @ts-ignore */}
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          // @ts-ignore
          sideBar={sideBar}
          // @ts-ignore
          statusBar={statusBar}
          gridOptions={defaultGridOptions}
          suppressScrollOnNewData={true}
          suppressLoadingOverlay={!loading}
          overlayLoadingTemplate="<span class='ag-overlay-loading-center'>Loading...</span>"
          overlayNoRowsTemplate="<span class='ag-overlay-no-rows-center'>No data to display</span>"
        />
      </div>

      <style>{`
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

        /* Sidebar styling */
        .ag-grid-container .ag-theme-alpine .ag-side-buttons {
          background-color: white !important;
          top: 48px !important;
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

        /* Status bar styling */
        .ag-grid-container .ag-theme-alpine .ag-status-bar {
          background-color: #f9fafb !important;
          border-top: 1px solid #e5e7eb !important;
          font-size: 12px !important;
          color: #6b7280 !important;
        }

        /* Loading overlay */
        .ag-grid-container .ag-overlay-loading-center {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #6b7280;
        }

        .ag-grid-container .ag-overlay-no-rows-center {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default AgGridTable;
