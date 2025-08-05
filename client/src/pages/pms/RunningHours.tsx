import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, FileSpreadsheet, X, Calendar } from "lucide-react";

interface RunningHoursData {
  id: string;
  component: string;
  eqptCategory: string;
  runningHours: string;
  lastUpdated: string;
  nextService: string;
  tracking: 'green' | 'yellow' | 'red';
}

const RunningHours = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vesselFilter, setVesselFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [criticalityFilter, setCriticalityFilter] = useState("");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<RunningHoursData | null>(null);
  const [updateForm, setUpdateForm] = useState({
    oldValue: "",
    newValue: "",
    dateUpdated: "",
    comments: ""
  });
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState<{[key: string]: string}>({});
  const [bulkUpdateErrors, setBulkUpdateErrors] = useState<{[key: string]: string}>({});

  const [runningHoursData, setRunningHoursData] = useState<RunningHoursData[]>([
    {
      id: "1",
      component: "Radar System",
      eqptCategory: "Navigation System",
      runningHours: "18,560 hrs",
      lastUpdated: "02-Jun-2025",
      nextService: "436 hrs",
      tracking: "yellow"
    },
    {
      id: "2", 
      component: "Diesel Generator # 1",
      eqptCategory: "Electrical System",
      runningHours: "15,670 hrs",
      lastUpdated: "09-Jun-2025",
      nextService: "257 hrs",
      tracking: "green"
    },
    {
      id: "3",
      component: "Diesel Generator # 2", 
      eqptCategory: "Electrical System",
      runningHours: "14,980 hrs",
      lastUpdated: "16-Jun-2025",
      nextService: "150 hrs",
      tracking: "green"
    },
    {
      id: "4",
      component: "Main Cooling Seawater Pump",
      eqptCategory: "Cooling System", 
      runningHours: "12,800 hrs",
      lastUpdated: "23-Jun-2025",
      nextService: "200 hrs",
      tracking: "green"
    },
    {
      id: "5",
      component: "Main Engine",
      eqptCategory: "Propulsion System",
      runningHours: "12,580 hrs", 
      lastUpdated: "30-Jun-2025",
      nextService: "0 hrs",
      tracking: "red"
    },
    {
      id: "6",
      component: "Propeller System",
      eqptCategory: "Propulsion System",
      runningHours: "12,580 hrs",
      lastUpdated: "02-Jun-2025", 
      nextService: "257 hrs",
      tracking: "yellow"
    },
    {
      id: "7",
      component: "Main Lubrication Oil Pump",
      eqptCategory: "Lubrication System",
      runningHours: "12,450 hrs",
      lastUpdated: "09-Jun-2025",
      nextService: "436 hrs", 
      tracking: "green"
    },
    {
      id: "8",
      component: "Steering Gear",
      eqptCategory: "Navigation System",
      runningHours: "11,240 hrs",
      lastUpdated: "19-Jun-2025",
      nextService: "> 120 hrs",
      tracking: "red"
    },
    {
      id: "9", 
      component: "Main Air Compressor",
      eqptCategory: "Air System",
      runningHours: "10,840 hrs",
      lastUpdated: "25-Jun-2025",
      nextService: "560 hrs",
      tracking: "green"
    },
    {
      id: "10",
      component: "Bow Thruster",
      eqptCategory: "Propulsion System", 
      runningHours: "10,450 hrs",
      lastUpdated: "30-Jun-2025",
      nextService: "300 hrs",
      tracking: "yellow"
    }
  ]);

  const getTrackingColor = (tracking: string) => {
    switch (tracking) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setVesselFilter("");
    setCategoryFilter("");
    setCriticalityFilter("");
  };

  const openUpdateDialog = (component: RunningHoursData) => {
    setSelectedComponent(component);
    setUpdateForm({
      oldValue: component.runningHours.replace(" hrs", ""),
      newValue: "",
      dateUpdated: "",
      comments: ""
    });
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateFormChange = (field: string, value: string) => {
    setUpdateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveUpdate = () => {
    // Handle save logic here
    console.log("Saving update:", updateForm);
    setIsUpdateDialogOpen(false);
  };

  const handleCancelUpdate = () => {
    setIsUpdateDialogOpen(false);
    setSelectedComponent(null);
    setUpdateForm({
      oldValue: "",
      newValue: "",
      dateUpdated: "",
      comments: ""
    });
  };

  const openBulkUpdate = () => {
    setBulkUpdateData({});
    setBulkUpdateErrors({});
    setIsBulkUpdateOpen(true);
  };

  const handleBulkUpdateChange = (componentId: string, value: string) => {
    setBulkUpdateData(prev => ({
      ...prev,
      [componentId]: value
    }));
    // Clear error when user starts typing
    if (bulkUpdateErrors[componentId]) {
      setBulkUpdateErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[componentId];
        return newErrors;
      });
    }
  };

  const handleBulkSave = () => {
    const errors: {[key: string]: string} = {};
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric'
    });

    // Update components that have new values
    const updatedData = runningHoursData.map(component => {
      const newValue = bulkUpdateData[component.id];
      if (newValue && newValue.trim() !== "") {
        // Validate numeric input
        if (isNaN(Number(newValue.replace(/,/g, '')))) {
          errors[component.id] = "Please enter a valid number";
          return component;
        }
        
        // Update the component
        return {
          ...component,
          runningHours: `${Number(newValue).toLocaleString()} hrs`,
          lastUpdated: today,
          // Simple logic for next service and tracking - you can modify as needed
          nextService: "Updated",
          tracking: 'green' as const
        };
      }
      return component;
    });

    if (Object.keys(errors).length > 0) {
      setBulkUpdateErrors(errors);
      return;
    }

    setRunningHoursData(updatedData);
    setIsBulkUpdateOpen(false);
    setBulkUpdateData({});
    setBulkUpdateErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Running Hours</h1>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white ml-[228px] mr-[228px]"
          onClick={openBulkUpdate}
        >
          <span className="mr-2">+</span>
          Bulk Update RH
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={vesselFilter} onValueChange={setVesselFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Vessel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vessel1">Vessel 1</SelectItem>
            <SelectItem value="vessel2">Vessel 2</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search Component"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Due/ Overdue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="due">Due</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="navigation">Navigation System</SelectItem>
            <SelectItem value="electrical">Electrical System</SelectItem>
            <SelectItem value="propulsion">Propulsion System</SelectItem>
          </SelectContent>
        </Select>

        <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Criticality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
        </Button>

        <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
          Clear
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#52baf3] text-white px-4 py-3">
          <div className="grid grid-cols-7 gap-4 text-sm font-medium">
            <div>Component</div>
            <div>Eqpt. Category</div>
            <div>Running Hours</div>
            <div>last Updated</div>
            <div>Next Service</div>
            <div>Tracking</div>
            <div>Update RH</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {runningHoursData.map((item) => (
            <div key={item.id} className="px-4 py-3 hover:bg-gray-50">
              <div className="grid grid-cols-7 gap-4 text-sm items-center">
                <div className="text-gray-900">{item.component}</div>
                <div className="text-gray-700">{item.eqptCategory}</div>
                <div className="text-gray-900 font-medium">{item.runningHours}</div>
                <div className="text-gray-700">{item.lastUpdated}</div>
                <div className="text-gray-700">{item.nextService}</div>
                <div className="flex items-center">
                  <div className={`h-4 w-24 rounded-full ${getTrackingColor(item.tracking)}`}></div>
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => openUpdateDialog(item)}
                  >
                    <span className="text-gray-600">⚙</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end text-sm text-gray-500">
        Page 6 of 6
      </div>

      {/* Update Running Hours Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#52baf3] border-b border-[#52baf3] pb-2">
              Update Running Hours - {selectedComponent?.component}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Old Value</Label>
                <Input 
                  value={updateForm.oldValue}
                  readOnly
                  className="mt-1 bg-gray-100"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">New Value</Label>
                <Input 
                  value={updateForm.newValue}
                  onChange={(e) => handleUpdateFormChange('newValue', e.target.value)}
                  className="mt-1"
                  placeholder="20000"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-600">Date Updated</Label>
              <div className="relative mt-1">
                <Input 
                  type="date"
                  value={updateForm.dateUpdated}
                  onChange={(e) => handleUpdateFormChange('dateUpdated', e.target.value)}
                  className="pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Comments</Label>
              <Textarea 
                value={updateForm.comments}
                onChange={(e) => handleUpdateFormChange('comments', e.target.value)}
                className="mt-1 resize-none"
                rows={3}
                placeholder="Comments"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancelUpdate}>
              Cancel
            </Button>
            <Button 
              className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white" 
              onClick={handleSaveUpdate}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Update Dialog */}
      <Dialog open={isBulkUpdateOpen} onOpenChange={setIsBulkUpdateOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-[#52baf3] text-xl">
                Bulk Update Running Hours
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsBulkUpdateOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Table Header */}
              <div className="bg-[#52baf3] text-white px-4 py-3">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium">
                  <div>Component Name</div>
                  <div>Previous Running Hours</div>
                  <div>Present Running Hours</div>
                  <div>Status</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {runningHoursData.map((item) => (
                  <div key={item.id} className="px-4 py-3">
                    <div className="grid grid-cols-4 gap-4 text-sm items-center">
                      <div className="text-gray-900 font-medium">{item.component}</div>
                      <div className="text-gray-700">{item.runningHours}</div>
                      <div className="space-y-1">
                        <Input 
                          type="number"
                          value={bulkUpdateData[item.id] || ""}
                          onChange={(e) => handleBulkUpdateChange(item.id, e.target.value)}
                          placeholder="Enter new value"
                          className="w-full"
                        />
                        {bulkUpdateErrors[item.id] && (
                          <div className="text-red-500 text-xs">
                            {bulkUpdateErrors[item.id]}
                          </div>
                        )}
                      </div>
                      <div className="text-gray-500">
                        {bulkUpdateData[item.id] && bulkUpdateData[item.id].trim() !== "" ? "Ready to update" : "No change"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsBulkUpdateOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white" 
              onClick={handleBulkSave}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RunningHours;