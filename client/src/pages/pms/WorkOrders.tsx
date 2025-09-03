import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Pen, Timer } from 'lucide-react';
import { useLocation } from 'wouter';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-enterprise';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import AgGridTable from '@/components/common/AgGridTable';
import { 
  StatusCellRenderer, 
  WorkOrderActionsCellRenderer, 
  DateCellRenderer 
} from '@/components/common/AgGridCellRenderers';
import PostponeWorkOrderDialog from '@/components/PostponeWorkOrderDialog';
import WorkOrderForm from '@/components/WorkOrderForm';
import UnplannedWorkOrderForm from '@/components/UnplannedWorkOrderForm';
import { useModifyMode } from '@/hooks/useModifyMode';
import { ModifyFieldWrapper } from '@/components/modify/ModifyFieldWrapper';
import { ModifyStickyFooter } from '@/components/modify/ModifyStickyFooter';

interface WorkOrder {
  id: string;
  component: string;
  componentCode?: string;
  workOrderNo: string;
  templateCode?: string;
  executionId?: string;
  jobTitle: string;
  assignedTo: string;
  dueDate: string;
  status: string;
  dateCompleted?: string;
  submittedDate?: string;
  formData?: any;
  taskType?: string;
  maintenanceBasis?: string;
  frequencyValue?: string;
  frequencyUnit?: string;
  approverRemarks?: string;
  isExecution?: boolean;
  templateId?: string;
  approver?: string;
  approvalDate?: string;
  rejectionDate?: string;
  nextDueDate?: string;
  nextDueReading?: string;
  currentReading?: string;
}

// Helper function to generate template code
const generateTemplateCode = (
  componentCode: string,
  taskType: string,
  basis: string,
  frequency: string,
  unit?: string
) => {
  const taskCodes: Record<string, string> = {
    Inspection: 'INS',
    Overhaul: 'OH',
    Service: 'SRV',
    Testing: 'TST',
  };

  let freqTag = '';
  if (basis === 'Calendar' && frequency && unit) {
    const unitCode = unit[0].toUpperCase();
    freqTag = `${unitCode}${frequency}`;
  } else if (basis === 'Running Hours' && frequency) {
    freqTag = `RH${frequency}`;
  }

  const taskCode = taskCodes[taskType] || '';
  return `WO-${componentCode}-${taskCode}${freqTag}`.toUpperCase();
};

// Sample data for seeding if database is empty
const sampleWorkOrders: WorkOrder[] = [
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

const WorkOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVessel, setSelectedVessel] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [selectedCriticality, setSelectedCriticality] = useState('');
  const [activeTab, setActiveTab] = useState('All W.O');
  const [postponeDialogOpen, setPostponeDialogOpen] = useState(false);
  const [workOrderFormOpen, setWorkOrderFormOpen] = useState(false);
  const [unplannedWorkOrderFormOpen, setUnplannedWorkOrderFormOpen] =
    useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(
    null
  );
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  // Database integration
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const vesselId = 'V001'; // Default vessel

  // Fetch work orders from database
  const { data: workOrdersFromDB = [], isLoading } = useQuery({
    queryKey: ['/api/work-orders', vesselId],
    queryFn: () => fetch(`/api/work-orders/${vesselId}`).then(res => res.json()),
  });

  // Create work order mutation
  const createWorkOrderMutation = useMutation({
    mutationFn: (workOrderData: Omit<WorkOrder, 'createdAt' | 'updatedAt'>) => 
      apiRequest('POST', `/api/work-orders/${vesselId}`, workOrderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/work-orders', vesselId] });
      toast({ title: 'Success', description: 'Work order created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create work order', variant: 'destructive' });
    },
  });

  // Update work order mutation
  const updateWorkOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkOrder> }) => 
      apiRequest('PUT', `/api/work-orders/${vesselId}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/work-orders', vesselId] });
      toast({ title: 'Success', description: 'Work order updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update work order', variant: 'destructive' });
    },
  });

  // Delete work order mutation
  const deleteWorkOrderMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest('DELETE', `/api/work-orders/${vesselId}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/work-orders', vesselId] });
      toast({ title: 'Success', description: 'Work order deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete work order', variant: 'destructive' });
    },
  });

  // Modify mode integration
  const { isModifyMode, targetId, fieldChanges } = useModifyMode();
  const [location] = useLocation();

  // Use database data if available, otherwise fallback to sample data for demo
  const workOrdersToUse = workOrdersFromDB.length > 0 ? workOrdersFromDB : sampleWorkOrders;

  // Backfill templateCode for existing work orders if missing
  const backfilledWorkOrders = workOrdersToUse.map(wo => {
    if (!wo.templateCode && wo.componentCode && wo.taskType) {
      const templateCode = generateTemplateCode(
        wo.componentCode,
        wo.taskType,
        wo.maintenanceBasis || 'Calendar',
        wo.frequencyValue || '',
        wo.frequencyUnit
      );
      return { ...wo, templateCode };
    }
    return wo;
  });

  const workOrdersList = backfilledWorkOrders;

  // Handle preview mode from "View Changes" button
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const previewChanges = urlParams.get('previewChanges');
    const changeRequestId = urlParams.get('changeRequestId');
    const targetType = urlParams.get('targetType');
    const previewTargetId = urlParams.get('targetId');

    // Auto-open work order form if navigating from "View Changes"
    if (
      previewChanges === '1' &&
      targetType === 'workOrder' &&
      previewTargetId
    ) {
      const targetWorkOrder = workOrdersList.find(
        wo => wo.id === previewTargetId
      );
      if (targetWorkOrder) {
        setSelectedWorkOrder(targetWorkOrder);
        setWorkOrderFormOpen(true);
      }
    }
  }, [location, workOrdersList]);

  const handleWorkOrderSubmit = (workOrderId: string, formData?: any) => {
    console.log('🔄 handleWorkOrderSubmit called:', { workOrderId, type: formData?.type, data: formData?.data });
    console.log('🔍 Full formData object:', JSON.stringify(formData, null, 2));
    
    if (formData?.type === 'template_draft') {
      // Save template as draft (Part A)
      console.log('💾 Saving template draft...');
      const workOrder = workOrdersList.find(wo => wo.id === workOrderId);
      if (workOrder) {
        console.log('🔍 About to update existing work order:', workOrderId);
        updateWorkOrderMutation.mutate({
          id: workOrderId,
          data: {
            ...formData.data,
            status: 'Draft',
            templateCode: formData.data.templateCode || formData.data.woTemplateCode || workOrder.templateCode,
            formData: formData.data, // Save the complete form data to the formData column
          }
        }, {
          onSuccess: (data) => {
            console.log('✅ Update successful:', data);
          },
          onError: (error) => {
            console.error('❌ Update failed:', error);
          }
        });
      } else {
        // Create new draft work order
        const newWorkOrder: WorkOrder = {
          id: workOrderId.startsWith('new-') ? `wo-${Date.now()}` : workOrderId,
          component: formData.data.component || '',
          componentCode: formData.data.componentCode || '',
          workOrderNo: formData.data.woTemplateCode || `WO-${Date.now()}`,
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
          onSuccess: (data) => {
            console.log('✅ Create successful:', data);
          },
          onError: (error) => {
            console.error('❌ Create failed:', error);
          }
        });
      }
    } else if (formData?.type === 'execution_draft') {
      // Save execution as draft (Part B in progress)
      console.log('💾 Saving execution draft...');
      const workOrder = workOrdersList.find(wo => wo.id === workOrderId);
      if (workOrder) {
        updateWorkOrderMutation.mutate({
          id: workOrderId,
          data: {
            ...formData.data,
            status: 'In Progress',
            templateCode: formData.data.templateCode || workOrder.templateCode,
            formData: formData.data, // Save the complete form data to the formData column
          }
        });
      }
    } else if (formData?.type === 'execution') {
      // Generate execution ID
      const year = new Date().getFullYear();
      const templateCode =
        formData.data.templateCode || formData.data.woTemplateCode;

      // Find existing executions for this template to get the next sequence number
      const existingExecutions = workOrdersList.filter(
        wo =>
          wo.isExecution &&
          wo.templateId === workOrderId &&
          wo.executionId?.startsWith(`${year}-${templateCode}`)
      );
      const sequence = String(existingExecutions.length + 1).padStart(2, '0');
      const executionId = `${year}-${templateCode}-${sequence}`;

      // Create new execution record
      const executionRecord: WorkOrder = {
        id: `exec-${Date.now()}`,
        component: formData.data.component,
        componentCode: formData.data.componentCode,
        workOrderNo: executionId,
        templateCode: templateCode,
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
    } else if (formData?.type === 'template') {
      // Update template
      const workOrder = workOrdersList.find(wo => wo.id === workOrderId);
      if (workOrder) {
        updateWorkOrderMutation.mutate({
          id: workOrderId,
          data: {
            ...formData.data,
            templateCode:
              formData.data.woTemplateCode ||
              formData.data.templateCode ||
              workOrder.templateCode,
          }
        });
      }
    }
  };

  const tabs = [
    {
      id: 'All W.O',
      label: 'All W.O',
      count: workOrdersList.filter(wo => !wo.isExecution).length,
    },
    {
      id: 'Due',
      label: 'Due',
      count: workOrdersList.filter(
        wo =>
          !wo.isExecution &&
          (wo.status === 'Due' || wo.status.includes('Grace'))
      ).length,
    },
    {
      id: 'Pending Approval',
      label: 'Pending Approval',
      count: workOrdersList.filter(
        wo => wo.isExecution && wo.status === 'Pending Approval'
      ).length,
    },
    {
      id: 'Overdue',
      label: 'Overdue',
      count: workOrdersList.filter(
        wo => !wo.isExecution && wo.status === 'Overdue'
      ).length,
    },
    {
      id: 'Completed',
      label: 'Completed',
      count: workOrdersList.filter(
        wo =>
          (!wo.isExecution && wo.status === 'Completed') ||
          (wo.isExecution && wo.status === 'Approved')
      ).length,
    },
  ];

  const getStatusBadgeColor = (status: string) => {
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
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredWorkOrders = workOrdersList.filter(wo => {
    if (activeTab === 'All W.O') {
      // Show templates and rejected executions
      if (wo.isExecution && wo.status !== 'Rejected') return false;
    } else if (activeTab === 'Due') {
      if (wo.isExecution) return false;
      if (wo.status !== 'Due' && !wo.status.includes('Grace')) return false;
    } else if (activeTab === 'Overdue') {
      if (wo.isExecution) return false;
      if (wo.status !== 'Overdue') return false;
    } else if (activeTab === 'Completed') {
      // Show both completed templates and approved executions
      if (!wo.isExecution && wo.status !== 'Completed') return false;
      if (wo.isExecution && wo.status !== 'Approved') return false;
    } else if (activeTab === 'Pending Approval') {
      // Show only execution records with Pending Approval status
      if (!wo.isExecution || wo.status !== 'Pending Approval') return false;
    }

    if (
      searchTerm &&
      !wo.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !wo.workOrderNo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(
        wo.templateCode &&
        wo.templateCode.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      !(
        wo.executionId &&
        wo.executionId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }

    return true;
  });

  const handlePostponeClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setPostponeDialogOpen(true);
  };

  const handleWorkOrderClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);

    // If in modify mode, activate modify mode for this specific work order
    if (isModifyMode) {
      // The modify mode is already active via URL params
      // Just open the form and it will detect modify mode automatically
      setWorkOrderFormOpen(true);
    } else {
      setWorkOrderFormOpen(true);
    }
  };

  const handlePencilClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setWorkOrderFormOpen(true);
  };

  const handleTimerClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setPostponeDialogOpen(true);
  };

  // AG Grid column definitions
  const columnDefs = useMemo((): ColDef[] => {
    const baseColumns: ColDef[] = [
      {
        headerName: 'Component',
        field: 'component',
        width: 200,
        cellRenderer: (params) => {
          return (
            <span 
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => handleWorkOrderClick(params.data)}
            >
              {params.value}
            </span>
          );
        }
      },
      {
        headerName: activeTab === 'Pending Approval' ? 'WO Execution ID' : 'Work Order No',
        field: activeTab === 'Pending Approval' ? 'executionId' : 'workOrderNo',
        width: 180,
        valueGetter: (params) => {
          if (activeTab === 'Pending Approval' && params.data.executionId) {
            return params.data.executionId;
          }
          return params.data.templateCode || params.data.workOrderNo;
        }
      }
    ];

    // Add template code column for pending approval
    if (activeTab === 'Pending Approval') {
      baseColumns.push({
        headerName: 'WO Template Code',
        field: 'templateCode',
        width: 180
      });
    }

    // Add remaining columns
    baseColumns.push(
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        width: 250
      },
      {
        headerName: 'Assigned to',
        field: 'assignedTo',
        width: 150
      },
      {
        headerName: activeTab === 'Pending Approval' ? 'Submitted Date' : 'Due Date',
        field: activeTab === 'Pending Approval' ? 'submittedDate' : 'dueDate',
        width: 150,
        cellRenderer: DateCellRenderer
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 150,
        cellRenderer: StatusCellRenderer
      }
    );

    // Add date completed column for non-pending approval tabs
    if (activeTab !== 'Pending Approval') {
      baseColumns.push({
        headerName: 'Date Completed',
        field: 'dateCompleted',
        width: 150,
        cellRenderer: DateCellRenderer
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
      pinned: 'right'
    });

    return baseColumns;
  }, [activeTab]);

  // AG Grid context for action handlers
  const gridContext = useMemo(() => ({
    onEdit: handlePencilClick,
    onPostpone: handleTimerClick,
    onApprove: (workOrder: WorkOrder) => {
      handleApprove(workOrder.id || workOrder.executionId || '');
    },
    onReject: (workOrder: WorkOrder) => {
      handleReject(workOrder.id || workOrder.executionId || '', 'Rejected from grid');
    }
  }), []);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const handleApprove = (workOrderId: string, approverRemarks?: string) => {
    const workOrder = workOrdersList.find(wo => wo.executionId === workOrderId || wo.id === workOrderId);
    if (workOrder) {
      const updatedData: Partial<WorkOrder> = {
        status: 'Approved',
        dateCompleted: new Date().toISOString().split('T')[0],
        approver: 'Current User',
        approverRemarks,
        approvalDate: new Date().toISOString(),
      };

      // Reset maintenance cycle on the template
      if (workOrder.maintenanceBasis === 'Calendar') {
        const completionDate = new Date();
        const freq = parseInt(workOrder.frequencyValue || '0');
        if (workOrder.frequencyUnit === 'Days') {
          completionDate.setDate(completionDate.getDate() + freq);
        } else if (workOrder.frequencyUnit === 'Weeks') {
          completionDate.setDate(completionDate.getDate() + freq * 7);
        } else if (workOrder.frequencyUnit === 'Months') {
          completionDate.setMonth(completionDate.getMonth() + freq);
        } else if (workOrder.frequencyUnit === 'Years') {
          completionDate.setFullYear(completionDate.getFullYear() + freq);
        }
        updatedData.nextDueDate = completionDate.toISOString().split('T')[0];
      } else if (
        workOrder.maintenanceBasis === 'Running Hours' &&
        workOrder.currentReading
      ) {
        updatedData.nextDueReading = (
          parseInt(workOrder.currentReading) + parseInt(workOrder.frequencyValue || '0')
        ).toString();
      }

      updateWorkOrderMutation.mutate({
        id: workOrder.id,
        data: updatedData
      });
    }
  };

  const handleReject = (workOrderId: string, rejectionComments: string) => {
    const workOrder = workOrdersList.find(wo => wo.executionId === workOrderId || wo.id === workOrderId);
    if (workOrder) {
      updateWorkOrderMutation.mutate({
        id: workOrder.id,
        data: {
          status: 'Rejected',
          approver: 'Current User',
          approverRemarks: rejectionComments,
          rejectionDate: new Date().toISOString(),
        }
      });
    }
  };

  const handlePostponeConfirm = (workOrderId: string, postponeData: any) => {
    const workOrder = workOrdersList.find(wo => wo.id === workOrderId);
    if (workOrder) {
      updateWorkOrderMutation.mutate({
        id: workOrderId,
        data: {
          status: 'Postponed',
          dueDate: postponeData.nextDueDate || workOrder.dueDate,
        }
      });
    }
  };

  const handleAddWorkOrderClick = () => {
    const newWorkOrder: WorkOrder = {
      id: `new-${Date.now()}`,
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
    return (
      <div className='flex flex-col h-full items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading work orders from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Header with Status Tabs */}
      <div className='bg-white border-b border-gray-200'>
        <div className='flex items-center justify-between p-4'>
          <h1 className='text-xl font-semibold text-gray-900'>
            Work Orders (W.O)
          </h1>
          <div className='flex gap-2'>
            <Button
              size='sm'
              className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
              onClick={handleAddWorkOrderClick}
            >
              <Plus className='h-4 w-4 mr-1' />
              Add W.O
            </Button>
            <Button
              size='sm'
              className='bg-green-600 hover:bg-green-700 text-white'
              onClick={() => setUnplannedWorkOrderFormOpen(true)}
            >
              <Plus className='h-4 w-4 mr-1' />
              Unplanned W.O
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className='flex items-center gap-1 px-4 pb-2'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#52baf3] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className='ml-2 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs'>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className='flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200'>
        <Select value={selectedVessel} onValueChange={setSelectedVessel}>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Vessel' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='vessel1'>Vessel 1</SelectItem>
            <SelectItem value='vessel2'>Vessel 2</SelectItem>
          </SelectContent>
        </Select>

        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search Work Orders...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className='w-24'>
            <SelectValue placeholder='Period' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='weekly'>Weekly</SelectItem>
            <SelectItem value='monthly'>Monthly</SelectItem>
            <SelectItem value='annual'>Annual</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRank} onValueChange={setSelectedRank}>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='All Ranks' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='chief'>Chief Engineer</SelectItem>
            <SelectItem value='2nd'>2nd Engineer</SelectItem>
            <SelectItem value='3rd'>3rd Engineer</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedComponent} onValueChange={setSelectedComponent}>
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Component' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='engine'>Main Engine</SelectItem>
            <SelectItem value='generator'>Diesel Generator</SelectItem>
            <SelectItem value='pump'>Pumps</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedCriticality}
          onValueChange={setSelectedCriticality}
        >
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Criticality' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='critical'>Critical</SelectItem>
            <SelectItem value='non-critical'>Non-Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Orders Table */}
      <div className='flex-1 bg-white'>
        <AgGridTable
          rowData={filteredWorkOrders}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          context={gridContext}
          height="calc(100vh - 320px)"
          enableExport={true}
          enableSideBar={true}
          enableStatusBar={true}
          pagination={true}
          paginationPageSize={50}
          animateRows={true}
          suppressRowClickSelection={true}
          className="rounded-lg shadow-sm"
        />
      </div>

      {/* Footer */}
      <div className='p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600'>
        Page 0 of 0
      </div>

      {/* Postpone Work Order Dialog */}
      <PostponeWorkOrderDialog
        isOpen={postponeDialogOpen}
        onClose={() => setPostponeDialogOpen(false)}
        workOrder={selectedWorkOrder}
        onConfirm={handlePostponeConfirm}
      />

      {/* Work Order Form */}
      <WorkOrderForm
        isOpen={workOrderFormOpen}
        onClose={() => setWorkOrderFormOpen(false)}
        onSubmit={handleWorkOrderSubmit}
        onApprove={handleApprove}
        onReject={handleReject}
        workOrder={selectedWorkOrder}
        isApprovalMode={
          activeTab === 'Pending Approval' &&
          selectedWorkOrder?.status === 'Pending Approval'
        }
      />

      {/* Unplanned Work Order Form */}
      <UnplannedWorkOrderForm
        isOpen={unplannedWorkOrderFormOpen}
        onClose={() => setUnplannedWorkOrderFormOpen(false)}
      />

      {/* Modify Mode Sticky Footer */}
      {isModifyMode && (
        <ModifyStickyFooter
          isVisible={true}
          hasChanges={Object.keys(fieldChanges).length > 0}
          changedFieldsCount={Object.keys(fieldChanges).length}
          onCancel={() => {
            window.location.href = '/pms/modify';
          }}
          onSubmitChangeRequest={() => {
            // Submit change request logic will be implemented
            console.log('Submitting changes:', fieldChanges);
          }}
        />
      )}
    </div>
  );
};

export default WorkOrders;
