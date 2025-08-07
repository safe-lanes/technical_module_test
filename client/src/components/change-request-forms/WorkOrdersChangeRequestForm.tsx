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
    assignedTo: initialData.assignedTo || "2nd Eng",
    priority: initialData.priority || "High",
    status: initialData.status || "In Progress",
    estimatedHours: initialData.estimatedHours || "24",
    actualHours: initialData.actualHours || "",
    startDate: initialData.startDate || "2025-01-15",
    targetDate: initialData.targetDate || "2025-01-20",
    completionDate: initialData.completionDate || "",
    description: initialData.description || "Complete overhaul of main engine bearings as per maintenance schedule",
    notes: initialData.notes || "",
    component: initialData.component || "Main Engine #1",
    location: initialData.location || "Engine Room",
    workType: initialData.workType || "Planned Maintenance",
    department: initialData.department || "Engine"
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
    return `${isChanged ? 'text-red-500 border-red-500' : 'text-[#52baf3] border-[#52baf3]'}`;
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
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#52baf3] border-b border-[#52baf3] pb-2">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className={getLabelStyle()}>Work Order No</Label>
              <Input
                value={workOrderData.workOrderNo}
                onChange={(e) => handleInputChange("workOrderNo", e.target.value)}
                className={getInputStyle("workOrderNo")}
              />
            </div>
            <div>
              <Label className={getLabelStyle()}>Priority</Label>
              <Select value={workOrderData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger className={getInputStyle("priority")}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className={getLabelStyle()}>Title</Label>
              <Input
                value={workOrderData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={getInputStyle("title")}
              />
            </div>
          </div>
        </div>

        {/* Assignment & Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#52baf3] border-b border-[#52baf3] pb-2">
            Assignment & Status
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className={getLabelStyle()}>Assigned To</Label>
              <Select value={workOrderData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                <SelectTrigger className={getInputStyle("assignedTo")}>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chief Eng">Chief Eng</SelectItem>
                  <SelectItem value="2nd Eng">2nd Eng</SelectItem>
                  <SelectItem value="3rd Eng">3rd Eng</SelectItem>
                  <SelectItem value="Fitter">Fitter</SelectItem>
                  <SelectItem value="Electrician">Electrician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={getLabelStyle()}>Status</Label>
              <Select value={workOrderData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className={getInputStyle("status")}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={getLabelStyle()}>Work Type</Label>
              <Select value={workOrderData.workType} onValueChange={(value) => handleInputChange("workType", value)}>
                <SelectTrigger className={getInputStyle("workType")}>
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned Maintenance">Planned Maintenance</SelectItem>
                  <SelectItem value="Corrective Maintenance">Corrective Maintenance</SelectItem>
                  <SelectItem value="Emergency Repair">Emergency Repair</SelectItem>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                  <SelectItem value="Modification">Modification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Schedule & Hours */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#52baf3] border-b border-[#52baf3] pb-2">
            Schedule & Hours
          </h3>
          
          <div className="grid grid-cols-5 gap-4">
            <div>
              <Label className={getLabelStyle()}>Start Date</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={workOrderData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className={getInputStyle("startDate")}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#52baf3] pointer-events-none" />
              </div>
            </div>
            <div>
              <Label className={getLabelStyle()}>Target Date</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={workOrderData.targetDate}
                  onChange={(e) => handleInputChange("targetDate", e.target.value)}
                  className={getInputStyle("targetDate")}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#52baf3] pointer-events-none" />
              </div>
            </div>
            <div>
              <Label className={getLabelStyle()}>Completion Date</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={workOrderData.completionDate}
                  onChange={(e) => handleInputChange("completionDate", e.target.value)}
                  className={getInputStyle("completionDate")}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#52baf3] pointer-events-none" />
              </div>
            </div>
            <div>
              <Label className={getLabelStyle()}>Estimated Hours</Label>
              <Input
                type="number"
                min="0"
                value={workOrderData.estimatedHours}
                onChange={(e) => handleInputChange("estimatedHours", e.target.value)}
                className={getInputStyle("estimatedHours")}
              />
            </div>
            <div>
              <Label className={getLabelStyle()}>Actual Hours</Label>
              <Input
                type="number"
                min="0"
                value={workOrderData.actualHours}
                onChange={(e) => handleInputChange("actualHours", e.target.value)}
                className={getInputStyle("actualHours")}
              />
            </div>
          </div>
        </div>

        {/* Location & Component */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#52baf3] border-b border-[#52baf3] pb-2">
            Location & Component
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className={getLabelStyle()}>Component</Label>
              <Input
                value={workOrderData.component}
                onChange={(e) => handleInputChange("component", e.target.value)}
                className={getInputStyle("component")}
              />
            </div>
            <div>
              <Label className={getLabelStyle()}>Location</Label>
              <Input
                value={workOrderData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={getInputStyle("location")}
              />
            </div>
            <div>
              <Label className={getLabelStyle()}>Department</Label>
              <Select value={workOrderData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger className={getInputStyle("department")}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Deck">Deck</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Navigation">Navigation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Description & Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#52baf3] border-b border-[#52baf3] pb-2">
            Description & Notes
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label className={getLabelStyle()}>Description</Label>
              <Textarea
                value={workOrderData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={getInputStyle("description")}
                rows={3}
              />
            </div>
            <div>
              <Label className={getLabelStyle()}>Additional Notes</Label>
              <Textarea
                value={workOrderData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className={getInputStyle("notes")}
                rows={2}
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