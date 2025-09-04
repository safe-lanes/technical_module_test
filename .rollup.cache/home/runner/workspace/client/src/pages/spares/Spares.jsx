import { __assign } from 'tslib';
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  Plus,
  FileSpreadsheet,
  X,
  MessageSquare,
  Calendar,
} from 'lucide-react';
// Component tree is now imported from shared data
var sparesData = [
  {
    id: 1,
    partCode: 'SP-ME-001',
    partName: 'Fuel Injector',
    component: 'Main Engine #1 (Wartsila 8L46F)',
    critical: 'Yes',
    rob: 2,
    min: 1,
    stock: 'OK',
    location: 'Store Room A',
    componentId: '6.01.001',
  },
  {
    id: 2,
    partCode: 'SP-ME-002',
    partName: 'Cylinder Head Gasket',
    component: 'Main Engine #1 (Wartsila 8L46F)',
    critical: 'No',
    rob: 2,
    min: 1,
    stock: '',
    location: 'Store Room B',
    componentId: '6.01.001',
  },
  {
    id: 3,
    partCode: 'SP-ME-003',
    partName: 'Piston Ring Set',
    component: 'Main Engine #1 (Wartsila 8L46F)',
    critical: 'No',
    rob: 3,
    min: 1,
    stock: '',
    location: 'Store Room B',
    componentId: '6.01.001',
  },
  {
    id: 4,
    partCode: 'SP-ME-004',
    partName: 'Main Bearing',
    component: 'Main Engine Cooling System',
    critical: 'No',
    rob: 4,
    min: 2,
    stock: '',
    location: 'Store Room C',
    componentId: '6',
  },
  {
    id: 5,
    partCode: 'SP-COOL-001',
    partName: 'Cooling Pump Seal',
    component: 'Main Engine Cooling System',
    critical: 'Critical',
    rob: 4,
    min: 2,
    stock: '',
    location: 'Store Room D',
    componentId: '6',
  },
  {
    id: 6,
    partCode: 'SP-ME-001',
    partName: 'Fuel Injector',
    component: 'Main Engine #1 (Wartsila 8L46F)',
    critical: 'No',
    rob: 1,
    min: 2,
    stock: 'Low',
    location: 'Store Room A',
    componentId: '6.01.001',
  },
  {
    id: 7,
    partCode: 'SP-ME-002',
    partName: 'Cylinder Head Gasket',
    component: 'Main Engine #1 (Wartsila 8L46F)',
    critical: 'No',
    rob: 2,
    min: 1,
    stock: '',
    location: 'Store Room B',
    componentId: '6.01.001',
  },
  {
    id: 8,
    partCode: 'SP-ME-003',
    partName: 'Piston Ring Set',
    component: 'Main Engine #1 (Wartsila 8L46F)',
    critical: 'No',
    rob: 2,
    min: 1,
    stock: '',
    location: 'Store Room B',
    componentId: '6.01.001',
  },
  {
    id: 9,
    partCode: 'SP-ME-004',
    partName: 'Main Bearing',
    component: 'Main Engine #1 (Wartsila 8L46F)',
    critical: 'No',
    rob: 3,
    min: 1,
    stock: '',
    location: 'Store Room C',
    componentId: '6.01.001',
  },
  {
    id: 10,
    partCode: 'SP-COOL-001',
    partName: 'Cooling Pump Seal',
    component: 'Main Engine Cooling System',
    critical: 'No',
    rob: 4,
    min: 2,
    stock: '',
    location: 'Store Room D',
    componentId: '6',
  },
  {
    id: 11,
    partCode: 'SP-ME-001',
    partName: 'Fuel Injector',
    component: 'Main Engine #1 (Wartsila 8L46F)',
    critical: 'Critical',
    rob: 6,
    min: 2,
    stock: '',
    location: 'Store Room A',
    componentId: '6.01.001',
  },
  {
    id: 12,
    partCode: 'SP-ME-002',
    partName: 'Cylinder Head Gasket',
    component: 'Main Engine #1 (Wartsila 8L46F)',
    critical: 'No',
    rob: 2,
    min: 10,
    stock: 'Low',
    location: 'Store Room B',
    componentId: '6.01.001',
  },
  // Sample data for 601.002 ME cylinder covers w/ valves
  {
    id: 13,
    partCode: 'SP-CC-001',
    partName: 'Cylinder Cover Assembly',
    component: 'ME cylinder covers w/ valves',
    critical: 'Critical',
    rob: 2,
    min: 1,
    stock: 'OK',
    location: 'Store Room A',
    componentId: '6.1.1.2',
  },
  {
    id: 14,
    partCode: 'SP-CC-002',
    partName: 'Inlet Valve',
    component: 'ME cylinder covers w/ valves',
    critical: 'Critical',
    rob: 4,
    min: 2,
    stock: 'OK',
    location: 'Store Room A',
    componentId: '6.1.1.2',
  },
  {
    id: 15,
    partCode: 'SP-CC-003',
    partName: 'Exhaust Valve',
    component: 'ME cylinder covers w/ valves',
    critical: 'Critical',
    rob: 4,
    min: 2,
    stock: 'OK',
    location: 'Store Room A',
    componentId: '6.1.1.2',
  },
  {
    id: 16,
    partCode: 'SP-CC-004',
    partName: 'Valve Spring',
    component: 'ME cylinder covers w/ valves',
    critical: 'No',
    rob: 8,
    min: 4,
    stock: 'OK',
    location: 'Store Room B',
    componentId: '6.1.1.2',
  },
  {
    id: 17,
    partCode: 'SP-CC-005',
    partName: 'Valve Guide',
    component: 'ME cylinder covers w/ valves',
    critical: 'No',
    rob: 6,
    min: 2,
    stock: 'OK',
    location: 'Store Room B',
    componentId: '6.1.1.2',
  },
  {
    id: 18,
    partCode: 'SP-CC-006',
    partName: 'Valve Seat Ring',
    component: 'ME cylinder covers w/ valves',
    critical: 'Critical',
    rob: 3,
    min: 2,
    stock: 'OK',
    location: 'Store Room A',
    componentId: '6.1.1.2',
  },
  {
    id: 19,
    partCode: 'SP-CC-007',
    partName: 'Cover Gasket Set',
    component: 'ME cylinder covers w/ valves',
    critical: 'No',
    rob: 1,
    min: 2,
    stock: 'Low',
    location: 'Store Room C',
    componentId: '6.1.1.2',
  },
  {
    id: 20,
    partCode: 'SP-CC-008',
    partName: 'Valve Spindle',
    component: 'ME cylinder covers w/ valves',
    critical: 'Critical',
    rob: 2,
    min: 1,
    stock: 'OK',
    location: 'Store Room A',
    componentId: '6.1.1.2',
  },
  {
    id: 21,
    partCode: 'SP-CC-009',
    partName: 'Cooling Water Nozzle',
    component: 'ME cylinder covers w/ valves',
    critical: 'No',
    rob: 5,
    min: 2,
    stock: 'OK',
    location: 'Store Room B',
    componentId: '6.1.1.2',
  },
  {
    id: 22,
    partCode: 'SP-CC-010',
    partName: 'Cover Bolt Set',
    component: 'ME cylinder covers w/ valves',
    critical: 'No',
    rob: 3,
    min: 1,
    stock: 'OK',
    location: 'Store Room C',
    componentId: '6.1.1.2',
  },
];
var historyData = [
  {
    id: 1,
    date: '02-Jun-2025',
    partName: 'Fuel Injector',
    type: 'Consumed',
    qty: 1,
    reference: 'WO-2025-03',
    comment: 'Used for Main Engine Overhaul',
  },
  {
    id: 2,
    date: '09-Jun-2025',
    partName: 'Cylinder Head Gasket',
    type: 'Received',
    qty: 2,
    reference: 'WO-2025-17',
    comment: 'Delivery from Singapore',
  },
  {
    id: 3,
    date: '16-Jun-2025',
    partName: 'Piston Ring Set',
    type: 'Consumed',
    qty: 2,
    reference: 'WO-2025-34',
    comment: 'Routine Maintenance',
  },
  {
    id: 4,
    date: '23-Jun-2025',
    partName: 'Main Bearing',
    type: 'Consumed',
    qty: 3,
    reference: 'WO-2025-19',
    comment: 'Main Engine Cylinder #3 repair',
  },
  {
    id: 5,
    date: '30-Jun-2025',
    partName: 'Cooling Pump Seal',
    type: 'Consumed',
    qty: 4,
    reference: 'WO-2025-03',
    comment: 'Routine Maintenance',
  },
  {
    id: 6,
    date: '02-Jun-2025',
    partName: 'Fuel Injector',
    type: 'Consumed',
    qty: 6,
    reference: 'WO-2025-17',
    comment: 'Routine Maintenance',
  },
  {
    id: 7,
    date: '09-Jun-2025',
    partName: 'Cylinder Head Gasket',
    type: 'Consumed',
    qty: 2,
    reference: 'WO-2025-34',
    comment: 'Routine Maintenance',
  },
];
var Spares = function () {
  var _a = useState('inventory'),
    activeTab = _a[0],
    setActiveTab = _a[1];
  var _b = useState(null),
    selectedComponentId = _b[0],
    setSelectedComponentId = _b[1];
  var _c = useState(new Set(['6', '6.1', '6.1.1'])),
    expandedNodes = _c[0],
    setExpandedNodes = _c[1];
  var _d = useState(''),
    searchTerm = _d[0],
    setSearchTerm = _d[1];
  var _e = useState(''),
    criticalityFilter = _e[0],
    setCriticalityFilter = _e[1];
  var _f = useState(''),
    stockFilter = _f[0],
    setStockFilter = _f[1];
  var _g = useState(false),
    isAddSpareModalOpen = _g[0],
    setIsAddSpareModalOpen = _g[1];
  var _h = useState(false),
    isBulkUpdateModalOpen = _h[0],
    setIsBulkUpdateModalOpen = _h[1];
  var _j = useState({}),
    bulkUpdateData = _j[0],
    setBulkUpdateData = _j[1];
  var _k = useState(''),
    placeReceived = _k[0],
    setPlaceReceived = _k[1];
  var _l = useState(''),
    dateReceived = _l[0],
    setDateReceived = _l[1];
  var toggleNode = function (nodeId) {
    setExpandedNodes(function (prev) {
      var newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };
  // Select component from tree
  var selectComponent = function (componentId) {
    setSelectedComponentId(componentId);
  };
  // Calculate stock status
  var getStockStatus = function (rob, min) {
    if (rob === min) return 'Minimum';
    if (rob < min) return 'Low';
    if (rob > min) return 'OK';
    return '';
  };
  // Filter spares based on all criteria
  var filteredSpares = useMemo(
    function () {
      var filtered = sparesData;
      // Filter by selected component
      if (selectedComponentId) {
        filtered = filtered.filter(function (spare) {
          return spare.componentId === selectedComponentId;
        });
      }
      // Filter by search term
      if (searchTerm) {
        var search_1 = searchTerm.toLowerCase();
        filtered = filtered.filter(function (spare) {
          return (
            spare.partCode.toLowerCase().includes(search_1) ||
            spare.partName.toLowerCase().includes(search_1) ||
            spare.component.toLowerCase().includes(search_1)
          );
        });
      }
      // Filter by criticality
      if (criticalityFilter && criticalityFilter !== 'All') {
        if (criticalityFilter === 'Critical') {
          filtered = filtered.filter(function (spare) {
            return spare.critical === 'Critical' || spare.critical === 'Yes';
          });
        } else if (criticalityFilter === 'Non-Critical') {
          filtered = filtered.filter(function (spare) {
            return spare.critical !== 'Critical' && spare.critical !== 'Yes';
          });
        }
      }
      // Filter by stock status
      if (stockFilter && stockFilter !== 'All') {
        filtered = filtered.filter(function (spare) {
          var stockStatus = getStockStatus(spare.rob, spare.min);
          return stockStatus === stockFilter;
        });
      }
      return filtered;
    },
    [selectedComponentId, searchTerm, criticalityFilter, stockFilter]
  );
  // Clear all filters
  var clearFilters = function () {
    setSearchTerm('');
    setCriticalityFilter('');
    setStockFilter('');
    setSelectedComponentId(null);
  };
  // Handle bulk update modal
  var openBulkUpdateModal = function () {
    if (!selectedComponentId) {
      alert(
        'Please select a component from the search or component tree first.'
      );
      return;
    }
    setIsBulkUpdateModalOpen(true);
    // Initialize bulk update data
    var initialData = {};
    filteredSpares.forEach(function (spare) {
      initialData[spare.id] = { consumed: 0, received: 0 };
    });
    setBulkUpdateData(initialData);
  };
  // Handle bulk update input changes
  var handleBulkUpdateChange = function (spareId, field, value) {
    var numValue = parseInt(value) || 0;
    setBulkUpdateData(function (prev) {
      var _a, _b;
      return __assign(
        __assign({}, prev),
        ((_a = {}),
        (_a[spareId] = __assign(
          __assign({}, prev[spareId]),
          ((_b = {}), (_b[field] = numValue), _b)
        )),
        _a)
      );
    });
  };
  // Save bulk updates
  var saveBulkUpdates = function () {
    // In a real application, this would update the backend
    // For now, we'll just close the modal
    console.log('Bulk updates saved:', bulkUpdateData);
    setIsBulkUpdateModalOpen(false);
    setBulkUpdateData({});
  };
  var renderComponentTree = function (nodes, level) {
    if (level === void 0) {
      level = 0;
    }
    return nodes.map(function (node) {
      var hasChildren = node.children && node.children.length > 0;
      var isExpanded = expandedNodes.has(node.id);
      var isSelected = selectedComponentId === node.id;
      return (
        <div key={node.id}>
          <div
            className={'flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 '.concat(
              isSelected ? 'bg-[#52baf3] text-white' : ''
            )}
            style={{ paddingLeft: ''.concat(level * 20 + 12, 'px') }}
            onClick={function () {
              return selectComponent(node.id);
            }}
          >
            <button
              className='mr-2 flex-shrink-0'
              onClick={function (e) {
                e.stopPropagation();
                if (hasChildren) {
                  toggleNode(node.id);
                }
              }}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown
                    className={'h-4 w-4 '.concat(
                      isSelected ? 'text-white' : 'text-gray-600'
                    )}
                  />
                ) : (
                  <ChevronRight
                    className={'h-4 w-4 '.concat(
                      isSelected ? 'text-white' : 'text-gray-600'
                    )}
                  />
                )
              ) : (
                <ChevronRight
                  className={'h-4 w-4 '.concat(
                    isSelected ? 'text-white' : 'text-gray-400'
                  )}
                />
              )}
            </button>
            <span
              className={'text-sm '.concat(
                isSelected ? 'text-white' : 'text-gray-700'
              )}
            >
              {node.code}. {node.name}
            </span>
          </div>
          {hasChildren && isExpanded && (
            <div>{renderComponentTree(node.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };
  return (
    <div className='h-full p-6 bg-[#fafafa]'>
      {/* Header */}
      <div className='mb-4'>
        <h1 className='text-2xl font-semibold text-gray-800 mb-4'>
          {activeTab === 'inventory'
            ? 'Spares Inventory'
            : 'Spares - History of Transactions'}
        </h1>

        {/* Navigation Tabs with Buttons */}
        <div className='flex justify-between items-center mb-4'>
          <div className='flex'>
            <button
              className={'px-4 py-2 rounded-l '.concat(
                activeTab === 'inventory'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              )}
              onClick={function () {
                return setActiveTab('inventory');
              }}
            >
              Inventory
            </button>
            <button
              className={'px-4 py-2 rounded-r '.concat(
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              )}
              onClick={function () {
                return setActiveTab('history');
              }}
            >
              History
            </button>
          </div>
          <div className='flex gap-2'>
            <Button
              className='bg-[#52baf3] hover:bg-[#40a8e0] text-white'
              onClick={function () {
                return setIsAddSpareModalOpen(true);
              }}
            >
              + Add Spare
            </Button>
            <Button
              className='bg-green-600 hover:bg-green-700 text-white'
              onClick={openBulkUpdateModal}
            >
              🔄 Bulk Update Spares
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters - Single Row Layout */}
      <div className='flex gap-3 items-center mb-4'>
        <Select>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Vessel' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='vessel1'>Vessel 1</SelectItem>
            <SelectItem value='vessel2'>Vessel 2</SelectItem>
          </SelectContent>
        </Select>

        <div className='relative w-80'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <Input
            placeholder='Search parts or components..'
            value={searchTerm}
            onChange={function (e) {
              return setSearchTerm(e.target.value);
            }}
            className='pl-10'
          />
        </div>

        <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Criticality' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='All'>All</SelectItem>
            <SelectItem value='Critical'>Critical</SelectItem>
            <SelectItem value='Non-Critical'>Non-Critical</SelectItem>
          </SelectContent>
        </Select>

        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='Stock' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='All'>All</SelectItem>
            <SelectItem value='Minimum'>Minimum</SelectItem>
            <SelectItem value='Low'>Low</SelectItem>
            <SelectItem value='OK'>OK</SelectItem>
          </SelectContent>
        </Select>

        <Button className='bg-green-600 hover:bg-green-700 text-white p-2'>
          <FileSpreadsheet className='h-4 w-4' />
        </Button>

        <Button variant='outline' onClick={clearFilters}>
          Clear
        </Button>
      </div>

      {activeTab === 'inventory' ? (
        <div className='flex gap-6 h-[calc(100vh-200px)]'>
          {/* Left Panel - Component Tree */}
          <div className='w-[30%]'>
            <div className='bg-white rounded-lg shadow-sm h-full flex flex-col'>
              <div className='flex-1 overflow-auto'>
                <div className='bg-[#52baf3] text-white px-4 py-2 font-semibold text-sm'>
                  COMPONENTS
                </div>
                <div>{renderComponentTree(componentsTree)}</div>
              </div>
            </div>
          </div>

          {/* Right Panel - Spares Table */}
          <div className='w-[70%]'>
            {/* Spares Table */}
            <div className='bg-white rounded-lg shadow-sm border'>
              {/* Table Header */}
              <div className='bg-[#52baf3] text-white px-4 py-3 rounded-t-lg'>
                <div className='grid grid-cols-9 gap-4 text-sm font-medium'>
                  <div>Part Code</div>
                  <div>Part Name</div>
                  <div>Component</div>
                  <div>Critical</div>
                  <div>ROB</div>
                  <div>Min</div>
                  <div>Stock</div>
                  <div>Location</div>
                  <div>Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className='divide-y divide-gray-200'>
                {filteredSpares.map(function (spare) {
                  var stockStatus = getStockStatus(spare.rob, spare.min);
                  var isCritical =
                    spare.critical === 'Critical' || spare.critical === 'Yes';
                  return (
                    <div key={spare.id} className='px-4 py-3'>
                      <div className='grid grid-cols-9 gap-4 text-sm items-center'>
                        <div className='text-gray-900'>{spare.partCode}</div>
                        <div className='text-gray-900'>{spare.partName}</div>
                        <div className='text-gray-700'>{spare.component}</div>
                        <div>
                          {isCritical && (
                            <span className='bg-red-100 text-red-800 px-2 py-1 rounded text-xs'>
                              Critical
                            </span>
                          )}
                        </div>
                        <div className='text-gray-700'>{spare.rob}</div>
                        <div className='text-gray-700'>{spare.min}</div>
                        <div>
                          {stockStatus === 'Low' && (
                            <span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs'>
                              Low
                            </span>
                          )}
                          {stockStatus === 'OK' && (
                            <span className='bg-green-100 text-green-800 px-2 py-1 rounded text-xs'>
                              OK
                            </span>
                          )}
                        </div>
                        <div className='text-gray-700'>{spare.location}</div>
                        <div className='flex gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                          >
                            <Plus className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // History View
        <div className='flex gap-6 h-[calc(100vh-200px)]'>
          {/* Left Panel - Component Tree */}
          <div className='w-[30%]'>
            <div className='bg-white rounded-lg shadow-sm h-full flex flex-col'>
              <div className='flex-1 overflow-auto'>
                <div className='bg-[#52baf3] text-white px-4 py-2 font-semibold text-sm'>
                  COMPONENTS
                </div>
                <div>{renderComponentTree(componentsTree)}</div>
              </div>
            </div>
          </div>

          {/* Right Panel - History Table */}
          <div className='w-[70%]'>
            {/* History Table */}
            <div className='bg-white rounded-lg shadow-sm border'>
              {/* Table Header */}
              <div className='bg-[#52baf3] text-white px-4 py-3 rounded-t-lg'>
                <div className='grid grid-cols-6 gap-4 text-sm font-medium'>
                  <div>Date</div>
                  <div>Part Name</div>
                  <div>Type</div>
                  <div>Qty</div>
                  <div>Reference</div>
                  <div>Comment</div>
                </div>
              </div>

              {/* Table Body */}
              <div className='divide-y divide-gray-200'>
                {historyData.map(function (entry) {
                  return (
                    <div key={entry.id} className='px-4 py-3'>
                      <div className='grid grid-cols-6 gap-4 text-sm items-center'>
                        <div className='text-gray-900'>{entry.date}</div>
                        <div className='text-gray-900'>{entry.partName}</div>
                        <div>
                          <span
                            className={'px-2 py-1 rounded text-xs '.concat(
                              entry.type === 'Consumed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            )}
                          >
                            {entry.type}
                          </span>
                        </div>
                        <div className='text-gray-700'>{entry.qty}</div>
                        <div className='text-gray-700'>{entry.reference}</div>
                        <div className='text-gray-700'>{entry.comment}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Spares Modal */}
      {isAddSpareModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-[95%] max-w-7xl max-h-[90vh] overflow-auto'>
            {/* Modal Header */}
            <div className='flex justify-between items-center p-4 border-b'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Add Spares
              </h2>
              <Button
                variant='ghost'
                size='sm'
                onClick={function () {
                  return setIsAddSpareModalOpen(false);
                }}
                className='h-8 w-8 p-0 ml-[90px] mr-[90px]'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>

            {/* Modal Body */}
            <div className='p-6'>
              {/* Add Spare Button */}
              <div className='flex justify-end mb-4'>
                <Button className='bg-[#52baf3] hover:bg-[#40a8e0] text-white text-sm'>
                  + Add Spare
                </Button>
              </div>

              {/* Table Headers */}
              <div className='grid grid-cols-12 gap-3 bg-gray-50 p-3 rounded-t text-sm font-medium text-gray-600 border'>
                <div className='col-span-2'>Part Code</div>
                <div className='col-span-2'>Part Name</div>
                <div className='col-span-3'>Linked Component</div>
                <div className='col-span-1'>Qty</div>
                <div className='col-span-1'>Min Qty</div>
                <div className='col-span-1'>Critical</div>
                <div className='col-span-2'>Location</div>
              </div>

              {/* Form Rows */}
              <div className='border border-t-0 rounded-b'>
                {/* Row 1 */}
                <div className='grid grid-cols-12 gap-3 p-3 border-b bg-white items-center'>
                  <div className='col-span-2'>
                    <Input placeholder='SP-ME-001' className='text-sm' />
                  </div>
                  <div className='col-span-2'>
                    <Input placeholder='Fuel Injector' className='text-sm' />
                  </div>
                  <div className='col-span-3'>
                    <Select>
                      <SelectTrigger className='text-sm'>
                        <SelectValue placeholder='Search Component' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='component1'>
                          Main Engine #1
                        </SelectItem>
                        <SelectItem value='component2'>
                          Main Engine #2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input placeholder='1' className='text-sm' />
                  <Input placeholder='1' className='text-sm' />
                  <Select>
                    <SelectTrigger className='text-sm'>
                      <SelectValue placeholder='Y' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Y'>Y</SelectItem>
                      <SelectItem value='N'>N</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className='col-span-2 flex items-center gap-2'>
                    <Input
                      placeholder='Store Room A'
                      className='text-sm flex-1'
                    />
                    <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                      <Edit className='h-3 w-3' />
                    </Button>
                    <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                </div>

                {/* Row 2 - Empty */}
                <div className='grid grid-cols-12 gap-3 p-3 border-b bg-white items-center'>
                  <div className='col-span-2'>
                    <Input className='text-sm' />
                  </div>
                  <div className='col-span-2'>
                    <Input className='text-sm' />
                  </div>
                  <div className='col-span-3'>
                    <Select>
                      <SelectTrigger className='text-sm'>
                        <SelectValue placeholder='Search Component' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='component1'>
                          Main Engine #1
                        </SelectItem>
                        <SelectItem value='component2'>
                          Main Engine #2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input className='text-sm' />
                  <Input className='text-sm' />
                  <Select>
                    <SelectTrigger className='text-sm'>
                      <SelectValue placeholder='Y' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Y'>Y</SelectItem>
                      <SelectItem value='N'>N</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className='col-span-2 flex items-center gap-2'>
                    <Input className='text-sm flex-1' />
                    <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                      <Edit className='h-3 w-3' />
                    </Button>
                    <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                </div>

                {/* Row 3 - Empty */}
                <div className='grid grid-cols-12 gap-3 p-3 bg-white items-center'>
                  <div className='col-span-2'>
                    <Input className='text-sm' />
                  </div>
                  <div className='col-span-2'>
                    <Input className='text-sm' />
                  </div>
                  <div className='col-span-3'>
                    <Select>
                      <SelectTrigger className='text-sm'>
                        <SelectValue placeholder='Search Component' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='component1'>
                          Main Engine #1
                        </SelectItem>
                        <SelectItem value='component2'>
                          Main Engine #2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input className='text-sm' />
                  <Input className='text-sm' />
                  <Select>
                    <SelectTrigger className='text-sm'>
                      <SelectValue placeholder='Y' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Y'>Y</SelectItem>
                      <SelectItem value='N'>N</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className='col-span-2 flex items-center gap-2'>
                    <Input className='text-sm flex-1' />
                    <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                      <Edit className='h-3 w-3' />
                    </Button>
                    <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className='flex justify-end gap-3 p-4 border-t bg-gray-50'>
              <Button
                variant='outline'
                onClick={function () {
                  return setIsAddSpareModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button className='bg-[#52baf3] hover:bg-[#40a8e0] text-white'>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Spares Modal */}
      {isBulkUpdateModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-[95%] max-w-7xl max-h-[90vh] overflow-auto'>
            {/* Modal Header */}
            <div className='flex justify-between items-center p-4 border-b'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Bulk Update Spares
              </h2>
              <Button
                variant='ghost'
                size='sm'
                onClick={function () {
                  return setIsBulkUpdateModalOpen(false);
                }}
                className='h-8 w-8 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>

            {/* Modal Body */}
            <div className='p-6'>
              {/* Place Received and Date Fields */}
              <div className='grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded border'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Place Received
                  </label>
                  <Input
                    placeholder='Enter place received'
                    value={placeReceived}
                    onChange={function (e) {
                      return setPlaceReceived(e.target.value);
                    }}
                    className='text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Date
                  </label>
                  <div className='relative'>
                    <Input
                      type='date'
                      value={dateReceived}
                      onChange={function (e) {
                        return setDateReceived(e.target.value);
                      }}
                      className='text-sm pr-10'
                    />
                    <Calendar className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                  </div>
                </div>
              </div>

              {/* Table Headers */}
              <div className='grid grid-cols-8 gap-3 bg-gray-50 p-3 rounded-t text-sm font-medium text-gray-600 border'>
                <div>Part Code</div>
                <div>Part Name</div>
                <div>Component</div>
                <div>ROB</div>
                <div>Consumed</div>
                <div>Received</div>
                <div>New ROB</div>
                <div>Comments</div>
              </div>

              {/* Table Body */}
              <div className='border border-t-0 rounded-b max-h-[400px] overflow-y-auto'>
                {filteredSpares.map(function (spare) {
                  var _a, _b;
                  var consumed =
                    ((_a = bulkUpdateData[spare.id]) === null || _a === void 0
                      ? void 0
                      : _a.consumed) || 0;
                  var received =
                    ((_b = bulkUpdateData[spare.id]) === null || _b === void 0
                      ? void 0
                      : _b.received) || 0;
                  var newRob = spare.rob - consumed + received;
                  return (
                    <div
                      key={spare.id}
                      className='grid grid-cols-8 gap-3 p-3 border-b bg-white items-center'
                    >
                      <div className='text-gray-900 text-sm'>
                        {spare.partCode}
                      </div>
                      <div className='text-gray-900 text-sm'>
                        {spare.partName}
                      </div>
                      <div className='text-gray-700 text-sm'>
                        {spare.component}
                      </div>
                      <div className='text-gray-700 text-sm'>{spare.rob}</div>
                      <div>
                        <Input
                          type='number'
                          min='0'
                          className='text-sm h-8'
                          placeholder='0'
                          value={consumed || ''}
                          onChange={function (e) {
                            return handleBulkUpdateChange(
                              spare.id,
                              'consumed',
                              e.target.value
                            );
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          type='number'
                          min='0'
                          className='text-sm h-8'
                          placeholder='0'
                          value={received || ''}
                          onChange={function (e) {
                            return handleBulkUpdateChange(
                              spare.id,
                              'received',
                              e.target.value
                            );
                          }}
                        />
                      </div>
                      <div
                        className={'text-sm font-medium '.concat(
                          newRob < spare.min ? 'text-red-600' : 'text-gray-900'
                        )}
                      >
                        {newRob}
                      </div>
                      <div className='flex justify-center'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                          onClick={function () {
                            var comment = prompt(
                              'Add comment for '.concat(spare.partName, ':')
                            );
                            if (comment) {
                              console.log(
                                'Comment for '
                                  .concat(spare.partName, ': ')
                                  .concat(comment)
                              );
                            }
                          }}
                        >
                          <MessageSquare className='h-4 w-4 text-gray-500' />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className='flex justify-end gap-3 p-4 border-t bg-gray-50'>
              <Button
                variant='outline'
                onClick={function () {
                  return setIsBulkUpdateModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className='bg-green-600 hover:bg-green-700 text-white'
                onClick={saveBulkUpdates}
              >
                Save Updates
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Spares;
//# sourceMappingURL=Spares.jsx.map
