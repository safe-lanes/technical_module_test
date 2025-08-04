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
import { ArrowLeft } from "lucide-react";

interface UnplannedWorkOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: any) => void;
}

const UnplannedWorkOrderForm: React.FC<UnplannedWorkOrderFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [activeSection, setActiveSection] = useState<'partA' | 'partB'>('partA');

  const [formData, setFormData] = useState({
    workOrder: "WOUP-2025-17",
    jobTitle: "",
    component: "",
    maintenanceType: "Unplanned Maintenance",
    assignedTo: "",
    approver: "",
    jobCategory: "",
    classRelated: "",
    status: "",
    briefWorkDescription: "",
    ppeRequirements: "",
    permitRequirements: "",
    otherSafetyRequirements: "",
  });

  const selectSection = (section: 'partA' | 'partB') => {
    setActiveSection(section);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] max-w-none h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 pr-12">
          <div className="flex items-center justify-between">
            <DialogTitle>Work Order Form - Unplanned Maintenance</DialogTitle>
            <div className="flex items-center gap-2">
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
                  <p className="text-sm text-[#52baf3]">Enter details related to the unplanned new work order</p>
                </div>

                <div className="p-6">
                  {/* A1. Work Order Information */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>A1. Work Order Information</h4>
                    
                    <div className="grid grid-cols-3 gap-6">
                      {/* Row 1 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Work Order</Label>
                        <Input 
                          value={formData.workOrder} 
                          onChange={(e) => handleInputChange('workOrder', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Job Title</Label>
                        <Input 
                          value={formData.jobTitle} 
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                          className="text-sm"
                          placeholder="Main Engine - Replace Fuel Filters"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Component</Label>
                        <Select value={formData.component} onValueChange={(value) => handleInputChange('component', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="601.002 Main Engine" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="601.002 Main Engine">601.002 Main Engine</SelectItem>
                            <SelectItem value="602.001 Diesel Generator 1">602.001 Diesel Generator 1</SelectItem>
                            <SelectItem value="603.001 Steering Gear">603.001 Steering Gear</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Row 2 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Maintenance Type</Label>
                        <Select value={formData.maintenanceType} onValueChange={(value) => handleInputChange('maintenanceType', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unplanned Maintenance">Unplanned Maintenance</SelectItem>
                            <SelectItem value="Emergency Maintenance">Emergency Maintenance</SelectItem>
                            <SelectItem value="Breakdown Maintenance">Breakdown Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Assigned To</Label>
                        <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Rank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Chief Engineer">Chief Engineer</SelectItem>
                            <SelectItem value="2nd Engineer">2nd Engineer</SelectItem>
                            <SelectItem value="3rd Engineer">3rd Engineer</SelectItem>
                            <SelectItem value="4th Engineer">4th Engineer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Approver</Label>
                        <Select value={formData.approver} onValueChange={(value) => handleInputChange('approver', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Rank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Chief Engineer">Chief Engineer</SelectItem>
                            <SelectItem value="Captain">Captain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Row 3 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Job Category</Label>
                        <Select value={formData.jobCategory} onValueChange={(value) => handleInputChange('jobCategory', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Mechanical" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mechanical">Mechanical</SelectItem>
                            <SelectItem value="Electrical">Electrical</SelectItem>
                            <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                            <SelectItem value="Safety">Safety</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Class Related</Label>
                        <Select value={formData.classRelated} onValueChange={(value) => handleInputChange('classRelated', value)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Yes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Status</Label>
                        <Input 
                          value={formData.status} 
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="text-sm"
                          placeholder="Status"
                        />
                      </div>
                    </div>

                    {/* Brief Work Description */}
                    <div className="mt-6">
                      <Label className="text-sm text-[#8798ad]">Brief Work Description</Label>
                      <Textarea 
                        value={formData.briefWorkDescription} 
                        onChange={(e) => handleInputChange('briefWorkDescription', e.target.value)}
                        className="mt-2 text-sm"
                        rows={3}
                        placeholder="Add Work description"
                      />
                    </div>
                  </div>

                  {/* A2. Safety Requirements */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>A2. Safety Requirements</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-[#8798ad]">PPE Requirements:</Label>
                        <Input 
                          value={formData.ppeRequirements} 
                          onChange={(e) => handleInputChange('ppeRequirements', e.target.value)}
                          className="mt-2 text-sm"
                          placeholder="[Leather Gloves] [Goggles] [Safety Helmet]"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-[#8798ad]">Permit Requirements:</Label>
                        <Input 
                          value={formData.permitRequirements} 
                          onChange={(e) => handleInputChange('permitRequirements', e.target.value)}
                          className="mt-2 text-sm"
                          placeholder="[Enclosed Space Entry Permit]"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-[#8798ad]">Other Safety Requirements:</Label>
                        <Input 
                          value={formData.otherSafetyRequirements} 
                          onChange={(e) => handleInputChange('otherSafetyRequirements', e.target.value)}
                          className="mt-2 text-sm"
                          placeholder="Free Text"
                        />
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

            {/* Part B - Work Completion Record */}
            {activeSection === 'partB' && (
              <div className="border border-gray-200 rounded-lg mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#16569e]">Part B - Work Completion Record</h3>
                  <p className="text-sm text-[#52baf3]">Enter work completion details here including Risk assessment, checklists, comments etc.</p>
                </div>

                <div className="p-6">
                  <div className="text-center text-gray-500 py-8">
                    Work completion record section will be available after work order creation.
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

export default UnplannedWorkOrderForm;