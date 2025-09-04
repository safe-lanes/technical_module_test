import React, { useState, useEffect, useMemo } from 'react';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-enterprise';
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
  Clock,
  Trash2,
  Plus,
  FileSpreadsheet,
  X,
  MessageSquare,
  Calendar,
  Minus,
} from 'lucide-react';
import { ComponentNode, componentTree } from '@/data/componentTree';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AgGridTable from '@/components/common/AgGridTable';
import {
  StockStatusCellRenderer,
  CriticalCellRenderer,
  SparesActionsCellRenderer,
  IHMCellRenderer,
} from '@/components/common/AgGridCellRenderers';

// Component tree is now imported from shared data

// Types for API responses
interface Spare {
  id: number;
  partCode: string;
  partName: string;
  componentId: string;
  componentCode?: string;
  componentName?: string;
  componentSpareCode?: string;
  critical: 'Critical' | 'Non-Critical' | 'Yes' | 'No';
  rob: number;
  min: number;
  location: string;
  vesselId: string;
  deleted: boolean;
  stockStatus?: string;
}

interface ConsumeSpareData {
  qty: number;
  userId: string;
  remarks?: string;
  place?: string;
  dateLocal?: string;
  tz?: string;
}

interface ReceiveSpareData {
  qty: number;
  userId: string;
  remarks?: string;
  supplierPO?: string;
  place?: string;
  dateLocal?: string;
  tz?: string;
}

// Static data replaced with API calls
const sparesDataOld = [
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

const historyData = [
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

const Spares: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>(
    'inventory'
  );
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['6', '6.1', '6.1.1'])
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [isAddSpareModalOpen, setIsAddSpareModalOpen] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState<{
    [key: number]: { consumed: number; received: number };
  }>({});
  const [placeReceived, setPlaceReceived] = useState('');
  const [dateReceived, setDateReceived] = useState('');
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedSpare, setSelectedSpare] = useState<Spare | null>(null);
  const [isConsumeModalOpen, setIsConsumeModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [consumeData, setConsumeData] = useState<ConsumeSpareData>({
    qty: 1,
    userId: 'admin',
    remarks: '',
    place: '',
    dateLocal: new Date().toISOString().split('T')[0],
    tz: 'UTC'
  });
  const [receiveData, setReceiveData] = useState<ReceiveSpareData>({
    qty: 1,
    userId: 'admin',
    remarks: '',
    supplierPO: '',
    place: '',
    dateLocal: new Date().toISOString().split('T')[0],
    tz: 'UTC'
  });
  const { toast } = useToast();

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Select component from tree
  const selectComponent = (componentId: string) => {
    setSelectedComponentId(componentId);
  };

  // Calculate stock status
  const getStockStatus = (rob: number, min: number): string => {
    if (rob === min) return 'Minimum';
    if (rob < min) return 'Low';
    if (rob > min) return 'OK';
    return '';
  };

  // API call to fetch spares
  const { data: rawSparesData = [], isLoading, error } = useQuery({
    queryKey: ['/api/spares', 'V001'],
    queryFn: () => apiRequest('/api/spares/V001', 'GET'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add IHM field to spares data for display  
  const sparesData = (rawSparesData as any[]).map(spare => ({
    ...spare,
    ihm: false // Default value for IHM column
  }));

  // Mutations for consume and receive
  const consumeMutation = useMutation({
    mutationFn: ({ spareId, data }: { spareId: number; data: ConsumeSpareData }) => 
      apiRequest(`/api/spares/${spareId}/consume`, 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spares'] });
      setIsConsumeModalOpen(false);
      toast({ title: 'Success', description: 'Spare consumed successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to consume spare',
        variant: 'destructive' 
      });
    }
  });

  const receiveMutation = useMutation({
    mutationFn: ({ spareId, data }: { spareId: number; data: ReceiveSpareData }) => 
      apiRequest(`/api/spares/${spareId}/receive`, 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spares'] });
      setIsReceiveModalOpen(false);
      toast({ title: 'Success', description: 'Spare received successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to receive spare',
        variant: 'destructive' 
      });
    }
  });

  // Filter spares based on all criteria
  const filteredSpares = useMemo(() => {
    if (!Array.isArray(sparesData)) return [];
    let filtered = sparesData;

    // Filter by selected component
    if (selectedComponentId) {
      filtered = filtered.filter(
        spare => spare.componentId === selectedComponentId
      );
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        spare =>
          spare.partCode.toLowerCase().includes(search) ||
          spare.partName.toLowerCase().includes(search) ||
          spare.component.toLowerCase().includes(search)
      );
    }

    // Filter by criticality
    if (criticalityFilter && criticalityFilter !== 'All') {
      if (criticalityFilter === 'Critical') {
        filtered = filtered.filter(
          spare => spare.critical === 'Critical' || spare.critical === 'Yes'
        );
      } else if (criticalityFilter === 'Non-Critical') {
        filtered = filtered.filter(
          spare => spare.critical !== 'Critical' && spare.critical !== 'Yes'
        );
      }
    }

    // Filter by stock status
    if (stockFilter && stockFilter !== 'All') {
      filtered = filtered.filter(spare => {
        const stockStatus = getStockStatus(spare.rob, spare.min);
        return stockStatus === stockFilter;
      });
    }

    return filtered;
  }, [selectedComponentId, searchTerm, criticalityFilter, stockFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCriticalityFilter('');
    setStockFilter('');
    setSelectedComponentId(null);
  };

  // Handle bulk update modal
  const openBulkUpdateModal = () => {
    if (!selectedComponentId) {
      alert(
        'Please select a component from the search or component tree first.'
      );
      return;
    }
    setIsBulkUpdateModalOpen(true);
    // Initialize bulk update data
    const initialData: {
      [key: number]: { consumed: number; received: number };
    } = {};
    if (Array.isArray(filteredSpares)) {
      filteredSpares.forEach(spare => {
        initialData[spare.id] = { consumed: 0, received: 0 };
      });
    }
    setBulkUpdateData(initialData);
  };

  // Handle bulk update input changes
  const handleBulkUpdateChange = (
    spareId: number,
    field: 'consumed' | 'received',
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    setBulkUpdateData(prev => ({
      ...prev,
      [spareId]: {
        ...prev[spareId],
        [field]: numValue,
      },
    }));
  };

  // Save bulk updates
  const saveBulkUpdates = () => {
    // In a real application, this would update the backend
    // For now, we'll just close the modal
    console.log('Bulk updates saved:', bulkUpdateData);
    setIsBulkUpdateModalOpen(false);
    setBulkUpdateData({});
  };

  // Transform spares data to include stock status
  const sparesWithStock = useMemo(() => {
    if (!Array.isArray(filteredSpares)) return [];
    return filteredSpares.map(spare => ({
      ...spare,
      stock: getStockStatus(spare.rob, spare.min),
    }));
  }, [filteredSpares]);

  // AG Grid column definitions
  const columnDefs: ColDef[] = [
      {
        headerName: 'Part Code',
        field: 'partCode',
        width: 140,
        pinned: 'left',
      },
      {
        headerName: 'Part Name',
        field: 'partName',
        width: 180,
        maxWidth: 180,
      },
      {
        headerName: 'Component',
        field: 'component',
        width: 200,
        maxWidth: 200,
      },
      {
        headerName: 'Critical',
        field: 'critical',
        width: 120,
        cellRenderer: CriticalCellRenderer,
      },
      {
        headerName: 'ROB',
        field: 'rob',
        width: 80,
        cellRenderer: params => {
          return <span className='font-medium'>{params.value}</span>;
        },
      },
      {
        headerName: 'Min',
        field: 'min',
        width: 80,
        cellRenderer: params => {
          return <span className='font-medium'>{params.value}</span>;
        },
      },
      {
        headerName: 'Stock',
        field: 'stock',
        width: 100,
        cellRenderer: StockStatusCellRenderer,
      },
      {
        headerName: 'Location',
        field: 'location',
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        resizable: false,
        suppressSizeToFit: true,
        suppressAutoSize: true,
      },
      {
        headerName: 'IHM',
        field: 'ihm',
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        cellRenderer: IHMCellRenderer,
        sortable: false,
        filter: false,
        resizable: false,
        suppressSizeToFit: true,
        suppressAutoSize: true,
        flex: 0,
        cellClass: 'ihm-column',
        pinned: false,
        hide: false,
        lockPosition: true,
      },
      {
        headerName: 'Actions',
        field: 'actions',
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        cellRenderer: SparesActionsCellRenderer,
        sortable: false,
        filter: false,
        pinned: 'right',
        resizable: false,
        suppressSizeToFit: true,
        suppressAutoSize: true,
        flex: 0,
      },
    ];

  // Debug: Log column definitions
  console.log('Column definitions count:', columnDefs.length);
  console.log('Column names:', columnDefs.map(col => col.headerName));

  // Handle modal actions
  const handleConsume = (spare: Spare) => {
    setSelectedSpare(spare);
    setConsumeData({
      qty: 1,
      userId: 'admin',
      remarks: '',
      place: '',
      dateLocal: new Date().toISOString().split('T')[0],
      tz: 'UTC'
    });
    setIsConsumeModalOpen(true);
  };

  const handleReceive = (spare: Spare) => {
    setSelectedSpare(spare);
    setReceiveData({
      qty: 1,
      userId: 'admin',
      remarks: '',
      supplierPO: '',
      place: '',
      dateLocal: new Date().toISOString().split('T')[0],
      tz: 'UTC'
    });
    setIsReceiveModalOpen(true);
  };

  const handleEdit = (spare: Spare) => {
    setSelectedSpare(spare);
    setIsEditModalOpen(true);
  };

  const handleHistory = (spare: Spare) => {
    // Navigate to history view for specific spare
    console.log('View history for spare:', spare.partCode);
  };

  const handleConsumeSubmit = () => {
    if (!selectedSpare) return;
    consumeMutation.mutate({ spareId: selectedSpare.id, data: consumeData });
  };

  const handleReceiveSubmit = () => {
    if (!selectedSpare) return;
    receiveMutation.mutate({ spareId: selectedSpare.id, data: receiveData });
  };

  // AG Grid context for action handlers
  const gridContext = useMemo(
    () => ({
      onConsume: handleConsume,
      onReceive: handleReceive,
      onEdit: handleEdit,
      onHistory: handleHistory,
    }),
    [handleConsume, handleReceive, handleEdit, handleHistory]
  );

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const renderComponentTree = (nodes: ComponentNode[], level: number = 0) => {
    return nodes.map(node => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedComponentId === node.id;

      return (
        <div key={node.id}>
          <div
            className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
              isSelected ? 'bg-[#52baf3] text-white' : ''
            }`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => selectComponent(node.id)}
          >
            <button
              className='mr-2 flex-shrink-0'
              onClick={e => {
                e.stopPropagation();
                if (hasChildren) {
                  toggleNode(node.id);
                }
              }}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown
                    className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-gray-600'}`}
                  />
                ) : (
                  <ChevronRight
                    className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-gray-600'}`}
                  />
                )
              ) : (
                <ChevronRight
                  className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-gray-400'}`}
                />
              )}
            </button>
            <span
              className={`text-sm ${isSelected ? 'text-white' : 'text-gray-700'}`}
            >
              {node.code}. {node.name}
            </span>
          </div>
          {hasChildren && isExpanded && (
            <div>{renderComponentTree(node.children!, level + 1)}</div>
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
              className={`px-4 py-2 rounded-l ${activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory
            </button>
            <button
              className={`px-4 py-2 rounded-r ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>
          <div className='flex gap-2'>
            <Button
              className='bg-[#52baf3] hover:bg-[#40a8e0] text-white'
              onClick={() => setIsAddSpareModalOpen(true)}
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
            onChange={e => setSearchTerm(e.target.value)}
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
                <div>{renderComponentTree(componentTree)}</div>
              </div>
            </div>
          </div>

          {/* Right Panel - Spares Table */}
          <div className='w-[70%]'>
            <div className='bg-white rounded-lg'>
              <AgGridTable
                key={`spares-grid-ihm-${columnDefs.length}`}
                rowData={sparesWithStock}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                context={gridContext}
                height='calc(100vh - 280px)'
                enableExport={true}
                enableSideBar={true}
                enableStatusBar={true}
                pagination={true}
                paginationPageSize={50}
                animateRows={true}
                suppressRowClickSelection={true}
                className='rounded-lg shadow-sm'
                gridOptions={{
                  suppressColumnVirtualisation: true,
                  suppressAutoSize: true,
                  skipHeaderOnAutoSize: true,
                  suppressColumnMoveAnimation: true,
                  suppressMovableColumns: true,
                  suppressHorizontalScroll: false,
                }}
              />
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
                <div>{renderComponentTree(componentTree)}</div>
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
                {historyData.map(entry => (
                  <div key={entry.id} className='px-4 py-3'>
                    <div className='grid grid-cols-6 gap-4 text-sm items-center'>
                      <div className='text-gray-900'>{entry.date}</div>
                      <div className='text-gray-900'>{entry.partName}</div>
                      <div>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            entry.type === 'Consumed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {entry.type}
                        </span>
                      </div>
                      <div className='text-gray-700'>{entry.qty}</div>
                      <div className='text-gray-700'>{entry.reference}</div>
                      <div className='text-gray-700'>{entry.comment}</div>
                    </div>
                  </div>
                ))}
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
                onClick={() => setIsAddSpareModalOpen(false)}
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
                onClick={() => setIsAddSpareModalOpen(false)}
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
                onClick={() => setIsBulkUpdateModalOpen(false)}
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
                    onChange={e => setPlaceReceived(e.target.value)}
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
                      onChange={e => setDateReceived(e.target.value)}
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
                {filteredSpares.map(spare => {
                  const consumed = bulkUpdateData[spare.id]?.consumed || 0;
                  const received = bulkUpdateData[spare.id]?.received || 0;
                  const newRob = spare.rob - consumed + received;

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
                          onChange={e =>
                            handleBulkUpdateChange(
                              spare.id,
                              'consumed',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Input
                          type='number'
                          min='0'
                          className='text-sm h-8'
                          placeholder='0'
                          value={received || ''}
                          onChange={e =>
                            handleBulkUpdateChange(
                              spare.id,
                              'received',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div
                        className={`text-sm font-medium ${newRob < spare.min ? 'text-red-600' : 'text-gray-900'}`}
                      >
                        {newRob}
                      </div>
                      <div className='flex justify-center'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                          onClick={() => {
                            const comment = prompt(
                              `Add comment for ${spare.partName}:`
                            );
                            if (comment) {
                              console.log(
                                `Comment for ${spare.partName}: ${comment}`
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
                onClick={() => setIsBulkUpdateModalOpen(false)}
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

      {/* Consume Modal */}
      <Dialog open={isConsumeModalOpen} onOpenChange={setIsConsumeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Consume Spare - {selectedSpare?.partName}</DialogTitle>
            <DialogDescription>
              Remove inventory from stock when spare is used.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="consume-qty">Quantity to Consume</Label>
              <Input
                id="consume-qty"
                type="number"
                min="1"
                max={selectedSpare?.rob || 0}
                value={consumeData.qty}
                onChange={(e) => setConsumeData({...consumeData, qty: parseInt(e.target.value) || 1})}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">Available: {selectedSpare?.rob}</p>
            </div>
            <div>
              <Label htmlFor="consume-place">Place/Location</Label>
              <Input
                id="consume-place"
                value={consumeData.place}
                onChange={(e) => setConsumeData({...consumeData, place: e.target.value})}
                placeholder="Engine Room, Workshop, etc."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="consume-remarks">Remarks</Label>
              <Input
                id="consume-remarks"
                value={consumeData.remarks}
                onChange={(e) => setConsumeData({...consumeData, remarks: e.target.value})}
                placeholder="Maintenance work, repair, etc."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConsumeModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConsumeSubmit}
              disabled={consumeMutation.isPending || !consumeData.qty || consumeData.qty > (selectedSpare?.rob || 0)}
              className="bg-red-600 hover:bg-red-700"
            >
              {consumeMutation.isPending ? 'Processing...' : 'Consume'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive Modal */}
      <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receive Spare - {selectedSpare?.partName}</DialogTitle>
            <DialogDescription>
              Add inventory to stock when spare is received.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="receive-qty">Quantity to Receive</Label>
              <Input
                id="receive-qty"
                type="number"
                min="1"
                value={receiveData.qty}
                onChange={(e) => setReceiveData({...receiveData, qty: parseInt(e.target.value) || 1})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="receive-place">Place/Location</Label>
              <Input
                id="receive-place"
                value={receiveData.place}
                onChange={(e) => setReceiveData({...receiveData, place: e.target.value})}
                placeholder="Store Room, Warehouse, etc."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="supplier-po">Supplier/PO Number</Label>
              <Input
                id="supplier-po"
                value={receiveData.supplierPO}
                onChange={(e) => setReceiveData({...receiveData, supplierPO: e.target.value})}
                placeholder="PO-2025-001, Supplier name, etc."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="receive-remarks">Remarks</Label>
              <Input
                id="receive-remarks"
                value={receiveData.remarks}
                onChange={(e) => setReceiveData({...receiveData, remarks: e.target.value})}
                placeholder="Delivery details, condition, etc."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReceiveModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReceiveSubmit}
              disabled={receiveMutation.isPending || !receiveData.qty}
              className="bg-green-600 hover:bg-green-700"
            >
              {receiveMutation.isPending ? 'Processing...' : 'Receive'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal - Basic implementation */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Spare - {selectedSpare?.partName}</DialogTitle>
            <DialogDescription>
              Modify spare part details and stock information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">Edit functionality coming soon...</p>
            <div className="space-y-2">
              <p><strong>Part Code:</strong> {selectedSpare?.partCode}</p>
              <p><strong>Current ROB:</strong> {selectedSpare?.rob}</p>
              <p><strong>Min Stock:</strong> {selectedSpare?.min}</p>
              <p><strong>Location:</strong> {selectedSpare?.location}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Spares;
