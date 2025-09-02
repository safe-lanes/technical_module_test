import { __awaiter, __generator, __spreadArray } from "tslib";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Package, ClipboardList, Archive, Store } from "lucide-react";
import { ComponentTreeSelector } from "./ComponentTreeSelector";
import { TableSelector } from "./TableSelector";
import { buildComponentTree } from "@/utils/componentUtils";
export function TargetPicker(_a) {
    var _this = this;
    var open = _a.open, onOpenChange = _a.onOpenChange, category = _a.category, vesselId = _a.vesselId, onTargetSelect = _a.onTargetSelect;
    var _b = useState(""), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = useState(null), selectedItem = _c[0], setSelectedItem = _c[1];
    // Fetch data based on category
    var _d = useQuery({
        queryKey: ["/api/".concat(getApiEndpoint(category)), vesselId],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var endpoint, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = getApiEndpoint(category);
                        return [4 /*yield*/, fetch("/api/".concat(endpoint).concat(endpoint === 'components' ? "/".concat(vesselId) : "?vesselId=".concat(vesselId)))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error("Failed to fetch ".concat(category));
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        enabled: open && !!category && !!vesselId
    }), data = _d.data, isLoading = _d.isLoading, error = _d.error;
    function getApiEndpoint(cat) {
        switch (cat) {
            case 'components': return 'components';
            case 'work_orders': return 'work-orders';
            case 'spares': return 'spares';
            case 'stores': return 'stores';
            default: return 'components';
        }
    }
    var handleUseTarget = function () {
        if (!selectedItem)
            return;
        var targetType = category === 'work_orders' ? 'work_order' :
            category === 'stores' ? 'store' :
                category.slice(0, -1); // Remove 's' from components/spares
        var targetDisplay = {
            name: getItemName(selectedItem, category),
            code: getItemCode(selectedItem, category),
            path: category === 'components' ? getComponentPath(selectedItem) : undefined
        };
        var snapshot = createSnapshot(selectedItem, category);
        // Pass the full payload structure as expected by the spec
        var payload = {
            targetType: targetType,
            targetId: getItemId(selectedItem, category),
            targetDisplay: targetDisplay,
            snapshotBeforeJson: snapshot
        };
        onTargetSelect(targetType, payload.targetId, payload);
        onOpenChange(false);
    };
    var getItemId = function (item, cat) {
        if (cat === 'work_orders')
            return item.id || item.woNo;
        if (cat === 'spares')
            return String(item.id || item.partCode);
        if (cat === 'stores')
            return String(item.id || item.itemCode);
        return item.id || item.componentId;
    };
    var getItemName = function (item, cat) {
        if (cat === 'work_orders')
            return item.jobTitle;
        if (cat === 'spares')
            return item.partName;
        if (cat === 'stores')
            return item.itemName;
        return item.name;
    };
    var getItemCode = function (item, cat) {
        if (cat === 'work_orders')
            return item.woNo;
        if (cat === 'spares')
            return item.partCode;
        if (cat === 'stores')
            return item.itemCode;
        return item.code;
    };
    var getComponentPath = function (component) {
        // Build path from component hierarchy  
        var buildPath = function (node, allComponents) {
            var parts = ["".concat(node.componentCode || node.code, " ").concat(node.name)];
            if (node.parentId) {
                var parent_1 = allComponents.find(function (c) { return (c.id || c.componentId) === node.parentId; });
                if (parent_1) {
                    return __spreadArray(__spreadArray([], buildPath(parent_1, allComponents), true), parts, true);
                }
            }
            return parts;
        };
        if (data && Array.isArray(data)) {
            var pathParts = buildPath(component, data);
            return pathParts.join(' > ');
        }
        return "".concat(component.componentCode || component.code, " ").concat(component.name);
    };
    var createSnapshot = function (item, cat) {
        var now = new Date().toISOString();
        var snapshot = {
            capturedAtUtc: now,
            vesselId: vesselId,
            displayKey: getItemCode(item, cat),
            displayName: getItemName(item, cat),
            fields: {}
        };
        if (cat === 'components') {
            snapshot.displayPath = getComponentPath(item);
            snapshot.fields = {
                maker: item.maker || '',
                model: item.model || '',
                serialNo: item.serialNo || '',
                department: item.deptCategory || '',
                componentCategory: item.componentCategory || '',
                location: item.location || '',
                commissionedDate: item.commissionedDate || '',
                critical: item.critical || false,
                classItem: item.classItem || false
            };
        }
        else if (cat === 'work_orders') {
            snapshot.fields = {
                jobTitle: item.jobTitle,
                frequencyType: item.frequencyType || '',
                frequencyValue: item.frequencyValue || '',
                frequencyUnit: item.frequencyUnit || '',
                assignedTo: item.assignedTo || '',
                priority: item.priority || '',
                status: item.status || '',
                dueDate: item.dueDate || ''
            };
        }
        else if (cat === 'spares') {
            snapshot.fields = {
                partCode: item.partCode,
                partName: item.partName,
                linkedComponentName: item.componentName || '',
                linkedComponentCode: item.componentCode || '',
                uom: item.uom || '',
                min: item.min || 0,
                rob: item.rob || 0,
                location: item.location || '',
                critical: item.critical === 'Critical' || item.critical === true
            };
        }
        else if (cat === 'stores') {
            snapshot.fields = {
                itemCode: item.itemCode,
                itemName: item.itemName,
                storesCategory: item.storesCategory || '',
                uom: item.uom || '',
                min: item.min || 0,
                rob: item.rob || 0,
                location: item.location || ''
            };
        }
        return snapshot;
    };
    // Process component data for tree structure
    var componentTree = category === 'components' && data ? buildComponentTree(data) : [];
    var renderPreview = function () {
        if (!selectedItem)
            return <div className="text-center text-gray-500 py-8">Select an item to preview</div>;
        var getIcon = function () {
            switch (category) {
                case 'components': return <Package className="h-5 w-5"/>;
                case 'work_orders': return <ClipboardList className="h-5 w-5"/>;
                case 'spares': return <Archive className="h-5 w-5"/>;
                case 'stores': return <Store className="h-5 w-5"/>;
                default: return null;
            }
        };
        return (<div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          {getIcon()}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {getItemName(selectedItem, category)}
            </h3>
            <p className="text-sm text-gray-600 font-mono">
              {getItemCode(selectedItem, category)}
            </p>
            {category === 'components' && selectedItem && (<p className="text-xs text-gray-500 mt-1">
                {getComponentPath(selectedItem)}
              </p>)}
          </div>
        </div>

        <Separator />

        {/* Fields */}
        <div className="space-y-3">
          {category === 'components' && (<>
              <h4 className="text-sm font-medium">Component Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500">Maker</Label>
                  <p className="text-sm">{selectedItem.maker || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Model</Label>
                  <p className="text-sm">{selectedItem.model || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Serial No</Label>
                  <p className="text-sm">{selectedItem.serialNo || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Department</Label>
                  <p className="text-sm">{selectedItem.deptCategory || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Component Category</Label>
                  <p className="text-sm">{selectedItem.componentCategory || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Location</Label>
                  <p className="text-sm">{selectedItem.location || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Commissioned Date</Label>
                  <p className="text-sm">{selectedItem.commissionedDate || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Critical</Label>
                  <p className="text-sm">{selectedItem.critical ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Class Item</Label>
                  <p className="text-sm">{selectedItem.classItem ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </>)}

          {category === 'work_orders' && (<>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500">WO No</Label>
                  <p className="text-sm font-mono">{selectedItem.woNo}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Job Title</Label>
                  <p className="text-sm">{selectedItem.jobTitle}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-gray-500">Component</Label>
                  <p className="text-sm">{selectedItem.componentName || '-'}</p>
                  {selectedItem.componentCode && (<p className="text-xs text-gray-400">{selectedItem.componentCode}</p>)}
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Frequency Type</Label>
                  <p className="text-sm">{selectedItem.frequencyType || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Frequency Value</Label>
                  <p className="text-sm">
                    {selectedItem.frequencyValue} {selectedItem.frequencyUnit}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Assigned To</Label>
                  <p className="text-sm">{selectedItem.assignedTo || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Priority</Label>
                  <p className="text-sm">{selectedItem.priority || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Status</Label>
                  <p className="text-sm">{selectedItem.status || 'Active'}</p>
                </div>
                {selectedItem.dueDate && (<div>
                    <Label className="text-xs text-gray-500">Due Date</Label>
                    <p className="text-sm">{selectedItem.dueDate}</p>
                  </div>)}
              </div>
            </>)}

          {category === 'spares' && (<>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500">Part Code</Label>
                  <p className="text-sm font-mono">{selectedItem.partCode}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Part Name</Label>
                  <p className="text-sm">{selectedItem.partName}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-gray-500">Linked Component</Label>
                  <p className="text-sm">{selectedItem.componentName || '-'}</p>
                  {selectedItem.componentCode && (<p className="text-xs text-gray-400">{selectedItem.componentCode}</p>)}
                </div>
                <div>
                  <Label className="text-xs text-gray-500">UOM</Label>
                  <p className="text-sm">{selectedItem.uom || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Min</Label>
                  <p className="text-sm">{selectedItem.min}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">ROB</Label>
                  <p className="text-sm">{selectedItem.rob}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Location</Label>
                  <p className="text-sm">{selectedItem.location || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Critical</Label>
                  <p className="text-sm">
                    {selectedItem.critical === 'Critical' || selectedItem.critical === true ? 'Critical' : 'No'}
                  </p>
                </div>
              </div>
            </>)}

          {category === 'stores' && (<>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500">Item Code</Label>
                  <p className="text-sm font-mono">{selectedItem.itemCode}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Item Name</Label>
                  <p className="text-sm">{selectedItem.itemName}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Stores Category</Label>
                  <p className="text-sm">{selectedItem.storesCategory || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">UOM</Label>
                  <p className="text-sm">{selectedItem.uom || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Min</Label>
                  <p className="text-sm">{selectedItem.min}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">ROB</Label>
                  <p className="text-sm">{selectedItem.rob}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-gray-500">Location</Label>
                  <p className="text-sm">{selectedItem.location || '-'}</p>
                </div>
              </div>
            </>)}
        </div>
      </div>);
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[85vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Select Target {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}</DialogTitle>
        </DialogHeader>

        <div className="flex h-[calc(100%-8rem)]">
          {/* Left Pane - List/Tree (~60%) */}
          <div className="w-3/5 border-r">
            {isLoading ? (<div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading {category.replace('_', ' ')}...</p>
                </div>
              </div>) : error ? (<div className="flex items-center justify-center h-full">
                <div className="text-center text-red-500">
                  <p className="mb-2">Failed to load {category.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-500">Please try again</p>
                </div>
              </div>) : (<>
                {category === 'components' ? (<ComponentTreeSelector components={componentTree} selectedItem={selectedItem} onSelect={setSelectedItem} searchQuery={searchQuery} onSearchChange={setSearchQuery}/>) : (<TableSelector category={category} items={data || []} selectedItem={selectedItem} onSelect={setSelectedItem} searchQuery={searchQuery} onSearchChange={setSearchQuery}/>)}
              </>)}
          </div>

          {/* Right Pane - Preview (~40%) */}
          <div className="w-2/5 p-6 bg-gray-50">
            {renderPreview()}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={function () { return onOpenChange(false); }}>
            Cancel
          </Button>
          <Button onClick={handleUseTarget} disabled={!selectedItem}>
            Use this target
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
//# sourceMappingURL=TargetPicker.jsx.map