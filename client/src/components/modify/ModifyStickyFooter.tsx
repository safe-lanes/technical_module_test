import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModifyStickyFooterProps {
  isVisible: boolean;
  hasChanges: boolean;
  changedFieldsCount: number;
  onCancel: () => void;
  onSubmitChangeRequest: () => void;
  isSubmitting?: boolean;
}

export function ModifyStickyFooter({ 
  isVisible, 
  hasChanges, 
  changedFieldsCount,
  onCancel, 
  onSubmitChangeRequest,
  isSubmitting = false 
}: ModifyStickyFooterProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300",
      isVisible ? "translate-y-0" : "translate-y-full"
    )}>
      <Card className="m-4 shadow-lg border-t-4 border-t-blue-500 bg-white">
        <div className="flex items-center justify-between p-4">
          {/* Left side - Status information */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                Modify Mode Active
              </span>
            </div>
            
            {hasChanges && (
              <div className="flex items-center space-x-1 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  {changedFieldsCount} field{changedFieldsCount !== 1 ? 's' : ''} modified
                </span>
              </div>
            )}
            
            {!hasChanges && (
              <span className="text-sm text-gray-500">
                No changes made yet
              </span>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            <Button 
              onClick={onSubmitChangeRequest}
              disabled={!hasChanges || isSubmitting}
              className="min-w-[160px] bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Change Request"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}