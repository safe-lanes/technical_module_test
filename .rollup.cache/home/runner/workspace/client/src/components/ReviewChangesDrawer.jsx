import { __awaiter, __generator } from "tslib";
import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChangeMode } from '@/contexts/ChangeModeContext';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
export var ReviewChangesDrawer = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, targetType = _a.targetType, targetId = _a.targetId;
    var _b = useChangeMode(), getDiffs = _b.getDiffs, changeRequestTitle = _b.changeRequestTitle, changeRequestCategory = _b.changeRequestCategory, originalSnapshot = _b.originalSnapshot, reset = _b.reset;
    var _c = useState(''), reason = _c[0], setReason = _c[1];
    var _d = useState(false), isSubmitting = _d[0], setIsSubmitting = _d[1];
    var _e = useLocation(), setLocation = _e[1];
    var toast = useToast().toast;
    var diffs = getDiffs();
    // Group diffs by section
    var groupedDiffs = diffs.reduce(function (acc, diff) {
        var section = diff.path.split('.')[0] || 'General';
        if (!acc[section])
            acc[section] = [];
        acc[section].push(diff);
        return acc;
    }, {});
    var handleSubmit = function (status) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!reason && status === 'submitted') {
                        toast({
                            title: 'Reason required',
                            description: 'Please provide a reason for this change request',
                            variant: 'destructive',
                        });
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, apiRequest('POST', '/api/change-requests', {
                            title: changeRequestTitle || 'Untitled Change Request',
                            category: changeRequestCategory || targetType,
                            targetType: targetType,
                            targetId: targetId,
                            status: status,
                            reason: reason,
                            diffs: diffs.map(function (d) { return ({
                                field_path: d.path,
                                old_value: d.oldVal,
                                new_value: d.newVal,
                            }); }),
                            originalSnapshot: originalSnapshot,
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        toast({
                            title: status === 'submitted' ? 'Change request submitted' : 'Draft saved',
                            description: status === 'submitted'
                                ? 'Your change request has been submitted for approval'
                                : 'Your change request has been saved as draft',
                        });
                        // Reset and navigate back
                        reset();
                        setLocation('/pms/modify-pms');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    toast({
                        title: 'Error',
                        description: 'Failed to submit change request',
                        variant: 'destructive',
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (!isOpen)
        return null;
    return (<div className='fixed inset-0 z-50 flex'>
      {/* Backdrop */}
      <div className='flex-1 bg-black/50' onClick={onClose}/>

      {/* Drawer */}
      <div className='w-[500px] bg-white shadow-xl flex flex-col'>
        {/* Header */}
        <div className='px-6 py-4 border-b'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Review Changes</h2>
            <Button variant='ghost' size='sm' onClick={onClose}>
              <X className='h-4 w-4'/>
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className='flex-1 px-6 py-4'>
          {/* Summary */}
          <div className='mb-6'>
            <h3 className='text-sm font-semibold mb-2'>Change Summary</h3>
            <p className='text-sm text-gray-600'>
              {diffs.length} field{diffs.length !== 1 ? 's' : ''} modified
            </p>
          </div>

          {/* Diffs grouped by section */}
          <div className='space-y-6'>
            {Object.entries(groupedDiffs).map(function (_a) {
            var section = _a[0], sectionDiffs = _a[1];
            return (<div key={section}>
                <h4 className='text-sm font-semibold mb-3'>{section}</h4>
                <div className='space-y-3'>
                  {sectionDiffs.map(function (diff, index) { return (<div key={index} className='bg-gray-50 rounded-lg p-3'>
                      <div className='text-xs font-medium text-gray-700 mb-1'>
                        {diff.path.split('.').pop()}
                      </div>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        <div>
                          <span className='text-xs text-gray-500'>Was:</span>
                          <div className='text-red-600'>
                            {String(diff.oldVal) || '-'}
                          </div>
                        </div>
                        <div>
                          <span className='text-xs text-gray-500'>New:</span>
                          <div className='text-green-600'>
                            {String(diff.newVal) || '-'}
                          </div>
                        </div>
                      </div>
                    </div>); })}
                </div>
              </div>);
        })}
          </div>

          {/* Reason for Change */}
          <div className='mt-6'>
            <Label htmlFor='reason' className='required'>
              Reason for Change
            </Label>
            <Textarea id='reason' value={reason} onChange={function (e) { return setReason(e.target.value); }} placeholder='Explain why this change is necessary...' rows={4} className='mt-2'/>
          </div>

          {/* File Upload (optional) */}
          <div className='mt-6'>
            <Label>Evidence/Documentation (Optional)</Label>
            <div className='mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center'>
              <Upload className='h-8 w-8 mx-auto text-gray-400 mb-2'/>
              <p className='text-sm text-gray-600'>
                Drag and drop files here, or click to browse
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className='px-6 py-4 border-t'>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant='outline' onClick={function () { return handleSubmit('draft'); }} disabled={isSubmitting}>
              Save Draft
            </Button>
            <Button onClick={function () { return handleSubmit('submitted'); }} disabled={isSubmitting || !reason}>
              Submit for Approval
            </Button>
          </div>
        </div>
      </div>
    </div>);
};
//# sourceMappingURL=ReviewChangesDrawer.jsx.map