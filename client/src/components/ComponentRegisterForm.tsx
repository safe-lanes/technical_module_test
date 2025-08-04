import React, { useState } from "react";
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
import { ArrowLeft, Plus, Trash2, Upload, ChevronRight, ChevronDown } from "lucide-react";

interface ComponentRegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (componentData: any) => void;
  existingComponent?: any;
}

interface ComponentNode {
  id: string;
  code: string;
  name: string;
  children?: ComponentNode[];
  isExpanded?: boolean;
}

const ComponentRegisterForm: React.FC<ComponentRegisterFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingComponent,
}) => {
  const [componentData, setComponentData] = useState({
    componentCode: "601.003.XXX",
    serialNo: "",
    drawingNo: "",
    location: "",
    critical: "",
    installationDate: "",
    commissionedDate: "",
    rating: "",
    conditionBased: "",
    noOfUnits: "",
    partSystemDepartment: "",
    partComponent: "",
    departmentIncharge: "",
    details: "",
    make: "",
  });

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["6", "6.1", "6.1.1"]));
  const [selectedNode, setSelectedNode] = useState<string | null>("6.1.1.1");

  const componentsTree: ComponentNode[] = [
    {
      id: "1",
      code: "1",
      name: "Ship General",
      children: []
    },
    {
      id: "2", 
      code: "2",
      name: "Hull",
      children: []
    },
    {
      id: "3",
      code: "3", 
      name: "Equipment for Cargo",
      children: []
    },
    {
      id: "4",
      code: "4",
      name: "Ship's Equipment",
      children: []
    },
    {
      id: "5",
      code: "5",
      name: "Equipment for Crew & Passengers",
      children: []
    },
    {
      id: "6",
      code: "6",
      name: "Machinery Main Components",
      isExpanded: true,
      children: [
        {
          id: "6.1",
          code: "60",
          name: "Diesel Engines for Propulsion",
          children: [
            {
              id: "6.1.1",
              code: "601",
              name: "Diesel Engines",
              children: [
                {
                  id: "6.1.1.1",
                  code: "601.003",
                  name: "ME Cylinder covers w/ valves",
                  children: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "7",
      code: "7",
      name: "Systems for Machinery Main Components",
      children: []
    },
    {
      id: "8",
      code: "8",
      name: "Ship Common Systems",
      children: []
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setComponentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const renderComponentTree = (nodes: ComponentNode[], level: number = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedNode === node.id;

      return (
        <div key={node.id}>
          <div
            className={`flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50 ${
              isSelected ? "bg-blue-50" : ""
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => setSelectedNode(node.id)}
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
                  <ChevronDown className="h-3 w-3 text-gray-600" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-gray-600" />
                )
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-400" />
              )}
            </button>
            <span className="text-xs text-gray-700">
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

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(componentData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-none h-[95vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">Component Register - Add Component</DialogTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white text-xs">
                + Add Edit Component
              </Button>
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white text-xs">
                ← Back
              </Button>
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white text-xs">
                Save
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Component Tree */}
          <div className="w-[25%] border-r bg-white">
            <div className="bg-[#52baf3] text-white px-3 py-2 text-sm font-medium">
              COMPONENTS
            </div>
            <div className="h-full overflow-y-auto p-2">
              {renderComponentTree(componentsTree)}
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex-1 bg-gray-50 overflow-y-auto">
            <div className="p-6">
              {/* Component Code Display */}
              <div className="mb-6">
                <div className="text-lg font-medium text-gray-900 mb-2">601.003.XXX</div>
              </div>

              {/* A. Component Information */}
              <div className="bg-white rounded-lg border mb-4">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="text-sm font-medium" style={{ color: '#16569e' }}>A. Component Information</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Serial No</Label>
                      <Input 
                        value={componentData.serialNo}
                        onChange={(e) => handleInputChange('serialNo', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Drawing No</Label>
                      <Input 
                        value={componentData.drawingNo}
                        onChange={(e) => handleInputChange('drawingNo', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Component Code</Label>
                      <Input 
                        value={componentData.componentCode}
                        onChange={(e) => handleInputChange('componentCode', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Eqpt / System / Category</Label>
                      <Input 
                        value={componentData.partSystemDepartment}
                        onChange={(e) => handleInputChange('partSystemDepartment', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Location</Label>
                      <Input 
                        value={componentData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Critical</Label>
                      <Input 
                        value={componentData.critical}
                        onChange={(e) => handleInputChange('critical', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Installation Date</Label>
                      <Input 
                        type="date"
                        value={componentData.installationDate}
                        onChange={(e) => handleInputChange('installationDate', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Commissioned Date</Label>
                      <Input 
                        type="date"
                        value={componentData.commissionedDate}
                        onChange={(e) => handleInputChange('commissionedDate', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Rating</Label>
                      <Input 
                        value={componentData.rating}
                        onChange={(e) => handleInputChange('rating', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Condition Based</Label>
                      <Input 
                        value={componentData.conditionBased}
                        onChange={(e) => handleInputChange('conditionBased', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">No of Units</Label>
                      <Input 
                        value={componentData.noOfUnits}
                        onChange={(e) => handleInputChange('noOfUnits', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Part / System Department</Label>
                      <Input 
                        value={componentData.partSystemDepartment}
                        onChange={(e) => handleInputChange('partSystemDepartment', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Part Component</Label>
                      <Input 
                        value={componentData.partComponent}
                        onChange={(e) => handleInputChange('partComponent', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Department Incharge</Label>
                      <Input 
                        value={componentData.departmentIncharge}
                        onChange={(e) => handleInputChange('departmentIncharge', e.target.value)}
                        className="text-sm border-2"
                        style={{ borderColor: '#52baf3' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Details</Label>
                    <Textarea 
                      value={componentData.details}
                      onChange={(e) => handleInputChange('details', e.target.value)}
                      className="text-sm border-2"
                      style={{ borderColor: '#52baf3' }}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* B. Running Hours & Condition Monitoring Metrics */}
              <div className="bg-white rounded-lg border mb-4">
                <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-medium" style={{ color: '#16569e' }}>B. Running Hours & Condition Monitoring Metrics</h3>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <Label className="text-xs text-gray-600 mb-2 block">Running Hours</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Input placeholder="Previous" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                      <Input placeholder="Temperature" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                      <Input placeholder="Pressure" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white text-xs mt-2">
                      + Add more
                    </Button>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Condition Monitoring Metrics</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Metric" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                      <Input placeholder="Mirror (Threshold)" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white text-xs mt-2">
                      + Add Metrics
                    </Button>
                  </div>
                </div>
              </div>

              {/* C. Work Orders */}
              <div className="bg-white rounded-lg border mb-4">
                <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-medium" style={{ color: '#16569e' }}>C. Work Orders</h3>
                  <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white text-xs">
                    + Add WO
                  </Button>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 font-medium text-gray-600">W.O No.</th>
                          <th className="text-left py-2 px-2 font-medium text-gray-600">Job Title</th>
                          <th className="text-left py-2 px-2 font-medium text-gray-600">Assigned to</th>
                          <th className="text-left py-2 px-2 font-medium text-gray-600">Due Date</th>
                          <th className="text-left py-2 px-2 font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-2">WO-2025-03</td>
                          <td className="py-2 px-2">Main Engine Overhaul - Replace Main bearings</td>
                          <td className="py-2 px-2">Chief Engineer</td>
                          <td className="py-2 px-2">02-Jun-2025</td>
                          <td className="py-2 px-2">
                            <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">Due</span>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-2">WO-2025-04</td>
                          <td className="py-2 px-2">Main Engine Overhaul - Replace Main bearings</td>
                          <td className="py-2 px-2">Chief Engineer</td>
                          <td className="py-2 px-2">02-Jun-2025</td>
                          <td className="py-2 px-2">
                            <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">Due (Grace P)</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* D. Maintenance History */}
              <div className="bg-white rounded-lg border mb-4">
                <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-medium" style={{ color: '#16569e' }}>D. Maintenance History</h3>
                  <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white text-xs">
                    + Add M History
                  </Button>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 font-medium text-gray-600">Work Order No</th>
                          <th className="text-left py-2 px-2 font-medium text-gray-600">Performed By</th>
                          <th className="text-left py-2 px-2 font-medium text-gray-600">Hard Time (Hrs)</th>
                          <th className="text-left py-2 px-2 font-medium text-gray-600">Completion Date</th>
                          <th className="text-left py-2 px-2 font-medium text-gray-600">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-2">WO-2025-04</td>
                          <td className="py-2 px-2">2nd Eng</td>
                          <td className="py-2 px-2">04-Jan-2024</td>
                          <td className="py-2 px-2">08-Jan-2024</td>
                          <td className="py-2 px-2">
                            <Button size="sm" variant="outline" className="text-xs">Completed</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* E. Spares */}
              <div className="bg-white rounded-lg border mb-4">
                <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-medium" style={{ color: '#16569e' }}>E. Spares</h3>
                  <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white text-xs">
                    + Add Spares
                  </Button>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Part Code</Label>
                      <Input placeholder="SP-2025-001" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Part Name</Label>
                      <Input placeholder="Fuel Injection Pump" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Min</Label>
                      <Input placeholder="2" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Critical</Label>
                      <Input placeholder="Y" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Location</Label>
                      <Input placeholder="Store Room 2" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* F. Drawings & Manuals */}
              <div className="bg-white rounded-lg border mb-4">
                <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-medium" style={{ color: '#16569e' }}>F. Drawings & Manuals</h3>
                  <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white text-xs">
                    + Add Document
                  </Button>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <Input placeholder="Equipment Manual" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    <Button size="sm" variant="outline" className="text-xs">Upload</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <Input placeholder="Maintenance Manual" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    <Button size="sm" variant="outline" className="text-xs">Upload</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <Input placeholder="Installation Guide" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    <Button size="sm" variant="outline" className="text-xs">Upload</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <Input placeholder="Trouble shooting Guide" className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    <Button size="sm" variant="outline" className="text-xs">Upload</Button>
                  </div>
                </div>
              </div>

              {/* G. Classification & Regulatory Data */}
              <div className="bg-white rounded-lg border mb-6">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="text-sm font-medium" style={{ color: '#16569e' }}>G. Classification & Regulatory Data</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Classification Society</Label>
                      <Input className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Certificate No</Label>
                      <Input className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Last Date Survey</Label>
                      <Input className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Next Date Survey</Label>
                      <Input className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Survey Type</Label>
                      <Input className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Class Requirements</Label>
                      <Input className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Class Code</Label>
                      <Input className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Maintenance</Label>
                      <Input className="text-sm border-2" style={{ borderColor: '#52baf3' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentRegisterForm;