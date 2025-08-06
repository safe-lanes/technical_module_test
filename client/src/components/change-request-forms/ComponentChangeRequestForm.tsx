import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus } from "lucide-react";

interface ComponentChangeRequestFormProps {
  onClose: () => void;
  onSubmit?: (componentData: any) => void;
  initialData?: any;
}

const ComponentChangeRequestForm: React.FC<ComponentChangeRequestFormProps> = ({
  onClose,
  onSubmit,
  initialData = {}
}) => {
  const [componentData, setComponentData] = useState({
    componentId: initialData.componentId || "601.003.XXX",
    serialNo: initialData.serialNo || "",
    drawingNo: initialData.drawingNo || "",
    componentCode: initialData.componentCode || "",
    equipmentCategory: initialData.equipmentCategory || "",
    location: initialData.location || "",
    installation: initialData.installation || "",
    componentType: initialData.componentType || "",
    rating: initialData.rating || "",
    noOfUnits: initialData.noOfUnits || "",
    equipmentDepartment: initialData.equipmentDepartment || "",
    parentComponent: initialData.parentComponent || "",
    facility: initialData.facility || "",
    runningHoursUnit1: initialData.runningHoursUnit1 || "",
    runningHoursUnit2: initialData.runningHoursUnit2 || "",
    conditionMonitoringMetrics: {
      metric: initialData.conditionMonitoringMetrics?.metric || "",
      interval: initialData.conditionMonitoringMetrics?.interval || "",
      temperature: initialData.conditionMonitoringMetrics?.temperature || "",
      pressure: initialData.conditionMonitoringMetrics?.pressure || ""
    },
    classificationData: {
      classificationProvider: initialData.classificationData?.classificationProvider || "",
      certificateNo: initialData.classificationData?.certificateNo || "",
      lastDataSurvey: initialData.classificationData?.lastDataSurvey || "",
      nextDataSurvey: initialData.classificationData?.nextDataSurvey || "",
      surveyType: initialData.classificationData?.surveyType || "",
      classRequirements: initialData.classificationData?.classRequirements || "",
      classCode: initialData.classificationData?.classCode || "",
      information: initialData.classificationData?.information || ""
    }
  });

  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());

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

    // Track changed fields for red highlighting
    const initialValue = field.includes('.') 
      ? initialData[field.split('.')[0]]?.[field.split('.')[1]]
      : initialData[field];
    
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
      onSubmit(componentData);
      onClose();
    }
  };

  const getInputStyle = (field: string) => {
    const isChanged = changedFields.has(field);
    return `${isChanged ? 'text-red-500 border-red-500' : 'text-[#52baf3] border-[#52baf3]'}`;
  };

  const getLabelStyle = () => 'text-[#52baf3] text-xs font-medium mb-1 block';

  return (
    <div className="w-[95vw] max-w-none h-[95vh] flex flex-col">
      <div className="pb-4 pr-12 border-b border-[#52baf3]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#52baf3]">Component Register - Change Request</h2>
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
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
            <Button variant="outline" size="sm" onClick={onClose} className="border-[#52baf3] text-[#52baf3] hover:bg-[#52baf3] hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
        </div>
      </div>

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
            </div>
          </div>
        </div>

        {/* Main Form Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#52baf3] border-b border-[#52baf3] pb-2">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={getLabelStyle()}>Component ID</Label>
                  <Input
                    value={componentData.componentId}
                    onChange={(e) => handleInputChange("componentId", e.target.value)}
                    className={getInputStyle("componentId")}
                  />
                </div>
                <div>
                  <Label className={getLabelStyle()}>Serial No</Label>
                  <Input
                    value={componentData.serialNo}
                    onChange={(e) => handleInputChange("serialNo", e.target.value)}
                    className={getInputStyle("serialNo")}
                  />
                </div>
                <div>
                  <Label className={getLabelStyle()}>Drawing No</Label>
                  <Input
                    value={componentData.drawingNo}
                    onChange={(e) => handleInputChange("drawingNo", e.target.value)}
                    className={getInputStyle("drawingNo")}
                  />
                </div>
                <div>
                  <Label className={getLabelStyle()}>Component Code</Label>
                  <Input
                    value={componentData.componentCode}
                    onChange={(e) => handleInputChange("componentCode", e.target.value)}
                    className={getInputStyle("componentCode")}
                  />
                </div>
                <div>
                  <Label className={getLabelStyle()}>Equipment Category</Label>
                  <Select value={componentData.equipmentCategory} onValueChange={(value) => handleInputChange("equipmentCategory", value)}>
                    <SelectTrigger className={getInputStyle("equipmentCategory")}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="propulsion">Propulsion</SelectItem>
                      <SelectItem value="auxiliary">Auxiliary</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="navigation">Navigation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className={getLabelStyle()}>Location</Label>
                  <Input
                    value={componentData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={getInputStyle("location")}
                  />
                </div>
              </div>
            </div>

            {/* Classification Data Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#52baf3] border-b border-[#52baf3] pb-2">
                Classification & Regulatory
              </h3>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className={getLabelStyle()}>Classification Society</Label>
                  <Input
                    value={componentData.classificationData.classificationProvider}
                    onChange={(e) => handleInputChange("classificationData.classificationProvider", e.target.value)}
                    className={getInputStyle("classificationData.classificationProvider")}
                  />
                </div>
                <div>
                  <Label className={getLabelStyle()}>Certificate No.</Label>
                  <Input
                    value={componentData.classificationData.certificateNo}
                    onChange={(e) => handleInputChange("classificationData.certificateNo", e.target.value)}
                    className={getInputStyle("classificationData.certificateNo")}
                  />
                </div>
                <div>
                  <Label className={getLabelStyle()}>Last Class Survey</Label>
                  <Input
                    type="date"
                    value={componentData.classificationData.lastDataSurvey}
                    onChange={(e) => handleInputChange("classificationData.lastDataSurvey", e.target.value)}
                    className={getInputStyle("classificationData.lastDataSurvey")}
                  />
                </div>
                <div>
                  <Label className={getLabelStyle()}>Next Class Survey</Label>
                  <Input
                    type="date"
                    value={componentData.classificationData.nextDataSurvey}
                    onChange={(e) => handleInputChange("classificationData.nextDataSurvey", e.target.value)}
                    className={getInputStyle("classificationData.nextDataSurvey")}
                  />
                </div>
              </div>

              <div>
                <Label className={getLabelStyle()}>Additional Information</Label>
                <Textarea
                  value={componentData.classificationData.information}
                  onChange={(e) => handleInputChange("classificationData.information", e.target.value)}
                  className={getInputStyle("classificationData.information")}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentChangeRequestForm;