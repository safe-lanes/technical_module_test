import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronRight, ChevronDown, Edit, Trash2, Plus, FileSpreadsheet, X, Minus } from "lucide-react";
import { ComponentNode, componentTree } from "@/data/componentTree";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Spare {
  id: number;
  partCode: string;
  partName: string;
  componentId: string;
  componentCode?: string;
  componentName: string;
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
  eventType: string;
  qtyChange: number;
  robAfter: number;
  userId: string;
  remarks?: string;
  reference?: string;
}

const Spares: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"inventory" | "history">("inventory");
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["6", "6.1", "6.1.1"]));
  const [searchTerm, setSearchTerm] = useState("");
  const [criticalityFilter, setCriticalityFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [vesselId, setVesselId] = useState("V001");
  
  // Dialog states
  const [isAddSpareModalOpen, setIsAddSpareModalOpen] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [isConsumeModalOpen, setIsConsumeModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedSpare, setSelectedSpare] = useState<Spare | null>(null);
  
  // Form states
  const [consumeForm, setConsumeForm] = useState({ quantity: "", date: "", workOrder: "", remarks: "" });
  const [receiveForm, setReceiveForm] = useState({ quantity: "", date: "", supplier: "", remarks: "" });
  const [bulkUpdateData, setBulkUpdateData] = useState<{[key: number]: {consumed: number, received: number}}>({});
  
  const { toast } = useToast();

  // Fetch spares data
  const { data: sparesData = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/spares', vesselId],
    queryFn: async () => {
      const response = await fetch(`/api/spares/${vesselId}`);
      if (!response.ok) throw new Error('Failed to fetch spares');
      return response.json();
    }
  });

  // Fetch history data
  const { data: historyData = [] } = useQuery({
    queryKey: ['/api/spares/history', vesselId],
    queryFn: async () => {
      const response = await fetch(`/api/spares/history/${vesselId}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      return response.json();
    },
    enabled: activeTab === 'history'
  });

  // Consume spare mutation
  const consumeSpareMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number, quantity: number, remarks?: string, reference?: string }) => {
      return apiRequest(`/api/spares/${id}/consume`, 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spares'] });
      queryClient.invalidateQueries({ queryKey: ['/api/spares/history'] });
      toast({ title: "Success", description: "Spare consumed successfully" });
      setIsConsumeModalOpen(false);
      setConsumeForm({ quantity: "", date: "", workOrder: "", remarks: "" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to consume spare",
        variant: "destructive"
      });
    }
  });

  // Receive spare mutation
  const receiveSpareMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number, quantity: number, remarks?: string, reference?: string }) => {
      return apiRequest(`/api/spares/${id}/receive`, 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spares'] });
      queryClient.invalidateQueries({ queryKey: ['/api/spares/history'] });
      toast({ title: "Success", description: "Spare received successfully" });
      setIsReceiveModalOpen(false);
      setReceiveForm({ quantity: "", date: "", supplier: "", remarks: "" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to receive spare",
        variant: "destructive"
      });
    }
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async (data: { updates: Array<{id: number, consumed?: number, received?: number}>, remarks?: string }) => {
      return apiRequest('/api/spares/bulk-update', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spares'] });
      queryClient.invalidateQueries({ queryKey: ['/api/spares/history'] });
      toast({ title: "Success", description: "Bulk update completed successfully" });
      setIsBulkUpdateModalOpen(false);
      setBulkUpdateData({});
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to perform bulk update",
        variant: "destructive"
      });
    }
  });

  // Helper function to check if a component matches selection (including children)
  const isComponentMatch = (spare: Spare, selectedId: string): boolean => {
    if (spare.componentId === selectedId) return true;
    // Check if spare's componentId starts with selected (hierarchical match)
    return spare.componentId.startsWith(selectedId + '.');
  };

  // Filter spares based on all criteria
  const filteredSpares = useMemo(() => {
    let filtered = sparesData;

    // Filter by selected component (including children)
    if (selectedComponentId) {
      filtered = filtered.filter(spare => isComponentMatch(spare, selectedComponentId));
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(spare => 
        spare.partCode.toLowerCase().includes(search) ||
        spare.partName.toLowerCase().includes(search) ||
        spare.componentName.toLowerCase().includes(search) ||
        spare.componentCode?.toLowerCase().includes(search) ||
        spare.location?.toLowerCase().includes(search)
      );
    }

    // Filter by criticality
    if (criticalityFilter && criticalityFilter !== "All") {
      if (criticalityFilter === "Critical") {
        filtered = filtered.filter(spare => spare.critical === "Critical" || spare.critical === "Yes");
      } else if (criticalityFilter === "Non-critical") {
        filtered = filtered.filter(spare => spare.critical !== "Critical" && spare.critical !== "Yes");
      }
    }

    // Filter by stock status
    if (stockFilter && stockFilter !== "All") {
      filtered = filtered.filter(spare => spare.stockStatus === stockFilter);
    }

    return filtered;
  }, [sparesData, selectedComponentId, searchTerm, criticalityFilter, stockFilter]);

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
    setSearchTerm("");
    setCriticalityFilter("");
    setStockFilter("");
    setSelectedComponentId(null);
  };

  // Open consume modal
  const openConsumeModal = (spare: Spare) => {
    setSelectedSpare(spare);
    setConsumeForm({ 
      quantity: "", 
      date: format(new Date(), 'yyyy-MM-dd'), 
      workOrder: "", 
      remarks: "" 
    });
    setIsConsumeModalOpen(true);
  };

  // Open receive modal
  const openReceiveModal = (spare: Spare) => {
    setSelectedSpare(spare);
    setReceiveForm({ 
      quantity: "", 
      date: format(new Date(), 'yyyy-MM-dd'), 
      supplier: "", 
      remarks: "" 
    });
    setIsReceiveModalOpen(true);
  };

  // Handle consume submit
  const handleConsumeSubmit = () => {
    if (!selectedSpare || !consumeForm.quantity) return;
    
    const quantity = parseInt(consumeForm.quantity);
    if (quantity <= 0) {
      toast({ title: "Error", description: "Quantity must be greater than 0", variant: "destructive" });
      return;
    }
    
    if (quantity > selectedSpare.rob) {
      toast({ title: "Error", description: "Insufficient stock", variant: "destructive" });
      return;
    }
    
    consumeSpareMutation.mutate({
      id: selectedSpare.id,
      quantity,
      remarks: consumeForm.remarks || undefined,
      reference: consumeForm.workOrder || undefined
    });
  };

  // Handle receive submit
  const handleReceiveSubmit = () => {
    if (!selectedSpare || !receiveForm.quantity) return;
    
    const quantity = parseInt(receiveForm.quantity);
    if (quantity <= 0) {
      toast({ title: "Error", description: "Quantity must be greater than 0", variant: "destructive" });
      return;
    }
    
    receiveSpareMutation.mutate({
      id: selectedSpare.id,
      quantity,
      remarks: receiveForm.remarks || undefined,
      reference: receiveForm.supplier || undefined
    });
  };

  // Handle bulk update modal
  const openBulkUpdateModal = () => {
    if (filteredSpares.length === 0) {
      toast({ title: "Info", description: "No spares to update. Please adjust filters.", variant: "default" });
      return;
    }
    setIsBulkUpdateModalOpen(true);
    // Initialize bulk update data
    const initialData: {[key: number]: {consumed: number, received: number}} = {};
    filteredSpares.forEach(spare => {
      initialData[spare.id] = { consumed: 0, received: 0 };
    });
    setBulkUpdateData(initialData);
  };

  // Handle bulk update input changes
  const handleBulkUpdateChange = (spareId: number, field: 'consumed' | 'received', value: string) => {
    const numValue = parseInt(value) || 0;
    setBulkUpdateData(prev => ({
      ...prev,
      [spareId]: {
        ...prev[spareId],
        [field]: numValue
      }
    }));
  };

  // Save bulk updates
  const saveBulkUpdates = () => {
    const updates = Object.entries(bulkUpdateData)
      .filter(([_, data]) => data.consumed > 0 || data.received > 0)
      .map(([id, data]) => ({
        id: parseInt(id),
        consumed: data.consumed > 0 ? data.consumed : undefined,
        received: data.received > 0 ? data.received : undefined
      }));
    
    if (updates.length === 0) {
      toast({ title: "Info", description: "No changes to save", variant: "default" });
      return;
    }
    
    bulkUpdateMutation.mutate({ updates });
  };

  // Render component tree
  const renderComponentTree = (nodes: ComponentNode[], level: number = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedComponentId === node.id;

      return (
        <div key={node.id}>
          <div
            className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
              isSelected ? "bg-[#52baf3] text-white" : ""
            }`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => selectComponent(node.id)}
          >
            <button
              className="mr-2 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                if (hasChildren) {
                  toggleNode(node.id);
                }
              }}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-600"}`} />
                ) : (
                  <ChevronRight className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-600"}`} />
                )
              ) : (
                <span className="w-4" />
              )}
            </button>
            <span className={`text-sm ${isSelected ? "text-white" : "text-gray-700"}`}>
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
    <div className="h-full p-6 bg-[#fafafa]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {activeTab === 'inventory' ? 'Spares Inventory' : 'Spares - History of Transactions'}
        </h1>
        
        {/* Navigation Tabs with Buttons */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex">
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
          <div className="flex gap-2">
            <Button className="bg-[#52baf3] hover:bg-[#40a8e0] text-white" onClick={() => setIsAddSpareModalOpen(true)}>
              + Add Spare
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openBulkUpdateModal}>
              🔄 Bulk Update Spares
            </Button>
          </div>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="flex gap-3 items-center mb-4">
        <Select value={vesselId} onValueChange={setVesselId}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Vessel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="V001">Vessel 1</SelectItem>
            <SelectItem value="V002">Vessel 2</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search parts or components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Criticality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="Non-critical">Non-critical</SelectItem>
          </SelectContent>
        </Select>

        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="OK">OK</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline"
          onClick={clearFilters}
          className="text-gray-600"
        >
          Clear
        </Button>
      </div>
      {/* Main Content */}
      <div className="flex gap-4 h-[calc(100%-180px)]">
        {/* Left Panel - Component Tree */}
        <div className="w-80 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="text-white px-4 py-2 font-semibold bg-[#52baf3]">
            COMPONENT SEARCH
          </div>
          <div className="overflow-y-auto h-[calc(100%-40px)]">
            {renderComponentTree(componentTree)}
          </div>
        </div>

        {/* Right Panel - Table */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
          {activeTab === 'inventory' ? (
            <>
              {/* Inventory Table Header */}
              <div className="px-4 py-3 border-b border-gray-200 bg-[#52baf3]">
                <div className="grid grid-cols-9 gap-4 text-sm font-semibold text-gray-700">
                  <div>Part Code</div>
                  <div>Part Name</div>
                  <div>Component</div>
                  <div>Critical</div>
                  <div className="text-center">ROB</div>
                  <div className="text-center">Min</div>
                  <div className="text-center">Stock</div>
                  <div>Location</div>
                  <div className="text-center">Actions</div>
                </div>
              </div>

              {/* Inventory Table Body */}
              <div className="overflow-y-auto h-[calc(100%-48px)]">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : filteredSpares.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No spares found. Try adjusting your filters.
                  </div>
                ) : (
                  filteredSpares.map((spare) => (
                    <div key={spare.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                      <div className="grid grid-cols-9 gap-4 text-sm items-center">
                        <div className="text-gray-900">{spare.partCode}</div>
                        <div className="text-gray-700">{spare.partName}</div>
                        <div className="text-gray-700">{spare.componentName}</div>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            spare.critical === 'Critical' || spare.critical === 'Yes' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {spare.critical}
                          </span>
                        </div>
                        <div className="text-center">{spare.rob}</div>
                        <div className="text-center">{spare.min}</div>
                        <div className="text-center">
                          {spare.stockStatus && (
                            <span className={`px-2 py-1 rounded text-xs ${
                              spare.stockStatus === 'Low' 
                                ? 'bg-red-100 text-red-800' 
                                : spare.stockStatus === 'OK'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {spare.stockStatus}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-700">{spare.location || '-'}</div>
                        <div className="flex gap-1 justify-center">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {}}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => openConsumeModal(spare)}
                            title="Consume"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => openReceiveModal(spare)}
                            title="Receive"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {}}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
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
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="grid grid-cols-8 gap-4 text-sm font-semibold text-gray-700">
                  <div>Date/Time</div>
                  <div>Part Code</div>
                  <div>Part Name</div>
                  <div>Component</div>
                  <div>Event</div>
                  <div className="text-center">Qty Change</div>
                  <div className="text-center">ROB After</div>
                  <div>Reference</div>
                </div>
              </div>

              {/* History Table Body */}
              <div className="overflow-y-auto h-[calc(100%-48px)]">
                {historyData.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No history records found.
                  </div>
                ) : (
                  historyData.map((history: SpareHistory) => (
                    <div key={history.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                      <div className="grid grid-cols-8 gap-4 text-sm items-center">
                        <div className="text-gray-900">
                          {format(new Date(history.timestampUTC), 'dd-MMM-yyyy HH:mm')}
                        </div>
                        <div className="text-gray-700">{history.partCode}</div>
                        <div className="text-gray-700">{history.partName}</div>
                        <div className="text-gray-700">{history.componentName}</div>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            history.eventType === 'CONSUME' 
                              ? 'bg-orange-100 text-orange-800' 
                              : history.eventType === 'RECEIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {history.eventType}
                          </span>
                        </div>
                        <div className={`text-center font-semibold ${
                          history.qtyChange < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {history.qtyChange > 0 ? '+' : ''}{history.qtyChange}
                        </div>
                        <div className="text-center">{history.robAfter}</div>
                        <div className="text-gray-700">{history.reference || '-'}</div>
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
          <div className="space-y-4">
            <div>
              <Label>Part: {selectedSpare?.partCode} - {selectedSpare?.partName}</Label>
              <p className="text-sm text-gray-500">Current ROB: {selectedSpare?.rob}</p>
            </div>
            <div>
              <Label htmlFor="consume-quantity">Quantity *</Label>
              <Input
                id="consume-quantity"
                type="number"
                min="1"
                max={selectedSpare?.rob}
                value={consumeForm.quantity}
                onChange={(e) => setConsumeForm({...consumeForm, quantity: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="consume-date">Date *</Label>
              <Input
                id="consume-date"
                type="date"
                value={consumeForm.date}
                onChange={(e) => setConsumeForm({...consumeForm, date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="consume-wo">Work Order</Label>
              <Input
                id="consume-wo"
                value={consumeForm.workOrder}
                onChange={(e) => setConsumeForm({...consumeForm, workOrder: e.target.value})}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label htmlFor="consume-remarks">Remarks</Label>
              <Input
                id="consume-remarks"
                value={consumeForm.remarks}
                onChange={(e) => setConsumeForm({...consumeForm, remarks: e.target.value})}
                placeholder="Optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConsumeModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConsumeSubmit} disabled={consumeSpareMutation.isPending}>
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
          <div className="space-y-4">
            <div>
              <Label>Part: {selectedSpare?.partCode} - {selectedSpare?.partName}</Label>
              <p className="text-sm text-gray-500">Current ROB: {selectedSpare?.rob}</p>
            </div>
            <div>
              <Label htmlFor="receive-quantity">Quantity *</Label>
              <Input
                id="receive-quantity"
                type="number"
                min="1"
                value={receiveForm.quantity}
                onChange={(e) => setReceiveForm({...receiveForm, quantity: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="receive-date">Date *</Label>
              <Input
                id="receive-date"
                type="date"
                value={receiveForm.date}
                onChange={(e) => setReceiveForm({...receiveForm, date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="receive-supplier">Supplier/PO</Label>
              <Input
                id="receive-supplier"
                value={receiveForm.supplier}
                onChange={(e) => setReceiveForm({...receiveForm, supplier: e.target.value})}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label htmlFor="receive-remarks">Remarks</Label>
              <Input
                id="receive-remarks"
                value={receiveForm.remarks}
                onChange={(e) => setReceiveForm({...receiveForm, remarks: e.target.value})}
                placeholder="Optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReceiveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReceiveSubmit} disabled={receiveSpareMutation.isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Bulk Update Modal */}
      <Dialog open={isBulkUpdateModalOpen} onOpenChange={setIsBulkUpdateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Update Spares</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              Updating {filteredSpares.length} spare(s)
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Part Code</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Part Name</th>
                    <th className="px-4 py-2 text-center text-sm font-medium">ROB</th>
                    <th className="px-4 py-2 text-center text-sm font-medium">Consumed</th>
                    <th className="px-4 py-2 text-center text-sm font-medium">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpares.map((spare) => (
                    <tr key={spare.id} className="border-t">
                      <td className="px-4 py-2 text-sm">{spare.partCode}</td>
                      <td className="px-4 py-2 text-sm">{spare.partName}</td>
                      <td className="px-4 py-2 text-center text-sm">{spare.rob}</td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          min="0"
                          max={spare.rob}
                          value={bulkUpdateData[spare.id]?.consumed || ""}
                          onChange={(e) => handleBulkUpdateChange(spare.id, 'consumed', e.target.value)}
                          className="w-20 mx-auto"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          min="0"
                          value={bulkUpdateData[spare.id]?.received || ""}
                          onChange={(e) => handleBulkUpdateChange(spare.id, 'received', e.target.value)}
                          className="w-20 mx-auto"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveBulkUpdates} disabled={bulkUpdateMutation.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Spares;