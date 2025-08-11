import React, { useState } from "react";
import { Search, ChevronRight, ChevronDown, Edit2, FileText, ArrowLeft, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComponentRegisterForm from "@/components/ComponentRegisterForm";
import WorkOrderForm from "@/components/WorkOrderForm";
import { useChangeRequest } from "@/contexts/ChangeRequestContext";
import { useLocation } from "wouter";
import { getComponentCategory } from "@/utils/componentUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ComponentNode {
  id: string;
  code: string;
  name: string;
  children?: ComponentNode[];
  isExpanded?: boolean;
}

const dummyComponents: ComponentNode[] = [
  {
    id: "1",
    code: "1",
    name: "Ship General",
    children: [
      {
        id: "1.1",
        code: "1.1",
        name: "Fresh Water System",
        children: [
          {
            id: "1.1.1",
            code: "1.1.1",
            name: "Hydrophore Unit",
            children: [
              {
                id: "1.1.1.1",
                code: "1.1.1.1",
                name: "Pressure Vessel"
              },
              {
                id: "1.1.1.2",
                code: "1.1.1.2",
                name: "Feed Pump"
              },
              {
                id: "1.1.1.3",
                code: "1.1.1.3",
                name: "Pressure Switch"
              }
            ]
          },
          {
            id: "1.1.2",
            code: "1.1.2",
            name: "Potable Water Maker",
            children: []
          },
          {
            id: "1.1.3",
            code: "1.1.3",
            name: "UV Sterilizer",
            children: []
          }
        ]
      },
      {
        id: "1.2",
        code: "1.2",
        name: "Sewage Treatment System",
        children: []
      },
      {
        id: "1.3",
        code: "1.3",
        name: "HVAC – Accommodation",
        children: []
      }
    ]
  },
  {
    id: "2", 
    code: "2",
    name: "Hull",
    children: [
      {
        id: "2.1",
        code: "2.1",
        name: "Ballast Tanks",
        children: []
      },
      {
        id: "2.2",
        code: "2.2",
        name: "Cathodic Protection",
        children: []
      },
      {
        id: "2.3",
        code: "2.3",
        name: "Hull Openings – Hatches",
        children: []
      }
    ]
  },
  {
    id: "3",
    code: "3", 
    name: "Equipment for Cargo",
    children: [
      {
        id: "3.1",
        code: "3.1",
        name: "Cargo Cranes",
        children: []
      },
      {
        id: "3.2",
        code: "3.2",
        name: "Hatch Cover Hydraulics",
        children: []
      },
      {
        id: "3.3",
        code: "3.3",
        name: "Cargo Hold Ventilation",
        children: []
      }
    ]
  },
  {
    id: "4",
    code: "4",
    name: "Ship's Equipment",
    children: [
      {
        id: "4.1",
        code: "4.1",
        name: "Mooring System",
        children: []
      },
      {
        id: "4.2",
        code: "4.2",
        name: "Windlass",
        children: []
      },
      {
        id: "4.3",
        code: "4.3",
        name: "Steering Gear",
        children: []
      }
    ]
  },
  {
    id: "5",
    code: "5",
    name: "Equipment for Crew & Passengers",
    children: [
      {
        id: "5.1",
        code: "5.1",
        name: "Lifeboat System",
        children: []
      },
      {
        id: "5.2",
        code: "5.2",
        name: "Fire Main System",
        children: []
      },
      {
        id: "5.3",
        code: "5.3",
        name: "Emergency Lighting",
        children: []
      }
    ]
  },
  {
    id: "6",
    code: "6",
    name: "Machinery Main Components",
    isExpanded: true,
    children: [
      {
        id: "6.1",
        code: "6.1",
        name: "Main Engine",
        isExpanded: true,
        children: [
          {
            id: "6.1.1",
            code: "6.1.1",
            name: "Cylinder Head",
            isExpanded: true,
            children: [
              {
                id: "6.1.1.1",
                code: "6.1.1.1",
                name: "Valve Seats"
              },
              {
                id: "6.1.1.2",
                code: "6.1.1.2",
                name: "Injector Sleeve"
              },
              {
                id: "6.1.1.3",
                code: "6.1.1.3",
                name: "Rocker Arm"
              }
            ]
          },
          {
            id: "6.1.2",
            code: "6.1.2",
            name: "Main Bearings",
            children: []
          },
          {
            id: "6.1.3",
            code: "6.1.3",
            name: "Cylinder Liners",
            children: []
          }
        ]
      },
      {
        id: "6.2",
        code: "6.2",
        name: "Diesel Generators",
        children: [
          {
            id: "6.2.1",
            code: "6.2.1",
            name: "DG #1",
            children: []
          },
          {
            id: "6.2.2",
            code: "6.2.2",
            name: "DG #2",
            children: []
          },
          {
            id: "6.2.3",
            code: "6.2.3",
            name: "DG #3",
            children: []
          }
        ]
      },
      {
        id: "6.3",
        code: "6.3",
        name: "Auxiliary Boiler",
        children: []
      }
    ]
  },
  {
    id: "7",
    code: "7",
    name: "Systems for Machinery Main Components",
    children: [
      {
        id: "7.1",
        code: "7.1",
        name: "Fuel Oil System",
        children: []
      }
    ]
  },
  {
    id: "8",
    code: "8",
    name: "Ship Common Systems",
    children: []
  }
];

const ComponentInformationSection: React.FC<{ isExpanded: boolean; selectedComponent: ComponentNode | null }> = ({ isExpanded, selectedComponent }) => {
  const { isChangeRequestMode } = useChangeRequest();

  // Derive Component Category from the component's tree position
  const componentCategory = selectedComponent ? getComponentCategory(selectedComponent.id) : '';

  // Component data - uses selected component code or defaults
  const componentData = {
    maker: "MAN Energy Solutions",
    model: "6S60MC-C",
    serialNo: "12345",
    department: "Engine",
    componentCategory: componentCategory, // Derived from tree
    componentCode: selectedComponent?.code || "6.1.1",  // Use selected component's code
    critical: "Yes",
    classItem: "Yes",
    location: "Engine Room",
    commissionedDate: "2020-02-01",
    installationDate: "2020-01-15",
    rating: "7,200 kW",
    conditionBased: "Yes",
    noOfUnits: "1",
    eqptSystemDept: "Engine Department",
    parentComponent: "Main Engine Block",
    dimensionsSize: "15m x 3m x 4m",
    notes: "Primary propulsion engine - critical for vessel operations"
  };

  return (
    <div className="space-y-4">
      {/* Always visible first 2 rows */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>Maker</label>
          <div className="text-sm text-gray-900">
            {componentData.maker}
          </div>
        </div>
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>Model</label>
          <div className="text-sm text-gray-900">
            {componentData.model}
          </div>
        </div>
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>Serial No</label>
          <div className="text-sm text-gray-900">
            {componentData.serialNo}
          </div>
        </div>
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>Department</label>
          <div className="text-sm text-gray-900">
            {componentData.department}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>Component Code</label>
          <div className="text-sm text-gray-900">
            {componentData.componentCode}
          </div>
        </div>
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>Component Category</label>
          <div className="text-sm text-gray-900">
            {componentData.componentCategory}
          </div>
        </div>
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>Critical</label>
          <div className="text-sm text-gray-900">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              componentData.critical === "Yes" 
                ? "bg-red-100 text-red-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {componentData.critical}
            </span>
          </div>
        </div>
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>Class Item</label>
          <div className="text-sm text-gray-900">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              componentData.classItem === "Yes" 
                ? "bg-blue-100 text-blue-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {componentData.classItem}
            </span>
          </div>
        </div>
      </div>
      
      {/* Third row */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>Location</label>
          <div className="text-sm text-gray-900">
            {componentData.location}
          </div>
        </div>
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>Commissioned Date</label>
          <div className="text-sm text-gray-900">
            {componentData.commissionedDate}
          </div>
        </div>
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>&nbsp;</label>
          <div className="text-sm text-gray-900">
            &nbsp;
          </div>
        </div>
        <div>
          <label className={`text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1`}>&nbsp;</label>
          <div className="text-sm text-gray-900">
            &nbsp;
          </div>
        </div>
      </div>

      {/* Additional details - only visible when expanded */}
      {isExpanded && (
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Installation Date</label>
              <div className="text-sm text-gray-900">
                {componentData.installationDate}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Commissioned Date</label>
              <div className="text-sm text-gray-900">
                {componentData.commissionedDate}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Rating</label>
              <div className="text-sm text-gray-900">
                {componentData.rating}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Condition Based</label>
              <div className="text-sm text-gray-900">
                {componentData.conditionBased}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">No of Units</label>
              <div className="text-sm text-gray-900">
                {componentData.noOfUnits}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Eqpt. System / Dept.</label>
              <div className="text-sm text-gray-900">
                {componentData.eqptSystemDept}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Parent Component</label>
              <div className="text-sm text-gray-900">
                {componentData.parentComponent}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Dimensions / Size</label>
              <div className="text-sm text-gray-900">
                {componentData.dimensionsSize}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Notes</label>
            <div className="text-sm text-gray-900">
              {componentData.notes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RunningHoursConditionSection: React.FC = () => {
  const { isChangeRequestMode } = useChangeRequest();
  
  return (
    <div className="space-y-6">
      {/* Running Hours */}
      <div className="flex items-start gap-8">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Running Hours:</label>
          <Edit2 className="h-4 w-4 text-gray-500" />
        </div>
        <div className="flex gap-12">
          <div>
            <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Current</label>
            <div className="text-sm font-semibold text-gray-900">12580 hours</div>
          </div>
          <div>
            <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Updated</label>
            <div className="text-sm font-semibold text-gray-900">12-Jun-2025</div>
          </div>
        </div>
      </div>

      {/* Condition Monitoring Metrics */}
      <div>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">Condition Monitoring Metrics:</label>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {/* Vibration */}
          <div>
            <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-2">Vibration</label>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
          
          {/* Temperature */}
          <div>
            <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-2">Temperature</label>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          
          {/* Pressure */}
          <div>
            <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-2">Pressure</label>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkOrdersSection: React.FC<{ componentCode: string; componentName: string }> = ({ componentCode, componentName }) => {
  const [isWorkOrderFormOpen, setIsWorkOrderFormOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  
  // Generate template code for existing data
  const generateTemplateCode = (componentCode: string, taskType: string, basis: string, frequency: number, unit?: string) => {
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
  
  const workOrders = [
    {
      templateCode: generateTemplateCode(componentCode, "Overhaul", "Calendar", 6, "Months"),
      jobTitle: "Main Engine Overhaul - Replace Main Bearings",
      assignedTo: "Chief Engineer",
      dueDate: "02-Jun-2025",
      status: "Due",
      dateCompleted: "",
      // Store template data for editing
      taskType: "Overhaul",
      maintenanceBasis: "Calendar",
      frequencyValue: "6",
      frequencyUnit: "Months"
    },
    {
      templateCode: generateTemplateCode(componentCode, "Overhaul", "Calendar", 6, "Months"),
      jobTitle: "Main Engine Overhaul - Replace Main Bearings",
      assignedTo: "Chief Engineer",
      dueDate: "02-Jun-2025",
      status: "Due (Grace P)",
      dateCompleted: "",
      taskType: "Overhaul",
      maintenanceBasis: "Calendar",
      frequencyValue: "6",
      frequencyUnit: "Months"
    }
  ];

  const handleAddWorkOrder = () => {
    setSelectedWorkOrder(null);
    setIsWorkOrderFormOpen(true);
  };

  const handleRowClick = (workOrder: any) => {
    setSelectedWorkOrder(workOrder);
    setIsWorkOrderFormOpen(true);
  };

  const handleWorkOrderSubmit = (formData: any) => {
    console.log('Work Order submitted:', formData);
    // Handle saving the work order
    setIsWorkOrderFormOpen(false);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-end mb-3">
          <Button
            onClick={handleAddWorkOrder}
            size="sm"
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add WO
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 font-medium text-[#8798ad]">W.O No.</th>
              <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Job Title</th>
              <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Assigned to</th>
              <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Due Date</th>
              <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Status</th>
              <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Date Completed</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map((order, index) => (
              <tr 
                key={index} 
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(order)}
              >
                <td className="py-3 px-3 text-gray-900">{order.templateCode}</td>
                <td className="py-3 px-3 text-gray-900">{order.jobTitle}</td>
                <td className="py-3 px-3 text-gray-900">{order.assignedTo}</td>
                <td className="py-3 px-3 text-gray-900">{order.dueDate}</td>
                <td className="py-3 px-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "Due" 
                      ? "bg-yellow-100 text-yellow-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-gray-900">{order.dateCompleted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Work Order Form Dialog */}
      <WorkOrderForm
        isOpen={isWorkOrderFormOpen}
        onClose={() => setIsWorkOrderFormOpen(false)}
        onSubmit={handleWorkOrderSubmit}
        component={{ code: componentCode, name: componentName }}
        workOrderTemplate={selectedWorkOrder}
        mode="template"
      />
    </>
  );
};

const MaintenanceHistorySection: React.FC = () => {
  const maintenanceHistory = [
    {
      title: "Main Engine Overhaul - Replace Main bearings",
      workOrderNo: "WO-2025-001",
      assignedTo: "2nd Eng",
      status: "Completed",
      dateCompleted: "02-Jun-2025"
    },
    {
      title: "Main Engine - Replace Piston Rings",
      workOrderNo: "WO-2024-013",
      assignedTo: "2nd Eng",
      status: "Completed",
      dateCompleted: "02-Feb-2025"
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Title</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Work Order No</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Assigned to</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Status</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Date Completed</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceHistory.map((record, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-3 px-3 text-gray-900">{record.title}</td>
              <td className="py-3 px-3 text-gray-900">{record.workOrderNo}</td>
              <td className="py-3 px-3 text-gray-900">{record.assignedTo}</td>
              <td className="py-3 px-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {record.status}
                </span>
              </td>
              <td className="py-3 px-3 text-gray-900">{record.dateCompleted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SparesSection: React.FC = () => {
  const spares = [
    {
      partCode: "SP-ME-001",
      partName: "Fuel Injector",
      critical: "Critical",
      rob: "2",
      min: "1",
      stock: "OK",
      location: "Store Room A"
    },
    {
      partCode: "SP-ME-002",
      partName: "Cylinder Head Gasket",
      critical: "",
      rob: "2",
      min: "1",
      stock: "OK",
      location: "Store Room B"
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Part Code</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Part Name</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Critical</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">ROB</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Min</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Stock</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Location</th>
          </tr>
        </thead>
        <tbody>
          {spares.map((spare, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-3 px-3 text-gray-900">{spare.partCode}</td>
              <td className="py-3 px-3 text-gray-900">{spare.partName}</td>
              <td className="py-3 px-3">
                {spare.critical && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                    {spare.critical}
                  </span>
                )}
              </td>
              <td className="py-3 px-3 text-gray-900">{spare.rob}</td>
              <td className="py-3 px-3 text-gray-900">{spare.min}</td>
              <td className="py-3 px-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {spare.stock}
                </span>
              </td>
              <td className="py-3 px-3 text-gray-900">{spare.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DrawingsAndManualsSection: React.FC = () => {
  const documents = [
    { name: "Equipment Drawing", icon: FileText },
    { name: "Installation Guide", icon: FileText },
    { name: "Maintenance Manual", icon: FileText },
    { name: "Trouble shooting Guide", icon: FileText }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {documents.map((doc, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-md"
        >
          <doc.icon className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-700">{doc.name}</span>
        </div>
      ))}
    </div>
  );
};

const ClassificationRegulatorySection: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* First row */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Classification Society</label>
          <div className="text-sm text-gray-900">DNV</div>
        </div>
        <div>
          <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Certificate No.</label>
          <div className="text-sm text-gray-900">CERT-ME-2025-01</div>
        </div>
        <div>
          <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Last Class Survey</label>
          <div className="text-sm text-gray-900">15-Mar-2023</div>
        </div>
        <div>
          <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Next Class Survey</label>
          <div className="text-sm text-gray-900">15-Mar-2025</div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Survey Type</label>
          <div className="text-sm text-gray-900">Annual</div>
        </div>
        <div>
          <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Class Requirements</label>
          <div className="text-sm text-gray-900">SOLAS, MARPOL, MLC</div>
        </div>
        <div>
          <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Class Code</label>
          <div className="text-sm text-gray-900">DNV-ME-001</div>
        </div>
        <div>
          <label className="text-xs font-medium ${isChangeRequestMode ? 'text-white' : 'text-[#8798ad]'} block mb-1">Information</label>
          <div className="text-sm text-gray-900">Details</div>
        </div>
      </div>
    </div>
  );
};

const RequisitionsSection: React.FC = () => {
  const requisitions = [
    {
      reqId: "RQ-ME-001",
      reqDate: "15-May-2025",
      titleDescription: "Main Engine Cylinder Head Gasket - Urgent Replacement",
      requestedDate: "20-May-2025",
      status: "Approved",
      remarks: "High priority - main engine showing compression loss"
    },
    {
      reqId: "RQ-ME-002",
      reqDate: "10-May-2025",
      titleDescription: "Fuel Injection Pump Service Kit",
      requestedDate: "25-May-2025",
      status: "Ordered",
      remarks: "Preventive maintenance - scheduled overhaul"
    },
    {
      reqId: "RQ-ME-003",
      reqDate: "08-May-2025",
      titleDescription: "Turbocharger Bearing Set",
      requestedDate: "30-May-2025",
      status: "Open",
      remarks: "Vibration monitoring shows wear indication"
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Req. ID</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Req. Date</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Title / Description</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Requested Date</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Status</th>
            <th className="text-left py-2 px-3 font-medium text-[#8798ad]">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {requisitions.map((req, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-3 px-3 text-gray-900">{req.reqId}</td>
              <td className="py-3 px-3 text-gray-900">{req.reqDate}</td>
              <td className="py-3 px-3 text-gray-900">{req.titleDescription}</td>
              <td className="py-3 px-3 text-gray-900">{req.requestedDate}</td>
              <td className="py-3 px-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  req.status === "Approved" ? "bg-green-100 text-green-800" :
                  req.status === "Ordered" ? "bg-blue-100 text-blue-800" :
                  req.status === "Open" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {req.status}
                </span>
              </td>
              <td className="py-3 px-3 text-gray-900">{req.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Components: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<ComponentNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["6", "6.1", "6.1.1"]));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isComponentFormOpen, setIsComponentFormOpen] = useState(false);
  
  const { isChangeRequestMode, exitChangeRequestMode } = useChangeRequest();
  const [, setLocation] = useLocation();

  const handleBackToModifyPMS = () => {
    exitChangeRequestMode();
    setLocation("/modify-pms");
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const renderComponentTree = (nodes: ComponentNode[], level: number = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedComponent?.id === node.id;

      return (
        <div key={node.id}>
          <div
            className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
              isSelected ? "bg-blue-50" : ""
            }`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => setSelectedComponent(node)}
          >
            <button
              className="mr-2 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                if (hasChildren) {
                  toggleNode(node.id);
                }
              }}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <span className="text-sm text-gray-700">
              {node.code} {node.name}
            </span>
          </div>
          {hasChildren && isExpanded && (
            <div>{renderComponentTree(node.children!, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  const formSections = [
    { id: "A", title: "Component Information" },
    { id: "B", title: "Running Hours & Condition Monitoring" },
    { id: "C", title: "Work Orders" },
    { id: "D", title: "Maintenance History" },
    { id: "E", title: "Spares" },
    { id: "F", title: "Drawings & Manuals" },
    { id: "G", title: "Classification & Regulatory Data" },
    { id: "H", title: "Requisitions" }
  ];

  return (
    <div className={`h-full p-6 ${isChangeRequestMode ? 'bg-[#52baf3]' : 'bg-[#fafafa]'}`}>
      {/* Header with SubModule Title */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {isChangeRequestMode && (
              <Button
                variant="ghost"
                onClick={handleBackToModifyPMS}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Modify PMS
              </Button>
            )}
            <h1 className={`text-2xl font-semibold ${isChangeRequestMode ? 'text-white' : 'text-gray-800'}`}>
              Components {isChangeRequestMode && '- Change Request Mode'}
            </h1>
          </div>
          {!isChangeRequestMode && (
            <Button 
              className="bg-[#52baf3] hover:bg-[#40a8e0] text-white"
              onClick={() => setIsComponentFormOpen(true)}
            >
              + Add / Edit Component
            </Button>
          )}
        </div>
        
        {/* Filters Row */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isChangeRequestMode ? 'text-white' : 'text-gray-600'}`}>Vessel:</span>
            <Select defaultValue="all">
              <SelectTrigger className={`w-[150px] ${isChangeRequestMode ? 'border-white bg-white/10 text-white' : ''}`}>
                <SelectValue placeholder="Select vessel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vessels</SelectItem>
                <SelectItem value="vessel1">Vessel 1</SelectItem>
                <SelectItem value="vessel2">Vessel 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isChangeRequestMode ? 'text-white' : 'text-gray-600'}`}>Critical Item:</span>
            <Select defaultValue="all">
              <SelectTrigger className={`w-[140px] ${isChangeRequestMode ? 'border-white bg-white/10 text-white' : ''}`}>
                <SelectValue placeholder="All Items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="critical">Critical Only</SelectItem>
                <SelectItem value="non-critical">Non-Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Search Components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`max-w-md ${isChangeRequestMode ? 'border-white bg-white/10 text-white placeholder:text-white/70' : ''}`}
            />
          </div>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Left Panel - Component Tree (30%) */}
        <div className="w-[30%]">
          <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <div className="bg-[#52baf3] text-white px-4 py-2 font-semibold text-sm">
                COMPONENTS
              </div>
              <div>
                {renderComponentTree(dummyComponents)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Component Details Form (70%) */}
        <div className="w-[70%]">
          {selectedComponent ? (
            <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
              <div className="p-4 border-b-2 border-[#52baf3] flex-shrink-0">
                <h3 className="text-lg font-semibold text-[#15569e]">
                  {selectedComponent.code} {selectedComponent.name}
                </h3>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-2">
                  {formSections.map((section) => {
                    const isExpanded = expandedSections.has(section.id);
                    
                    return (
                      <Card key={section.id} className="rounded-sm border border-gray-200">
                        <CardHeader 
                          className="py-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleSection(section.id)}
                        >
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-[#16569e]">
                              {section.id}. {section.title}
                            </CardTitle>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4 border-t border-gray-100">
                          {section.id === "A" ? (
                            <ComponentInformationSection isExpanded={isExpanded} selectedComponent={selectedComponent} />
                          ) : section.id === "B" ? (
                            <RunningHoursConditionSection />
                          ) : section.id === "C" ? (
                            <WorkOrdersSection 
                              componentCode={selectedComponent?.code || ""} 
                              componentName={selectedComponent?.name || ""} 
                            />
                          ) : section.id === "D" ? (
                            <MaintenanceHistorySection />
                          ) : section.id === "E" ? (
                            <SparesSection />
                          ) : section.id === "F" ? (
                            <DrawingsAndManualsSection />
                          ) : section.id === "G" ? (
                            <ClassificationRegulatorySection />
                          ) : section.id === "H" ? (
                            <RequisitionsSection />
                          ) : (
                            <p className="text-sm text-gray-500">
                              {section.title} content will be added here
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm h-full flex items-center justify-center">
              <p className="text-gray-500">Select a component to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Component Register Form */}
      <ComponentRegisterForm 
        isOpen={isComponentFormOpen}
        onClose={() => setIsComponentFormOpen(false)}
        onSubmit={(componentData) => {
          console.log('Component data submitted:', componentData);
          // Handle component submission here
        }}
      />
    </div>
  );
};

export default Components;