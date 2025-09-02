import { __assign, __spreadArray } from "tslib";
// In-memory storage for change requests (in production this would be a proper database)
var changeRequests = [
    {
        id: 1,
        category: "components",
        requestTitle: "Modify Main Engine Maintenance Schedule",
        requestedBy: "Chief Engineer",
        requestDate: "2025-05-20",
        status: "Pending Approval",
        originalData: { frequency: "6 Months", component: "Main Engine" },
        newData: { frequency: "3 Months", component: "Main Engine" },
        changedFields: ["frequency"],
        comments: "Increase frequency due to heavy usage"
    },
    {
        id: 2,
        category: "work-orders",
        requestTitle: "Update Steering System Component Details",
        requestedBy: "2nd Engineer",
        requestDate: "2025-05-18",
        status: "Approved",
        originalData: { jobTitle: "Steering Maintenance", frequency: "1 Month" },
        newData: { jobTitle: "Steering System Check", frequency: "2 Weeks" },
        changedFields: ["jobTitle", "frequency"],
        approvedBy: "Technical Superintendent",
        approvedDate: "2025-05-19"
    },
    {
        id: 3,
        category: "spares",
        requestTitle: "Request Special Tool for Aux Engine",
        requestedBy: "3rd Engineer",
        requestDate: "2025-05-10",
        status: "Rejected",
        originalData: { partName: "Standard Tool", quantity: 1 },
        newData: { partName: "Special Hydraulic Tool", quantity: 2 },
        changedFields: ["partName", "quantity"],
        rejectionReason: "Budget constraints - use existing tools"
    }
];
var changeLogs = [];
var nextId = 4;
export var changeRequestService = {
    // Get all change requests
    getAllChangeRequests: function () {
        return __spreadArray([], changeRequests, true);
    },
    // Get change requests by category
    getChangeRequestsByCategory: function (category) {
        return changeRequests.filter(function (req) { return req.category === category; });
    },
    // Get change request by ID
    getChangeRequestById: function (id) {
        return changeRequests.find(function (req) { return req.id === id; });
    },
    // Create new change request
    createChangeRequest: function (request) {
        var newRequest = __assign(__assign({}, request), { id: nextId++ });
        changeRequests.push(newRequest);
        // Log the creation
        changeLogs.push({
            id: changeLogs.length + 1,
            changeRequestId: newRequest.id,
            action: "created",
            performedBy: request.requestedBy,
            performedDate: request.requestDate,
            oldValues: request.originalData,
            newValues: request.newData,
            comments: request.comments
        });
        return newRequest;
    },
    // Approve change request
    approveChangeRequest: function (id, approvedBy, comments) {
        var requestIndex = changeRequests.findIndex(function (req) { return req.id === id; });
        if (requestIndex === -1)
            return false;
        var request = changeRequests[requestIndex];
        var approvedDate = new Date().toISOString().split('T')[0];
        changeRequests[requestIndex] = __assign(__assign({}, request), { status: "Approved", approvedBy: approvedBy, approvedDate: approvedDate, comments: comments || request.comments });
        // Log the approval
        changeLogs.push({
            id: changeLogs.length + 1,
            changeRequestId: id,
            action: "approved",
            performedBy: approvedBy,
            performedDate: approvedDate,
            oldValues: request.originalData,
            newValues: request.newData,
            comments: comments
        });
        return true;
    },
    // Reject change request
    rejectChangeRequest: function (id, rejectedBy, reason) {
        var requestIndex = changeRequests.findIndex(function (req) { return req.id === id; });
        if (requestIndex === -1)
            return false;
        var request = changeRequests[requestIndex];
        var rejectedDate = new Date().toISOString().split('T')[0];
        changeRequests[requestIndex] = __assign(__assign({}, request), { status: "Rejected", rejectionReason: reason, comments: reason });
        // Log the rejection
        changeLogs.push({
            id: changeLogs.length + 1,
            changeRequestId: id,
            action: "rejected",
            performedBy: rejectedBy,
            performedDate: rejectedDate,
            oldValues: request.originalData,
            newValues: request.newData,
            comments: reason
        });
        return true;
    },
    // Get change logs for audit
    getChangeLogs: function () {
        return __spreadArray([], changeLogs, true);
    }
};
//# sourceMappingURL=changeRequestService.js.map