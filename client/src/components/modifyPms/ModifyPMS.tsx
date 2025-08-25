import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Package, FileText, Archive, ArrowLeft, Eye, Check, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface ModifyOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const modifyOptions: ModifyOption[] = [
  {
    id: 'components',
    title: 'Components',
    description: 'Modify component hierarchy and details',
    icon: <Wrench className="h-6 w-6" />,
    route: '/pms/components?modify=1'
  },
  {
    id: 'work-orders',
    title: 'Work Orders Planned',
    description: 'Edit planned maintenance schedules',
    icon: <FileText className="h-6 w-6" />,
    route: '/pms/work-orders?modify=1'
  },
  {
    id: 'spares',
    title: 'Spares',
    description: 'Update spare parts inventory',
    icon: <Package className="h-6 w-6" />,
    route: '/pms/spares?modify=1'
  },
  {
    id: 'stores',
    title: 'Stores',
    description: 'Manage store inventory items',
    icon: <Archive className="h-6 w-6" />,
    route: '/pms/stores?modify=1'
  }
];

type ViewMode = 'dashboard' | 'pending' | 'history';

interface ChangeRequest {
  id: number;
  vesselId: string;
  category: string;
  title: string;
  reason: string;
  status: 'draft' | 'submitted' | 'returned' | 'approved' | 'rejected';
  requestedByUserId: string;
  submittedAt: Date | null;
  reviewedByUserId: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function ModifyPMS() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ModifyOption | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [viewingRequest, setViewingRequest] = useState<ChangeRequest | null>(null);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const handleOptionSelect = (option: ModifyOption) => {
    setSelectedOption(option);
  };

  const handleProceed = () => {
    if (selectedOption) {
      // Navigate to the selected module with modify flag
      setLocation(selectedOption.route);
    }
  };

  const handleCancel = () => {
    setSelectedOption(null);
    setIsModalOpen(false);
  };

  // Fetch change requests for pending and history views
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['/api/change-requests', currentView],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('vesselId', 'V001');
      
      if (currentView === 'pending') {
        params.append('status', 'submitted');
      } else if (currentView === 'history') {
        // Get approved and rejected requests
        const approvedResponse = await fetch(`/api/change-requests?${params}&status=approved`);
        const rejectedResponse = await fetch(`/api/change-requests?${params}&status=rejected`);
        
        if (approvedResponse.ok && rejectedResponse.ok) {
          const approved = await approvedResponse.json();
          const rejected = await rejectedResponse.json();
          return [...approved, ...rejected];
        }
        return [];
      }
      
      const response = await fetch(`/api/change-requests?${params}`);
      if (!response.ok) throw new Error('Failed to fetch requests');
      return response.json();
    },
    enabled: currentView !== 'dashboard'
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-500',
      submitted: 'bg-blue-500',
      returned: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    
    return (
      <Badge className={`${colors[status as keyof typeof colors]} text-white`}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async ({ id, comment }: { id: number; comment: string }) => {
      const response = await fetch(`/api/change-requests/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment, reviewerId: 'current_user' })
      });
      if (!response.ok) throw new Error('Failed to approve request');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/change-requests'] });
      setViewingRequest(null);
      toast({
        title: "Request approved",
        description: "The change request has been approved successfully"
      });
    },
    onError: () => {
      toast({
        title: "Approval failed",
        description: "Failed to approve the change request",
        variant: "destructive"
      });
    }
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, comment }: { id: number; comment: string }) => {
      const response = await fetch(`/api/change-requests/${id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment, reviewerId: 'current_user' })
      });
      if (!response.ok) throw new Error('Failed to reject request');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/change-requests'] });
      setViewingRequest(null);
      toast({
        title: "Request rejected",
        description: "The change request has been rejected"
      });
    },
    onError: () => {
      toast({
        title: "Rejection failed",
        description: "Failed to reject the change request",
        variant: "destructive"
      });
    }
  });

  const handleApprove = (request: ChangeRequest) => {
    const comment = prompt('Please provide approval comments:');
    if (comment) {
      approveMutation.mutate({ id: request.id, comment });
    }
  };

  const handleReject = (request: ChangeRequest) => {
    const comment = prompt('Please provide a reason for rejection:');
    if (comment) {
      rejectMutation.mutate({ id: request.id, comment });
    }
  };

  if (currentView === 'pending') {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Pending Requests</h1>
            <p className="text-muted-foreground mt-2">
              Change requests awaiting approval
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending requests found.
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request: ChangeRequest) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell className="capitalize">{request.category.replace('_', ' ')}</TableCell>
                      <TableCell>{request.requestedByUserId}</TableCell>
                      <TableCell>
                        {request.submittedAt 
                          ? new Date(request.submittedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit' 
                            })
                          : new Date(request.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit' 
                            })}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingRequest(request)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(request)}
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request)}
                            disabled={rejectMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        {/* Request Details Dialog */}
        {viewingRequest && (
          <Dialog open={!!viewingRequest} onOpenChange={(open) => !open && setViewingRequest(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Change Request Details
                </DialogTitle>
                <DialogDescription>
                  Review the proposed changes and approve or reject this request.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Title</Label>
                    <p className="text-sm font-medium">{viewingRequest.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Category</Label>
                    <p className="text-sm capitalize">{viewingRequest.category.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Requested By</Label>
                    <p className="text-sm">{viewingRequest.requestedByUserId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className="pt-1">{getStatusBadge(viewingRequest.status)}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Reason</Label>
                  <p className="text-sm mt-1">{viewingRequest.reason}</p>
                </div>

                <Tabs defaultValue="changes" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="changes">Proposed Changes</TabsTrigger>
                    <TabsTrigger value="snapshot">Current State</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="changes" className="space-y-4">
                    {viewingRequest.proposedChangesJson && viewingRequest.proposedChangesJson.length > 0 ? (
                      <div className="space-y-4">
                        {viewingRequest.proposedChangesJson.map((change: any, index: number) => (
                          <Card key={index} className="border-l-4 border-l-orange-500">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                Field: <span className="font-mono text-blue-600">{change.field}</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs text-gray-500">Current Value</Label>
                                  <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                                    {String(change.oldValue || '-')}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-500">Proposed Value</Label>
                                  <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                                    {String(change.newValue || '-')}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No specific field changes recorded
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="snapshot" className="space-y-4">
                    {viewingRequest.snapshotBeforeJson ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Target Item Details</CardTitle>
                          <CardDescription>
                            {viewingRequest.snapshotBeforeJson.displayPath || 'Item snapshot at time of request'}
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
                                  <TableCell className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</TableCell>
                                  <TableCell>{String(value || '-')}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No snapshot available
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(viewingRequest)}
                    disabled={approveMutation.isPending}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {approveMutation.isPending ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(viewingRequest)}
                    disabled={rejectMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setViewingRequest(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  if (currentView === 'history') {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Request History</h1>
            <p className="text-muted-foreground mt-2">
              Approved and rejected change requests
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No historical requests found.
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Reviewed By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request: ChangeRequest) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell className="capitalize">{request.category.replace('_', ' ')}</TableCell>
                      <TableCell>{request.requestedByUserId}</TableCell>
                      <TableCell>{request.reviewedByUserId || '-'}</TableCell>
                      <TableCell>
                        {request.reviewedAt 
                          ? new Date(request.reviewedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit' 
                            })
                          : new Date(request.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit' 
                            })}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Modify PMS</h1>
        <p className="text-muted-foreground mt-2">
          Create change requests to modify PMS data. Changes require approval before being applied.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              New Change Request
            </CardTitle>
            <CardDescription>
              Create a new modification request for PMS data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Select the module you want to modify and navigate to the specific item to propose changes.
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => setCurrentView('pending')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              Pending Requests
            </CardTitle>
            <CardDescription>
              View and manage your pending change requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track the status of your submitted change requests and respond to reviewer feedback.
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => setCurrentView('history')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-green-500" />
              Request History
            </CardTitle>
            <CardDescription>
              View approved and rejected requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access the complete history of all change requests including approved and rejected items.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2-Step Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedOption ? 'Confirm Selection' : 'Select Module to Modify'}
            </DialogTitle>
            <DialogDescription>
              {selectedOption 
                ? `You will be navigated to ${selectedOption.title} in modify mode.`
                : 'Choose which PMS module you want to modify.'}
            </DialogDescription>
          </DialogHeader>

          {!selectedOption ? (
            // Step 1: Module Selection
            <div className="grid gap-4 py-4">
              {modifyOptions.map((option) => (
                <Card
                  key={option.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleOptionSelect(option)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{option.icon}</div>
                      <div>
                        <CardTitle className="text-base">{option.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            // Step 2: Confirmation
            <div className="py-6">
              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-primary">{selectedOption.icon}</div>
                    <div>
                      <CardTitle>{selectedOption.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {selectedOption.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">What happens next:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You'll navigate to the {selectedOption.title} module</li>
                  <li>• Select the specific item you want to modify</li>
                  <li>• Make your changes (highlighted in blue and red)</li>
                  <li>• Submit your change request for approval</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedOption ? (
              <>
                <Button variant="outline" onClick={() => setSelectedOption(null)}>
                  Back
                </Button>
                <Button onClick={handleProceed}>
                  Proceed to {selectedOption.title}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}