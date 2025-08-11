import React, { useState } from "react";
import { Search, Plus, Pen, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PostponeWorkOrderDialog from "@/components/PostponeWorkOrderDialog";
import WorkOrderForm from "@/components/WorkOrderForm";
import UnplannedWorkOrderForm from "@/components/UnplannedWorkOrderForm";

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
const generateTemplateCode = (componentCode: string, taskType: string, basis: string, frequency: string, unit?: string) => {
  const taskCodes: Record<string, string> = {
    "Inspection": "INS",
    "Overhaul": "OH",
    "Service": "SRV",
    "Testing": "TST"
  };
  
  let freqTag = "";
  if (basis === "Calendar" && frequency && unit) {
    const unitCode = unit[0].toUpperCase();
    freqTag = `${unitCode}${frequency}`;
  } else if (basis === "Running Hours" && frequency) {
    freqTag = `RH${frequency}`;
  }
  
  const taskCode = taskCodes[taskType] || "";
  return `WO-${componentCode}-${taskCode}${freqTag}`.toUpperCase();
};

const initialWorkOrders: WorkOrder[] = [
  {
    id: "1",
    component: "Main Engine",
    componentCode: "6.1.1",
    templateCode: "WO-6.1.1-OHM6",
    workOrderNo: "WO-2025-03",
    jobTitle: "Main Engine Overhaul - Replace Main Bearings",
    assignedTo: "Chief Engineer",
    dueDate: "02-Jun-2025",
    status: "Completed",
    dateCompleted: "02-Jun-2025",
    taskType: "Overhaul",
    maintenanceBasis: "Calendar",
    frequencyValue: "6",
    frequencyUnit: "Months"
  },
  {
    id: "2",
    component: "Diesel Generator 1",
    componentCode: "6.2.1",
    templateCode: "WO-6.2.1-SRVM3",
    workOrderNo: "WO-2025-17",
    jobTitle: "DG1 - Replace Fuel Injectors",
    assignedTo: "2nd Engineer",
    dueDate: "05-Jun-2025",
    status: "Due (Grace P)",
    taskType: "Service",
    maintenanceBasis: "Calendar",
    frequencyValue: "3",
    frequencyUnit: "Months"
  },
  {
    id: "3",
    component: "Steering Gear",
    componentCode: "1.5.1",
    templateCode: "WO-1.5.1-INSM3",
    workOrderNo: "WO-2025-54",
    jobTitle: "Steering Gear - 3 Monthly XXX",
    assignedTo: "2nd Engineer",
    dueDate: "16-Jun-2025",
    status: "Due",
    taskType: "Inspection",
    maintenanceBasis: "Calendar",
    frequencyValue: "3",
    frequencyUnit: "Months"
  },
  {
    id: "4",
    component: "Main Cooling Seawater Pump",
    componentCode: "7.1.2.1",
    templateCode: "WO-7.1.2.1-SRVRH2000",
    workOrderNo: "WO-2025-19",
    jobTitle: "MCSP - Replace Mechanical Seal",
    assignedTo: "3rd Engineer",
    dueDate: "23-Jun-2025",
    status: "Due",
    taskType: "Service",
    maintenanceBasis: "Running Hours",
    frequencyValue: "2000",
    frequencyUnit: ""
  },
  {
    id: "5",
    component: "Main Air Compressor",
    componentCode: "7.4.1",
    templateCode: "WO-7.4.1-OHRH1000",
    workOrderNo: "WO-2025-03",
    jobTitle: "Main Air Compressor - Work Order XXX",
    assignedTo: "3rd Engineer",
    dueDate: "30-Jun-2025",
    status: "Completed",
    dateCompleted: "30-Jun-2025",
    taskType: "Overhaul",
    maintenanceBasis: "Running Hours",
    frequencyValue: "1000",
    frequencyUnit: ""
  },
    {
      id: "6",
      component: "Mooring Winch Forward",
      componentCode: "3.3.1",
      templateCode: "WO-3.3.1-INSM6",
      workOrderNo: "WO-2025-17",
      jobTitle: "Mooring Winch Forward - Work Order XXX",
      assignedTo: "2nd Engineer",
      dueDate: "02-Jun-2025",
      status: "Overdue",
      taskType: "Inspection",
      maintenanceBasis: "Calendar",
      frequencyValue: "6",
      frequencyUnit: "Months"
    },
    {
      id: "7",
      component: "Bow Thruster",
      componentCode: "5.2.1",
      templateCode: "WO-5.2.1-OHY1",
      workOrderNo: "WO-2025-54",
      jobTitle: "Bow Thruster - Work Order XXX",
      assignedTo: "Chief Engineer",
      dueDate: "09-Jun-2025",
      status: "Postponed",
      taskType: "Overhaul",
      maintenanceBasis: "Calendar",
      frequencyValue: "1",
      frequencyUnit: "Years"
    },
    {
      id: "8",
      component: "Fire Pump",
      componentCode: "8.1.2",
      templateCode: "WO-8.1.2-TSTM1",
      workOrderNo: "WO-2025-13",
      jobTitle: "Fire Pump - Work Order XXX",
      assignedTo: "2nd Engineer",
      dueDate: "16-Jun-2025",
      status: "Completed",
      dateCompleted: "16-Jun-2025",
      taskType: "Testing",
      maintenanceBasis: "Calendar",
      frequencyValue: "1",
      frequencyUnit: "Months"
    },
    {
      id: "9",
      component: "Main Engine",
      componentCode: "6.1.1",
      templateCode: "WO-6.1.1-SRVRH3000",
      workOrderNo: "WO-2025-03",
      jobTitle: "Main Engine - Replace Piston Rings (#3 Unit)",
      assignedTo: "Chief Engineer",
      dueDate: "23-Jun-2025",
      status: "Due",
      taskType: "Service",
      maintenanceBasis: "Running Hours",
      frequencyValue: "3000",
      frequencyUnit: ""
    },
    {
      id: "10",
      component: "Diesel Generator 1",
      componentCode: "6.2.1",
      templateCode: "WO-6.2.1-INSRH500",
      workOrderNo: "WO-2025-17",
      jobTitle: "Diesel Generator 1 - Work Order XXX",
      assignedTo: "2nd Engineer",
      dueDate: "30-Jun-2025",
      status: "Completed",
      dateCompleted: "30-Jun-2025",
      taskType: "Inspection",
      maintenanceBasis: "Running Hours",
      frequencyValue: "500",
      frequencyUnit: ""
    },
    {
      id: "11",
      component: "Steering Gear",
      componentCode: "1.5.1",
      templateCode: "WO-1.5.1-OHY2",
      workOrderNo: "WO-2025-54",
      jobTitle: "Steering Gear - Work Order XXX",
      assignedTo: "2nd Engineer",
      dueDate: "02-Jun-2025",
      status: "Overdue",
      taskType: "Overhaul",
      maintenanceBasis: "Calendar",
      frequencyValue: "2",
      frequencyUnit: "Years"
    },
    {
      id: "12",
      component: "Main Cooling Seawater Pump",
      componentCode: "7.1.2.1",
      templateCode: "WO-7.1.2.1-INSRH1000",
      workOrderNo: "WO-2025-19",
      jobTitle: "Main Cooling Seawater Pump - Work Order XXX",
      assignedTo: "3rd Engineer",
      dueDate: "09-Aug-2025",
      status: "Due",
      taskType: "Inspection",
      maintenanceBasis: "Running Hours",
      frequencyValue: "1000",
      frequencyUnit: ""
    },
    // Sample execution with Pending Approval status
    {
      id: "exec-001",
      executionId: "2025-WO-1.1.1.1.11-INSM3-01",
      templateCode: "WO-1.1.1.1.11-INSM3",
      component: "Fresh Water Pump #1",
      componentCode: "1.1.1.1.11",
      workOrderNo: "2025-WO-1.1.1.1.11-INSM3-01",
      jobTitle: "Pump Inspection Execution",
      assignedTo: "2nd Engineer",
      dueDate: "2025-01-15",
      submittedDate: "2025-01-10",
      status: "Pending Approval",
      isExecution: true,
      taskType: "Inspection",
      maintenanceBasis: "Calendar",
      frequencyValue: "3",
      frequencyUnit: "Months"
    },
    {
      id: "exec-002",
      executionId: "2025-WO-1.1.1.1.13-SRVW4-01",
      templateCode: "WO-1.1.1.1.13-SRVW4",
      component: "Fresh Water Pump #2",
      componentCode: "1.1.1.1.13",
      workOrderNo: "2025-WO-1.1.1.1.13-SRVW4-01",
      jobTitle: "Weekly Service Execution",
      assignedTo: "3rd Engineer",
      dueDate: "2025-01-12",
      submittedDate: "2025-01-08",
      status: "Pending Approval",
      isExecution: true,
      taskType: "Service",
      maintenanceBasis: "Calendar",
      frequencyValue: "4",
      frequencyUnit: "Weeks"
    }
];

const WorkOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVessel, setSelectedVessel] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedRank, setSelectedRank] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [selectedCriticality, setSelectedCriticality] = useState("");
  const [activeTab, setActiveTab] = useState("All W.O");
  const [postponeDialogOpen, setPostponeDialogOpen] = useState(false);
  const [workOrderFormOpen, setWorkOrderFormOpen] = useState(false);
  const [unplannedWorkOrderFormOpen, setUnplannedWorkOrderFormOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  
  // Backfill templateCode for existing work orders if missing
  const backfilledWorkOrders = initialWorkOrders.map(wo => {
    if (!wo.templateCode && wo.componentCode && wo.taskType) {
      const templateCode = generateTemplateCode(
        wo.componentCode,
        wo.taskType,
        wo.maintenanceBasis || "Calendar",
        wo.frequencyValue || "",
        wo.frequencyUnit
      );
      return { ...wo, templateCode };
    }
    return wo;
  });
  
  const [workOrdersList, setWorkOrdersList] = useState<WorkOrder[]>(backfilledWorkOrders);

  const handleWorkOrderSubmit = (workOrderId: string, formData?: any) => {
    if (formData?.type === 'execution') {
      // Generate execution ID
      const year = new Date().getFullYear();
      const templateCode = formData.data.templateCode || formData.data.woTemplateCode;
      
      // Find existing executions for this template to get the next sequence number
      const existingExecutions = workOrdersList.filter(wo => 
        wo.isExecution && wo.templateId === workOrderId && 
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
        dueDate: formData.data.dueDate || "",
        status: "Pending Approval",
        submittedDate: new Date().toISOString().split('T')[0],
        formData: formData.data,
        isExecution: true,
        templateId: workOrderId
      };
      
      setWorkOrdersList(prev => [...prev, executionRecord]);
      setActiveTab("Pending Approval");
    } else if (formData?.type === 'template') {
      // Update template
      setWorkOrdersList(prev => 
        prev.map(wo => 
          wo.id === workOrderId 
            ? { 
                ...wo, 
                ...formData.data,
                templateCode: formData.data.woTemplateCode || formData.data.templateCode || wo.templateCode
              }
            : wo
        )
      );
    }
  };

  const tabs = [
    { id: "All W.O", label: "All W.O", count: workOrdersList.filter(wo => !wo.isExecution).length },
    { id: "Due", label: "Due", count: workOrdersList.filter(wo => !wo.isExecution && (wo.status === "Due" || wo.status.includes("Grace"))).length },
    { id: "Pending Approval", label: "Pending Approval", count: workOrdersList.filter(wo => wo.isExecution && wo.status === "Pending Approval").length },
    { id: "Overdue", label: "Overdue", count: workOrdersList.filter(wo => !wo.isExecution && wo.status === "Overdue").length },
    { id: "Completed", label: "Completed", count: workOrdersList.filter(wo => (!wo.isExecution && wo.status === "Completed") || (wo.isExecution && wo.status === "Approved")).length }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "due":
        return "bg-yellow-100 text-yellow-800";
      case "due (grace p)":
        return "bg-orange-100 text-orange-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "postponed":
        return "bg-blue-100 text-blue-800";
      case "pending approval":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredWorkOrders = workOrdersList.filter(wo => {
    if (activeTab === "All W.O") {
      // Show templates and rejected executions
      if (wo.isExecution && wo.status !== "Rejected") return false;
    } else if (activeTab === "Due") {
      if (wo.isExecution) return false;
      if (wo.status !== "Due" && !wo.status.includes("Grace")) return false;
    } else if (activeTab === "Overdue") {
      if (wo.isExecution) return false;
      if (wo.status !== "Overdue") return false;
    } else if (activeTab === "Completed") {
      // Show both completed templates and approved executions
      if (!wo.isExecution && wo.status !== "Completed") return false;
      if (wo.isExecution && wo.status !== "Approved") return false;
    } else if (activeTab === "Pending Approval") {
      // Show only execution records with Pending Approval status
      if (!wo.isExecution || wo.status !== "Pending Approval") return false;
    }
    
    if (searchTerm && !wo.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !wo.workOrderNo.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(wo.templateCode && wo.templateCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !(wo.executionId && wo.executionId.toLowerCase().includes(searchTerm.toLowerCase()))) {
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
    setWorkOrderFormOpen(true);
  };

  const handlePencilClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setWorkOrderFormOpen(true);
  };

  const handleTimerClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setPostponeDialogOpen(true);
  };

  const handleApprove = (workOrderId: string, approverRemarks?: string) => {
    setWorkOrdersList(prev => 
      prev.map(wo => {
        if (wo.executionId === workOrderId || wo.id === workOrderId) {
          // Update execution status to Approved
          const updatedWO = { 
            ...wo, 
            status: "Approved",
            dateCompleted: new Date().toISOString().split('T')[0],
            approver: "Current User", // Replace with actual user
            approverRemarks,
            approvalDate: new Date().toISOString()
          };

          // Reset maintenance cycle on the template
          if (wo.maintenanceBasis === "Calendar") {
            const completionDate = new Date();
            const freq = parseInt(wo.frequencyValue || "0");
            if (wo.frequencyUnit === "Days") {
              completionDate.setDate(completionDate.getDate() + freq);
            } else if (wo.frequencyUnit === "Weeks") {
              completionDate.setDate(completionDate.getDate() + (freq * 7));
            } else if (wo.frequencyUnit === "Months") {
              completionDate.setMonth(completionDate.getMonth() + freq);
            } else if (wo.frequencyUnit === "Years") {
              completionDate.setFullYear(completionDate.getFullYear() + freq);
            }
            updatedWO.nextDueDate = completionDate.toISOString().split('T')[0];
          } else if (wo.maintenanceBasis === "Running Hours" && wo.currentReading) {
            updatedWO.nextDueReading = (parseInt(wo.currentReading) + parseInt(wo.frequencyValue || "0")).toString();
          }

          return updatedWO;
        }
        return wo;
      })
    );
  };

  const handleReject = (workOrderId: string, rejectionComments: string) => {
    setWorkOrdersList(prev => 
      prev.map(wo => {
        if (wo.executionId === workOrderId || wo.id === workOrderId) {
          return { 
            ...wo, 
            status: "Rejected",
            approver: "Current User", // Replace with actual user
            approverRemarks: rejectionComments,
            rejectionDate: new Date().toISOString()
          };
        }
        return wo;
      })
    );
  };

  const handlePostponeConfirm = (workOrderId: string, postponeData: any) => {
    setWorkOrdersList(prev => 
      prev.map(wo => 
        wo.id === workOrderId 
          ? { 
              ...wo, 
              status: "Postponed",
              dueDate: postponeData.nextDueDate || wo.dueDate
            }
          : wo
      )
    );
  };

  const handleAddWorkOrderClick = () => {
    const newWorkOrder: WorkOrder = {
      id: `new-${Date.now()}`,
      component: "",
      componentCode: "",
      workOrderNo: "",
      templateCode: "",
      jobTitle: "",
      assignedTo: "",
      dueDate: "",
      status: "Draft"
    };
    setSelectedWorkOrder(newWorkOrder);
    setWorkOrderFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Status Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-gray-900">Work Orders (W.O)</h1>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white"
              onClick={handleAddWorkOrderClick}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add W.O
            </Button>
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setUnplannedWorkOrderFormOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Unplanned W.O
            </Button>
          </div>
        </div>
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1 px-4 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#52baf3] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
        <Select value={selectedVessel} onValueChange={setSelectedVessel}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Vessel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vessel1">Vessel 1</SelectItem>
            <SelectItem value="vessel2">Vessel 2</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Work Orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRank} onValueChange={setSelectedRank}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Ranks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chief">Chief Engineer</SelectItem>
            <SelectItem value="2nd">2nd Engineer</SelectItem>
            <SelectItem value="3rd">3rd Engineer</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedComponent} onValueChange={setSelectedComponent}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Component" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="engine">Main Engine</SelectItem>
            <SelectItem value="generator">Diesel Generator</SelectItem>
            <SelectItem value="pump">Pumps</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCriticality} onValueChange={setSelectedCriticality}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Criticality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="non-critical">Non-Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Orders Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#52baf3] text-white sticky top-0">
            <tr>
              <th className="text-left py-3 px-4 font-medium">Component</th>
              <th className="text-left py-3 px-4 font-medium">
                {activeTab === "Pending Approval" ? "WO Execution ID" : "Work Order No"}
              </th>
              {activeTab === "Pending Approval" && (
                <th className="text-left py-3 px-4 font-medium">WO Template Code</th>
              )}
              <th className="text-left py-3 px-4 font-medium">Job Title</th>
              <th className="text-left py-3 px-4 font-medium">Assigned to</th>
              <th className="text-left py-3 px-4 font-medium">
                {activeTab === "Pending Approval" ? "Submitted Date" : "Due Date"}
              </th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              {activeTab !== "Pending Approval" && (
                <th className="text-left py-3 px-4 font-medium">Date Completed</th>
              )}
              <th className="text-center py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkOrders.map((workOrder, index) => (
              <tr 
                key={workOrder.id} 
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} cursor-pointer hover:bg-gray-100`}
                onClick={() => handleWorkOrderClick(workOrder)}
              >
                <td className="py-3 px-4 text-gray-900">{workOrder.component}</td>
                <td className="py-3 px-4 text-blue-600 hover:text-blue-800">
                  {activeTab === "Pending Approval" && workOrder.executionId 
                    ? workOrder.executionId 
                    : workOrder.templateCode || workOrder.workOrderNo}
                </td>
                {activeTab === "Pending Approval" && (
                  <td className="py-3 px-4 text-gray-900">{workOrder.templateCode}</td>
                )}
                <td className="py-3 px-4 text-gray-900">{workOrder.jobTitle}</td>
                <td className="py-3 px-4 text-gray-900">{workOrder.assignedTo}</td>
                <td className="py-3 px-4 text-gray-900">
                  {activeTab === "Pending Approval" && workOrder.submittedDate 
                    ? workOrder.submittedDate 
                    : workOrder.dueDate}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(workOrder.status)}`}>
                    {workOrder.status}
                  </span>
                </td>
                {activeTab !== "Pending Approval" && (
                  <td className="py-3 px-4 text-gray-900">{workOrder.dateCompleted || ""}</td>
                )}
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePencilClick(workOrder);
                      }}
                      title="Edit Template"
                    >
                      <Pen className="h-4 w-4 text-gray-600" />
                    </button>
                    <button 
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTimerClick(workOrder);
                      }}
                      title="Postpone Work Order"
                    >
                      <Timer className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
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
        isApprovalMode={activeTab === "Pending Approval" && selectedWorkOrder?.status === "Pending Approval"}
      />

      {/* Unplanned Work Order Form */}
      <UnplannedWorkOrderForm
        isOpen={unplannedWorkOrderFormOpen}
        onClose={() => setUnplannedWorkOrderFormOpen(false)}
      />
    </div>
  );
};

export default WorkOrders;