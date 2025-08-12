import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Eye, Edit, Trash2, Send, Clock, CheckCircle, XCircle, RotateCcw, Package, ClipboardList, Archive, Store, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { TargetPicker } from "@/components/TargetPicker";
import { ProposeChanges } from "@/components/ProposeChanges";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ChangeRequest {
  id: number;
  vesselId: string;
  category: string;
  title: string;
  reason: string;
  targetType?: string | null;
  targetId?: string | null;
  snapshotBeforeJson?: any;
  proposedChangesJson?: any[] | null;
  movePreviewJson?: any;
  status: 'draft' | 'submitted' | 'returned' | 'approved' | 'rejected';
  requestedByUserId: string;
  submittedAt: Date | null;
  reviewedByUserId: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  attachments?: ChangeRequestAttachment[];
  comments?: ChangeRequestComment[];
}

interface ChangeRequestAttachment {
  id: number;
  changeRequestId: number;
  filename: string;
  url: string;
  uploadedByUserId: string;
  uploadedAt: Date;
}

interface ChangeRequestComment {
  id: number;
  changeRequestId: number;
  userId: string;
  message: string;
  createdAt: Date;
}

const statusColors = {
  draft: 'bg-gray-500',
  submitted: 'bg-blue-500',
  returned: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500'
};

const statusIcons = {
  draft: Clock,
  submitted: Send,
  returned: RotateCcw,
  approved: CheckCircle,
  rejected: XCircle
};

export default function ModifyPMS() {
  const [, navigate] = useLocation();
  const [selectedVessel] = useState('MV Test Vessel');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ChangeRequest | null>(null);
  const [viewingRequest, setViewingRequest] = useState<ChangeRequest | null>(null);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [showSnapshotDialog, setShowSnapshotDialog] = useState(false);
  const [snapshotToView, setSnapshotToView] = useState<any>(null);
  
  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    category: 'components',
    reason: '',
    targetType: null as string | null,
    targetId: null as string | null,
    snapshotBeforeJson: null as any,
    proposedChangesJson: null as any[] | null,
    movePreviewJson: null as any,
    targetDisplay: null as any
  });
  


  // Fetch change requests
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['/api/modify-pms/requests', categoryFilter, statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('vesselId', selectedVessel);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('q', searchQuery);
      
      const response = await fetch(`/api/modify-pms/requests?${params}`);
      if (!response.ok) throw new Error('Failed to fetch requests');
      return response.json();
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest('POST', '/api/modify-pms/requests', {
        ...data,
        vesselId: selectedVessel,
        userId: 'current_user'
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/modify-pms/requests'] });
      setShowCreateDialog(false);
      resetForm();
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await apiRequest('PUT', `/api/modify-pms/requests/${id}`, {
        ...data,
        vesselId: selectedVessel
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/modify-pms/requests'] });
      setEditingRequest(null);
      resetForm();
    }
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('PUT', `/api/modify-pms/requests/${id}/submit`, {
        userId: 'current_user'
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/modify-pms/requests'] });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/modify-pms/requests/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/modify-pms/requests'] });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'components',
      reason: '',
      targetType: null,
      targetId: null,
      snapshotBeforeJson: null,
      proposedChangesJson: null,
      movePreviewJson: null,
      targetDisplay: null
    });
  };
  
  // Check if returning from target selection
  useEffect(() => {
    const returnWithTarget = sessionStorage.getItem('modifyPMS_returnWithTarget');
    const formDataStr = sessionStorage.getItem('modifyPMS_formData');
    const editingId = sessionStorage.getItem('modifyPMS_editingId');
    
    if (returnWithTarget === 'true' && formDataStr) {
      const savedFormData = JSON.parse(formDataStr);
      setFormData(savedFormData);
      
      // If we were editing, restore that state
      if (editingId && requests) {
        const requestToEdit = requests.find((r: ChangeRequest) => r.id === parseInt(editingId));
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

  const handleCreate = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const handleEdit = (request: ChangeRequest) => {
    setFormData({
      title: request.title,
      category: request.category,
      reason: request.reason,
      targetType: request.targetType || null,
      targetId: request.targetId || null,
      snapshotBeforeJson: request.snapshotBeforeJson || null,
      proposedChangesJson: request.proposedChangesJson || null,
      movePreviewJson: request.movePreviewJson || null,
      targetDisplay: request.snapshotBeforeJson ? {
        key: request.snapshotBeforeJson.displayKey,
        name: request.snapshotBeforeJson.displayName,
        path: request.snapshotBeforeJson.displayPath
      } : null
    });
    setEditingRequest(request);
  };

  const handleTargetSelect = async (targetType: string, targetId: string, payload: any) => {
    // The payload now contains the full structure with targetDisplay and snapshotBeforeJson
    const actualTargetType = payload.targetType || targetType;
    const actualTargetId = payload.targetId || targetId;
    const snapshot = payload.snapshotBeforeJson || payload;
    
    setFormData(prev => ({
      ...prev,
      targetType: actualTargetType,
      targetId: actualTargetId,
      snapshotBeforeJson: snapshot,
      targetDisplay: payload.targetDisplay
    }));
    
    // If editing an existing request, update it immediately
    if (editingRequest) {
      try {
        await apiRequest(`/api/modify-pms/requests/${editingRequest.id}/target`, {
          method: 'PUT',
          body: JSON.stringify({
            targetType: actualTargetType,
            targetId: actualTargetId,
            snapshotBeforeJson: snapshot
          })
        });
        
        // Refresh the request data
        queryClient.invalidateQueries({ queryKey: ['/api/modify-pms/requests'] });
      } catch (error) {
        console.error('Failed to update target:', error);
      }
    }
    
    setShowTargetPicker(false);
  };

  const getTargetIcon = (targetType?: string | null) => {
    switch (targetType) {
      case 'component': return <Package className="h-4 w-4" />;
      case 'work_order': return <ClipboardList className="h-4 w-4" />;
      case 'spare': return <Archive className="h-4 w-4" />;
      case 'store': return <Store className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTargetDisplayName = (request: ChangeRequest) => {
    if (!request.snapshotBeforeJson) return '-';
    const snapshot = request.snapshotBeforeJson;
    return `${snapshot.displayKey || ''} - ${snapshot.displayName || ''}`;
  };

  const handleView = async (request: ChangeRequest) => {
    // Fetch full details including comments and attachments
    const response = await fetch(`/api/modify-pms/requests/${request.id}`);
    if (response.ok) {
      const fullRequest = await response.json();
      setViewingRequest(fullRequest);
    }
  };

  const handleSave = () => {
    if (editingRequest) {
      updateMutation.mutate({ id: editingRequest.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getStatusBadge = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons];
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors]} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Modify PMS - Change Requests</h1>
        <p className="text-gray-600">Phase 1.0 - Request log and workflow management</p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="components">Components</SelectItem>
                  <SelectItem value="work_orders">Work Orders</SelectItem>
                  <SelectItem value="running_hours">Running Hours</SelectItem>
                  <SelectItem value="spares">Spares</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={handleCreate} className="w-full bg-[#52baf3]">
                <Plus className="w-4 h-4 mr-2" />
                New Change Request
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Change Requests</CardTitle>
          <CardDescription>
            Total: {requests.length} requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No change requests found. Click "New Change Request" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request: ChangeRequest) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono">CR{String(request.id).padStart(4, '0')}</TableCell>
                    <TableCell className="capitalize">{request.category.replace('_', ' ')}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.title}</TableCell>
                    <TableCell>
                      {request.targetType && request.snapshotBeforeJson ? (
                        <div className="flex items-center gap-1">
                          {getTargetIcon(request.targetType)}
                          <span className="text-sm truncate max-w-[150px]">
                            {getTargetDisplayName(request)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No target</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{request.requestedByUserId}</TableCell>
                    <TableCell>
                      {request.submittedAt 
                        ? new Date(request.submittedAt).toLocaleDateString() 
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(request)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {(request.status === 'draft' || request.status === 'returned') && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(request)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {request.reason && request.title && request.targetType && request.targetId && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => submitMutation.mutate(request.id)}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            )}
                            {request.status === 'draft' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteMutation.mutate(request.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || !!editingRequest} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setEditingRequest(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
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

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief description of the change (max 120 characters)"
                maxLength={120}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/120 characters
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="components">Components</SelectItem>
                  <SelectItem value="work_orders">Work Orders</SelectItem>
                  <SelectItem value="running_hours">Running Hours</SelectItem>
                  <SelectItem value="spares">Spares</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Change *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Detailed explanation of why this change is needed..."
                rows={6}
              />
            </div>

            <div>
              <Label>Target Selection *</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                {formData.targetType && formData.snapshotBeforeJson ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTargetIcon(formData.targetType)}
                      <div>
                        <p className="font-semibold">
                          {formData.snapshotBeforeJson.displayKey} - {formData.snapshotBeforeJson.displayName}
                        </p>
                        {formData.snapshotBeforeJson.displayPath && (
                          <p className="text-xs text-gray-500">
                            {formData.snapshotBeforeJson.displayPath}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Target Type: {formData.targetType?.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Store current form data in sessionStorage for retrieval when returning
                        sessionStorage.setItem('modifyPMS_formData', JSON.stringify(formData));
                        sessionStorage.setItem('modifyPMS_editingId', editingRequest?.id?.toString() || '');
                        sessionStorage.setItem('modifyPMS_selectMode', 'true');
                        
                        // Navigate to the appropriate sub-module
                        const routes = {
                          'components': '/pms/components',
                          'work_orders': '/pms/work-orders',
                          'spares': '/pms/spares',
                          'stores': '/pms/stores'
                        };
                        navigate(routes[formData.category as keyof typeof routes] || '/pms/components');
                      }}
                    >
                      Change Target
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">No target selected</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        // Store current form data in sessionStorage for retrieval when returning
                        sessionStorage.setItem('modifyPMS_formData', JSON.stringify(formData));
                        sessionStorage.setItem('modifyPMS_editingId', editingRequest?.id?.toString() || '');
                        sessionStorage.setItem('modifyPMS_selectMode', 'true');
                        
                        // Navigate to the appropriate sub-module
                        const routes = {
                          'components': '/pms/components',
                          'work_orders': '/pms/work-orders',
                          'spares': '/pms/spares',
                          'stores': '/pms/stores'
                        };
                        navigate(routes[formData.category as keyof typeof routes] || '/pms/components');
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Select Target
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {editingRequest?.status === 'returned' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-800">
                  This request was returned for clarification. Please review the comments and update accordingly.
                </p>
              </div>
            )}
            
            {/* Propose Changes Section - only show when target is selected and in draft/returned status */}
            {formData.targetType && formData.targetId && formData.snapshotBeforeJson && 
             (!editingRequest || editingRequest.status === 'draft' || editingRequest.status === 'returned') && (
              <div className="mt-6">
                <ProposeChanges
                  targetType={formData.targetType}
                  snapshotData={formData.snapshotBeforeJson}
                  existingProposedChanges={formData.proposedChangesJson || []}
                  existingMovePreview={formData.movePreviewJson}
                  onSaveProposed={(changes, movePreview) => {
                    setFormData(prev => ({
                      ...prev,
                      proposedChangesJson: changes,
                      movePreviewJson: movePreview
                    }));
                    // Save proposed changes to backend
                    if (editingRequest) {
                      fetch(`/api/modify-pms/requests/${editingRequest.id}/proposed`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          proposedChangesJson: changes,
                          movePreviewJson: movePreview
                        })
                      }).catch(console.error);
                    }
                  }}
                  disabled={editingRequest && editingRequest.status !== 'draft' && editingRequest.status !== 'returned'}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setEditingRequest(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.title || createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save as Draft'}
            </Button>
            {editingRequest && formData.title && formData.reason && formData.targetType && formData.targetId && 
             formData.proposedChangesJson && formData.proposedChangesJson.length > 0 && (
              <Button
                variant="default"
                onClick={() => {
                  handleSave();
                  // After saving, submit
                  setTimeout(() => {
                    if (editingRequest) {
                      submitMutation.mutate(editingRequest.id);
                    }
                  }, 500);
                }}
              >
                Save & Submit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingRequest} onOpenChange={(open) => {
        if (!open) setViewingRequest(null);
      }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Change Request CR{viewingRequest && String(viewingRequest.id).padStart(4, '0')}
            </DialogTitle>
          </DialogHeader>

          {viewingRequest && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="proposed">Proposed Changes</TabsTrigger>
                <TabsTrigger value="snapshot">Snapshot</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(viewingRequest.status)}</div>
                </div>

                <div>
                  <Label>Category</Label>
                  <p className="capitalize">{viewingRequest.category.replace('_', ' ')}</p>
                </div>

                <div>
                  <Label>Title</Label>
                  <p>{viewingRequest.title}</p>
                </div>

                <div>
                  <Label>Reason for Change</Label>
                  <p className="whitespace-pre-wrap">{viewingRequest.reason || 'No reason provided'}</p>
                </div>

                <div>
                  <Label>Target</Label>
                  {viewingRequest.targetType && viewingRequest.snapshotBeforeJson ? (
                    <Card className="mt-2">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          {getTargetIcon(viewingRequest.targetType)}
                          <div className="flex-1">
                            <p className="font-semibold">
                              {viewingRequest.snapshotBeforeJson.displayKey} - {viewingRequest.snapshotBeforeJson.displayName}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              Type: {viewingRequest.targetType?.replace('_', ' ').toUpperCase()}
                            </p>
                            {viewingRequest.snapshotBeforeJson.displayPath && (
                              <p className="text-sm text-gray-500">
                                Path: {viewingRequest.snapshotBeforeJson.displayPath}
                              </p>
                            )}
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(viewingRequest.snapshotBeforeJson.fields || {}).map(([key, value]: [string, any]) => (
                                <div key={key}>
                                  <span className="text-gray-500">{key}: </span>
                                  <span className="font-medium">{String(value) || '-'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <p className="text-gray-500">No target selected</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Requested By</Label>
                    <p>{viewingRequest.requestedByUserId}</p>
                  </div>
                  <div>
                    <Label>Created</Label>
                    <p>{new Date(viewingRequest.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {viewingRequest.submittedAt && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Submitted At</Label>
                      <p>{new Date(viewingRequest.submittedAt).toLocaleString()}</p>
                    </div>
                    {viewingRequest.reviewedAt && (
                      <div>
                        <Label>Reviewed At</Label>
                        <p>{new Date(viewingRequest.reviewedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                )}

                {viewingRequest.reviewedByUserId && (
                  <div>
                    <Label>Reviewed By</Label>
                    <p>{viewingRequest.reviewedByUserId}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="proposed">
                <div className="space-y-4">
                  {viewingRequest.proposedChangesJson && viewingRequest.proposedChangesJson.length > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Field</TableHead>
                            <TableHead>Current</TableHead>
                            <TableHead>Proposed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {viewingRequest.proposedChangesJson.map((change: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{change.label}</TableCell>
                              <TableCell>{String(change.before || '-')}</TableCell>
                              <TableCell className="text-blue-600 font-medium">
                                {String(change.after || '-')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      {viewingRequest.movePreviewJson && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Component Move (Preview)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs text-gray-500">From</Label>
                                  <p className="text-sm font-mono">{viewingRequest.movePreviewJson.oldPath}</p>
                                  <p className="text-xs text-gray-500 mt-1">Code: {viewingRequest.movePreviewJson.oldCode}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-500">To</Label>
                                  <p className="text-sm font-mono">{viewingRequest.movePreviewJson.newPath}</p>
                                  <p className="text-xs text-gray-500 mt-1">New Code: {viewingRequest.movePreviewJson.newCodePreview}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-gray-500 py-4">No changes proposed yet</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="snapshot">
                <div className="space-y-4">
                  {viewingRequest.snapshotBeforeJson ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Target Snapshot</CardTitle>
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
                            {Object.entries(viewingRequest.snapshotBeforeJson.fields || {}).map(([key, value]: [string, any]) => (
                              <TableRow key={key}>
                                <TableCell className="font-medium">{key}</TableCell>
                                <TableCell>{String(value || '-')}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ) : (
                    <p className="text-center text-gray-500 py-4">No snapshot available</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="comments">
                <div className="space-y-4">
                  {viewingRequest.comments && viewingRequest.comments.length > 0 ? (
                    viewingRequest.comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">{comment.userId}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">{comment.message}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No comments yet</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="attachments">
                <div className="space-y-2">
                  {viewingRequest.attachments && viewingRequest.attachments.length > 0 ? (
                    viewingRequest.attachments.map((attachment) => (
                      <Card key={attachment.id}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-center">
                            <span>{attachment.filename}</span>
                            <Button size="sm" variant="outline" asChild>
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No attachments</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button onClick={() => setViewingRequest(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Target Picker Dialog */}
      {showTargetPicker && (
        <TargetPicker
          open={showTargetPicker}
          onOpenChange={setShowTargetPicker}
          category={formData.category}
          vesselId={selectedVessel}
          onTargetSelect={handleTargetSelect}
        />
      )}
    </div>
  );
}