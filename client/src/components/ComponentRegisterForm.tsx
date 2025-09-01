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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

// Function to get mock data for a component based on its code
const getComponentMockData = (code: string) => {
  // Generate realistic mock data based on component code and type
  const getComponentDetails = (code: string, name?: string) => {
    // Parse component hierarchy from code
    const levels = code.split('.');
    const topLevel = levels[0];
    
    // Department mapping based on top-level code
    const departmentMap: { [key: string]: string } = {
      "1": "Hull & Deck",
      "2": "Deck Machinery",
      "3": "Accommodation",
      "4": "Ship's Equipment",
      "5": "Safety Equipment",
      "6": "Engine Department",
      "7": "Engine Systems",
      "8": "Common Systems"
    };
    
    // Location mapping
    const locationMap: { [key: string]: string } = {
      "1": "Main Deck",
      "2": "Fore Deck",
      "3": "Accommodation Block",
      "4": "Main Deck",
      "5": "Bridge/Safety Station",
      "6": "Engine Room",
      "7": "Engine Room",
      "8": "Various"
    };
    
    // Criticality based on component level and type
    const isCritical = topLevel === "6" || topLevel === "7" || (topLevel === "1" && levels.length > 2);
    
    // Generate appropriate maker based on component type
    const getMaker = () => {
      if (topLevel === "6") return ["MAN B&W", "Wärtsilä", "Caterpillar", "Yanmar"][Math.floor(Math.random() * 4)];
      if (topLevel === "1") return ["Hyundai", "Samsung", "Daewoo"][Math.floor(Math.random() * 3)];
      if (topLevel === "2") return ["MacGregor", "TTS Marine", "Rolls-Royce"][Math.floor(Math.random() * 3)];
      if (topLevel === "3") return ["Marine Air Systems", "Novenco", "Heinen & Hopman"][Math.floor(Math.random() * 3)];
      if (topLevel === "4") return ["Kongsberg", "Furuno", "JRC"][Math.floor(Math.random() * 3)];
      if (topLevel === "5") return ["Viking", "Survitec", "LALIZAS"][Math.floor(Math.random() * 3)];
      return "OEM Manufacturer";
    };
    
    // Generate model based on code
    const model = `${getMaker().split(' ')[0].toUpperCase()}-${code.replace(/\./g, '')}-${levels.length > 2 ? 'ADV' : 'STD'}`;
    
    // Generate serial number
    const serialNo = `SN-${new Date().getFullYear()}-${code.replace(/\./g, '')}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
    
    // Rating based on component type
    const getRating = () => {
      if (topLevel === "6" && levels.length === 3) return "7,200 kW";
      if (topLevel === "6" && levels.length === 4) return "High Performance";
      if (topLevel === "2") return "SWL 25 MT";
      if (topLevel === "7") return "Medium Pressure";
      return "Standard";
    };
    
    return {
      maker: getMaker(),
      model: model,
      serialNo: serialNo,
      drawingNo: `DWG-${code.replace(/\./g, '-')}`,
      department: departmentMap[topLevel] || "General",
      critical: isCritical ? "Yes" : "No",
      classItem: isCritical ? "Yes" : "No",
      location: locationMap[topLevel] || "Ship",
      commissionedDate: "2020-01-15",
      installationDate: "2019-12-20",
      rating: getRating(),
      conditionBased: levels.length > 2 ? "Yes" : "No",
      noOfUnits: levels.length === 4 ? "6" : levels.length === 3 ? "2" : "1",
      eqptSystemDept: departmentMap[topLevel] || "General",
      parentComponent: levels.length > 1 ? `Level ${levels.slice(0, -1).join('.')}` : "Ship Structure",
      dimensionsSize: levels.length === 4 ? "0.5m x 0.3m" : levels.length === 3 ? "2m x 1m" : "5m x 3m",
      notes: `Component ${code} - ${isCritical ? 'Critical for vessel operations' : 'Standard equipment'}`
    };
  };
  
  // Special cases for specific well-known components
  const specialCases: { [key: string]: any } = {
    "6.1.1": {
      maker: "MAN Energy Solutions",
      model: "6S60MC-C",
      serialNo: "ME-2020-001",
      drawingNo: "DWG-6-1-1",
      department: "Engine Department",
      critical: "Yes",
      classItem: "Yes",
      location: "Engine Room",
      commissionedDate: "2020-02-01",
      installationDate: "2020-01-15",
      rating: "7,200 kW @ 105 RPM",
      conditionBased: "Yes",
      noOfUnits: "1",
      eqptSystemDept: "Engine Department",
      parentComponent: "6.1 Main Engine",
      dimensionsSize: "15m x 3m x 4m",
      notes: "Main propulsion engine - 6 cylinder, 2-stroke diesel"
    },
    "1.1.1.1": {
      maker: "Grundfos",
      model: "CR-64-3",
      serialNo: "PV-2020-001",
      drawingNo: "DWG-1-1-1-1",
      department: "Hull & Deck",
      critical: "Yes",
      classItem: "No",
      location: "Fresh Water Room",
      commissionedDate: "2020-01-01",
      installationDate: "2019-11-15",
      rating: "300 L/min @ 6 Bar",
      conditionBased: "Yes",
      noOfUnits: "2",
      eqptSystemDept: "Hull & Deck",
      parentComponent: "1.1.1 Hydrophore Unit",
      dimensionsSize: "2m x 1m x 1.5m",
      notes: "Pressure vessel for fresh water system"
    }
  };
  
  // Return special case if exists, otherwise generate based on pattern
  return specialCases[code] || getComponentDetails(code);
};

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

  // State for editable field labels and deletable fields
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [deletedFields, setDeletedFields] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [fieldLabels, setFieldLabels] = useState({
    maker: "Maker",
    model: "Model", 
    serialNo: "Serial No",
    drawingNo: "Drawing No",
    location: "Location",
    critical: "Critical",
    installation: "Installation Date",
    commissionedDate: "Commissioned Date",
    rating: "Rating",
    conditionBased: "Condition Based",
    noOfUnits: "No of Units",
    eqptSystemDept: "Eqpt / System Department",
    parentComponent: "Parent Component",
    dimensionsSize: "Dimensions/Size",
    notes: "Notes",
    runningHours: "Running Hours",
    dateUpdated: "Date Updated",
    nextDue: "Next Due",
    metric: "Metric",
    alertsThresholds: "Alerts/ Thresholds",
    woTitle: "WO Title",
    assignedTo: "Assigned To",
    maintenanceType: "Maintenance Type",
    frequency: "Frequency",
    initialNextDue: "Initial Next Due",
    classificationProvider: "Classification Provider",
    certificateNo: "Certificate No.",
    lastDataSurvey: "Last Data Survey",
    nextDataSurvey: "Next Data Survey",
    surveyType: "Survey Type",
    classRequirements: "Class Requirements",
    classCode: "Class Code",
    information: "Information"
  });

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
    maker: "",
    model: "",
    department: "",
    critical: "No",
    classItem: "No",
    conditionBased: "No",
    dimensionsSize: "",
    notes: "",
    commissionedDate: "",
    installationDate: "",
    eqptSystemDept: "",
    // Section B: Running Hours & Condition Monitoring
    runningHours: "20000",
    dateUpdated: "",
    metric: "",
    alertsThresholds: "",
    // Section C: Work Orders
    woTitle: "",
    assignedTo: "",
    maintenanceType: "",
    frequency: "",
    initialNextDue: "",
    // Section D: Maintenance History
    workOrderNo: "WO-2025-01", 
    performedBy: "Kane",
    totalTimeHrs: "3",
    completionDate: "08-Jan-2025",
    status: "Completed",
    // Section E: Spare Parts
    partCode: "SP-306-001",
    partName: "Fuel Injection",
    minQty: "5",
    criticalQty: "5",
    locationStore: "Engine Room R-3",
    // Section H: Requisitions  
    reqNo: "REQ-2025-089",
    reqPart: "Fuel Injection Pump",
    reqQty: "2",
    reqDate: "15-Jan-2025",
    reqStatus: "Pending",
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
    // Load mock data for the selected component
    const mockData = getComponentMockData(node.code);
    setComponentData(prev => ({
      ...prev,
      componentName: node.name,
      componentCode: node.code,
      serialNo: mockData.serialNo || '',
      drawingNo: mockData.drawingNo || '',
      maker: mockData.maker || '',
      model: mockData.model || '',
      location: mockData.location || '',
      installation: mockData.installationDate || '',
      rating: mockData.rating || '',
      noOfUnits: mockData.noOfUnits || '',
      equipmentDepartment: mockData.eqptSystemDept || '',
      parentComponent: mockData.parentComponent || '',
      critical: mockData.critical || 'No',
      classItem: mockData.classItem || 'No',
      conditionBased: mockData.conditionBased || 'No',
      dimensionsSize: mockData.dimensionsSize || '',
      notes: mockData.notes || '',
      commissionedDate: mockData.commissionedDate || '',
      department: mockData.department || ''
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

  // Handle label editing
  const handleLabelEdit = (fieldKey: string) => {
    setEditingLabel(fieldKey);
  };

  const handleLabelSave = (fieldKey: string, newLabel: string) => {
    setFieldLabels(prev => ({
      ...prev,
      [fieldKey]: newLabel
    }));
    setEditingLabel(null);
  };

  const handleLabelCancel = () => {
    setEditingLabel(null);
  };

  // Field deletion handlers
  const handleFieldDelete = (fieldKey: string) => {
    setShowDeleteConfirm(fieldKey);
  };

  const confirmFieldDelete = () => {
    if (showDeleteConfirm) {
      setDeletedFields(prev => new Set([...prev, showDeleteConfirm]));
      setShowDeleteConfirm(null);
      toast({
        title: "Field Deleted",
        description: `${fieldLabels[showDeleteConfirm as keyof typeof fieldLabels]} field has been removed.`,
      });
    }
  };

  const cancelFieldDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Editable Label Component with deletion support
  const EditableLabel = ({ fieldKey, className = "text-sm text-[#8798ad]" }: { fieldKey: string, className?: string }) => {
    const [tempLabel, setTempLabel] = useState(fieldLabels[fieldKey as keyof typeof fieldLabels] || fieldKey);
    
    if (editingLabel === fieldKey) {
      return (
        <Input
          value={tempLabel}
          onChange={(e) => setTempLabel(e.target.value)}
          onBlur={() => handleLabelSave(fieldKey, tempLabel)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLabelSave(fieldKey, tempLabel);
            } else if (e.key === 'Escape') {
              setTempLabel(fieldLabels[fieldKey as keyof typeof fieldLabels] || fieldKey);
              handleLabelCancel();
            } else if (e.key === 'Delete') {
              e.preventDefault();
              handleFieldDelete(fieldKey);
            }
          }}
          className="h-6 text-sm border-[#52baf3] focus:border-[#52baf3]"
          autoFocus
        />
      );
    }

    return (
      <Label 
        className={`${className} text-[#52baf3] cursor-pointer hover:underline`}
        onClick={() => handleLabelEdit(fieldKey)}
        onKeyDown={(e) => {
          if (e.key === 'Delete') {
            e.preventDefault();
            handleFieldDelete(fieldKey);
          }
        }}
        tabIndex={0}
        title="Click to edit field label, press Delete to remove field"
      >
        {fieldLabels[fieldKey as keyof typeof fieldLabels] || fieldKey}
      </Label>
    );
  };

  // Deletable Field Wrapper Component
  const DeletableField = ({ fieldKey, children, className = "space-y-2" }: { fieldKey: string, children: React.ReactNode, className?: string }) => {
    if (deletedFields.has(fieldKey)) {
      return null;
    }

    return (
      <div className={className}>
        {children}
      </div>
    );
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
                      <EditableLabel fieldKey="maker" />
                      <Input 
                        value={componentData.maker}
                        onChange={(e) => handleInputChange('maker', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <EditableLabel fieldKey="model" />
                      <Input 
                        value={componentData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <EditableLabel fieldKey="serialNo" />
                      <Input 
                        value={componentData.serialNo}
                        onChange={(e) => handleInputChange('serialNo', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <EditableLabel fieldKey="drawingNo" />
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
                      <EditableLabel fieldKey="location" />
                      <Input 
                        value={componentData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <EditableLabel fieldKey="critical" />
                      <Input 
                        value={componentData.critical}
                        onChange={(e) => handleInputChange('critical', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <EditableLabel fieldKey="installation" />
                      <Input 
                        value={componentData.installation}
                        onChange={(e) => handleInputChange('installation', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <EditableLabel fieldKey="commissionedDate" />
                      <Input 
                        value={componentData.commissionedDate}
                        onChange={(e) => handleInputChange('commissionedDate', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <EditableLabel fieldKey="rating" />
                      <Input 
                        value={componentData.rating}
                        onChange={(e) => handleInputChange('rating', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <EditableLabel fieldKey="conditionBased" />
                      <Input 
                        value={componentData.conditionBased}
                        onChange={(e) => handleInputChange('conditionBased', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </div>
                    <DeletableField fieldKey="noOfUnits">
                      <EditableLabel fieldKey="noOfUnits" />
                      <Input 
                        value={componentData.noOfUnits}
                        onChange={(e) => handleInputChange('noOfUnits', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                    <DeletableField fieldKey="eqptSystemDept">
                      <EditableLabel fieldKey="eqptSystemDept" />
                      <Input 
                        value={componentData.equipmentDepartment}
                        onChange={(e) => handleInputChange('equipmentDepartment', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                    <DeletableField fieldKey="parentComponent">
                      <EditableLabel fieldKey="parentComponent" />
                      <Input 
                        value={componentData.parentComponent}
                        onChange={(e) => handleInputChange('parentComponent', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                    <DeletableField fieldKey="dimensionsSize">
                      <EditableLabel fieldKey="dimensionsSize" />
                      <Input 
                        value={componentData.dimensionsSize}
                        onChange={(e) => handleInputChange('dimensionsSize', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                  </div>
                  <div className="mt-4">
                    <DeletableField fieldKey="notes">
                      <EditableLabel fieldKey="notes" />
                      <Textarea 
                        value={componentData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Notes"
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                        rows={2}
                      />
                    </DeletableField>
                  </div>
                </div>

                {/* B. Running Hours & Condition Monitoring Metrics */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-[#16569e]">B. Running Hours & Condition Monitoring Metrics</h4>
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <DeletableField fieldKey="runningHours">
                      <EditableLabel fieldKey="runningHours" />
                      <Input 
                        value={componentData.runningHours}
                        onChange={(e) => handleInputChange('runningHours', e.target.value)}
                        placeholder="20000"
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                    <DeletableField fieldKey="dateUpdated">
                      <EditableLabel fieldKey="dateUpdated" />
                      <Input 
                        value={componentData.dateUpdated}
                        onChange={(e) => handleInputChange('dateUpdated', e.target.value)}
                        placeholder="dd-mm-yyyy"
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
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
                      <DeletableField fieldKey="metric">
                        <EditableLabel fieldKey="metric" />
                        <Input 
                          value={componentData.metric}
                          onChange={(e) => handleInputChange('metric', e.target.value)}
                          className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                        />
                      </DeletableField>
                      <DeletableField fieldKey="alertsThresholds">
                        <EditableLabel fieldKey="alertsThresholds" />
                        <Input 
                          value={componentData.alertsThresholds}
                          onChange={(e) => handleInputChange('alertsThresholds', e.target.value)}
                          className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                        />
                      </DeletableField>
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
                          <EditableLabel fieldKey="woTitle" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="assignedTo" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="maintenanceType" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="frequency" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="initialNextDue" className="text-sm font-medium text-gray-700" />
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
                          <EditableLabel fieldKey="woTitle" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="assignedTo" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="frequency" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="dateUpdated" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="maintenanceType" className="text-sm font-medium text-gray-700" />
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
                              value={componentData.workOrderNo}
                              onChange={(e) => handleInputChange('workOrderNo', e.target.value)}
                              className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                            />
                          </div>
                          <div>
                            <Input 
                              value={componentData.performedBy}
                              onChange={(e) => handleInputChange('performedBy', e.target.value)}
                              className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                            />
                          </div>
                          <div>
                            <Input 
                              value={componentData.totalTimeHrs}
                              onChange={(e) => handleInputChange('totalTimeHrs', e.target.value)}
                              className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                            />
                          </div>
                          <div>
                            <Input 
                              value={componentData.completionDate}
                              onChange={(e) => handleInputChange('completionDate', e.target.value)}
                              className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                            />
                          </div>
                          <div>
                            <Input 
                              value={componentData.status}
                              onChange={(e) => handleInputChange('status', e.target.value)}
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
                          <EditableLabel fieldKey="woTitle" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="assignedTo" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="metric" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="alertsThresholds" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="frequency" className="text-sm font-medium text-gray-700" />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-5 gap-4 text-sm items-center">
                        <div>
                          <Input 
                            value={componentData.partCode}
                            onChange={(e) => handleInputChange('partCode', e.target.value)}
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            value={componentData.partName}
                            onChange={(e) => handleInputChange('partName', e.target.value)}
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            value={componentData.minQty}
                            onChange={(e) => handleInputChange('minQty', e.target.value)}
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            value={componentData.criticalQty}
                            onChange={(e) => handleInputChange('criticalQty', e.target.value)}
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            value={componentData.locationStore}
                            onChange={(e) => handleInputChange('locationStore', e.target.value)}
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
                        <EditableLabel fieldKey="woTitle" className="text-sm" />
                      </div>
                      <Upload className="h-4 w-4 text-[#52baf3]" />
                    </div>
                    <div className="flex items-center justify-between p-2 border border-[#52baf3] rounded">
                      <div className="flex items-center gap-2">
                        <EditableLabel fieldKey="assignedTo" className="text-sm" />
                      </div>
                      <Upload className="h-4 w-4 text-[#52baf3]" />
                    </div>
                    <div className="flex items-center justify-between p-2 border border-[#52baf3] rounded">
                      <div className="flex items-center gap-2">
                        <EditableLabel fieldKey="metric" className="text-sm" />
                      </div>
                      <Upload className="h-4 w-4 text-[#52baf3]" />
                    </div>
                    <div className="flex items-center justify-between p-2 border border-[#52baf3] rounded">
                      <div className="flex items-center gap-2">
                        <EditableLabel fieldKey="alertsThresholds" className="text-sm" />
                      </div>
                      <Upload className="h-4 w-4 text-[#52baf3]" />
                    </div>
                  </div>
                </div>

                {/* G. Classification & Regulatory Data */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-[#16569e]">G. Classification & Regulatory Data</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <DeletableField fieldKey="classificationProvider">
                      <EditableLabel fieldKey="classificationProvider" />
                      <Input 
                        value={componentData.classificationData.classificationProvider}
                        onChange={(e) => handleInputChange('classificationData.classificationProvider', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                    <DeletableField fieldKey="certificateNo">
                      <EditableLabel fieldKey="certificateNo" />
                      <Input 
                        value={componentData.classificationData.certificateNo}
                        onChange={(e) => handleInputChange('classificationData.certificateNo', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                    <DeletableField fieldKey="lastDataSurvey">
                      <EditableLabel fieldKey="lastDataSurvey" />
                      <Input 
                        value={componentData.classificationData.lastDataSurvey}
                        onChange={(e) => handleInputChange('classificationData.lastDataSurvey', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                    <DeletableField fieldKey="nextDataSurvey">
                      <EditableLabel fieldKey="nextDataSurvey" />
                      <Input 
                        value={componentData.classificationData.nextDataSurvey}
                        onChange={(e) => handleInputChange('classificationData.nextDataSurvey', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                    <DeletableField fieldKey="surveyType">
                      <EditableLabel fieldKey="surveyType" />
                      <Input 
                        value={componentData.classificationData.surveyType}
                        onChange={(e) => handleInputChange('classificationData.surveyType', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                    <DeletableField fieldKey="classRequirements">
                      <EditableLabel fieldKey="classRequirements" />
                      <Input 
                        value={componentData.classificationData.classRequirements}
                        onChange={(e) => handleInputChange('classificationData.classRequirements', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                    <DeletableField fieldKey="classCode">
                      <EditableLabel fieldKey="classCode" />
                      <Input 
                        value={componentData.classificationData.classCode}
                        onChange={(e) => handleInputChange('classificationData.classCode', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
                    <DeletableField fieldKey="information">
                      <EditableLabel fieldKey="information" />
                      <Input 
                        value={componentData.classificationData.information}
                        onChange={(e) => handleInputChange('classificationData.information', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
                      />
                    </DeletableField>
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
                          <EditableLabel fieldKey="woTitle" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="assignedTo" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="metric" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="dateUpdated" className="text-sm font-medium text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                          <EditableLabel fieldKey="frequency" className="text-sm font-medium text-gray-700" />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-5 gap-4 text-sm items-center">
                        <div>
                          <Input 
                            value={componentData.reqNo}
                            onChange={(e) => handleInputChange('reqNo', e.target.value)}
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            value={componentData.reqPart}
                            onChange={(e) => handleInputChange('reqPart', e.target.value)}
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            value={componentData.reqQty}
                            onChange={(e) => handleInputChange('reqQty', e.target.value)}
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            value={componentData.reqDate}
                            onChange={(e) => handleInputChange('reqDate', e.target.value)}
                            className="border-[#52baf3] border-2 focus:border-[#52baf3] text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            value={componentData.reqStatus}
                            onChange={(e) => handleInputChange('reqStatus', e.target.value)}
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

      {/* Field Deletion Confirmation Dialog */}
      <AlertDialog open={!!showDeleteConfirm} onOpenChange={cancelFieldDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{showDeleteConfirm ? fieldLabels[showDeleteConfirm as keyof typeof fieldLabels] : ''}" field? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelFieldDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmFieldDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default ComponentRegisterForm;