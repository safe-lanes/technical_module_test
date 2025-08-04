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
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";

interface ComponentRegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (componentData: any) => void;
  existingComponent?: any;
}

interface CustomField {
  id: string;
  label: string;
  value: string;
}

const ComponentRegisterForm: React.FC<ComponentRegisterFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingComponent,
}) => {
  const [componentData, setComponentData] = useState({
    componentCode: existingComponent?.componentCode || "601.003.XXX",
    serialNo: existingComponent?.serialNo || "",
    drawingNo: existingComponent?.drawingNo || "",
    location: existingComponent?.location || "",
    critical: existingComponent?.critical || "",
    installationDate: existingComponent?.installationDate || "",
    commissioned: existingComponent?.commissioned || "",
    rating: existingComponent?.rating || "",
    conditionBased: existingComponent?.conditionBased || "",
    noOfUnits: existingComponent?.noOfUnits || "",
    partSystemDepartment: existingComponent?.partSystemDepartment || "",
    partComponent: existingComponent?.partComponent || "",
    departmentIncharge: existingComponent?.departmentIncharge || "",
    details: existingComponent?.details || "",
    make: existingComponent?.make || "",
  });

  // Custom fields for different sections
  const [runningHoursFields, setRunningHoursFields] = useState<CustomField[]>(
    existingComponent?.runningHoursFields || [
      { id: "1", label: "Previous", value: "" },
      { id: "2", label: "Temperature", value: "" },
      { id: "3", label: "Pressure", value: "" },
    ]
  );

  const [conditionMetricsFields, setConditionMetricsFields] = useState<CustomField[]>(
    existingComponent?.conditionMetricsFields || [
      { id: "1", label: "Metric", value: "" },
      { id: "2", label: "Mirror (Threshold)", value: "" },
    ]
  );

  const [sparesFields, setSparesFields] = useState<CustomField[]>(
    existingComponent?.sparesFields || [
      { id: "1", label: "Part Code", value: "" },
      { id: "2", label: "Part Name", value: "" },
      { id: "3", label: "Min", value: "" },
      { id: "4", label: "Critical", value: "" },
      { id: "5", label: "Location", value: "" },
    ]
  );

  const [drawingsFields, setDrawingsFields] = useState<CustomField[]>(
    existingComponent?.drawingsFields || [
      { id: "1", label: "Equipment Manual", value: "" },
      { id: "2", label: "Maintenance Manual", value: "" },
      { id: "3", label: "Installation Guide", value: "" },
      { id: "4", label: "Trouble shooting Guide", value: "" },
    ]
  );

  const [classificationFields, setClassificationFields] = useState<CustomField[]>(
    existingComponent?.classificationFields || [
      { id: "1", label: "Classification Society", value: "" },
      { id: "2", label: "Certificate No", value: "" },
      { id: "3", label: "Last Date Survey", value: "" },
      { id: "4", label: "Next Date Survey", value: "" },
      { id: "5", label: "Survey Type", value: "" },
      { id: "6", label: "Class Requirements", value: "" },
      { id: "7", label: "Class Code", value: "" },
      { id: "8", label: "Maintenance", value: "" },
    ]
  );

  const handleInputChange = (field: string, value: string) => {
    setComponentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCustomField = (section: string) => {
    const newField: CustomField = {
      id: Date.now().toString(),
      label: "New Field",
      value: ""
    };

    switch (section) {
      case "runningHours":
        setRunningHoursFields(prev => [...prev, newField]);
        break;
      case "conditionMetrics":
        setConditionMetricsFields(prev => [...prev, newField]);
        break;
      case "spares":
        setSparesFields(prev => [...prev, newField]);
        break;
      case "drawings":
        setDrawingsFields(prev => [...prev, newField]);
        break;
      case "classification":
        setClassificationFields(prev => [...prev, newField]);
        break;
    }
  };

  const removeCustomField = (section: string, fieldId: string) => {
    switch (section) {
      case "runningHours":
        setRunningHoursFields(prev => prev.filter(field => field.id !== fieldId));
        break;
      case "conditionMetrics":
        setConditionMetricsFields(prev => prev.filter(field => field.id !== fieldId));
        break;
      case "spares":
        setSparesFields(prev => prev.filter(field => field.id !== fieldId));
        break;
      case "drawings":
        setDrawingsFields(prev => prev.filter(field => field.id !== fieldId));
        break;
      case "classification":
        setClassificationFields(prev => prev.filter(field => field.id !== fieldId));
        break;
    }
  };

  const updateCustomField = (section: string, fieldId: string, newLabel: string, newValue: string) => {
    const updateField = (field: CustomField) => 
      field.id === fieldId ? { ...field, label: newLabel, value: newValue } : field;

    switch (section) {
      case "runningHours":
        setRunningHoursFields(prev => prev.map(updateField));
        break;
      case "conditionMetrics":
        setConditionMetricsFields(prev => prev.map(updateField));
        break;
      case "spares":
        setSparesFields(prev => prev.map(updateField));
        break;
      case "drawings":
        setDrawingsFields(prev => prev.map(updateField));
        break;
      case "classification":
        setClassificationFields(prev => prev.map(updateField));
        break;
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      const completeData = {
        ...componentData,
        runningHoursFields,
        conditionMetricsFields,
        sparesFields,
        drawingsFields,
        classificationFields,
      };
      onSubmit(completeData);
      onClose();
    }
  };

  const renderCustomFieldSection = (
    title: string,
    fields: CustomField[],
    sectionKey: string,
    columns: number = 2
  ) => (
    <div className="border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium" style={{ color: '#16569e' }}>{title}</h4>
        <Button
          type="button"
          size="sm"
          className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white"
          onClick={() => addCustomField(sectionKey)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Field
        </Button>
      </div>
      
      <div className={`grid grid-cols-${columns} gap-6`}>
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                value={field.label}
                onChange={(e) => updateCustomField(sectionKey, field.id, e.target.value, field.value)}
                className="text-sm font-medium border-2"
                style={{ borderColor: '#52baf3' }}
                placeholder="Field Label"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => removeCustomField(sectionKey, field.id)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={field.value}
              onChange={(e) => updateCustomField(sectionKey, field.id, field.label, e.target.value)}
              className="text-sm border-2"
              style={{ borderColor: '#52baf3' }}
              placeholder="Field Value"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-none h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 pr-12">
          <div className="flex items-center justify-between">
            <DialogTitle>Component Register - Add Component</DialogTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                + Add Edit Component
              </Button>
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                ⬅ Back
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

        <div className="flex-1 overflow-auto p-6">
          {/* A. Component Information */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>A. Component Information</h4>
            
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Serial No</Label>
                <Input 
                  value={componentData.serialNo}
                  onChange={(e) => handleInputChange('serialNo', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Drawing No</Label>
                <Input 
                  value={componentData.drawingNo}
                  onChange={(e) => handleInputChange('drawingNo', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Component Code</Label>
                <Input 
                  value={componentData.componentCode}
                  onChange={(e) => handleInputChange('componentCode', e.target.value)}
                  className="text-sm"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Location</Label>
                <Input 
                  value={componentData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Critical</Label>
                <Input 
                  value={componentData.critical}
                  onChange={(e) => handleInputChange('critical', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Installation Date</Label>
                <Input 
                  type="date"
                  value={componentData.installationDate}
                  onChange={(e) => handleInputChange('installationDate', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Commissioned</Label>
                <Input 
                  value={componentData.commissioned}
                  onChange={(e) => handleInputChange('commissioned', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Rating</Label>
                <Input 
                  value={componentData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Condition Based</Label>
                <Input 
                  value={componentData.conditionBased}
                  onChange={(e) => handleInputChange('conditionBased', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">No of Units</Label>
                <Input 
                  value={componentData.noOfUnits}
                  onChange={(e) => handleInputChange('noOfUnits', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Part / System Department</Label>
                <Input 
                  value={componentData.partSystemDepartment}
                  onChange={(e) => handleInputChange('partSystemDepartment', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Part Component</Label>
                <Input 
                  value={componentData.partComponent}
                  onChange={(e) => handleInputChange('partComponent', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Department Incharge</Label>
                <Input 
                  value={componentData.departmentIncharge}
                  onChange={(e) => handleInputChange('departmentIncharge', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#8798ad]">Make</Label>
                <Input 
                  value={componentData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  className="text-sm border-2"
                  style={{ borderColor: '#52baf3' }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#8798ad]">Details</Label>
              <Textarea 
                value={componentData.details}
                onChange={(e) => handleInputChange('details', e.target.value)}
                className="text-sm border-2"
                style={{ borderColor: '#52baf3' }}
                rows={3}
              />
            </div>
          </div>

          {/* B. Running Hours & Condition Monitoring Metrics */}
          {renderCustomFieldSection("B. Running Hours & Condition Monitoring Metrics", runningHoursFields, "runningHours", 3)}
          
          {/* Condition Monitoring Metrics */}
          {renderCustomFieldSection("Condition Monitoring Metrics", conditionMetricsFields, "conditionMetrics", 2)}

          {/* C. Work Orders */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium" style={{ color: '#16569e' }}>C. Work Orders</h4>
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                + Add W.O
              </Button>
            </div>
            <div className="text-center text-gray-500 py-4">
              No work orders added yet
            </div>
          </div>

          {/* D. Maintenance History */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium" style={{ color: '#16569e' }}>D. Maintenance History</h4>
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                + Add M History
              </Button>
            </div>
            <div className="text-center text-gray-500 py-4">
              No maintenance history added yet
            </div>
          </div>

          {/* E. Spares */}
          {renderCustomFieldSection("E. Spares", sparesFields, "spares", 5)}

          {/* F. Drawings & Manuals */}
          {renderCustomFieldSection("F. Drawings & Manuals", drawingsFields, "drawings", 1)}

          {/* G. Classification & Regulatory Data */}
          {renderCustomFieldSection("G. Classification & Regulatory Data", classificationFields, "classification", 4)}

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
      </DialogContent>
    </Dialog>
  );
};

export default ComponentRegisterForm;