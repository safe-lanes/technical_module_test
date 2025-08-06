import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Check, X } from "lucide-react";
import { changeRequestService } from "@/services/changeRequestService";
import { useChangeRequest } from "@/contexts/ChangeRequestContext";
import { ChangeRequest } from "@/services/changeRequestService";



const categories = [
  { id: 1, name: "Components" },
  { id: 2, name: "Work orders" },
  { id: 3, name: "Spares" },
  { id: 4, name: "Stores" }
];

const ModifyPMS: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState("");
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");

  const { currentUser } = useChangeRequest();

  useEffect(() => {
    // Load change requests from service
    setRequests(changeRequestService.getAllChangeRequests());
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesCategory = !selectedCategory || request.category === selectedCategory.toLowerCase().replace(' ', '-');
    const matchesSearch = !searchStatus || request.status.toLowerCase().includes(searchStatus.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleNewChangeRequest = () => {
    if (!selectedCategory) {
      alert("Please select a category first");
      return;
    }
    // TODO: Navigate to the selected category form in change request mode
    console.log("Creating new change request for:", selectedCategory);
  };

  const handleViewRequest = (request: ChangeRequest) => {
    setSelectedRequest(request);
    setIsReviewMode(true);
  };

  const handleApprove = () => {
    if (!selectedRequest) return;
    
    changeRequestService.approveChangeRequest(
      selectedRequest.id, 
      currentUser.name, 
      approvalComment
    );
    setRequests(changeRequestService.getAllChangeRequests());
    setIsReviewMode(false);
    setSelectedRequest(null);
    setApprovalComment("");
  };

  const handleReject = () => {
    if (!selectedRequest || !approvalComment.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    
    changeRequestService.rejectChangeRequest(
      selectedRequest.id, 
      currentUser.name, 
      approvalComment
    );
    setRequests(changeRequestService.getAllChangeRequests());
    setIsReviewMode(false);
    setSelectedRequest(null);
    setApprovalComment("");
  };

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
          <Button 
            className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white ml-4"
            onClick={handleNewChangeRequest}
          >
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
                    <div 
                      className="text-gray-900 font-medium cursor-pointer hover:text-[#52baf3]"
                      onClick={() => handleViewRequest(request)}
                    >
                      {request.requestTitle}
                    </div>
                    <div className="text-gray-700">
                      {request.requestedBy}
                    </div>
                    <div className="text-gray-700">
                      {request.requestDate}
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewRequest(request)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {currentUser.role === "approver" && request.status === "Pending Approval" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewRequest(request)}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewRequest(request)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500 rounded-b-lg">
              {filteredRequests.length} of {requests.length} requests
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewMode && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Change Request Review - {selectedRequest.requestTitle}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReviewMode(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Requested By</label>
                  <p className="text-gray-900">{selectedRequest.requestedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="text-gray-900">{selectedRequest.requestDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="text-gray-900 capitalize">{selectedRequest.category.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Changes Requested</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedRequest.changedFields.map(field => (
                    <div key={field} className="mb-3 last:mb-0">
                      <label className="text-sm font-medium text-gray-600 capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-gray-700">
                          {selectedRequest.originalData[field] || 'N/A'}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="text-red-600 font-medium">
                          {selectedRequest.newData[field] || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRequest.comments && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-600">Request Comments</label>
                  <p className="text-gray-900 mt-1">{selectedRequest.comments}</p>
                </div>
              )}

              {currentUser.role === "approver" && selectedRequest.status === "Pending Approval" && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Approval Comments
                  </label>
                  <textarea
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="Add comments for approval/rejection..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                    rows={3}
                  />
                </div>
              )}

              {selectedRequest.rejectionReason && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-600">Rejection Reason</label>
                  <p className="text-red-600 mt-1">{selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end p-6 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setIsReviewMode(false)}
              >
                Close
              </Button>
              {currentUser.role === "approver" && selectedRequest.status === "Pending Approval" && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyPMS;