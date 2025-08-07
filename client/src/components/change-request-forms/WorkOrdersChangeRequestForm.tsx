import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, X } from "lucide-react";

interface WorkOrdersChangeRequestFormProps {
  onClose: () => void;
  onSubmit?: (workOrderData: any) => void;
  initialData?: any;
}

const WorkOrdersChangeRequestForm: React.FC<WorkOrdersChangeRequestFormProps> = ({
  onClose,
  onSubmit,
  initialData = {}
}) => {
  const [workOrderData, setWorkOrderData] = useState({
    workOrderNo: initialData.workOrderNo || "WO-2025-001",
    title: initialData.title || "Main Engine Overhaul - Replace Main bearings",
    component: initialData.component || "Main Engine #1",
    maintenanceType: initialData.maintenanceType || "Planned Maintenance",
    assignedTo: initialData.assignedTo || "2nd Eng",
    approver: initialData.approver || "Chief Engineer",
    jobCategory: initialData.jobCategory || "Mechanical",
    classRelated: initialData.classRelated || "No",
    status: initialData.status || "In Progress",
    briefWorkDescription: initialData.briefWorkDescription || "Complete overhaul of main engine bearings as per maintenance schedule",
    ppeRequirements: initialData.ppeRequirements || "Safety Helmet, Safety Gloves",
    permitRequirements: initialData.permitRequirements || "Hot Work Permit",
    otherSafetyRequirements: initialData.otherSafetyRequirements || "",
    priority: initialData.priority || "High",
    workType: initialData.workType || "Planned Maintenance",
    department: initialData.department || "Engine",
    location: initialData.location || "Engine Room",
    estimatedHours: initialData.estimatedHours || "24",
    actualHours: initialData.actualHours || "",
    startDate: initialData.startDate || "2025-01-15",
    targetDate: initialData.targetDate || "2025-01-20",
    completionDate: initialData.completionDate || "",
    notes: initialData.notes || ""
  });

  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());

  const handleInputChange = (field: string, value: string) => {
    setWorkOrderData(prev => ({
      ...prev,
      [field]: value
    }));

    // Track changed fields for red highlighting
    const initialValue = initialData[field];
    
    if (value !== initialValue) {
      setChangedFields(prev => new Set([...Array.from(prev), field]));
    } else {
      setChangedFields(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(field);
        return newSet;
      });
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(workOrderData);
      onClose();
    }
  };

  const getInputStyle = (field: string) => {
    const isChanged = changedFields.has(field);
    return isChanged ? 'text-red-500 border-red-500' : 'border-[#52baf3] focus:border-[#52baf3] focus:ring-[#52baf3]';
  };

  const getLabelStyle = () => 'text-[#52baf3] text-sm font-medium mb-2 block';

  return (
    <div className="w-[95%] max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-lg shadow-lg">
      {/* Modal Header */}
      <div className="flex justify-between items-center p-4 border-b border-[#52baf3]">
        <h2 className="text-xl font-semibold text-[#52baf3]">Work Order - Change Request</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="h-8 w-8 p-0 text-[#52baf3] hover:bg-[#52baf3] hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Modal Body */}
      <div className="p-6">
        {/* A1. Work Order Information */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>A1. Work Order Information</h4>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Row 1 */}
            <div className="space-y-2">
              <Label className="text-sm text-[#8798ad]">Work Order</Label>
              <Input 
                value={workOrderData.workOrderNo} 
                onChange={(e) => handleInputChange('workOrderNo', e.target.value)}
                className={`text-sm ${getInputStyle("workOrderNo")}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-[#8798ad]">Job Title</Label>
              <Input 
                value={workOrderData.title} 
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`text-sm ${getInputStyle("title")}`}
                placeholder="Main Engine - Replace Fuel Filters"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-[#8798ad]">Component</Label>
              <Select value={workOrderData.component} onValueChange={(value) => handleInputChange('component', value)}>
                <SelectTrigger className={`text-sm ${getInputStyle("component")}`}>
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
              <Select value={workOrderData.maintenanceType} onValueChange={(value) => handleInputChange('maintenanceType', value)}>
                <SelectTrigger className={`text-sm ${getInputStyle("maintenanceType")}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned Maintenance">Planned Maintenance</SelectItem>
                  <SelectItem value="Preventive Maintenance">Preventive Maintenance</SelectItem>
                  <SelectItem value="Corrective Maintenance">Corrective Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-[#8798ad]">Assigned To</Label>
              <Select value={workOrderData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                <SelectTrigger className={`text-sm ${getInputStyle("assignedTo")}`}>
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
              <Select value={workOrderData.approver} onValueChange={(value) => handleInputChange('approver', value)}>
                <SelectTrigger className={`text-sm ${getInputStyle("approver")}`}>
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
              <Select value={workOrderData.jobCategory} onValueChange={(value) => handleInputChange('jobCategory', value)}>
                <SelectTrigger className={`text-sm ${getInputStyle("jobCategory")}`}>
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
              <Select value={workOrderData.classRelated} onValueChange={(value) => handleInputChange('classRelated', value)}>
                <SelectTrigger className={`text-sm ${getInputStyle("classRelated")}`}>
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
                value={workOrderData.status} 
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`text-sm ${getInputStyle("status")}`}
                placeholder="Status"
              />
            </div>
          </div>

          {/* Brief Work Description */}
          <div className="mt-6">
            <Label className="text-sm text-[#8798ad]">Brief Work Description</Label>
            <Textarea 
              value={workOrderData.briefWorkDescription} 
              onChange={(e) => handleInputChange('briefWorkDescription', e.target.value)}
              className={`mt-2 text-sm ${getInputStyle("briefWorkDescription")}`}
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
                value={workOrderData.ppeRequirements} 
                onChange={(e) => handleInputChange('ppeRequirements', e.target.value)}
                className={`mt-2 text-sm ${getInputStyle("ppeRequirements")}`}
                placeholder="[Leather Gloves] [Goggles] [Safety Helmet]"
              />
            </div>
            <div>
              <Label className="text-sm text-[#8798ad]">Permit Requirements:</Label>
              <Input 
                value={workOrderData.permitRequirements} 
                onChange={(e) => handleInputChange('permitRequirements', e.target.value)}
                className={`mt-2 text-sm ${getInputStyle("permitRequirements")}`}
                placeholder="[Enclosed Space Entry Permit]"
              />
            </div>
            <div>
              <Label className="text-sm text-[#8798ad]">Other Safety Requirements:</Label>
              <Input 
                value={workOrderData.otherSafetyRequirements} 
                onChange={(e) => handleInputChange('otherSafetyRequirements', e.target.value)}
                className={`mt-2 text-sm ${getInputStyle("otherSafetyRequirements")}`}
                placeholder="Free Text"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="border-[#52baf3] text-[#52baf3] hover:bg-[#52baf3] hover:text-white"
        >
          Cancel
        </Button>
        <Button 
          className="bg-[#52baf3] hover:bg-[#40a8e0] text-white"
          onClick={handleSubmit}
        >
          Save Change Request
        </Button>
      </div>
    </div>
  );
};

export default WorkOrdersChangeRequestForm;