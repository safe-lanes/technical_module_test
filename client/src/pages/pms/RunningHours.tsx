import { useState, useEffect, useMemo } from 'react';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-enterprise';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, FileSpreadsheet, Calendar } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getComponentCategory } from '@/utils/componentUtils';
import { useModifyMode } from '@/hooks/useModifyMode';
import { ModifyFieldWrapper } from '@/components/modify/ModifyFieldWrapper';
import { ModifyStickyFooter } from '@/components/modify/ModifyStickyFooter';
import AgGridTable from '@/components/common/AgGridTable';
import { 
  RunningHoursActionsCellRenderer, 
  UtilizationRateCellRenderer, 
  DateCellRenderer,
  NumberCellRenderer
} from '@/components/common/AgGridCellRenderers';
import { apiRequest } from '@/lib/queryClient';

interface RunningHoursData {
  id: string;
  component: string;
  componentCode?: string;
  componentCategory: string;
  runningHours: string;
  lastUpdated: string;
  utilizationRate?: number | null;
}

const RunningHours = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<RunningHoursData | null>(null);

  // Modify mode integration
  const { isModifyMode, targetId, fieldChanges } = useModifyMode();
  const [updateMode, setUpdateMode] = useState<'setTotal' | 'addDelta'>(
    'setTotal'
  );
  const [meterReplaced, setMeterReplaced] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    oldValue: '',
    newValue: '',
    dateUpdated: '',
    comments: '',
    oldMeterFinal: '',
    newMeterStart: '0',
  });
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [bulkUpdateMode, setBulkUpdateMode] = useState<'setTotal' | 'addDelta'>(
    'setTotal'
  );
  const [bulkUpdateData, setBulkUpdateData] = useState<{
    [key: string]: {
      value: string;
      meterReplaced: boolean;
      oldMeterFinal: string;
      newMeterStart: string;
    };
  }>({});
  const [bulkUpdateErrors, setBulkUpdateErrors] = useState<{
    [key: string]: string;
  }>({});
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const vesselId = 'V001'; // Default vessel ID

  // Fetch components data from MySQL database
  const { data: components = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/running-hours/components', vesselId],
    queryFn: () => apiRequest(`/api/running-hours/components/${vesselId}`, 'GET'),
  });

  // Transform components data to RunningHoursData format
  const runningHoursData: RunningHoursData[] = useMemo(() => {
    return components.map((component: any) => ({
      id: component.id,
      component: component.name,
      componentCode: component.code,
      componentCategory: getComponentCategory(component.code || ''),
      runningHours: component.currentCumulativeRH 
        ? `${parseInt(component.currentCumulativeRH).toLocaleString()} hrs`
        : '0 hrs',
      lastUpdated: component.lastUpdated || 'Never',
      utilizationRate: null, // Will be loaded separately
    }));
  }, [components]);

  // Fetch utilization rates from MySQL database
  const { data: utilizationRates } = useQuery({
    queryKey: ['/api/running-hours/utilization-rates', vesselId],
    queryFn: async () => {
      const componentIds = components.map((c: any) => c.id);
      if (componentIds.length === 0) return {};
      
      return await apiRequest('/api/running-hours/utilization-rates', 'POST', {
        componentIds
      });
    },
    enabled: components.length > 0,
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes
  });

  // Combine data with utilization rates
  const runningHoursDataWithRates = useMemo(() => {
    if (!utilizationRates) return runningHoursData;
    
    return runningHoursData.map(item => ({
      ...item,
      utilizationRate: utilizationRates[item.id] || null,
    }));
  }, [runningHoursData, utilizationRates]);


  // Mutation for single update - Real MySQL API call
  const updateRunningHours = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest(`/api/running-hours/update/${data.componentId}`, 'POST', data);
    },
    onSuccess: () => {
      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/running-hours/components', vesselId] });
      queryClient.invalidateQueries({ queryKey: ['/api/running-hours/utilization-rates', vesselId] });
      
      toast({
        title: 'Success',
        description: 'Running hours updated successfully',
      });
      setIsUpdateDialogOpen(false);
      handleCancelUpdate();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update running hours',
        variant: 'destructive',
      });
    },
  });

  // Mutation for bulk update - Real MySQL API call
  const bulkUpdateRunningHours = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/running-hours/bulk-update', 'POST', data);
    },
    onSuccess: () => {
      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/running-hours/components', vesselId] });
      queryClient.invalidateQueries({ queryKey: ['/api/running-hours/utilization-rates', vesselId] });
      
      toast({
        title: 'Success',
        description: 'Bulk update completed successfully',
      });
      setIsBulkUpdateOpen(false);
      setBulkUpdateData({});
      setBulkUpdateErrors({});
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to perform bulk update',
        variant: 'destructive',
      });
    },
  });

  const clearFilters = () => {
    setSearchTerm('');
  };

  // Export to CSV function
  const exportToCSV = () => {
    // Filter data based on current filters
    const filteredData = runningHoursDataWithRates.filter(item => {
      if (
        searchTerm &&
        !item.component.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    // Prepare CSV headers
    const headers = [
      'Vessel',
      'Component',
      'Component Code',
      'Component Category',
      'Running Hours (cumulative)',
      'Last Updated (local)',
      'Utilization Rate (hrs/day)',
      'Notes',
    ];

    // Prepare CSV rows
    const rows = filteredData.map(item => [
      vesselId,
      item.component,
      item.componentCode || '',
      item.componentCategory,
      item.runningHours.replace(' hrs', ''),
      item.lastUpdated,
      item.utilizationRate !== null && item.utilizationRate !== undefined
        ? item.utilizationRate.toString()
        : '',
      '', // Notes field (empty for now)
    ]);

    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const now = new Date();
    const filename = `running-hours_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.csv`;

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    toast({
      title: 'Export Complete',
      description: `Exported ${filteredData.length} records to ${filename}`,
    });
  };

  const openUpdateDialog = (component: RunningHoursData) => {
    setSelectedComponent(component);
    setUpdateForm({
      oldValue: component.runningHours.replace(' hrs', '').replace(/,/g, ''),
      newValue: '',
      dateUpdated: '',
      comments: '',
      oldMeterFinal: '',
      newMeterStart: '0',
    });
    setUpdateMode('setTotal');
    setMeterReplaced(false);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateFormChange = (field: string, value: string) => {
    setUpdateForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveUpdate = () => {
    if (!selectedComponent) return;

    // Validate date not in future
    const selectedDate = new Date(updateForm.dateUpdated);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
      toast({
        title: 'Error',
        description: 'Date cannot be in the future',
        variant: 'destructive',
      });
      return;
    }

    // Calculate new total
    const previousValue = parseFloat(updateForm.oldValue);
    const inputValue = parseFloat(updateForm.newValue);
    let newTotal: number;

    if (updateMode === 'addDelta') {
      newTotal = previousValue + inputValue;
    } else {
      newTotal = inputValue;
    }

    // Validation: new hours must be >= previous unless meter replaced
    if (!meterReplaced && newTotal < previousValue) {
      toast({
        title: 'Validation Error',
        description:
          "New hours must be ≥ previous hours. Use 'Meter replaced?' if the counter was reset.",
        variant: 'destructive',
      });
      return;
    }

    // Format date in vessel local time
    const dateLocal =
      selectedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ' ' +
      selectedDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

    // Prepare audit data
    const auditData = {
      vesselId: vesselId,
      componentId: selectedComponent.id,
      previousRH: previousValue,
      newRH: newTotal,
      cumulativeRH: meterReplaced
        ? previousValue +
          (inputValue - parseFloat(updateForm.newMeterStart || '0'))
        : newTotal,
      dateUpdatedLocal: dateLocal,
      dateUpdatedTZ: 'Asia/Kolkata', // Default timezone
      enteredAtUTC: new Date(),
      userId: 'current-user', // Placeholder
      source: 'single' as const,
      notes: updateForm.comments,
      meterReplaced: meterReplaced,
      oldMeterFinal: meterReplaced
        ? parseFloat(updateForm.oldMeterFinal)
        : null,
      newMeterStart: meterReplaced
        ? parseFloat(updateForm.newMeterStart)
        : null,
      version: 1,
    };

    updateRunningHours.mutate({
      componentId: selectedComponent.id,
      audit: auditData,
      cumulativeRH: auditData.cumulativeRH,
      dateUpdatedLocal: dateLocal,
    });
  };

  const handleCancelUpdate = () => {
    setIsUpdateDialogOpen(false);
    setSelectedComponent(null);
    setUpdateForm({
      oldValue: '',
      newValue: '',
      dateUpdated: '',
      comments: '',
      oldMeterFinal: '',
      newMeterStart: '0',
    });
    setUpdateMode('setTotal');
    setMeterReplaced(false);
  };

  const openBulkUpdate = () => {
    setBulkUpdateData({});
    setBulkUpdateErrors({});
    setIsBulkUpdateOpen(true);
  };

  const handleBulkUpdateChange = (
    componentId: string,
    field: string,
    value: any
  ) => {
    setBulkUpdateData(prev => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        [field]: value,
      },
    }));
    // Clear error when user starts typing
    if (bulkUpdateErrors[componentId] && field === 'value') {
      setBulkUpdateErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[componentId];
        return newErrors;
      });
    }
  };

  const handleBulkSave = () => {
    const errors: { [key: string]: string } = {};
    const updates = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Process each component with updates
    for (const component of runningHoursData) {
      const updateData = bulkUpdateData[component.id];
      if (!updateData || !updateData.value || updateData.value.trim() === '')
        continue;

      // Validate numeric input
      const inputValue = parseFloat(updateData.value.replace(/,/g, ''));
      if (isNaN(inputValue)) {
        errors[component.id] = 'Please enter a valid number';
        continue;
      }

      const previousValue = parseFloat(
        component.runningHours.replace(' hrs', '').replace(/,/g, '')
      );
      let newTotal: number;

      if (bulkUpdateMode === 'addDelta') {
        newTotal = previousValue + inputValue;
      } else {
        newTotal = inputValue;
      }

      // Validation: new hours must be >= previous unless meter replaced
      if (!updateData.meterReplaced && newTotal < previousValue) {
        errors[component.id] =
          "New hours must be ≥ previous hours. Check 'Meter replaced?' if the counter was reset.";
        continue;
      }

      // Format date in vessel local time
      const dateLocal =
        today.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ' ' +
        today.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

      // Prepare audit data
      const auditData = {
        vesselId: vesselId,
        componentId: component.id,
        previousRH: previousValue,
        newRH: newTotal,
        cumulativeRH: updateData.meterReplaced
          ? previousValue +
            (inputValue - parseFloat(updateData.newMeterStart || '0'))
          : newTotal,
        dateUpdatedLocal: dateLocal,
        dateUpdatedTZ: 'Asia/Kolkata',
        enteredAtUTC: new Date(),
        userId: 'current-user',
        source: 'bulk' as const,
        notes: '',
        meterReplaced: updateData.meterReplaced || false,
        oldMeterFinal: updateData.meterReplaced
          ? parseFloat(updateData.oldMeterFinal)
          : null,
        newMeterStart: updateData.meterReplaced
          ? parseFloat(updateData.newMeterStart)
          : null,
        version: 1,
      };

      updates.push({
        componentId: component.id,
        audit: auditData,
        cumulativeRH: auditData.cumulativeRH,
        dateUpdatedLocal: dateLocal,
      });
    }

    if (Object.keys(errors).length > 0) {
      setBulkUpdateErrors(errors);
      return;
    }

    if (updates.length === 0) {
      toast({
        title: 'No changes',
        description: 'No values were entered for update',
      });
      return;
    }

    bulkUpdateRunningHours.mutate({ updates });
  };

  // Filtered data for AG Grid
  const filteredData = useMemo(() => {
    return runningHoursDataWithRates.filter(
      item =>
        !searchTerm ||
        item.component.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [runningHoursDataWithRates, searchTerm]);

  // AG Grid column definitions
  const columnDefs = useMemo((): ColDef[] => [
    {
      headerName: 'Component',
      field: 'component',
      width: 200,
      pinned: 'left'
    },
    {
      headerName: 'Component Code',
      field: 'componentCode',
      width: 150
    },
    {
      headerName: 'Component Category',
      field: 'componentCategory',
      width: 180
    },
    {
      headerName: 'Running Hours',
      field: 'runningHours',
      width: 150,
      cellRenderer: (params) => {
        return <span className="font-medium">{params.value}</span>;
      }
    },
    {
      headerName: 'Last Updated',
      field: 'lastUpdated',
      width: 140,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Utilization Rate',
      field: 'utilizationRate',
      width: 150,
      cellRenderer: UtilizationRateCellRenderer,
      tooltip: 'Computed from last 30 days of RH entries'
    },
    {
      headerName: 'Update RH',
      field: 'actions',
      width: 140,
      cellRenderer: RunningHoursActionsCellRenderer,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ], []);

  // AG Grid context for action handlers
  const gridContext = useMemo(() => ({
    onUpdate: openUpdateDialog
  }), []);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold text-gray-900'>Running Hours</h1>
        <Button
          className='bg-green-600 hover:bg-green-700 text-white ml-[228px] mr-[228px]'
          onClick={openBulkUpdate}
        >
          <span className='mr-2'>+</span>
          Bulk Update RH
        </Button>
      </div>

      {/* Search and Export Row */}
      <div className='flex items-center gap-4'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <Input
            placeholder='Search Component'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>

        <Button
          variant='outline'
          className='flex items-center gap-2'
          onClick={exportToCSV}
        >
          <FileSpreadsheet className='h-4 w-4' />
          Export
        </Button>

        <Button
          variant='outline'
          onClick={clearFilters}
          className='flex items-center gap-2'
        >
          Clear
        </Button>
      </div>

      {/* Table */}
      <div className='bg-white rounded-lg'>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading running hours data from database...</div>
          </div>
        ) : (
          <AgGridTable
            rowData={filteredData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            context={gridContext}
            height="calc(100vh - 320px)"
            enableExport={true}
            enableSideBar={true}
            enableStatusBar={true}
            pagination={true}
            paginationPageSize={50}
            animateRows={true}
            suppressRowClickSelection={true}
            className="rounded-lg shadow-sm"
          />
        )}
      </div>

      {/* Update Running Hours Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-[#52baf3] border-b border-[#52baf3] pb-2'>
              Update Running Hours - {selectedComponent?.component}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            {/* Mode Toggle */}
            <div>
              <Label className='text-sm text-gray-600'>Mode</Label>
              <RadioGroup
                value={updateMode}
                onValueChange={(value: any) => setUpdateMode(value)}
                className='mt-2'
              >
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='setTotal' id='setTotal' />
                    <Label htmlFor='setTotal'>Set Total</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='addDelta' id='addDelta' />
                    <Label htmlFor='addDelta'>Add Delta</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='text-sm text-gray-600'>Old Value</Label>
                <Input
                  value={updateForm.oldValue}
                  readOnly
                  className='mt-1 bg-gray-100'
                />
              </div>
              <div>
                <Label className='text-sm text-gray-600'>
                  {updateMode === 'addDelta' ? 'Delta Value' : 'New Value'}
                </Label>
                <Input
                  type='number'
                  value={updateForm.newValue}
                  onChange={e =>
                    handleUpdateFormChange('newValue', e.target.value)
                  }
                  className='mt-1'
                  placeholder={updateMode === 'addDelta' ? '100' : '20000'}
                />
              </div>
            </div>

            <div>
              <Label className='text-sm text-gray-600'>Date Updated</Label>
              <Input
                type='date'
                value={updateForm.dateUpdated}
                onChange={e =>
                  handleUpdateFormChange('dateUpdated', e.target.value)
                }
                className='mt-1'
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Meter Replaced Checkbox */}
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='meterReplaced'
                checked={meterReplaced}
                onCheckedChange={checked =>
                  setMeterReplaced(checked as boolean)
                }
              />
              <Label htmlFor='meterReplaced' className='text-sm'>
                Meter replaced?
              </Label>
            </div>

            {/* Meter Replacement Fields */}
            {meterReplaced && (
              <div className='grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded'>
                <div>
                  <Label className='text-sm text-gray-600'>
                    Old Meter Final *
                  </Label>
                  <Input
                    type='number'
                    value={updateForm.oldMeterFinal}
                    onChange={e =>
                      handleUpdateFormChange('oldMeterFinal', e.target.value)
                    }
                    className='mt-1'
                    placeholder='Final reading'
                    required
                  />
                </div>
                <div>
                  <Label className='text-sm text-gray-600'>
                    New Meter Start *
                  </Label>
                  <Input
                    type='number'
                    value={updateForm.newMeterStart}
                    onChange={e =>
                      handleUpdateFormChange('newMeterStart', e.target.value)
                    }
                    className='mt-1'
                    placeholder='0'
                  />
                </div>
              </div>
            )}

            <div>
              <Label className='text-sm text-gray-600'>Comments</Label>
              <Textarea
                value={updateForm.comments}
                onChange={e =>
                  handleUpdateFormChange('comments', e.target.value)
                }
                className='mt-1 resize-none'
                rows={3}
                placeholder={
                  meterReplaced ? 'Reason for meter replacement' : 'Comments'
                }
              />
            </div>
          </div>

          <div className='flex justify-end gap-2 pt-4'>
            <Button variant='outline' onClick={handleCancelUpdate}>
              Cancel
            </Button>
            <Button
              className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
              onClick={handleSaveUpdate}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Update Dialog */}
      <Dialog open={isBulkUpdateOpen} onOpenChange={setIsBulkUpdateOpen}>
        <DialogContent className='w-[90vw] max-w-none h-[90vh] flex flex-col'>
          <DialogHeader className='pb-4 space-y-3'>
            <DialogTitle className='text-[#52baf3] text-xl'>
              Bulk Update Running Hours
            </DialogTitle>
            {/* Mode Toggle for Bulk Update */}
            <div className='flex items-center space-x-4'>
              <Label className='text-sm text-gray-600'>Mode:</Label>
              <RadioGroup
                value={bulkUpdateMode}
                onValueChange={(value: any) => setBulkUpdateMode(value)}
                className='flex flex-row space-x-4'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='setTotal' id='bulkSetTotal' />
                  <Label htmlFor='bulkSetTotal'>Set Total</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='addDelta' id='bulkAddDelta' />
                  <Label htmlFor='bulkAddDelta'>Add Delta</Label>
                </div>
              </RadioGroup>
            </div>
          </DialogHeader>

          <div className='flex-1 overflow-auto'>
            <div className='bg-white rounded-lg border border-gray-200'>
              {/* Table Header */}
              <div className='bg-[#52baf3] text-white px-4 py-3'>
                <div className='grid grid-cols-5 gap-4 text-sm font-medium'>
                  <div>Component Name</div>
                  <div>Previous Running Hours</div>
                  <div>
                    {bulkUpdateMode === 'addDelta'
                      ? 'Delta Hours'
                      : 'Present Running Hours'}
                  </div>
                  <div>Meter Replaced?</div>
                  <div>Status</div>
                </div>
              </div>

              {/* Table Body */}
              <div className='divide-y divide-gray-200'>
                {runningHoursData.map(item => {
                  const updateData = bulkUpdateData[item.id] || {
                    value: '',
                    meterReplaced: false,
                  };
                  return (
                    <div key={item.id} className='px-4 py-3'>
                      <div className='grid grid-cols-5 gap-4 text-sm items-center'>
                        <div className='text-gray-900 font-medium'>
                          {item.component}
                        </div>
                        <div className='text-gray-700'>{item.runningHours}</div>
                        <div className='space-y-1'>
                          <Input
                            type='number'
                            value={updateData.value || ''}
                            onChange={e =>
                              handleBulkUpdateChange(
                                item.id,
                                'value',
                                e.target.value
                              )
                            }
                            placeholder={
                              bulkUpdateMode === 'addDelta'
                                ? 'Enter delta'
                                : 'Enter new value'
                            }
                            className='w-full'
                          />
                          {bulkUpdateErrors[item.id] && (
                            <div className='text-red-500 text-xs'>
                              {bulkUpdateErrors[item.id]}
                            </div>
                          )}
                        </div>
                        <div className='flex items-center justify-center'>
                          <Checkbox
                            checked={updateData.meterReplaced || false}
                            onCheckedChange={checked =>
                              handleBulkUpdateChange(
                                item.id,
                                'meterReplaced',
                                checked
                              )
                            }
                          />
                        </div>
                        <div className='text-gray-500'>
                          {updateData.value && updateData.value.trim() !== ''
                            ? 'Ready to update'
                            : 'No change'}
                        </div>
                      </div>
                      {/* Meter replacement fields if checkbox is checked */}
                      {updateData.meterReplaced && (
                        <div className='grid grid-cols-2 gap-4 mt-2 pl-10 pr-4'>
                          <div>
                            <Label className='text-xs text-gray-600'>
                              Old Meter Final
                            </Label>
                            <Input
                              type='number'
                              value={updateData.oldMeterFinal || ''}
                              onChange={e =>
                                handleBulkUpdateChange(
                                  item.id,
                                  'oldMeterFinal',
                                  e.target.value
                                )
                              }
                              placeholder='Final reading'
                              className='h-8 text-sm'
                            />
                          </div>
                          <div>
                            <Label className='text-xs text-gray-600'>
                              New Meter Start
                            </Label>
                            <Input
                              type='number'
                              value={updateData.newMeterStart || ''}
                              onChange={e =>
                                handleBulkUpdateChange(
                                  item.id,
                                  'newMeterStart',
                                  e.target.value
                                )
                              }
                              placeholder='0'
                              className='h-8 text-sm'
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-2 pt-4 border-t'>
            <Button
              variant='outline'
              onClick={() => setIsBulkUpdateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
              onClick={handleBulkSave}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modify Mode Sticky Footer */}
      {isModifyMode && (
        <ModifyStickyFooter
          isVisible={true}
          hasChanges={Object.keys(fieldChanges).length > 0}
          changedFieldsCount={Object.keys(fieldChanges).length}
          onCancel={() => {
            window.location.href = '/pms/modify';
          }}
          onSubmitChangeRequest={() => {
            // Submit change request logic will be implemented
            console.log('Submitting changes:', fieldChanges);
          }}
        />
      )}
    </div>
  );
};

export default RunningHours;
