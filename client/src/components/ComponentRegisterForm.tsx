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
import { ArrowLeft, Plus, Upload, Eye, Trash2, Edit3, X } from "lucide-react";

interface ComponentRegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (componentData: any) => void;
  parentComponent?: { code: string; name: string } | null;
}

const ComponentRegisterForm: React.FC<ComponentRegisterFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  parentComponent,
}) => {
  // Auto-generate component code based on parent
  const generateComponentCode = () => {
    if (!parentComponent) return "";
    // This would calculate the next available number at this level
    // For now, using a placeholder .1 suffix
    return `${parentComponent.code}.1`;
  };

  const [componentData, setComponentData] = useState({
    componentId: "601.003.XXX",
    serialNo: "",
    drawingNo: "",
    componentCode: generateComponentCode(),
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

  // Update component code when parent component changes
  useEffect(() => {
    setComponentData(prev => ({
      ...prev,
      componentCode: generateComponentCode()
    }));
  }, [parentComponent]);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setComponentData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setComponentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = () => {
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
            <DialogTitle>Component Register - Add Component</DialogTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                <Plus className="h-4 w-4 mr-1" />
                Add Sub Component
              </Button>
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
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
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 py-1">
                  <span>▶</span>
                  <span>1. Ship General</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <span>▶</span>
                  <span>2. Hull</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <span>▶</span>
                  <span>3. Equipment for Cargo</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <span>▶</span>
                  <span>4. Ship's Accommodation</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <span>▶</span>
                  <span>5. Equipment for Crew & Passengers</span>
                </div>
                <div className="flex items-center gap-2 py-1 bg-white/20 px-2 rounded">
                  <span>▼</span>
                  <span>6. Machinery Main Components</span>
                </div>
                <div className="ml-6 space-y-1">
                  <div className="flex items-center gap-2 py-1">
                    <span>▶</span>
                    <span>60. Diesel Engines for Propulsion</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <div className="flex items-center gap-2 py-1">
                      <span>▶</span>
                      <span>601. Diesel Engines</span>
                    </div>
                    <div className="ml-4">
                      <div className="bg-[#4aa3d9] px-2 py-1 rounded text-xs">
                        601.003 Main Diesel Engines
                      </div>
                      <div className="ml-4 mt-1">
                        <div className="text-xs py-1">601.003 ME cylinder covers w/ valves</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <span>▶</span>
                  <span>7. Systems for Machinery Main Components</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <span>▶</span>
                  <span>8. Ship Common Systems</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{componentData.componentId}</h3>
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
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-[#8798ad]">Eqpt / System Category</Label>
                        <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                        <X className="h-3 w-3 text-red-500 cursor-pointer" />
                      </div>
                      <Input 
                        value={componentData.equipmentCategory}
                        onChange={(e) => handleInputChange('equipmentCategory', e.target.value)}
                        className="border-[#52baf3] border-2 focus:border-[#52baf3]"
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
                          <span>W.O No.</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Job Title</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Assigned to</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Due Date</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Status</span>
                          <Edit3 className="h-3 w-3 text-[#52baf3] cursor-pointer" />
                          <X className="h-3 w-3 text-red-500 cursor-pointer" />
                        </div>
                        <div></div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="px-4 py-3">
                        <div className="grid grid-cols-6 gap-4 text-sm items-center">
                          <div className="text-gray-900">WO-2025-01</div>
                          <div className="text-gray-900">Main Engine Overhaul - Replace Main Bearings</div>
                          <div className="text-gray-900">Chief Engineer</div>
                          <div className="text-gray-900">02-Jun-2025</div>
                          <div>
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                              Done
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <div className="grid grid-cols-6 gap-4 text-sm items-center">
                          <div className="text-gray-900">WO-2025-04</div>
                          <div className="text-gray-900">Main Engine Overhaul - Replace Main Bearings</div>
                          <div className="text-gray-900">Chief Engineer</div>
                          <div className="text-gray-900">02-Jun-2025</div>
                          <div>
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                              Overdue-by 30
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
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