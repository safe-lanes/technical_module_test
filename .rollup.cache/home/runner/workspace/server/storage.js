import { __assign, __awaiter, __generator } from "tslib";
var MemStorage = /** @class */ (function () {
    function MemStorage() {
        this.users = new Map();
        this.currentUserId = 1;
        this.components = new Map();
        this.runningHoursAudits = [];
        this.currentAuditId = 1;
        this.spares = new Map();
        this.currentSpareId = 1;
        this.sparesHistory = [];
        this.currentHistoryId = 1;
        this.changeRequests = new Map();
        this.currentChangeRequestId = 1;
        this.changeRequestAttachments = [];
        this.currentAttachmentId = 1;
        this.changeRequestComments = [];
        this.currentCommentId = 1;
        this.alertPolicies = new Map();
        this.currentAlertPolicyId = 1;
        this.alertEvents = new Map();
        this.currentAlertEventId = 1;
        this.alertDeliveries = new Map();
        this.currentAlertDeliveryId = 1;
        this.alertConfigs = new Map();
        this.currentAlertConfigId = 1;
        this.formDefinitions = new Map();
        this.currentFormDefinitionId = 1;
        this.formVersions = new Map();
        this.currentFormVersionId = 1;
        this.formVersionUsages = [];
        this.currentFormUsageId = 1;
        this.workOrders = new Map();
        this.currentWorkOrderId = 1;
        // Initialize sample components and spares
        this.initializeComponents();
        this.initializeSpares();
        this.initializeAlertPolicies();
        this.initializeFormDefinitions();
    }
    MemStorage.prototype.initializeFormDefinitions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var forms, _i, forms_1, form, formDef, schemaJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        forms = [
                            { name: 'ADD_COMPONENT', subgroup: 'Component Register' },
                            { name: 'WO_PLANNED', subgroup: 'New Work Order (Planned)' },
                            { name: 'WO_UNPLANNED', subgroup: 'Unplanned Work Order' },
                        ];
                        _i = 0, forms_1 = forms;
                        _a.label = 1;
                    case 1:
                        if (!(_i < forms_1.length)) return [3 /*break*/, 5];
                        form = forms_1[_i];
                        return [4 /*yield*/, this.createFormDefinition(form)];
                    case 2:
                        formDef = _a.sent();
                        schemaJson = this.getInitialFormSchema(form.name);
                        return [4 /*yield*/, this.createFormVersion({
                                formId: formDef.id,
                                versionNo: 1,
                                versionDate: new Date(),
                                status: 'PUBLISHED',
                                authorUserId: 'system',
                                changelog: 'Initial version from live form',
                                schemaJson: JSON.stringify(schemaJson),
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MemStorage.prototype.getInitialFormSchema = function (formName) {
        // Return exact schema from current live forms
        if (formName === 'ADD_COMPONENT') {
            return {
                title: 'Add Component Form',
                sections: [
                    {
                        key: 'A',
                        title: 'A. Component Information',
                        layout: 'grid-4',
                        fields: [
                            { key: 'origin', label: 'Origin', type: 'text', required: false },
                            {
                                key: 'supplier',
                                label: 'Supplier',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'partNo',
                                label: 'Part No',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'createdOn',
                                label: 'Created On',
                                type: 'date',
                                required: false,
                            },
                            {
                                key: 'component',
                                label: 'Component',
                                type: 'text',
                                required: true,
                            },
                            {
                                key: 'maker',
                                label: 'Maker / Maker Designator',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'serialNo',
                                label: 'Serial No',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'installedDate',
                                label: 'Installed Date',
                                type: 'date',
                                required: false,
                            },
                            {
                                key: 'componentCode',
                                label: 'Component Code',
                                type: 'text',
                                required: false,
                            },
                            { key: 'type', label: 'Type', type: 'text', required: false },
                            {
                                key: 'blackoutComponent',
                                label: 'Blackout Component',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'modelSpecification',
                                label: 'Model Specification',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'warrantyInfo',
                                label: 'Warranty Info',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'warrantyDays',
                                label: 'Warranty Days',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'warrantyDate',
                                label: 'Warranty Date',
                                type: 'date',
                                required: false,
                            },
                            {
                                key: 'lastUsed',
                                label: 'Last Used',
                                type: 'text',
                                required: false,
                            },
                        ],
                    },
                    {
                        key: 'B',
                        title: 'B. Running Hours & Condition Monitoring Metrics',
                        layout: 'grid-3',
                        fields: [
                            {
                                key: 'runningHours',
                                label: 'Running Hours',
                                type: 'number',
                                required: false,
                            },
                            {
                                key: 'conditionMetrics',
                                label: 'Condition Monitoring Metrics',
                                type: 'repeater',
                                required: false,
                            },
                        ],
                    },
                    {
                        key: 'C',
                        title: 'C. Work Orders',
                        layout: 'grid-5',
                        fields: [
                            {
                                key: 'workBy',
                                label: 'Work By',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'jobTitle',
                                label: 'Job Title',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'assignedTo',
                                label: 'Assigned To',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'dueDate',
                                label: 'Due Date',
                                type: 'date',
                                required: false,
                            },
                            { key: 'status', label: 'Status', type: 'text', required: false },
                        ],
                    },
                    {
                        key: 'D',
                        title: 'D. Maintenance History',
                        layout: 'grid-4',
                        fields: [
                            {
                                key: 'workOrderNo',
                                label: 'Work Order No',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'performedBy',
                                label: 'Performed By',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'nextDueDate',
                                label: 'Next Due Date',
                                type: 'date',
                                required: false,
                            },
                            {
                                key: 'completionDate',
                                label: 'Completion Date',
                                type: 'date',
                                required: false,
                            },
                        ],
                    },
                    {
                        key: 'E',
                        title: 'E. Spares',
                        layout: 'grid-5',
                        fields: [
                            {
                                key: 'sparePart',
                                label: 'Spare Part',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'partName',
                                label: 'Part Name',
                                type: 'text',
                                required: false,
                            },
                            { key: 'qty', label: 'Qty', type: 'number', required: false },
                            {
                                key: 'critical',
                                label: 'Critical',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'location',
                                label: 'Location',
                                type: 'text',
                                required: false,
                            },
                        ],
                    },
                    {
                        key: 'F',
                        title: 'F. Drawings & Manuals',
                        layout: 'file-upload',
                        fields: [],
                    },
                    {
                        key: 'G',
                        title: 'G. Classification & Regulatory Data',
                        layout: 'grid-4',
                        fields: [
                            {
                                key: 'classificationSociety',
                                label: 'Classification Society',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'certificateNo',
                                label: 'Certificate No',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'lastClassDate',
                                label: 'Last Class Date',
                                type: 'date',
                                required: false,
                            },
                            {
                                key: 'nextClassDate',
                                label: 'Next Class Date',
                                type: 'date',
                                required: false,
                            },
                            {
                                key: 'classCode',
                                label: 'Class Code',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'classRemarks',
                                label: 'Class Remarks',
                                type: 'text',
                                required: false,
                            },
                        ],
                    },
                    {
                        key: 'H',
                        title: 'H. New Service Notes',
                        layout: 'grid-4',
                        fields: [
                            {
                                key: 'serviceNote',
                                label: 'Service Note',
                                type: 'text',
                                required: false,
                            },
                            {
                                key: 'noteDate',
                                label: 'Note Date',
                                type: 'date',
                                required: false,
                            },
                            {
                                key: 'nextNote',
                                label: 'Next Note',
                                type: 'date',
                                required: false,
                            },
                            {
                                key: 'noteLevel',
                                label: 'Note Level',
                                type: 'text',
                                required: false,
                            },
                        ],
                    },
                ],
            };
        }
        else if (formName === 'WO_PLANNED') {
            return {
                title: 'Work Order Form (Planned)',
                sections: [
                    {
                        key: 'partA',
                        title: 'Part A - Work Order Details',
                        layout: 'grid-3',
                        fields: [
                            {
                                key: 'woNumber',
                                label: 'WO Number',
                                type: 'text',
                                required: true,
                            },
                            {
                                key: 'component',
                                label: 'Component',
                                type: 'select',
                                required: true,
                            },
                            {
                                key: 'jobTitle',
                                label: 'Job Title',
                                type: 'text',
                                required: true,
                            },
                            {
                                key: 'workBy',
                                label: 'Work By',
                                type: 'select',
                                required: true,
                            },
                            {
                                key: 'assignedTo',
                                label: 'Assigned To',
                                type: 'select',
                                required: false,
                            },
                            {
                                key: 'priority',
                                label: 'Priority',
                                type: 'select',
                                required: true,
                            },
                            {
                                key: 'plannedDate',
                                label: 'Planned Date',
                                type: 'date',
                                required: true,
                            },
                            {
                                key: 'estimatedHours',
                                label: 'Estimated Hours',
                                type: 'number',
                                required: false,
                            },
                        ],
                    },
                    {
                        key: 'partB',
                        title: 'Part B - Job Description & Instructions',
                        layout: 'grid-1',
                        fields: [
                            {
                                key: 'description',
                                label: 'Description',
                                type: 'textarea',
                                required: true,
                            },
                            {
                                key: 'instructions',
                                label: 'Instructions',
                                type: 'textarea',
                                required: false,
                            },
                            {
                                key: 'safetyPrecautions',
                                label: 'Safety Precautions',
                                type: 'textarea',
                                required: false,
                            },
                            {
                                key: 'requiredSpares',
                                label: 'Required Spares',
                                type: 'repeater',
                                required: false,
                            },
                        ],
                    },
                ],
            };
        }
        else if (formName === 'WO_UNPLANNED') {
            return {
                title: 'Work Order Form (Unplanned)',
                sections: [
                    {
                        key: 'partA',
                        title: 'Part A - Breakdown Details',
                        layout: 'grid-3',
                        fields: [
                            {
                                key: 'woNumber',
                                label: 'WO Number',
                                type: 'text',
                                required: true,
                            },
                            {
                                key: 'component',
                                label: 'Component',
                                type: 'select',
                                required: true,
                            },
                            {
                                key: 'breakdownDate',
                                label: 'Breakdown Date',
                                type: 'datetime',
                                required: true,
                            },
                            {
                                key: 'reportedBy',
                                label: 'Reported By',
                                type: 'text',
                                required: true,
                            },
                            {
                                key: 'severity',
                                label: 'Severity',
                                type: 'select',
                                required: true,
                            },
                            {
                                key: 'impactOnOperation',
                                label: 'Impact on Operation',
                                type: 'select',
                                required: true,
                            },
                        ],
                    },
                    {
                        key: 'partB',
                        title: 'Part B - Corrective Action',
                        layout: 'grid-1',
                        fields: [
                            {
                                key: 'failureDescription',
                                label: 'Failure Description',
                                type: 'textarea',
                                required: true,
                            },
                            {
                                key: 'rootCause',
                                label: 'Root Cause',
                                type: 'textarea',
                                required: false,
                            },
                            {
                                key: 'correctiveAction',
                                label: 'Corrective Action',
                                type: 'textarea',
                                required: true,
                            },
                            {
                                key: 'preventiveAction',
                                label: 'Preventive Action',
                                type: 'textarea',
                                required: false,
                            },
                            {
                                key: 'actualSpares',
                                label: 'Actual Spares Used',
                                type: 'repeater',
                                required: false,
                            },
                        ],
                    },
                ],
            };
        }
        return {};
    };
    MemStorage.prototype.initializeComponents = function () {
        var _this = this;
        // Create hierarchical component structure for MV Test Vessel
        var sampleComponents = [
            // Top level - Ship groups
            {
                id: '1',
                name: 'Ship General',
                componentCode: '1',
                parentId: null,
                vesselId: 'MV Test Vessel',
                category: 'Ship General',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '2',
                name: 'Hull',
                componentCode: '2',
                parentId: null,
                vesselId: 'MV Test Vessel',
                category: 'Hull',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '3',
                name: 'Equipment for Cargo',
                componentCode: '3',
                parentId: null,
                vesselId: 'MV Test Vessel',
                category: 'Equipment for Cargo',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '4',
                name: "Ship's Equipment",
                componentCode: '4',
                parentId: null,
                vesselId: 'MV Test Vessel',
                category: "Ship's Equipment",
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '5',
                name: 'Equipment for Crew & Passengers',
                componentCode: '5',
                parentId: null,
                vesselId: 'MV Test Vessel',
                category: 'Equipment for Crew & Passengers',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '6',
                name: 'Machinery Main Components',
                componentCode: '6',
                parentId: null,
                vesselId: 'MV Test Vessel',
                category: 'Machinery Main Components',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '7',
                name: 'Systems for Machinery Main Components',
                componentCode: '7',
                parentId: null,
                vesselId: 'MV Test Vessel',
                category: 'Systems for Machinery Main Components',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '8',
                name: 'Ship Common Systems',
                componentCode: '8',
                parentId: null,
                vesselId: 'MV Test Vessel',
                category: 'Ship Common Systems',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            // Level 2 - Under Ship General
            {
                id: '1.1',
                name: 'Fresh Water System',
                componentCode: '1.1',
                parentId: '1',
                vesselId: 'MV Test Vessel',
                category: 'Ship General',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '1.2',
                name: 'Sewage Treatment System',
                componentCode: '1.2',
                parentId: '1',
                vesselId: 'MV Test Vessel',
                category: 'Ship General',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '1.3',
                name: 'HVAC – Accommodation',
                componentCode: '1.3',
                parentId: '1',
                vesselId: 'MV Test Vessel',
                category: 'Ship General',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            // Level 3 - Under Fresh Water System
            {
                id: '1.1.1',
                name: 'Hydrophore Unit',
                componentCode: '1.1.1',
                parentId: '1.1',
                vesselId: 'MV Test Vessel',
                category: 'Ship General',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '1.1.2',
                name: 'Potable Water Maker',
                componentCode: '1.1.2',
                parentId: '1.1',
                vesselId: 'MV Test Vessel',
                category: 'Ship General',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '1.1.3',
                name: 'UV Sterilizer',
                componentCode: '1.1.3',
                parentId: '1.1',
                vesselId: 'MV Test Vessel',
                category: 'Ship General',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            // Level 4 - Under Hydrophore Unit
            {
                id: '1.1.1.1',
                name: 'Pressure Vessel',
                componentCode: '1.1.1.1',
                parentId: '1.1.1',
                vesselId: 'MV Test Vessel',
                category: 'Ship General',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: 'ACME Marine',
                model: 'PV-2000',
                serialNo: 'PV2024001',
                deptCategory: 'Engineering',
                componentCategory: 'Ship General',
                location: 'Engine Room',
                commissionedDate: '01-Jan-2020',
                critical: true,
                classItem: false,
            },
            {
                id: '1.1.1.2',
                name: 'Feed Pump',
                componentCode: '1.1.1.2',
                parentId: '1.1.1',
                vesselId: 'MV Test Vessel',
                category: 'Ship General',
                currentCumulativeRH: '12450',
                lastUpdated: '02-Jun-2025',
                maker: 'Grundfos',
                model: 'CR32-4',
                serialNo: 'GF2024002',
                deptCategory: 'Engineering',
                componentCategory: 'Ship General',
                location: 'Engine Room',
                commissionedDate: '01-Jan-2020',
                critical: true,
                classItem: true,
            },
            {
                id: '1.1.1.3',
                name: 'Pressure Switch',
                componentCode: '1.1.1.3',
                parentId: '1.1.1',
                vesselId: 'MV Test Vessel',
                category: 'Ship General',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: 'Danfoss',
                model: 'KP35',
                serialNo: 'DF2024003',
                deptCategory: 'Engineering',
                componentCategory: 'Ship General',
                location: 'Engine Room',
                commissionedDate: '01-Jan-2020',
                critical: false,
                classItem: false,
            },
            // Level 2 - Under Machinery Main Components
            {
                id: '6.1',
                name: 'Diesel Engines',
                componentCode: '6.1',
                parentId: '6',
                vesselId: 'MV Test Vessel',
                category: 'Machinery Main Components',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '6.2',
                name: 'Turbines',
                componentCode: '6.2',
                parentId: '6',
                vesselId: 'MV Test Vessel',
                category: 'Machinery Main Components',
                currentCumulativeRH: '0',
                lastUpdated: '02-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            // Level 3 - Under Diesel Engines
            {
                id: '6.1.1',
                name: 'Main Engine',
                componentCode: '6.1.1',
                parentId: '6.1',
                vesselId: 'MV Test Vessel',
                category: 'Machinery Main Components',
                currentCumulativeRH: '12580',
                lastUpdated: '30-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '6.1.2',
                name: 'Auxiliary Engine #1',
                componentCode: '6.1.2',
                parentId: '6.1',
                vesselId: 'MV Test Vessel',
                category: 'Machinery Main Components',
                currentCumulativeRH: '15670',
                lastUpdated: '09-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            {
                id: '6.1.3',
                name: 'Auxiliary Engine #2',
                componentCode: '6.1.3',
                parentId: '6.1',
                vesselId: 'MV Test Vessel',
                category: 'Machinery Main Components',
                currentCumulativeRH: '14980',
                lastUpdated: '16-Jun-2025',
                maker: null,
                model: null,
                serialNo: null,
                deptCategory: null,
                componentCategory: null,
                location: null,
                commissionedDate: null,
                critical: false,
                classItem: false,
            },
            // Level 4 - Under Main Engine
            {
                id: '6.1.1.1',
                name: 'Crankshaft',
                componentCode: '6.1.1.1',
                parentId: '6.1.1',
                vesselId: 'MV Test Vessel',
                category: 'Machinery Main Components',
                currentCumulativeRH: '12580',
                lastUpdated: '30-Jun-2025',
                maker: 'MAN B&W',
                model: '6S60MC-C',
                serialNo: 'MB2020001',
                deptCategory: 'Engineering',
                componentCategory: 'Machinery Main Components',
                location: 'Engine Room',
                commissionedDate: '01-Jan-2020',
                critical: true,
                classItem: true,
            },
            {
                id: '6.1.1.2',
                name: 'Cylinder Liners',
                componentCode: '6.1.1.2',
                parentId: '6.1.1',
                vesselId: 'MV Test Vessel',
                category: 'Machinery Main Components',
                currentCumulativeRH: '12580',
                lastUpdated: '30-Jun-2025',
                maker: 'MAN B&W',
                model: 'CL-600',
                serialNo: 'MB2020002',
                deptCategory: 'Engineering',
                componentCategory: 'Machinery Main Components',
                location: 'Engine Room',
                commissionedDate: '01-Jan-2020',
                critical: true,
                classItem: true,
            },
            {
                id: '6.1.1.3',
                name: 'Piston & Piston Rod',
                componentCode: '6.1.1.3',
                parentId: '6.1.1',
                vesselId: 'MV Test Vessel',
                category: 'Machinery Main Components',
                currentCumulativeRH: '12580',
                lastUpdated: '30-Jun-2025',
                maker: 'MAN B&W',
                model: 'PR-600',
                serialNo: 'MB2020003',
                deptCategory: 'Engineering',
                componentCategory: 'Machinery Main Components',
                location: 'Engine Room',
                commissionedDate: '01-Jan-2020',
                critical: true,
                classItem: true,
            },
            {
                id: '6.1.1.4',
                name: 'Connecting Rod',
                componentCode: '6.1.1.4',
                parentId: '6.1.1',
                vesselId: 'MV Test Vessel',
                category: 'Machinery Main Components',
                currentCumulativeRH: '12580',
                lastUpdated: '30-Jun-2025',
                maker: 'MAN B&W',
                model: 'CR-600',
                serialNo: 'MB2020004',
                deptCategory: 'Engineering',
                componentCategory: 'Machinery Main Components',
                location: 'Engine Room',
                commissionedDate: '01-Jan-2020',
                critical: true,
                classItem: false,
            },
            {
                id: '6.1.1.5',
                name: 'Camshaft',
                componentCode: '6.1.1.5',
                parentId: '6.1.1',
                vesselId: 'MV Test Vessel',
                category: 'Machinery Main Components',
                currentCumulativeRH: '12580',
                lastUpdated: '30-Jun-2025',
                maker: 'MAN B&W',
                model: 'CS-600',
                serialNo: 'MB2020005',
                deptCategory: 'Engineering',
                componentCategory: 'Machinery Main Components',
                location: 'Engine Room',
                commissionedDate: '01-Jan-2020',
                critical: true,
                classItem: false,
            },
        ];
        sampleComponents.forEach(function (comp) { return _this.components.set(comp.id, comp); });
    };
    MemStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.users.get(id)];
            });
        });
    };
    MemStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.users.values()).find(function (user) { return user.username === username; })];
            });
        });
    };
    MemStorage.prototype.createUser = function (insertUser) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user;
            return __generator(this, function (_a) {
                id = this.currentUserId++;
                user = __assign(__assign({}, insertUser), { id: id });
                this.users.set(id, user);
                return [2 /*return*/, user];
            });
        });
    };
    // Running Hours methods
    MemStorage.prototype.getComponents = function (vesselId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.components.values()).filter(function (c) { return c.vesselId === vesselId; })];
            });
        });
    };
    MemStorage.prototype.getComponent = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.components.get(id)];
            });
        });
    };
    MemStorage.prototype.updateComponent = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var component, updated;
            return __generator(this, function (_a) {
                component = this.components.get(id);
                if (!component) {
                    throw new Error("Component ".concat(id, " not found"));
                }
                updated = __assign(__assign({}, component), data);
                this.components.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.createRunningHoursAudit = function (audit) {
        return __awaiter(this, void 0, void 0, function () {
            var id, fullAudit;
            var _a, _b;
            return __generator(this, function (_c) {
                id = this.currentAuditId++;
                fullAudit = __assign(__assign({}, audit), { id: id, previousRH: audit.previousRH.toString(), newRH: audit.newRH.toString(), cumulativeRH: audit.cumulativeRH.toString(), oldMeterFinal: ((_a = audit.oldMeterFinal) === null || _a === void 0 ? void 0 : _a.toString()) || null, newMeterStart: ((_b = audit.newMeterStart) === null || _b === void 0 ? void 0 : _b.toString()) || null, enteredAtUTC: audit.enteredAtUTC || new Date(), notes: audit.notes || null, version: audit.version || 1 });
                this.runningHoursAudits.push(fullAudit);
                return [2 /*return*/, fullAudit];
            });
        });
    };
    MemStorage.prototype.getRunningHoursAudits = function (componentId, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var audits;
            return __generator(this, function (_a) {
                audits = this.runningHoursAudits
                    .filter(function (a) { return a.componentId === componentId; })
                    .sort(function (a, b) { return b.enteredAtUTC.getTime() - a.enteredAtUTC.getTime(); });
                return [2 /*return*/, limit ? audits.slice(0, limit) : audits];
            });
        });
    };
    MemStorage.prototype.getRunningHoursAuditsInDateRange = function (componentId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.runningHoursAudits.filter(function (a) {
                        if (a.componentId !== componentId)
                            return false;
                        var auditDate = new Date(a.dateUpdatedLocal);
                        return auditDate >= startDate && auditDate <= endDate;
                    })];
            });
        });
    };
    // Generate Component Spare Code
    MemStorage.prototype.generateComponentSpareCode = function (vesselId, componentCode) {
        // Get all existing spares for this component in this vessel
        var existingSpares = Array.from(this.spares.values())
            .filter(function (s) {
            return s.vesselId === vesselId &&
                s.componentCode === componentCode &&
                s.componentSpareCode;
        })
            .map(function (s) { return s.componentSpareCode; });
        // Extract existing sequence numbers for this component
        var prefix = "SP-".concat(componentCode, "-");
        var existingNumbers = existingSpares
            .filter(function (code) { return code === null || code === void 0 ? void 0 : code.startsWith(prefix); })
            .map(function (code) {
            var parts = code.split('-');
            var nnn = parts[parts.length - 1];
            return parseInt(nnn, 10);
        })
            .filter(function (n) { return !isNaN(n); });
        // Find the next available number
        var nextNumber = existingNumbers.length > 0 ? Math.max.apply(Math, existingNumbers) + 1 : 1;
        // Format with zero padding
        var nnn = String(nextNumber).padStart(3, '0');
        return "".concat(prefix).concat(nnn);
    };
    MemStorage.prototype.initializeSpares = function () {
        var _this = this;
        var sampleSpares = [
            {
                id: 1,
                partCode: 'SP-ME-001',
                partName: 'Fuel Injector',
                componentId: '6.1',
                componentCode: '6.1',
                componentName: 'Main Engine',
                componentSpareCode: 'SP-6.1-001',
                critical: 'Critical',
                rob: 2,
                min: 1,
                location: 'Store Room A',
                vesselId: 'V001',
                deleted: false,
            },
            {
                id: 2,
                partCode: 'SP-ME-002',
                partName: 'Cylinder Head Gasket',
                componentId: '6.1.1',
                componentCode: '6.1.1',
                componentName: 'Cylinder Head',
                componentSpareCode: 'SP-6.1.1-001',
                critical: 'No',
                rob: 2,
                min: 1,
                location: 'Store Room B',
                vesselId: 'V001',
                deleted: false,
            },
            {
                id: 3,
                partCode: 'SP-ME-003',
                partName: 'Piston Ring Set',
                componentId: '6.1',
                componentCode: '6.1',
                componentName: 'Main Engine',
                componentSpareCode: 'SP-6.1-002',
                critical: 'No',
                rob: 3,
                min: 1,
                location: 'Store Room B',
                vesselId: 'V001',
                deleted: false,
            },
            {
                id: 4,
                partCode: 'SP-ME-004',
                partName: 'Main Bearing',
                componentId: '6.1.2',
                componentCode: '6.1.2',
                componentName: 'Main Bearings',
                componentSpareCode: 'SP-6.1.2-001',
                critical: 'Critical',
                rob: 4,
                min: 2,
                location: 'Store Room C',
                vesselId: 'V001',
                deleted: false,
            },
            {
                id: 5,
                partCode: 'SP-COOL-001',
                partName: 'Cooling Pump Seal',
                componentId: '7.3',
                componentCode: '7.3',
                componentName: 'Cooling Water System',
                componentSpareCode: 'SP-7.3-001',
                critical: 'Critical',
                rob: 4,
                min: 2,
                location: 'Store Room D',
                vesselId: 'V001',
                deleted: false,
            },
            {
                id: 6,
                partCode: 'SP-CC-001',
                partName: 'Cylinder Cover Assembly',
                componentId: '6.1.1.1',
                componentCode: '6.1.1.1',
                componentName: 'Valve Seats',
                componentSpareCode: 'SP-6.1.1.1-001',
                critical: 'Critical',
                rob: 2,
                min: 1,
                location: 'Store Room A',
                vesselId: 'V001',
                deleted: false,
            },
            {
                id: 7,
                partCode: 'SP-CC-002',
                partName: 'Inlet Valve',
                componentId: '6.1.1.1',
                componentCode: '6.1.1.1',
                componentName: 'Valve Seats',
                componentSpareCode: 'SP-6.1.1.1-002',
                critical: 'Critical',
                rob: 4,
                min: 2,
                location: 'Store Room A',
                vesselId: 'V001',
                deleted: false,
            },
            {
                id: 8,
                partCode: 'SP-CC-003',
                partName: 'Exhaust Valve',
                componentId: '6.1.1.1',
                componentCode: '6.1.1.1',
                componentName: 'Valve Seats',
                componentSpareCode: 'SP-6.1.1.1-003',
                critical: 'Critical',
                rob: 4,
                min: 2,
                location: 'Store Room A',
                vesselId: 'V001',
                deleted: false,
            },
            {
                id: 9,
                partCode: 'SP-CC-004',
                partName: 'Valve Spring',
                componentId: '6.1.1.2',
                componentCode: '6.1.1.2',
                componentName: 'Injector Sleeve',
                componentSpareCode: 'SP-6.1.1.2-001',
                critical: 'No',
                rob: 8,
                min: 4,
                location: 'Store Room B',
                vesselId: 'V001',
                deleted: false,
            },
            {
                id: 10,
                partCode: 'SP-CC-005',
                partName: 'Valve Guide',
                componentId: '6.1.1.3',
                componentCode: '6.1.1.3',
                componentName: 'Rocker Arm',
                componentSpareCode: 'SP-6.1.1.3-001',
                critical: 'No',
                rob: 1,
                min: 2,
                location: 'Store Room B',
                vesselId: 'V001',
                deleted: false,
            },
        ];
        sampleSpares.forEach(function (spare) { return _this.spares.set(spare.id, spare); });
        this.currentSpareId = 11;
    };
    // Spares methods
    MemStorage.prototype.getSpares = function (vesselId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.spares.values()).filter(function (s) { return s.vesselId === vesselId && !s.deleted; })];
            });
        });
    };
    MemStorage.prototype.getSpare = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var spare;
            return __generator(this, function (_a) {
                spare = this.spares.get(id);
                return [2 /*return*/, spare && !spare.deleted ? spare : undefined];
            });
        });
    };
    MemStorage.prototype.createSpare = function (spare) {
        return __awaiter(this, void 0, void 0, function () {
            var id, componentSpareCode, newSpare;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = this.currentSpareId++;
                        componentSpareCode = spare.componentSpareCode ||
                            (spare.componentCode
                                ? this.generateComponentSpareCode(spare.vesselId || 'V001', spare.componentCode)
                                : null);
                        newSpare = __assign(__assign({}, spare), { id: id, vesselId: spare.vesselId || 'V001', componentCode: spare.componentCode || null, location: spare.location || null, componentSpareCode: componentSpareCode, rob: spare.rob || 0, min: spare.min || 0, deleted: false });
                        this.spares.set(id, newSpare);
                        // Create history entry
                        return [4 /*yield*/, this.createSpareHistory({
                                timestampUTC: new Date(),
                                vesselId: spare.vesselId || 'V001',
                                spareId: id,
                                partCode: spare.partCode,
                                partName: spare.partName,
                                componentId: spare.componentId,
                                componentCode: spare.componentCode || null,
                                componentName: spare.componentName,
                                componentSpareCode: componentSpareCode,
                                eventType: 'LINK_CREATED',
                                qtyChange: spare.rob || 0,
                                robAfter: spare.rob || 0,
                                userId: 'system',
                                remarks: 'Initial creation',
                                reference: null,
                            })];
                    case 1:
                        // Create history entry
                        _a.sent();
                        return [2 /*return*/, newSpare];
                }
            });
        });
    };
    MemStorage.prototype.updateSpare = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var spare, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spare = this.spares.get(id);
                        if (!spare || spare.deleted) {
                            throw new Error("Spare ".concat(id, " not found"));
                        }
                        updated = __assign(__assign({}, spare), data);
                        this.spares.set(id, updated);
                        if (!(data.rob !== undefined && data.rob !== spare.rob)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createSpareHistory({
                                timestampUTC: new Date(),
                                vesselId: spare.vesselId,
                                spareId: id,
                                partCode: spare.partCode,
                                partName: spare.partName,
                                componentId: spare.componentId,
                                componentCode: spare.componentCode || null,
                                componentName: spare.componentName,
                                componentSpareCode: spare.componentSpareCode || null,
                                eventType: 'EDIT',
                                qtyChange: data.rob - spare.rob,
                                robAfter: data.rob,
                                userId: 'system',
                                remarks: 'Updated via edit',
                                reference: null,
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, updated];
                }
            });
        });
    };
    MemStorage.prototype.deleteSpare = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var spare;
            return __generator(this, function (_a) {
                spare = this.spares.get(id);
                if (spare) {
                    spare.deleted = true;
                    this.spares.set(id, spare);
                }
                return [2 /*return*/];
            });
        });
    };
    MemStorage.prototype.consumeSpare = function (id, quantity, userId, remarks, place, dateLocal, tz) {
        return __awaiter(this, void 0, void 0, function () {
            var spare;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSpare(id)];
                    case 1:
                        spare = _a.sent();
                        if (!spare) {
                            throw new Error("Spare ".concat(id, " not found"));
                        }
                        if (spare.rob < quantity) {
                            throw new Error('Insufficient stock');
                        }
                        spare.rob -= quantity;
                        this.spares.set(id, spare);
                        // Create history entry
                        return [4 /*yield*/, this.createSpareHistory({
                                timestampUTC: new Date(),
                                vesselId: spare.vesselId,
                                spareId: id,
                                partCode: spare.partCode,
                                partName: spare.partName,
                                componentId: spare.componentId,
                                componentCode: spare.componentCode || null,
                                componentName: spare.componentName,
                                componentSpareCode: spare.componentSpareCode || null,
                                eventType: 'CONSUME',
                                qtyChange: -quantity,
                                robAfter: spare.rob,
                                userId: userId,
                                remarks: remarks || null,
                                reference: place || null,
                                dateLocal: dateLocal || null,
                                tz: tz || null,
                            })];
                    case 2:
                        // Create history entry
                        _a.sent();
                        return [2 /*return*/, spare];
                }
            });
        });
    };
    MemStorage.prototype.receiveSpare = function (id, quantity, userId, remarks, supplierPO, place, dateLocal, tz) {
        return __awaiter(this, void 0, void 0, function () {
            var spare;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSpare(id)];
                    case 1:
                        spare = _a.sent();
                        if (!spare) {
                            throw new Error("Spare ".concat(id, " not found"));
                        }
                        spare.rob += quantity;
                        this.spares.set(id, spare);
                        // Create history entry
                        return [4 /*yield*/, this.createSpareHistory({
                                timestampUTC: new Date(),
                                vesselId: spare.vesselId,
                                spareId: id,
                                partCode: spare.partCode,
                                partName: spare.partName,
                                componentId: spare.componentId,
                                componentCode: spare.componentCode || null,
                                componentName: spare.componentName,
                                componentSpareCode: spare.componentSpareCode || null,
                                eventType: 'RECEIVE',
                                qtyChange: quantity,
                                robAfter: spare.rob,
                                userId: userId,
                                remarks: remarks || null,
                                reference: supplierPO || null,
                                place: place || null,
                                dateLocal: dateLocal || null,
                                tz: tz || null,
                            })];
                    case 2:
                        // Create history entry
                        _a.sent();
                        return [2 /*return*/, spare];
                }
            });
        });
    };
    MemStorage.prototype.bulkUpdateSpares = function (updates, userId, remarks) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedSpares, _i, updates_1, update, spare, netChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedSpares = [];
                        _i = 0, updates_1 = updates;
                        _a.label = 1;
                    case 1:
                        if (!(_i < updates_1.length)) return [3 /*break*/, 5];
                        update = updates_1[_i];
                        return [4 /*yield*/, this.getSpare(update.id)];
                    case 2:
                        spare = _a.sent();
                        if (!spare)
                            return [3 /*break*/, 4];
                        netChange = 0;
                        if (update.consumed) {
                            if (spare.rob < update.consumed) {
                                throw new Error("Insufficient stock for ".concat(spare.partCode));
                            }
                            netChange -= update.consumed;
                        }
                        if (update.received) {
                            netChange += update.received;
                        }
                        if (!(netChange !== 0)) return [3 /*break*/, 4];
                        spare.rob += netChange;
                        this.spares.set(update.id, spare);
                        // Create history entry
                        return [4 /*yield*/, this.createSpareHistory({
                                timestampUTC: new Date(),
                                vesselId: spare.vesselId,
                                spareId: update.id,
                                partCode: spare.partCode,
                                partName: spare.partName,
                                componentId: spare.componentId,
                                componentCode: spare.componentCode || null,
                                componentName: spare.componentName,
                                componentSpareCode: spare.componentSpareCode || null,
                                eventType: 'ADJUST',
                                qtyChange: netChange,
                                robAfter: spare.rob,
                                userId: userId,
                                remarks: remarks || 'Bulk update',
                                reference: null,
                                dateLocal: update.receivedDate || null,
                                place: update.receivedPlace || null,
                                tz: update.receivedDate
                                    ? Intl.DateTimeFormat().resolvedOptions().timeZone
                                    : null,
                            })];
                    case 3:
                        // Create history entry
                        _a.sent();
                        updatedSpares.push(spare);
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, updatedSpares];
                }
            });
        });
    };
    // Spares History methods
    MemStorage.prototype.getSpareHistory = function (vesselId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sparesHistory
                        .filter(function (h) { return h.vesselId === vesselId; })
                        .sort(function (a, b) { return b.timestampUTC.getTime() - a.timestampUTC.getTime(); })];
            });
        });
    };
    MemStorage.prototype.getSpareHistoryBySpareId = function (spareId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sparesHistory
                        .filter(function (h) { return h.spareId === spareId; })
                        .sort(function (a, b) { return b.timestampUTC.getTime() - a.timestampUTC.getTime(); })];
            });
        });
    };
    MemStorage.prototype.createSpareHistory = function (history) {
        return __awaiter(this, void 0, void 0, function () {
            var id, fullHistory;
            return __generator(this, function (_a) {
                id = this.currentHistoryId++;
                fullHistory = __assign(__assign({}, history), { id: id });
                this.sparesHistory.push(fullHistory);
                return [2 /*return*/, fullHistory];
            });
        });
    };
    // Change Request methods
    MemStorage.prototype.getChangeRequests = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var requests, search_1;
            return __generator(this, function (_a) {
                requests = Array.from(this.changeRequests.values());
                if (filters) {
                    if (filters.category) {
                        requests = requests.filter(function (r) { return r.category === filters.category; });
                    }
                    if (filters.status) {
                        requests = requests.filter(function (r) { return r.status === filters.status; });
                    }
                    if (filters.vesselId) {
                        requests = requests.filter(function (r) { return r.vesselId === filters.vesselId; });
                    }
                    if (filters.q) {
                        search_1 = filters.q.toLowerCase();
                        requests = requests.filter(function (r) {
                            return r.title.toLowerCase().includes(search_1) ||
                                r.status.toLowerCase().includes(search_1);
                        });
                    }
                }
                return [2 /*return*/, requests.sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); })];
            });
        });
    };
    MemStorage.prototype.getChangeRequest = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.changeRequests.get(id)];
            });
        });
    };
    MemStorage.prototype.createChangeRequest = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var id, now, fullRequest;
            return __generator(this, function (_a) {
                id = this.currentChangeRequestId++;
                now = new Date();
                fullRequest = __assign(__assign({}, request), { id: id, status: request.status || 'draft', targetType: request.targetType || null, targetId: request.targetId || null, snapshotBeforeJson: request.snapshotBeforeJson || null, proposedChangesJson: request.proposedChangesJson || null, movePreviewJson: request.movePreviewJson || null, submittedAt: request.submittedAt || null, reviewedByUserId: request.reviewedByUserId || null, reviewedAt: request.reviewedAt || null, createdAt: now, updatedAt: now });
                this.changeRequests.set(id, fullRequest);
                return [2 /*return*/, fullRequest];
            });
        });
    };
    MemStorage.prototype.updateChangeRequest = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var request, updated;
            return __generator(this, function (_a) {
                request = this.changeRequests.get(id);
                if (!request)
                    throw new Error('Change request not found');
                updated = __assign(__assign(__assign({}, request), data), { updatedAt: new Date() });
                this.changeRequests.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.updateChangeRequestTarget = function (id, targetType, targetId, snapshotBeforeJson) {
        return __awaiter(this, void 0, void 0, function () {
            var request, updated;
            return __generator(this, function (_a) {
                request = this.changeRequests.get(id);
                if (!request)
                    throw new Error('Change request not found');
                if (request.status !== 'draft' && request.status !== 'returned') {
                    throw new Error('Can only update target for draft or returned requests');
                }
                updated = __assign(__assign({}, request), { targetType: targetType, targetId: targetId, snapshotBeforeJson: snapshotBeforeJson, updatedAt: new Date() });
                this.changeRequests.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.updateChangeRequestProposed = function (id, proposedChangesJson, movePreviewJson) {
        return __awaiter(this, void 0, void 0, function () {
            var request, updated;
            return __generator(this, function (_a) {
                request = this.changeRequests.get(id);
                if (!request)
                    throw new Error('Change request not found');
                if (request.status !== 'draft' && request.status !== 'returned') {
                    throw new Error('Can only update proposed changes for draft or returned requests');
                }
                updated = __assign(__assign({}, request), { proposedChangesJson: proposedChangesJson, movePreviewJson: movePreviewJson || null, updatedAt: new Date() });
                this.changeRequests.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.deleteChangeRequest = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                request = this.changeRequests.get(id);
                if (!request)
                    throw new Error('Change request not found');
                if (request.status !== 'draft') {
                    throw new Error('Only draft requests can be deleted');
                }
                this.changeRequests.delete(id);
                return [2 /*return*/];
            });
        });
    };
    MemStorage.prototype.submitChangeRequest = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var request, now, updated;
            return __generator(this, function (_a) {
                request = this.changeRequests.get(id);
                if (!request)
                    throw new Error('Change request not found');
                now = new Date();
                updated = __assign(__assign({}, request), { status: 'submitted', submittedAt: now, requestedByUserId: userId, updatedAt: now });
                this.changeRequests.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.approveChangeRequest = function (id, reviewerId, comment) {
        return __awaiter(this, void 0, void 0, function () {
            var request, now, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = this.changeRequests.get(id);
                        if (!request)
                            throw new Error('Change request not found');
                        if (request.status !== 'submitted') {
                            throw new Error('Only submitted requests can be approved');
                        }
                        // Add comment
                        return [4 /*yield*/, this.createChangeRequestComment({
                                changeRequestId: id,
                                userId: reviewerId,
                                message: "APPROVED: ".concat(comment),
                            })];
                    case 1:
                        // Add comment
                        _a.sent();
                        now = new Date();
                        updated = __assign(__assign({}, request), { status: 'approved', reviewedByUserId: reviewerId, reviewedAt: now, updatedAt: now });
                        this.changeRequests.set(id, updated);
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    MemStorage.prototype.rejectChangeRequest = function (id, reviewerId, comment) {
        return __awaiter(this, void 0, void 0, function () {
            var request, now, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = this.changeRequests.get(id);
                        if (!request)
                            throw new Error('Change request not found');
                        if (request.status !== 'submitted') {
                            throw new Error('Only submitted requests can be rejected');
                        }
                        // Add comment
                        return [4 /*yield*/, this.createChangeRequestComment({
                                changeRequestId: id,
                                userId: reviewerId,
                                message: "REJECTED: ".concat(comment),
                            })];
                    case 1:
                        // Add comment
                        _a.sent();
                        now = new Date();
                        updated = __assign(__assign({}, request), { status: 'rejected', reviewedByUserId: reviewerId, reviewedAt: now, updatedAt: now });
                        this.changeRequests.set(id, updated);
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    MemStorage.prototype.returnChangeRequest = function (id, reviewerId, comment) {
        return __awaiter(this, void 0, void 0, function () {
            var request, now, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = this.changeRequests.get(id);
                        if (!request)
                            throw new Error('Change request not found');
                        if (request.status !== 'submitted') {
                            throw new Error('Only submitted requests can be returned');
                        }
                        // Add comment
                        return [4 /*yield*/, this.createChangeRequestComment({
                                changeRequestId: id,
                                userId: reviewerId,
                                message: "RETURNED FOR CLARIFICATION: ".concat(comment),
                            })];
                    case 1:
                        // Add comment
                        _a.sent();
                        now = new Date();
                        updated = __assign(__assign({}, request), { status: 'returned', reviewedByUserId: reviewerId, reviewedAt: now, updatedAt: now });
                        this.changeRequests.set(id, updated);
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    // Change Request Attachments
    MemStorage.prototype.getChangeRequestAttachments = function (changeRequestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.changeRequestAttachments.filter(function (a) { return a.changeRequestId === changeRequestId; })];
            });
        });
    };
    MemStorage.prototype.createChangeRequestAttachment = function (attachment) {
        return __awaiter(this, void 0, void 0, function () {
            var id, fullAttachment;
            return __generator(this, function (_a) {
                id = this.currentAttachmentId++;
                fullAttachment = __assign(__assign({}, attachment), { id: id, uploadedAt: new Date() });
                this.changeRequestAttachments.push(fullAttachment);
                return [2 /*return*/, fullAttachment];
            });
        });
    };
    // Change Request Comments
    MemStorage.prototype.getChangeRequestComments = function (changeRequestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.changeRequestComments
                        .filter(function (c) { return c.changeRequestId === changeRequestId; })
                        .sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); })];
            });
        });
    };
    MemStorage.prototype.createChangeRequestComment = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            var id, fullComment;
            return __generator(this, function (_a) {
                id = this.currentCommentId++;
                fullComment = __assign(__assign({}, comment), { id: id, createdAt: new Date() });
                this.changeRequestComments.push(fullComment);
                return [2 /*return*/, fullComment];
            });
        });
    };
    // Bulk Import methods
    MemStorage.prototype.bulkCreateComponents = function (components) {
        return __awaiter(this, void 0, void 0, function () {
            var created, _i, components_1, comp, newComp;
            return __generator(this, function (_a) {
                created = [];
                for (_i = 0, components_1 = components; _i < components_1.length; _i++) {
                    comp = components_1[_i];
                    newComp = __assign(__assign({}, comp), { id: comp.id || String(Date.now() + Math.random()), vesselId: comp.vesselId || 'V001', currentCumulativeRH: comp.currentCumulativeRH || '0', lastUpdated: comp.lastUpdated || new Date().toISOString().split('T')[0] });
                    this.components.set(newComp.id, newComp);
                    created.push(newComp);
                }
                return [2 /*return*/, created];
            });
        });
    };
    MemStorage.prototype.bulkUpdateComponents = function (updates) {
        return __awaiter(this, void 0, void 0, function () {
            var updated, _i, updates_2, _a, id, data, existing, updatedComp;
            return __generator(this, function (_b) {
                updated = [];
                for (_i = 0, updates_2 = updates; _i < updates_2.length; _i++) {
                    _a = updates_2[_i], id = _a.id, data = _a.data;
                    existing = this.components.get(id);
                    if (existing) {
                        updatedComp = __assign(__assign({}, existing), data);
                        this.components.set(id, updatedComp);
                        updated.push(updatedComp);
                    }
                }
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.bulkUpsertComponents = function (components) {
        return __awaiter(this, void 0, void 0, function () {
            var created, updated, _i, components_2, comp, id, existing, newComp;
            return __generator(this, function (_a) {
                created = 0;
                updated = 0;
                for (_i = 0, components_2 = components; _i < components_2.length; _i++) {
                    comp = components_2[_i];
                    id = comp.id || comp.componentCode;
                    if (!id)
                        continue;
                    if (this.components.has(id)) {
                        existing = this.components.get(id);
                        this.components.set(id, __assign(__assign({}, existing), comp));
                        updated++;
                    }
                    else {
                        newComp = __assign(__assign({}, comp), { id: id, currentCumulativeRH: comp.currentCumulativeRH || '0', lastUpdated: comp.lastUpdated || new Date().toISOString().split('T')[0] });
                        this.components.set(id, newComp);
                        created++;
                    }
                }
                return [2 /*return*/, { created: created, updated: updated }];
            });
        });
    };
    MemStorage.prototype.bulkCreateSpares = function (spares) {
        return __awaiter(this, void 0, void 0, function () {
            var created, _i, spares_1, spare, id, newSpare;
            return __generator(this, function (_a) {
                created = [];
                for (_i = 0, spares_1 = spares; _i < spares_1.length; _i++) {
                    spare = spares_1[_i];
                    id = this.currentSpareId++;
                    newSpare = __assign(__assign({}, spare), { id: id, robStock: spare.robStock || 0, consumed: spare.consumed || 0, received: spare.received || 0, status: spare.status || 'active', minStock: spare.minStock || 0, stockStatus: this.calculateStockStatus(spare.robStock || 0, spare.minStock || 0), issuedWithUnit: spare.issuedWithUnit || 0, createdAt: new Date(), updatedAt: new Date() });
                    this.spares.set(id, newSpare);
                    created.push(newSpare);
                }
                return [2 /*return*/, created];
            });
        });
    };
    MemStorage.prototype.bulkUpdateSparesByROB = function (updates) {
        return __awaiter(this, void 0, void 0, function () {
            var updated, _loop_1, this_1, _i, updates_3, _a, robId, data;
            return __generator(this, function (_b) {
                updated = [];
                _loop_1 = function (robId, data) {
                    // Find spare by robId
                    var existingEntry = Array.from(this_1.spares.entries()).find(function (_a) {
                        var _ = _a[0], spare = _a[1];
                        return spare.robId === robId;
                    });
                    if (existingEntry) {
                        var id = existingEntry[0], existing = existingEntry[1];
                        var updatedSpare = __assign(__assign(__assign({}, existing), data), { updatedAt: new Date() });
                        this_1.spares.set(id, updatedSpare);
                        updated.push(updatedSpare);
                    }
                };
                this_1 = this;
                for (_i = 0, updates_3 = updates; _i < updates_3.length; _i++) {
                    _a = updates_3[_i], robId = _a.robId, data = _a.data;
                    _loop_1(robId, data);
                }
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.bulkUpsertSpares = function (spares) {
        return __awaiter(this, void 0, void 0, function () {
            var created, updated, _loop_2, this_2, _i, spares_2, spare;
            return __generator(this, function (_a) {
                created = 0;
                updated = 0;
                _loop_2 = function (spare) {
                    // Try to find existing spare by robId
                    var existingEntry = Array.from(this_2.spares.entries()).find(function (_a) {
                        var _ = _a[0], s = _a[1];
                        return s.robId === spare.robId;
                    });
                    if (existingEntry) {
                        var id = existingEntry[0], existing = existingEntry[1];
                        var updatedSpare = __assign(__assign(__assign({}, existing), spare), { stockStatus: this_2.calculateStockStatus(spare.robStock || existing.robStock, spare.minStock || existing.minStock), updatedAt: new Date() });
                        this_2.spares.set(id, updatedSpare);
                        updated++;
                    }
                    else {
                        var id = this_2.currentSpareId++;
                        var newSpare = __assign(__assign({}, spare), { id: id, robStock: spare.robStock || 0, consumed: spare.consumed || 0, received: spare.received || 0, status: spare.status || 'active', minStock: spare.minStock || 0, stockStatus: this_2.calculateStockStatus(spare.robStock || 0, spare.minStock || 0), issuedWithUnit: spare.issuedWithUnit || 0, createdAt: new Date(), updatedAt: new Date() });
                        this_2.spares.set(id, newSpare);
                        created++;
                    }
                };
                this_2 = this;
                for (_i = 0, spares_2 = spares; _i < spares_2.length; _i++) {
                    spare = spares_2[_i];
                    _loop_2(spare);
                }
                return [2 /*return*/, { created: created, updated: updated }];
            });
        });
    };
    MemStorage.prototype.archiveComponentsByIds = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var archived, _i, ids_1, id, comp;
            return __generator(this, function (_a) {
                archived = 0;
                for (_i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                    id = ids_1[_i];
                    if (this.components.has(id)) {
                        comp = this.components.get(id);
                        this.components.set(id, __assign(__assign({}, comp), { status: 'archived' }));
                        archived++;
                    }
                }
                return [2 /*return*/, archived];
            });
        });
    };
    MemStorage.prototype.archiveSparesByIds = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var archived, _i, ids_2, id, spare;
            return __generator(this, function (_a) {
                archived = 0;
                for (_i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
                    id = ids_2[_i];
                    if (this.spares.has(id)) {
                        spare = this.spares.get(id);
                        this.spares.set(id, __assign(__assign({}, spare), { status: 'archived' }));
                        archived++;
                    }
                }
                return [2 /*return*/, archived];
            });
        });
    };
    MemStorage.prototype.calculateStockStatus = function (robStock, minStock) {
        if (robStock === 0)
            return 'Out of Stock';
        if (robStock < minStock)
            return 'Minimum';
        if (robStock < minStock * 1.5)
            return 'Low';
        return 'OK';
    };
    MemStorage.prototype.initializeAlertPolicies = function () {
        var _this = this;
        // Initialize default alert policies
        var defaultPolicies = [
            {
                alertType: 'maintenance_due',
                enabled: true,
                priority: 'medium',
                emailEnabled: false,
                inAppEnabled: true,
                thresholds: JSON.stringify({
                    daysBeforeDue: 7,
                    includePendingApproval: false,
                    onlyCritical: false,
                }),
                scopeFilters: JSON.stringify({}),
                recipients: JSON.stringify({
                    roles: ['Chief Engineer', '2nd Engineer'],
                    users: [],
                }),
                createdBy: 'system',
                updatedBy: 'system',
            },
            {
                alertType: 'critical_inventory',
                enabled: true,
                priority: 'high',
                emailEnabled: true,
                inAppEnabled: true,
                thresholds: JSON.stringify({
                    bufferQty: 0,
                    includeNonCritical: false,
                }),
                scopeFilters: JSON.stringify({}),
                recipients: JSON.stringify({
                    roles: ['Chief Engineer', 'Tech Superintendent'],
                    users: [],
                }),
                createdBy: 'system',
                updatedBy: 'system',
            },
            {
                alertType: 'running_hours',
                enabled: true,
                priority: 'medium',
                emailEnabled: false,
                inAppEnabled: true,
                thresholds: JSON.stringify({
                    hoursBeforeService: 100,
                    utilizationSpikePercent: null,
                }),
                scopeFilters: JSON.stringify({}),
                recipients: JSON.stringify({
                    roles: ['Chief Engineer'],
                    users: [],
                }),
                createdBy: 'system',
                updatedBy: 'system',
            },
            {
                alertType: 'certificate_expiration',
                enabled: true,
                priority: 'high',
                emailEnabled: true,
                inAppEnabled: true,
                thresholds: JSON.stringify({
                    daysBeforeExpiry: 30,
                    types: ['Class Certificates', 'Flag', 'Insurance'],
                }),
                scopeFilters: JSON.stringify({}),
                recipients: JSON.stringify({
                    roles: ['Tech Superintendent', 'Office'],
                    users: [],
                }),
                createdBy: 'system',
                updatedBy: 'system',
            },
            {
                alertType: 'system_backup',
                enabled: true,
                priority: 'low',
                emailEnabled: false,
                inAppEnabled: true,
                thresholds: JSON.stringify({
                    requireDailySuccess: true,
                    maxAgeHours: 26,
                }),
                scopeFilters: JSON.stringify({}),
                recipients: JSON.stringify({
                    roles: ['Tech Superintendent'],
                    users: [],
                }),
                createdBy: 'system',
                updatedBy: 'system',
            },
        ];
        defaultPolicies.forEach(function (policy, index) {
            var newPolicy = __assign(__assign({ id: index + 1 }, policy), { createdAt: new Date(), updatedAt: new Date() });
            _this.alertPolicies.set(newPolicy.id, newPolicy);
            _this.currentAlertPolicyId = index + 2;
        });
    };
    // Alert Policy methods
    MemStorage.prototype.getAlertPolicies = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.alertPolicies.values())];
            });
        });
    };
    MemStorage.prototype.getAlertPolicy = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.alertPolicies.get(id)];
            });
        });
    };
    MemStorage.prototype.createAlertPolicy = function (policy) {
        return __awaiter(this, void 0, void 0, function () {
            var newPolicy;
            return __generator(this, function (_a) {
                newPolicy = __assign(__assign({ id: this.currentAlertPolicyId++ }, policy), { createdAt: new Date(), updatedAt: new Date() });
                this.alertPolicies.set(newPolicy.id, newPolicy);
                return [2 /*return*/, newPolicy];
            });
        });
    };
    MemStorage.prototype.updateAlertPolicy = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var policy, updated;
            return __generator(this, function (_a) {
                policy = this.alertPolicies.get(id);
                if (!policy) {
                    throw new Error("Alert policy ".concat(id, " not found"));
                }
                updated = __assign(__assign(__assign({}, policy), data), { updatedAt: new Date() });
                this.alertPolicies.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.deleteAlertPolicy = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.alertPolicies.delete(id);
                return [2 /*return*/];
            });
        });
    };
    // Alert Event methods
    MemStorage.prototype.getAlertEvents = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var events;
            return __generator(this, function (_a) {
                events = Array.from(this.alertEvents.values());
                if (filters) {
                    if (filters.startDate) {
                        events = events.filter(function (e) { return e.createdAt >= filters.startDate; });
                    }
                    if (filters.endDate) {
                        events = events.filter(function (e) { return e.createdAt <= filters.endDate; });
                    }
                    if (filters.alertType) {
                        events = events.filter(function (e) { return e.alertType === filters.alertType; });
                    }
                    if (filters.priority) {
                        events = events.filter(function (e) { return e.priority === filters.priority; });
                    }
                    if (filters.vesselId) {
                        events = events.filter(function (e) { return e.vesselId === filters.vesselId; });
                    }
                }
                return [2 /*return*/, events.sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); })];
            });
        });
    };
    MemStorage.prototype.getAlertEvent = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.alertEvents.get(id)];
            });
        });
    };
    MemStorage.prototype.createAlertEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var newEvent;
            return __generator(this, function (_a) {
                newEvent = __assign(__assign({ id: this.currentAlertEventId++ }, event), { createdAt: new Date() });
                this.alertEvents.set(newEvent.id, newEvent);
                return [2 /*return*/, newEvent];
            });
        });
    };
    MemStorage.prototype.acknowledgeAlertEvent = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var event, updated;
            return __generator(this, function (_a) {
                event = this.alertEvents.get(id);
                if (!event) {
                    throw new Error("Alert event ".concat(id, " not found"));
                }
                updated = __assign(__assign({}, event), { ackBy: userId, ackAt: new Date() });
                this.alertEvents.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    // Alert Delivery methods
    MemStorage.prototype.getAlertDeliveries = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.alertDeliveries.values()).filter(function (d) { return d.eventId === eventId; })];
            });
        });
    };
    MemStorage.prototype.createAlertDelivery = function (delivery) {
        return __awaiter(this, void 0, void 0, function () {
            var newDelivery;
            return __generator(this, function (_a) {
                newDelivery = __assign(__assign({ id: this.currentAlertDeliveryId++ }, delivery), { createdAt: new Date() });
                this.alertDeliveries.set(newDelivery.id, newDelivery);
                return [2 /*return*/, newDelivery];
            });
        });
    };
    MemStorage.prototype.updateAlertDeliveryStatus = function (id, status, errorMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var delivery, updated;
            return __generator(this, function (_a) {
                delivery = this.alertDeliveries.get(id);
                if (!delivery) {
                    throw new Error("Alert delivery ".concat(id, " not found"));
                }
                updated = __assign(__assign({}, delivery), { status: status, errorMessage: errorMessage, sentAt: status === 'sent' ? new Date() : delivery.sentAt, acknowledgedAt: status === 'acknowledged' ? new Date() : delivery.acknowledgedAt });
                this.alertDeliveries.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    // Alert Config methods
    MemStorage.prototype.getAlertConfig = function (vesselId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.alertConfigs.get(vesselId)];
            });
        });
    };
    MemStorage.prototype.createOrUpdateAlertConfig = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, updated, newConfig;
            return __generator(this, function (_a) {
                existing = this.alertConfigs.get(config.vesselId);
                if (existing) {
                    updated = __assign(__assign(__assign({}, existing), config), { updatedAt: new Date() });
                    this.alertConfigs.set(config.vesselId, updated);
                    return [2 /*return*/, updated];
                }
                else {
                    newConfig = __assign(__assign({ id: this.currentAlertConfigId++ }, config), { createdAt: new Date(), updatedAt: new Date() });
                    this.alertConfigs.set(config.vesselId, newConfig);
                    return [2 /*return*/, newConfig];
                }
                return [2 /*return*/];
            });
        });
    };
    // Form Definition methods
    MemStorage.prototype.getFormDefinitions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.formDefinitions.values())];
            });
        });
    };
    MemStorage.prototype.getFormDefinition = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.formDefinitions.get(id)];
            });
        });
    };
    MemStorage.prototype.getFormDefinitionByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.formDefinitions.values()).find(function (f) { return f.name === name; })];
            });
        });
    };
    MemStorage.prototype.createFormDefinition = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var newForm;
            return __generator(this, function (_a) {
                newForm = __assign({ id: this.currentFormDefinitionId++ }, form);
                this.formDefinitions.set(newForm.id, newForm);
                return [2 /*return*/, newForm];
            });
        });
    };
    // Form Version methods
    MemStorage.prototype.getFormVersions = function (formId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.formVersions.values())
                        .filter(function (v) { return v.formId === formId; })
                        .sort(function (a, b) { return b.versionNo - a.versionNo; })];
            });
        });
    };
    MemStorage.prototype.getFormVersion = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.formVersions.get(id)];
            });
        });
    };
    MemStorage.prototype.getLatestPublishedVersion = function (formId) {
        return __awaiter(this, void 0, void 0, function () {
            var versions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFormVersions(formId)];
                    case 1:
                        versions = _a.sent();
                        return [2 /*return*/, versions.find(function (v) { return v.status === 'PUBLISHED'; })];
                }
            });
        });
    };
    MemStorage.prototype.getLatestPublishedVersionByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var form;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFormDefinitionByName(name)];
                    case 1:
                        form = _a.sent();
                        if (!form)
                            return [2 /*return*/, undefined];
                        return [2 /*return*/, this.getLatestPublishedVersion(form.id)];
                }
            });
        });
    };
    MemStorage.prototype.createFormVersion = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            var newVersion;
            return __generator(this, function (_a) {
                newVersion = __assign(__assign({ id: this.currentFormVersionId++ }, version), { versionDate: version.versionDate || new Date() });
                this.formVersions.set(newVersion.id, newVersion);
                return [2 /*return*/, newVersion];
            });
        });
    };
    MemStorage.prototype.updateFormVersion = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var version, updated;
            return __generator(this, function (_a) {
                version = this.formVersions.get(id);
                if (!version)
                    throw new Error('Form version not found');
                if (version.status !== 'DRAFT') {
                    throw new Error('Can only update draft versions');
                }
                updated = __assign(__assign({}, version), data);
                this.formVersions.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.publishFormVersion = function (id, userId, changelog) {
        return __awaiter(this, void 0, void 0, function () {
            var version, currentPublished, published;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        version = this.formVersions.get(id);
                        if (!version)
                            throw new Error('Form version not found');
                        if (version.status !== 'DRAFT') {
                            throw new Error('Can only publish draft versions');
                        }
                        return [4 /*yield*/, this.getLatestPublishedVersion(version.formId)];
                    case 1:
                        currentPublished = _a.sent();
                        if (currentPublished) {
                            this.formVersions.set(currentPublished.id, __assign(__assign({}, currentPublished), { status: 'ARCHIVED' }));
                        }
                        published = __assign(__assign({}, version), { status: 'PUBLISHED', authorUserId: userId, changelog: changelog, versionDate: new Date() });
                        this.formVersions.set(id, published);
                        return [2 /*return*/, published];
                }
            });
        });
    };
    MemStorage.prototype.discardFormVersion = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var version;
            return __generator(this, function (_a) {
                version = this.formVersions.get(id);
                if (!version)
                    throw new Error('Form version not found');
                if (version.status !== 'DRAFT') {
                    throw new Error('Can only discard draft versions');
                }
                this.formVersions.delete(id);
                return [2 /*return*/];
            });
        });
    };
    // Form Version Usage methods
    MemStorage.prototype.createFormVersionUsage = function (usage) {
        return __awaiter(this, void 0, void 0, function () {
            var newUsage;
            return __generator(this, function (_a) {
                newUsage = __assign(__assign({ id: this.currentFormUsageId++ }, usage), { usedAt: usage.usedAt || new Date() });
                this.formVersionUsages.push(newUsage);
                return [2 /*return*/, newUsage];
            });
        });
    };
    MemStorage.prototype.getFormVersionUsage = function (formVersionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.formVersionUsages.filter(function (u) { return u.formVersionId === formVersionId; })];
            });
        });
    };
    // Work Orders methods
    MemStorage.prototype.getWorkOrders = function (vesselId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.workOrders.values()).filter(function (wo) { return wo.vesselId === vesselId; })];
            });
        });
    };
    MemStorage.prototype.createWorkOrder = function (workOrder) {
        return __awaiter(this, void 0, void 0, function () {
            var id, newWorkOrder;
            return __generator(this, function (_a) {
                id = workOrder.id || "wo-".concat(this.currentWorkOrderId++);
                newWorkOrder = __assign(__assign({}, workOrder), { id: id, createdAt: new Date(), updatedAt: new Date() });
                this.workOrders.set(id, newWorkOrder);
                return [2 /*return*/, newWorkOrder];
            });
        });
    };
    MemStorage.prototype.updateWorkOrder = function (workOrderId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingWorkOrder, updatedWorkOrder;
            return __generator(this, function (_a) {
                existingWorkOrder = this.workOrders.get(workOrderId);
                if (!existingWorkOrder) {
                    throw new Error("Work order with id ".concat(workOrderId, " not found"));
                }
                updatedWorkOrder = __assign(__assign(__assign({}, existingWorkOrder), data), { updatedAt: new Date() });
                this.workOrders.set(workOrderId, updatedWorkOrder);
                return [2 /*return*/, updatedWorkOrder];
            });
        });
    };
    MemStorage.prototype.deleteWorkOrder = function (workOrderId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.workOrders.delete(workOrderId)) {
                    throw new Error("Work order with id ".concat(workOrderId, " not found"));
                }
                return [2 /*return*/];
            });
        });
    };
    // Seed forms method
    MemStorage.prototype.seedForms = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Check if forms already exist
                        if (this.formDefinitions.size > 0) {
                            return [2 /*return*/]; // Already seeded
                        }
                        // Re-initialize forms
                        return [4 /*yield*/, this.initializeFormDefinitions()];
                    case 1:
                        // Re-initialize forms
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MemStorage;
}());
export { MemStorage };
// Export MySQL database storage from database.ts
export { storage } from './database';
//# sourceMappingURL=storage.js.map