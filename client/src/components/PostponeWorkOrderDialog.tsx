import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";

interface PostponeWorkOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: {
    workOrderNo: string;
    component: string;
    jobTitle: string;
    dueDate: string;
  } | null;
}

const PostponeWorkOrderDialog: React.FC<PostponeWorkOrderDialogProps> = ({
  isOpen,
  onClose,
  workOrder,
}) => {
  const [formData, setFormData] = useState({
    workOrderId: "",
    component: "",
    jobTitle: "",
    originalDueDate: "",
    reasonForPostponement: "",
    authorizedBy: "",
    approvalRemarks: "",
    nextDueDate: "",
    durationOfPostponement: "5 Days",
    informOfficer: false,
    attachDocument: false,
  });

  React.useEffect(() => {
    if (workOrder) {
      setFormData({
        workOrderId: workOrder.workOrderNo,
        component: workOrder.component,
        jobTitle: workOrder.jobTitle,
        originalDueDate: workOrder.dueDate,
        reasonForPostponement: "",
        authorizedBy: "",
        approvalRemarks: "",
        nextDueDate: "",
        durationOfPostponement: "5 Days",
        informOfficer: false,
        attachDocument: false,
      });
    }
  }, [workOrder]);

  const handleSubmit = () => {
    // Handle form submission
    console.log("Postpone work order:", formData);
    onClose();
  };

  if (!workOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Postpone Work Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Row 1: Work Order ID and Component */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="workOrderId">Work Order ID</Label>
              <Input
                id="workOrderId"
                value={formData.workOrderId}
                onChange={(e) => setFormData({ ...formData, workOrderId: e.target.value })}
                className="bg-gray-50"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="component">Component</Label>
              <Input
                id="component"
                value={formData.component}
                onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                className="bg-gray-50"
                readOnly
              />
            </div>
          </div>

          {/* Row 2: Job Title and Inform Officer */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="bg-gray-50"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label></Label>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="informOfficer"
                  checked={formData.informOfficer}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, informOfficer: checked as boolean })
                  }
                />
                <Label htmlFor="informOfficer" className="text-sm">Inform Officer</Label>
              </div>
            </div>
          </div>

          {/* Row 3: Original Due Date */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="originalDueDate">Original Due Date</Label>
              <Input
                id="originalDueDate"
                value={formData.originalDueDate}
                onChange={(e) => setFormData({ ...formData, originalDueDate: e.target.value })}
                className="bg-gray-50"
                readOnly
              />
            </div>
            <div></div>
          </div>

          {/* Row 4: Reason for Postponement */}
          <div className="space-y-2">
            <Label htmlFor="reasonForPostponement">Reason for Postponement</Label>
            <Textarea
              id="reasonForPostponement"
              value={formData.reasonForPostponement}
              onChange={(e) => setFormData({ ...formData, reasonForPostponement: e.target.value })}
              className="min-h-[80px]"
              placeholder="Enter reason for postponement..."
            />
          </div>

          {/* Row 5: Authorized By */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="authorizedBy">Authorized By</Label>
              <Select 
                value={formData.authorizedBy} 
                onValueChange={(value) => setFormData({ ...formData, authorizedBy: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select authorizer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chief-engineer">Chief Engineer</SelectItem>
                  <SelectItem value="2nd-engineer">2nd Engineer</SelectItem>
                  <SelectItem value="3rd-engineer">3rd Engineer</SelectItem>
                  <SelectItem value="captain">Captain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div></div>
          </div>

          {/* Row 6: Approval Remarks */}
          <div className="space-y-2">
            <Label htmlFor="approvalRemarks">Approval Remarks (Optional)</Label>
            <Textarea
              id="approvalRemarks"
              value={formData.approvalRemarks}
              onChange={(e) => setFormData({ ...formData, approvalRemarks: e.target.value })}
              className="min-h-[60px]"
              placeholder="Enter approval remarks..."
            />
          </div>

          {/* Row 7: Next Due Date and Duration */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nextDueDate">Next Due Date</Label>
              <Input
                id="nextDueDate"
                type="date"
                value={formData.nextDueDate}
                onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                placeholder="dd-mm-yyyy"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationOfPostponement">Duration of Postponement</Label>
              <Select 
                value={formData.durationOfPostponement} 
                onValueChange={(value) => setFormData({ ...formData, durationOfPostponement: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Day">1 Day</SelectItem>
                  <SelectItem value="3 Days">3 Days</SelectItem>
                  <SelectItem value="5 Days">5 Days</SelectItem>
                  <SelectItem value="1 Week">1 Week</SelectItem>
                  <SelectItem value="2 Weeks">2 Weeks</SelectItem>
                  <SelectItem value="1 Month">1 Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 8: Attach Document */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attachDocument"
                checked={formData.attachDocument}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, attachDocument: checked as boolean })
                }
              />
              <Label htmlFor="attachDocument" className="text-sm">Attach Document (Optional)</Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white"
          >
            Confirm Postpone
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostponeWorkOrderDialog;