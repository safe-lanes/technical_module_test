import { __assign } from "tslib";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import AgGridTable from '@/components/common/AgGridTable';
import { StatusCellRenderer, WorkOrderActionsCellRenderer, DateCellRenderer, } from '@/components/common/AgGridCellRenderers';
import PostponeWorkOrderDialog from '@/components/PostponeWorkOrderDialog';
import WorkOrderForm from '@/components/WorkOrderForm';
import UnplannedWorkOrderForm from '@/components/UnplannedWorkOrderForm';
import { useModifyMode } from '@/hooks/useModifyMode';
import { ModifyStickyFooter } from '@/components/modify/ModifyStickyFooter';
// Helper function to generate template code
var generateTemplateCode = function (componentCode, taskType, basis, frequency, unit) {
    var taskCodes = {
        Inspection: 'INS',
        Overhaul: 'OH',
        Service: 'SRV',
        Testing: 'TST',
    };
    var freqTag = '';
    if (basis === 'Calendar' && frequency && unit) {
        var unitCode = unit[0].toUpperCase();
        freqTag = "".concat(unitCode).concat(frequency);
    }
    else if (basis === 'Running Hours' && frequency) {
        freqTag = "RH".concat(frequency);
    }
    var taskCode = taskCodes[taskType] || '';
    return "WO-".concat(componentCode, "-").concat(taskCode).concat(freqTag).toUpperCase();
};
// Sample data for seeding if database is empty
var sampleWorkOrders = [
    {
        id: '1',
        component: 'Main Engine',
        componentCode: '6.1.1',
        templateCode: 'WO-6.1.1-OHM6',
        workOrderNo: 'WO-2025-03',
        jobTitle: 'Main Engine Overhaul - Replace Main Bearings',
        assignedTo: 'Chief Engineer',
        dueDate: '02-Jun-2025',
        status: 'Completed',
        dateCompleted: '02-Jun-2025',
        taskType: 'Overhaul',
        maintenanceBasis: 'Calendar',
        frequencyValue: '6',
        frequencyUnit: 'Months',
    },
    {
        id: '2',
        component: 'Diesel Generator 1',
        componentCode: '6.2.1',
        templateCode: 'WO-6.2.1-SRVM3',
        workOrderNo: 'WO-2025-17',
        jobTitle: 'DG1 - Replace Fuel Injectors',
        assignedTo: '2nd Engineer',
        dueDate: '05-Jun-2025',
        status: 'Due (Grace P)',
        taskType: 'Service',
        maintenanceBasis: 'Calendar',
        frequencyValue: '3',
        frequencyUnit: 'Months',
    },
    {
        id: '3',
        component: 'Steering Gear',
        componentCode: '1.5.1',
        templateCode: 'WO-1.5.1-INSM3',
        workOrderNo: 'WO-2025-54',
        jobTitle: 'Steering Gear - 3 Monthly XXX',
        assignedTo: '2nd Engineer',
        dueDate: '16-Jun-2025',
        status: 'Due',
        taskType: 'Inspection',
        maintenanceBasis: 'Calendar',
        frequencyValue: '3',
        frequencyUnit: 'Months',
    },
    {
        id: '4',
        component: 'Main Cooling Seawater Pump',
        componentCode: '7.1.2.1',
        templateCode: 'WO-7.1.2.1-SRVRH2000',
        workOrderNo: 'WO-2025-19',
        jobTitle: 'MCSP - Replace Mechanical Seal',
        assignedTo: '3rd Engineer',
        dueDate: '23-Jun-2025',
        status: 'Due',
        taskType: 'Service',
        maintenanceBasis: 'Running Hours',
        frequencyValue: '2000',
        frequencyUnit: '',
    },
    {
        id: '5',
        component: 'Main Air Compressor',
        componentCode: '7.4.1',
        templateCode: 'WO-7.4.1-OHRH1000',
        workOrderNo: 'WO-2025-03',
        jobTitle: 'Main Air Compressor - Work Order XXX',
        assignedTo: '3rd Engineer',
        dueDate: '30-Jun-2025',
        status: 'Completed',
        dateCompleted: '30-Jun-2025',
        taskType: 'Overhaul',
        maintenanceBasis: 'Running Hours',
        frequencyValue: '1000',
        frequencyUnit: '',
    },
    {
        id: '6',
        component: 'Mooring Winch Forward',
        componentCode: '3.3.1',
        templateCode: 'WO-3.3.1-INSM6',
        workOrderNo: 'WO-2025-17',
        jobTitle: 'Mooring Winch Forward - Work Order XXX',
        assignedTo: '2nd Engineer',
        dueDate: '02-Jun-2025',
        status: 'Overdue',
        taskType: 'Inspection',
        maintenanceBasis: 'Calendar',
        frequencyValue: '6',
        frequencyUnit: 'Months',
    },
    {
        id: '7',
        component: 'Bow Thruster',
        componentCode: '5.2.1',
        templateCode: 'WO-5.2.1-OHY1',
        workOrderNo: 'WO-2025-54',
        jobTitle: 'Bow Thruster - Work Order XXX',
        assignedTo: 'Chief Engineer',
        dueDate: '09-Jun-2025',
        status: 'Postponed',
        taskType: 'Overhaul',
        maintenanceBasis: 'Calendar',
        frequencyValue: '1',
        frequencyUnit: 'Years',
    },
    {
        id: '8',
        component: 'Fire Pump',
        componentCode: '8.1.2',
        templateCode: 'WO-8.1.2-TSTM1',
        workOrderNo: 'WO-2025-13',
        jobTitle: 'Fire Pump - Work Order XXX',
        assignedTo: '2nd Engineer',
        dueDate: '16-Jun-2025',
        status: 'Completed',
        dateCompleted: '16-Jun-2025',
        taskType: 'Testing',
        maintenanceBasis: 'Calendar',
        frequencyValue: '1',
        frequencyUnit: 'Months',
    },
    {
        id: '9',
        component: 'Main Engine',
        componentCode: '6.1.1',
        templateCode: 'WO-6.1.1-SRVRH3000',
        workOrderNo: 'WO-2025-03',
        jobTitle: 'Main Engine - Replace Piston Rings (#3 Unit)',
        assignedTo: 'Chief Engineer',
        dueDate: '23-Jun-2025',
        status: 'Due',
        taskType: 'Service',
        maintenanceBasis: 'Running Hours',
        frequencyValue: '3000',
        frequencyUnit: '',
    },
    {
        id: '10',
        component: 'Diesel Generator 1',
        componentCode: '6.2.1',
        templateCode: 'WO-6.2.1-INSRH500',
        workOrderNo: 'WO-2025-17',
        jobTitle: 'Diesel Generator 1 - Work Order XXX',
        assignedTo: '2nd Engineer',
        dueDate: '30-Jun-2025',
        status: 'Completed',
        dateCompleted: '30-Jun-2025',
        taskType: 'Inspection',
        maintenanceBasis: 'Running Hours',
        frequencyValue: '500',
        frequencyUnit: '',
    },
    {
        id: '11',
        component: 'Steering Gear',
        componentCode: '1.5.1',
        templateCode: 'WO-1.5.1-OHY2',
        workOrderNo: 'WO-2025-54',
        jobTitle: 'Steering Gear - Work Order XXX',
        assignedTo: '2nd Engineer',
        dueDate: '02-Jun-2025',
        status: 'Overdue',
        taskType: 'Overhaul',
        maintenanceBasis: 'Calendar',
        frequencyValue: '2',
        frequencyUnit: 'Years',
    },
    {
        id: '12',
        component: 'Main Cooling Seawater Pump',
        componentCode: '7.1.2.1',
        templateCode: 'WO-7.1.2.1-INSRH1000',
        workOrderNo: 'WO-2025-19',
        jobTitle: 'Main Cooling Seawater Pump - Work Order XXX',
        assignedTo: '3rd Engineer',
        dueDate: '09-Aug-2025',
        status: 'Due',
        taskType: 'Inspection',
        maintenanceBasis: 'Running Hours',
        frequencyValue: '1000',
        frequencyUnit: '',
    },
    // Sample execution with Pending Approval status
    {
        id: 'exec-001',
        executionId: '2025-WO-1.1.1.1.11-INSM3-01',
        templateCode: 'WO-1.1.1.1.11-INSM3',
        component: 'Fresh Water Pump #1',
        componentCode: '1.1.1.1.11',
        workOrderNo: '2025-WO-1.1.1.1.11-INSM3-01',
        jobTitle: 'Pump Inspection Execution',
        assignedTo: '2nd Engineer',
        dueDate: '2025-01-15',
        submittedDate: '2025-01-10',
        status: 'Pending Approval',
        isExecution: true,
        taskType: 'Inspection',
        maintenanceBasis: 'Calendar',
        frequencyValue: '3',
        frequencyUnit: 'Months',
    },
    {
        id: 'exec-002',
        executionId: '2025-WO-1.1.1.1.13-SRVW4-01',
        templateCode: 'WO-1.1.1.1.13-SRVW4',
        component: 'Fresh Water Pump #2',
        componentCode: '1.1.1.1.13',
        workOrderNo: '2025-WO-1.1.1.1.13-SRVW4-01',
        jobTitle: 'Weekly Service Execution',
        assignedTo: '3rd Engineer',
        dueDate: '2025-01-12',
        submittedDate: '2025-01-08',
        status: 'Pending Approval',
        isExecution: true,
        taskType: 'Service',
        maintenanceBasis: 'Calendar',
        frequencyValue: '4',
        frequencyUnit: 'Weeks',
    },
];
var WorkOrders = function () {
    var _a = useState(''), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = useState(''), selectedVessel = _b[0], setSelectedVessel = _b[1];
    var _c = useState(''), selectedPeriod = _c[0], setSelectedPeriod = _c[1];
    var _d = useState(''), selectedRank = _d[0], setSelectedRank = _d[1];
    var _e = useState(''), selectedComponent = _e[0], setSelectedComponent = _e[1];
    var _f = useState(''), selectedCriticality = _f[0], setSelectedCriticality = _f[1];
    var _g = useState('All W.O'), activeTab = _g[0], setActiveTab = _g[1];
    var _h = useState(false), postponeDialogOpen = _h[0], setPostponeDialogOpen = _h[1];
    var _j = useState(false), workOrderFormOpen = _j[0], setWorkOrderFormOpen = _j[1];
    var _k = useState(false), unplannedWorkOrderFormOpen = _k[0], setUnplannedWorkOrderFormOpen = _k[1];
    var _l = useState(null), selectedWorkOrder = _l[0], setSelectedWorkOrder = _l[1];
    var _m = useState(null), gridApi = _m[0], setGridApi = _m[1];
    // Database integration
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var vesselId = 'V001'; // Default vessel
    // Fetch work orders from database
    var _o = useQuery({
        queryKey: ['/api/work-orders', vesselId],
        queryFn: function () {
            return fetch("/api/work-orders/".concat(vesselId)).then(function (res) { return res.json(); });
        },
    }), _p = _o.data, workOrdersFromDB = _p === void 0 ? [] : _p, isLoading = _o.isLoading;
    // Create work order mutation
    var createWorkOrderMutation = useMutation({
        mutationFn: function (workOrderData) {
            return apiRequest('POST', "/api/work-orders/".concat(vesselId), workOrderData);
        },
        onSuccess: function () {
            queryClient.invalidateQueries({
                queryKey: ['/api/work-orders', vesselId],
            });
            toast({
                title: 'Success',
                description: 'Work order created successfully',
            });
        },
        onError: function () {
            toast({
                title: 'Error',
                description: 'Failed to create work order',
                variant: 'destructive',
            });
        },
    });
    // Update work order mutation
    var updateWorkOrderMutation = useMutation({
        mutationFn: function (_a) {
            var id = _a.id, data = _a.data;
            return apiRequest('PUT', "/api/work-orders/".concat(vesselId, "/").concat(id), data);
        },
        onSuccess: function () {
            queryClient.invalidateQueries({
                queryKey: ['/api/work-orders', vesselId],
            });
            toast({
                title: 'Success',
                description: 'Work order updated successfully',
            });
        },
        onError: function () {
            toast({
                title: 'Error',
                description: 'Failed to update work order',
                variant: 'destructive',
            });
        },
    });
    // Delete work order mutation
    var deleteWorkOrderMutation = useMutation({
        mutationFn: function (id) {
            return apiRequest('DELETE', "/api/work-orders/".concat(vesselId, "/").concat(id));
        },
        onSuccess: function () {
            queryClient.invalidateQueries({
                queryKey: ['/api/work-orders', vesselId],
            });
            toast({
                title: 'Success',
                description: 'Work order deleted successfully',
            });
        },
        onError: function () {
            toast({
                title: 'Error',
                description: 'Failed to delete work order',
                variant: 'destructive',
            });
        },
    });
    // Modify mode integration
    var _q = useModifyMode(), isModifyMode = _q.isModifyMode, targetId = _q.targetId, fieldChanges = _q.fieldChanges;
    var location = useLocation()[0];
    // Use database data if available, otherwise fallback to sample data for demo
    var workOrdersToUse = workOrdersFromDB.length > 0 ? workOrdersFromDB : sampleWorkOrders;
    // Backfill templateCode for existing work orders if missing
    var backfilledWorkOrders = workOrdersToUse.map(function (wo) {
        if (!wo.templateCode && wo.componentCode && wo.taskType) {
            var templateCode = generateTemplateCode(wo.componentCode, wo.taskType, wo.maintenanceBasis || 'Calendar', wo.frequencyValue || '', wo.frequencyUnit);
            return __assign(__assign({}, wo), { templateCode: templateCode });
        }
        return wo;
    });
    var workOrdersList = backfilledWorkOrders;
    // Handle preview mode from "View Changes" button
    useEffect(function () {
        var urlParams = new URLSearchParams(window.location.search);
        var previewChanges = urlParams.get('previewChanges');
        var changeRequestId = urlParams.get('changeRequestId');
        var targetType = urlParams.get('targetType');
        var previewTargetId = urlParams.get('targetId');
        // Auto-open work order form if navigating from "View Changes"
        if (previewChanges === '1' &&
            targetType === 'workOrder' &&
            previewTargetId) {
            var targetWorkOrder = workOrdersList.find(function (wo) { return wo.id === previewTargetId; });
            if (targetWorkOrder) {
                setSelectedWorkOrder(targetWorkOrder);
                setWorkOrderFormOpen(true);
            }
        }
    }, [location, workOrdersList]);
    var handleWorkOrderSubmit = function (workOrderId, formData) {
        console.log('🔄 handleWorkOrderSubmit called:', {
            workOrderId: workOrderId,
            type: formData === null || formData === void 0 ? void 0 : formData.type,
            data: formData === null || formData === void 0 ? void 0 : formData.data,
        });
        console.log('🔍 Full formData object:', JSON.stringify(formData, null, 2));
        if ((formData === null || formData === void 0 ? void 0 : formData.type) === 'template_draft') {
            // Save template as draft (Part A)
            console.log('💾 Saving template draft...');
            var workOrder = workOrdersList.find(function (wo) { return wo.id === workOrderId; });
            if (workOrder) {
                console.log('🔍 About to update existing work order:', workOrderId);
                updateWorkOrderMutation.mutate({
                    id: workOrderId,
                    data: __assign(__assign({}, formData.data), { status: 'Draft', templateCode: formData.data.templateCode ||
                            formData.data.woTemplateCode ||
                            workOrder.templateCode, formData: formData.data }),
                }, {
                    onSuccess: function (data) {
                        console.log('✅ Update successful:', data);
                    },
                    onError: function (error) {
                        console.error('❌ Update failed:', error);
                    },
                });
            }
            else {
                // Create new draft work order
                var newWorkOrder = {
                    id: workOrderId.startsWith('new-') ? "wo-".concat(Date.now()) : workOrderId,
                    component: formData.data.component || '',
                    componentCode: formData.data.componentCode || '',
                    workOrderNo: formData.data.woTemplateCode || "WO-".concat(Date.now()),
                    templateCode: formData.data.templateCode || formData.data.woTemplateCode,
                    jobTitle: formData.data.woTitle || formData.data.jobTitle,
                    assignedTo: formData.data.assignedTo,
                    dueDate: formData.data.nextDueDate || '',
                    status: 'Draft',
                    formData: formData.data,
                    isExecution: false,
                };
                console.log('🔍 About to create new work order:', newWorkOrder);
                createWorkOrderMutation.mutate(newWorkOrder, {
                    onSuccess: function (data) {
                        console.log('✅ Create successful:', data);
                    },
                    onError: function (error) {
                        console.error('❌ Create failed:', error);
                    },
                });
            }
        }
        else if ((formData === null || formData === void 0 ? void 0 : formData.type) === 'execution_draft') {
            // Save execution as draft (Part B in progress)
            console.log('💾 Saving execution draft...');
            var workOrder = workOrdersList.find(function (wo) { return wo.id === workOrderId; });
            if (workOrder) {
                updateWorkOrderMutation.mutate({
                    id: workOrderId,
                    data: __assign(__assign({}, formData.data), { status: 'In Progress', templateCode: formData.data.templateCode || workOrder.templateCode, formData: formData.data }),
                });
            }
        }
        else if ((formData === null || formData === void 0 ? void 0 : formData.type) === 'execution') {
            // Generate execution ID
            var year_1 = new Date().getFullYear();
            var templateCode_1 = formData.data.templateCode || formData.data.woTemplateCode;
            // Find existing executions for this template to get the next sequence number
            var existingExecutions = workOrdersList.filter(function (wo) {
                var _a;
                return wo.isExecution &&
                    wo.templateId === workOrderId &&
                    ((_a = wo.executionId) === null || _a === void 0 ? void 0 : _a.startsWith("".concat(year_1, "-").concat(templateCode_1)));
            });
            var sequence = String(existingExecutions.length + 1).padStart(2, '0');
            var executionId = "".concat(year_1, "-").concat(templateCode_1, "-").concat(sequence);
            // Create new execution record
            var executionRecord = {
                id: "exec-".concat(Date.now()),
                component: formData.data.component,
                componentCode: formData.data.componentCode,
                workOrderNo: executionId,
                templateCode: templateCode_1,
                executionId: executionId,
                jobTitle: formData.data.jobTitle,
                assignedTo: formData.data.assignedTo,
                dueDate: formData.data.dueDate || '',
                status: 'Pending Approval',
                submittedDate: new Date().toISOString().split('T')[0],
                formData: formData.data,
                isExecution: true,
                templateId: workOrderId,
            };
            createWorkOrderMutation.mutate(executionRecord);
            setActiveTab('Pending Approval');
        }
        else if ((formData === null || formData === void 0 ? void 0 : formData.type) === 'template') {
            // Update template
            var workOrder = workOrdersList.find(function (wo) { return wo.id === workOrderId; });
            if (workOrder) {
                updateWorkOrderMutation.mutate({
                    id: workOrderId,
                    data: __assign(__assign({}, formData.data), { templateCode: formData.data.woTemplateCode ||
                            formData.data.templateCode ||
                            workOrder.templateCode }),
                });
            }
        }
    };
    var tabs = [
        {
            id: 'All W.O',
            label: 'All W.O',
            count: workOrdersList.filter(function (wo) { return !wo.isExecution; }).length,
        },
        {
            id: 'Draft',
            label: 'Draft',
            count: workOrdersList.filter(function (wo) { return wo.status === 'Draft'; }).length,
        },
        {
            id: 'Due',
            label: 'Due',
            count: workOrdersList.filter(function (wo) {
                return !wo.isExecution &&
                    (wo.status === 'Due' || wo.status.includes('Grace'));
            }).length,
        },
        {
            id: 'Pending Approval',
            label: 'Pending Approval',
            count: workOrdersList.filter(function (wo) { return wo.isExecution && wo.status === 'Pending Approval'; }).length,
        },
        {
            id: 'Overdue',
            label: 'Overdue',
            count: workOrdersList.filter(function (wo) { return !wo.isExecution && wo.status === 'Overdue'; }).length,
        },
        {
            id: 'Completed',
            label: 'Completed',
            count: workOrdersList.filter(function (wo) {
                return (!wo.isExecution && wo.status === 'Completed') ||
                    (wo.isExecution && wo.status === 'Approved');
            }).length,
        },
    ];
    var getStatusBadgeColor = function (status) {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'due':
                return 'bg-yellow-100 text-yellow-800';
            case 'due (grace p)':
                return 'bg-orange-100 text-orange-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'postponed':
                return 'bg-blue-100 text-blue-800';
            case 'pending approval':
                return 'bg-purple-100 text-purple-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var filteredWorkOrders = workOrdersList.filter(function (wo) {
        if (activeTab === 'All W.O') {
            // Show templates and rejected executions
            if (wo.isExecution && wo.status !== 'Rejected')
                return false;
        }
        else if (activeTab === 'Draft') {
            // Show only draft work orders
            if (wo.status !== 'Draft')
                return false;
        }
        else if (activeTab === 'Due') {
            if (wo.isExecution)
                return false;
            if (wo.status !== 'Due' && !wo.status.includes('Grace'))
                return false;
        }
        else if (activeTab === 'Overdue') {
            if (wo.isExecution)
                return false;
            if (wo.status !== 'Overdue')
                return false;
        }
        else if (activeTab === 'Completed') {
            // Show both completed templates and approved executions
            if (!wo.isExecution && wo.status !== 'Completed')
                return false;
            if (wo.isExecution && wo.status !== 'Approved')
                return false;
        }
        else if (activeTab === 'Pending Approval') {
            // Show only execution records with Pending Approval status
            if (!wo.isExecution || wo.status !== 'Pending Approval')
                return false;
        }
        if (searchTerm &&
            !wo.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !wo.workOrderNo.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !(wo.templateCode &&
                wo.templateCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
            !(wo.executionId &&
                wo.executionId.toLowerCase().includes(searchTerm.toLowerCase()))) {
            return false;
        }
        return true;
    });
    var handlePostponeClick = function (workOrder) {
        setSelectedWorkOrder(workOrder);
        setPostponeDialogOpen(true);
    };
    var handleWorkOrderClick = function (workOrder) {
        setSelectedWorkOrder(workOrder);
        // If in modify mode, activate modify mode for this specific work order
        if (isModifyMode) {
            // The modify mode is already active via URL params
            // Just open the form and it will detect modify mode automatically
            setWorkOrderFormOpen(true);
        }
        else {
            setWorkOrderFormOpen(true);
        }
    };
    var handlePencilClick = function (workOrder) {
        setSelectedWorkOrder(workOrder);
        setWorkOrderFormOpen(true);
    };
    var handleTimerClick = function (workOrder) {
        setSelectedWorkOrder(workOrder);
        setPostponeDialogOpen(true);
    };
    // AG Grid column definitions
    var columnDefs = useMemo(function () {
        var baseColumns = [
            {
                headerName: 'Component',
                field: 'component',
                width: 200,
                cellRenderer: function (params) {
                    return (<span className='text-blue-600 hover:text-blue-800 cursor-pointer' onClick={function () { return handleWorkOrderClick(params.data); }}>
              {params.value}
            </span>);
                },
            },
            {
                headerName: activeTab === 'Pending Approval'
                    ? 'WO Execution ID'
                    : 'Work Order No',
                field: activeTab === 'Pending Approval' ? 'executionId' : 'workOrderNo',
                width: 180,
                valueGetter: function (params) {
                    if (activeTab === 'Pending Approval' && params.data.executionId) {
                        return params.data.executionId;
                    }
                    return params.data.templateCode || params.data.workOrderNo;
                },
            },
        ];
        // Add template code column for pending approval
        if (activeTab === 'Pending Approval') {
            baseColumns.push({
                headerName: 'WO Template Code',
                field: 'templateCode',
                width: 180,
            });
        }
        // Add remaining columns
        baseColumns.push({
            headerName: 'Job Title',
            field: 'jobTitle',
            width: 250,
        }, {
            headerName: 'Assigned to',
            field: 'assignedTo',
            width: 150,
        }, {
            headerName: activeTab === 'Pending Approval' ? 'Submitted Date' : 'Due Date',
            field: activeTab === 'Pending Approval' ? 'submittedDate' : 'dueDate',
            width: 150,
            cellRenderer: DateCellRenderer,
        }, {
            headerName: 'Status',
            field: 'status',
            width: 150,
            cellRenderer: StatusCellRenderer,
        });
        // Add date completed column for non-pending approval tabs
        if (activeTab !== 'Pending Approval') {
            baseColumns.push({
                headerName: 'Date Completed',
                field: 'dateCompleted',
                width: 150,
                cellRenderer: DateCellRenderer,
            });
        }
        // Add actions column
        baseColumns.push({
            headerName: 'Actions',
            field: 'actions',
            width: 150,
            cellRenderer: WorkOrderActionsCellRenderer,
            sortable: false,
            filter: false,
            pinned: 'right',
        });
        return baseColumns;
    }, [activeTab]);
    // AG Grid context for action handlers
    var gridContext = useMemo(function () { return ({
        onEdit: handlePencilClick,
        onPostpone: handleTimerClick,
        onApprove: function (workOrder) {
            handleApprove(workOrder);
        },
        onReject: function (workOrder) {
            handleReject(workOrder, 'Rejected from grid');
        },
    }); }, []);
    var onGridReady = function (params) {
        setGridApi(params.api);
    };
    var handleApprove = function (workOrderOrId, approverRemarks) {
        console.log('🎯 handleApprove called with:', {
            workOrderOrId: workOrderOrId,
            approverRemarks: approverRemarks,
        });
        // Handle both cases: work order object from AG Grid context or string ID
        var workOrder;
        if (typeof workOrderOrId === 'string') {
            workOrder = workOrdersList.find(function (wo) { return wo.executionId === workOrderOrId || wo.id === workOrderOrId; });
        }
        else {
            workOrder = workOrderOrId; // It's already the work order object
        }
        console.log('🔍 Found workOrder:', workOrder);
        if (workOrder) {
            var updatedData = {
                status: 'Approved',
                dateCompleted: new Date().toISOString().split('T')[0],
                approver: 'Current User',
                approverRemarks: approverRemarks,
                approvalDate: new Date().toISOString(),
            };
            // Reset maintenance cycle on the template
            if (workOrder.maintenanceBasis === 'Calendar') {
                var completionDate = new Date();
                var freq = parseInt(workOrder.frequencyValue || '0');
                if (workOrder.frequencyUnit === 'Days') {
                    completionDate.setDate(completionDate.getDate() + freq);
                }
                else if (workOrder.frequencyUnit === 'Weeks') {
                    completionDate.setDate(completionDate.getDate() + freq * 7);
                }
                else if (workOrder.frequencyUnit === 'Months') {
                    completionDate.setMonth(completionDate.getMonth() + freq);
                }
                else if (workOrder.frequencyUnit === 'Years') {
                    completionDate.setFullYear(completionDate.getFullYear() + freq);
                }
                updatedData.nextDueDate = completionDate.toISOString().split('T')[0];
            }
            else if (workOrder.maintenanceBasis === 'Running Hours' &&
                workOrder.currentReading) {
                updatedData.nextDueReading = (parseInt(workOrder.currentReading) +
                    parseInt(workOrder.frequencyValue || '0')).toString();
            }
            updateWorkOrderMutation.mutate({
                id: workOrder.id,
                data: updatedData,
            });
        }
    };
    var handleReject = function (workOrderOrId, rejectionComments) {
        console.log('🎯 handleReject called with:', {
            workOrderOrId: workOrderOrId,
            rejectionComments: rejectionComments,
        });
        // Handle both cases: work order object from AG Grid context or string ID
        var workOrder;
        if (typeof workOrderOrId === 'string') {
            workOrder = workOrdersList.find(function (wo) { return wo.executionId === workOrderOrId || wo.id === workOrderOrId; });
        }
        else {
            workOrder = workOrderOrId; // It's already the work order object
        }
        console.log('🔍 Found workOrder:', workOrder);
        if (workOrder) {
            updateWorkOrderMutation.mutate({
                id: workOrder.id,
                data: {
                    status: 'Rejected',
                    approver: 'Current User',
                    approverRemarks: rejectionComments,
                    rejectionDate: new Date().toISOString(),
                },
            });
        }
    };
    var handlePostponeConfirm = function (workOrderId, postponeData) {
        var workOrder = workOrdersList.find(function (wo) { return wo.id === workOrderId; });
        if (workOrder) {
            updateWorkOrderMutation.mutate({
                id: workOrderId,
                data: {
                    status: 'Postponed',
                    dueDate: postponeData.nextDueDate || workOrder.dueDate,
                },
            });
        }
    };
    var handleAddWorkOrderClick = function () {
        var newWorkOrder = {
            id: "new-".concat(Date.now()),
            component: '',
            componentCode: '',
            workOrderNo: '',
            templateCode: '',
            jobTitle: '',
            assignedTo: '',
            dueDate: '',
            status: 'Draft',
        };
        setSelectedWorkOrder(newWorkOrder);
        setWorkOrderFormOpen(true);
    };
    // Show loading state
    if (isLoading) {
        return (<div className='flex flex-col h-full items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading work orders from database...</p>
        </div>
      </div>);
    }
    return (<div className='flex flex-col h-full'>
      {/* Header with Status Tabs */}
      <div className='bg-white border-b border-gray-200'>
        <div className='flex items-center justify-between p-4'>
          <h1 className='text-xl font-semibold text-gray-900'>
            Work Orders (W.O)
          </h1>
          <div className='flex gap-2'>
            <Button size='sm' className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white' onClick={handleAddWorkOrderClick}>
              <Plus className='h-4 w-4 mr-1'/>
              Add W.O
            </Button>
            <Button size='sm' className='bg-green-600 hover:bg-green-700 text-white' onClick={function () { return setUnplannedWorkOrderFormOpen(true); }}>
              <Plus className='h-4 w-4 mr-1'/>
              Unplanned W.O
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className='flex items-center gap-1 px-4 pb-2'>
          {tabs.map(function (tab) { return (<button key={tab.id} onClick={function () { return setActiveTab(tab.id); }} className={"px-3 py-1.5 rounded text-sm font-medium transition-colors ".concat(activeTab === tab.id
                ? 'bg-[#52baf3] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300')}>
              {tab.label}
              {tab.count > 0 && (<span className='ml-2 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs'>
                  {tab.count}
                </span>)}
            </button>); })}
        </div>
      </div>

      {/* Filters */}
      <div className='flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200'>
        <Select value={selectedVessel} onValueChange={setSelectedVessel}>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Vessel'/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='vessel1'>Vessel 1</SelectItem>
            <SelectItem value='vessel2'>Vessel 2</SelectItem>
          </SelectContent>
        </Select>

        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400'/>
          <Input placeholder='Search Work Orders...' value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className='pl-10'/>
        </div>

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className='w-24'>
            <SelectValue placeholder='Period'/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='weekly'>Weekly</SelectItem>
            <SelectItem value='monthly'>Monthly</SelectItem>
            <SelectItem value='annual'>Annual</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRank} onValueChange={setSelectedRank}>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='All Ranks'/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='chief'>Chief Engineer</SelectItem>
            <SelectItem value='2nd'>2nd Engineer</SelectItem>
            <SelectItem value='3rd'>3rd Engineer</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedComponent} onValueChange={setSelectedComponent}>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Component'/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='engine'>Main Engine</SelectItem>
            <SelectItem value='generator'>Diesel Generator</SelectItem>
            <SelectItem value='pump'>Pumps</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCriticality} onValueChange={setSelectedCriticality}>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Criticality'/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='critical'>Critical</SelectItem>
            <SelectItem value='non-critical'>Non-Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Orders Table */}
      <div className='flex-1 bg-white'>
        <AgGridTable rowData={filteredWorkOrders} columnDefs={columnDefs} onGridReady={onGridReady} context={gridContext} height='calc(100vh - 320px)' enableExport={true} enableSideBar={true} enableStatusBar={true} pagination={true} paginationPageSize={50} animateRows={true} suppressRowClickSelection={true} className='rounded-lg shadow-sm'/>
      </div>

      {/* Footer */}
      <div className='p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600'>
        Page 0 of 0
      </div>

      {/* Postpone Work Order Dialog */}
      <PostponeWorkOrderDialog isOpen={postponeDialogOpen} onClose={function () { return setPostponeDialogOpen(false); }} workOrder={selectedWorkOrder} onConfirm={handlePostponeConfirm}/>

      {/* Work Order Form */}
      <WorkOrderForm isOpen={workOrderFormOpen} onClose={function () { return setWorkOrderFormOpen(false); }} onSubmit={handleWorkOrderSubmit} onApprove={handleApprove} onReject={handleReject} workOrder={selectedWorkOrder} isApprovalMode={activeTab === 'Pending Approval' &&
            (selectedWorkOrder === null || selectedWorkOrder === void 0 ? void 0 : selectedWorkOrder.status) === 'Pending Approval'}/>

      {/* Unplanned Work Order Form */}
      <UnplannedWorkOrderForm isOpen={unplannedWorkOrderFormOpen} onClose={function () { return setUnplannedWorkOrderFormOpen(false); }}/>

      {/* Modify Mode Sticky Footer */}
      {isModifyMode && (<ModifyStickyFooter isVisible={true} hasChanges={Object.keys(fieldChanges).length > 0} changedFieldsCount={Object.keys(fieldChanges).length} onCancel={function () {
                window.location.href = '/pms/modify';
            }} onSubmitChangeRequest={function () {
                // Submit change request logic will be implemented
                console.log('Submitting changes:', fieldChanges);
            }}/>)}
    </div>);
};
export default WorkOrders;
//# sourceMappingURL=WorkOrders.jsx.map