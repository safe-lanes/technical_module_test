import { __assign, __awaiter, __generator, __rest } from "tslib";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronRight, ChevronDown, Edit, Trash2, Plus, Minus } from "lucide-react";
import { componentTree } from "@/data/componentTree";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
var Spares = function () {
    var _a = useState("inventory"), activeTab = _a[0], setActiveTab = _a[1];
    var _b = useState(null), selectedComponentId = _b[0], setSelectedComponentId = _b[1];
    var _c = useState(new Set(["6", "6.1", "6.1.1"])), expandedNodes = _c[0], setExpandedNodes = _c[1];
    var _d = useState(""), searchTerm = _d[0], setSearchTerm = _d[1];
    var _e = useState(""), criticalityFilter = _e[0], setCriticalityFilter = _e[1];
    var _f = useState(""), stockFilter = _f[0], setStockFilter = _f[1];
    var _g = useState("V001"), vesselId = _g[0], setVesselId = _g[1];
    // Dialog states
    var _h = useState(false), isAddSpareModalOpen = _h[0], setIsAddSpareModalOpen = _h[1];
    var _j = useState(false), isBulkUpdateModalOpen = _j[0], setIsBulkUpdateModalOpen = _j[1];
    var _k = useState(false), isConsumeModalOpen = _k[0], setIsConsumeModalOpen = _k[1];
    var _l = useState(false), isReceiveModalOpen = _l[0], setIsReceiveModalOpen = _l[1];
    var _m = useState(null), selectedSpare = _m[0], setSelectedSpare = _m[1];
    // Form states
    var _o = useState({ quantity: "", date: "", workOrder: "", remarks: "" }), consumeForm = _o[0], setConsumeForm = _o[1];
    var _p = useState({ quantity: "", date: "", supplier: "", remarks: "" }), receiveForm = _p[0], setReceiveForm = _p[1];
    var _q = useState({}), bulkUpdateData = _q[0], setBulkUpdateData = _q[1];
    var _r = useState({
        partCode: "",
        partName: "",
        componentId: "",
        critical: "No",
        rob: "",
        min: "",
        location: ""
    }), addSpareForm = _r[0], setAddSpareForm = _r[1];
    var toast = useToast().toast;
    // Fetch spares data
    var _s = useQuery({
        queryKey: ['/api/spares', vesselId],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/spares/".concat(vesselId))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch spares');
                        return [2 /*return*/, response.json()];
                }
            });
        }); }
    }), _t = _s.data, sparesData = _t === void 0 ? [] : _t, isLoading = _s.isLoading, refetch = _s.refetch;
    // Fetch history data
    var _u = useQuery({
        queryKey: ['/api/spares/history', vesselId],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/spares/history/".concat(vesselId))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch history');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        enabled: activeTab === 'history'
    }).data, historyData = _u === void 0 ? [] : _u;
    // Consume spare mutation
    var consumeSpareMutation = useMutation({
        mutationFn: function (_a) { return __awaiter(void 0, void 0, void 0, function () {
            var response, error;
            var id = _a.id, data = __rest(_a, ["id"]);
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("/api/spares/".concat(id, "/consume"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        })];
                    case 1:
                        response = _b.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _b.sent();
                        throw new Error(error.error || 'Failed to consume spare');
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/spares'] });
            queryClient.invalidateQueries({ queryKey: ['/api/spares/history'] });
            toast({ title: "Success", description: "Spare consumed successfully" });
            setIsConsumeModalOpen(false);
            setConsumeForm({ quantity: "", date: "", workOrder: "", remarks: "" });
        },
        onError: function (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to consume spare",
                variant: "destructive"
            });
        }
    });
    // Receive spare mutation
    var receiveSpareMutation = useMutation({
        mutationFn: function (_a) { return __awaiter(void 0, void 0, void 0, function () {
            var response, error;
            var id = _a.id, data = __rest(_a, ["id"]);
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("/api/spares/".concat(id, "/receive"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        })];
                    case 1:
                        response = _b.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _b.sent();
                        throw new Error(error.error || 'Failed to receive spare');
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/spares'] });
            queryClient.invalidateQueries({ queryKey: ['/api/spares/history'] });
            toast({ title: "Success", description: "Spare received successfully" });
            setIsReceiveModalOpen(false);
            setReceiveForm({ quantity: "", date: "", supplier: "", remarks: "" });
        },
        onError: function (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to receive spare",
                variant: "destructive"
            });
        }
    });
    // Create spare mutation
    var createSpareMutation = useMutation({
        mutationFn: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, apiRequest('/api/spares', 'POST', data)];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/spares'] });
            toast({ title: "Success", description: "Spare created successfully" });
            setIsAddSpareModalOpen(false);
            setAddSpareForm({
                partCode: "",
                partName: "",
                componentId: "",
                critical: "No",
                rob: "",
                min: "",
                location: ""
            });
        },
        onError: function (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to create spare",
                variant: "destructive"
            });
        }
    });
    // Bulk update mutation
    var bulkUpdateMutation = useMutation({
        mutationFn: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var response, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/spares/bulk-update', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _a.sent();
                        throw new Error(error.error || 'Failed to perform bulk update');
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function (results) {
            // Update the spares data with new ROB values
            queryClient.setQueryData(['/api/spares', vesselId], function (old) {
                if (!old)
                    return old;
                return old.map(function (spare) {
                    var result = results.find(function (r) { return r.componentSpareId === spare.id && r.success; });
                    if (result && result.robAfter !== undefined) {
                        return __assign(__assign({}, spare), { rob: result.robAfter });
                    }
                    return spare;
                });
            });
            queryClient.invalidateQueries({ queryKey: ['/api/spares/history'] });
            // Count successes, failures, and skipped
            var succeeded = results.filter(function (r) { return r.success; }).length;
            var failed = results.filter(function (r) { return !r.success && r.message; }).length;
            var skipped = results.filter(function (r) { return !r.success && !r.message; }).length;
            toast({
                title: "Bulk Update Complete",
                description: "Updated: ".concat(succeeded, ", Skipped: ").concat(skipped, ", Failed: ").concat(failed)
            });
            setIsBulkUpdateModalOpen(false);
            setBulkUpdateData({});
        },
        onError: function (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to perform bulk update",
                variant: "destructive"
            });
        }
    });
    // Helper function to check if a component matches selection (including children)
    var isComponentMatch = function (spare, selectedId) {
        if (spare.componentId === selectedId)
            return true;
        // Check if spare's componentId starts with selected (hierarchical match)
        return spare.componentId.startsWith(selectedId + '.');
    };
    // Filter spares based on all criteria
    var filteredSpares = useMemo(function () {
        var filtered = sparesData;
        // Filter by selected component (including children)
        if (selectedComponentId) {
            filtered = filtered.filter(function (spare) { return isComponentMatch(spare, selectedComponentId); });
        }
        // Filter by search term
        if (searchTerm) {
            var search_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (spare) {
                var _a, _b;
                return spare.partCode.toLowerCase().includes(search_1) ||
                    spare.partName.toLowerCase().includes(search_1) ||
                    spare.componentName.toLowerCase().includes(search_1) ||
                    ((_a = spare.componentCode) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search_1)) ||
                    ((_b = spare.location) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(search_1));
            });
        }
        // Filter by criticality
        if (criticalityFilter && criticalityFilter !== "All") {
            if (criticalityFilter === "Critical") {
                filtered = filtered.filter(function (spare) { return spare.critical === "Critical" || spare.critical === "Yes"; });
            }
            else if (criticalityFilter === "Non-critical") {
                filtered = filtered.filter(function (spare) { return spare.critical !== "Critical" && spare.critical !== "Yes"; });
            }
        }
        // Filter by stock status
        if (stockFilter && stockFilter !== "All") {
            filtered = filtered.filter(function (spare) { return spare.stockStatus === stockFilter; });
        }
        return filtered;
    }, [sparesData, selectedComponentId, searchTerm, criticalityFilter, stockFilter]);
    // Toggle node expansion
    var toggleNode = function (nodeId) {
        setExpandedNodes(function (prev) {
            var newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            }
            else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };
    // Select component from tree
    var selectComponent = function (componentId) {
        setSelectedComponentId(componentId);
    };
    // Clear all filters
    var clearFilters = function () {
        setSearchTerm("");
        setCriticalityFilter("");
        setStockFilter("");
        setSelectedComponentId(null);
    };
    // Open consume modal
    var openConsumeModal = function (spare) {
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
    var openReceiveModal = function (spare) {
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
    var handleConsumeSubmit = function () {
        if (!selectedSpare || !consumeForm.quantity || !consumeForm.date) {
            toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
            return;
        }
        var quantity = parseInt(consumeForm.quantity);
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
            qty: quantity,
            dateLocal: consumeForm.date,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            place: consumeForm.workOrder || undefined,
            remarks: consumeForm.remarks || undefined,
            userId: 'user',
            vesselId: vesselId
        });
    };
    // Handle receive submit
    var handleReceiveSubmit = function () {
        if (!selectedSpare || !receiveForm.quantity || !receiveForm.date) {
            toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
            return;
        }
        var quantity = parseInt(receiveForm.quantity);
        if (quantity <= 0) {
            toast({ title: "Error", description: "Quantity must be greater than 0", variant: "destructive" });
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
            vesselId: vesselId
        });
    };
    // Handle bulk update modal
    var openBulkUpdateModal = function () {
        if (filteredSpares.length === 0) {
            toast({ title: "Info", description: "No spares to update. Please adjust filters.", variant: "default" });
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
        if (field === 'consumed' || field === 'received') {
            var numValue_1 = parseInt(value) || 0;
            setBulkUpdateData(function (prev) {
                var _a, _b;
                return (__assign(__assign({}, prev), (_a = {}, _a[spareId] = __assign(__assign({}, prev[spareId]), (_b = {}, _b[field] = numValue_1, _b)), _a)));
            });
        }
        else {
            setBulkUpdateData(function (prev) {
                var _a, _b;
                return (__assign(__assign({}, prev), (_a = {}, _a[spareId] = __assign(__assign({}, prev[spareId]), (_b = {}, _b[field] = value, _b)), _a)));
            });
        }
    };
    // Handle add spare submit
    var handleAddSpareSubmit = function () {
        if (!addSpareForm.partCode || !addSpareForm.partName || !addSpareForm.componentId) {
            toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
            return;
        }
        var rob = parseInt(addSpareForm.rob) || 0;
        var min = parseInt(addSpareForm.min) || 0;
        // Find the component for getting the name
        var findComponent = function (nodes) {
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                if (node.id === addSpareForm.componentId)
                    return node;
                if (node.children) {
                    var found = findComponent(node.children);
                    if (found)
                        return found;
                }
            }
            return null;
        };
        var component = findComponent(componentTree);
        createSpareMutation.mutate({
            partCode: addSpareForm.partCode,
            partName: addSpareForm.partName,
            componentId: addSpareForm.componentId,
            componentCode: (component === null || component === void 0 ? void 0 : component.code) || undefined,
            componentName: (component === null || component === void 0 ? void 0 : component.name) || "Unknown",
            critical: addSpareForm.critical,
            rob: rob,
            min: min,
            location: addSpareForm.location || undefined,
            vesselId: vesselId
        });
    };
    // Save bulk updates
    var saveBulkUpdates = function () {
        // Validate all rows first
        var hasErrors = Object.entries(bulkUpdateData).some(function (_a) {
            var id = _a[0], data = _a[1];
            var spare = sparesData.find(function (s) { return s.id === parseInt(id); });
            if (!spare)
                return false;
            var newROB = spare.rob - (data.consumed || 0) + (data.received || 0);
            if (newROB < 0)
                return true;
            // Check if received date is required when receiving
            if (data.received > 0 && !data.receivedDate)
                return true;
            return false;
        });
        if (hasErrors) {
            toast({ title: "Validation Error", description: "Please fix validation errors before saving", variant: "destructive" });
            return;
        }
        var rows = Object.entries(bulkUpdateData)
            .filter(function (_a) {
            var _ = _a[0], data = _a[1];
            return data.consumed > 0 || data.received > 0;
        })
            .map(function (_a) {
            var id = _a[0], data = _a[1];
            return ({
                componentSpareId: parseInt(id),
                consumed: data.consumed || 0,
                received: data.received || 0,
                receivedDate: data.received > 0 ? data.receivedDate : undefined,
                receivedPlace: data.receivedPlace || undefined,
                dateLocal: data.consumed > 0 ? new Date().toISOString().split('T')[0] : undefined,
                remarks: data.comments || undefined,
                userId: 'user'
            });
        });
        if (rows.length === 0) {
            toast({ title: "Info", description: "No changes to save", variant: "default" });
            return;
        }
        bulkUpdateMutation.mutate({
            vesselId: vesselId,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            rows: rows
        });
    };
    // Render component tree
    var renderComponentTree = function (nodes, level) {
        if (level === void 0) { level = 0; }
        return nodes.map(function (node) {
            var hasChildren = node.children && node.children.length > 0;
            var isExpanded = expandedNodes.has(node.id);
            var isSelected = selectedComponentId === node.id;
            return (<div key={node.id}>
          <div className={"flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ".concat(isSelected ? "bg-[#52baf3] text-white" : "")} style={{ paddingLeft: "".concat(level * 20 + 12, "px") }} onClick={function () { return selectComponent(node.id); }}>
            <button className="mr-2 flex-shrink-0" onClick={function (e) {
                    e.stopPropagation();
                    if (hasChildren) {
                        toggleNode(node.id);
                    }
                }}>
              {hasChildren ? (isExpanded ? (<ChevronDown className={"h-4 w-4 ".concat(isSelected ? "text-white" : "text-gray-600")}/>) : (<ChevronRight className={"h-4 w-4 ".concat(isSelected ? "text-white" : "text-gray-600")}/>)) : (<span className="w-4"/>)}
            </button>
            <span className={"text-sm ".concat(isSelected ? "text-white" : "text-gray-700")}>
              {node.code}. {node.name}
            </span>
          </div>
          {hasChildren && isExpanded && (<div>{renderComponentTree(node.children, level + 1)}</div>)}
        </div>);
        });
    };
    return (<div className="h-full p-6 bg-[#fafafa]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {activeTab === 'inventory' ? 'Spares Inventory' : 'Spares - History of Transactions'}
        </h1>
        
        {/* Navigation Tabs with Buttons */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex">
            <button className={"px-4 py-2 rounded-l ".concat(activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600')} onClick={function () { return setActiveTab('inventory'); }}>
              Inventory
            </button>
            <button className={"px-4 py-2 rounded-r ".concat(activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600')} onClick={function () { return setActiveTab('history'); }}>
              History
            </button>
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#52baf3] hover:bg-[#40a8e0] text-white" onClick={function () { return setIsAddSpareModalOpen(true); }}>
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
            <SelectValue placeholder="Vessel"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="V001">Vessel 1</SelectItem>
            <SelectItem value="V002">Vessel 2</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
          <Input placeholder="Search parts or components..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="pl-10"/>
        </div>

        <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Criticality"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="Non-critical">Non-critical</SelectItem>
          </SelectContent>
        </Select>

        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Stock"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="OK">OK</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={clearFilters} className="text-gray-600">
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
          {activeTab === 'inventory' ? (<>
              {/* Inventory Table Header */}
              <div className="px-4 py-3 border-b border-gray-200 bg-[#52baf3]">
                <div className="grid grid-cols-10 gap-4 text-sm font-semibold text-[#ffffff]">
                  <div className="text-[#ffffff]">Part Code</div>
                  <div>Part Name</div>
                  <div>Component</div>
                  <div>Spare Code</div>
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
                {isLoading ? (<div className="p-8 text-center text-gray-500">Loading...</div>) : filteredSpares.length === 0 ? (<div className="p-8 text-center text-gray-500">
                    No spares found. Try adjusting your filters.
                  </div>) : (filteredSpares.map(function (spare) { return (<div key={spare.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                      <div className="grid grid-cols-10 gap-4 text-sm items-center">
                        <div className="text-gray-900">{spare.partCode}</div>
                        <div className="text-gray-700">{spare.partName}</div>
                        <div className="text-gray-700">{spare.componentName}</div>
                        <div className="text-blue-600 font-medium">{spare.componentSpareCode || '-'}</div>
                        <div>
                          <span className={"px-2 py-1 rounded text-xs ".concat(spare.critical === 'Critical' || spare.critical === 'Yes'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800')}>
                            {spare.critical}
                          </span>
                        </div>
                        <div className="text-center">{spare.rob}</div>
                        <div className="text-center">{spare.min}</div>
                        <div className="text-center">
                          {spare.stockStatus && (<span className={"px-2 py-1 rounded text-xs ".concat(spare.stockStatus === 'Low'
                        ? 'bg-red-100 text-red-800'
                        : spare.stockStatus === 'OK'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800')}>
                              {spare.stockStatus}
                            </span>)}
                        </div>
                        <div className="text-gray-700">{spare.location || '-'}</div>
                        <div className="flex gap-1 justify-center">
                          <Button size="sm" variant="ghost" onClick={function () { }} title="Edit">
                            <Edit className="h-4 w-4"/>
                          </Button>
                          <Button size="sm" variant="ghost" onClick={function () { return openConsumeModal(spare); }} title="Consume">
                            <Minus className="h-4 w-4"/>
                          </Button>
                          <Button size="sm" variant="ghost" onClick={function () { return openReceiveModal(spare); }} title="Receive">
                            <Plus className="h-4 w-4"/>
                          </Button>
                          <Button size="sm" variant="ghost" onClick={function () { }} title="Delete">
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </div>
                      </div>
                    </div>); }))}
              </div>
            </>) : (<>
              {/* History Table Header */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="grid grid-cols-9 gap-4 text-sm font-semibold text-gray-700">
                  <div>Date/Time</div>
                  <div>Part Code</div>
                  <div>Part Name</div>
                  <div>Component</div>
                  <div>Spare Code</div>
                  <div>Event</div>
                  <div className="text-center">Qty Change</div>
                  <div className="text-center">ROB After</div>
                  <div>Reference</div>
                </div>
              </div>

              {/* History Table Body */}
              <div className="overflow-y-auto h-[calc(100%-48px)]">
                {historyData.length === 0 ? (<div className="p-8 text-center text-gray-500">
                    No history records found.
                  </div>) : (historyData.map(function (history) { return (<div key={history.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                      <div className="grid grid-cols-9 gap-4 text-sm items-center">
                        <div className="text-gray-900">
                          {format(new Date(history.timestampUTC), 'dd-MMM-yyyy HH:mm')}
                        </div>
                        <div className="text-gray-700">{history.partCode}</div>
                        <div className="text-gray-700">{history.partName}</div>
                        <div className="text-gray-700">{history.componentName}</div>
                        <div className="text-blue-600 font-medium">{history.componentSpareCode || '-'}</div>
                        <div>
                          <span className={"px-2 py-1 rounded text-xs ".concat(history.eventType === 'CONSUME'
                    ? 'bg-orange-100 text-orange-800'
                    : history.eventType === 'RECEIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800')}>
                            {history.eventType}
                          </span>
                        </div>
                        <div className={"text-center font-semibold ".concat(history.qtyChange < 0 ? 'text-red-600' : 'text-green-600')}>
                          {history.qtyChange > 0 ? '+' : ''}{history.qtyChange}
                        </div>
                        <div className="text-center">{history.robAfter}</div>
                        <div className="text-gray-700">{history.reference || '-'}</div>
                      </div>
                    </div>); }))}
              </div>
            </>)}
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
              <Label>Part: {selectedSpare === null || selectedSpare === void 0 ? void 0 : selectedSpare.partCode} - {selectedSpare === null || selectedSpare === void 0 ? void 0 : selectedSpare.partName}</Label>
              <p className="text-sm text-gray-500">Current ROB: {selectedSpare === null || selectedSpare === void 0 ? void 0 : selectedSpare.rob}</p>
            </div>
            <div>
              <Label htmlFor="consume-quantity">Quantity *</Label>
              <Input id="consume-quantity" type="number" min="1" max={selectedSpare === null || selectedSpare === void 0 ? void 0 : selectedSpare.rob} value={consumeForm.quantity} onChange={function (e) { return setConsumeForm(__assign(__assign({}, consumeForm), { quantity: e.target.value })); }} required/>
            </div>
            <div>
              <Label htmlFor="consume-date">Date *</Label>
              <Input id="consume-date" type="date" value={consumeForm.date} onChange={function (e) { return setConsumeForm(__assign(__assign({}, consumeForm), { date: e.target.value })); }} required/>
            </div>
            <div>
              <Label htmlFor="consume-wo">Work Order</Label>
              <Input id="consume-wo" value={consumeForm.workOrder} onChange={function (e) { return setConsumeForm(__assign(__assign({}, consumeForm), { workOrder: e.target.value })); }} placeholder="Optional"/>
            </div>
            <div>
              <Label htmlFor="consume-remarks">Remarks</Label>
              <Input id="consume-remarks" value={consumeForm.remarks} onChange={function (e) { return setConsumeForm(__assign(__assign({}, consumeForm), { remarks: e.target.value })); }} placeholder="Optional"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={function () { return setIsConsumeModalOpen(false); }}>
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
              <Label>Part: {selectedSpare === null || selectedSpare === void 0 ? void 0 : selectedSpare.partCode} - {selectedSpare === null || selectedSpare === void 0 ? void 0 : selectedSpare.partName}</Label>
              <p className="text-sm text-gray-500">Current ROB: {selectedSpare === null || selectedSpare === void 0 ? void 0 : selectedSpare.rob}</p>
            </div>
            <div>
              <Label htmlFor="receive-quantity">Quantity *</Label>
              <Input id="receive-quantity" type="number" min="1" value={receiveForm.quantity} onChange={function (e) { return setReceiveForm(__assign(__assign({}, receiveForm), { quantity: e.target.value })); }} required/>
            </div>
            <div>
              <Label htmlFor="receive-date">Date *</Label>
              <Input id="receive-date" type="date" value={receiveForm.date} onChange={function (e) { return setReceiveForm(__assign(__assign({}, receiveForm), { date: e.target.value })); }} required/>
            </div>
            <div>
              <Label htmlFor="receive-supplier">Supplier/PO</Label>
              <Input id="receive-supplier" value={receiveForm.supplier} onChange={function (e) { return setReceiveForm(__assign(__assign({}, receiveForm), { supplier: e.target.value })); }} placeholder="Optional"/>
            </div>
            <div>
              <Label htmlFor="receive-remarks">Remarks</Label>
              <Input id="receive-remarks" value={receiveForm.remarks} onChange={function (e) { return setReceiveForm(__assign(__assign({}, receiveForm), { remarks: e.target.value })); }} placeholder="Optional"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={function () { return setIsReceiveModalOpen(false); }}>
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
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Update Spares</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              Updating {filteredSpares.length} spare(s)
            </div>
            
            {/* Common fields for all spares */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="bulk-received-date">Received Date (Apply to all)</Label>
                <Input id="bulk-received-date" type="date" onChange={function (e) {
            var date = e.target.value;
            setBulkUpdateData(function (prev) {
                var updated = __assign({}, prev);
                Object.keys(updated).forEach(function (id) {
                    updated[Number(id)] = __assign(__assign({}, updated[Number(id)]), { receivedDate: date });
                });
                return updated;
            });
        }}/>
              </div>
              <div>
                <Label htmlFor="bulk-received-place">Received Place (Apply to all)</Label>
                <Input id="bulk-received-place" type="text" placeholder="e.g., Singapore Port" onChange={function (e) {
            var place = e.target.value;
            setBulkUpdateData(function (prev) {
                var updated = __assign({}, prev);
                Object.keys(updated).forEach(function (id) {
                    updated[Number(id)] = __assign(__assign({}, updated[Number(id)]), { receivedPlace: place });
                });
                return updated;
            });
        }}/>
              </div>
              <div>
                <Label htmlFor="bulk-comments">Comments (Apply to all)</Label>
                <Input id="bulk-comments" type="text" placeholder="Enter comments" onChange={function (e) {
            var comments = e.target.value;
            setBulkUpdateData(function (prev) {
                var updated = __assign({}, prev);
                Object.keys(updated).forEach(function (id) {
                    updated[Number(id)] = __assign(__assign({}, updated[Number(id)]), { comments: comments });
                });
                return updated;
            });
        }}/>
              </div>
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
                    <th className="px-4 py-2 text-center text-sm font-medium">New ROB</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpares.map(function (spare) {
            var _a, _b, _c, _d, _e;
            var consumed = ((_a = bulkUpdateData[spare.id]) === null || _a === void 0 ? void 0 : _a.consumed) || 0;
            var received = ((_b = bulkUpdateData[spare.id]) === null || _b === void 0 ? void 0 : _b.received) || 0;
            var newROB = spare.rob - consumed + received;
            var hasInsufficientStock = newROB < 0;
            var needsReceivedDate = received > 0 && !((_c = bulkUpdateData[spare.id]) === null || _c === void 0 ? void 0 : _c.receivedDate);
            var hasError = hasInsufficientStock || needsReceivedDate;
            return (<tr key={spare.id} className={"border-t ".concat(hasError ? 'bg-red-50' : '')}>
                        <td className="px-4 py-2 text-sm">{spare.partCode}</td>
                        <td className="px-4 py-2 text-sm">{spare.partName}</td>
                        <td className="px-4 py-2 text-center text-sm">{spare.rob}</td>
                        <td className="px-4 py-2">
                          <Input type="number" min="0" max={spare.rob} value={((_d = bulkUpdateData[spare.id]) === null || _d === void 0 ? void 0 : _d.consumed) || ""} onChange={function (e) { return handleBulkUpdateChange(spare.id, 'consumed', e.target.value); }} className={"w-20 mx-auto ".concat(hasInsufficientStock ? 'border-red-500' : '')}/>
                        </td>
                        <td className="px-4 py-2">
                          <Input type="number" min="0" value={((_e = bulkUpdateData[spare.id]) === null || _e === void 0 ? void 0 : _e.received) || ""} onChange={function (e) { return handleBulkUpdateChange(spare.id, 'received', e.target.value); }} className="w-20 mx-auto"/>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <div className={"text-sm font-medium ".concat(hasInsufficientStock ? 'text-red-600' : '')}>
                            {newROB}
                            {hasInsufficientStock && (<div className="text-xs text-red-600">Insufficient stock</div>)}
                            {needsReceivedDate && (<div className="text-xs text-red-600">Date required</div>)}
                          </div>
                        </td>
                      </tr>);
        })}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={function () { return setIsBulkUpdateModalOpen(false); }}>
              Cancel
            </Button>
            <Button onClick={saveBulkUpdates} disabled={bulkUpdateMutation.isPending || (function () {
            // Check for validation errors
            return Object.entries(bulkUpdateData).some(function (_a) {
                var id = _a[0], data = _a[1];
                var spare = filteredSpares.find(function (s) { return s.id === parseInt(id); });
                if (!spare)
                    return false;
                var newROB = spare.rob - (data.consumed || 0) + (data.received || 0);
                if (newROB < 0)
                    return true;
                if (data.received > 0 && !data.receivedDate)
                    return true;
                return false;
            });
        })()}>
              {bulkUpdateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Spare Modal */}
      <Dialog open={isAddSpareModalOpen} onOpenChange={setIsAddSpareModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Spare</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-part-code">Part Code *</Label>
                <Input id="add-part-code" value={addSpareForm.partCode} onChange={function (e) { return setAddSpareForm(__assign(__assign({}, addSpareForm), { partCode: e.target.value })); }} placeholder="e.g., SP-ME-001" required/>
              </div>
              <div>
                <Label htmlFor="add-part-name">Part Name *</Label>
                <Input id="add-part-name" value={addSpareForm.partName} onChange={function (e) { return setAddSpareForm(__assign(__assign({}, addSpareForm), { partName: e.target.value })); }} placeholder="e.g., Fuel Injector" required/>
              </div>
            </div>
            
            <div>
              <Label htmlFor="add-component">Linked Component *</Label>
              <Select value={addSpareForm.componentId} onValueChange={function (value) { return setAddSpareForm(__assign(__assign({}, addSpareForm), { componentId: value })); }}>
                <SelectTrigger id="add-component">
                  <SelectValue placeholder="Select a component"/>
                </SelectTrigger>
                <SelectContent>
                  {(function () {
            var renderOptions = function (nodes, level) {
                if (level === void 0) { level = 0; }
                return nodes.flatMap(function (node) {
                    var options = [
                        <SelectItem key={node.id} value={node.id}>
                            {'  '.repeat(level)}{node.name}
                          </SelectItem>
                    ];
                    if (node.children) {
                        options.push.apply(options, renderOptions(node.children, level + 1));
                    }
                    return options;
                });
            };
            return renderOptions(componentTree);
        })()}
                </SelectContent>
              </Select>
              {addSpareForm.componentId && (function () {
            var findComponent = function (nodes) {
                for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
                    var node = nodes_2[_i];
                    if (node.id === addSpareForm.componentId)
                        return node;
                    if (node.children) {
                        var found = findComponent(node.children);
                        if (found)
                            return found;
                    }
                }
                return null;
            };
            var component = findComponent(componentTree);
            var spareCode = component ? "SP-".concat(component.code, "-XXX") : '';
            return spareCode ? (<p className="text-sm text-blue-600 mt-1">
                    Component Spare Code will be: {spareCode}
                  </p>) : null;
        })()}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="add-critical">Critical</Label>
                <Select value={addSpareForm.critical} onValueChange={function (value) { return setAddSpareForm(__assign(__assign({}, addSpareForm), { critical: value })); }}>
                  <SelectTrigger id="add-critical">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="add-rob">ROB (Remain on Board)</Label>
                <Input id="add-rob" type="number" min="0" value={addSpareForm.rob} onChange={function (e) { return setAddSpareForm(__assign(__assign({}, addSpareForm), { rob: e.target.value })); }} placeholder="0"/>
              </div>
              <div>
                <Label htmlFor="add-min">Minimum Stock</Label>
                <Input id="add-min" type="number" min="0" value={addSpareForm.min} onChange={function (e) { return setAddSpareForm(__assign(__assign({}, addSpareForm), { min: e.target.value })); }} placeholder="0"/>
              </div>
            </div>
            
            <div>
              <Label htmlFor="add-location">Location</Label>
              <Input id="add-location" value={addSpareForm.location} onChange={function (e) { return setAddSpareForm(__assign(__assign({}, addSpareForm), { location: e.target.value })); }} placeholder="e.g., Store Room A"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={function () { return setIsAddSpareModalOpen(false); }}>
              Cancel
            </Button>
            <Button onClick={handleAddSpareSubmit} disabled={createSpareMutation.isPending}>
              Create Spare
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);
};
export default Spares;
//# sourceMappingURL=SparesNew.jsx.map