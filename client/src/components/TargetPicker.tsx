import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronRight, ChevronDown, Package, ClipboardList, Archive, Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface TargetPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  vesselId: string;
  onTargetSelect: (targetType: string, targetId: string, snapshot: any) => void;
}

interface ComponentNode {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  maker?: string;
  model?: string;
  serialNo?: string;
  deptCategory?: string;
  location?: string;
  commissionedDate?: string;
  critical?: boolean;
  classItem?: boolean;
  children?: ComponentNode[];
}

export function TargetPicker({
  open,
  onOpenChange,
  category,
  vesselId,
  onTargetSelect
}: TargetPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Fetch data based on category
  const { data, isLoading } = useQuery({
    queryKey: [`/api/${getApiEndpoint(category)}`, vesselId],
    queryFn: async () => {
      const endpoint = getApiEndpoint(category);
      const response = await fetch(`/api/${endpoint}${endpoint === 'components' ? `/${vesselId}` : `?vesselId=${vesselId}`}`);
      if (!response.ok) throw new Error(`Failed to fetch ${category}`);
      return response.json();
    },
    enabled: open && !!category && !!vesselId
  });

  function getApiEndpoint(cat: string) {
    switch (cat) {
      case 'components': return 'components';
      case 'work_orders': return 'work-orders';
      case 'spares': return 'spares';
      case 'stores': return 'stores';
      default: return 'components';
    }
  }

  const handleSelect = () => {
    if (!selectedItem) return;

    const targetType = category === 'work_orders' ? 'work_order' : 
                      category === 'stores' ? 'store' : 
                      category.slice(0, -1); // Remove 's' from components/spares

    const snapshot = createSnapshot(selectedItem, category);
    onTargetSelect(targetType, selectedItem.id || selectedItem.componentId, snapshot);
    onOpenChange(false);
  };

  const createSnapshot = (item: any, cat: string) => {
    const now = new Date().toISOString();
    const snapshot: any = {
      capturedAtUtc: now,
      vesselId: vesselId,
      fields: {}
    };

    if (cat === 'components') {
      snapshot.displayPath = getComponentPath(item);
      snapshot.displayKey = item.code;
      snapshot.displayName = item.name;
      snapshot.fields = {
        code: item.code,
        name: item.name,
        maker: item.maker || '',
        model: item.model || '',
        serialNo: item.serialNo || '',
        deptCategory: item.deptCategory || '',
        location: item.location || '',
        commissionedDate: item.commissionedDate || '',
        critical: item.critical || false,
        classItem: item.classItem || false
      };
    } else if (cat === 'work_orders') {
      snapshot.displayKey = item.woNo;
      snapshot.displayName = item.jobTitle;
      snapshot.fields = {
        woNo: item.woNo,
        jobTitle: item.jobTitle,
        componentCode: item.componentCode || '',
        componentName: item.componentName || '',
        frequencyType: item.frequencyType || '',
        frequencyValue: item.frequencyValue || '',
        assignedTo: item.assignedTo || '',
        priority: item.priority || '',
        status: item.status || ''
      };
    } else if (cat === 'spares') {
      snapshot.displayKey = item.partCode;
      snapshot.displayName = item.partName;
      snapshot.fields = {
        partCode: item.partCode,
        partName: item.partName,
        componentCode: item.componentCode || '',
        componentName: item.componentName || '',
        uom: item.uom || '',
        min: item.min || 0,
        rob: item.rob || 0,
        location: item.location || '',
        critical: item.critical || false
      };
    } else if (cat === 'stores') {
      snapshot.displayKey = item.itemCode;
      snapshot.displayName = item.itemName;
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

  const getComponentPath = (component: ComponentNode): string => {
    if (!component.parentId) return component.code;
    // In a real implementation, we'd traverse up the tree
    return component.code;
  };

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderComponentTree = (nodes: ComponentNode[], level = 0) => {
    if (!nodes) return null;

    const filteredNodes = searchQuery
      ? nodes.filter(node => 
          node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : nodes;

    return filteredNodes.map(node => (
      <div key={node.id || node.code}>
        <div
          className={cn(
            "flex items-center py-2 px-2 hover:bg-gray-100 cursor-pointer rounded",
            selectedItem?.id === node.id && "bg-blue-50 border-blue-500"
          )}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => setSelectedItem(node)}
        >
          {node.children && node.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id || node.code);
              }}
              className="mr-1"
            >
              {expandedNodes.has(node.id || node.code) ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </button>
          )}
          <Package className="h-4 w-4 mr-2 text-gray-500" />
          <span className="font-mono text-sm mr-2">{node.code}</span>
          <span className="text-sm">{node.name}</span>
        </div>
        {node.children && expandedNodes.has(node.id || node.code) && (
          <div>{renderComponentTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  const renderItemTable = () => {
    if (!data || data.length === 0) return <div className="text-center py-4 text-gray-500">No items found</div>;

    const filteredData = searchQuery
      ? data.filter((item: any) => {
          const searchLower = searchQuery.toLowerCase();
          if (category === 'work_orders') {
            return item.woNo?.toLowerCase().includes(searchLower) ||
                   item.jobTitle?.toLowerCase().includes(searchLower);
          } else if (category === 'spares') {
            return item.partCode?.toLowerCase().includes(searchLower) ||
                   item.partName?.toLowerCase().includes(searchLower);
          } else if (category === 'stores') {
            return item.itemCode?.toLowerCase().includes(searchLower) ||
                   item.itemName?.toLowerCase().includes(searchLower);
          }
          return false;
        })
      : data;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {category === 'work_orders' && (
              <>
                <TableHead>WO No</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
              </>
            )}
            {category === 'spares' && (
              <>
                <TableHead>Part Code</TableHead>
                <TableHead>Part Name</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead>Min/ROB</TableHead>
              </>
            )}
            {category === 'stores' && (
              <>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead>Min/ROB</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item: any) => (
            <TableRow
              key={item.id || item.woNo || item.partCode || item.itemCode}
              className={cn(
                "cursor-pointer",
                selectedItem === item && "bg-blue-50"
              )}
              onClick={() => setSelectedItem(item)}
            >
              {category === 'work_orders' && (
                <>
                  <TableCell className="font-mono">{item.woNo}</TableCell>
                  <TableCell>{item.jobTitle}</TableCell>
                  <TableCell>{item.componentName || '-'}</TableCell>
                  <TableCell>{item.frequencyType} {item.frequencyValue}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </>
              )}
              {category === 'spares' && (
                <>
                  <TableCell className="font-mono">{item.partCode}</TableCell>
                  <TableCell>{item.partName}</TableCell>
                  <TableCell>{item.componentName || '-'}</TableCell>
                  <TableCell>{item.uom}</TableCell>
                  <TableCell>{item.min}/{item.rob}</TableCell>
                </>
              )}
              {category === 'stores' && (
                <>
                  <TableCell className="font-mono">{item.itemCode}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.storesCategory || '-'}</TableCell>
                  <TableCell>{item.uom}</TableCell>
                  <TableCell>{item.min}/{item.rob}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderPreview = () => {
    if (!selectedItem) return <div className="text-center text-gray-500 py-8">Select an item to preview</div>;

    const getIcon = () => {
      switch (category) {
        case 'components': return <Package className="h-5 w-5" />;
        case 'work_orders': return <ClipboardList className="h-5 w-5" />;
        case 'spares': return <Archive className="h-5 w-5" />;
        case 'stores': return <Store className="h-5 w-5" />;
        default: return null;
      }
    };

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          {getIcon()}
          <div>
            <h3 className="font-semibold text-lg">
              {category === 'components' && `${selectedItem.name}`}
              {category === 'work_orders' && `${selectedItem.jobTitle}`}
              {category === 'spares' && `${selectedItem.partName}`}
              {category === 'stores' && `${selectedItem.itemName}`}
            </h3>
            <p className="text-sm text-gray-600">
              {category === 'components' && `Code: ${selectedItem.code}`}
              {category === 'work_orders' && `WO No: ${selectedItem.woNo}`}
              {category === 'spares' && `Part Code: ${selectedItem.partCode}`}
              {category === 'stores' && `Item Code: ${selectedItem.itemCode}`}
            </p>
          </div>
        </div>

        <Separator />

        {/* Fields */}
        <div className="space-y-3">
          {category === 'components' && (
            <>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label className="text-xs text-gray-500">Dept/Category</Label>
                  <p className="text-sm">{selectedItem.deptCategory || '-'}</p>
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
            </>
          )}

          {category === 'work_orders' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Component</Label>
                  <p className="text-sm">{selectedItem.componentName || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Frequency</Label>
                  <p className="text-sm">{selectedItem.frequencyType} {selectedItem.frequencyValue}</p>
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
                  <Badge variant={selectedItem.status === 'active' ? 'default' : 'secondary'}>
                    {selectedItem.status}
                  </Badge>
                </div>
              </div>
            </>
          )}

          {category === 'spares' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Linked Component</Label>
                  <p className="text-sm">{selectedItem.componentName || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">UOM</Label>
                  <p className="text-sm">{selectedItem.uom || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Minimum</Label>
                  <p className="text-sm">{selectedItem.min || 0}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">ROB</Label>
                  <p className="text-sm">{selectedItem.rob || 0}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Location</Label>
                  <p className="text-sm">{selectedItem.location || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Critical</Label>
                  <p className="text-sm">{selectedItem.critical ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </>
          )}

          {category === 'stores' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Stores Category</Label>
                  <p className="text-sm">{selectedItem.storesCategory || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">UOM</Label>
                  <p className="text-sm">{selectedItem.uom || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Minimum</Label>
                  <p className="text-sm">{selectedItem.min || 0}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">ROB</Label>
                  <p className="text-sm">{selectedItem.rob || 0}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Location</Label>
                  <p className="text-sm">{selectedItem.location || '-'}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="px-6 py-4">
          <DialogTitle>
            Select Target {category === 'components' ? 'Component' : 
                         category === 'work_orders' ? 'Work Order' :
                         category === 'spares' ? 'Spare' : 'Store Item'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          {/* Left side - List/Tree */}
          <div className="flex-1 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-120px)]">
              <div className="p-4">
                {isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : category === 'components' ? (
                  renderComponentTree(data)
                ) : (
                  renderItemTable()
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right side - Preview */}
          <div className="w-[400px] bg-gray-50">
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="p-6">
                {renderPreview()}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelect} 
            disabled={!selectedItem}
          >
            Use this target
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}