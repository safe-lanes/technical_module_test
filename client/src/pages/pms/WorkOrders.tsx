import React, { useState } from "react";
import { Search, Plus, Pen, Clock } from "lucide-react";
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

interface WorkOrder {
  id: string;
  component: string;
  workOrderNo: string;
  jobTitle: string;
  assignedTo: string;
  dueDate: string;
  status: string;
  dateCompleted?: string;
}

const initialWorkOrders: WorkOrder[] = [
  {
    id: "1",
    component: "Main Engine",
    workOrderNo: "WO-2025-03",
    jobTitle: "Main Engine Overhaul - Replace Main Bearings",
    assignedTo: "Chief Engineer",
    dueDate: "02-Jun-2025",
    status: "Completed",
    dateCompleted: "02-Jun-2025"
  },
  {
    id: "2",
    component: "Diesel Generator 1",
    workOrderNo: "WO-2025-17",
    jobTitle: "DG1 - Replace Fuel Injectors",
    assignedTo: "2nd Engineer",
    dueDate: "05-Jun-2025",
    status: "Due (Grace P)"
  },
  {
    id: "3",
    component: "Steering Gear",
    workOrderNo: "WO-2025-54",
    jobTitle: "Steering Gear - 3 Monthly XXX",
    assignedTo: "2nd Engineer",
    dueDate: "16-Jun-2025",
    status: "Due"
  },
  {
    id: "4",
    component: "Main Cooling Seawater Pump",
    workOrderNo: "WO-2025-19",
    jobTitle: "MCSP - Replace Mechanical Seal",
    assignedTo: "3rd Engineer",
    dueDate: "23-Jun-2025",
    status: "Due"
  },
  {
    id: "5",
    component: "Main Air Compressor",
    workOrderNo: "WO-2025-03",
    jobTitle: "Main Air Compressor - Work Order XXX",
    assignedTo: "3rd Engineer",
    dueDate: "30-Jun-2025",
    status: "Completed",
    dateCompleted: "30-Jun-2025"
  },
    {
      id: "6",
      component: "Mooring Winch Forward",
      workOrderNo: "WO-2025-17",
      jobTitle: "Mooring Winch Forward - Work Order XXX",
      assignedTo: "2nd Engineer",
      dueDate: "02-Jun-2025",
      status: "Overdue"
    },
    {
      id: "7",
      component: "Bow Thruster",
      workOrderNo: "WO-2025-54",
      jobTitle: "Bow Thruster - Work Order XXX",
      assignedTo: "Chief Engineer",
      dueDate: "09-Jun-2025",
      status: "Postponed"
    },
    {
      id: "8",
      component: "Fire Pump",
      workOrderNo: "WO-2025-13",
      jobTitle: "Fire Pump - Work Order XXX",
      assignedTo: "2nd Engineer",
      dueDate: "16-Jun-2025",
      status: "Completed",
      dateCompleted: "16-Jun-2025"
    },
    {
      id: "9",
      component: "Main Engine",
      workOrderNo: "WO-2025-03",
      jobTitle: "Main Engine - Replace Piston Rings (#3 Unit)",
      assignedTo: "Chief Engineer",
      dueDate: "23-Jun-2025",
      status: "Due"
    },
    {
      id: "10",
      component: "Diesel Generator 1",
      workOrderNo: "WO-2025-17",
      jobTitle: "Diesel Generator 1 - Work Order XXX",
      assignedTo: "2nd Engineer",
      dueDate: "30-Jun-2025",
      status: "Completed",
      dateCompleted: "30-Jun-2025"
    },
    {
      id: "11",
      component: "Steering Gear",
      workOrderNo: "WO-2025-54",
      jobTitle: "Steering Gear - Work Order XXX",
      assignedTo: "2nd Engineer",
      dueDate: "02-Jun-2025",
      status: "Overdue"
    },
    {
      id: "12",
      component: "Main Cooling Seawater Pump",
      workOrderNo: "WO-2025-19",
      jobTitle: "Main Cooling Seawater Pump - Work Order XXX",
      assignedTo: "3rd Engineer",
      dueDate: "09-Aug-2025",
      status: "Due"
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
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [workOrdersList, setWorkOrdersList] = useState<WorkOrder[]>(initialWorkOrders);

  const handleWorkOrderSubmit = (workOrderId: string, formData?: any) => {
    setWorkOrdersList(prev => 
      prev.map(wo => 
        wo.id === workOrderId 
          ? { 
              ...wo, 
              status: "Pending Approval",
              ...(formData && {
                jobTitle: formData.jobTitle || wo.jobTitle,
                component: formData.component || wo.component,
                assignedTo: formData.assignedTo || wo.assignedTo
              })
            }
          : wo
      )
    );
    setActiveTab("Pending Approval");
  };

  const tabs = [
    { id: "All W.O", label: "All W.O", count: workOrdersList.length },
    { id: "Due", label: "Due", count: workOrdersList.filter(wo => wo.status === "Due").length },
    { id: "Pending Approval", label: "Pending Approval", count: workOrdersList.filter(wo => wo.status === "Pending Approval").length },
    { id: "Overdue", label: "Overdue", count: workOrdersList.filter(wo => wo.status === "Overdue").length },
    { id: "Completed", label: "Completed", count: workOrdersList.filter(wo => wo.status === "Completed").length }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredWorkOrders = workOrdersList.filter(wo => {
    if (activeTab !== "All W.O") {
      if (activeTab === "Due" && wo.status !== "Due") return false;
      if (activeTab === "Overdue" && wo.status !== "Overdue") return false;
      if (activeTab === "Completed" && wo.status !== "Completed") return false;
      if (activeTab === "Pending Approval" && wo.status !== "Pending Approval") return false;
    }
    
    if (searchTerm && !wo.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !wo.workOrderNo.toLowerCase().includes(searchTerm.toLowerCase())) {
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

  return (
    <div className="flex flex-col h-full">
      {/* Header with Status Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-gray-900">Work Orders (W.O)</h1>
          <div className="flex gap-2">
            <Button size="sm" className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white">
              <Plus className="h-4 w-4 mr-1" />
              Add W.O
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
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
              <th className="text-left py-3 px-4 font-medium">Work Order No</th>
              <th className="text-left py-3 px-4 font-medium">Job Title</th>
              <th className="text-left py-3 px-4 font-medium">Assigned to</th>
              <th className="text-left py-3 px-4 font-medium">Due Date</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Date Completed</th>
              <th className="text-center py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkOrders.map((workOrder, index) => (
              <tr key={workOrder.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-3 px-4 text-gray-900">{workOrder.component}</td>
                <td 
                  className="py-3 px-4 text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => handleWorkOrderClick(workOrder)}
                >
                  {workOrder.workOrderNo}
                </td>
                <td className="py-3 px-4 text-gray-900">{workOrder.jobTitle}</td>
                <td className="py-3 px-4 text-gray-900">{workOrder.assignedTo}</td>
                <td className="py-3 px-4 text-gray-900">{workOrder.dueDate}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(workOrder.status)}`}>
                    {workOrder.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-900">{workOrder.dateCompleted || ""}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Pen className="h-4 w-4 text-gray-600" />
                    </button>
                    <button 
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={() => handlePostponeClick(workOrder)}
                    >
                      <Clock className="h-4 w-4 text-gray-600" />
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
      />

      {/* Work Order Form */}
      <WorkOrderForm
        isOpen={workOrderFormOpen}
        onClose={() => setWorkOrderFormOpen(false)}
        onSubmit={handleWorkOrderSubmit}
        workOrder={selectedWorkOrder}
      />
    </div>
  );
};

export default WorkOrders;