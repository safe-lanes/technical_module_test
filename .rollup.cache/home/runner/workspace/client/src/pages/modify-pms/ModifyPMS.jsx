import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Eye, Check, X } from 'lucide-react';
import { changeRequestService } from '@/services/changeRequestService';
import { useChangeRequest } from '@/contexts/ChangeRequestContext';
import ComponentChangeRequestForm from '@/components/change-request-forms/ComponentChangeRequestForm';
import SparesChangeRequestForm from '@/components/change-request-forms/SparesChangeRequestForm';
import StoresChangeRequestForm from '@/components/change-request-forms/StoresChangeRequestForm';
import WorkOrdersChangeRequestForm from '@/components/change-request-forms/WorkOrdersChangeRequestForm';
var categories = [
  { id: 1, name: 'Components' },
  { id: 2, name: 'Work orders' },
  { id: 3, name: 'Spares' },
  { id: 4, name: 'Stores' },
];
var ModifyPMS = function () {
  var _a = useState(null),
    selectedCategory = _a[0],
    setSelectedCategory = _a[1];
  var _b = useState(''),
    searchStatus = _b[0],
    setSearchStatus = _b[1];
  var _c = useState([]),
    requests = _c[0],
    setRequests = _c[1];
  var _d = useState(null),
    selectedRequest = _d[0],
    setSelectedRequest = _d[1];
  var _e = useState(false),
    isReviewMode = _e[0],
    setIsReviewMode = _e[1];
  var _f = useState(''),
    approvalComment = _f[0],
    setApprovalComment = _f[1];
  var _g = useState(false),
    showFormModal = _g[0],
    setShowFormModal = _g[1];
  var _h = useState(null),
    formCategory = _h[0],
    setFormCategory = _h[1];
  var _j = useChangeRequest(),
    currentUser = _j.currentUser,
    enterChangeRequestMode = _j.enterChangeRequestMode,
    exitChangeRequestMode = _j.exitChangeRequestMode;
  useEffect(function () {
    // Load change requests from service
    setRequests(changeRequestService.getAllChangeRequests());
  }, []);
  var filteredRequests = requests.filter(function (request) {
    var matchesCategory =
      !selectedCategory ||
      request.category === selectedCategory.toLowerCase().replace(' ', '-');
    var matchesSearch =
      !searchStatus ||
      request.status.toLowerCase().includes(searchStatus.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  var handleNewChangeRequest = function () {
    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }
    // Enable change request mode
    enterChangeRequestMode(selectedCategory, {});
    // Set form category and show modal
    setFormCategory(selectedCategory);
    setShowFormModal(true);
  };
  var handleViewRequest = function (request) {
    setSelectedRequest(request);
    setIsReviewMode(true);
  };
  var handleApprove = function () {
    if (!selectedRequest) return;
    changeRequestService.approveChangeRequest(
      selectedRequest.id,
      currentUser.name,
      approvalComment
    );
    setRequests(changeRequestService.getAllChangeRequests());
    setIsReviewMode(false);
    setSelectedRequest(null);
    setApprovalComment('');
  };
  var handleReject = function () {
    if (!selectedRequest || !approvalComment.trim()) {
      alert('Please provide a reason for rejection');
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
    setApprovalComment('');
  };
  var handleCloseFormModal = function () {
    setShowFormModal(false);
    setFormCategory(null);
    exitChangeRequestMode();
  };
  var getStatusColor = function (status) {
    switch (status) {
      case 'Pending Approval':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>
          Modify PMS - Change Requests
        </h1>

        {/* Search and New Request Button */}
        <div className='flex justify-between items-center mb-4'>
          <div className='flex-1 max-w-md'>
            <Input
              placeholder='Search Status'
              value={searchStatus}
              onChange={function (e) {
                return setSearchStatus(e.target.value);
              }}
              className='w-full'
            />
          </div>
          <Button
            className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white ml-4'
            onClick={handleNewChangeRequest}
          >
            <Plus className='h-4 w-4 mr-2' />
            New Change Request
          </Button>
        </div>
      </div>

      <div className='flex gap-6'>
        {/* Left Sidebar - Categories */}
        <div className='w-64'>
          <div className='bg-white rounded-lg shadow-sm'>
            <div className='bg-[#52baf3] text-white px-4 py-3 rounded-t-lg font-semibold'>
              Category
            </div>
            <div className='p-0'>
              {categories.map(function (category) {
                return (
                  <div
                    key={category.id}
                    className={'px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 '.concat(
                      selectedCategory === category.name
                        ? 'bg-blue-50 border-l-4 border-l-[#52baf3]'
                        : ''
                    )}
                    onClick={function () {
                      return setSelectedCategory(
                        selectedCategory === category.name
                          ? null
                          : category.name
                      );
                    }}
                  >
                    <div className='flex items-center'>
                      <span className='text-sm text-gray-700 mr-2'>
                        {category.id}.
                      </span>
                      <span className='text-sm text-gray-800'>
                        {category.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - Change Requests Table */}
        <div className='flex-1'>
          <div className='bg-white rounded-lg shadow-sm'>
            {/* Table Header */}
            <div className='bg-[#52baf3] text-white px-6 py-4 rounded-t-lg'>
              <div className='grid grid-cols-5 gap-4 text-sm font-medium'>
                <div>Request Title</div>
                <div>Requested By</div>
                <div>Date</div>
                <div>Status</div>
                <div></div>
              </div>
            </div>

            {/* Table Body */}
            <div className='divide-y divide-gray-200'>
              {filteredRequests.map(function (request) {
                return (
                  <div key={request.id} className='px-6 py-4 hover:bg-gray-50'>
                    <div className='grid grid-cols-5 gap-4 items-center text-sm'>
                      <div
                        className='text-gray-900 font-medium cursor-pointer hover:text-[#52baf3]'
                        onClick={function () {
                          return handleViewRequest(request);
                        }}
                      >
                        {request.requestTitle}
                      </div>
                      <div className='text-gray-700'>{request.requestedBy}</div>
                      <div className='text-gray-700'>{request.requestDate}</div>
                      <div>
                        <span
                          className={'px-3 py-1 rounded-full text-xs font-medium '.concat(
                            getStatusColor(request.status)
                          )}
                        >
                          {request.status}
                        </span>
                      </div>
                      <div className='flex gap-2 justify-end'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={function () {
                            return handleViewRequest(request);
                          }}
                          className='h-8 w-8 p-0'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        {currentUser.role === 'approver' &&
                          request.status === 'Pending Approval' && (
                            <>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={function () {
                                  return handleViewRequest(request);
                                }}
                                className='h-8 w-8 p-0 text-green-600 hover:text-green-700'
                              >
                                <Check className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={function () {
                                  return handleViewRequest(request);
                                }}
                                className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                              >
                                <X className='h-4 w-4' />
                              </Button>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className='px-6 py-3 bg-gray-50 text-sm text-gray-500 rounded-b-lg'>
              {filteredRequests.length} of {requests.length} requests
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewMode && selectedRequest && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-auto'>
            <div className='flex justify-between items-center p-6 border-b'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Change Request Review - {selectedRequest.requestTitle}
              </h2>
              <Button
                variant='ghost'
                size='sm'
                onClick={function () {
                  return setIsReviewMode(false);
                }}
                className='h-8 w-8 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>

            <div className='p-6'>
              <div className='grid grid-cols-2 gap-6 mb-6'>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    Requested By
                  </label>
                  <p className='text-gray-900'>{selectedRequest.requestedBy}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    Date
                  </label>
                  <p className='text-gray-900'>{selectedRequest.requestDate}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    Category
                  </label>
                  <p className='text-gray-900 capitalize'>
                    {selectedRequest.category.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    Status
                  </label>
                  <span
                    className={'px-3 py-1 rounded-full text-xs font-medium '.concat(
                      getStatusColor(selectedRequest.status)
                    )}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='text-lg font-medium text-gray-800 mb-4'>
                  Changes Requested
                </h3>
                <div className='bg-gray-50 rounded-lg p-4'>
                  {selectedRequest.changedFields.map(function (field) {
                    return (
                      <div key={field} className='mb-3 last:mb-0'>
                        <label className='text-sm font-medium text-gray-600 capitalize'>
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <div className='flex items-center gap-4 mt-1'>
                          <span className='text-gray-700'>
                            {selectedRequest.originalData[field] || 'N/A'}
                          </span>
                          <span className='text-gray-400'>→</span>
                          <span className='text-red-600 font-medium'>
                            {selectedRequest.newData[field] || 'N/A'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedRequest.comments && (
                <div className='mb-6'>
                  <label className='text-sm font-medium text-gray-600'>
                    Request Comments
                  </label>
                  <p className='text-gray-900 mt-1'>
                    {selectedRequest.comments}
                  </p>
                </div>
              )}

              {currentUser.role === 'approver' &&
                selectedRequest.status === 'Pending Approval' && (
                  <div className='mb-6'>
                    <label className='text-sm font-medium text-gray-600 mb-2 block'>
                      Approval Comments
                    </label>
                    <textarea
                      value={approvalComment}
                      onChange={function (e) {
                        return setApprovalComment(e.target.value);
                      }}
                      placeholder='Add comments for approval/rejection...'
                      className='w-full p-3 border border-gray-300 rounded-lg resize-none'
                      rows={3}
                    />
                  </div>
                )}

              {selectedRequest.rejectionReason && (
                <div className='mb-6'>
                  <label className='text-sm font-medium text-gray-600'>
                    Rejection Reason
                  </label>
                  <p className='text-red-600 mt-1'>
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            <div className='flex gap-3 justify-end p-6 border-t bg-gray-50'>
              <Button
                variant='outline'
                onClick={function () {
                  return setIsReviewMode(false);
                }}
              >
                Close
              </Button>
              {currentUser.role === 'approver' &&
                selectedRequest.status === 'Pending Approval' && (
                  <>
                    <Button
                      variant='outline'
                      onClick={handleReject}
                      className='text-red-600 border-red-600 hover:bg-red-50'
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={handleApprove}
                      className='bg-green-600 hover:bg-green-700 text-white'
                    >
                      Approve
                    </Button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='flex items-center justify-center w-full h-full p-4'>
            {formCategory === 'Components' && (
              <ComponentChangeRequestForm
                onClose={handleCloseFormModal}
                onSubmit={function (componentData) {
                  console.log('Component change request:', componentData);
                  // Create change request here
                  handleCloseFormModal();
                }}
                initialData={{
                  componentId: '601.003.001',
                  serialNo: 'ME001-2024',
                  drawingNo: 'DWG-ME-001',
                  componentCode: 'ME001',
                  equipmentCategory: 'propulsion',
                  location: 'Engine Room',
                  classificationData: {
                    classificationProvider: 'DNV',
                    certificateNo: 'CERT-ME-2025-01',
                    lastDataSurvey: '2023-03-15',
                    nextDataSurvey: '2028-03-15',
                  },
                }}
              />
            )}
            {formCategory === 'Work orders' && (
              <WorkOrdersChangeRequestForm
                onClose={handleCloseFormModal}
                onSubmit={function (workOrderData) {
                  console.log('Work Order change request:', workOrderData);
                  // Create change request here
                  handleCloseFormModal();
                }}
                initialData={{
                  workOrderNo: 'WO-2025-17',
                  title: 'Steering Gear - 3 Monthly Inspection',
                  component: '603.001 Steering Gear',
                  maintenanceType: 'Planned Maintenance',
                  assignedTo: '2nd Engineer',
                  approver: 'Chief Engineer',
                  jobCategory: 'Mechanical',
                  classRelated: 'Yes',
                  status: 'Due',
                  briefWorkDescription:
                    "Complete scheduled 3-monthly inspection of steering gear system as per manufacturer's recommendations",
                  ppeRequirements:
                    'Safety Helmet, Safety Gloves, Safety Goggles',
                  permitRequirements: 'Hot Work Permit (if required)',
                  otherSafetyRequirements:
                    'Ensure proper lockout/tagout procedures are followed',
                  priority: 'Medium',
                  workType: 'Planned Maintenance',
                  department: 'Engine',
                  location: 'Steering Gear Room',
                }}
              />
            )}
            {formCategory === 'Spares' && (
              <SparesChangeRequestForm
                onClose={handleCloseFormModal}
                onSubmit={function (sparesData) {
                  console.log('Spares change request:', sparesData);
                  // Create change request here
                  handleCloseFormModal();
                }}
                initialData={{
                  partCode: 'SP-ME-001',
                  partName: 'Fuel Injector',
                  linkedComponent: 'component1',
                  qty: '1',
                  minQty: '1',
                  critical: 'Y',
                  location: 'Store Room A',
                }}
              />
            )}
            {formCategory === 'Stores' && (
              <StoresChangeRequestForm
                onClose={handleCloseFormModal}
                onSubmit={function (storesData) {
                  console.log('Stores change request:', storesData);
                  // Create change request here
                  handleCloseFormModal();
                }}
                initialData={{
                  placeReceived: 'Singapore',
                  dateReceived: '2025-01-15',
                  itemCode: 'ST-TOOL-001',
                  itemName: 'Torque Wrench',
                  storesCategory: 'Engine Stores',
                  rob: '2',
                }}
                category='stores'
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ModifyPMS;
//# sourceMappingURL=ModifyPMS.jsx.map
