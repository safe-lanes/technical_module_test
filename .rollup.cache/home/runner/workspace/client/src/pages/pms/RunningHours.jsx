import { __assign, __awaiter, __generator, __spreadArray } from 'tslib';
import { useState, useEffect } from 'react';
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
import { Search, FileSpreadsheet } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getComponentCategory } from '@/utils/componentUtils';
import { useModifyMode } from '@/hooks/useModifyMode';
import { ModifyStickyFooter } from '@/components/modify/ModifyStickyFooter';
var RunningHours = function () {
  var _a = useState(''),
    searchTerm = _a[0],
    setSearchTerm = _a[1];
  var _b = useState(false),
    isUpdateDialogOpen = _b[0],
    setIsUpdateDialogOpen = _b[1];
  var _c = useState(null),
    selectedComponent = _c[0],
    setSelectedComponent = _c[1];
  // Modify mode integration
  var _d = useModifyMode(),
    isModifyMode = _d.isModifyMode,
    targetId = _d.targetId,
    fieldChanges = _d.fieldChanges;
  var _e = useState('setTotal'),
    updateMode = _e[0],
    setUpdateMode = _e[1];
  var _f = useState(false),
    meterReplaced = _f[0],
    setMeterReplaced = _f[1];
  var _g = useState({
      oldValue: '',
      newValue: '',
      dateUpdated: '',
      comments: '',
      oldMeterFinal: '',
      newMeterStart: '0',
    }),
    updateForm = _g[0],
    setUpdateForm = _g[1];
  var _h = useState(false),
    isBulkUpdateOpen = _h[0],
    setIsBulkUpdateOpen = _h[1];
  var _j = useState('setTotal'),
    bulkUpdateMode = _j[0],
    setBulkUpdateMode = _j[1];
  var _k = useState({}),
    bulkUpdateData = _k[0],
    setBulkUpdateData = _k[1];
  var _l = useState({}),
    bulkUpdateErrors = _l[0],
    setBulkUpdateErrors = _l[1];
  var toast = useToast().toast;
  var vesselId = 'V001'; // Default vessel ID
  // Utilization rate cache (15 minutes)
  var _m = useState(null),
    utilizationCache = _m[0],
    setUtilizationCache = _m[1];
  // Mock data with Component Category derived from tree structure
  // These component codes map to tree positions for category derivation
  var mockData = [
    {
      id: '1',
      component: 'Radar System',
      componentCode: '4.1.1',
      componentCategory: getComponentCategory('4.1.1'),
      runningHours: '18,560 hrs',
      lastUpdated: '02-Jun-2025',
      utilizationRate: null,
    },
    {
      id: '2',
      component: 'Diesel Generator 1',
      componentCode: '7.2.1',
      componentCategory: getComponentCategory('7.2.1'),
      runningHours: '15,670 hrs',
      lastUpdated: '09-Jun-2025',
      utilizationRate: null,
    },
    {
      id: '3',
      component: 'Diesel Generator 2',
      componentCode: '7.2.2',
      componentCategory: getComponentCategory('7.2.2'),
      runningHours: '14,980 hrs',
      lastUpdated: '16-Jun-2025',
      utilizationRate: null,
    },
    {
      id: '4',
      component: 'Main Cooling Seawater Pump',
      componentCode: '8.3.1',
      componentCategory: getComponentCategory('8.3.1'),
      runningHours: '12,800 hrs',
      lastUpdated: '23-Jun-2025',
      utilizationRate: null,
    },
    {
      id: '5',
      component: 'Main Engine',
      componentCode: '6.1.1',
      componentCategory: getComponentCategory('6.1.1'),
      runningHours: '12,580 hrs',
      lastUpdated: '30-Jun-2025',
      utilizationRate: null,
    },
    {
      id: '6',
      component: 'Propeller System',
      componentCode: '6.2.1',
      componentCategory: getComponentCategory('6.2.1'),
      runningHours: '12,580 hrs',
      lastUpdated: '02-Jun-2025',
      utilizationRate: null,
    },
    {
      id: '7',
      component: 'Main Lubrication Oil Pump',
      componentCode: '7.3.1',
      componentCategory: getComponentCategory('7.3.1'),
      runningHours: '12,450 hrs',
      lastUpdated: '09-Jun-2025',
      utilizationRate: null,
    },
    {
      id: '8',
      component: 'Steering Gear',
      componentCode: '4.3.1',
      componentCategory: getComponentCategory('4.3.1'),
      runningHours: '11,240 hrs',
      lastUpdated: '16-Jun-2025',
      utilizationRate: null,
    },
    {
      id: '9',
      component: 'Main Air Compressor',
      componentCode: '8.1.1',
      componentCategory: getComponentCategory('8.1.1'),
      runningHours: '10,840 hrs',
      lastUpdated: '23-Jun-2025',
      utilizationRate: null,
    },
    {
      id: '10',
      component: 'Bow Thruster',
      componentCode: '6.3.1',
      componentCategory: getComponentCategory('6.3.1'),
      runningHours: '10,450 hrs',
      lastUpdated: '30-Jun-2025',
      utilizationRate: null,
    },
  ];
  var _o = useState(mockData),
    runningHoursData = _o[0],
    setRunningHoursData = _o[1];
  // Fetch utilization rates asynchronously (non-blocking)
  useEffect(function () {
    var fetchUtilizationRates = function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var rates_1, error_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              // Check cache first
              if (
                utilizationCache &&
                Date.now() - utilizationCache.timestamp < 15 * 60 * 1000
              ) {
                // Apply cached rates to data
                setRunningHoursData(function (prev) {
                  return prev.map(function (item) {
                    return __assign(__assign({}, item), {
                      utilizationRate: utilizationCache.data[item.id] || null,
                    });
                  });
                });
                return [2 /*return*/];
              }
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              // Simulate async calculation with timeout
              return [
                4 /*yield*/,
                new Promise(function (resolve) {
                  return setTimeout(resolve, 500);
                }),
              ];
            case 2:
              // Simulate async calculation with timeout
              _a.sent();
              rates_1 = {};
              runningHoursData.forEach(function (item) {
                // Mock calculation: random rate between 0-24 hrs/day
                rates_1[item.id] = Math.round(Math.random() * 24 * 10) / 10;
              });
              // Update cache
              setUtilizationCache({
                data: rates_1,
                timestamp: Date.now(),
              });
              // Apply rates to data
              setRunningHoursData(function (prev) {
                return prev.map(function (item) {
                  return __assign(__assign({}, item), {
                    utilizationRate: rates_1[item.id] || null,
                  });
                });
              });
              return [3 /*break*/, 4];
            case 3:
              error_1 = _a.sent();
              // Silently fail - utilization rates remain null
              console.error('Failed to fetch utilization rates:', error_1);
              return [3 /*break*/, 4];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    };
    fetchUtilizationRates();
  }, []); // Run once on mount
  // Mutation for single update
  var updateRunningHours = useMutation({
    mutationFn: function (data) {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              // Simulate API call
              return [
                4 /*yield*/,
                new Promise(function (resolve) {
                  return setTimeout(resolve, 500);
                }),
              ];
            case 1:
              // Simulate API call
              _a.sent();
              return [2 /*return*/, { success: true }];
          }
        });
      });
    },
    onSuccess: function (_, variables) {
      // Update local data
      setRunningHoursData(function (prev) {
        return prev.map(function (item) {
          return item.id === variables.componentId
            ? __assign(__assign({}, item), {
                runningHours: ''.concat(
                  variables.audit.cumulativeRH.toLocaleString(),
                  ' hrs'
                ),
                lastUpdated: variables.dateUpdatedLocal,
              })
            : item;
        });
      });
      // Bust cache
      setUtilizationCache(null);
      toast({
        title: 'Success',
        description: 'Running hours updated successfully',
      });
      setIsUpdateDialogOpen(false);
      handleCancelUpdate();
    },
    onError: function (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update running hours',
        variant: 'destructive',
      });
    },
  });
  // Mutation for bulk update
  var bulkUpdateRunningHours = useMutation({
    mutationFn: function (data) {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              // Simulate API call
              return [
                4 /*yield*/,
                new Promise(function (resolve) {
                  return setTimeout(resolve, 500);
                }),
              ];
            case 1:
              // Simulate API call
              _a.sent();
              return [2 /*return*/, { success: true }];
          }
        });
      });
    },
    onSuccess: function (_, variables) {
      // Update local data for all updated components
      if (variables.updates) {
        setRunningHoursData(function (prev) {
          var updatedData = __spreadArray([], prev, true);
          variables.updates.forEach(function (update) {
            var index = updatedData.findIndex(function (item) {
              return item.id === update.componentId;
            });
            if (index !== -1) {
              updatedData[index] = __assign(__assign({}, updatedData[index]), {
                runningHours: ''.concat(
                  update.cumulativeRH.toLocaleString(),
                  ' hrs'
                ),
                lastUpdated: update.dateUpdatedLocal,
              });
            }
          });
          return updatedData;
        });
      }
      // Bust cache
      setUtilizationCache(null);
      toast({
        title: 'Success',
        description: 'Bulk update completed successfully',
      });
      setIsBulkUpdateOpen(false);
      setBulkUpdateData({});
      setBulkUpdateErrors({});
    },
    onError: function (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to perform bulk update',
        variant: 'destructive',
      });
    },
  });
  var clearFilters = function () {
    setSearchTerm('');
  };
  // Export to CSV function
  var exportToCSV = function () {
    // Filter data based on current filters
    var filteredData = runningHoursData.filter(function (item) {
      if (
        searchTerm &&
        !item.component.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
    // Prepare CSV headers
    var headers = [
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
    var rows = filteredData.map(function (item) {
      return [
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
      ];
    });
    // Convert to CSV format
    var csvContent = __spreadArray(
      [headers.join(',')],
      rows.map(function (row) {
        return row
          .map(function (cell) {
            return '"'.concat(cell, '"');
          })
          .join(',');
      }),
      true
    ).join('\n');
    // Create blob and download
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var now = new Date();
    var filename = 'running-hours_'
      .concat(now.getFullYear())
      .concat(String(now.getMonth() + 1).padStart(2, '0'))
      .concat(String(now.getDate()).padStart(2, '0'), '_')
      .concat(String(now.getHours()).padStart(2, '0'))
      .concat(String(now.getMinutes()).padStart(2, '0'), '.csv');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    toast({
      title: 'Export Complete',
      description: 'Exported '
        .concat(filteredData.length, ' records to ')
        .concat(filename),
    });
  };
  var openUpdateDialog = function (component) {
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
  var handleUpdateFormChange = function (field, value) {
    setUpdateForm(function (prev) {
      var _a;
      return __assign(__assign({}, prev), ((_a = {}), (_a[field] = value), _a));
    });
  };
  var handleSaveUpdate = function () {
    if (!selectedComponent) return;
    // Validate date not in future
    var selectedDate = new Date(updateForm.dateUpdated);
    var today = new Date();
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
    var previousValue = parseFloat(updateForm.oldValue);
    var inputValue = parseFloat(updateForm.newValue);
    var newTotal;
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
    var dateLocal =
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
    var auditData = {
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
      source: 'single',
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
  var handleCancelUpdate = function () {
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
  var openBulkUpdate = function () {
    setBulkUpdateData({});
    setBulkUpdateErrors({});
    setIsBulkUpdateOpen(true);
  };
  var handleBulkUpdateChange = function (componentId, field, value) {
    setBulkUpdateData(function (prev) {
      var _a, _b;
      return __assign(
        __assign({}, prev),
        ((_a = {}),
        (_a[componentId] = __assign(
          __assign({}, prev[componentId]),
          ((_b = {}), (_b[field] = value), _b)
        )),
        _a)
      );
    });
    // Clear error when user starts typing
    if (bulkUpdateErrors[componentId] && field === 'value') {
      setBulkUpdateErrors(function (prev) {
        var newErrors = __assign({}, prev);
        delete newErrors[componentId];
        return newErrors;
      });
    }
  };
  var handleBulkSave = function () {
    var errors = {};
    var updates = [];
    var today = new Date();
    today.setHours(23, 59, 59, 999);
    // Process each component with updates
    for (
      var _i = 0, runningHoursData_1 = runningHoursData;
      _i < runningHoursData_1.length;
      _i++
    ) {
      var component = runningHoursData_1[_i];
      var updateData = bulkUpdateData[component.id];
      if (!updateData || !updateData.value || updateData.value.trim() === '')
        continue;
      // Validate numeric input
      var inputValue = parseFloat(updateData.value.replace(/,/g, ''));
      if (isNaN(inputValue)) {
        errors[component.id] = 'Please enter a valid number';
        continue;
      }
      var previousValue = parseFloat(
        component.runningHours.replace(' hrs', '').replace(/,/g, '')
      );
      var newTotal = void 0;
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
      var dateLocal =
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
      var auditData = {
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
        source: 'bulk',
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
    bulkUpdateRunningHours.mutate({ updates: updates });
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
            onChange={function (e) {
              return setSearchTerm(e.target.value);
            }}
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
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        {/* Table Header */}
        <div className='bg-[#52baf3] text-white px-4 py-3'>
          <div className='grid grid-cols-7 gap-4 text-sm font-medium'>
            <div>Component</div>
            <div>Component Category</div>
            <div>Running Hours</div>
            <div>last Updated</div>
            <div>Utilization Rate</div>
            <div className='col-span-2'>Update RH</div>
          </div>
        </div>

        {/* Table Body */}
        <div className='divide-y divide-gray-200'>
          {(function () {
            var filteredData = runningHoursData.filter(function (item) {
              return (
                !searchTerm ||
                item.component.toLowerCase().includes(searchTerm.toLowerCase())
              );
            });
            if (filteredData.length === 0 && searchTerm) {
              return (
                <div className='px-4 py-8 text-center text-gray-500'>
                  No results found.{' '}
                  <button
                    onClick={clearFilters}
                    className='text-blue-600 underline'
                  >
                    Reset
                  </button>
                </div>
              );
            }
            return filteredData.map(function (item) {
              return (
                <div key={item.id} className='px-4 py-3 hover:bg-gray-50'>
                  <div className='grid grid-cols-7 gap-4 text-sm items-center'>
                    <div className='text-gray-900'>{item.component}</div>
                    <div className='text-gray-700'>
                      {item.componentCategory}
                    </div>
                    <div className='text-gray-900 font-medium'>
                      {item.runningHours}
                    </div>
                    <div className='text-gray-700'>{item.lastUpdated}</div>
                    <div
                      className='text-gray-700'
                      title='Computed from last 30 days of RH entries'
                    >
                      {item.utilizationRate !== null
                        ? ''.concat(item.utilizationRate, ' hrs/day')
                        : '—'}
                    </div>
                    <div className='col-span-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-8 w-8 p-0'
                        onClick={function () {
                          return openUpdateDialog(item);
                        }}
                      >
                        <span className='text-gray-600'>⚙</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Pagination */}
      <div className='flex justify-end text-sm text-gray-500'>Page 6 of 6</div>

      {/* Update Running Hours Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-[#52baf3] border-b border-[#52baf3] pb-2'>
              Update Running Hours -{' '}
              {selectedComponent === null || selectedComponent === void 0
                ? void 0
                : selectedComponent.component}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            {/* Mode Toggle */}
            <div>
              <Label className='text-sm text-gray-600'>Mode</Label>
              <RadioGroup
                value={updateMode}
                onValueChange={function (value) {
                  return setUpdateMode(value);
                }}
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
                  onChange={function (e) {
                    return handleUpdateFormChange('newValue', e.target.value);
                  }}
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
                onChange={function (e) {
                  return handleUpdateFormChange('dateUpdated', e.target.value);
                }}
                className='mt-1'
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Meter Replaced Checkbox */}
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='meterReplaced'
                checked={meterReplaced}
                onCheckedChange={function (checked) {
                  return setMeterReplaced(checked);
                }}
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
                    onChange={function (e) {
                      return handleUpdateFormChange(
                        'oldMeterFinal',
                        e.target.value
                      );
                    }}
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
                    onChange={function (e) {
                      return handleUpdateFormChange(
                        'newMeterStart',
                        e.target.value
                      );
                    }}
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
                onChange={function (e) {
                  return handleUpdateFormChange('comments', e.target.value);
                }}
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
                onValueChange={function (value) {
                  return setBulkUpdateMode(value);
                }}
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
                {runningHoursData.map(function (item) {
                  var updateData = bulkUpdateData[item.id] || {
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
                            onChange={function (e) {
                              return handleBulkUpdateChange(
                                item.id,
                                'value',
                                e.target.value
                              );
                            }}
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
                            onCheckedChange={function (checked) {
                              return handleBulkUpdateChange(
                                item.id,
                                'meterReplaced',
                                checked
                              );
                            }}
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
                              onChange={function (e) {
                                return handleBulkUpdateChange(
                                  item.id,
                                  'oldMeterFinal',
                                  e.target.value
                                );
                              }}
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
                              onChange={function (e) {
                                return handleBulkUpdateChange(
                                  item.id,
                                  'newMeterStart',
                                  e.target.value
                                );
                              }}
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
              onClick={function () {
                return setIsBulkUpdateOpen(false);
              }}
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
          onCancel={function () {
            window.location.href = '/pms/modify';
          }}
          onSubmitChangeRequest={function () {
            // Submit change request logic will be implemented
            console.log('Submitting changes:', fieldChanges);
          }}
        />
      )}
    </div>
  );
};
export default RunningHours;
//# sourceMappingURL=RunningHours.jsx.map
