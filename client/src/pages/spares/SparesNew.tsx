import React, { useState, useMemo, useEffect } from 'react';
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
  Minus,
} from 'lucide-react';
import { ComponentNode, componentTree } from '@/data/componentTree';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Spare {
  id: number;
  partCode: string;
  partName: string;
  componentId: string;
  componentCode?: string;
  componentName: string;
  componentSpareCode?: string;
  critical: string;
  rob: number;
  min: number;
  location?: string;
  vesselId: string;
  stockStatus?: string;
}

interface SpareHistory {
  id: number;
  timestampUTC: string;
  vesselId: string;
  spareId: number;
  partCode: string;
  partName: string;
  componentId: string;
  componentCode?: string;
  componentName: string;
  componentSpareCode?: string;
  eventType: string;
  qtyChange: number;
  robAfter: number;
  userId: string;
  remarks?: string;
  reference?: string;
}

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
  const [vesselId, setVesselId] = useState('V001');

  // Dialog states
  const [isAddSpareModalOpen, setIsAddSpareModalOpen] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [isConsumeModalOpen, setIsConsumeModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedSpare, setSelectedSpare] = useState<Spare | null>(null);

  // Form states
  const [consumeForm, setConsumeForm] = useState({
    quantity: '',
    date: '',
    workOrder: '',
    remarks: '',
  });
  const [receiveForm, setReceiveForm] = useState({
    quantity: '',
    date: '',
    supplier: '',
    remarks: '',
  });
  const [bulkUpdateData, setBulkUpdateData] = useState<{
    [key: number]: {
      consumed: number;
      received: number;
      receivedDate?: string;
      receivedPlace?: string;
    };
  }>({});
  const [addSpareForm, setAddSpareForm] = useState({
    partCode: '',
    partName: '',
    componentId: '',
    critical: 'No',
    rob: '',
    min: '',
    location: '',
  });

  const { toast } = useToast();

  // Fetch spares data
  const {
    data: sparesData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['/api/spares', vesselId],
    queryFn: async () => {
      const response = await fetch(`/api/spares/${vesselId}`);
      if (!response.ok) throw new Error('Failed to fetch spares');
      return response.json();
    },
  });

  // Fetch history data
  const { data: historyData = [] } = useQuery({
    queryKey: ['/api/spares/history', vesselId],
    queryFn: async () => {
      const response = await fetch(`/api/spares/history/${vesselId}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      return response.json();
    },
    enabled: activeTab === 'history',
  });

  // Consume spare mutation
  const consumeSpareMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: number;
      qty: number;
      dateLocal: string;
      tz?: string;
      place?: string;
      remarks?: string;
      userId?: string;
      vesselId: string;
    }) => {
      const response = await fetch(`/api/spares/${id}/consume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to consume spare');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spares'] });
      queryClient.invalidateQueries({ queryKey: ['/api/spares/history'] });
      toast({ title: 'Success', description: 'Spare consumed successfully' });
      setIsConsumeModalOpen(false);
      setConsumeForm({ quantity: '', date: '', workOrder: '', remarks: '' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to consume spare',
        variant: 'destructive',
      });
    },
  });

  // Receive spare mutation
  const receiveSpareMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: number;
      qty: number;
      dateLocal: string;
      tz?: string;
      place?: string;
      supplierPO?: string;
      remarks?: string;
      userId?: string;
      vesselId: string;
    }) => {
      const response = await fetch(`/api/spares/${id}/receive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to receive spare');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spares'] });
      queryClient.invalidateQueries({ queryKey: ['/api/spares/history'] });
      toast({ title: 'Success', description: 'Spare received successfully' });
      setIsReceiveModalOpen(false);
      setReceiveForm({ quantity: '', date: '', supplier: '', remarks: '' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to receive spare',
        variant: 'destructive',
      });
    },
  });

  // Create spare mutation
  const createSpareMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/spares', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spares'] });
      toast({ title: 'Success', description: 'Spare created successfully' });
      setIsAddSpareModalOpen(false);
      setAddSpareForm({
        partCode: '',
        partName: '',
        componentId: '',
        critical: 'No',
        rob: '',
        min: '',
        location: '',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create spare',
        variant: 'destructive',
      });
    },
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async (data: {
      vesselId: string;
      tz: string;
      rows: Array<{
        componentSpareId: number;
        consumed: number;
        received: number;
        receivedDate?: string;
        receivedPlace?: string;
        dateLocal?: string;
        remarks?: string;
        userId: string;
      }>;
    }) => {
      const response = await fetch('/api/spares/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to perform bulk update');
      }

      return response.json();
    },
    onSuccess: results => {
      // Update the spares data with new ROB values
      queryClient.setQueryData(['/api/spares', vesselId], (old: any) => {
        if (!old) return old;
        return old.map((spare: any) => {
          const result = results.find(
            (r: any) => r.componentSpareId === spare.id && r.success
          );
          if (result && result.robAfter !== undefined) {
            return { ...spare, rob: result.robAfter };
          }
          return spare;
        });
      });

      queryClient.invalidateQueries({ queryKey: ['/api/spares/history'] });

      // Count successes, failures, and skipped
      const succeeded = results.filter((r: any) => r.success).length;
      const failed = results.filter((r: any) => !r.success && r.message).length;
      const skipped = results.filter(
        (r: any) => !r.success && !r.message
      ).length;

      toast({
        title: 'Bulk Update Complete',
        description: `Updated: ${succeeded}, Skipped: ${skipped}, Failed: ${failed}`,
      });
      setIsBulkUpdateModalOpen(false);
      setBulkUpdateData({});
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to perform bulk update',
        variant: 'destructive',
      });
    },
  });

  // Helper function to check if a component matches selection (including children)
  const isComponentMatch = (spare: Spare, selectedId: string): boolean => {
    if (spare.componentId === selectedId) return true;
    // Check if spare's componentId starts with selected (hierarchical match)
    return spare.componentId.startsWith(`${selectedId}.`);
  };

  // Filter spares based on all criteria
  const filteredSpares = useMemo(() => {
    let filtered = sparesData;

    // Filter by selected component (including children)
    if (selectedComponentId) {
      filtered = filtered.filter((spare: Spare) =>
        isComponentMatch(spare, selectedComponentId)
      );
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (spare: Spare) =>
          spare.partCode.toLowerCase().includes(search) ||
          spare.partName.toLowerCase().includes(search) ||
          spare.componentName.toLowerCase().includes(search) ||
          spare.componentCode?.toLowerCase().includes(search) ||
          spare.location?.toLowerCase().includes(search)
      );
    }

    // Filter by criticality
    if (criticalityFilter && criticalityFilter !== 'All') {
      if (criticalityFilter === 'Critical') {
        filtered = filtered.filter(
          (spare: Spare) =>
            spare.critical === 'Critical' || spare.critical === 'Yes'
        );
      } else if (criticalityFilter === 'Non-critical') {
        filtered = filtered.filter(
          (spare: Spare) =>
            spare.critical !== 'Critical' && spare.critical !== 'Yes'
        );
      }
    }

    // Filter by stock status
    if (stockFilter && stockFilter !== 'All') {
      filtered = filtered.filter(
        (spare: Spare) => spare.stockStatus === stockFilter
      );
    }

    return filtered;
  }, [
    sparesData,
    selectedComponentId,
    searchTerm,
    criticalityFilter,
    stockFilter,
  ]);

  // Toggle node expansion
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCriticalityFilter('');
    setStockFilter('');
    setSelectedComponentId(null);
  };

  // Open consume modal
  const openConsumeModal = (spare: Spare) => {
    setSelectedSpare(spare);
    setConsumeForm({
      quantity: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      workOrder: '',
      remarks: '',
    });
    setIsConsumeModalOpen(true);
  };

  // Open receive modal
  const openReceiveModal = (spare: Spare) => {
    setSelectedSpare(spare);
    setReceiveForm({
      quantity: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      supplier: '',
      remarks: '',
    });
    setIsReceiveModalOpen(true);
  };

  // Handle consume submit
  const handleConsumeSubmit = () => {
    if (!selectedSpare || !consumeForm.quantity || !consumeForm.date) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const quantity = parseInt(consumeForm.quantity);
    if (quantity <= 0) {
      toast({
        title: 'Error',
        description: 'Quantity must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    if (quantity > selectedSpare.rob) {
      toast({
        title: 'Error',
        description: 'Insufficient stock',
        variant: 'destructive',
      });
      return;
    }

    consumeSpareMutation.mutate({
      id: selectedSpare.id,
      qty: quantity,
      dateLocal: consumeForm.date,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      place: consumeForm.workOrder || undefined,
      remarks: consumeForm.remarks || undefined,
      userId: 'user',
      vesselId,
    });
  };

  // Handle receive submit
  const handleReceiveSubmit = () => {
    if (!selectedSpare || !receiveForm.quantity || !receiveForm.date) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const quantity = parseInt(receiveForm.quantity);
    if (quantity <= 0) {
      toast({
        title: 'Error',
        description: 'Quantity must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    receiveSpareMutation.mutate({
      id: selectedSpare.id,
      qty: quantity,
      dateLocal: receiveForm.date,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      supplierPO: receiveForm.supplier || undefined,
      remarks: receiveForm.remarks || undefined,
      userId: 'user',
      vesselId,
    });
  };

  // Handle bulk update modal
  const openBulkUpdateModal = () => {
    if (filteredSpares.length === 0) {
      toast({
        title: 'Info',
        description: 'No spares to update. Please adjust filters.',
        variant: 'default',
      });
      return;
    }
    setIsBulkUpdateModalOpen(true);
    // Initialize bulk update data
    const initialData: {
      [key: number]: {
        consumed: number;
        received: number;
        receivedDate?: string;
        receivedPlace?: string;
        comments?: string;
      };
    } = {};
    filteredSpares.forEach((spare: Spare) => {
      initialData[spare.id] = { consumed: 0, received: 0 };
    });
    setBulkUpdateData(initialData);
  };

  // Handle bulk update input changes
  const handleBulkUpdateChange = (
    spareId: number,
    field:
      | 'consumed'
      | 'received'
      | 'receivedDate'
      | 'receivedPlace'
      | 'comments',
    value: string | number
  ) => {
    if (field === 'consumed' || field === 'received') {
      const numValue = parseInt(value as string) || 0;
      setBulkUpdateData(prev => ({
        ...prev,
        [spareId]: {
          ...prev[spareId],
          [field]: numValue,
        },
      }));
    } else {
      setBulkUpdateData(prev => ({
        ...prev,
        [spareId]: {
          ...prev[spareId],
          [field]: value as string,
        },
      }));
    }
  };

  // Handle add spare submit
  const handleAddSpareSubmit = () => {
    if (
      !addSpareForm.partCode ||
      !addSpareForm.partName ||
      !addSpareForm.componentId
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const rob = parseInt(addSpareForm.rob) || 0;
    const min = parseInt(addSpareForm.min) || 0;

    // Find the component for getting the name
    const findComponent = (nodes: ComponentNode[]): ComponentNode | null => {
      for (const node of nodes) {
        if (node.id === addSpareForm.componentId) return node;
        if (node.children) {
          const found = findComponent(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const component = findComponent(componentTree);

    createSpareMutation.mutate({
      partCode: addSpareForm.partCode,
      partName: addSpareForm.partName,
      componentId: addSpareForm.componentId,
      componentCode: component?.code || undefined,
      componentName: component?.name || 'Unknown',
      critical: addSpareForm.critical,
      rob,
      min,
      location: addSpareForm.location || undefined,
      vesselId,
    });
  };

  // Save bulk updates
  const saveBulkUpdates = () => {
    // Validate all rows first
    const hasErrors = Object.entries(bulkUpdateData).some(([id, data]) => {
      const spare = sparesData.find((s: Spare) => s.id === parseInt(id));
      if (!spare) return false;

      const newROB = spare.rob - (data.consumed || 0) + (data.received || 0);
      if (newROB < 0) return true;

      // Check if received date is required when receiving
      if (data.received > 0 && !data.receivedDate) return true;

      return false;
    });

    if (hasErrors) {
      toast({
        title: 'Validation Error',
        description: 'Please fix validation errors before saving',
        variant: 'destructive',
      });
      return;
    }

    const rows = Object.entries(bulkUpdateData)
      .filter(([_, data]) => data.consumed > 0 || data.received > 0)
      .map(([id, data]) => ({
        componentSpareId: parseInt(id),
        consumed: data.consumed || 0,
        received: data.received || 0,
        receivedDate: data.received > 0 ? data.receivedDate : undefined,
        receivedPlace: data.receivedPlace || undefined,
        dateLocal:
          data.consumed > 0
            ? new Date().toISOString().split('T')[0]
            : undefined,
        remarks: (data as any).comments || undefined,
        userId: 'user',
      }));

    if (rows.length === 0) {
      toast({
        title: 'Info',
        description: 'No changes to save',
        variant: 'default',
      });
      return;
    }

    bulkUpdateMutation.mutate({
      vesselId,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      rows,
    });
  };

  // Render component tree
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
                <span className='w-4' />
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
      {/* Search and Filters */}
      <div className='flex gap-3 items-center mb-4'>
        <Select value={vesselId} onValueChange={setVesselId}>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Vessel' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='V001'>Vessel 1</SelectItem>
            <SelectItem value='V002'>Vessel 2</SelectItem>
          </SelectContent>
        </Select>

        <div className='relative w-80'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <Input
            placeholder='Search parts or components...'
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
            <SelectItem value='Non-critical'>Non-critical</SelectItem>
          </SelectContent>
        </Select>

        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Stock' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='All'>All</SelectItem>
            <SelectItem value='OK'>OK</SelectItem>
            <SelectItem value='Low'>Low</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant='outline'
          onClick={clearFilters}
          className='text-gray-600'
        >
          Clear
        </Button>
      </div>
      {/* Main Content */}
      <div className='flex gap-4 h-[calc(100%-180px)]'>
        {/* Left Panel - Component Tree */}
        <div className='w-80 bg-white border border-gray-200 rounded-lg overflow-hidden'>
          <div className='text-white px-4 py-2 font-semibold bg-[#52baf3]'>
            COMPONENT SEARCH
          </div>
          <div className='overflow-y-auto h-[calc(100%-40px)]'>
            {renderComponentTree(componentTree)}
          </div>
        </div>

        {/* Right Panel - Table */}
        <div className='flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden'>
          {activeTab === 'inventory' ? (
            <>
              {/* Inventory Table Header */}
              <div className='px-4 py-3 border-b border-gray-200 bg-[#52baf3]'>
                <div className='grid grid-cols-10 gap-4 text-sm font-semibold text-[#ffffff]'>
                  <div className='text-[#ffffff]'>Part Code</div>
                  <div>Part Name</div>
                  <div>Component</div>
                  <div>Spare Code</div>
                  <div>Critical</div>
                  <div className='text-center'>ROB</div>
                  <div className='text-center'>Min</div>
                  <div className='text-center'>Stock</div>
                  <div>Location</div>
                  <div className='text-center'>Actions</div>
                </div>
              </div>

              {/* Inventory Table Body */}
              <div className='overflow-y-auto h-[calc(100%-48px)]'>
                {isLoading ? (
                  <div className='p-8 text-center text-gray-500'>
                    Loading...
                  </div>
                ) : filteredSpares.length === 0 ? (
                  <div className='p-8 text-center text-gray-500'>
                    No spares found. Try adjusting your filters.
                  </div>
                ) : (
                  filteredSpares.map((spare: Spare) => (
                    <div
                      key={spare.id}
                      className='px-4 py-3 border-b border-gray-100 hover:bg-gray-50'
                    >
                      <div className='grid grid-cols-10 gap-4 text-sm items-center'>
                        <div className='text-gray-900'>{spare.partCode}</div>
                        <div className='text-gray-700'>{spare.partName}</div>
                        <div className='text-gray-700'>
                          {spare.componentName}
                        </div>
                        <div className='text-blue-600 font-medium'>
                          {spare.componentSpareCode || '-'}
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              spare.critical === 'Critical' ||
                              spare.critical === 'Yes'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {spare.critical}
                          </span>
                        </div>
                        <div className='text-center'>{spare.rob}</div>
                        <div className='text-center'>{spare.min}</div>
                        <div className='text-center'>
                          {spare.stockStatus && (
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                spare.stockStatus === 'Low'
                                  ? 'bg-red-100 text-red-800'
                                  : spare.stockStatus === 'OK'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {spare.stockStatus}
                            </span>
                          )}
                        </div>
                        <div className='text-gray-700'>
                          {spare.location || '-'}
                        </div>
                        <div className='flex gap-1 justify-center'>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => {}}
                            title='Edit'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => openConsumeModal(spare)}
                            title='Consume'
                          >
                            <Minus className='h-4 w-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => openReceiveModal(spare)}
                            title='Receive'
                          >
                            <Plus className='h-4 w-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => {}}
                            title='Delete'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              {/* History Table Header */}
              <div className='bg-gray-100 px-4 py-3 border-b border-gray-200'>
                <div className='grid grid-cols-9 gap-4 text-sm font-semibold text-gray-700'>
                  <div>Date/Time</div>
                  <div>Part Code</div>
                  <div>Part Name</div>
                  <div>Component</div>
                  <div>Spare Code</div>
                  <div>Event</div>
                  <div className='text-center'>Qty Change</div>
                  <div className='text-center'>ROB After</div>
                  <div>Reference</div>
                </div>
              </div>

              {/* History Table Body */}
              <div className='overflow-y-auto h-[calc(100%-48px)]'>
                {historyData.length === 0 ? (
                  <div className='p-8 text-center text-gray-500'>
                    No history records found.
                  </div>
                ) : (
                  historyData.map((history: SpareHistory) => (
                    <div
                      key={history.id}
                      className='px-4 py-3 border-b border-gray-100 hover:bg-gray-50'
                    >
                      <div className='grid grid-cols-9 gap-4 text-sm items-center'>
                        <div className='text-gray-900'>
                          {format(
                            new Date(history.timestampUTC),
                            'dd-MMM-yyyy HH:mm'
                          )}
                        </div>
                        <div className='text-gray-700'>{history.partCode}</div>
                        <div className='text-gray-700'>{history.partName}</div>
                        <div className='text-gray-700'>
                          {history.componentName}
                        </div>
                        <div className='text-blue-600 font-medium'>
                          {history.componentSpareCode || '-'}
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              history.eventType === 'CONSUME'
                                ? 'bg-orange-100 text-orange-800'
                                : history.eventType === 'RECEIVE'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {history.eventType}
                          </span>
                        </div>
                        <div
                          className={`text-center font-semibold ${
                            history.qtyChange < 0
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {history.qtyChange > 0 ? '+' : ''}
                          {history.qtyChange}
                        </div>
                        <div className='text-center'>{history.robAfter}</div>
                        <div className='text-gray-700'>
                          {history.reference || '-'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Consume Modal */}
      <Dialog open={isConsumeModalOpen} onOpenChange={setIsConsumeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consume Spare</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>
                Part: {selectedSpare?.partCode} - {selectedSpare?.partName}
              </Label>
              <p className='text-sm text-gray-500'>
                Current ROB: {selectedSpare?.rob}
              </p>
            </div>
            <div>
              <Label htmlFor='consume-quantity'>Quantity *</Label>
              <Input
                id='consume-quantity'
                type='number'
                min='1'
                max={selectedSpare?.rob}
                value={consumeForm.quantity}
                onChange={e =>
                  setConsumeForm({ ...consumeForm, quantity: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor='consume-date'>Date *</Label>
              <Input
                id='consume-date'
                type='date'
                value={consumeForm.date}
                onChange={e =>
                  setConsumeForm({ ...consumeForm, date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor='consume-wo'>Work Order</Label>
              <Input
                id='consume-wo'
                value={consumeForm.workOrder}
                onChange={e =>
                  setConsumeForm({ ...consumeForm, workOrder: e.target.value })
                }
                placeholder='Optional'
              />
            </div>
            <div>
              <Label htmlFor='consume-remarks'>Remarks</Label>
              <Input
                id='consume-remarks'
                value={consumeForm.remarks}
                onChange={e =>
                  setConsumeForm({ ...consumeForm, remarks: e.target.value })
                }
                placeholder='Optional'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsConsumeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConsumeSubmit}
              disabled={consumeSpareMutation.isPending}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Receive Modal */}
      <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive Spare</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>
                Part: {selectedSpare?.partCode} - {selectedSpare?.partName}
              </Label>
              <p className='text-sm text-gray-500'>
                Current ROB: {selectedSpare?.rob}
              </p>
            </div>
            <div>
              <Label htmlFor='receive-quantity'>Quantity *</Label>
              <Input
                id='receive-quantity'
                type='number'
                min='1'
                value={receiveForm.quantity}
                onChange={e =>
                  setReceiveForm({ ...receiveForm, quantity: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor='receive-date'>Date *</Label>
              <Input
                id='receive-date'
                type='date'
                value={receiveForm.date}
                onChange={e =>
                  setReceiveForm({ ...receiveForm, date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor='receive-supplier'>Supplier/PO</Label>
              <Input
                id='receive-supplier'
                value={receiveForm.supplier}
                onChange={e =>
                  setReceiveForm({ ...receiveForm, supplier: e.target.value })
                }
                placeholder='Optional'
              />
            </div>
            <div>
              <Label htmlFor='receive-remarks'>Remarks</Label>
              <Input
                id='receive-remarks'
                value={receiveForm.remarks}
                onChange={e =>
                  setReceiveForm({ ...receiveForm, remarks: e.target.value })
                }
                placeholder='Optional'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsReceiveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReceiveSubmit}
              disabled={receiveSpareMutation.isPending}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Bulk Update Modal */}
      <Dialog
        open={isBulkUpdateModalOpen}
        onOpenChange={setIsBulkUpdateModalOpen}
      >
        <DialogContent className='max-w-5xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Bulk Update Spares</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='text-sm text-gray-500'>
              Updating {filteredSpares.length} spare(s)
            </div>

            {/* Common fields for all spares */}
            <div className='grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg'>
              <div>
                <Label htmlFor='bulk-received-date'>
                  Received Date (Apply to all)
                </Label>
                <Input
                  id='bulk-received-date'
                  type='date'
                  onChange={e => {
                    const date = e.target.value;
                    setBulkUpdateData(prev => {
                      const updated = { ...prev };
                      Object.keys(updated).forEach(id => {
                        updated[Number(id)] = {
                          ...updated[Number(id)],
                          receivedDate: date,
                        };
                      });
                      return updated;
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor='bulk-received-place'>
                  Received Place (Apply to all)
                </Label>
                <Input
                  id='bulk-received-place'
                  type='text'
                  placeholder='e.g., Singapore Port'
                  onChange={e => {
                    const place = e.target.value;
                    setBulkUpdateData(prev => {
                      const updated = { ...prev };
                      Object.keys(updated).forEach(id => {
                        updated[Number(id)] = {
                          ...updated[Number(id)],
                          receivedPlace: place,
                        };
                      });
                      return updated;
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor='bulk-comments'>Comments (Apply to all)</Label>
                <Input
                  id='bulk-comments'
                  type='text'
                  placeholder='Enter comments'
                  onChange={e => {
                    const comments = e.target.value;
                    setBulkUpdateData(prev => {
                      const updated = { ...prev };
                      Object.keys(updated).forEach(id => {
                        updated[Number(id)] = {
                          ...updated[Number(id)],
                          // @ts-ignore
                          comments,
                        };
                      });
                      return updated;
                    });
                  }}
                />
              </div>
            </div>

            <div className='border rounded-lg overflow-hidden'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-2 text-left text-sm font-medium'>
                      Part Code
                    </th>
                    <th className='px-4 py-2 text-left text-sm font-medium'>
                      Part Name
                    </th>
                    <th className='px-4 py-2 text-center text-sm font-medium'>
                      ROB
                    </th>
                    <th className='px-4 py-2 text-center text-sm font-medium'>
                      Consumed
                    </th>
                    <th className='px-4 py-2 text-center text-sm font-medium'>
                      Received
                    </th>
                    <th className='px-4 py-2 text-center text-sm font-medium'>
                      New ROB
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpares.map((spare: Spare) => {
                    const consumed = bulkUpdateData[spare.id]?.consumed || 0;
                    const received = bulkUpdateData[spare.id]?.received || 0;
                    const newROB = spare.rob - consumed + received;
                    const hasInsufficientStock = newROB < 0;
                    const needsReceivedDate =
                      received > 0 && !bulkUpdateData[spare.id]?.receivedDate;
                    const hasError = hasInsufficientStock || needsReceivedDate;

                    return (
                      <tr
                        key={spare.id}
                        className={`border-t ${hasError ? 'bg-red-50' : ''}`}
                      >
                        <td className='px-4 py-2 text-sm'>{spare.partCode}</td>
                        <td className='px-4 py-2 text-sm'>{spare.partName}</td>
                        <td className='px-4 py-2 text-center text-sm'>
                          {spare.rob}
                        </td>
                        <td className='px-4 py-2'>
                          <Input
                            type='number'
                            min='0'
                            max={spare.rob}
                            value={bulkUpdateData[spare.id]?.consumed || ''}
                            onChange={e =>
                              handleBulkUpdateChange(
                                spare.id,
                                'consumed',
                                e.target.value
                              )
                            }
                            className={`w-20 mx-auto ${hasInsufficientStock ? 'border-red-500' : ''}`}
                          />
                        </td>
                        <td className='px-4 py-2'>
                          <Input
                            type='number'
                            min='0'
                            value={bulkUpdateData[spare.id]?.received || ''}
                            onChange={e =>
                              handleBulkUpdateChange(
                                spare.id,
                                'received',
                                e.target.value
                              )
                            }
                            className='w-20 mx-auto'
                          />
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <div
                            className={`text-sm font-medium ${hasInsufficientStock ? 'text-red-600' : ''}`}
                          >
                            {newROB}
                            {hasInsufficientStock && (
                              <div className='text-xs text-red-600'>
                                Insufficient stock
                              </div>
                            )}
                            {needsReceivedDate && (
                              <div className='text-xs text-red-600'>
                                Date required
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsBulkUpdateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveBulkUpdates}
              disabled={
                bulkUpdateMutation.isPending ||
                (() => {
                  // Check for validation errors
                  return Object.entries(bulkUpdateData).some(([id, data]) => {
                    const spare = filteredSpares.find(
                      (s: Spare) => s.id === parseInt(id)
                    );
                    if (!spare) return false;
                    const newROB =
                      spare.rob - (data.consumed || 0) + (data.received || 0);
                    if (newROB < 0) return true;
                    if (data.received > 0 && !data.receivedDate) return true;
                    return false;
                  });
                })()
              }
            >
              {bulkUpdateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Spare Modal */}
      <Dialog open={isAddSpareModalOpen} onOpenChange={setIsAddSpareModalOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Add New Spare</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='add-part-code'>Part Code *</Label>
                <Input
                  id='add-part-code'
                  value={addSpareForm.partCode}
                  onChange={e =>
                    setAddSpareForm({
                      ...addSpareForm,
                      partCode: e.target.value,
                    })
                  }
                  placeholder='e.g., SP-ME-001'
                  required
                />
              </div>
              <div>
                <Label htmlFor='add-part-name'>Part Name *</Label>
                <Input
                  id='add-part-name'
                  value={addSpareForm.partName}
                  onChange={e =>
                    setAddSpareForm({
                      ...addSpareForm,
                      partName: e.target.value,
                    })
                  }
                  placeholder='e.g., Fuel Injector'
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor='add-component'>Linked Component *</Label>
              <Select
                value={addSpareForm.componentId}
                onValueChange={value =>
                  setAddSpareForm({ ...addSpareForm, componentId: value })
                }
              >
                <SelectTrigger id='add-component'>
                  <SelectValue placeholder='Select a component' />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const renderOptions = (
                      nodes: ComponentNode[],
                      level = 0
                    ): React.ReactNode[] => {
                      return nodes.flatMap(node => {
                        const options: React.ReactNode[] = [
                          <SelectItem key={node.id} value={node.id}>
                            {'  '.repeat(level)}
                            {node.name}
                          </SelectItem>,
                        ];
                        if (node.children) {
                          options.push(
                            ...renderOptions(node.children, level + 1)
                          );
                        }
                        return options;
                      });
                    };
                    return renderOptions(componentTree);
                  })()}
                </SelectContent>
              </Select>
              {addSpareForm.componentId &&
                (() => {
                  const findComponent = (
                    nodes: ComponentNode[]
                  ): ComponentNode | null => {
                    for (const node of nodes) {
                      if (node.id === addSpareForm.componentId) return node;
                      if (node.children) {
                        const found = findComponent(node.children);
                        if (found) return found;
                      }
                    }
                    return null;
                  };
                  const component = findComponent(componentTree);
                  const spareCode = component ? `SP-${component.code}-XXX` : '';
                  return spareCode ? (
                    <p className='text-sm text-blue-600 mt-1'>
                      Component Spare Code will be: {spareCode}
                    </p>
                  ) : null;
                })()}
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='add-critical'>Critical</Label>
                <Select
                  value={addSpareForm.critical}
                  onValueChange={value =>
                    setAddSpareForm({ ...addSpareForm, critical: value })
                  }
                >
                  <SelectTrigger id='add-critical'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Yes'>Yes</SelectItem>
                    <SelectItem value='No'>No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='add-rob'>ROB (Remain on Board)</Label>
                <Input
                  id='add-rob'
                  type='number'
                  min='0'
                  value={addSpareForm.rob}
                  onChange={e =>
                    setAddSpareForm({ ...addSpareForm, rob: e.target.value })
                  }
                  placeholder='0'
                />
              </div>
              <div>
                <Label htmlFor='add-min'>Minimum Stock</Label>
                <Input
                  id='add-min'
                  type='number'
                  min='0'
                  value={addSpareForm.min}
                  onChange={e =>
                    setAddSpareForm({ ...addSpareForm, min: e.target.value })
                  }
                  placeholder='0'
                />
              </div>
            </div>

            <div>
              <Label htmlFor='add-location'>Location</Label>
              <Input
                id='add-location'
                value={addSpareForm.location}
                onChange={e =>
                  setAddSpareForm({ ...addSpareForm, location: e.target.value })
                }
                placeholder='e.g., Store Room A'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsAddSpareModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSpareSubmit}
              disabled={createSpareMutation.isPending}
            >
              Create Spare
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Spares;
