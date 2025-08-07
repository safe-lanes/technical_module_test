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
}

const changeRequests: ChangeRequest[] = [
  {
    id: 1,
    requestTitle: "Modify Main Engine Maintenance Schedule",
    requestedBy: "Chief Engineer",
    date: "2025-05-20",
    status: "Pending Approval"
  },
  {
    id: 2,
    requestTitle: "Update Steering System Component Details",
    requestedBy: "2nd Engineer",
    date: "2025-05-18",
    status: "Approved"
  },
  {
    id: 3,
    requestTitle: "Request Special Tool for Aux Engine",
    requestedBy: "3rd Engineer",
    date: "2025-05-10",
    status: "Rejected"
  }
];

const pmsCategories = [
  { id: 1, name: "Components" },
  { id: 2, name: "Work orders" },
  { id: 3, name: "Spares" },
  { id: 4, name: "Stores" }
];

const ModifyPMS: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchStatus, setSearchStatus] = useState("");

  const getStatusBadge = (status: string) => {
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

  const filteredRequests = changeRequests.filter(request =>
    !searchStatus || request.status.toLowerCase().includes(searchStatus.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Modify PMS - Change Requests
        </h1>
        <Button 
          className="bg-[#52baf3] hover:bg-blue-600 text-white"
          onClick={() => {/* Will implement later */}}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Change Request
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Left Panel - Categories */}
        <div className="w-[25%]">
          <div className="bg-white rounded-lg shadow-sm h-full">
            <div className="bg-[#52baf3] text-white px-4 py-3 rounded-t-lg">
              <h3 className="font-semibold text-sm">Category</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {pmsCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-100 border-l-4 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-sm text-gray-700">
                      {category.id}. {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
              0 to 0 of 0
            </div>
          </div>
        </div>

        {/* Right Panel - Change Requests Log */}
        <div className="w-[75%]">
          <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b">
              <Input
                placeholder="Search Status"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {/* Table Header */}
            <div className="bg-[#52baf3] text-white p-4">
              <div className="grid grid-cols-10 gap-4 text-sm font-medium">
                <div className="col-span-4">Request Title</div>
                <div className="col-span-3">Requested By</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-2">Status</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-auto">
              <div className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="hover:bg-gray-50">
                    <div className="p-4 grid grid-cols-10 gap-4 items-center text-sm">
                      <div className="col-span-4 text-gray-900">
                        {request.requestTitle}
                      </div>
                      <div className="col-span-3 text-gray-700">
                        {request.requestedBy}
                      </div>
                      <div className="col-span-1 text-gray-700">
                        {request.date}
                      </div>
                      <div className="col-span-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyPMS;