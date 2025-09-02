import { __assign, __spreadArray } from "tslib";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Edit, Trash2, Plus, Eye, Upload } from "lucide-react";
var ComponentChangeRequestForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var onClose = _a.onClose, onSubmit = _a.onSubmit, _m = _a.initialData, initialData = _m === void 0 ? {} : _m;
    var _o = useState({
        componentId: initialData.componentId || "601.003.XXX",
        // Section A - Component Information
        maker: initialData.maker || "MAN B&W",
        model: initialData.model || "6S60MC-C",
        serialNo: initialData.serialNo || "12345",
        drawingNo: initialData.drawingNo || "DRW-001",
        componentCode: initialData.componentCode || "ME-001",
        equipmentCategory: initialData.equipmentCategory || "Main Engine",
        location: initialData.location || "Engine Room",
        critical: initialData.critical || "Yes",
        installation: initialData.installation || "2020-01-15",
        commissioned: initialData.commissioned || "2020-02-01",
        rating: initialData.rating || "12000 kW",
        conditionBased: initialData.conditionBased || "Yes",
        noOfUnits: initialData.noOfUnits || "1",
        equipmentDepartment: initialData.equipmentDepartment || "Engine",
        parentComponent: initialData.parentComponent || "Propulsion System",
        facility: initialData.facility || "Main Deck",
        dimensionsSize: initialData.dimensionsSize || "10m x 3m x 4m",
        notes: initialData.notes || "",
        // Section B - Running Hours & Condition Monitoring
        runningHours: initialData.runningHours || "20000",
        dateUpdated: initialData.dateUpdated || "2025-01-08",
        conditionMonitoringMetrics: {
            metric: ((_b = initialData.conditionMonitoringMetrics) === null || _b === void 0 ? void 0 : _b.metric) || "Temperature",
            alertsThresholds: ((_c = initialData.conditionMonitoringMetrics) === null || _c === void 0 ? void 0 : _c.alertsThresholds) || "85°C"
        },
        // Section G - Classification & Regulatory Data
        classificationData: {
            classificationProvider: ((_d = initialData.classificationData) === null || _d === void 0 ? void 0 : _d.classificationProvider) || "DNV GL",
            certificateNo: ((_e = initialData.classificationData) === null || _e === void 0 ? void 0 : _e.certificateNo) || "CERT-2020-001",
            lastDataSurvey: ((_f = initialData.classificationData) === null || _f === void 0 ? void 0 : _f.lastDataSurvey) || "2024-06-15",
            nextDataSurvey: ((_g = initialData.classificationData) === null || _g === void 0 ? void 0 : _g.nextDataSurvey) || "2025-06-15",
            surveyType: ((_h = initialData.classificationData) === null || _h === void 0 ? void 0 : _h.surveyType) || "Annual",
            classRequirements: ((_j = initialData.classificationData) === null || _j === void 0 ? void 0 : _j.classRequirements) || "Class A",
            classCode: ((_k = initialData.classificationData) === null || _k === void 0 ? void 0 : _k.classCode) || "A1",
            information: ((_l = initialData.classificationData) === null || _l === void 0 ? void 0 : _l.information) || ""
        }
    }), componentData = _o[0], setComponentData = _o[1];
    var _p = useState(new Set()), changedFields = _p[0], setChangedFields = _p[1];
    var handleInputChange = function (field, value) {
        var _a;
        if (field.includes('.')) {
            var _b = field.split('.'), parent_1 = _b[0], child_1 = _b[1];
            setComponentData(function (prev) {
                var _a, _b;
                return (__assign(__assign({}, prev), (_a = {}, _a[parent_1] = __assign(__assign({}, prev[parent_1]), (_b = {}, _b[child_1] = value, _b)), _a)));
            });
        }
        else {
            setComponentData(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
            });
        }
        // Track changed fields for red highlighting
        var initialValue = field.includes('.')
            ? (_a = initialData[field.split('.')[0]]) === null || _a === void 0 ? void 0 : _a[field.split('.')[1]]
            : initialData[field];
        if (value !== initialValue) {
            setChangedFields(function (prev) { return new Set(__spreadArray(__spreadArray([], Array.from(prev), true), [field], false)); });
        }
        else {
            setChangedFields(function (prev) {
                var newSet = new Set(Array.from(prev));
                newSet.delete(field);
                return newSet;
            });
        }
    };
    var handleSubmit = function () {
        if (onSubmit) {
            onSubmit(componentData);
            onClose();
        }
    };
    var getInputStyle = function (field) {
        var isChanged = changedFields.has(field);
        return isChanged ? 'text-red-500 border-red-500' : 'border-[#52baf3] focus:border-[#52baf3] focus:ring-[#52baf3]';
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#52baf3]">
          <h2 className="text-xl font-semibold text-[#52baf3]">Component - Change Request</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="h-4 w-4"/>
          </Button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-auto p-6">
          {/* A. Component Information */}
          <div className="border border-[#52baf3] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-[#52baf3]">A. Component Information</h4>
              <div className="flex gap-2">
                <Edit className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
                <Trash2 className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
                <Plus className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              {/* Row 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Maker</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.maker} onChange={function (e) { return handleInputChange('maker', e.target.value); }} className={"text-sm ".concat(getInputStyle("maker"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Model</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.model} onChange={function (e) { return handleInputChange('model', e.target.value); }} className={"text-sm ".concat(getInputStyle("model"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Serial No</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.serialNo} onChange={function (e) { return handleInputChange('serialNo', e.target.value); }} className={"text-sm ".concat(getInputStyle("serialNo"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Drawing No</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.drawingNo} onChange={function (e) { return handleInputChange('drawingNo', e.target.value); }} className={"text-sm ".concat(getInputStyle("drawingNo"))}/>
              </div>

              {/* Row 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Component Code</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.componentCode} onChange={function (e) { return handleInputChange('componentCode', e.target.value); }} className={"text-sm ".concat(getInputStyle("componentCode"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Eqpt / System Category</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.equipmentCategory} onChange={function (e) { return handleInputChange('equipmentCategory', e.target.value); }} className={"text-sm ".concat(getInputStyle("equipmentCategory"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Location</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.location} onChange={function (e) { return handleInputChange('location', e.target.value); }} className={"text-sm ".concat(getInputStyle("location"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Critical</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Select value={componentData.critical} onValueChange={function (value) { return handleInputChange('critical', value); }}>
                  <SelectTrigger className={"text-sm ".concat(getInputStyle("critical"))}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Installation Date</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input type="date" value={componentData.installation} onChange={function (e) { return handleInputChange('installation', e.target.value); }} className={"text-sm ".concat(getInputStyle("installation"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Commissioned Date</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input type="date" value={componentData.commissioned} onChange={function (e) { return handleInputChange('commissioned', e.target.value); }} className={"text-sm ".concat(getInputStyle("commissioned"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Rating</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.rating} onChange={function (e) { return handleInputChange('rating', e.target.value); }} className={"text-sm ".concat(getInputStyle("rating"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Condition Based</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Select value={componentData.conditionBased} onValueChange={function (value) { return handleInputChange('conditionBased', value); }}>
                  <SelectTrigger className={"text-sm ".concat(getInputStyle("conditionBased"))}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 4 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">No of Units</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.noOfUnits} onChange={function (e) { return handleInputChange('noOfUnits', e.target.value); }} className={"text-sm ".concat(getInputStyle("noOfUnits"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Equipment Department</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.equipmentDepartment} onChange={function (e) { return handleInputChange('equipmentDepartment', e.target.value); }} className={"text-sm ".concat(getInputStyle("equipmentDepartment"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Parent Component</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.parentComponent} onChange={function (e) { return handleInputChange('parentComponent', e.target.value); }} className={"text-sm ".concat(getInputStyle("parentComponent"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Dimensions/Size</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.dimensionsSize} onChange={function (e) { return handleInputChange('dimensionsSize', e.target.value); }} className={"text-sm ".concat(getInputStyle("dimensionsSize"))}/>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-sm text-[#52baf3]">Notes</Label>
                <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
              </div>
              <Textarea value={componentData.notes} onChange={function (e) { return handleInputChange('notes', e.target.value); }} className={"text-sm ".concat(getInputStyle("notes"))} rows={3} placeholder="Add notes"/>
            </div>
          </div>

          {/* B. Running Hours & Condition Monitoring Metrics */}
          <div className="border border-[#52baf3] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-[#52baf3]">B. Running Hours & Condition Monitoring Metrics</h4>
              <div className="flex gap-2">
                <Edit className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
                <Trash2 className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
                <Plus className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Running Hours</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.runningHours} onChange={function (e) { return handleInputChange('runningHours', e.target.value); }} className={"text-sm ".concat(getInputStyle("runningHours"))} placeholder="20000"/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Date Updated</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input type="date" value={componentData.dateUpdated} onChange={function (e) { return handleInputChange('dateUpdated', e.target.value); }} className={"text-sm ".concat(getInputStyle("dateUpdated"))}/>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-[#52baf3]">Condition Monitoring Metrics</h5>
                <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                  <Plus className="h-4 w-4 mr-1"/>
                  Add Metric
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-[#52baf3]">Metric</Label>
                    <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                    <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  </div>
                  <Input value={componentData.conditionMonitoringMetrics.metric} onChange={function (e) { return handleInputChange('conditionMonitoringMetrics.metric', e.target.value); }} className={"text-sm ".concat(getInputStyle("conditionMonitoringMetrics.metric"))}/>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-[#52baf3]">Alerts/ Thresholds</Label>
                    <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                    <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  </div>
                  <Input value={componentData.conditionMonitoringMetrics.alertsThresholds} onChange={function (e) { return handleInputChange('conditionMonitoringMetrics.alertsThresholds', e.target.value); }} className={"text-sm ".concat(getInputStyle("conditionMonitoringMetrics.alertsThresholds"))}/>
                </div>
              </div>
            </div>
          </div>

          {/* C. Work Orders */}
          <div className="border border-[#52baf3] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-[#52baf3]">C. Work Orders</h4>
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                <Plus className="h-4 w-4 mr-1"/>
                Add W.O
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#52baf3]">
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">W.O No.</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Job Title</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Assigned to</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Due Date</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("wo1"))} defaultValue="WO-2025-01"/>
                    </td>
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("wo1title"))} defaultValue="Main Engine Overhaul - Replace Main Bearings"/>
                    </td>
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("wo1assigned"))} defaultValue="Chief Engineer"/>
                    </td>
                    <td className="p-3">
                      <Input type="date" className={"text-sm ".concat(getInputStyle("wo1due"))} defaultValue="2025-06-02"/>
                    </td>
                    <td className="p-3">
                      <Select defaultValue="done">
                        <SelectTrigger className={"text-sm ".concat(getInputStyle("wo1status"))}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="done">Done</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <button className="text-[#52baf3] hover:text-[#4aa3d9]">
                        <Eye className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* D. Maintenance History */}
          <div className="border border-[#52baf3] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-[#52baf3]">D. Maintenance History</h4>
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                <Plus className="h-4 w-4 mr-1"/>
                Add M History
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#52baf3]">
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Work Order No</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Performed By</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Total Time (Hrs)</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Completion Date</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("mh1wo"))} defaultValue="WO-2025-01"/>
                    </td>
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("mh1by"))} defaultValue="Kane"/>
                    </td>
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("mh1hours"))} defaultValue="3"/>
                    </td>
                    <td className="p-3">
                      <Input type="date" className={"text-sm ".concat(getInputStyle("mh1date"))} defaultValue="2025-01-08"/>
                    </td>
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("mh1status"))} defaultValue="Completed"/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* E. Spares */}
          <div className="border border-[#52baf3] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-[#52baf3]">E. Spares</h4>
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                <Plus className="h-4 w-4 mr-1"/>
                Add Spares
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#52baf3]">
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Part Code</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Part Name</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Min</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Critical</th>
                    <th className="text-left p-3 text-sm font-medium text-[#52baf3]">Location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("spare1code"))} defaultValue="SP-306-001"/>
                    </td>
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("spare1name"))} defaultValue="Fuel Injection"/>
                    </td>
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("spare1min"))} defaultValue="5"/>
                    </td>
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("spare1critical"))} defaultValue="5"/>
                    </td>
                    <td className="p-3">
                      <Input className={"text-sm ".concat(getInputStyle("spare1location"))} defaultValue="Engine Room R-3"/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* F. Drawings & Manuals */}
          <div className="border border-[#52baf3] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-[#52baf3]">F. Drawings & Manuals</h4>
              <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
                <Plus className="h-4 w-4 mr-1"/>
                Add Document
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border border-[#52baf3] rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm">General Arrangement</span>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Upload className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
              </div>
              <div className="flex items-center justify-between p-2 border border-[#52baf3] rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Maintenance Manual</span>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Upload className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
              </div>
              <div className="flex items-center justify-between p-2 border border-[#52baf3] rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Installation Guide</span>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Upload className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
              </div>
              <div className="flex items-center justify-between p-2 border border-[#52baf3] rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Trouble Shooting Guide</span>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Upload className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
              </div>
            </div>
          </div>

          {/* G. Classification & Regulatory Data */}
          <div className="border border-[#52baf3] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-[#52baf3]">G. Classification & Regulatory Data</h4>
              <div className="flex gap-2">
                <Edit className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
                <Trash2 className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
                <Plus className="h-4 w-4 text-[#52baf3] cursor-pointer"/>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Classification Provider</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.classificationData.classificationProvider} onChange={function (e) { return handleInputChange('classificationData.classificationProvider', e.target.value); }} className={"text-sm ".concat(getInputStyle("classificationData.classificationProvider"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Certificate No</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.classificationData.certificateNo} onChange={function (e) { return handleInputChange('classificationData.certificateNo', e.target.value); }} className={"text-sm ".concat(getInputStyle("classificationData.certificateNo"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Last Data Survey</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input type="date" value={componentData.classificationData.lastDataSurvey} onChange={function (e) { return handleInputChange('classificationData.lastDataSurvey', e.target.value); }} className={"text-sm ".concat(getInputStyle("classificationData.lastDataSurvey"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Next Data Survey</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input type="date" value={componentData.classificationData.nextDataSurvey} onChange={function (e) { return handleInputChange('classificationData.nextDataSurvey', e.target.value); }} className={"text-sm ".concat(getInputStyle("classificationData.nextDataSurvey"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Survey Type</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.classificationData.surveyType} onChange={function (e) { return handleInputChange('classificationData.surveyType', e.target.value); }} className={"text-sm ".concat(getInputStyle("classificationData.surveyType"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Class Requirements</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.classificationData.classRequirements} onChange={function (e) { return handleInputChange('classificationData.classRequirements', e.target.value); }} className={"text-sm ".concat(getInputStyle("classificationData.classRequirements"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Class Code</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.classificationData.classCode} onChange={function (e) { return handleInputChange('classificationData.classCode', e.target.value); }} className={"text-sm ".concat(getInputStyle("classificationData.classCode"))}/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-[#52baf3]">Information</Label>
                  <Edit className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                  <Trash2 className="h-3 w-3 text-[#52baf3] cursor-pointer"/>
                </div>
                <Input value={componentData.classificationData.information} onChange={function (e) { return handleInputChange('classificationData.information', e.target.value); }} className={"text-sm ".concat(getInputStyle("classificationData.information"))}/>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="border-[#52baf3] text-[#52baf3] hover:bg-[#52baf3] hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>);
};
export default ComponentChangeRequestForm;
//# sourceMappingURL=ComponentChangeRequestForm.jsx.map