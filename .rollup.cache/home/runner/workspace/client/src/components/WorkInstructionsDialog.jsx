import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
var WorkInstructionsDialog = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose;
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold text-[#16569e]">
            Work Instructions
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-[#52baf3]">
            Add work instructions - Text or Copy Paste from Manuals
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Section One</h4>
              <p className="text-sm text-gray-600 mb-2">
                Follow below instruction when carrying out the task:
              </p>
              <div className="ml-4 space-y-1">
                <p className="text-sm text-gray-700">1. Step 1</p>
                <p className="text-sm text-gray-700">2. Step 2</p>
                <p className="text-sm text-gray-700">3. Step 3</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Section Two</h4>
              <p className="text-sm text-gray-600 mb-2">
                Follow below instruction when carrying out the task:
              </p>
              <div className="ml-4 space-y-1">
                <p className="text-sm text-gray-700">1. Step 1</p>
                <p className="text-sm text-gray-700">2. Step 2</p>
                <p className="text-sm text-gray-700">3. Step 3</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>);
};
export default WorkInstructionsDialog;
//# sourceMappingURL=WorkInstructionsDialog.jsx.map