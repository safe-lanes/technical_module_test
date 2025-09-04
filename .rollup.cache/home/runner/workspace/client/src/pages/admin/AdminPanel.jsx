import { __awaiter, __generator } from "tslib";
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle, AlertTriangle, FileDown, } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Alerts from './Alerts';
import Forms from '@/components/admin/Forms';
export default function BulkImport() {
    var _this = this;
    var _a;
    var toast = useToast().toast;
    var _b = useState(null), selectedTemplate = _b[0], setSelectedTemplate = _b[1];
    var _c = useState(null), selectedFile = _c[0], setSelectedFile = _c[1];
    var _d = useState('add'), importMode = _d[0], setImportMode = _d[1];
    var _e = useState(false), archiveMissing = _e[0], setArchiveMissing = _e[1];
    var _f = useState(null), dryRunResult = _f[0], setDryRunResult = _f[1];
    var _g = useState(false), isUploading = _g[0], setIsUploading = _g[1];
    var _h = useState(false), isImporting = _h[0], setIsImporting = _h[1];
    var templates = [
        { id: '1', name: 'Machinery Components', type: 'components' },
        { id: '2', name: 'Stores', type: 'spares' },
        { id: '3', name: 'Spares', type: 'stores' },
        { id: '4', name: 'Template 4', type: 'components' },
        { id: '5', name: 'Template 5', type: 'components' },
        { id: '6', name: 'Template 6', type: 'components' },
    ];
    // Fetch import history
    var _j = useQuery({
        queryKey: ['/api/bulk/history', selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.type],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!selectedTemplate)
                            return [2 /*return*/, { items: [], total: 0 }];
                        return [4 /*yield*/, fetch("/api/bulk/history?type=".concat(selectedTemplate.type))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch history');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        enabled: !!selectedTemplate,
    }), history = _j.data, historyLoading = _j.isLoading;
    // Download template
    var handleDownloadTemplate = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, blob, url, a, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedTemplate)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("/api/bulk/template?type=".concat(selectedTemplate.type))];
                case 2:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Failed to download template');
                    return [4 /*yield*/, response.blob()];
                case 3:
                    blob = _a.sent();
                    url = window.URL.createObjectURL(blob);
                    a = document.createElement('a');
                    a.href = url;
                    a.download = "".concat(selectedTemplate.type, "_template.xlsx");
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    toast({
                        title: 'Template Downloaded',
                        description: "".concat(selectedTemplate.name, " template has been downloaded."),
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    toast({
                        title: 'Download Failed',
                        description: 'Failed to download template. Please try again.',
                        variant: 'destructive',
                    });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Handle file drop
    var handleFileDrop = useCallback(function (e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        if (file && isValidFile(file)) {
            setSelectedFile(file);
            handleDryRun(file);
        }
        else {
            toast({
                title: 'Invalid File',
                description: 'Please upload a .xlsx, .xls, or .csv file',
                variant: 'destructive',
            });
        }
    }, [selectedTemplate, importMode, archiveMissing]);
    var handleFileSelect = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file && isValidFile(file)) {
            setSelectedFile(file);
            handleDryRun(file);
        }
        else {
            toast({
                title: 'Invalid File',
                description: 'Please upload a .xlsx, .xls, or .csv file',
                variant: 'destructive',
            });
        }
    };
    var isValidFile = function (file) {
        var validExtensions = ['.xlsx', '.xls', '.csv'];
        var fileName = file.name.toLowerCase();
        return validExtensions.some(function (ext) { return fileName.endsWith(ext); });
    };
    // Dry run validation
    var handleDryRun = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var formData, response, error, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedTemplate)
                        return [2 /*return*/];
                    setIsUploading(true);
                    setDryRunResult(null);
                    formData = new FormData();
                    formData.append('file', file);
                    formData.append('type', selectedTemplate.type);
                    formData.append('mode', importMode);
                    formData.append('archiveMissing', archiveMissing.toString());
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch('/api/bulk/dry-run', {
                            method: 'POST',
                            body: formData,
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    error = _a.sent();
                    throw new Error(error.error || 'Validation failed');
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    result = _a.sent();
                    setDryRunResult(result);
                    if (result.summary.errors > 0) {
                        toast({
                            title: 'Validation Complete',
                            description: "Found ".concat(result.summary.errors, " error(s). Please fix them before importing."),
                            variant: 'destructive',
                        });
                    }
                    else if (result.summary.warnings > 0) {
                        toast({
                            title: 'Validation Complete',
                            description: "File is valid with ".concat(result.summary.warnings, " warning(s)."),
                        });
                    }
                    else {
                        toast({
                            title: 'Validation Complete',
                            description: 'File is valid and ready to import.',
                        });
                    }
                    return [3 /*break*/, 8];
                case 6:
                    error_2 = _a.sent();
                    toast({
                        title: 'Validation Failed',
                        description: error_2.message || 'Failed to validate file',
                        variant: 'destructive',
                    });
                    return [3 /*break*/, 8];
                case 7:
                    setIsUploading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Perform import
    var handleImport = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dryRunResult || !selectedTemplate)
                        return [2 /*return*/];
                    setIsImporting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, apiRequest('POST', '/api/bulk/import', {
                            fileToken: dryRunResult.fileToken,
                            type: selectedTemplate.type,
                            mode: importMode,
                            archiveMissing: archiveMissing,
                            vesselId: 'vessel-001', // TODO: Get from context
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    toast({
                        title: 'Import Successful',
                        description: "Created: ".concat(result.created, ", Updated: ").concat(result.updated, ", Skipped: ").concat(result.skipped).concat(result.archived ? ", Archived: ".concat(result.archived) : ''),
                    });
                    // Clear state and refresh history
                    setSelectedFile(null);
                    setDryRunResult(null);
                    queryClient.invalidateQueries({ queryKey: ['/api/bulk/history'] });
                    return [3 /*break*/, 6];
                case 4:
                    error_3 = _a.sent();
                    toast({
                        title: 'Import Failed',
                        description: error_3.message || 'Failed to import data',
                        variant: 'destructive',
                    });
                    return [3 /*break*/, 6];
                case 5:
                    setIsImporting(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Download history file
    var handleDownloadHistoryFile = function (historyId, fileType) { return __awaiter(_this, void 0, void 0, function () {
        var response, blob, url, a, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/bulk/history/".concat(historyId, "/").concat(fileType))];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Download failed');
                    return [4 /*yield*/, response.blob()];
                case 2:
                    blob = _a.sent();
                    url = window.URL.createObjectURL(blob);
                    a = document.createElement('a');
                    a.href = url;
                    a.download = "".concat(fileType, ".").concat(fileType === 'file' ? 'xlsx' : 'csv');
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    toast({
                        title: 'Download Failed',
                        description: 'Failed to download file',
                        variant: 'destructive',
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var _k = useState('bulk-import'), activeTab = _k[0], setActiveTab = _k[1];
    return (<div className='p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Bulk Data Import</h1>
        <div className='mt-4 flex gap-2'>
          <Button variant={activeTab === 'bulk-import' ? 'default' : 'outline'} className={activeTab === 'bulk-import' ? 'bg-blue-600 hover:bg-blue-700' : ''} onClick={function () { return setActiveTab('bulk-import'); }}>
            Bulk Data Imp
          </Button>
          <Button variant={activeTab === 'alerts' ? 'default' : 'outline'} className={activeTab === 'alerts' ? 'bg-blue-600 hover:bg-blue-700' : ''} onClick={function () { return setActiveTab('alerts'); }}>
            Alerts
          </Button>
          <Button variant={activeTab === 'forms' ? 'default' : 'outline'} className={activeTab === 'forms' ? 'bg-blue-600 hover:bg-blue-700' : ''} onClick={function () { return setActiveTab('forms'); }}>
            Forms
          </Button>
          <Button variant={activeTab === 'admin4' ? 'default' : 'outline'} className={activeTab === 'admin4' ? 'bg-blue-600 hover:bg-blue-700' : ''} onClick={function () { return setActiveTab('admin4'); }}>
            Admin 4
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'bulk-import' ? (<div className='grid grid-cols-12 gap-6'>
          {/* Left Column - Templates */}
          <div className='col-span-3'>
            <div className='bg-[#52baf3] text-white p-0 rounded-lg overflow-hidden'>
              <div className='bg-[#40a6e0] px-4 py-3'>
                <h2 className='text-lg font-semibold text-white'>TEMPLATES</h2>
              </div>
              <div className='p-4 space-y-2'>
                {templates.map(function (template, index) { return (<button key={template.id} onClick={function () {
                    setSelectedTemplate(template);
                    setSelectedFile(null);
                    setDryRunResult(null);
                }} className={"w-full text-left px-3 py-2 rounded-md transition-colors ".concat((selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.id) === template.id
                    ? 'bg-white bg-opacity-20 text-white font-medium'
                    : 'hover:bg-white hover:bg-opacity-10 text-white')}>
                    {index + 1}. {template.name}
                  </button>); })}
              </div>
            </div>
          </div>

          {/* Right Column - Detail */}
          <div className='col-span-9'>
            {selectedTemplate ? (<Card className='p-6'>
                {/* Template Header */}
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-xl font-semibold'>
                    {templates.findIndex(function (t) { return t.id === selectedTemplate.id; }) + 1}
                    . {selectedTemplate.name}
                  </h2>
                  <Button onClick={handleDownloadTemplate} variant='outline'>
                    <Download className='h-4 w-4 mr-2'/>
                    Download Template
                  </Button>
                </div>

                {/* File Upload */}
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6' onDrop={handleFileDrop} onDragOver={function (e) { return e.preventDefault(); }}>
                  <Upload className='h-12 w-12 mx-auto mb-4 text-gray-400'/>
                  <p className='text-gray-600 mb-2'>
                    Drag and drop your completed template file here, or click to
                    browse
                  </p>
                  <p className='text-sm text-gray-500 mb-4'>
                    Supported formats: .csv, .xls, .xlsx
                  </p>
                  <label htmlFor='file-upload'>
                    <Input id='file-upload' type='file' accept='.csv,.xls,.xlsx' onChange={handleFileSelect} className='hidden'/>
                    <Button variant='outline' asChild>
                      <span>Choose Files</span>
                    </Button>
                  </label>
                  {selectedFile && (<p className='mt-4 text-sm font-medium'>
                      {selectedFile.name}
                    </p>)}
                </div>

                {/* Options */}
                <div className='grid grid-cols-2 gap-4 mb-6'>
                  <div>
                    <Label>Import Mode</Label>
                    <Select value={importMode} onValueChange={function (v) { return setImportMode(v); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='add'>Add New</SelectItem>
                        <SelectItem value='update'>Update Existing</SelectItem>
                        <SelectItem value='upsert'>
                          Upsert (Add or Update)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(importMode === 'update' || importMode === 'upsert') && (<div>
                      <Label className='flex items-center gap-2'>
                        <input type='checkbox' checked={archiveMissing} onChange={function (e) { return setArchiveMissing(e.target.checked); }} className='rounded'/>
                        Archive Missing Records
                      </Label>
                      <p className='text-sm text-gray-500 mt-1'>
                        Archive records not present in the file
                      </p>
                    </div>)}
                </div>

                <p className='text-sm text-gray-500 mb-6'>
                  Date format: Accepted DD-MMM-YYYY, DD-MM-YYYY, or ISO
                  (YYYY-MM-DD)
                </p>

                {/* Dry Run Preview */}
                {isUploading && (<div className='text-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
                    <p className='text-gray-600'>Validating file...</p>
                  </div>)}

                {dryRunResult && (<div className='mb-6'>
                    <h3 className='font-semibold mb-4'>Dry-Run Preview</h3>

                    {/* Summary Pills */}
                    <div className='flex gap-4 mb-4'>
                      <Badge variant='outline' className='px-3 py-1'>
                        <CheckCircle className='h-4 w-4 mr-1 text-green-600'/>
                        OK: {dryRunResult.summary.ok}
                      </Badge>
                      <Badge variant='outline' className='px-3 py-1'>
                        <AlertTriangle className='h-4 w-4 mr-1 text-yellow-600'/>
                        Warnings: {dryRunResult.summary.warnings}
                      </Badge>
                      <Badge variant='outline' className='px-3 py-1'>
                        <AlertCircle className='h-4 w-4 mr-1 text-red-600'/>
                        Errors: {dryRunResult.summary.errors}
                      </Badge>
                    </div>

                    {/* Preview Table */}
                    <div className='border rounded-lg overflow-hidden mb-4'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className='w-16'>Row</TableHead>
                            <TableHead className='w-24'>Status</TableHead>
                            {dryRunResult.columns.slice(0, 3).map(function (col) { return (<TableHead key={col}>{col}</TableHead>); })}
                            <TableHead>Error(s)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dryRunResult.rows.slice(0, 20).map(function (row) { return (<TableRow key={row.row}>
                              <TableCell>{row.row}</TableCell>
                              <TableCell>
                                <Badge variant={row.status === 'ok'
                            ? 'default'
                            : row.status === 'warning'
                                ? 'secondary'
                                : 'destructive'} className={row.status === 'ok'
                            ? 'bg-green-100 text-green-800'
                            : row.status === 'warning'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'}>
                                  {row.status.toUpperCase()}
                                </Badge>
                              </TableCell>
                              {dryRunResult.columns.slice(0, 3).map(function (col) { return (<TableCell key={col} className='max-w-xs truncate'>
                                  {row.normalized[col] || '-'}
                                </TableCell>); })}
                              <TableCell className='text-sm text-red-600'>
                                {row.errors.join('; ')}
                              </TableCell>
                            </TableRow>); })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex justify-between'>
                      {dryRunResult.errorReportUrl && (<Button variant='outline' asChild>
                          <a href={dryRunResult.errorReportUrl} download>
                            <FileDown className='h-4 w-4 mr-2'/>
                            Download Error Report
                          </a>
                        </Button>)}
                      <Button onClick={handleImport} disabled={dryRunResult.summary.errors > 0 || isImporting} className='ml-auto bg-blue-600 hover:bg-blue-700'>
                        {isImporting ? 'Importing...' : 'Import'}
                      </Button>
                    </div>
                  </div>)}

                {/* Update History */}
                <div>
                  <h3 className='font-semibold mb-4'>Update History</h3>
                  <div className='border rounded-lg overflow-hidden'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead>Skipped</TableHead>
                          {importMode !== 'add' && (<TableHead>Archived</TableHead>)}
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(_a = history === null || history === void 0 ? void 0 : history.items) === null || _a === void 0 ? void 0 : _a.map(function (item) { return (<TableRow key={item.id}>
                            <TableCell>
                              {new Date(item.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{item.user}</TableCell>
                            <TableCell>{item.mode}</TableCell>
                            <TableCell>{item.created}</TableCell>
                            <TableCell>{item.updated}</TableCell>
                            <TableCell>{item.skipped}</TableCell>
                            {importMode !== 'add' && (<TableCell>{item.archived || 0}</TableCell>)}
                            <TableCell>
                              <div className='flex gap-2'>
                                <Button size='sm' variant='ghost' onClick={function () {
                        return handleDownloadHistoryFile(item.id, 'file');
                    }}>
                                  <FileDown className='h-4 w-4'/>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>); })}
                        {(!(history === null || history === void 0 ? void 0 : history.items) || history.items.length === 0) && (<TableRow>
                            <TableCell colSpan={8} className='text-center text-gray-500'>
                              No import history available
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Card>) : (<Card className='p-12 text-center'>
                <FileSpreadsheet className='h-16 w-16 mx-auto mb-4 text-gray-400'/>
                <p className='text-gray-600'>
                  Select a template from the left to begin
                </p>
              </Card>)}
          </div>
        </div>) : activeTab === 'alerts' ? (<Alerts />) : activeTab === 'forms' ? (<Forms />) : activeTab === 'admin4' ? (<div className='p-6'>
          <Card className='p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Admin 4</h2>
            <p className='text-gray-600'>
              Admin 4 functionality will be implemented here.
            </p>
          </Card>
        </div>) : null}
    </div>);
}
//# sourceMappingURL=AdminPanel.jsx.map