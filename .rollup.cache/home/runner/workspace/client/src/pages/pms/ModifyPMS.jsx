import { __assign, __awaiter, __generator } from "tslib";
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChangeRequestModal } from '@/components/modify/ChangeRequestModal';
import { Plus, Search, Send, Clock, CheckCircle, XCircle, RotateCcw, Package, ClipboardList, Archive, Store, ExternalLink, } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { TargetPicker } from '@/components/TargetPicker';
import { ProposeChanges } from '@/components/ProposeChanges';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { useChangeMode } from '@/contexts/ChangeModeContext';
import { useToast } from '@/hooks/use-toast';
var statusColors = {
    draft: 'bg-gray-500',
    submitted: 'bg-blue-500',
    returned: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
};
var statusIcons = {
    draft: Clock,
    submitted: Send,
    returned: RotateCcw,
    approved: CheckCircle,
    rejected: XCircle,
};
export default function ModifyPMS() {
    var _this = this;
    var _a, _b;
    var _c = useLocation(), setLocation = _c[1];
    var enterChangeMode = useChangeMode().enterChangeMode;
    var toast = useToast().toast;
    var selectedVessel = useState('V001')[0];
    var _d = useState('all'), categoryFilter = _d[0], setCategoryFilter = _d[1];
    var _e = useState('all'), statusFilter = _e[0], setStatusFilter = _e[1];
    var _f = useState(''), searchQuery = _f[0], setSearchQuery = _f[1];
    var _g = useState(false), showCreateDialog = _g[0], setShowCreateDialog = _g[1];
    var _h = useState(null), editingRequest = _h[0], setEditingRequest = _h[1];
    var _j = useState(null), viewingRequest = _j[0], setViewingRequest = _j[1];
    var _k = useState(false), showTargetPicker = _k[0], setShowTargetPicker = _k[1];
    var _l = useState(false), showSnapshotDialog = _l[0], setShowSnapshotDialog = _l[1];
    var _m = useState(null), snapshotToView = _m[0], setSnapshotToView = _m[1];
    var _o = useState(false), isNewRequestModalOpen = _o[0], setIsNewRequestModalOpen = _o[1];
    // Form state for create/edit
    var _p = useState({
        title: '',
        category: 'components',
        reason: '',
        targetType: null,
        targetId: null,
        snapshotBeforeJson: null,
        proposedChangesJson: null,
        movePreviewJson: null,
        targetDisplay: null,
    }), formData = _p[0], setFormData = _p[1];
    // Fetch change requests
    var _q = useQuery({
        queryKey: [
            '/api/change-requests',
            categoryFilter,
            statusFilter,
            searchQuery,
        ],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        params.append('vesselId', selectedVessel);
                        if (categoryFilter !== 'all')
                            params.append('category', categoryFilter);
                        if (statusFilter !== 'all')
                            params.append('status', statusFilter);
                        if (searchQuery)
                            params.append('q', searchQuery);
                        return [4 /*yield*/, fetch("/api/change-requests?".concat(params))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch requests');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
    }), _r = _q.data, requests = _r === void 0 ? [] : _r, isLoading = _q.isLoading;
    // Create mutation
    var createMutation = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest('POST', '/api/change-requests', __assign(__assign({}, data), { vesselId: selectedVessel, requestedByUserId: 'current_user' }))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/change-requests'] });
            setShowCreateDialog(false);
            resetForm();
        },
    });
    // Update mutation
    var updateMutation = useMutation({
        mutationFn: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var res;
            var id = _b.id, data = _b.data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, apiRequest('PUT', "/api/change-requests/".concat(id), __assign(__assign({}, data), { vesselId: selectedVessel, requestedByUserId: 'current_user' }))];
                    case 1:
                        res = _c.sent();
                        return [2 /*return*/, res.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/change-requests'] });
            setEditingRequest(null);
            resetForm();
        },
    });
    // Submit mutation
    var submitMutation = useMutation({
        mutationFn: function (id) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest('PATCH', "/api/change-requests/".concat(id, "/status"), {
                            status: 'submitted',
                            reviewedByUserId: 'current_user',
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/change-requests'] });
        },
    });
    // Delete mutation
    var deleteMutation = useMutation({
        mutationFn: function (id) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest('DELETE', "/api/change-requests/".concat(id))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/change-requests'] });
        },
    });
    var resetForm = function () {
        setFormData({
            title: '',
            category: 'components',
            reason: '',
            targetType: null,
            targetId: null,
            snapshotBeforeJson: null,
            proposedChangesJson: null,
            movePreviewJson: null,
            targetDisplay: null,
        });
    };
    // Check if returning from target selection
    useEffect(function () {
        var returnWithTarget = sessionStorage.getItem('modifyPMS_returnWithTarget');
        var formDataStr = sessionStorage.getItem('modifyPMS_formData');
        var editingId = sessionStorage.getItem('modifyPMS_editingId');
        if (returnWithTarget === 'true' && formDataStr) {
            var savedFormData = JSON.parse(formDataStr);
            setFormData(savedFormData);
            // If we were editing, restore that state
            if (editingId && requests) {
                var requestToEdit = requests.find(function (r) { return r.id === parseInt(editingId); });
                if (requestToEdit) {
                    setEditingRequest(requestToEdit);
                }
            }
            // Open the create/edit dialog
            setShowCreateDialog(true);
            // Clear session storage
            sessionStorage.removeItem('modifyPMS_returnWithTarget');
            sessionStorage.removeItem('modifyPMS_formData');
            sessionStorage.removeItem('modifyPMS_editingId');
        }
    }, [requests]);
    var handleCreate = function () {
        resetForm();
        setShowCreateDialog(true);
    };
    var handleCreateWithChangeMode = function (category) {
        // Enter change mode with title and category
        var title = "New ".concat(category.charAt(0).toUpperCase() + category.slice(1), " Change Request");
        enterChangeMode(title, category);
        // Navigate to the appropriate screen
        switch (category) {
            case 'components':
                // Set flag to open Add/Edit Component form
                sessionStorage.setItem('openComponentForm', 'true');
                setLocation('/pms/components');
                break;
            case 'work_orders':
                setLocation('/pms/work-orders');
                break;
            case 'spares':
                setLocation('/pms/spares');
                break;
            case 'stores':
                setLocation('/pms/stores');
                break;
            default:
                setLocation('/pms/components');
        }
    };
    var handleEdit = function (request) {
        setFormData({
            title: request.title,
            category: request.category,
            reason: request.reason,
            targetType: request.targetType || null,
            targetId: request.targetId || null,
            snapshotBeforeJson: request.snapshotBeforeJson || null,
            proposedChangesJson: request.proposedChangesJson || null,
            movePreviewJson: request.movePreviewJson || null,
            targetDisplay: request.snapshotBeforeJson
                ? {
                    key: request.snapshotBeforeJson.displayKey,
                    name: request.snapshotBeforeJson.displayName,
                    path: request.snapshotBeforeJson.displayPath,
                }
                : null,
        });
        setEditingRequest(request);
    };
    var handleTargetSelect = function (targetType, targetId, payload) { return __awaiter(_this, void 0, void 0, function () {
        var actualTargetType, actualTargetId, snapshot, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    actualTargetType = payload.targetType || targetType;
                    actualTargetId = payload.targetId || targetId;
                    snapshot = payload.snapshotBeforeJson || payload;
                    setFormData(function (prev) { return (__assign(__assign({}, prev), { targetType: actualTargetType, targetId: actualTargetId, snapshotBeforeJson: snapshot, targetDisplay: payload.targetDisplay })); });
                    if (!editingRequest) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, apiRequest('PUT', "/api/change-requests/".concat(editingRequest.id), {
                            targetType: actualTargetType,
                            targetId: actualTargetId,
                            snapshotBeforeJson: snapshot,
                        })];
                case 2:
                    _a.sent();
                    // Refresh the request data
                    queryClient.invalidateQueries({ queryKey: ['/api/change-requests'] });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to update target:', error_1);
                    return [3 /*break*/, 4];
                case 4:
                    setShowTargetPicker(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var getTargetIcon = function (targetType) {
        switch (targetType) {
            case 'component':
                return <Package className='h-4 w-4'/>;
            case 'work_order':
                return <ClipboardList className='h-4 w-4'/>;
            case 'spare':
                return <Archive className='h-4 w-4'/>;
            case 'store':
                return <Store className='h-4 w-4'/>;
            default:
                return null;
        }
    };
    var getTargetDisplayName = function (request) {
        if (!request.snapshotBeforeJson)
            return '-';
        var snapshot = request.snapshotBeforeJson;
        return "".concat(snapshot.displayKey || '', " - ").concat(snapshot.displayName || '');
    };
    var handleView = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var response, fullRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/api/change-requests/".concat(request.id))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    fullRequest = _a.sent();
                    setViewingRequest(fullRequest);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleSave = function () {
        if (editingRequest) {
            updateMutation.mutate({ id: editingRequest.id, data: formData });
        }
        else {
            createMutation.mutate(formData);
        }
    };
    var getStatusBadge = function (status) {
        var Icon = statusIcons[status];
        return (<Badge className={"".concat(statusColors[status], " text-white")}>
        <Icon className='w-3 h-3 mr-1'/>
        {status.toUpperCase()}
      </Badge>);
    };
    return (<>
      <div className='flex h-screen bg-gray-100'>
        {/* Left Sidebar - Blue Background */}
        <div className='w-64 bg-[#52BAF3] text-white'>
          <div className='p-4'>
            <div className='bg-[#40a8e0] px-4 py-3 rounded-t-lg'>
              <h2 className='text-white font-medium'>Category</h2>
            </div>
            <div className='bg-white rounded-b-lg'>
              <div className='p-4 space-y-1'>
                <button onClick={function () { return setCategoryFilter('components'); }} className={"w-full text-left px-3 py-2 text-sm rounded transition-colors ".concat(categoryFilter === 'components'
            ? 'bg-[#52BAF3] text-white font-medium'
            : 'text-gray-700 hover:bg-gray-50')}>
                  1. Components
                </button>
                <button onClick={function () { return setCategoryFilter('work_orders'); }} className={"w-full text-left px-3 py-2 text-sm rounded transition-colors ".concat(categoryFilter === 'work_orders'
            ? 'bg-[#52BAF3] text-white font-medium'
            : 'text-gray-700 hover:bg-gray-50')}>
                  2. Work orders
                </button>
                <button onClick={function () { return setCategoryFilter('spares'); }} className={"w-full text-left px-3 py-2 text-sm rounded transition-colors ".concat(categoryFilter === 'spares'
            ? 'bg-[#52BAF3] text-white font-medium'
            : 'text-gray-700 hover:bg-gray-50')}>
                  3. Spares
                </button>
                <button onClick={function () { return setCategoryFilter('stores'); }} className={"w-full text-left px-3 py-2 text-sm rounded transition-colors ".concat(categoryFilter === 'stores'
            ? 'bg-[#52BAF3] text-white font-medium'
            : 'text-gray-700 hover:bg-gray-50')}>
                  4. Stores
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 flex flex-col'>
          {/* Header */}
          <div className='bg-white p-6 border-b border-gray-200'>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>
              Modify PMS - Change Requests
            </h1>

            <div className='flex justify-between items-center'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400'/>
                <Input placeholder='Search Status' value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className='pl-10 w-80 border-gray-300'/>
              </div>
              <Button className='bg-[#52BAF3] hover:bg-[#40a8e0] text-white px-6' onClick={function () { return setIsNewRequestModalOpen(true); }}>
                <Plus className='w-4 h-4 mr-2'/>
                New Change Request
              </Button>
            </div>
          </div>

          {/* Table Content */}
          <div className='flex-1 p-6'>
            <div className='bg-white rounded-lg border border-gray-200 h-full'>
              {isLoading ? (<div className='text-center py-12 text-gray-500'>
                  Loading...
                </div>) : requests.length === 0 ? (<div className='text-center py-12 text-gray-500'>
                  No change requests found. Click "New Change Request" to create
                  one.
                </div>) : (<div className='h-full flex flex-col'>
                  <Table>
                    <TableHeader>
                      <TableRow className='bg-[#52BAF3] hover:bg-[#52BAF3] border-b-0'>
                        <TableHead className='text-white font-medium py-4 px-6'>
                          Request Title
                        </TableHead>
                        <TableHead className='text-white font-medium py-4 px-6'>
                          Requested By
                        </TableHead>
                        <TableHead className='text-white font-medium py-4 px-6'>
                          Date
                        </TableHead>
                        <TableHead className='text-white font-medium py-4 px-6'>
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map(function (request) { return (<TableRow key={request.id} className='border-b border-gray-200 hover:bg-gray-50'>
                          <TableCell className='py-4 px-6'>
                            <div className='font-medium text-gray-900'>
                              {request.title}
                            </div>
                          </TableCell>
                          <TableCell className='py-4 px-6 text-gray-700'>
                            {request.requestedByUserId === 'current_user'
                    ? 'Chief Engineer'
                    : request.requestedByUserId === '2nd_engineer'
                        ? '2nd Engineer'
                        : request.requestedByUserId === '3rd_engineer'
                            ? '3rd Engineer'
                            : request.requestedByUserId}
                          </TableCell>
                          <TableCell className='py-4 px-6 text-gray-700'>
                            {request.submittedAt
                    ? new Date(request.submittedAt)
                        .toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    })
                        .replace(/\//g, ' ')
                    : new Date(request.createdAt)
                        .toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    })
                        .replace(/\//g, ' ')}
                          </TableCell>
                          <TableCell className='py-4 px-6'>
                            {request.status === 'submitted' && (<Badge className='bg-[#52BAF3] text-white px-3 py-1 text-xs rounded-full'>
                                Pending Approval
                              </Badge>)}
                            {request.status === 'approved' && (<Badge className='bg-green-500 text-white px-3 py-1 text-xs rounded-full'>
                                Approved
                              </Badge>)}
                            {request.status === 'rejected' && (<Badge className='bg-red-500 text-white px-3 py-1 text-xs rounded-full'>
                                Rejected
                              </Badge>)}
                            {request.status === 'draft' && (<Badge className='bg-gray-500 text-white px-3 py-1 text-xs rounded-full'>
                                Draft
                              </Badge>)}
                            {request.status === 'returned' && (<Badge className='bg-yellow-500 text-white px-3 py-1 text-xs rounded-full'>
                                Returned
                              </Badge>)}
                          </TableCell>
                        </TableRow>); })}
                    </TableBody>
                  </Table>

                  {/* Pagination info at bottom */}
                  <div className='mt-auto px-6 py-4 border-t border-gray-200 text-sm text-gray-500'>
                    {requests.length > 0
                ? "0 to ".concat(requests.length, " of ").concat(requests.length)
                : '0 to 0 of 0'}
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || !!editingRequest} onOpenChange={function (open) {
            if (!open) {
                setShowCreateDialog(false);
                setEditingRequest(null);
                resetForm();
            }
        }}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>
              {editingRequest ? 'Edit Change Request' : 'New Change Request'}
            </DialogTitle>
            <DialogDescription>
              {editingRequest
            ? 'Update the change request details below.'
            : 'Create a new change request. It will be saved as draft until submitted.'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <Label htmlFor='title'>Title *</Label>
              <Input id='title' value={formData.title} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { title: e.target.value }));
        }} placeholder='Brief description of the change (max 120 characters)' maxLength={120}/>
              <p className='text-sm text-gray-500 mt-1'>
                {formData.title.length}/120 characters
              </p>
            </div>

            <div>
              <Label htmlFor='category'>Category *</Label>
              <Select value={formData.category} onValueChange={function (value) {
            return setFormData(__assign(__assign({}, formData), { category: value }));
        }}>
                <SelectTrigger id='category'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='components'>Components</SelectItem>
                  <SelectItem value='work_orders'>Work Orders</SelectItem>
                  <SelectItem value='running_hours'>Running Hours</SelectItem>
                  <SelectItem value='spares'>Spares</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='reason'>Reason for Change *</Label>
              <Textarea id='reason' value={formData.reason} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { reason: e.target.value }));
        }} placeholder='Detailed explanation of why this change is needed...' rows={6}/>
            </div>

            <div>
              <Label>Target Selection *</Label>
              <div className='border rounded-lg p-4 bg-gray-50'>
                {formData.targetType && formData.snapshotBeforeJson ? (<div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      {getTargetIcon(formData.targetType)}
                      <div>
                        <p className='font-semibold'>
                          {formData.snapshotBeforeJson.displayKey} -{' '}
                          {formData.snapshotBeforeJson.displayName}
                        </p>
                        {formData.snapshotBeforeJson.displayPath && (<p className='text-xs text-gray-500'>
                            {formData.snapshotBeforeJson.displayPath}
                          </p>)}
                        <p className='text-sm text-gray-600'>
                          Target Type:{' '}
                          {(_a = formData.targetType) === null || _a === void 0 ? void 0 : _a.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Button type='button' variant='outline' size='sm' onClick={function () {
                // Navigate to the appropriate screen with change request mode parameters
                var params = new URLSearchParams({
                    editAsChangeRequest: '1',
                    crTitle: formData.title || '',
                    crCategory: formData.category || 'components',
                    targetId: formData.targetId || '',
                });
                var routes = {
                    components: "/pms/components?".concat(params),
                    work_orders: "/pms/work-orders?".concat(params),
                    spares: "/spares?".concat(params),
                    stores: "/stores?".concat(params),
                };
                setLocation(routes[formData.category] ||
                    "/pms/components?".concat(params));
            }}>
                      Change Target
                    </Button>
                  </div>) : (<div className='text-center'>
                    <p className='text-gray-600 mb-2'>No target selected</p>
                    <Button type='button' variant='outline' onClick={function () {
                // Navigate to the appropriate screen with change request mode parameters
                var params = new URLSearchParams({
                    editAsChangeRequest: '1',
                    crTitle: formData.title || '',
                    crCategory: formData.category || 'components',
                });
                var routes = {
                    components: "/pms/components?".concat(params),
                    work_orders: "/pms/work-orders?".concat(params),
                    spares: "/spares?".concat(params),
                    stores: "/stores?".concat(params),
                };
                setLocation(routes[formData.category] ||
                    "/pms/components?".concat(params));
            }}>
                      <ExternalLink className='w-4 h-4 mr-2'/>
                      Select Target
                    </Button>
                  </div>)}
              </div>
            </div>

            {(editingRequest === null || editingRequest === void 0 ? void 0 : editingRequest.status) === 'returned' && (<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                <p className='text-sm font-semibold text-yellow-800'>
                  This request was returned for clarification. Please review the
                  comments and update accordingly.
                </p>
              </div>)}

            {/* Propose Changes Section - only show when target is selected and in draft/returned status */}
            {formData.targetType &&
            formData.targetId &&
            formData.snapshotBeforeJson &&
            (!editingRequest ||
                editingRequest.status === 'draft' ||
                editingRequest.status === 'returned') && (<div className='mt-6'>
                  <ProposeChanges targetType={formData.targetType} snapshotData={formData.snapshotBeforeJson} existingProposedChanges={formData.proposedChangesJson || []} existingMovePreview={formData.movePreviewJson} onSaveProposed={function (changes, movePreview) {
                setFormData(function (prev) { return (__assign(__assign({}, prev), { proposedChangesJson: changes, movePreviewJson: movePreview })); });
                // Save proposed changes to backend
                if (editingRequest) {
                    fetch("/api/change-requests/".concat(editingRequest.id), {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            proposedChangesJson: changes,
                            movePreviewJson: movePreview,
                            vesselId: selectedVessel,
                            requestedByUserId: 'current_user',
                        }),
                    }).catch(console.error);
                }
            }} disabled={editingRequest
                ? editingRequest.status !== 'draft' &&
                    editingRequest.status !== 'returned'
                : false}/>
                </div>)}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={function () {
            setShowCreateDialog(false);
            setEditingRequest(null);
            resetForm();
        }}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.title ||
            createMutation.isPending ||
            updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
            ? 'Saving...'
            : 'Save as Draft'}
            </Button>
            {editingRequest &&
            formData.title &&
            formData.reason &&
            formData.targetType &&
            formData.targetId &&
            formData.proposedChangesJson &&
            formData.proposedChangesJson.length > 0 && (<Button variant='default' onClick={function () {
                handleSave();
                // After saving, submit
                setTimeout(function () {
                    if (editingRequest) {
                        submitMutation.mutate(editingRequest.id);
                    }
                }, 500);
            }}>
                  Save & Submit
                </Button>)}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingRequest} onOpenChange={function (open) {
            if (!open)
                setViewingRequest(null);
        }}>
        <DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              Change Request CR
              {viewingRequest && String(viewingRequest.id).padStart(4, '0')}
            </DialogTitle>
          </DialogHeader>

          {viewingRequest && (<Tabs defaultValue='details'>
              <TabsList className='grid w-full grid-cols-5'>
                <TabsTrigger value='details'>Details</TabsTrigger>
                <TabsTrigger value='proposed'>Proposed Changes</TabsTrigger>
                <TabsTrigger value='snapshot'>Snapshot</TabsTrigger>
                <TabsTrigger value='comments'>Comments</TabsTrigger>
                <TabsTrigger value='attachments'>Attachments</TabsTrigger>
              </TabsList>

              <TabsContent value='details' className='space-y-4'>
                <div>
                  <Label>Status</Label>
                  <div className='mt-1'>
                    {getStatusBadge(viewingRequest.status)}
                  </div>
                </div>

                <div>
                  <Label>Category</Label>
                  <p className='capitalize'>
                    {viewingRequest.category.replace('_', ' ')}
                  </p>
                </div>

                <div>
                  <Label>Title</Label>
                  <p>{viewingRequest.title}</p>
                </div>

                <div>
                  <Label>Reason for Change</Label>
                  <p className='whitespace-pre-wrap'>
                    {viewingRequest.reason || 'No reason provided'}
                  </p>
                </div>

                <div>
                  <Label>Target</Label>
                  {viewingRequest.targetType &&
                viewingRequest.snapshotBeforeJson ? (<Card className='mt-2'>
                      <CardContent className='pt-4'>
                        <div className='flex items-start gap-3'>
                          {getTargetIcon(viewingRequest.targetType)}
                          <div className='flex-1'>
                            <p className='font-semibold'>
                              {viewingRequest.snapshotBeforeJson.displayKey} -{' '}
                              {viewingRequest.snapshotBeforeJson.displayName}
                            </p>
                            <p className='text-sm text-gray-600 mb-2'>
                              Type:{' '}
                              {(_b = viewingRequest.targetType) === null || _b === void 0 ? void 0 : _b.replace('_', ' ').toUpperCase()}
                            </p>
                            {viewingRequest.snapshotBeforeJson.displayPath && (<p className='text-sm text-gray-500'>
                                Path:{' '}
                                {viewingRequest.snapshotBeforeJson.displayPath}
                              </p>)}
                            <div className='mt-3 grid grid-cols-2 gap-2 text-sm'>
                              {Object.entries(viewingRequest.snapshotBeforeJson.fields || {}).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return (<div key={key}>
                                  <span className='text-gray-500'>{key}: </span>
                                  <span className='font-medium'>
                                    {String(value) || '-'}
                                  </span>
                                </div>);
                })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>) : (<p className='text-gray-500'>No target selected</p>)}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Requested By</Label>
                    <p>{viewingRequest.requestedByUserId}</p>
                  </div>
                  <div>
                    <Label>Created</Label>
                    <p>{new Date(viewingRequest.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {viewingRequest.submittedAt && (<div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label>Submitted At</Label>
                      <p>
                        {new Date(viewingRequest.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    {viewingRequest.reviewedAt && (<div>
                        <Label>Reviewed At</Label>
                        <p>
                          {new Date(viewingRequest.reviewedAt).toLocaleString()}
                        </p>
                      </div>)}
                  </div>)}

                {viewingRequest.reviewedByUserId && (<div>
                    <Label>Reviewed By</Label>
                    <p>{viewingRequest.reviewedByUserId}</p>
                  </div>)}
              </TabsContent>

              <TabsContent value='proposed'>
                <div className='space-y-4'>
                  {viewingRequest.proposedChangesJson &&
                viewingRequest.proposedChangesJson.length > 0 ? (<>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Field</TableHead>
                            <TableHead>Current</TableHead>
                            <TableHead>Proposed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {viewingRequest.proposedChangesJson.map(function (change, idx) { return (<TableRow key={idx}>
                                <TableCell className='font-medium'>
                                  {change.label}
                                </TableCell>
                                <TableCell className='text-gray-600'>
                                  {String(change.before || '-')}
                                </TableCell>
                                <TableCell className='text-red-600 font-medium'>
                                  {String(change.after || '-')}
                                </TableCell>
                              </TableRow>); })}
                        </TableBody>
                      </Table>

                      {viewingRequest.movePreviewJson && (<Card>
                          <CardHeader>
                            <CardTitle className='text-base'>
                              Component Move (Preview)
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className='space-y-2'>
                              <div className='grid grid-cols-2 gap-4'>
                                <div>
                                  <Label className='text-xs text-gray-500'>
                                    From
                                  </Label>
                                  <p className='text-sm font-mono'>
                                    {viewingRequest.movePreviewJson.oldPath}
                                  </p>
                                  <p className='text-xs text-gray-500 mt-1'>
                                    Code:{' '}
                                    {viewingRequest.movePreviewJson.oldCode}
                                  </p>
                                </div>
                                <div>
                                  <Label className='text-xs text-gray-500'>
                                    To
                                  </Label>
                                  <p className='text-sm font-mono'>
                                    {viewingRequest.movePreviewJson.newPath}
                                  </p>
                                  <p className='text-xs text-gray-500 mt-1'>
                                    New Code:{' '}
                                    {viewingRequest.movePreviewJson
                        .newCodePreview}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>)}
                    </>) : (<p className='text-center text-gray-500 py-4'>
                      No changes proposed yet
                    </p>)}
                </div>
              </TabsContent>

              <TabsContent value='snapshot'>
                <div className='space-y-4'>
                  {viewingRequest.snapshotBeforeJson ? (<Card>
                      <CardHeader>
                        <CardTitle className='text-base'>
                          Target Snapshot
                        </CardTitle>
                        <CardDescription>
                          Snapshot taken at the time of target selection
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Field</TableHead>
                              <TableHead>Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(viewingRequest.snapshotBeforeJson.fields || {}).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return (<TableRow key={key}>
                                <TableCell className='font-medium'>
                                  {key}
                                </TableCell>
                                <TableCell>{String(value || '-')}</TableCell>
                              </TableRow>);
                })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>) : (<p className='text-center text-gray-500 py-4'>
                      No snapshot available
                    </p>)}
                </div>
              </TabsContent>

              <TabsContent value='comments'>
                <div className='space-y-4'>
                  {viewingRequest.comments &&
                viewingRequest.comments.length > 0 ? (viewingRequest.comments.map(function (comment) { return (<Card key={comment.id}>
                        <CardContent className='pt-4'>
                          <div className='flex justify-between mb-2'>
                            <span className='font-semibold'>
                              {comment.userId}
                            </span>
                            <span className='text-sm text-gray-500'>
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className='whitespace-pre-wrap'>
                            {comment.message}
                          </p>
                        </CardContent>
                      </Card>); })) : (<p className='text-center text-gray-500 py-4'>
                      No comments yet
                    </p>)}
                </div>
              </TabsContent>

              <TabsContent value='attachments'>
                <div className='space-y-2'>
                  {viewingRequest.attachments &&
                viewingRequest.attachments.length > 0 ? (viewingRequest.attachments.map(function (attachment) { return (<Card key={attachment.id}>
                        <CardContent className='pt-4'>
                          <div className='flex justify-between items-center'>
                            <span>{attachment.filename}</span>
                            <Button size='sm' variant='outline' asChild>
                              <a href={attachment.url} target='_blank' rel='noopener noreferrer'>
                                View
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>); })) : (<p className='text-center text-gray-500 py-4'>
                      No attachments
                    </p>)}
                </div>
              </TabsContent>
            </Tabs>)}

          <DialogFooter className='flex justify-between'>
            <div className='flex gap-2'>
              {viewingRequest && viewingRequest.status === 'submitted' && (<>
                  <Button variant='destructive' onClick={function () {
                var comment = prompt('Please provide a reason for rejection:');
                if (comment) {
                    fetch("/api/change-requests/".concat(viewingRequest.id, "/reject"), {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            comment: comment,
                            reviewerId: 'current_user',
                        }),
                    }).then(function () {
                        queryClient.invalidateQueries({
                            queryKey: ['/api/change-requests'],
                        });
                        setViewingRequest(null);
                        toast({
                            title: 'Change request rejected',
                            description: 'The change request has been rejected',
                        });
                    });
                }
            }}>
                    Reject
                  </Button>
                  <Button variant='default' className='bg-green-600 hover:bg-green-700' onClick={function () {
                var comment = prompt('Please provide approval comments:');
                if (comment) {
                    fetch("/api/change-requests/".concat(viewingRequest.id, "/approve"), {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            comment: comment,
                            reviewerId: 'current_user',
                        }),
                    }).then(function () {
                        queryClient.invalidateQueries({
                            queryKey: ['/api/change-requests'],
                        });
                        setViewingRequest(null);
                        toast({
                            title: 'Change request approved',
                            description: 'The change request has been approved successfully',
                        });
                    });
                }
            }}>
                    Approve
                  </Button>
                </>)}
            </div>
            <Button onClick={function () { return setViewingRequest(null); }}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Target Picker Dialog */}
      {showTargetPicker && (<TargetPicker open={showTargetPicker} onOpenChange={setShowTargetPicker} category={formData.category} vesselId={selectedVessel} onTargetSelect={handleTargetSelect}/>)}

      {/* Change Request Modal */}
      <ChangeRequestModal open={isNewRequestModalOpen} onClose={function () { return setIsNewRequestModalOpen(false); }}/>
    </>);
}
//# sourceMappingURL=ModifyPMS.jsx.map