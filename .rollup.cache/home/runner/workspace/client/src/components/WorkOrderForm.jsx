import { __assign, __awaiter, __generator } from "tslib";
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { FileText, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import WorkInstructionsDialog from "./WorkInstructionsDialog";
import { useToast } from "@/hooks/use-toast";
import { useModifyMode } from "@/hooks/useModifyMode";
import { ModifyFieldWrapper } from "@/components/modify/ModifyFieldWrapper";
import { generateSuggestions, extractContextFromWorkOrder } from "@/utils/suggestionEngine";
var WorkOrderForm = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSubmit = _a.onSubmit, onApprove = _a.onApprove, onReject = _a.onReject, component = _a.component, workOrder = _a.workOrder, _b = _a.isApprovalMode, isApprovalMode = _b === void 0 ? false : _b;
    var toast = useToast().toast;
    var _c = useState('partA'), activeSection = _c[0], setActiveSection = _c[1];
    var _d = useState(false), isWorkInstructionsOpen = _d[0], setIsWorkInstructionsOpen = _d[1];
    var _e = useState(""), rejectionComments = _e[0], setRejectionComments = _e[1];
    var _f = useState(false), showRejectionComments = _f[0], setShowRejectionComments = _f[1];
    var _g = useLocation(), location = _g[0], setLocation = _g[1];
    // Preview mode state 
    var _h = useState(false), isPreviewMode = _h[0], setIsPreviewMode = _h[1];
    var _j = useState(null), changeRequestData = _j[0], setChangeRequestData = _j[1];
    var _k = useState({}), previewChanges = _k[0], setPreviewChanges = _k[1];
    // Quick Input functionality for Work Carried Out
    var workCarriedOutRef = useRef(null);
    var _l = useState(false), showQuickInputs = _l[0], setShowQuickInputs = _l[1];
    // Smart Suggestions functionality
    var _m = useState(false), showSmartSuggestions = _m[0], setShowSmartSuggestions = _m[1];
    var _o = useState([]), smartSuggestions = _o[0], setSmartSuggestions = _o[1];
    // Predefined quick answers for Work Carried Out
    var quickAnswers = [
        "Work carried out, found satisfactory.",
        "Checked and tested, no defects observed.",
        "Alarm tested, found satisfactory.",
        "Routine maintenance carried out as per PMS.",
        "Equipment inspected, found in good condition.",
        "Lubrication/oiling carried out, parameters normal.",
        "Work completed, system restored to normal.",
        "Trial conducted, performance satisfactory.",
        "Defect rectified, equipment put back in service.",
        "Cleaning carried out, area left tidy."
    ];
    // Modify mode integration
    var _p = useModifyMode(), isModifyMode = _p.isModifyMode, targetId = _p.targetId, fieldChanges = _p.fieldChanges, trackFieldChange = _p.trackFieldChange, setOriginalSnapshot = _p.setOriginalSnapshot;
    // Debug logging
    console.log("WorkOrderForm Debug:", { isModifyMode: isModifyMode, targetId: targetId, fieldChanges: fieldChanges, isOpen: isOpen });
    // Preview mode detection from URL parameters
    useEffect(function () {
        var urlParams = new URLSearchParams(window.location.search);
        var previewChanges = urlParams.get('previewChanges');
        var changeRequestId = urlParams.get('changeRequestId');
        var targetType = urlParams.get('targetType');
        var previewTargetId = urlParams.get('targetId');
        if (previewChanges === '1' && changeRequestId && targetType === 'workOrder') {
            setIsPreviewMode(true);
            // Fetch change request data to get proposed changes
            fetch("/api/change-requests/".concat(changeRequestId))
                .then(function (res) { return res.json(); })
                .then(function (data) {
                setChangeRequestData(data);
                // Convert proposed changes to a lookup map for easy access
                var changes = {};
                if (data.proposedChangesJson) {
                    data.proposedChangesJson.forEach(function (change) {
                        changes[change.field] = {
                            oldValue: change.oldValue,
                            newValue: change.newValue
                        };
                    });
                }
                setPreviewChanges(changes);
            })
                .catch(function (error) {
                console.error('Failed to fetch change request data:', error);
            });
        }
        else {
            setIsPreviewMode(false);
            setChangeRequestData(null);
            setPreviewChanges({});
        }
    }, [location, isOpen]);
    // Functions for preview mode
    var hasPreviewChange = function (fieldName) {
        return previewChanges[fieldName] !== undefined;
    };
    var getPreviewValue = function (fieldName) {
        var _a;
        return ((_a = previewChanges[fieldName]) === null || _a === void 0 ? void 0 : _a.newValue) || '';
    };
    // Quick Input function to insert text at cursor position
    var insertQuickText = function (text) {
        var textarea = workCarriedOutRef.current;
        if (!textarea)
            return;
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        var currentValue = executionData.workCarriedOut;
        // Insert text at cursor position (or replace selection)
        var beforeCursor = currentValue.substring(0, start);
        var afterCursor = currentValue.substring(end);
        // Add newline if there's existing text and cursor is not at the beginning
        var prefix = beforeCursor && start > 0 ? '\n' : '';
        var newValue = beforeCursor + prefix + text + afterCursor;
        // Update the state
        handleExecutionChange('workCarriedOut', newValue);
        // Focus back to textarea and set cursor after inserted text
        setTimeout(function () {
            textarea.focus();
            var newCursorPosition = start + prefix.length + text.length;
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
    };
    // Smart Suggestions function to generate context-aware suggestions
    var generateSmartSuggestions = function () {
        try {
            var context = extractContextFromWorkOrder(workOrder, executionData);
            var suggestions = generateSuggestions(context);
            setSmartSuggestions(suggestions);
        }
        catch (error) {
            console.error('Error generating smart suggestions:', error);
            setSmartSuggestions([]);
        }
    };
    // Function to insert suggestion text (reuses Quick Input logic)
    var insertSuggestion = function (text) {
        insertQuickText(text);
    };
    // Toggle Smart Suggestions and generate on first open
    var toggleSmartSuggestions = function () {
        var newShowState = !showSmartSuggestions;
        setShowSmartSuggestions(newShowState);
        if (newShowState && smartSuggestions.length === 0) {
            generateSmartSuggestions();
        }
    };
    // Check if we're in execution mode (Part B)
    var executionMode = (workOrder === null || workOrder === void 0 ? void 0 : workOrder.executionMode) === true;
    // Check if form should be read-only - BUT in modify mode, make it editable
    var isReadOnly = !isModifyMode && ((workOrder === null || workOrder === void 0 ? void 0 : workOrder.status) === "Pending Approval" || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.status) === "Approved" || isApprovalMode);
    // Template data (Part A)
    var _q = useState({
        woTitle: "",
        component: (workOrder === null || workOrder === void 0 ? void 0 : workOrder.component) || (component === null || component === void 0 ? void 0 : component.name) || "",
        componentCode: (workOrder === null || workOrder === void 0 ? void 0 : workOrder.componentCode) || (component === null || component === void 0 ? void 0 : component.code) || "",
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
    }), templateData = _q[0], setTemplateData = _q[1];
    // Execution data (Part B)
    var _r = useState({
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
    }), executionData = _r[0], setExecutionData = _r[1];
    // Ranks for dropdowns
    var ranks = [
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
    var generateWOTemplateCode = function () {
        var compCode = templateData.componentCode || (component === null || component === void 0 ? void 0 : component.code);
        if (!compCode || !templateData.taskType || !templateData.maintenanceBasis)
            return "";
        var taskCodes = {
            "Inspection": "INS",
            "Overhaul": "OH",
            "Service": "SRV",
            "Testing": "TST"
        };
        var freqTag = "";
        if (templateData.maintenanceBasis === "Calendar" && templateData.frequencyValue && templateData.frequencyUnit) {
            var unitCode = templateData.frequencyUnit[0].toUpperCase();
            freqTag = "".concat(unitCode).concat(templateData.frequencyValue);
        }
        else if (templateData.maintenanceBasis === "Running Hours" && templateData.frequencyValue) {
            freqTag = "RH".concat(templateData.frequencyValue);
        }
        var taskCode = taskCodes[templateData.taskType] || "";
        return "WO-".concat(compCode, "-").concat(taskCode).concat(freqTag).toUpperCase();
    };
    // Generate WO Execution ID
    var generateWOExecutionId = function () {
        var year = new Date().getFullYear();
        var templateCode = templateData.woTemplateCode || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.templateCode) || generateWOTemplateCode();
        // In real implementation, get sequence from database based on existing executions
        var sequence = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
        return "".concat(year, "-").concat(templateCode, "-").concat(sequence);
    };
    // Update template code when relevant fields change
    useEffect(function () {
        if (!templateData.woTemplateCode) {
            var newCode_1 = generateWOTemplateCode();
            setTemplateData(function (prev) { return (__assign(__assign({}, prev), { woTemplateCode: newCode_1 })); });
        }
    }, [templateData.taskType, templateData.maintenanceBasis, templateData.frequencyValue, templateData.frequencyUnit]);
    // Load existing workOrder data
    useEffect(function () {
        if (workOrder) {
            var initialData_1 = {
                woTitle: workOrder.jobTitle || "",
                component: workOrder.component || (component === null || component === void 0 ? void 0 : component.name) || "",
                componentCode: workOrder.componentCode || (component === null || component === void 0 ? void 0 : component.code) || "",
                woTemplateCode: workOrder.templateCode || "",
                maintenanceBasis: workOrder.maintenanceBasis || "Calendar",
                frequencyValue: workOrder.frequencyValue || "",
                frequencyUnit: workOrder.frequencyUnit || "Months",
                taskType: workOrder.taskType || "Inspection",
                assignedTo: workOrder.assignedTo || "",
                approver: "",
                jobPriority: "Medium",
                classRelated: "No",
                briefWorkDescription: "",
                nextDueDate: workOrder.dueDate || "",
                nextDueReading: "",
                requiredSpareParts: [],
                requiredTools: [],
                safetyRequirements: {
                    ppe: "",
                    permits: "",
                    other: ""
                },
                workHistory: []
            };
            setTemplateData(function (prev) { return (__assign(__assign({}, prev), initialData_1)); });
            // Set original snapshot for modify mode
            if (isModifyMode && setOriginalSnapshot) {
                console.log("Setting original snapshot:", initialData_1);
                setOriginalSnapshot(initialData_1);
            }
            // If in execution mode, switch to Part B and generate execution ID
            if (executionMode) {
                setActiveSection('partB');
                setExecutionData(function (prev) { return (__assign(__assign({}, prev), { woExecutionId: generateWOExecutionId(), assignedTo: workOrder.assignedTo || "" })); });
            }
        }
    }, [workOrder, executionMode, isModifyMode, setOriginalSnapshot]);
    var selectSection = function (section) {
        setActiveSection(section);
    };
    var handleTemplateChange = function (field, value) {
        setTemplateData(function (prev) {
            var _a;
            var newData = __assign(__assign({}, prev), (_a = {}, _a[field] = value, _a));
            // Track field change for modify mode
            if (isModifyMode && trackFieldChange) {
                trackFieldChange(field, value, prev[field]);
            }
            return newData;
        });
    };
    var handleExecutionChange = function (field, value) {
        setExecutionData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
    };
    var handleSubmit = function () {
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
            // Ensure templateCode is generated
            if (!templateData.woTemplateCode) {
                templateData.woTemplateCode = generateWOTemplateCode();
            }
            // Calculate next due
            if (templateData.maintenanceBasis === "Calendar") {
                var today = new Date();
                var freq = parseInt(templateData.frequencyValue);
                if (templateData.frequencyUnit === "Days") {
                    today.setDate(today.getDate() + freq);
                }
                else if (templateData.frequencyUnit === "Weeks") {
                    today.setDate(today.getDate() + (freq * 7));
                }
                else if (templateData.frequencyUnit === "Months") {
                    today.setMonth(today.getMonth() + freq);
                }
                else if (templateData.frequencyUnit === "Years") {
                    today.setFullYear(today.getFullYear() + freq);
                }
                templateData.nextDueDate = today.toISOString().split('T')[0];
            }
            if (onSubmit) {
                var workOrderId = (workOrder === null || workOrder === void 0 ? void 0 : workOrder.id) || "new-".concat(Date.now());
                onSubmit(workOrderId, {
                    type: 'template',
                    data: __assign(__assign({}, templateData), { templateCode: templateData.woTemplateCode })
                });
            }
        }
        else {
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
                var workOrderId = (workOrder === null || workOrder === void 0 ? void 0 : workOrder.id) || "new-".concat(Date.now());
                var executionRecord = __assign(__assign(__assign({}, templateData), executionData), { woExecutionId: executionData.woExecutionId || generateWOExecutionId(), templateCode: templateData.woTemplateCode || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.templateCode), submittedDate: new Date().toISOString().split('T')[0] });
                onSubmit(workOrderId, { type: 'execution', data: executionRecord });
                toast({
                    title: "Success",
                    description: "Work Order submitted for approval",
                });
            }
        }
        onClose();
    };
    var handleApprove = function () {
        if (window.confirm("Approve this work completion?")) {
            if (onApprove) {
                onApprove((workOrder === null || workOrder === void 0 ? void 0 : workOrder.executionId) || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.id), "");
            }
            toast({
                title: "Success",
                description: "Work Order approved."
            });
            onClose();
        }
    };
    var handleReject = function () {
        if (!rejectionComments.trim()) {
            toast({
                title: "Error",
                description: "Please enter rejection comments.",
                variant: "destructive"
            });
            return;
        }
        if (onReject) {
            onReject((workOrder === null || workOrder === void 0 ? void 0 : workOrder.executionId) || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.id), rejectionComments);
        }
        toast({
            title: "Success",
            description: "Work Order rejected."
        });
        onClose();
    };
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] max-w-none h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 pr-12">
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isPreviewMode ? "Preview Change Request - Work Order Form" : "Work Order Form"}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {activeSection === 'partA' && (<Button variant="outline" size="sm" onClick={function () { return setIsWorkInstructionsOpen(true); }}>
                  <FileText className="h-4 w-4 mr-1"/>
                  Work Instructions
                </Button>)}
              {!isModifyMode && (<>
                  <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white" onClick={handleSubmit}>
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={onClose}>
                    <ArrowLeft className="h-4 w-4 mr-1"/>
                    Back
                  </Button>
                </>)}
            </div>
          </div>
          
          {/* Preview Mode Banner */}
          {isPreviewMode && changeRequestData && (<div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 text-sm">Viewing Change Request Preview</h4>
                  <p className="text-xs text-blue-700">
                    {changeRequestData.title} - Changed fields are highlighted in <span className="text-red-600 font-medium">red</span>
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={function () { return setLocation('/pms/modify-pms'); }} className="text-blue-700 border-blue-300 text-xs px-2 py-1 h-7">
                  <ArrowLeft className="w-3 h-3 mr-1"/>
                  Back
                </Button>
              </div>
            </div>)}
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Navigation */}
          <div className="w-72 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              <div className={"flex items-center gap-2 p-3 rounded cursor-pointer ".concat(activeSection === 'partA' ? 'bg-[#16569e] text-white' : 'bg-transparent text-[#8a8a8a] hover:bg-gray-100')} onClick={function () { return selectSection('partA'); }}>
                <div className={"w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ".concat(activeSection === 'partA' ? 'bg-white text-[#52baf3]' : 'bg-gray-300 text-white')}>
                  A
                </div>
                <span className="font-medium">Work Order Details</span>
              </div>
              <div className={"flex items-center gap-2 p-3 rounded cursor-pointer ".concat(activeSection === 'partB' ? 'bg-[#16569e] text-white' : 'bg-transparent text-[#8a8a8a] hover:bg-gray-100')} onClick={function () { return selectSection('partB'); }}>
                <div className={"w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ".concat(activeSection === 'partB' ? 'bg-white text-[#52baf3]' : 'bg-gray-300 text-white')}>
                  B
                </div>
                <span className="font-medium">Work Completion Record</span>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {/* Part A - Work Order Details (Template) */}
            {activeSection === 'partA' && (<div className="border border-gray-200 rounded-lg mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Part A - Work Order Details</h3>
                </div>

                <div className="p-6">
                  {/* Header Section */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">WO Title *</Label>
                        <ModifyFieldWrapper originalValue={(workOrder === null || workOrder === void 0 ? void 0 : workOrder.jobTitle) || ""} currentValue={templateData.woTitle} fieldName="woTitle" isModifyMode={isModifyMode} onFieldChange={trackFieldChange}>
                          <Input value={templateData.woTitle} onChange={function (e) { return handleTemplateChange('woTitle', e.target.value); }} className="text-sm" placeholder="Enter work order title" disabled={isReadOnly}/>
                        </ModifyFieldWrapper>
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
                        <ModifyFieldWrapper originalValue={(workOrder === null || workOrder === void 0 ? void 0 : workOrder.maintenanceBasis) || "Calendar"} currentValue={templateData.maintenanceBasis} fieldName="maintenanceBasis" isModifyMode={isModifyMode} onFieldChange={trackFieldChange}>
                          <Select value={templateData.maintenanceBasis} onValueChange={function (value) { return handleTemplateChange('maintenanceBasis', value); }} disabled={isReadOnly}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Calendar">Calendar</SelectItem>
                              <SelectItem value="Running Hours">Running Hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </ModifyFieldWrapper>
                      </div>
                      
                      {/* Frequency Fields */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">
                          {templateData.maintenanceBasis === "Calendar" ? "Every *" : "Every (Hours) *"}
                        </Label>
                        <ModifyFieldWrapper originalValue={(workOrder === null || workOrder === void 0 ? void 0 : workOrder.frequencyValue) || ""} currentValue={templateData.frequencyValue} fieldName="frequencyValue" isModifyMode={isModifyMode} onFieldChange={trackFieldChange}>
                          <Input type="number" value={isPreviewMode && hasPreviewChange('frequencyValue') ? getPreviewValue('frequencyValue') : templateData.frequencyValue} onChange={function (e) { return handleTemplateChange('frequencyValue', e.target.value); }} className={"text-sm ".concat(hasPreviewChange('frequencyValue') ? 'text-red-600 border-red-300 bg-red-50' : '')} placeholder={templateData.maintenanceBasis === "Running Hours" ? "e.g., 1000" : ""} disabled={isReadOnly || isPreviewMode}/>
                        </ModifyFieldWrapper>
                      </div>
                      
                      {templateData.maintenanceBasis === "Calendar" && (<div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Unit *</Label>
                          <ModifyFieldWrapper originalValue={(workOrder === null || workOrder === void 0 ? void 0 : workOrder.frequencyUnit) || "Months"} currentValue={templateData.frequencyUnit} fieldName="frequencyUnit" isModifyMode={isModifyMode} onFieldChange={trackFieldChange}>
                            <Select value={templateData.frequencyUnit} onValueChange={function (value) { return handleTemplateChange('frequencyUnit', value); }} disabled={isReadOnly}>
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
                          </ModifyFieldWrapper>
                        </div>)}

                      {/* Row 2 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Task Type *</Label>
                        <ModifyFieldWrapper originalValue={(workOrder === null || workOrder === void 0 ? void 0 : workOrder.taskType) || "Inspection"} currentValue={templateData.taskType} fieldName="taskType" isModifyMode={isModifyMode} onFieldChange={trackFieldChange}>
                          <Select value={templateData.taskType} onValueChange={function (value) { return handleTemplateChange('taskType', value); }} disabled={isReadOnly}>
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
                        </ModifyFieldWrapper>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Assigned To *</Label>
                        <ModifyFieldWrapper originalValue={(workOrder === null || workOrder === void 0 ? void 0 : workOrder.assignedTo) || ""} currentValue={templateData.assignedTo} fieldName="assignedTo" isModifyMode={isModifyMode} onFieldChange={trackFieldChange}>
                          <Select value={templateData.assignedTo} onValueChange={function (value) { return handleTemplateChange('assignedTo', value); }} disabled={isReadOnly}>
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select rank"/>
                            </SelectTrigger>
                            <SelectContent>
                              {ranks.map(function (rank) { return (<SelectItem key={rank} value={rank}>{rank}</SelectItem>); })}
                            </SelectContent>
                          </Select>
                        </ModifyFieldWrapper>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Approver</Label>
                        <Select value={templateData.approver} onValueChange={function (value) { return handleTemplateChange('approver', value); }}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select rank (optional)"/>
                          </SelectTrigger>
                          <SelectContent>
                            {ranks.map(function (rank) { return (<SelectItem key={rank} value={rank}>{rank}</SelectItem>); })}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Row 3 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Job Priority</Label>
                        <Select value={templateData.jobPriority} onValueChange={function (value) { return handleTemplateChange('jobPriority', value); }}>
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
                        <Select value={templateData.classRelated} onValueChange={function (value) { return handleTemplateChange('classRelated', value); }}>
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
                      <ModifyFieldWrapper originalValue={(workOrder === null || workOrder === void 0 ? void 0 : workOrder.briefWorkDescription) || ""} currentValue={templateData.briefWorkDescription} fieldName="briefWorkDescription" isModifyMode={isModifyMode} onFieldChange={trackFieldChange}>
                        <Textarea value={templateData.briefWorkDescription} onChange={function (e) { return handleTemplateChange('briefWorkDescription', e.target.value); }} className="mt-2 text-sm" rows={3} placeholder="Enter work description..." disabled={isReadOnly}/>
                      </ModifyFieldWrapper>
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
                        {templateData.workHistory && templateData.workHistory.length > 0 ? (templateData.workHistory.map(function (execution, index) { return (<div key={index} className="px-4 py-3 cursor-pointer hover:bg-gray-50" onClick={function () {
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
                            </div>); })) : (<div className="px-4 py-6 text-center text-gray-500 text-sm">
                            No work history for this template yet
                          </div>)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Part A Action Buttons - Show for modify mode */}
                {isModifyMode && (<div className="border-t border-gray-200 px-6 py-4">
                    <div className="flex justify-end">
                      <Button size="lg" className="bg-[#52BAF3] hover:bg-[#40a8e0] text-white px-8 py-3 text-base font-medium" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                    var proposedChanges, changeRequest, response, errorData, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (Object.keys(fieldChanges).length === 0) {
                                    toast({
                                        title: "No changes to submit",
                                        description: "Please make some changes before submitting a change request.",
                                        variant: "destructive"
                                    });
                                    return [2 /*return*/];
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 6, , 7]);
                                proposedChanges = Object.entries(fieldChanges).map(function (_a) {
                                    var fieldName = _a[0], change = _a[1];
                                    return ({
                                        field: fieldName,
                                        oldValue: change.originalValue,
                                        newValue: change.currentValue
                                    });
                                });
                                changeRequest = {
                                    vesselId: 'V001',
                                    category: 'workOrders',
                                    title: "Modify Work Order: ".concat((workOrder === null || workOrder === void 0 ? void 0 : workOrder.jobTitle) || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.woTitle) || 'Unknown'),
                                    reason: 'Work order modification request',
                                    requestedByUserId: 'current_user',
                                    targetType: 'workOrder',
                                    targetId: workOrder === null || workOrder === void 0 ? void 0 : workOrder.id,
                                    snapshotBeforeJson: {
                                        displayKey: (workOrder === null || workOrder === void 0 ? void 0 : workOrder.workOrderNo) || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.templateCode),
                                        displayName: (workOrder === null || workOrder === void 0 ? void 0 : workOrder.jobTitle) || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.woTitle),
                                        displayPath: "".concat((workOrder === null || workOrder === void 0 ? void 0 : workOrder.componentCode) || '', " ").concat((workOrder === null || workOrder === void 0 ? void 0 : workOrder.jobTitle) || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.woTitle) || ''),
                                        fields: workOrder
                                    },
                                    proposedChangesJson: proposedChanges,
                                    status: 'submitted'
                                };
                                console.log("Submitting change request:", changeRequest);
                                return [4 /*yield*/, fetch('/api/change-requests', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(changeRequest),
                                    })];
                            case 2:
                                response = _a.sent();
                                if (!response.ok) return [3 /*break*/, 3];
                                toast({
                                    title: "Change Request Submitted",
                                    description: "Your change request with ".concat(Object.keys(fieldChanges).length, " modifications has been submitted for approval."),
                                });
                                onClose();
                                window.location.href = '/pms/modify-pms';
                                return [3 /*break*/, 5];
                            case 3: return [4 /*yield*/, response.json()];
                            case 4:
                                errorData = _a.sent();
                                throw new Error(errorData.error || 'Failed to submit change request');
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                error_1 = _a.sent();
                                console.error('Error submitting change request:', error_1);
                                toast({
                                    title: "Submission failed",
                                    description: error_1.message || "Failed to submit change request. Please try again.",
                                    variant: "destructive"
                                });
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); }} disabled={Object.keys(fieldChanges).length === 0}>
                        Submit Change Request
                      </Button>
                    </div>
                  </div>)}
              </div>)}

            {/* Part B - Work Completion Record (EXECUTION) */}
            {activeSection === 'partB' && (<div className="border border-gray-200 rounded-lg mb-6">
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
                            <input type="radio" name="riskAssessment" value="yes" defaultChecked className="text-blue-600"/>
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="riskAssessment" value="no" className="text-blue-600"/>
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="riskAssessment" value="na" className="text-blue-600"/>
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
                            <input type="radio" name="safetyChecklists" value="yes" defaultChecked className="text-blue-600"/>
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="safetyChecklists" value="no" className="text-blue-600"/>
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="safetyChecklists" value="na" className="text-blue-600"/>
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
                            <input type="radio" name="operationalForms" value="yes" checked={executionData.operationalForms === "Yes"} onChange={function () { return handleExecutionChange('operationalForms', 'Yes'); }} className="text-blue-600"/>
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="operationalForms" value="no" className="text-blue-600"/>
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="operationalForms" value="na" className="text-blue-600"/>
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
                          <Input type="datetime-local" value={executionData.startDateTime} onChange={function (e) { return handleExecutionChange('startDateTime', e.target.value); }} className="w-full"/>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Completion Date & Time *</Label>
                          <Input type="datetime-local" value={executionData.completionDateTime} onChange={function (e) { return handleExecutionChange('completionDateTime', e.target.value); }} className="w-full"/>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Assigned To *</Label>
                          <Select value={executionData.assignedTo} onValueChange={function (value) { return handleExecutionChange('assignedTo', value); }}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select rank"/>
                            </SelectTrigger>
                            <SelectContent>
                              {ranks.map(function (rank) { return (<SelectItem key={rank} value={rank}>{rank}</SelectItem>); })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 mb-4">
                        {/* Row 2 */}
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Performed by *</Label>
                          <Select value={executionData.performedBy} onValueChange={function (value) { return handleExecutionChange('performedBy', value); }}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select rank"/>
                            </SelectTrigger>
                            <SelectContent>
                              {ranks.map(function (rank) { return (<SelectItem key={rank} value={rank}>{rank}</SelectItem>); })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">No of Persons in the team</Label>
                          <Input type="number" value={executionData.noOfPersons} onChange={function (e) {
                handleExecutionChange('noOfPersons', e.target.value);
                // Calculate manhours
                var persons = parseInt(e.target.value) || 0;
                var hours = parseFloat(executionData.totalTimeHours) || 0;
                handleExecutionChange('manhours', (persons * hours).toString());
            }} className="w-full"/>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Total Time Taken (Hours)</Label>
                          <Input type="number" value={executionData.totalTimeHours} onChange={function (e) {
                handleExecutionChange('totalTimeHours', e.target.value);
                // Calculate manhours
                var persons = parseInt(executionData.noOfPersons) || 0;
                var hours = parseFloat(e.target.value) || 0;
                handleExecutionChange('manhours', (persons * hours).toString());
            }} className="w-full"/>
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
                        <div className="flex items-center justify-between">
                          <Label className="text-sm text-[#8798ad]">Work Carried Out</Label>
                          <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={function () { return setShowQuickInputs(!showQuickInputs); }} className="text-xs text-[#52BAF3] border-[#52BAF3] hover:bg-blue-50 h-6 px-2">
                              Quick Input {showQuickInputs ? '▲' : '▼'}
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={toggleSmartSuggestions} className="text-xs text-[#52BAF3] border-[#52BAF3] hover:bg-blue-50 h-6 px-2">
                              Smart Suggestions {showSmartSuggestions ? '▲' : '▼'}
                            </Button>
                          </div>
                        </div>
                        
                        {/* Quick Input Pills */}
                        {showQuickInputs && (<div className="mb-3 p-3 bg-gray-50 rounded-lg border">
                            <p className="text-xs text-gray-600 mb-2">Click to insert common phrases:</p>
                            <div className="flex flex-wrap gap-1">
                              {quickAnswers.map(function (answer, index) { return (<button key={index} type="button" onClick={function () { return insertQuickText(answer); }} className="inline-flex items-center px-2 py-1 text-xs bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-[#52BAF3] hover:text-white hover:border-[#52BAF3] transition-colors duration-150 cursor-pointer">
                                  {answer}
                                </button>); })}
                            </div>
                          </div>)}
                        
                        {/* Smart Suggestions Panel */}
                        {showSmartSuggestions && (<div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-700 mb-2 font-medium">🧠 Smart Suggestions (based on work order details):</p>
                            <div className="space-y-2">
                              {smartSuggestions.length > 0 ? (smartSuggestions.map(function (suggestion, index) { return (<div key={index} onClick={function () { return insertSuggestion(suggestion); }} className="p-2 bg-white border border-blue-200 rounded cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-colors duration-150" title={suggestion} // Full text on hover
                >
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                      {suggestion.length > 140 ? "".concat(suggestion.substring(0, 140), "...") : suggestion}
                                    </p>
                                  </div>); })) : (<div className="p-2 text-sm text-gray-500 italic">
                                  No smart suggestions for this job yet.
                                </div>)}
                            </div>
                            {smartSuggestions.length > 0 && (<p className="text-xs text-blue-600 mt-2 italic">💡 Click any suggestion to insert at cursor position</p>)}
                          </div>)}
                        
                        <Textarea ref={workCarriedOutRef} value={executionData.workCarriedOut} onChange={function (e) { return handleExecutionChange('workCarriedOut', e.target.value); }} className="w-full min-h-[80px]" placeholder="Describe work carried out..."/>
                      </div>
                      
                      {/* Job Experience / Notes */}
                      <div className="space-y-2">
                        <Label className="text-sm text-[#8798ad]">Job Experience / Notes (to be retained for future)</Label>
                        <Textarea value={executionData.jobExperienceNotes} onChange={function (e) { return handleExecutionChange('jobExperienceNotes', e.target.value); }} className="w-full min-h-[80px]" placeholder="Enter job experience notes..."/>
                      </div>
                    </div>
                  </div>

                  {/* B3. Running Hours (Conditional - only for Running Hours based WOs) */}
                  {templateData.maintenanceBasis === "Running Hours" && (<div className="border border-gray-200 rounded-lg p-4 mb-6">
                      <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>B3. Running Hours</h4>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Previous reading *</Label>
                          <Input type="number" value={executionData.previousReading} onChange={function (e) { return handleExecutionChange('previousReading', e.target.value); }} placeholder="Enter previous hours reading" className="w-full"/>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8798ad]">Current Reading *</Label>
                          <Input type="number" value={executionData.currentReading} onChange={function (e) { return handleExecutionChange('currentReading', e.target.value); }} placeholder="Enter current hours reading" className="w-full"/>
                        </div>
                      </div>
                    </div>)}

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
                              <Input type="text" className="w-full" defaultValue="2"/>
                            </div>
                            <div>
                              <Input type="text" className="w-full"/>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-4 gap-4 text-sm items-center">
                            <div className="text-gray-900">SP-002</div>
                            <div className="text-gray-900">Filter Element</div>
                            <div>
                              <Input type="text" className="w-full" defaultValue="1"/>
                            </div>
                            <div>
                              <Input type="text" className="w-full"/>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-4 gap-4 text-sm items-center">
                            <div className="text-gray-900">SP -003</div>
                            <div className="text-gray-900">Bearing</div>
                            <div>
                              <Input type="text" className="w-full" defaultValue="2"/>
                            </div>
                            <div>
                              <Input type="text" className="w-full"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Comments (only show in approval mode) */}
                  {isApprovalMode && (<div className="border border-gray-200 rounded-lg p-4 mb-6">
                      <h4 className="text-md font-medium mb-4" style={{ color: '#16569e' }}>Rejection Comments</h4>
                      <Textarea value={rejectionComments} onChange={function (e) { return setRejectionComments(e.target.value); }} placeholder="Enter rejection comments..." className="w-full min-h-[80px]" disabled={!isApprovalMode}/>
                    </div>)}

                  {/* Action Buttons */}
                  <div className="flex justify-end mt-6 gap-4">
                    {isApprovalMode ? (<>
                        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-medium" onClick={handleApprove}>
                          Approve
                        </Button>
                        <Button size="lg" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-base font-medium" onClick={handleReject}>
                          Reject
                        </Button>
                      </>) : isModifyMode ? (<Button size="lg" className="bg-[#52BAF3] hover:bg-[#40a8e0] text-white px-8 py-3 text-base font-medium" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                    var proposedChanges, changeRequest, response, errorData, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (Object.keys(fieldChanges).length === 0) {
                                    toast({
                                        title: "No changes to submit",
                                        description: "Please make some changes before submitting a change request.",
                                        variant: "destructive"
                                    });
                                    return [2 /*return*/];
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 6, , 7]);
                                proposedChanges = Object.entries(fieldChanges).map(function (_a) {
                                    var fieldName = _a[0], change = _a[1];
                                    return ({
                                        field: fieldName,
                                        oldValue: change.originalValue,
                                        newValue: change.currentValue
                                    });
                                });
                                changeRequest = {
                                    vesselId: 'V001',
                                    category: 'workOrders',
                                    title: "Modify Work Order: ".concat((workOrder === null || workOrder === void 0 ? void 0 : workOrder.jobTitle) || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.woTitle) || 'Unknown'),
                                    reason: 'Work order modification request',
                                    requestedByUserId: 'current_user',
                                    targetType: 'workOrder',
                                    targetId: workOrder === null || workOrder === void 0 ? void 0 : workOrder.id,
                                    snapshotBeforeJson: {
                                        displayKey: (workOrder === null || workOrder === void 0 ? void 0 : workOrder.workOrderNo) || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.templateCode),
                                        displayName: (workOrder === null || workOrder === void 0 ? void 0 : workOrder.jobTitle) || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.woTitle),
                                        displayPath: "".concat((workOrder === null || workOrder === void 0 ? void 0 : workOrder.componentCode) || '', " ").concat((workOrder === null || workOrder === void 0 ? void 0 : workOrder.jobTitle) || (workOrder === null || workOrder === void 0 ? void 0 : workOrder.woTitle) || ''),
                                        fields: workOrder
                                    },
                                    proposedChangesJson: proposedChanges,
                                    status: 'submitted'
                                };
                                console.log("Submitting change request:", changeRequest);
                                return [4 /*yield*/, fetch('/api/change-requests', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(changeRequest),
                                    })];
                            case 2:
                                response = _a.sent();
                                if (!response.ok) return [3 /*break*/, 3];
                                toast({
                                    title: "Change Request Submitted",
                                    description: "Your change request with ".concat(Object.keys(fieldChanges).length, " modifications has been submitted for approval."),
                                });
                                onClose();
                                window.location.href = '/pms/modify-pms';
                                return [3 /*break*/, 5];
                            case 3: return [4 /*yield*/, response.json()];
                            case 4:
                                errorData = _a.sent();
                                throw new Error(errorData.error || 'Failed to submit change request');
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                error_2 = _a.sent();
                                console.error('Error submitting change request:', error_2);
                                toast({
                                    title: "Submission failed",
                                    description: error_2.message || "Failed to submit change request. Please try again.",
                                    variant: "destructive"
                                });
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); }} disabled={Object.keys(fieldChanges).length === 0}>
                        Submit Change Request
                      </Button>) : (<Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-medium" onClick={handleSubmit} disabled={isReadOnly && !isApprovalMode}>
                        Submit
                      </Button>)}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </DialogContent>
      
      {/* Work Instructions Dialog */}
      <WorkInstructionsDialog isOpen={isWorkInstructionsOpen} onClose={function () { return setIsWorkInstructionsOpen(false); }}/>
    </Dialog>);
};
export default WorkOrderForm;
//# sourceMappingURL=WorkOrderForm.jsx.map