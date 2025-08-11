import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Upload, Eye, Trash2, Edit3, X, ChevronRight, ChevronDown, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getComponentCategory } from "@/utils/componentUtils";

interface ComponentNode {
  id: string;
  code: string;
  name: string;
  children?: ComponentNode[];
  isExpanded?: boolean;
}

interface ComponentRegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (componentData: any) => void;
  parentComponent?: { code: string; name: string } | null;
}

// Use the same component tree data as Components screen
const dummyComponents: ComponentNode[] = [
  {
    id: "1",
    code: "1",
    name: "Ship General",
    children: [
      {
        id: "1.1",
        code: "1.1",
        name: "Fresh Water System",
        children: [
          {
            id: "1.1.1",
            code: "1.1.1",
            name: "Hydrophore Unit",
            children: [
              {
                id: "1.1.1.1",
                code: "1.1.1.1",
                name: "Pressure Vessel"
              },
              {
                id: "1.1.1.2",
                code: "1.1.1.2",
                name: "Feed Pump"
              },
              {
                id: "1.1.1.3",
                code: "1.1.1.3",
                name: "Pressure Switch"
              }
            ]
          },
          {
            id: "1.1.2",
            code: "1.1.2",
            name: "Potable Water Maker",
            children: []
          },
          {
            id: "1.1.3",
            code: "1.1.3",
            name: "UV Sterilizer",
            children: []
          }
        ]
      },
      {
        id: "1.2",
        code: "1.2",
        name: "Sewage Treatment System",
        children: []
      },
      {
        id: "1.3",
        code: "1.3",
        name: "HVAC – Accommodation",
        children: []
      }
    ]
  },
  {
    id: "2", 
    code: "2",
    name: "Hull",
    children: [
      {
        id: "2.1",
        code: "2.1",
        name: "Ballast Tanks",
        children: []
      },
      {
        id: "2.2",
        code: "2.2",
        name: "Cathodic Protection",
        children: []
      },
      {
        id: "2.3",
        code: "2.3",
        name: "Hull Openings – Hatches",
        children: []
      }
    ]
  },
  {
    id: "3",
    code: "3", 
    name: "Equipment for Cargo",
    children: [
      {
        id: "3.1",
        code: "3.1",
        name: "Cargo Cranes",
        children: []
      },
      {
        id: "3.2",
        code: "3.2",
        name: "Hatch Cover Hydraulics",
        children: []
      },
      {
        id: "3.3",
        code: "3.3",
        name: "Cargo Hold Ventilation",
        children: []
      }
    ]
  },
  {
    id: "4",
    code: "4",
    name: "Ship's Equipment",
    children: [
      {
        id: "4.1",
        code: "4.1",
        name: "Mooring System",
        children: []
      },
      {
        id: "4.2",
        code: "4.2",
        name: "Windlass",
        children: []
      },
      {
        id: "4.3",
        code: "4.3",
        name: "Steering Gear",
        children: []
      }
    ]
  },
  {
    id: "5",
    code: "5",
    name: "Equipment for Crew & Passengers",
    children: [
      {
        id: "5.1",
        code: "5.1",
        name: "Lifeboat System",
        children: []
      },
      {
        id: "5.2",
        code: "5.2",
        name: "Fire Main System",
        children: []
      },
      {
        id: "5.3",
        code: "5.3",
        name: "Emergency Lighting",
        children: []
      }
    ]
  },
  {
    id: "6",
    code: "6",
    name: "Machinery Main Components",
    isExpanded: true,
    children: [
      {
        id: "6.1",
        code: "6.1",
        name: "Main Engine",
        isExpanded: true,
        children: [
          {
            id: "6.1.1",
            code: "6.1.1",
            name: "Cylinder Head",
            isExpanded: true,
            children: [
              {
                id: "6.1.1.1",
                code: "6.1.1.1",
                name: "Valve Seats"
              },
              {
                id: "6.1.1.2",
                code: "6.1.1.2",
                name: "Injector Sleeve"
              },
              {
                id: "6.1.1.3",
                code: "6.1.1.3",
                name: "Rocker Arm"
              }
            ]
          },
          {
            id: "6.1.2",
            code: "6.1.2",
            name: "Main Bearings",
            children: []
          },
          {
            id: "6.1.3",
            code: "6.1.3",
            name: "Cylinder Liners",
            children: []
          }
        ]
      },
      {
        id: "6.2",
        code: "6.2",
        name: "Diesel Generators",
        children: [
          {
            id: "6.2.1",
            code: "6.2.1",
            name: "DG #1",
            children: []
          },
          {
            id: "6.2.2",
            code: "6.2.2",
            name: "DG #2",
            children: []
          },
          {
            id: "6.2.3",
            code: "6.2.3",
            name: "DG #3",
            children: []
          }
        ]
      },
      {
        id: "6.3",
        code: "6.3",
        name: "Auxiliary Boiler",
        children: []
      }
    ]
  },
  {
    id: "7",
    code: "7",
    name: "Systems for Machinery Main Components",
    children: [
      {
        id: "7.1",
        code: "7.1",
        name: "Fuel Oil System",
        children: []
      }
    ]
  },
  {
    id: "8",
    code: "8",
    name: "Ship Common Systems",
    children: []
  }
];

const ComponentRegisterForm: React.FC<ComponentRegisterFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  parentComponent,
}) => {
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState<ComponentNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["6", "6.1", "6.1.1"]));
  const [isAddMode, setIsAddMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Auto-generate component code based on parent
  const generateComponentCode = (parent: ComponentNode | null) => {
    if (!parent) return "";
    // Calculate next available number at this level
    const siblingCount = parent.children?.length || 0;
    return `${parent.code}.${siblingCount + 1}`;
  };

  const [componentData, setComponentData] = useState({
    componentId: "601.003.XXX",
    componentName: "",
    serialNo: "",
    drawingNo: "",
    componentCode: "",
    equipmentCategory: "",
    location: "",
    installation: "",
    componentType: "",
    rating: "",
    noOfUnits: "",
    equipmentDepartment: "",
    parentComponent: "",
    facility: "",
    runningHoursUnit1: "",
    runningHoursUnit2: "",
    conditionMonitoringMetrics: {
      metric: "",
      interval: "",
      temperature: "",
      pressure: ""
    },
    workOrders: [],
    maintenanceHistory: [],
    spares: [],
    drawings: [],
    classificationData: {
      classificationProvider: "",
      certificateNo: "",
      lastDataSurvey: "",
      nextDataSurvey: "",
      surveyType: "",
      classRequirements: "",
      classCode: "",
      information: ""
    }
  });

  // Handle node selection
  const handleNodeSelect = (node: ComponentNode) => {
    setSelectedNode(node);
    setIsAddMode(false);
    // Load existing component data for edit mode
    setComponentData(prev => ({
      ...prev,
      componentName: node.name,
      componentCode: node.code,
      parentComponent: ''
    }));
  };

  // Handle Add Sub Component
  const handleAddSubComponent = () => {
    if (!selectedNode) {
      toast({
        title: "No Parent Selected",
        description: "Select a parent in the tree to add a child component.",
        variant: "destructive"
      });
      return;
    }
    setIsAddMode(true);
    const newCode = generateComponentCode(selectedNode);
    // Reset form for new component
    setComponentData({
      componentId: "601.003.XXX",
      componentName: "",
      serialNo: "",
      drawingNo: "",
      componentCode: newCode,
      equipmentCategory: "",
      location: "",
      criticality: "",
      unitOfMeasurement: "",
      department: "",
      inService: "",
      conditionBased: "",
      noOfUnits: "",
      equipmentDepartment: "",
      parentComponent: selectedNode.name,
      classificationData: {
        classificationProvider: "",
        certificateNo: "",
        lastDataSurvey: "",
        nextDataSurvey: "",
        surveyType: "",
        classRequirements: "",
        classCode: "",
        information: ""
      }
    });
  };

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

  // Render component tree
  const renderComponentTree = (nodes: ComponentNode[], level: number = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedNode?.id === node.id;

      return (
        <div key={node.id}>
          <div
            className={`flex items-center px-3 py-2 cursor-pointer hover:bg-white/10 ${
              isSelected ? "bg-white/20" : ""
            }`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => handleNodeSelect(node)}
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
                  <ChevronDown className="h-4 w-4 text-white" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-white" />
                )
              ) : (
                <ChevronRight className="h-4 w-4 text-white/50" />
              )}
            </button>
            <span className="text-sm text-white">
              {node.code} {node.name}
            </span>
          </div>
          {hasChildren && isExpanded && (
            <div>{renderComponentTree(node.children!, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setComponentData(prev => {
        const parentValue = prev[parent as keyof typeof prev];
        return {
          ...prev,
          [parent]: {
            ...(typeof parentValue === 'object' && parentValue !== null ? parentValue as any : {}),
            [child]: value
          }
        };
      });
    } else {
      setComponentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = () => {
    // Validate Component Name is required
    if (!componentData.componentName || componentData.componentName.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Component Name is required.",
        variant: "destructive"
      });
      return;
    }

    // Validate Component Code matches tree position
    if (isAddMode && selectedNode) {
      const expectedCode = generateComponentCode(selectedNode);
      if (componentData.componentCode !== expectedCode) {
        toast({
          title: "Validation Error", 
          description: "Component Code must match tree position.",
          variant: "destructive"
        });
        return;
      }
    }

    if (onSubmit) {
      onSubmit(componentData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-none h-[95vh] flex flex-col">
        <DialogHeader className="pb-4 pr-12">
          <div className="flex items-center justify-between">
            <DialogTitle>Component Register - {isAddMode ? 'Add Component' : 'Edit Component'}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white"
                onClick={handleAddSubComponent}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Sub Component
              </Button>
              <Button 
                size="sm" 
                className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white"
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Components Tree */}
          <div className="w-80 bg-[#52baf3] text-white p-4 overflow-auto">
            <div className="mb-4">
              <h3 className="font-semibold text-white mb-2">COMPONENTS</h3>
              <div className="mb-3">
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/60"
                />
              </div>
              <div className="space-y-0">
                {renderComponentTree(dummyComponents)}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Input 
                      value={componentData.componentName || ''}
                      onChange={(e) => handleInputChange('componentName', e.target.value)}
                      placeholder="Component Name (required)"
                      className="text-lg font-semibold mb-1"
                      required
                    />
                    <div className="text-sm text-gray-500">
                      Component Code: {componentData.componentCode || 'Auto-generated'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="vessel">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vessel">Vessel</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Search Components" className="w-48" />
                    <Select defaultValue="criticality">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="criticality">Criticality</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* A. Component Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-[#16569e]">A. Component Information</h4>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Maker</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Model</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Serial No</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.serialNo}
                        onChange={(e) => handleInputChange('serialNo', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Drawing No</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.drawingNo}
                        onChange={(e) => handleInputChange('drawingNo', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-[#8798ad]">Component Code</Label>
                      <Input 
                        value={componentData.componentCode}
                        readOnly
                        className="border-gray-300 bg-gray-50"
                        title="Component Code is auto-generated based on tree position"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-[#8798ad]">Component Category</Label>
                      <Input 
                        value={selectedNode ? getComponentCategory(selectedNode.id) : ''}
                        readOnly
                        className="border-gray-300 bg-gray-50"
                        title="Component Category is derived from the component's tree position"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Location</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Critical</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Installation Date</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.installation}
                        onChange={(e) => handleInputChange('installation', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Commissioned Date</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Rating</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.rating}
                        onChange={(e) => handleInputChange('rating', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Condition Based</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">No of Units</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.noOfUnits}
                        onChange={(e) => handleInputChange('noOfUnits', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Eqpt / System Department</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.equipmentDepartment}
                        onChange={(e) => handleInputChange('equipmentDepartment', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Parent Component</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.parentComponent}
                        onChange={(e) => handleInputChange('parentComponent', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Dimensions/Size</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-[#8798ad]">Notes</Label>
                      <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                      <X className="h-3 w-3 text-red-500 cursor-pointer" />
                    </div>
                    <Textarea 
                      placeholder="Notes"
                      className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      rows={2}
                    />
                  </div>
                </div>

                {/* B. Running Hours & Condition Monitoring Metrics */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-[#16569e]">B. Running Hours & Condition Monitoring Metrics</h4>
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Running Hours</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        placeholder="20000"
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Date Updated</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        placeholder="dd-mm-yyyy"
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">Condition Monitoring Metrics</h5>
                      <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Metric
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-[#8798ad]">Metric</Label>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <Input 
                          className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-[#8798ad]">Alerts/ Thresholds</Label>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <Input 
                          className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* C. Work Orders */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-[#16569e]">C. Work Orders</h4>
                    <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                      <Plus className="h-4 w-4 mr-1" />
                      Add W.O
                    </Button>
                  </div>
                  <div className="border border-gray-200 rounded">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          <span>WO Title</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Assigned To</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Frequency Type</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Frequency Value</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Initial Next Due</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div></div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {isAddMode ? (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                          No work orders yet. Click "Add W.O" to create one.
                        </div>
                      ) : (
                        <>
                          <div className="px-4 py-3">
                            <div className="grid grid-cols-6 gap-4 text-sm items-center">
                              <div className="text-gray-900">Main Engine Overhaul - Replace Main Bearings</div>
                              <div className="text-gray-900">Chief Engineer</div>
                              <div className="text-gray-900">Running Hours</div>
                              <div className="text-gray-900">500</div>
                              <div className="text-gray-900">02-Jun-2025</div>
                              <div className="flex gap-2">
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 py-3">
                            <div className="grid grid-cols-6 gap-4 text-sm items-center">
                              <div className="text-gray-900">Main Engine Overhaul - Replace Main Bearings</div>
                              <div className="text-gray-900">Chief Engineer</div>
                              <div className="text-gray-900">Calendar</div>
                              <div className="text-gray-900">30</div>
                              <div className="text-gray-900">02-Jun-2025</div>
                              <div className="flex gap-2">
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* D. Maintenance History */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-[#16569e]">D. Maintenance History</h4>
                    <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                      <Plus className="h-4 w-4 mr-1" />
                      Add M History
                    </Button>
                  </div>
                  <div className="border border-gray-200 rounded">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          <span>Work Order No</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Performed By</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Total Time (Hrs)</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Completion Date</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Status</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                    {isAddMode ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No maintenance history yet. Click "Add M History" to create one.
                      </div>
                    ) : (
                      <div className="px-4 py-3">
                        <div className="grid grid-cols-5 gap-4 text-sm items-center">
                          <div>
                            <Input 
                              defaultValue="WO-2025-01"
                              className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                            />
                          </div>
                          <div>
                            <Input 
                              defaultValue="Kane"
                              className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                            />
                          </div>
                          <div>
                            <Input 
                              defaultValue="3"
                              className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                            />
                          </div>
                          <div>
                            <Input 
                              defaultValue="08-Jan-2025"
                              className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                            />
                          </div>
                          <div>
                            <Input 
                              defaultValue="Completed"
                              className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* E. Spares */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-[#16569e]">E. Spares</h4>
                    <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Spares
                    </Button>
                  </div>
                  <div className="border border-gray-200 rounded">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          <span>Part Code</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Part Name</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Min</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Critical</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Location</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-5 gap-4 text-sm items-center">
                        <div>
                          <Input 
                            defaultValue="SP-306-001"
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            defaultValue="Fuel Injection"
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            defaultValue="5"
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            defaultValue="5"
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            defaultValue="Engine Room R-3"
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* F. Drawings & Manuals */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-[#16569e]">F. Drawings & Manuals</h4>
                    <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Document
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border border-[#52baf3] rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">General Arrangement</span>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Upload className="h-4 w-4 text-[#52baf3]" />
                    </div>
                    <div className="flex items-center justify-between p-2 border border-[#52baf3] rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Maintenance Manual</span>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Upload className="h-4 w-4 text-[#52baf3]" />
                    </div>
                    <div className="flex items-center justify-between p-2 border border-[#52baf3] rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Installation Guide</span>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Upload className="h-4 w-4 text-[#52baf3]" />
                    </div>
                    <div className="flex items-center justify-between p-2 border border-[#52baf3] rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Trouble Shooting Guide</span>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Upload className="h-4 w-4 text-[#52baf3]" />
                    </div>
                  </div>
                </div>

                {/* G. Classification & Regulatory Data */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-[#16569e]">G. Classification & Regulatory Data</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Classification Provider</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.classificationData.classificationProvider}
                        onChange={(e) => handleInputChange('classificationData.classificationProvider', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Certificate No</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.classificationData.certificateNo}
                        onChange={(e) => handleInputChange('classificationData.certificateNo', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Last Data Survey</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.classificationData.lastDataSurvey}
                        onChange={(e) => handleInputChange('classificationData.lastDataSurvey', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Next Data Survey</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.classificationData.nextDataSurvey}
                        onChange={(e) => handleInputChange('classificationData.nextDataSurvey', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Survey Type</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.classificationData.surveyType}
                        onChange={(e) => handleInputChange('classificationData.surveyType', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Class Requirements</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.classificationData.classRequirements}
                        onChange={(e) => handleInputChange('classificationData.classRequirements', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Class Code</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.classificationData.classCode}
                        onChange={(e) => handleInputChange('classificationData.classCode', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Information</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.classificationData.information}
                        onChange={(e) => handleInputChange('classificationData.information', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                  </div>
                </div>

                {/* H. Requisitions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-[#16569e]">H. Requisitions</h4>
                    <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Requisition
                    </Button>
                  </div>
                  <div className="border border-gray-200 rounded">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          <span>REQ No.</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Part</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Qty</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Date</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Status</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-5 gap-4 text-sm items-center">
                        <div>
                          <Input 
                            defaultValue="REQ-2025-089"
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            defaultValue="Fuel Injection Pump"
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            defaultValue="2"
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            defaultValue="15-Jan-2025"
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            defaultValue="Pending"
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-medium"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentRegisterForm;