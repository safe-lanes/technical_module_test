import { __assign } from "tslib";
import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry,
// GridApi,
// ColumnApi
 } from 'ag-grid-enterprise';
import { AllCommunityModule } from 'ag-grid-community';
import { SetFilterModule, MenuModule, ColumnsToolPanelModule, FiltersToolPanelModule, SideBarModule, ExcelExportModule, CsvExportModule, RangeSelectionModule, StatusBarModule, RowGroupingModule, PivotModule, ClipboardModule, } from 'ag-grid-enterprise';
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
var AgGridTable = function (_a) {
    var rowData = _a.rowData, columnDefs = _a.columnDefs, onGridReady = _a.onGridReady, context = _a.context, _b = _a.height, height = _b === void 0 ? '500px' : _b, _c = _a.width, width = _c === void 0 ? '100%' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.loading, loading = _e === void 0 ? false : _e, _f = _a.enableExport, enableExport = _f === void 0 ? true : _f, _g = _a.enableSideBar, enableSideBar = _g === void 0 ? true : _g, _h = _a.enableStatusBar, enableStatusBar = _h === void 0 ? true : _h, _j = _a.enableRowGrouping, enableRowGrouping = _j === void 0 ? false : _j, _k = _a.enablePivoting, enablePivoting = _k === void 0 ? true : _k, _l = _a.enableAdvancedFilter, enableAdvancedFilter = _l === void 0 ? false : _l, _m = _a.rowSelection, rowSelection = _m === void 0 ? false : _m, _o = _a.theme, theme = _o === void 0 ? 'alpine' : _o, _p = _a.gridOptions, gridOptions = _p === void 0 ? {} : _p, _q = _a.autoHeight, autoHeight = _q === void 0 ? false : _q, _r = _a.maxHeight, maxHeight = _r === void 0 ? '600px' : _r, _s = _a.minHeight, minHeight = _s === void 0 ? '200px' : _s, _t = _a.pagination, pagination = _t === void 0 ? false : _t, _u = _a.paginationPageSize, paginationPageSize = _u === void 0 ? 20 : _u, _v = _a.animateRows, animateRows = _v === void 0 ? false : _v, _w = _a.enableRangeSelection, enableRangeSelection = _w === void 0 ? false : _w, _x = _a.enableCharts, enableCharts = _x === void 0 ? false : _x, _y = _a.suppressRowClickSelection, suppressRowClickSelection = _y === void 0 ? false : _y, onRowClicked = _a.onRowClicked, onSelectionChanged = _a.onSelectionChanged, getRowId = _a.getRowId, _z = _a.suppressHorizontalScroll, suppressHorizontalScroll = _z === void 0 ? false : _z;
    // Default column definition
    var defaultColDef = useMemo(function () { return ({
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        minWidth: 100,
        floatingFilter: false, // Disabled for cleaner appearance
        suppressMenu: false,
        menuTabs: [
            'filterMenuTab',
            'generalMenuTab',
            'columnsMenuTab',
        ],
    }); }, []);
    // Side bar configuration
    var sideBar = useMemo(function () {
        if (!enableSideBar)
            return false;
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
            defaultToolPanel: null, // Sidebar starts closed
        };
    }, [enableSideBar]);
    // Status bar configuration
    var statusBar = useMemo(function () {
        if (!enableStatusBar)
            return false;
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
    var defaultGridOptions = useMemo(function () { return (__assign({ 
        // Row selection
        rowSelection: rowSelection || undefined, suppressRowClickSelection: suppressRowClickSelection, 
        // Pagination
        pagination: pagination, paginationPageSize: paginationPageSize, 
        // Animation
        animateRows: animateRows, 
        // Range selection
        enableRangeSelection: enableRangeSelection, enableRangeHandle: enableRangeSelection, enableFillHandle: enableRangeSelection, 
        // Charts
        enableCharts: enableCharts, 
        // Row grouping
        enableRowGroup: enableRowGrouping, groupDefaultExpanded: enableRowGrouping ? 1 : -1, 
        // Pivoting
        enablePivot: enablePivoting, 
        // Advanced filter
        enableAdvancedFilter: enableAdvancedFilter, 
        // Export
        enableExport: enableExport, 
        // Scrolling
        suppressHorizontalScroll: suppressHorizontalScroll, 
        // Auto height settings
        domLayout: autoHeight ? 'autoHeight' : 'normal', 
        // Loading
        loadingOverlayComponent: loading ? 'agLoadingOverlay' : undefined, 
        // Context
        context: context, 
        // Row ID
        getRowId: getRowId, 
        // Event handlers
        onGridReady: function (params) {
            // Auto-size columns to fit
            params.api.sizeColumnsToFit();
            // Call custom onGridReady if provided
            if (onGridReady) {
                onGridReady(params);
            }
        }, onRowClicked: onRowClicked, onSelectionChanged: onSelectionChanged }, gridOptions)); }, [
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
    ]);
    // Container style
    var containerStyle = useMemo(function () {
        var baseStyle = {
            width: width,
            height: autoHeight ? 'auto' : height,
            maxHeight: autoHeight ? maxHeight : undefined,
            minHeight: autoHeight ? minHeight : undefined,
        };
        return baseStyle;
    }, [width, height, autoHeight, maxHeight, minHeight]);
    return (<div className='ag-grid-container'>
      <div className={"ag-theme-".concat(theme, " ").concat(className)} style={containerStyle}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} sideBar={sideBar} statusBar={statusBar} gridOptions={defaultGridOptions} suppressScrollOnNewData={true} suppressLoadingOverlay={!loading} overlayLoadingTemplate="<span class='ag-overlay-loading-center'>Loading...</span>" overlayNoRowsTemplate="<span class='ag-overlay-no-rows-center'>No data to display</span>"/>
      </div>

      <style jsx global>{"\n        /* Blue header styling */\n        .ag-grid-container .ag-theme-alpine .ag-header {\n          background-color: #52baf3 !important;\n          border-bottom: 1px solid #52baf3 !important;\n        }\n\n        .ag-grid-container .ag-theme-alpine .ag-header-cell {\n          background-color: #52baf3 !important;\n          color: white !important;\n          font-size: 12px !important;\n          font-weight: normal !important;\n          border-right: none !important;\n          border-bottom: 1px solid #52baf3 !important;\n        }\n\n        .ag-grid-container .ag-theme-alpine .ag-header-cell-label {\n          color: white !important;\n        }\n\n        .ag-grid-container .ag-theme-alpine .ag-header-cell .ag-header-icon {\n          color: white !important;\n        }\n\n        .ag-grid-container .ag-theme-alpine .ag-header-cell .ag-icon {\n          color: white !important;\n        }\n\n        .ag-grid-container .ag-theme-alpine .ag-header-cell .ag-icon-filter {\n          color: white !important;\n        }\n\n        .ag-grid-container .ag-theme-alpine .ag-header-cell .ag-icon-menu {\n          color: white !important;\n        }\n\n        .ag-grid-container .ag-theme-alpine .ag-header-cell .ag-icon-desc,\n        .ag-grid-container .ag-theme-alpine .ag-header-cell .ag-icon-asc {\n          color: white !important;\n        }\n\n        /* Row styling */\n        .ag-grid-container .ag-theme-alpine .ag-row:hover {\n          background-color: #f9fafb !important;\n        }\n\n        .ag-grid-container .ag-theme-alpine .ag-row {\n          border-bottom: 1px solid #e5e7eb !important;\n        }\n\n        .ag-grid-container .ag-theme-alpine .ag-row:last-child {\n          border-bottom: none !important;\n        }\n\n        /* Cell styling */\n        .ag-grid-container .ag-theme-alpine .ag-cell {\n          border-right: none !important;\n          padding: 8px 16px !important;\n          font-size: 13px !important;\n          color: #4f5863 !important;\n        }\n\n        /* Table container styling */\n        .ag-grid-container .ag-theme-alpine {\n          border-radius: 8px;\n          overflow: hidden;\n          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n        }\n\n        /* Sidebar styling */\n        .ag-grid-container .ag-theme-alpine .ag-side-buttons {\n          background-color: white !important;\n          top: 48px !important;\n          border: none !important;\n        }\n\n        .ag-grid-container .ag-theme-alpine .ag-side-button {\n          background-color: white !important;\n          border: none !important;\n          color: #6b7280 !important;\n          border-bottom: 1px solid #e5e7eb !important;\n        }\n\n        .ag-grid-container .ag-theme-alpine .ag-side-button.ag-selected {\n          background-color: #f3f4f6 !important;\n          color: #374151 !important;\n        }\n\n        /* Status bar styling */\n        .ag-grid-container .ag-theme-alpine .ag-status-bar {\n          background-color: #f9fafb !important;\n          border-top: 1px solid #e5e7eb !important;\n          font-size: 12px !important;\n          color: #6b7280 !important;\n        }\n\n        /* Loading overlay */\n        .ag-grid-container .ag-overlay-loading-center {\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          font-size: 14px;\n          color: #6b7280;\n        }\n\n        .ag-grid-container .ag-overlay-no-rows-center {\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          font-size: 14px;\n          color: #6b7280;\n        }\n      "}</style>
    </div>);
};
export default AgGridTable;
//# sourceMappingURL=AgGridTable.jsx.map