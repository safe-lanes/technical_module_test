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
import { ChevronDown, ChevronRight, FileText, ArrowLeft } from "lucide-react";
import WorkInstructionsDialog from "./WorkInstructionsDialog";
import { useToast } from "@/hooks/use-toast";

interface WorkOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: any) => void;
  component?: {
    code: string;
    name: string;
  };
  workOrderTemplate?: any;
  executionId?: string;
  mode?: 'template' | 'execution';
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  component,
  workOrderTemplate,
  executionId,
  mode = 'template'
}) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'partA' | 'partB'>('partA');
  const [isWorkInstructionsOpen, setIsWorkInstructionsOpen] = useState(false);

  // Template data (Part A)
  const [templateData, setTemplateData] = useState({
    woTitle: "",
    component: component?.name || "",
    componentCode: component?.code || "",
    woTemplateCode: "",
    maintenanceBasis: "Calendar",
    frequencyValue: "",
    frequencyUnit: "Months",
    taskType: "Inspection",
    assignedTo: "",
    approver: "",
    jobPriority: "Medium",
    classRelated: "No",
    briefWorkDescription: "",
    nextDueDate: "",
    nextDueReading: "",
    requiredSpareParts: [],
    requiredTools: [],
    safetyRequirements: {
      ppe: "",
      permits: "",
      other: ""
    },
    workHistory: []
  });

  // Execution data (Part B)
  const [executionData, setExecutionData] = useState({
    woExecutionId: "",
    riskAssessment: "No",
    safetyChecklists: "No",
    operationalForms: "No",
    startDateTime: "",
    completionDateTime: "",
    assignedTo: "",
    performedBy: "",
    noOfPersons: "",
    totalTimeHours: "",
    manhours: "",
    workCarriedOut: "",
    jobExperienceNotes: "",
    previousReading: "",
    currentReading: "",
    sparePartsConsumed: []
  });

  // Ranks for dropdowns
  const ranks = [
    "Master",
    "Chief Officer",
    "2nd Officer",
    "3rd Officer",
    "Chief Engineer",
    "2nd Engineer",
    "3rd Engineer",
    "4th Engineer",
    "Deck Cadet",
    "Engine Cadet",
    "Bosun",
    "Pumpman",
    "Electrician",
    "Fitter",
    "Able Seaman",
    "Ordinary Seaman",
    "Oiler",
    "Wiper",
    "Cook",
    "Steward"
  ];

  // Generate WO Template Code
  const generateWOTemplateCode = () => {
    if (!component?.code || !templateData.taskType || !templateData.maintenanceBasis) return "";
    
    const taskCodes: Record<string, string> = {
      "Inspection": "INS",
      "Overhaul": "OH",
      "Service": "SRV",
      "Testing": "TST"
    };
    
    let freqTag = "";
    if (templateData.maintenanceBasis === "Calendar" && templateData.frequencyValue && templateData.frequencyUnit) {
      const unitCode = templateData.frequencyUnit[0].toUpperCase();
      freqTag = `${unitCode}${templateData.frequencyValue}`;
    } else if (templateData.maintenanceBasis === "Running Hours" && templateData.frequencyValue) {
      freqTag = `RH${templateData.frequencyValue}`;
    }
    
    const taskCode = taskCodes[templateData.taskType] || "";
    return `WO-${component.code}-${taskCode}${freqTag}`.toUpperCase();
  };

  // Generate WO Execution ID
  const generateWOExecutionId = () => {
    const year = new Date().getFullYear();
    const templateCode = templateData.woTemplateCode || generateWOTemplateCode();
    // In real implementation, get sequence from database
    const sequence = "01";
    return `${year}-${templateCode}-${sequence}`;
  };

  // Update template code when relevant fields change
  useEffect(() => {
    if (!templateData.woTemplateCode) {
      const newCode = generateWOTemplateCode();
      setTemplateData(prev => ({ ...prev, woTemplateCode: newCode }));
    }
  }, [templateData.taskType, templateData.maintenanceBasis, templateData.frequencyValue, templateData.frequencyUnit]);

  // Load existing template data
  useEffect(() => {
    if (workOrderTemplate) {
      setTemplateData(prev => ({
        ...prev,
        ...workOrderTemplate
      }));
    }
  }, [workOrderTemplate]);

  // Load execution data
  useEffect(() => {
    if (executionId && mode === 'execution') {
      // Load execution data from database
      // For now, generate a new ID
      setExecutionData(prev => ({
        ...prev,
        woExecutionId: generateWOExecutionId()
      }));
    }
  }, [executionId, mode]);

  const selectSection = (section: 'partA' | 'partB') => {
    setActiveSection(section);
  };

  const handleTemplateChange = (field: string, value: string) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExecutionChange = (field: string, value: string) => {
    setExecutionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (activeSection === 'partA') {
      // Validate template data
      if (!templateData.woTitle) {
        toast({
          title: "Validation Error",
          description: "WO Title is required",
          variant: "destructive"
        });
        return;
      }
      if (!templateData.maintenanceBasis) {
        toast({
          title: "Validation Error",
          description: "Maintenance Basis is required",
          variant: "destructive"
        });
        return;
      }
      if (!templateData.frequencyValue) {
        toast({
          title: "Validation Error",
          description: "Frequency value is required",
          variant: "destructive"
        });
        return;
      }
      if (!templateData.taskType) {
        toast({
          title: "Validation Error",
          description: "Task Type is required",
          variant: "destructive"
        });
        return;
      }
      if (!templateData.assignedTo) {
        toast({
          title: "Validation Error",
          description: "Assigned To is required",
          variant: "destructive"
        });
        return;
      }

      // Calculate next due
      if (templateData.maintenanceBasis === "Calendar") {
        const today = new Date();
        const freq = parseInt(templateData.frequencyValue);
        if (templateData.frequencyUnit === "Days") {
          today.setDate(today.getDate() + freq);
        } else if (templateData.frequencyUnit === "Weeks") {
          today.setDate(today.getDate() + (freq * 7));
        } else if (templateData.frequencyUnit === "Months") {
          today.setMonth(today.getMonth() + freq);
        } else if (templateData.frequencyUnit === "Years") {
          today.setFullYear(today.getFullYear() + freq);
        }
        templateData.nextDueDate = today.toISOString().split('T')[0];
      }

      if (onSubmit) {
        onSubmit({ type: 'template', data: templateData });
      }
    } else {
      // Validate execution data
      if (!executionData.startDateTime) {
        toast({
          title: "Validation Error",
          description: "Start Date/Time is required",
          variant: "destructive"
        });
        return;
      }
      if (!executionData.completionDateTime) {
        toast({
          title: "Validation Error",
          description: "Completion Date/Time is required",
          variant: "destructive"
        });
        return;
      }
      if (!executionData.assignedTo) {
        toast({
          title: "Validation Error",
          description: "Assigned To is required",
          variant: "destructive"
        });
        return;
      }
      if (!executionData.performedBy) {
        toast({
          title: "Validation Error",
          description: "Performed By is required",
          variant: "destructive"
        });
        return;
      }
      if (templateData.maintenanceBasis === "Running Hours") {
        if (!executionData.previousReading || !executionData.currentReading) {
          toast({
            title: "Validation Error",
            description: "Previous and Current readings are required for Running Hours based WOs",
            variant: "destructive"
          });
          return;
        }
      }

      if (onSubmit) {
        onSubmit({ type: 'execution', data: executionData });
      }
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] max-w-none h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 pr-12">
          <div className="flex items-center justify-between">
            <DialogTitle>Work Order Form</DialogTitle>
            <div className="flex items-center gap-2">
              {activeSection === 'partA' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsWorkInstructionsOpen(true)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Work Instructions
                </Button>
              )}
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
          {/* Left Sidebar - Navigation */}
          <div className="w-72 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              <div 
                className={`flex items-center gap-2 p-3 rounded cursor-pointer ${
                  activeSection === 'partA' ? 'bg-[#16569e] text-white' : 'bg-transparent text-[#8a8a8a] hover:bg-gray-100'
                }`}
                onClick={() => selectSection('partA')}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                  activeSection === 'partA' ? 'bg-white text-[#52baf3]' : 'bg-gray-300 text-white'
                }`}>
                  A
                </div>
                <span className="font-medium">Work Order Details</span>
              </div>
              <div 
                className={`flex items-center gap-2 p-3 rounded cursor-pointer ${
                  activeSection === 'partB' ? 'bg-[#16569e] text-white' : 'bg-transparent text-[#8a8a8a] hover:bg-gray-100'
                }`}
                onClick={() => selectSection('partB')}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                  activeSection === 'partB' ? 'bg-white text-[#52baf3]' : 'bg-gray-300 text-white'
                }`}>
                  B
                </div>
                <span className="font-medium">Work Completion Record</span>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {/* Part A - Work Order Details (Template) */}
            {activeSection === 'partA' && (
              <div className="border border-gray-200 rounded-lg mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Part A - Work Order Details</h3>
                </div>

                <div className="p-6">
                  {/* Header Section */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">WO Title *</Label>
                        <Input 
                          value={templateData.woTitle} 
                          onChange={(e) => handleTemplateChange('woTitle', e.target.value)}
                          className="text-sm"
                          placeholder="Enter work order title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Component</Label>
                        <div className="text-sm text-gray-900 p-2 bg-gray-100 rounded">{templateData.component}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Component Code</Label>
                        <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">{templateData.componentCode}</div>
                      </div>
                    </div>
                  </div>

                  {/* A1. Work Order Information */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>A1. Work Order Information</h4>
                    
                    <div className="grid grid-cols-3 gap-6">
                      {/* Row 1 - Maintenance Basis */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Maintenance Basis *</Label>
                        <Select value={templateData.maintenanceBasis} onValueChange={(value) => handleTemplateChange('maintenanceBasis', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Calendar">Calendar</SelectItem>
                            <SelectItem value="Running Hours">Running Hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Frequency Fields */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">
                          {templateData.maintenanceBasis === "Calendar" ? "Every *" : "Every (Hours) *"}
                        </Label>
                        <Input 
                          type="number"
                          value={templateData.frequencyValue} 
                          onChange={(e) => handleTemplateChange('frequencyValue', e.target.value)}
                          className="text-sm"
                          placeholder={templateData.maintenanceBasis === "Running Hours" ? "e.g., 1000" : ""}
                        />
                      </div>
                      
                      {templateData.maintenanceBasis === "Calendar" && (
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Unit *</Label>
                          <Select value={templateData.frequencyUnit} onValueChange={(value) => handleTemplateChange('frequencyUnit', value)}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Days">Days</SelectItem>
                              <SelectItem value="Weeks">Weeks</SelectItem>
                              <SelectItem value="Months">Months</SelectItem>
                              <SelectItem value="Years">Years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Row 2 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Task Type *</Label>
                        <Select value={templateData.taskType} onValueChange={(value) => handleTemplateChange('taskType', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inspection">Inspection</SelectItem>
                            <SelectItem value="Overhaul">Overhaul</SelectItem>
                            <SelectItem value="Service">Service</SelectItem>
                            <SelectItem value="Testing">Testing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Assigned To *</Label>
                        <Select value={templateData.assignedTo} onValueChange={(value) => handleTemplateChange('assignedTo', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select rank" />
                          </SelectTrigger>
                          <SelectContent>
                            {ranks.map(rank => (
                              <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Approver</Label>
                        <Select value={templateData.approver} onValueChange={(value) => handleTemplateChange('approver', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select rank (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {ranks.map(rank => (
                              <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Row 3 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Job Priority</Label>
                        <Select value={templateData.jobPriority} onValueChange={(value) => handleTemplateChange('jobPriority', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Class Related</Label>
                        <Select value={templateData.classRelated} onValueChange={(value) => handleTemplateChange('classRelated', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">
                          {templateData.maintenanceBasis === "Calendar" ? "Next Due Date" : "Next Due Reading"}
                        </Label>
                        <div className="text-sm text-gray-900 p-2 bg-gray-100 rounded">
                          {templateData.maintenanceBasis === "Calendar" 
                            ? (templateData.nextDueDate || "Calculated on save")
                            : (templateData.nextDueReading || "Calculated on save")}
                        </div>
                      </div>
                    </div>

                    {/* Brief Work Description */}
                    <div className="mt-6">
                      <Label className="text-sm text-[#8798ad]">Brief Work Description</Label>
                      <Textarea 
                        value={templateData.briefWorkDescription} 
                        onChange={(e) => handleTemplateChange('briefWorkDescription', e.target.value)}
                        className="mt-2 text-sm"
                        rows={3}
                        placeholder="Enter work description..."
                      />
                    </div>
                  </div>

                  {/* A2. Required Spare Parts */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium" style={{ color: '#16569e' }}>A2. Required Spare Parts</h4>
                      <button className="text-sm text-blue-600 hover:text-blue-800">+ Add Spare Part</button>
                    </div>
                    
                    <div className="border border-gray-200 rounded">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                          <div>Part No</div>
                          <div>Description</div>
                          <div>Quantity Required</div>
                          <div>ROB</div>
                          <div>Status</div>
                          <div></div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-6 gap-4 text-sm">
                            <div className="text-gray-900">SP-001</div>
                            <div className="text-gray-900">O-Ring Seal</div>
                            <div className="text-gray-900">2</div>
                            <div className="text-gray-900">5</div>
                            <div>
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Available
                              </span>
                            </div>
                            <div></div>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-6 gap-4 text-sm">
                            <div className="text-gray-900">SP-002</div>
                            <div className="text-gray-900">Filter Element</div>
                            <div className="text-gray-900">1</div>
                            <div className="text-gray-900">0</div>
                            <div>
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                Order Required
                              </span>
                            </div>
                            <div></div>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-6 gap-4 text-sm">
                            <div className="text-gray-900">SP-003</div>
                            <div className="text-gray-900">Bearing</div>
                            <div className="text-gray-900">2</div>
                            <div className="text-gray-900">2</div>
                            <div>
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Available
                              </span>
                            </div>
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* A3. Required Tools & Equipment */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium" style={{ color: '#16569e' }}>A3. Required Tools & Equipment</h4>
                      <button className="text-sm text-blue-600 hover:text-blue-800">+ Add Tool / Eqpt...</button>
                    </div>
                    
                    <div className="border border-gray-200 rounded">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                          <div>Tool / Equipment</div>
                          <div>Quantity Required</div>
                          <div>Current ROB</div>
                          <div>Status</div>
                          <div></div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-5 gap-4 text-sm">
                            <div className="text-gray-900">Hydraulic Jack</div>
                            <div className="text-gray-900">2</div>
                            <div className="text-gray-900">5</div>
                            <div>
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Available
                              </span>
                            </div>
                            <div></div>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-5 gap-4 text-sm">
                            <div className="text-gray-900">Bearing Puller Set</div>
                            <div className="text-gray-900">1</div>
                            <div className="text-gray-900">0</div>
                            <div>
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                Order Required
                              </span>
                            </div>
                            <div></div>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-5 gap-4 text-sm">
                            <div className="text-gray-900">Torque Wrench</div>
                            <div className="text-gray-900">2</div>
                            <div className="text-gray-900">2</div>
                            <div>
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Available
                              </span>
                            </div>
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* A4. Safety Requirements */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>A4. Safety Requirements</h4>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">PPE Requirements:</Label>
                          <div className="text-sm text-gray-900">Leather Gloves, Goggles, Safety Helmet</div>
                        </div>
                        <div></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Permit Requirements:</Label>
                          <div className="text-sm text-gray-900">Enclosed Space Entry Permit</div>
                        </div>
                        <div></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Other Safety Requirements:</Label>
                          <div className="text-sm text-gray-900">Free Text</div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>

                  {/* A5. Work History (Executions for this template) */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>A5. Work History</h4>
                    
                    <div className="border border-gray-200 rounded">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-700">
                          <div>WO Execution ID</div>
                          <div>Assigned To</div>
                          <div>Performed By</div>
                          <div>Total Time (Hrs)</div>
                          <div>{templateData.maintenanceBasis === "Calendar" ? "Due Date" : "Due Reading"}</div>
                          <div>Completion Date</div>
                          <div>Status</div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {templateData.workHistory && templateData.workHistory.length > 0 ? (
                          templateData.workHistory.map((execution: any, index: number) => (
                            <div key={index} className="px-4 py-3 cursor-pointer hover:bg-gray-50" onClick={() => {
                              // Open Part B with this execution
                              setExecutionData(execution);
                              setActiveSection('partB');
                            }}>
                              <div className="grid grid-cols-7 gap-4 text-sm items-center">
                                <div className="text-gray-900">{execution.woExecutionId}</div>
                                <div className="text-gray-900">{execution.assignedTo}</div>
                                <div className="text-gray-900">{execution.performedBy}</div>
                                <div className="text-gray-900">{execution.totalTimeHours}</div>
                                <div className="text-gray-900">{execution.dueDate || execution.dueReading}</div>
                                <div className="text-gray-900">{execution.completionDate}</div>
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                    {execution.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500 text-sm">
                            No work history for this template yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Part B - Work Completion Record (EXECUTION) */}
            {activeSection === 'partB' && (
              <div className="border border-gray-200 rounded-lg mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#16569e]">Part B - Work Completion Record (EXECUTION)</h3>
                  <p className="text-sm text-[#52baf3]">Record a single performance of the template</p>
                </div>

                <div className="p-6">
                  {/* WO Execution ID Header */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <Label className="text-sm text-[#8798ad]">WO Execution ID</Label>
                    <div className="text-sm font-medium text-gray-900 p-2 bg-gray-100 rounded inline-block">
                      {executionData.woExecutionId || generateWOExecutionId()}
                    </div>
                  </div>
                  {/* B1. Risk Assessment, Checklists & Records */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>B1. Risk Assessment, Checklists & Records</h4>
                    
                    <div className="space-y-4">
                      {/* B1.1 Risk Assessment Completed / Reviewed */}
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6">
                          <Label className="text-sm text-gray-900">B1.1 Risk Assessment Completed / Reviewed:</Label>
                        </div>
                        <div className="col-span-3 flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="riskAssessment" value="yes" defaultChecked className="text-blue-600" />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="riskAssessment" value="no" className="text-blue-600" />
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="riskAssessment" value="na" className="text-blue-600" />
                            <span className="text-sm">NA</span>
                          </label>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-xs">Upload</Button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h8a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8 8a1 1 0 012 0v3a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V8z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* B1.2 Safety Checklists Completed */}
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6">
                          <Label className="text-sm text-gray-900">B1.2 Safety Checklists Completed (As applicable):</Label>
                        </div>
                        <div className="col-span-3 flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="safetyChecklists" value="yes" defaultChecked className="text-blue-600" />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="safetyChecklists" value="no" className="text-blue-600" />
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="safetyChecklists" value="na" className="text-blue-600" />
                            <span className="text-sm">NA</span>
                          </label>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-xs">Upload</Button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h8a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8 8a1 1 0 012 0v3a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V8z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* B1.3 Operational Forms Completed */}
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6">
                          <Label className="text-sm text-gray-900">B1.3 Operational Forms Completed (As applicable):</Label>
                        </div>
                        <div className="col-span-3 flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="operationalForms" value="yes" checked={executionData.operationalForms === "Yes"} onChange={() => handleExecutionChange('operationalForms', 'Yes')} className="text-blue-600" />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="operationalForms" value="no" className="text-blue-600" />
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="operationalForms" value="na" className="text-blue-600" />
                            <span className="text-sm">NA</span>
                          </label>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-xs">Upload</Button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h8a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8 8a1 1 0 012 0v3a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V8z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B2. Details of Work Carried Out */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>B2. Details of Work Carried Out</h4>
                    
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-gray-900 mb-4">B2.1 Work Duration:</h5>
                      
                      <div className="grid grid-cols-3 gap-6 mb-4">
                        {/* Row 1 */}
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Start Date & Time *</Label>
                          <Input 
                            type="datetime-local" 
                            value={executionData.startDateTime}
                            onChange={(e) => handleExecutionChange('startDateTime', e.target.value)}
                            className="w-full" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Completion Date & Time *</Label>
                          <Input 
                            type="datetime-local" 
                            value={executionData.completionDateTime}
                            onChange={(e) => handleExecutionChange('completionDateTime', e.target.value)}
                            className="w-full" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Assigned To *</Label>
                          <Select value={executionData.assignedTo} onValueChange={(value) => handleExecutionChange('assignedTo', value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select rank" />
                            </SelectTrigger>
                            <SelectContent>
                              {ranks.map(rank => (
                                <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 mb-4">
                        {/* Row 2 */}
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Performed by *</Label>
                          <Select value={executionData.performedBy} onValueChange={(value) => handleExecutionChange('performedBy', value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select rank" />
                            </SelectTrigger>
                            <SelectContent>
                              {ranks.map(rank => (
                                <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">No of Persons in the team</Label>
                          <Input 
                            type="number" 
                            value={executionData.noOfPersons}
                            onChange={(e) => {
                              handleExecutionChange('noOfPersons', e.target.value);
                              // Calculate manhours
                              const persons = parseInt(e.target.value) || 0;
                              const hours = parseFloat(executionData.totalTimeHours) || 0;
                              handleExecutionChange('manhours', (persons * hours).toString());
                            }}
                            className="w-full" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Total Time Taken (Hours)</Label>
                          <Input 
                            type="number" 
                            value={executionData.totalTimeHours}
                            onChange={(e) => {
                              handleExecutionChange('totalTimeHours', e.target.value);
                              // Calculate manhours
                              const persons = parseInt(executionData.noOfPersons) || 0;
                              const hours = parseFloat(e.target.value) || 0;
                              handleExecutionChange('manhours', (persons * hours).toString());
                            }}
                            className="w-full" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        {/* Row 3 */}
                        <div></div>
                        <div></div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Manhours (Auto)</Label>
                          <div className="text-sm text-gray-900 p-2 bg-gray-100 rounded">
                            {executionData.manhours || "0"}
                          </div>
                        </div>
                      </div>
                      
                      {/* Work Carried Out */}
                      <div className="space-y-2 mb-4">
                        <Label className="text-sm text-[#8798ad]">Work Carried Out</Label>
                        <Textarea 
                          value={executionData.workCarriedOut}
                          onChange={(e) => handleExecutionChange('workCarriedOut', e.target.value)}
                          className="w-full min-h-[80px]" 
                          placeholder="Describe work carried out..."
                        />
                      </div>
                      
                      {/* Job Experience / Notes */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Job Experience / Notes (to be retained for future)</Label>
                        <Textarea 
                          value={executionData.jobExperienceNotes}
                          onChange={(e) => handleExecutionChange('jobExperienceNotes', e.target.value)}
                          className="w-full min-h-[80px]" 
                          placeholder="Enter job experience notes..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* B3. Running Hours (Conditional - only for Running Hours based WOs) */}
                  {templateData.maintenanceBasis === "Running Hours" && (
                    <div className="border border-gray-200 rounded-lg p-4 mb-6">
                      <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>B3. Running Hours</h4>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Previous reading *</Label>
                          <Input 
                            type="number" 
                            value={executionData.previousReading}
                            onChange={(e) => handleExecutionChange('previousReading', e.target.value)}
                            placeholder="Enter previous hours reading"
                            className="w-full" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Current Reading *</Label>
                          <Input 
                            type="number" 
                            value={executionData.currentReading}
                            onChange={(e) => handleExecutionChange('currentReading', e.target.value)}
                            placeholder="Enter current hours reading"
                            className="w-full" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* B4. Spare Parts Consumed */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium" style={{ color: '#16569e' }}>B4. Spare Parts Consumed</h4>
                      <button className="text-sm text-blue-600 hover:text-blue-800">+ Add Spare Part</button>
                    </div>
                    
                    <div className="border border-gray-200 rounded">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                          <div>Part No</div>
                          <div>Description</div>
                          <div>Quantity Consumed</div>
                          <div>Comments (if any)</div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-4 gap-4 text-sm items-center">
                            <div className="text-gray-900">SP -001</div>
                            <div className="text-gray-900">O-Ring Seal</div>
                            <div>
                              <Input type="text" className="w-full" defaultValue="2" />
                            </div>
                            <div>
                              <Input type="text" className="w-full" />
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-4 gap-4 text-sm items-center">
                            <div className="text-gray-900">SP-002</div>
                            <div className="text-gray-900">Filter Element</div>
                            <div>
                              <Input type="text" className="w-full" defaultValue="1" />
                            </div>
                            <div>
                              <Input type="text" className="w-full" />
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-4 gap-4 text-sm items-center">
                            <div className="text-gray-900">SP -003</div>
                            <div className="text-gray-900">Bearing</div>
                            <div>
                              <Input type="text" className="w-full" defaultValue="2" />
                            </div>
                            <div>
                              <Input type="text" className="w-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end mt-6">
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
            )}
          </div>
        </div>
      </DialogContent>
      
      {/* Work Instructions Dialog */}
      <WorkInstructionsDialog 
        isOpen={isWorkInstructionsOpen}
        onClose={() => setIsWorkInstructionsOpen(false)}
      />
    </Dialog>
  );
};

export default WorkOrderForm;