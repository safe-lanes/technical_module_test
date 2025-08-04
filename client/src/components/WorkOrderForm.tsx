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
import { ChevronDown, ChevronRight, FileText, ArrowLeft } from "lucide-react";

interface WorkOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: {
    id: string;
    workOrderNo: string;
    component: string;
    jobTitle: string;
    assignedTo: string;
    dueDate: string;
    status: string;
  } | null;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({
  isOpen,
  onClose,
  workOrder,
}) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    partA: true,
  });

  const [formData, setFormData] = useState({
    workOrder: "",
    jobTitle: "",
    component: "",
    jobType: "Scheduled Maintenance",
    assignedTo: "",
    approver: "",
    frequency: "Frequency",
    frequencyValue: "6 Months",
    status: "",
    jobCategory: "Mechanical",
    jobPriority: "Medium",
    classRelated: "Yes",
    briefWorkDescription: "",
  });

  React.useEffect(() => {
    if (workOrder) {
      setFormData({
        workOrder: workOrder.workOrderNo,
        jobTitle: workOrder.jobTitle,
        component: workOrder.component,
        jobType: "Scheduled Maintenance",
        assignedTo: workOrder.assignedTo,
        approver: "Chief Engineer",
        frequency: "Frequency",
        frequencyValue: "6 Months",
        status: workOrder.status,
        jobCategory: "Mechanical",
        jobPriority: "Medium",
        classRelated: "Yes",
        briefWorkDescription: "Replace fuel filters for the main engine as per the manufacturer's guidance XXX",
      });
    }
  }, [workOrder]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  if (!workOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle>Work Order Form</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Work Instructions
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
          {/* Left Sidebar - Navigation */}
          <div className="w-72 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-[#52baf3] text-white rounded">
                <div className="w-6 h-6 bg-white text-[#52baf3] rounded-full flex items-center justify-center text-sm font-semibold">
                  A
                </div>
                <span className="font-medium">Work Order Details</span>
              </div>
              <div className="flex items-center gap-2 p-3 text-gray-600 rounded hover:bg-gray-100 cursor-pointer">
                <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  B
                </div>
                <span className="font-medium">Work Completion Record</span>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {/* Part A - Work Order Details */}
            <div className="bg-white rounded-lg border border-gray-200 mb-4">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-200"
                onClick={() => toggleSection('partA')}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Part A - Work Order Details</h3>
                  <p className="text-sm text-gray-600 mt-1">Basic details about the work order</p>
                </div>
                {expandedSections.partA ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </div>

              {expandedSections.partA && (
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>A1. Work Order Information</h4>
                    
                    <div className="grid grid-cols-3 gap-6">
                      {/* Row 1 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Work Order</Label>
                        <div className="text-sm text-gray-900">{formData.workOrder}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Job Title</Label>
                        <div className="text-sm text-gray-900">{formData.jobTitle}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Component</Label>
                        <div className="text-sm text-gray-900">{formData.component}</div>
                      </div>

                      {/* Row 2 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Job Type</Label>
                        <div className="text-sm text-gray-900">{formData.jobType}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Assigned to</Label>
                        <div className="text-sm text-gray-900">{formData.assignedTo}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Approver</Label>
                        <div className="text-sm text-gray-900">{formData.approver}</div>
                      </div>

                      {/* Row 3 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Frequency or Running Hours based</Label>
                        <div className="text-sm text-gray-900">{formData.frequency}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Frequency or Running Hours Value</Label>
                        <div className="text-sm text-gray-900">{formData.frequencyValue}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Status</Label>
                        <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {formData.status}
                        </div>
                      </div>

                      {/* Row 4 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Job category</Label>
                        <div className="text-sm text-gray-900">{formData.jobCategory}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Job Priority</Label>
                        <div className="text-sm text-gray-900">{formData.jobPriority}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Class Related</Label>
                        <div className="text-sm text-gray-900">{formData.classRelated}</div>
                      </div>
                    </div>

                    {/* Brief Work Description */}
                    <div className="mt-6">
                      <Label className="text-sm text-[#8798ad]">Brief Work Description</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded border text-sm text-gray-900">
                        {formData.briefWorkDescription}
                      </div>
                    </div>
                  </div>

                  {/* A2. Required Spare Parts */}
                  <div className="mb-6">
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
                  <div className="mb-6">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkOrderForm;