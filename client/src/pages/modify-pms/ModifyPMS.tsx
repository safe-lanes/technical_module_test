import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface ChangeRequest {
  id: number;
  requestTitle: string;
  requestedBy: string;
  date: string;
  status: "Pending Approval" | "Approved" | "Rejected";
  category: "Components" | "Work orders" | "Spares" | "Stores";
}

const changeRequests: ChangeRequest[] = [
  {
    id: 1,
    requestTitle: "Modify Main Engine Maintenance Schedule",
    requestedBy: "Chief Engineer",
    date: "2025-05-20",
    status: "Pending Approval",
    category: "Components"
  },
  {
    id: 2,
    requestTitle: "Update Steering System Component Details",
    requestedBy: "2nd Engineer",
    date: "2025-05-18",
    status: "Approved",
    category: "Work orders"
  },
  {
    id: 3,
    requestTitle: "Request Special Tool for Aux Engine",
    requestedBy: "3rd Engineer",
    date: "2025-05-10",
    status: "Rejected",
    category: "Spares"
  }
];

const categories = [
  { id: 1, name: "Components" },
  { id: 2, name: "Work orders" },
  { id: 3, name: "Spares" },
  { id: 4, name: "Stores" }
];

const ModifyPMS: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState("");

  const filteredRequests = changeRequests.filter(request => {
    const matchesCategory = !selectedCategory || request.category === selectedCategory;
    const matchesSearch = !searchStatus || request.status.toLowerCase().includes(searchStatus.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Approval":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Modify PMS - Change Requests</h1>
        
        {/* Search and New Request Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search Status"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="w-full"
            />
          </div>
          <Button className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white ml-4">
            <Plus className="h-4 w-4 mr-2" />
            New Change Request
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar - Categories */}
        <div className="w-64">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-[#52baf3] text-white px-4 py-3 rounded-t-lg font-semibold">
              Category
            </div>
            <div className="p-0">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    selectedCategory === category.name ? 'bg-blue-50 border-l-4 border-l-[#52baf3]' : ''
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                >
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">{category.id}.</span>
                    <span className="text-sm text-gray-800">{category.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Change Requests Table */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Table Header */}
            <div className="bg-[#52baf3] text-white px-6 py-4 rounded-t-lg">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium">
                <div>Request Title</div>
                <div>Requested By</div>
                <div>Date</div>
                <div>Status</div>
                <div></div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div key={request.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-5 gap-4 items-center text-sm">
                    <div className="text-gray-900 font-medium">
                      {request.requestTitle}
                    </div>
                    <div className="text-gray-700">
                      {request.requestedBy}
                    </div>
                    <div className="text-gray-700">
                      {request.date}
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="text-right">
                      {/* Action buttons can be added here later */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500 rounded-b-lg">
              0 to 0 of 0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyPMS;