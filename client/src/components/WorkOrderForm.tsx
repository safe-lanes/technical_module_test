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
  const [activeSection, setActiveSection] = useState<'partA' | 'partB'>('partA');

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

  const selectSection = (section: 'partA' | 'partB') => {
    setActiveSection(section);
  };

  if (!workOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] max-w-none h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 pr-12">
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
            {/* Part A - Work Order Details */}
            {activeSection === 'partA' && (
              <div className="border border-gray-200 rounded-lg mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Part A - Work Order Details</h3>
                  <p className="text-sm text-gray-600">Basic details about the work order</p>
                </div>

                <div className="p-6">
                  {/* A1. Work Order Information */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
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

                  {/* A5. Work History */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>A5. Work History</h4>
                    
                    <div className="border border-gray-200 rounded">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-700">
                          <div>Work Order No.</div>
                          <div>Assigned To</div>
                          <div>Performed By</div>
                          <div>Total Time (Hrs)</div>
                          <div>Due Date</div>
                          <div>Completion Date</div>
                          <div>Status</div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-7 gap-4 text-sm items-center">
                            <div className="text-gray-900">WO-602.01-002</div>
                            <div className="text-gray-900">Chief Engineer</div>
                            <div className="text-gray-900">Chief Engineer</div>
                            <div className="text-gray-900">2</div>
                            <div className="text-gray-900">14-02-2025</div>
                            <div className="text-gray-900">12-02-2025</div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Completed
                              </span>
                              <button className="text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-7 gap-4 text-sm items-center">
                            <div className="text-gray-900">WO-602.01-002</div>
                            <div className="text-gray-900">Chief Engineer</div>
                            <div className="text-gray-900"></div>
                            <div className="text-gray-900"></div>
                            <div className="text-gray-900">14-01-2025</div>
                            <div className="text-gray-900"></div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                Postponed
                              </span>
                              <button className="text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Part B - Work Completion Record */}
            {activeSection === 'partB' && (
              <div className="border border-gray-200 rounded-lg mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#16569e]">Part B - Work Completion Record</h3>
                  <p className="text-sm text-[#52baf3]">Enter work completion details here including Risk assessment, checklists, comments etc.</p>
                </div>

                <div className="p-6">
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
                            <input type="radio" name="operationalForms" value="yes" defaultChecked className="text-blue-600" />
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
                          <Label className="text-sm text-[#8798ad]">Start Date</Label>
                          <Input type="date" className="w-full" placeholder="dd-mm-yyyy" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Start Time</Label>
                          <Input type="text" className="w-full" defaultValue="1045" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Assigned To</Label>
                          <Input type="text" className="w-full" defaultValue="Chief Engineer" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 mb-4">
                        {/* Row 2 */}
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Completion Date</Label>
                          <Input type="date" className="w-full" placeholder="dd-mm-yyyy" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Completion Time</Label>
                          <Input type="text" className="w-full" defaultValue="1200" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Performed by</Label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                            <option>Chief Engineer</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        {/* Row 3 */}
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">No of Persons in the team</Label>
                          <Input type="text" className="w-full" defaultValue="3" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Total Time Taken (Hours)</Label>
                          <Input type="text" className="w-full" defaultValue="3" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Manhours</Label>
                          <Input type="text" className="w-full" defaultValue="3.3" />
                        </div>
                      </div>
                      
                      {/* Work Carried Out */}
                      <div className="space-y-2 mb-4">
                        <Label className="text-sm text-[#8798ad]">Work Carried Out</Label>
                        <Textarea 
                          className="w-full min-h-[80px]" 
                          placeholder="Work carried out"
                        />
                      </div>
                      
                      {/* Job Experience / Notes */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Job Experience / Notes</Label>
                        <Textarea 
                          className="w-full min-h-[80px]" 
                          placeholder="Job Experience / Notes"
                        />
                      </div>
                    </div>
                  </div>

                  {/* B3. Running Hours */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>B3. Running Hours</h4>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Previous reading</Label>
                        <Input type="text" className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Current Reading</Label>
                        <Input type="text" className="w-full" />
                      </div>
                    </div>
                  </div>

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
    </Dialog>
  );
};

export default WorkOrderForm;