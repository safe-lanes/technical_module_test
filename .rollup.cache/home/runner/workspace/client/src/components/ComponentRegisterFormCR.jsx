import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox'; // Unused import
import { 
// ArrowLeft, // Unused
Plus, 
// Upload, // Unused
// Eye, // Unused
Trash2, 
// Edit3, // Unused
X, ChevronRight, ChevronDown, Search, Save, Edit2, Link, } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getComponentCategory } from '@/utils/componentUtils';
// import { useChangeMode } from '@/contexts/ChangeModeContext'; // Unused
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import '../styles/change-request.css';
// Generate comprehensive mock data
var generateMockComponentData = function (component) {
    var isEngine = component.code.startsWith('6');
    var isDeck = component.code.startsWith('4');
    var isHull = component.code.startsWith('2');
    // const isAccommodation = component.code.startsWith('3'); // Unused
    var baseData = {
        code: component.code,
        name: component.name,
        description: "".concat(component.name, " - Critical ship component for vessel operations"),
        criticality: 'High',
        maker: isEngine
            ? 'MAN B&W'
            : isDeck
                ? 'MacGregor'
                : isHull
                    ? 'Hyundai Heavy Industries'
                    : 'Daikin Industries',
        model: isEngine
            ? '6S60ME-C8.2'
            : isDeck
                ? 'TTS-2400'
                : isHull
                    ? 'HHI-TANK-500'
                    : 'FXMQ-200',
        serialNo: "SN-".concat(component.code.replace(/\./g, ''), "-2024-").concat(Math.floor(Math.random() * 9000) + 1000),
        drawingNo: "DRW-".concat(component.code.replace(/\./g, ''), "-001"),
        componentCategory: getComponentCategory(component.id),
        location: isEngine
            ? 'Engine Room'
            : isDeck
                ? 'Main Deck'
                : isHull
                    ? 'Double Bottom'
                    : 'Accommodation Block',
        critical: Math.random() > 0.5 ? 'Yes' : 'No',
        installation: '2020-03-15',
        commissionedDate: '2020-04-01',
        rating: isEngine
            ? '6000 kW'
            : isDeck
                ? '25 tons'
                : isHull
                    ? '500 m³'
                    : '200 kW',
        conditionBased: 'Yes',
        noOfUnits: '1',
        equipmentDepartment: isEngine
            ? 'Engine'
            : isDeck
                ? 'Deck'
                : isHull
                    ? 'Hull'
                    : 'Hotel',
        parentComponent: component.code.split('.').slice(0, -1).join('.') || 'Ship',
        dimensionsSize: isEngine
            ? '12m x 3m x 4m'
            : isDeck
                ? '8m x 6m x 3m'
                : isHull
                    ? '20m x 15m x 8m'
                    : '4m x 3m x 2.5m',
        notes: "Regular maintenance required. Last inspection completed successfully.",
        runningHours: String(Math.floor(Math.random() * 50000) + 10000),
        dateUpdated: '2024-12-15',
        utilizationRate: "".concat(Math.floor(Math.random() * 30) + 70, "%"),
        avgDailyUsage: "".concat(Math.floor(Math.random() * 8) + 16, " hrs"),
        metrics: [
            {
                id: 'm1',
                name: 'Vibration',
                value: parseFloat((Math.random() * 2 + 1).toFixed(1)),
                originalData: {
                    name: 'Vibration',
                    value: parseFloat((Math.random() * 2 + 1).toFixed(1)),
                },
            },
            {
                id: 'm2',
                name: 'Temperature',
                value: Math.floor(Math.random() * 20) + 60,
                originalData: {
                    name: 'Temperature',
                    value: Math.floor(Math.random() * 20) + 60,
                },
            },
            {
                id: 'm3',
                name: 'Pressure',
                value: parseFloat((Math.random() * 2 + 6).toFixed(1)),
                originalData: {
                    name: 'Pressure',
                    value: parseFloat((Math.random() * 2 + 6).toFixed(1)),
                },
            },
        ],
        workOrders: [
            {
                id: "wo-".concat(component.code, "-1"),
                woNo: "WO-".concat(component.code, "-OHM6"),
                jobTitle: '6-Monthly Overhaul',
                assignedTo: 'Chief Engineer',
                frequencyType: 'Calendar',
                frequencyValue: 180,
                initialNextDue: '2025-06-01',
                notes: 'Complete overhaul including all checks',
            },
            {
                id: "wo-".concat(component.code, "-2"),
                woNo: "WO-".concat(component.code, "-RH500"),
                jobTitle: '500 Hours Service',
                assignedTo: '2nd Engineer',
                frequencyType: 'Running Hours',
                frequencyValue: 500,
                initialNextDue: '2025-02-15',
                notes: 'Running hours based maintenance',
            },
            {
                id: "wo-".concat(component.code, "-3"),
                woNo: "WO-".concat(component.code, "-DAILY"),
                jobTitle: 'Daily Checks',
                assignedTo: '3rd Engineer',
                frequencyType: 'Calendar',
                frequencyValue: 1,
                initialNextDue: '2025-01-15',
                notes: '',
            },
        ],
        spares: [
            {
                id: "spare-".concat(component.code, "-1"),
                partCode: "SP-".concat(component.code.replace(/\./g, ''), "-001"),
                partName: 'Gasket Set',
                min: 2,
                critical: 'Yes',
                location: 'Store Room A',
            },
            {
                id: "spare-".concat(component.code, "-2"),
                partCode: "SP-".concat(component.code.replace(/\./g, ''), "-002"),
                partName: 'Filter Element',
                min: 5,
                critical: 'No',
                location: 'Engine Store',
            },
            {
                id: "spare-".concat(component.code, "-3"),
                partCode: "SP-".concat(component.code.replace(/\./g, ''), "-003"),
                partName: 'Seal Ring',
                min: 10,
                critical: 'No',
                location: 'Store Room B',
            },
        ],
        documents: [
            { id: 'doc1', type: 'General Arrangement', name: 'GA_Drawing_v1.pdf' },
            { id: 'doc2', type: 'Maintenance Manual', name: 'MM_2024.pdf' },
            { id: 'doc3', type: 'Installation Guide', name: 'IG_v2.pdf' },
        ],
        classification: {
            classProvider: 'DNV GL',
            certificateNo: 'CERT-2024-001234',
            nextDataSurvey: '2025-06-15',
            classNotation: '1A1 General Cargo',
            surveyor: 'John Smith',
        },
        requisitions: [
            {
                id: 'req1',
                reqNo: 'REQ-2025-001',
                part: 'Bearing Set',
                qty: 2,
                date: '2025-01-10',
                status: 'Pending',
            },
            {
                id: 'req2',
                reqNo: 'REQ-2025-002',
                part: 'Filter Element',
                qty: 5,
                date: '2025-01-12',
                status: 'Approved',
            },
        ],
        maintenanceHistory: [
            {
                id: 'mh1',
                woNo: 'WO-2024-100',
                performedBy: 'Chief Engineer',
                totalTime: 4.5,
                completionDate: '2024-12-01',
                status: 'Completed',
            },
            {
                id: 'mh2',
                woNo: 'WO-2024-095',
                performedBy: '2nd Engineer',
                totalTime: 2.0,
                completionDate: '2024-11-15',
                status: 'Completed',
            },
        ],
    };
    return baseData;
};
// Available spares for linking (mock data)
var availableSpares = [
    {
        partCode: 'SP-NEW-001',
        partName: 'Bearing Set',
        min: 3,
        critical: 'Yes',
        location: 'Store Room A',
    },
    {
        partCode: 'SP-NEW-002',
        partName: 'O-Ring Kit',
        min: 10,
        critical: 'No',
        location: 'Store Room B',
    },
    {
        partCode: 'SP-NEW-003',
        partName: 'Valve Assembly',
        min: 1,
        critical: 'Yes',
        location: 'Engine Store',
    },
    {
        partCode: 'SP-NEW-004',
        partName: 'Pump Seal',
        min: 5,
        critical: 'No',
        location: 'Store Room A',
    },
    {
        partCode: 'SP-NEW-005',
        partName: 'Pressure Gauge',
        min: 2,
        critical: 'Yes',
        location: 'Control Room',
    },
    {
        partCode: 'SP-NEW-006',
        partName: 'Temperature Sensor',
        min: 3,
        critical: 'Yes',
        location: 'Store Room C',
    },
    {
        partCode: 'SP-NEW-007',
        partName: 'Flow Meter',
        min: 1,
        critical: 'No',
        location: 'Engine Store',
    },
    {
        partCode: 'SP-NEW-008',
        partName: 'Safety Valve',
        min: 2,
        critical: 'Yes',
        location: 'Store Room A',
    },
];
export default function ComponentRegisterFormCR(_a) {
    var _this = this;
    var _b;
    var isOpen = _a.isOpen, onClose = _a.onClose, selectedComponent = _a.selectedComponent;
    var toast = useToast().toast;
    var _c = useLocation(), setLocation = _c[1];
    var queryClient = useQueryClient();
    // const { isChangeMode } = useChangeMode(); // Unused
    // State for component data
    var _d = useState(null), componentData = _d[0], setComponentData = _d[1];
    var _e = useState(null), originalData = _e[0], setOriginalData = _e[1];
    var _f = useState(new Map()), changeTracking = _f[0], setChangeTracking = _f[1];
    var _g = useState({}), sectionChangeCounts = _g[0], setSectionChangeCounts = _g[1];
    // State for Work Orders
    // const [editingWorkOrders, setEditingWorkOrders] = useState<Set<string>>(
    //   new Set()
    // ); // Unused
    var _h = useState({}), workOrderErrors = _h[0], setWorkOrderErrors = _h[1];
    // State for Spares
    var _j = useState(false), showSpareLinkPicker = _j[0], setShowSpareLinkPicker = _j[1];
    var _k = useState(new Set()), selectedNewSpares = _k[0], setSelectedNewSpares = _k[1];
    var _l = useState(''), spareSearchQuery = _l[0], setSpareSearchQuery = _l[1];
    // State for expanded sections
    var _m = useState(new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])), expandedSections = _m[0], setExpandedSections = _m[1];
    // Initialize component data when component is selected
    useEffect(function () {
        if (selectedComponent) {
            var mockData = generateMockComponentData(selectedComponent);
            setComponentData(mockData);
            setOriginalData(JSON.parse(JSON.stringify(mockData))); // Deep clone
            setChangeTracking(new Map());
            setSectionChangeCounts({});
        }
    }, [selectedComponent]);
    // Track field changes
    var trackFieldChange = useCallback(function (path, newValue, _section) {
        if (!originalData || !componentData)
            return;
        var originalValue = path
            .split('.')
            .reduce(function (obj, key) { return obj === null || obj === void 0 ? void 0 : obj[key]; }, originalData);
        if (JSON.stringify(originalValue) !== JSON.stringify(newValue)) {
            var newTracking = new Map(changeTracking);
            newTracking.set(path, { from: originalValue, to: newValue, path: path });
            setChangeTracking(newTracking);
        }
        else {
            var newTracking = new Map(changeTracking);
            newTracking.delete(path);
            setChangeTracking(newTracking);
        }
        // Update section change counts
        updateSectionChangeCount();
    }, [originalData, componentData, changeTracking]);
    // Update section change counts
    var updateSectionChangeCount = useCallback(function () {
        var counts = {};
        changeTracking.forEach(function (_change, path) {
            var section = path.charAt(0); // Get first character as section
            counts[section] = (counts[section] || 0) + 1;
        });
        // Count Work Order changes
        if (componentData === null || componentData === void 0 ? void 0 : componentData.workOrders) {
            var woChanges = componentData.workOrders.filter(function (wo) { return wo.isNew || wo.pendingDelete || wo.isEditing; }).length;
            if (woChanges > 0)
                counts['C'] = (counts['C'] || 0) + woChanges;
        }
        // Count Spare changes
        if (componentData === null || componentData === void 0 ? void 0 : componentData.spares) {
            var spareChanges = componentData.spares.filter(function (spare) { return spare.isLinkedNew || spare.pendingUnlink || spare.isEditing; }).length;
            if (spareChanges > 0)
                counts['E'] = (counts['E'] || 0) + spareChanges;
        }
        setSectionChangeCounts(counts);
    }, [changeTracking, componentData]);
    // Handle input changes
    var handleInputChange = function (field, value, section) {
        if (section === void 0) { section = 'A'; }
        if (!componentData)
            return;
        setComponentData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        trackFieldChange("".concat(section, ".").concat(field), value, section);
    };
    // Work Order functions
    var handleEditWorkOrder = function (woId) {
        console.log('Edit Work Order clicked:', woId);
        // // setEditingWorkOrders // Unused(prev => new Set(prev).add(woId)); // Unused
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { workOrders: prev.workOrders.map(function (wo) {
                return wo.id === woId
                    ? __assign(__assign({}, wo), { isEditing: true, originalData: __assign({}, wo) }) : wo;
            }) })); });
    };
    var handleSaveWorkOrderEdit = function (woId) {
        var _a;
        var wo = componentData === null || componentData === void 0 ? void 0 : componentData.workOrders.find(function (w) { return w.id === woId; });
        if (!wo)
            return;
        // Validate
        if (!wo.jobTitle ||
            !wo.frequencyType ||
            !wo.frequencyValue ||
            wo.frequencyValue <= 0) {
            setWorkOrderErrors((_a = {}, _a[woId] = 'Please fill all required fields', _a));
            return;
        }
        // setEditingWorkOrders(prev => {
        //   const newSet = new Set(prev);
        //   newSet.delete(woId);
        //   return newSet;
        // }); // Unused
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { workOrders: prev.workOrders.map(function (w) {
                return w.id === woId ? __assign(__assign({}, w), { isEditing: false }) : w;
            }) })); });
        setWorkOrderErrors({});
        updateSectionChangeCount();
    };
    var handleCancelWorkOrderEdit = function (woId) {
        // setEditingWorkOrders(prev => {
        //   const newSet = new Set(prev);
        //   newSet.delete(woId);
        //   return newSet;
        // }); // Unused
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { workOrders: prev.workOrders.map(function (wo) {
                if (wo.id === woId && wo.originalData) {
                    var originalData_1 = wo.originalData;
                    return __assign(__assign({}, originalData_1), { id: wo.id });
                }
                return wo;
            }) })); });
        setWorkOrderErrors({});
    };
    var handleDeleteWorkOrder = function (woId) {
        console.log('Delete Work Order clicked:', woId);
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { workOrders: prev.workOrders.map(function (wo) {
                return wo.id === woId ? __assign(__assign({}, wo), { pendingDelete: true }) : wo;
            }) })); });
        updateSectionChangeCount();
    };
    var handleAddWorkOrder = function () {
        var newWO = {
            id: "new-wo-".concat(Date.now()),
            jobTitle: '',
            assignedTo: '',
            frequencyType: 'Calendar',
            frequencyValue: 30,
            initialNextDue: '',
            notes: '',
            isNew: true,
            isEditing: true,
        };
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { workOrders: __spreadArray(__spreadArray([], prev.workOrders, true), [newWO], false) })); });
        // setEditingWorkOrders(prev => new Set(prev).add(newWO.id!)); // Unused
        updateSectionChangeCount();
    };
    var handleWorkOrderFieldChange = function (woId, field, value) {
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { workOrders: prev.workOrders.map(function (wo) {
                var _a;
                return wo.id === woId ? __assign(__assign({}, wo), (_a = {}, _a[field] = value, _a)) : wo;
            }) })); });
    };
    // Spare functions
    var handleEditSpare = function (spareId, field, value) {
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { spares: prev.spares.map(function (spare) {
                var _a;
                return spare.id === spareId
                    ? __assign(__assign({}, spare), (_a = {}, _a[field] = value, _a.isEditing = true, _a)) : spare;
            }) })); });
        updateSectionChangeCount();
    };
    var handleUnlinkSpare = function (spareId) {
        console.log('handleUnlinkSpare called with:', spareId);
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { spares: prev.spares.map(function (spare) {
                return spare.id === spareId ? __assign(__assign({}, spare), { pendingUnlink: true }) : spare;
            }) })); });
        updateSectionChangeCount();
    };
    var handleLinkNewSpares = function () {
        var newSpares = Array.from(selectedNewSpares).map(function (partCode) {
            var spare = availableSpares.find(function (s) { return s.partCode === partCode; });
            return __assign(__assign({}, spare), { id: "linked-".concat(partCode, "-").concat(Date.now()), isLinkedNew: true });
        });
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { spares: __spreadArray(__spreadArray([], prev.spares, true), newSpares, true) })); });
        setShowSpareLinkPicker(false);
        setSelectedNewSpares(new Set());
        setSpareSearchQuery('');
        updateSectionChangeCount();
    };
    // Handle Metrics
    var handleAddMetric = function () {
        if (!componentData)
            return;
        var newMetric = {
            id: "metric-new-".concat(Date.now()),
            name: 'New Metric',
            value: 0,
            isNew: true,
            isEditing: true,
        };
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { metrics: __spreadArray(__spreadArray([], (prev.metrics || []), true), [newMetric], false) })); });
        updateSectionChangeCount();
    };
    var handleMetricFieldChange = function (metricId, field, value) {
        if (!componentData)
            return;
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { metrics: (prev.metrics || []).map(function (m) {
                var _a;
                if (m.id === metricId) {
                    var updated = __assign(__assign({}, m), (_a = {}, _a[field] = value, _a.isEditing = true, _a));
                    if (!m.isNew && m.originalData) {
                        // Check if value is back to original
                        if (m.originalData[field] === value) {
                            updated.isEditing = false;
                        }
                    }
                    return updated;
                }
                return m;
            }) })); });
        updateSectionChangeCount();
    };
    var handleDeleteMetric = function (metricId) {
        console.log('handleDeleteMetric called with:', metricId);
        if (!componentData)
            return;
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { metrics: (prev.metrics || []).map(function (m) {
                return m.id === metricId ? __assign(__assign({}, m), { pendingDelete: true }) : m;
            }) })); });
        updateSectionChangeCount();
    };
    var handleRestoreMetric = function (metricId) {
        if (!componentData)
            return;
        setComponentData(function (prev) { return (__assign(__assign({}, prev), { metrics: (prev.metrics || []).map(function (m) {
                return m.id === metricId ? __assign(__assign({}, m), { pendingDelete: false }) : m;
            }) })); });
        updateSectionChangeCount();
    };
    // Build change request payload
    var buildChangeRequestPayload = function () {
        if (!componentData || !originalData)
            return null;
        var diff = {};
        var summary = {};
        // Track Section A changes
        var sectionAFields = [
            'maker',
            'model',
            'serialNo',
            'location',
            'critical',
            'installation',
            'commissionedDate',
            'rating',
            'conditionBased',
            'noOfUnits',
            'equipmentDepartment',
            'parentComponent',
            'dimensionsSize',
            'notes',
        ];
        var sectionACount = 0;
        sectionAFields.forEach(function (field) {
            if (componentData[field] !==
                originalData[field]) {
                diff["A.".concat(field)] = {
                    from: originalData[field],
                    to: componentData[field],
                };
                sectionACount++;
            }
        });
        if (sectionACount > 0)
            summary['A'] = sectionACount;
        // Track Section B changes
        var sectionBFields = [
            'runningHours',
            'dateUpdated',
            'utilizationRate',
            'avgDailyUsage',
            'vibration',
            'temperature',
            'pressure',
        ];
        var sectionBCount = 0;
        sectionBFields.forEach(function (field) {
            if (componentData[field] !==
                originalData[field]) {
                diff["B.".concat(field)] = {
                    from: originalData[field],
                    to: componentData[field],
                };
                sectionBCount++;
            }
        });
        if (sectionBCount > 0)
            summary['B'] = sectionBCount;
        // Track Work Order changes (Section C)
        var woAdded = [];
        var woModified = [];
        var woRemoved = [];
        componentData.workOrders.forEach(function (wo) {
            if (wo.isNew && !wo.pendingDelete) {
                woAdded.push({
                    tempId: wo.id,
                    jobTitle: wo.jobTitle,
                    assignedTo: wo.assignedTo,
                    frequencyType: wo.frequencyType,
                    frequencyValue: wo.frequencyValue,
                    initialNextDue: wo.initialNextDue,
                    notes: wo.notes,
                });
            }
            else if (wo.pendingDelete && !wo.isNew) {
                woRemoved.push({ woNo: wo.woNo });
            }
            else if (wo.originalData && !wo.pendingDelete) {
                var fields_1 = {};
                Object.keys(wo.originalData).forEach(function (key) {
                    if (wo[key] !== wo.originalData[key]) {
                        fields_1[key] = {
                            from: wo.originalData[key],
                            to: wo[key],
                        };
                    }
                });
                if (Object.keys(fields_1).length > 0) {
                    woModified.push({ woNo: wo.woNo, fields: fields_1 });
                }
            }
        });
        if (woAdded.length > 0)
            diff['C.workOrders.added'] = woAdded;
        if (woModified.length > 0)
            diff['C.workOrders.modified'] = woModified;
        if (woRemoved.length > 0)
            diff['C.workOrders.removed'] = woRemoved;
        if (woAdded.length + woModified.length + woRemoved.length > 0) {
            summary['C'] = {
                added: woAdded.length,
                modified: woModified.length,
                removed: woRemoved.length,
            };
        }
        // Track Spare changes (Section E)
        var sparesAdded = [];
        var sparesModified = [];
        var sparesRemoved = [];
        componentData.spares.forEach(function (spare) {
            if (spare.isLinkedNew && !spare.pendingUnlink) {
                sparesAdded.push({
                    partCode: spare.partCode,
                    min: spare.min,
                    critical: spare.critical,
                    location: spare.location,
                });
            }
            else if (spare.pendingUnlink && !spare.isLinkedNew) {
                sparesRemoved.push({ partCode: spare.partCode });
            }
            else if (spare.isEditing &&
                !spare.pendingUnlink &&
                !spare.isLinkedNew) {
                var original = originalData.spares.find(function (s) { return s.id === spare.id; });
                if (original) {
                    var fields = {};
                    if (spare.min !== original.min)
                        fields.min = { from: original.min, to: spare.min };
                    if (spare.critical !== original.critical)
                        fields.critical = { from: original.critical, to: spare.critical };
                    if (spare.location !== original.location)
                        fields.location = { from: original.location, to: spare.location };
                    if (Object.keys(fields).length > 0) {
                        sparesModified.push({ partCode: spare.partCode, fields: fields });
                    }
                }
            }
        });
        if (sparesAdded.length > 0)
            diff['E.spares.added'] = sparesAdded;
        if (sparesModified.length > 0)
            diff['E.spares.modified'] = sparesModified;
        if (sparesRemoved.length > 0)
            diff['E.spares.removed'] = sparesRemoved;
        if (sparesAdded.length + sparesModified.length + sparesRemoved.length > 0) {
            summary['E'] = {
                added: sparesAdded.length,
                modified: sparesModified.length,
                removed: sparesRemoved.length,
            };
        }
        return {
            type: 'COMPONENT',
            target: {
                componentId: selectedComponent === null || selectedComponent === void 0 ? void 0 : selectedComponent.id,
                componentCode: selectedComponent === null || selectedComponent === void 0 ? void 0 : selectedComponent.code,
                componentName: selectedComponent === null || selectedComponent === void 0 ? void 0 : selectedComponent.name,
                vesselId: 'vessel-001',
            },
            title: "Component Update - ".concat(selectedComponent === null || selectedComponent === void 0 ? void 0 : selectedComponent.code, " ").concat(selectedComponent === null || selectedComponent === void 0 ? void 0 : selectedComponent.name),
            reason: 'Component maintenance and configuration update',
            summary: summary,
            diff: diff,
        };
    };
    // Submit mutation
    var submitChangeRequest = useMutation({
        mutationFn: function (payload) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest('POST', '/api/modify-pms/requests', payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/modify-pms/requests'] });
            toast({
                title: 'Success',
                description: 'Change request submitted successfully',
            });
            onClose();
            setLocation('/pms/modify-pms');
        },
        onError: function (_error) {
            toast({
                title: 'Error',
                description: 'Failed to submit change request',
                variant: 'destructive',
            });
        },
    });
    // Handle submit
    var handleSubmit = function () {
        // Validate all editing work orders
        var invalidWOs = componentData === null || componentData === void 0 ? void 0 : componentData.workOrders.filter(function (wo) {
            return wo.isEditing &&
                (!wo.jobTitle ||
                    !wo.frequencyType ||
                    !wo.frequencyValue ||
                    wo.frequencyValue <= 0);
        });
        if (invalidWOs && invalidWOs.length > 0) {
            toast({
                title: 'Validation Error',
                description: 'Please complete all work order edits before submitting',
                variant: 'destructive',
            });
            return;
        }
        var payload = buildChangeRequestPayload();
        if (!payload || Object.keys(payload.diff).length === 0) {
            toast({
                title: 'No Changes',
                description: 'No changes have been made to submit',
                variant: 'destructive',
            });
            return;
        }
        submitChangeRequest.mutate(payload);
    };
    // Toggle section expansion
    var toggleSection = function (section) {
        setExpandedSections(function (prev) {
            var newSet = new Set(prev);
            if (newSet.has(section)) {
                newSet.delete(section);
            }
            else {
                newSet.add(section);
            }
            return newSet;
        });
    };
    // Check if a field has changed
    var hasFieldChanged = function (path) {
        return changeTracking.has(path);
    };
    // Get CSS class for changed field
    var getFieldClass = function (path, baseClass) {
        if (baseClass === void 0) { baseClass = ''; }
        var classes = [baseClass];
        if (hasFieldChanged(path)) {
            classes.push('cr-changed');
        }
        return classes.join(' ');
    };
    // Get label class for changed field
    var getLabelClass = function (path) {
        return hasFieldChanged(path) ? 'cr-changed-label' : '';
    };
    if (!selectedComponent || !componentData) {
        return null;
    }
    // Filter spares for link picker
    var filteredAvailableSpares = availableSpares.filter(function (spare) {
        return !componentData.spares.some(function (s) { return s.partCode === spare.partCode; }) &&
            (spare.partCode.toLowerCase().includes(spareSearchQuery.toLowerCase()) ||
                spare.partName.toLowerCase().includes(spareSearchQuery.toLowerCase()));
    });
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[90vw] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-[#2c5282]'>
            Modify PMS - {selectedComponent.code} {selectedComponent.name}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Section A - Component Information */}
          <div className={expandedSections.has('A') ? 'cr-changed-row' : ''}>
            <h4 className='text-lg font-semibold mb-4 text-[#16569e] cursor-pointer flex items-center justify-between' onClick={function () { return toggleSection('A'); }}>
              <span className='flex items-center'>
                A. Component Information
                {sectionChangeCounts['A'] > 0 && (<span className='section-chip'>
                    {sectionChangeCounts['A']} changes
                  </span>)}
              </span>
              {expandedSections.has('A') ? (<ChevronDown className='h-5 w-5'/>) : (<ChevronRight className='h-5 w-5'/>)}
            </h4>

            {expandedSections.has('A') && (<div className='space-y-6'>
                <div className='grid grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.maker')}>Maker</Label>
                    <Input value={componentData.maker} onChange={function (e) {
                return handleInputChange('maker', e.target.value, 'A');
            }} className={getFieldClass('A.maker', 'border-[#52baf3] border-2')}/>
                  </div>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.model')}>Model</Label>
                    <Input value={componentData.model} onChange={function (e) {
                return handleInputChange('model', e.target.value, 'A');
            }} className={getFieldClass('A.model', 'border-[#52baf3] border-2')}/>
                  </div>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.serialNo')}>
                      Serial No
                    </Label>
                    <Input value={componentData.serialNo} onChange={function (e) {
                return handleInputChange('serialNo', e.target.value, 'A');
            }} className={getFieldClass('A.serialNo', 'border-[#52baf3] border-2')}/>
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.drawingNo')}>
                      Drawing No
                    </Label>
                    <Input value={componentData.drawingNo} onChange={function (e) {
                return handleInputChange('drawingNo', e.target.value, 'A');
            }} className={getFieldClass('A.drawingNo', 'border-[#52baf3] border-2')}/>
                  </div>
                  <div className='space-y-2'>
                    <Label>Component Code</Label>
                    <Input value={componentData.code} disabled className='bg-gray-100'/>
                  </div>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.componentCategory')}>
                      Component Category
                    </Label>
                    <Select value={componentData.componentCategory} onValueChange={function (value) {
                return handleInputChange('componentCategory', value, 'A');
            }}>
                      <SelectTrigger className={getFieldClass('A.componentCategory', 'border-[#52baf3] border-2')}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ship's Structure">
                          Ship's Structure
                        </SelectItem>
                        <SelectItem value='Deck Machinery'>
                          Deck Machinery
                        </SelectItem>
                        <SelectItem value='Engine Department'>
                          Engine Department
                        </SelectItem>
                        <SelectItem value='Safety Equipment'>
                          Safety Equipment
                        </SelectItem>
                        <SelectItem value='Accommodation'>
                          Accommodation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.location')}>
                      Location
                    </Label>
                    <Input value={componentData.location} onChange={function (e) {
                return handleInputChange('location', e.target.value, 'A');
            }} className={getFieldClass('A.location', 'border-[#52baf3] border-2')}/>
                  </div>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.critical')}>
                      Critical
                    </Label>
                    <Select value={componentData.critical} onValueChange={function (value) {
                return handleInputChange('critical', value, 'A');
            }}>
                      <SelectTrigger className={getFieldClass('A.critical', 'border-[#52baf3] border-2')}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Yes'>Yes</SelectItem>
                        <SelectItem value='No'>No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.conditionBased')}>
                      Condition Based
                    </Label>
                    <Select value={componentData.conditionBased} onValueChange={function (value) {
                return handleInputChange('conditionBased', value, 'A');
            }}>
                      <SelectTrigger className={getFieldClass('A.conditionBased', 'border-[#52baf3] border-2')}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Yes'>Yes</SelectItem>
                        <SelectItem value='No'>No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.installation')}>
                      Installation Date
                    </Label>
                    <Input type='date' value={componentData.installation} onChange={function (e) {
                return handleInputChange('installation', e.target.value, 'A');
            }} className={getFieldClass('A.installation', 'border-[#52baf3] border-2')}/>
                  </div>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.commissionedDate')}>
                      Commissioned Date
                    </Label>
                    <Input type='date' value={componentData.commissionedDate} onChange={function (e) {
                return handleInputChange('commissionedDate', e.target.value, 'A');
            }} className={getFieldClass('A.commissionedDate', 'border-[#52baf3] border-2')}/>
                  </div>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.rating')}>Rating</Label>
                    <Input value={componentData.rating} onChange={function (e) {
                return handleInputChange('rating', e.target.value, 'A');
            }} className={getFieldClass('A.rating', 'border-[#52baf3] border-2')}/>
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.noOfUnits')}>
                      No of Units
                    </Label>
                    <Input value={componentData.noOfUnits} onChange={function (e) {
                return handleInputChange('noOfUnits', e.target.value, 'A');
            }} className={getFieldClass('A.noOfUnits', 'border-[#52baf3] border-2')}/>
                  </div>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.equipmentDepartment')}>
                      Eqpt / System Department
                    </Label>
                    <Input value={componentData.equipmentDepartment} onChange={function (e) {
                return handleInputChange('equipmentDepartment', e.target.value, 'A');
            }} className={getFieldClass('A.equipmentDepartment', 'border-[#52baf3] border-2')}/>
                  </div>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.parentComponent')}>
                      Parent Component
                    </Label>
                    <Input value={componentData.parentComponent} onChange={function (e) {
                return handleInputChange('parentComponent', e.target.value, 'A');
            }} className={getFieldClass('A.parentComponent', 'border-[#52baf3] border-2')} placeholder='Select parent component'/>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.dimensionsSize')}>
                      Dimensions / Size
                    </Label>
                    <Input value={componentData.dimensionsSize} onChange={function (e) {
                return handleInputChange('dimensionsSize', e.target.value, 'A');
            }} className={getFieldClass('A.dimensionsSize', 'border-[#52baf3] border-2')}/>
                  </div>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('A.notes')}>Notes</Label>
                    <Textarea value={componentData.notes} onChange={function (e) {
                return handleInputChange('notes', e.target.value, 'A');
            }} className={getFieldClass('A.notes', 'border-[#52baf3] border-2')} rows={3}/>
                  </div>
                </div>
              </div>)}
          </div>

          {/* Section B - Running Hours & Condition Monitoring */}
          <div>
            <h4 className='text-lg font-semibold mb-4 text-[#16569e] cursor-pointer flex items-center justify-between' onClick={function () { return toggleSection('B'); }}>
              <span className='flex items-center'>
                B. Running Hours & Condition Monitoring
                {sectionChangeCounts['B'] > 0 && (<span className='section-chip'>
                    {sectionChangeCounts['B']} changes
                  </span>)}
              </span>
              {expandedSections.has('B') ? (<ChevronDown className='h-5 w-5'/>) : (<ChevronRight className='h-5 w-5'/>)}
            </h4>

            {expandedSections.has('B') && (<div className='space-y-6'>
                <div className='grid grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('B.runningHours')}>
                      Running Hours
                    </Label>
                    <Input type='number' value={componentData.runningHours} onChange={function (e) {
                return handleInputChange('runningHours', e.target.value, 'B');
            }} className={getFieldClass('B.runningHours', 'border-[#52baf3] border-2')}/>
                  </div>
                  <div className='space-y-2'>
                    <Label className={getLabelClass('B.dateUpdated')}>
                      Date Updated
                    </Label>
                    <Input type='date' value={componentData.dateUpdated} onChange={function (e) {
                return handleInputChange('dateUpdated', e.target.value, 'B');
            }} className={getFieldClass('B.dateUpdated', 'border-[#52baf3] border-2')}/>
                  </div>
                </div>

                <div>
                  <div className='flex justify-between items-center mb-4'>
                    <Label>Condition Monitoring Metrics</Label>
                    <Button onClick={function () { return handleAddMetric(); }} size='sm' className='bg-[#52baf3] hover:bg-[#4299d1] text-white'>
                      <Plus className='h-4 w-4 mr-1'/>
                      Add Metric
                    </Button>
                  </div>
                  <div className='border rounded-lg overflow-hidden'>
                    <table className='w-full'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                            Metric Name
                          </th>
                          <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                            Value
                          </th>
                          <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(_b = componentData.metrics) === null || _b === void 0 ? void 0 : _b.map(function (metric) { return (<tr key={metric.id} className={"\n                              ".concat(metric.pendingDelete ? 'strike-removed cr-changed-row' : '', "\n                              ").concat(metric.isNew ? 'cr-new-item' : '', "\n                              ").concat(metric.isEditing && !metric.isNew ? 'cr-modified-item' : '', "\n                            ")}>
                            <td className='px-4 py-2'>
                              <Input value={metric.name} onChange={function (e) {
                    return handleMetricFieldChange(metric.id, 'name', e.target.value);
                }} className={"h-8 ".concat(metric.isEditing || metric.isNew ? 'cr-changed' : '')} disabled={metric.pendingDelete}/>
                            </td>
                            <td className='px-4 py-2'>
                              <Input type='number' value={metric.value} onChange={function (e) {
                    return handleMetricFieldChange(metric.id, 'value', parseFloat(e.target.value));
                }} className={"h-8 w-32 ".concat(metric.isEditing || metric.isNew ? 'cr-changed' : '')} disabled={metric.pendingDelete}/>
                            </td>
                            <td className='px-4 py-2'>
                              {!metric.pendingDelete && (<Button size='sm' variant='outline' onClick={function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Delete metric clicked:', metric.id);
                        handleDeleteMetric(metric.id);
                    }} className='h-8 text-red-600 hover:text-red-700' type='button'>
                                  <Trash2 className='h-4 w-4'/>
                                </Button>)}
                              {metric.pendingDelete && (<Button size='sm' variant='outline' onClick={function () {
                        return handleRestoreMetric(metric.id);
                    }} className='h-8'>
                                  Restore
                                </Button>)}
                            </td>
                          </tr>); })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>)}
          </div>

          {/* Section C - Work Orders */}
          <div>
            <h4 className='text-lg font-semibold mb-4 text-[#16569e] cursor-pointer flex items-center justify-between' onClick={function () { return toggleSection('C'); }}>
              <span className='flex items-center'>
                C. Work Orders
                {sectionChangeCounts['C'] > 0 && (<span className='section-chip'>
                    {sectionChangeCounts['C']} changes
                  </span>)}
              </span>
              {expandedSections.has('C') ? (<ChevronDown className='h-5 w-5'/>) : (<ChevronRight className='h-5 w-5'/>)}
            </h4>

            {expandedSections.has('C') && (<div>
                <div className='flex justify-end mb-4 gap-2'>
                  <Button onClick={function () {
                console.log('Test button clicked!');
                alert('Test button works!');
            }} className='bg-gray-500 hover:bg-gray-600 text-white'>
                    Test Click
                  </Button>
                  <Button onClick={handleAddWorkOrder} className='bg-[#52baf3] hover:bg-[#4299d1] text-white'>
                    <Plus className='h-4 w-4 mr-2'/>
                    Add Work Order
                  </Button>
                </div>

                <div className='border rounded-lg overflow-hidden'>
                  <table className='w-full'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Job Title
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Assigned To
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Frequency Type
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Frequency Value
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Initial Next Due
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Notes
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {componentData.workOrders.map(function (wo) { return (<tr key={wo.id} className={"\n                            ".concat(wo.pendingDelete ? 'strike-removed cr-changed-row' : '', "\n                            ").concat(wo.isNew ? 'cr-new-item' : '', "\n                            ").concat(wo.isEditing && !wo.isNew ? 'cr-modified-item' : '', "\n                          ")}>
                          {wo.isEditing && !wo.pendingDelete ? (<>
                              <td className='px-4 py-2'>
                                <Input value={wo.jobTitle} onChange={function (e) {
                        return handleWorkOrderFieldChange(wo.id, 'jobTitle', e.target.value);
                    }} className={"h-8 ".concat(workOrderErrors[wo.id] && !wo.jobTitle ? 'border-red-500' : '')} placeholder='Job Title'/>
                              </td>
                              <td className='px-4 py-2'>
                                <Input value={wo.assignedTo} onChange={function (e) {
                        return handleWorkOrderFieldChange(wo.id, 'assignedTo', e.target.value);
                    }} className='h-8' placeholder='Assigned To'/>
                              </td>
                              <td className='px-4 py-2'>
                                <Select value={wo.frequencyType} onValueChange={function (value) {
                        return handleWorkOrderFieldChange(wo.id, 'frequencyType', value);
                    }}>
                                  <SelectTrigger className='h-8'>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='Calendar'>
                                      Calendar
                                    </SelectItem>
                                    <SelectItem value='Running Hours'>
                                      Running Hours
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className='px-4 py-2'>
                                <Input type='number' value={wo.frequencyValue} onChange={function (e) {
                        return handleWorkOrderFieldChange(wo.id, 'frequencyValue', parseInt(e.target.value));
                    }} className={"h-8 ".concat(workOrderErrors[wo.id] && wo.frequencyValue <= 0 ? 'border-red-500' : '')} placeholder='Value'/>
                              </td>
                              <td className='px-4 py-2'>
                                <Input type='date' value={wo.initialNextDue} onChange={function (e) {
                        return handleWorkOrderFieldChange(wo.id, 'initialNextDue', e.target.value);
                    }} className='h-8'/>
                              </td>
                              <td className='px-4 py-2'>
                                <Input value={wo.notes || ''} onChange={function (e) {
                        return handleWorkOrderFieldChange(wo.id, 'notes', e.target.value);
                    }} className='h-8' placeholder='Notes'/>
                              </td>
                              <td className='px-4 py-2'>
                                <div className='flex gap-2'>
                                  <Button size='sm' onClick={function () {
                        return handleSaveWorkOrderEdit(wo.id);
                    }} className='bg-green-600 hover:bg-green-700 text-white h-8'>
                                    <Save className='h-4 w-4'/>
                                  </Button>
                                  <Button size='sm' variant='outline' onClick={function () {
                        return handleCancelWorkOrderEdit(wo.id);
                    }} className='h-8'>
                                    <X className='h-4 w-4'/>
                                  </Button>
                                </div>
                              </td>
                            </>) : (<>
                              <td className='px-4 py-2 text-sm'>
                                {wo.jobTitle}
                              </td>
                              <td className='px-4 py-2 text-sm'>
                                {wo.assignedTo}
                              </td>
                              <td className='px-4 py-2 text-sm'>
                                {wo.frequencyType}
                              </td>
                              <td className='px-4 py-2 text-sm'>
                                {wo.frequencyValue}
                              </td>
                              <td className='px-4 py-2 text-sm'>
                                {wo.initialNextDue}
                              </td>
                              <td className='px-4 py-2 text-sm'>{wo.notes}</td>
                              <td className='px-4 py-2'>
                                {!wo.pendingDelete && (<div className='flex gap-2'>
                                    <Button size='sm' variant='outline' onClick={function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Edit button actually clicked for:', wo.id);
                            handleEditWorkOrder(wo.id);
                        }} className='h-8' type='button'>
                                      <Edit2 className='h-4 w-4'/>
                                    </Button>
                                    <Button size='sm' variant='outline' onClick={function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Delete button actually clicked for:', wo.id);
                            handleDeleteWorkOrder(wo.id);
                        }} className='h-8 text-red-600 hover:text-red-700' type='button'>
                                      <Trash2 className='h-4 w-4'/>
                                    </Button>
                                  </div>)}
                              </td>
                            </>)}
                        </tr>); })}
                    </tbody>
                  </table>
                  {workOrderErrors[Object.keys(workOrderErrors)[0]] && (<div className='field-error px-4 py-2'>
                      {workOrderErrors[Object.keys(workOrderErrors)[0]]}
                    </div>)}
                </div>
              </div>)}
          </div>

          {/* Section E - Spares */}
          <div>
            <h4 className='text-lg font-semibold mb-4 text-[#16569e] cursor-pointer flex items-center justify-between' onClick={function () { return toggleSection('E'); }}>
              <span className='flex items-center'>
                E. Spares
                {sectionChangeCounts['E'] > 0 && (<span className='section-chip'>
                    {sectionChangeCounts['E']} changes
                  </span>)}
              </span>
              {expandedSections.has('E') ? (<ChevronDown className='h-5 w-5'/>) : (<ChevronRight className='h-5 w-5'/>)}
            </h4>

            {expandedSections.has('E') && (<div>
                <div className='flex justify-end mb-4'>
                  <Button onClick={function () { return setShowSpareLinkPicker(true); }} className='bg-[#52baf3] hover:bg-[#4299d1] text-white'>
                    <Link className='h-4 w-4 mr-2'/>
                    Link Spares
                  </Button>
                </div>

                <div className='border rounded-lg overflow-hidden'>
                  <table className='w-full'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Part Code
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Part Name
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Min
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Critical
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Location
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {componentData.spares.map(function (spare) { return (<tr key={spare.id} className={"\n                            ".concat(spare.pendingUnlink ? 'strike-removed cr-changed-row' : '', "\n                            ").concat(spare.isLinkedNew ? 'cr-new-item' : '', "\n                            ").concat(spare.isEditing && !spare.isLinkedNew ? 'cr-modified-item' : '', "\n                          ")}>
                          <td className='px-4 py-2 text-sm'>
                            {spare.partCode}
                          </td>
                          <td className='px-4 py-2 text-sm'>
                            {spare.partName}
                          </td>
                          <td className='px-4 py-2'>
                            <Input type='number' value={spare.min} onChange={function (e) {
                    return handleEditSpare(spare.id, 'min', parseInt(e.target.value));
                }} className={"h-8 w-20 ".concat(spare.isEditing ? 'cr-changed' : '')} disabled={spare.pendingUnlink || false}/>
                          </td>
                          <td className='px-4 py-2'>
                            <Select value={spare.critical} onValueChange={function (value) {
                    return handleEditSpare(spare.id, 'critical', value);
                }} disabled={spare.pendingUnlink || false}>
                              <SelectTrigger className={"h-8 w-24 ".concat(spare.isEditing ? 'cr-changed' : '')}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='Yes'>Yes</SelectItem>
                                <SelectItem value='No'>No</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className='px-4 py-2'>
                            <Input value={spare.location} onChange={function (e) {
                    return handleEditSpare(spare.id, 'location', e.target.value);
                }} className={"h-8 ".concat(spare.isEditing ? 'cr-changed' : '')} disabled={spare.pendingUnlink || false}/>
                          </td>
                          <td className='px-4 py-2'>
                            {!spare.pendingUnlink && (<Button size='sm' variant='outline' onClick={function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Unlink spare clicked:', spare.id);
                        handleUnlinkSpare(spare.id);
                    }} className='h-8 text-red-600 hover:text-red-700' type='button'>
                                <Trash2 className='h-4 w-4'/>
                              </Button>)}
                          </td>
                        </tr>); })}
                    </tbody>
                  </table>
                </div>
              </div>)}
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end gap-4 pt-4 border-t'>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitChangeRequest.isPending} className='bg-[#52baf3] hover:bg-[#4299d1] text-white'>
              {submitChangeRequest.isPending
            ? 'Submitting...'
            : 'Submit Change Request'}
            </Button>
          </div>
        </div>

        {/* Spare Link Picker Dialog */}
        {showSpareLinkPicker && (<Dialog open={showSpareLinkPicker} onOpenChange={setShowSpareLinkPicker}>
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle>Link Spares to Component</DialogTitle>
              </DialogHeader>

              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Search className='h-5 w-5 text-gray-400'/>
                  <Input placeholder='Search by part code or name...' value={spareSearchQuery} onChange={function (e) { return setSpareSearchQuery(e.target.value); }}/>
                </div>

                <div className='spare-link-picker'>
                  {filteredAvailableSpares.map(function (spare) { return (<div key={spare.partCode} className={"spare-link-item ".concat(selectedNewSpares.has(spare.partCode) ? 'selected' : '')} onClick={function () {
                    setSelectedNewSpares(function (prev) {
                        var newSet = new Set(prev);
                        if (newSet.has(spare.partCode)) {
                            newSet.delete(spare.partCode);
                        }
                        else {
                            newSet.add(spare.partCode);
                        }
                        return newSet;
                    });
                }}>
                      <div className='flex justify-between items-center'>
                        <div>
                          <div className='font-medium'>{spare.partCode}</div>
                          <div className='text-sm text-gray-600'>
                            {spare.partName}
                          </div>
                        </div>
                        <div className='text-right text-sm'>
                          <div>Min: {spare.min}</div>
                          <div>Critical: {spare.critical}</div>
                          <div>{spare.location}</div>
                        </div>
                      </div>
                    </div>); })}
                </div>

                <div className='flex justify-end gap-4 pt-4 border-t'>
                  <Button variant='outline' onClick={function () {
                setShowSpareLinkPicker(false);
                setSelectedNewSpares(new Set());
                setSpareSearchQuery('');
            }}>
                    Cancel
                  </Button>
                  <Button onClick={handleLinkNewSpares} disabled={selectedNewSpares.size === 0} className='bg-[#52baf3] hover:bg-[#4299d1] text-white'>
                    Link {selectedNewSpares.size} Spare
                    {selectedNewSpares.size !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>)}
      </DialogContent>
    </Dialog>);
}
//# sourceMappingURL=ComponentRegisterFormCR.jsx.map