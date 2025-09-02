import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, X, Edit, Trash2, Plus } from 'lucide-react';

interface WorkOrdersChangeRequestFormProps {
  onClose: () => void;
  onSubmit?: (workOrderData: any) => void;
  initialData?: any;
}

const WorkOrdersChangeRequestForm: React.FC<
  WorkOrdersChangeRequestFormProps
> = ({ onClose, onSubmit, initialData = {} }) => {
  const [workOrderData, setWorkOrderData] = useState({
    workOrderNo: initialData.workOrderNo || 'WO-2025-001',
    title: initialData.title || 'Main Engine Overhaul - Replace Main bearings',
    component: initialData.component || 'Main Engine #1',
    maintenanceType: initialData.maintenanceType || 'Planned Maintenance',
    assignedTo: initialData.assignedTo || '2nd Eng',
    approver: initialData.approver || 'Chief Engineer',
    jobCategory: initialData.jobCategory || 'Mechanical',
    classRelated: initialData.classRelated || 'No',
    status: initialData.status || 'In Progress',
    briefWorkDescription:
      initialData.briefWorkDescription ||
      'Complete overhaul of main engine bearings as per maintenance schedule',
    ppeRequirements:
      initialData.ppeRequirements || 'Safety Helmet, Safety Gloves',
    permitRequirements: initialData.permitRequirements || 'Hot Work Permit',
    otherSafetyRequirements: initialData.otherSafetyRequirements || '',
    priority: initialData.priority || 'High',
    workType: initialData.workType || 'Planned Maintenance',
    department: initialData.department || 'Engine',
    location: initialData.location || 'Engine Room',
    estimatedHours: initialData.estimatedHours || '24',
    actualHours: initialData.actualHours || '',
    startDate: initialData.startDate || '2025-01-15',
    targetDate: initialData.targetDate || '2025-01-20',
    completionDate: initialData.completionDate || '',
    notes: initialData.notes || '',
  });

  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());

  const handleInputChange = (field: string, value: string) => {
    setWorkOrderData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Track changed fields for red highlighting
    const initialValue = initialData[field];

    if (value !== initialValue) {
      setChangedFields(prev => new Set([...Array.from(prev), field]));
    } else {
      setChangedFields(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(field);
        return newSet;
      });
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(workOrderData);
      onClose();
    }
  };

  const getInputStyle = (field: string) => {
    const isChanged = changedFields.has(field);
    return isChanged
      ? 'text-red-500 border-red-500'
      : 'border-[#52baf3] focus:border-[#52baf3] focus:ring-[#52baf3]';
  };

  const getLabelStyle = () => 'text-[#52baf3] text-sm font-medium mb-2 block';

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden'>
        {/* Modal Header */}
        <div className='flex items-center justify-between p-6 border-b border-[#52baf3]'>
          <h2 className='text-xl font-semibold text-[#52baf3]'>
            Work Order - Change Request
          </h2>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            className='hover:bg-gray-100'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className='flex-1 overflow-auto p-6'>
          {/* A1. Work Order Information */}
          <div className='border border-[#52baf3] rounded-lg p-4 mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='text-md font-medium text-[#52baf3]'>
                A1. Work Order Information
              </h4>
              <div className='flex gap-2'>
                <Edit className='h-4 w-4 text-[#52baf3] cursor-pointer' />
                <Trash2 className='h-4 w-4 text-[#52baf3] cursor-pointer' />
                <Plus className='h-4 w-4 text-[#52baf3] cursor-pointer' />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-6'>
              {/* Row 1 */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm text-[#52baf3]'>Work Order</Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Input
                  value={workOrderData.workOrderNo}
                  onChange={e =>
                    handleInputChange('workOrderNo', e.target.value)
                  }
                  className={`text-sm ${getInputStyle('workOrderNo')}`}
                />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm text-[#52baf3]'>Job Title</Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Input
                  value={workOrderData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  className={`text-sm ${getInputStyle('title')}`}
                  placeholder='Main Engine - Replace Fuel Filters'
                />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm text-[#52baf3]'>Component</Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Select
                  value={workOrderData.component}
                  onValueChange={value => handleInputChange('component', value)}
                >
                  <SelectTrigger
                    className={`text-sm ${getInputStyle('component')}`}
                  >
                    <SelectValue placeholder='601.002 Main Engine' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='601.002 Main Engine'>
                      601.002 Main Engine
                    </SelectItem>
                    <SelectItem value='602.001 Diesel Generator 1'>
                      602.001 Diesel Generator 1
                    </SelectItem>
                    <SelectItem value='603.001 Steering Gear'>
                      603.001 Steering Gear
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 2 */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm text-[#52baf3]'>
                    Maintenance Type
                  </Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Select
                  value={workOrderData.maintenanceType}
                  onValueChange={value =>
                    handleInputChange('maintenanceType', value)
                  }
                >
                  <SelectTrigger
                    className={`text-sm ${getInputStyle('maintenanceType')}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Planned Maintenance'>
                      Planned Maintenance
                    </SelectItem>
                    <SelectItem value='Preventive Maintenance'>
                      Preventive Maintenance
                    </SelectItem>
                    <SelectItem value='Corrective Maintenance'>
                      Corrective Maintenance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm text-[#52baf3]'>Assigned To</Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Select
                  value={workOrderData.assignedTo}
                  onValueChange={value =>
                    handleInputChange('assignedTo', value)
                  }
                >
                  <SelectTrigger
                    className={`text-sm ${getInputStyle('assignedTo')}`}
                  >
                    <SelectValue placeholder='Rank' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Chief Engineer'>
                      Chief Engineer
                    </SelectItem>
                    <SelectItem value='2nd Engineer'>2nd Engineer</SelectItem>
                    <SelectItem value='3rd Engineer'>3rd Engineer</SelectItem>
                    <SelectItem value='4th Engineer'>4th Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm text-[#52baf3]'>Approver</Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Select
                  value={workOrderData.approver}
                  onValueChange={value => handleInputChange('approver', value)}
                >
                  <SelectTrigger
                    className={`text-sm ${getInputStyle('approver')}`}
                  >
                    <SelectValue placeholder='Rank' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Chief Engineer'>
                      Chief Engineer
                    </SelectItem>
                    <SelectItem value='Captain'>Captain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 3 */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm text-[#52baf3]'>Job Category</Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Select
                  value={workOrderData.jobCategory}
                  onValueChange={value =>
                    handleInputChange('jobCategory', value)
                  }
                >
                  <SelectTrigger
                    className={`text-sm ${getInputStyle('jobCategory')}`}
                  >
                    <SelectValue placeholder='Mechanical' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Mechanical'>Mechanical</SelectItem>
                    <SelectItem value='Electrical'>Electrical</SelectItem>
                    <SelectItem value='Hydraulic'>Hydraulic</SelectItem>
                    <SelectItem value='Safety'>Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm text-[#52baf3]'>
                    Class Related
                  </Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Select
                  value={workOrderData.classRelated}
                  onValueChange={value =>
                    handleInputChange('classRelated', value)
                  }
                >
                  <SelectTrigger
                    className={`text-sm ${getInputStyle('classRelated')}`}
                  >
                    <SelectValue placeholder='Yes' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Yes'>Yes</SelectItem>
                    <SelectItem value='No'>No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm text-[#52baf3]'>Status</Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Input
                  value={workOrderData.status}
                  onChange={e => handleInputChange('status', e.target.value)}
                  className={`text-sm ${getInputStyle('status')}`}
                  placeholder='Status'
                />
              </div>
            </div>

            {/* Brief Work Description */}
            <div className='mt-6'>
              <div className='flex items-center gap-2 mb-2'>
                <Label className='text-sm text-[#52baf3]'>
                  Brief Work Description
                </Label>
                <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
              </div>
              <Textarea
                value={workOrderData.briefWorkDescription}
                onChange={e =>
                  handleInputChange('briefWorkDescription', e.target.value)
                }
                className={`text-sm ${getInputStyle('briefWorkDescription')}`}
                rows={3}
                placeholder='Add Work description'
              />
            </div>
          </div>

          {/* A2. Required Spare Parts */}
          <div className='border border-[#52baf3] rounded-lg p-4 mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='text-md font-medium text-[#52baf3]'>
                A2. Required Spare Parts
              </h4>
              <div className='flex gap-2'>
                <Edit className='h-4 w-4 text-[#52baf3] cursor-pointer' />
                <Trash2 className='h-4 w-4 text-[#52baf3] cursor-pointer' />
                <Plus className='h-4 w-4 text-[#52baf3] cursor-pointer' />
              </div>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full border-collapse'>
                <thead>
                  <tr className='border-b border-[#52baf3]'>
                    <th className='text-left p-3 text-sm font-medium text-[#52baf3]'>
                      Part No
                    </th>
                    <th className='text-left p-3 text-sm font-medium text-[#52baf3]'>
                      Description
                    </th>
                    <th className='text-left p-3 text-sm font-medium text-[#52baf3]'>
                      Quantity Required
                    </th>
                    <th className='text-left p-3 text-sm font-medium text-[#52baf3]'>
                      ROB
                    </th>
                    <th className='text-left p-3 text-sm font-medium text-[#52baf3]'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-b border-gray-100'>
                    <td className='p-3'>
                      <Input
                        className={`text-sm ${getInputStyle('partNo1')}`}
                        placeholder='SP-001'
                      />
                    </td>
                    <td className='p-3'>
                      <Input
                        className={`text-sm ${getInputStyle('description1')}`}
                        placeholder='O-Ring Seal'
                      />
                    </td>
                    <td className='p-3'>
                      <Input
                        className={`text-sm ${getInputStyle('quantity1')}`}
                        placeholder='2'
                      />
                    </td>
                    <td className='p-3'>
                      <Input
                        className={`text-sm ${getInputStyle('rob1')}`}
                        placeholder='5'
                      />
                    </td>
                    <td className='p-3'>
                      <Select>
                        <SelectTrigger
                          className={`text-sm ${getInputStyle('status1')}`}
                        >
                          <SelectValue placeholder='Available' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Available'>Available</SelectItem>
                          <SelectItem value='Order Required'>
                            Order Required
                          </SelectItem>
                          <SelectItem value='Critical'>Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                  <tr className='border-b border-gray-100'>
                    <td className='p-3'>
                      <Input
                        className={`text-sm ${getInputStyle('partNo2')}`}
                        placeholder='SP-002'
                      />
                    </td>
                    <td className='p-3'>
                      <Input
                        className={`text-sm ${getInputStyle('description2')}`}
                        placeholder='Filter Element'
                      />
                    </td>
                    <td className='p-3'>
                      <Input
                        className={`text-sm ${getInputStyle('quantity2')}`}
                        placeholder='1'
                      />
                    </td>
                    <td className='p-3'>
                      <Input
                        className={`text-sm ${getInputStyle('rob2')}`}
                        placeholder='3'
                      />
                    </td>
                    <td className='p-3'>
                      <Select>
                        <SelectTrigger
                          className={`text-sm ${getInputStyle('status2')}`}
                        >
                          <SelectValue placeholder='Available' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Available'>Available</SelectItem>
                          <SelectItem value='Order Required'>
                            Order Required
                          </SelectItem>
                          <SelectItem value='Critical'>Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className='mt-4 flex justify-center'>
                <Button
                  className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
                  size='sm'
                >
                  <Plus className='h-4 w-4 mr-2' />+ Add Spare Part
                </Button>
              </div>
            </div>
          </div>

          {/* A3. Job Instructions & Procedures */}
          <div className='border border-[#52baf3] rounded-lg p-4 mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='text-md font-medium text-[#52baf3]'>
                A3. Job Instructions & Procedures
              </h4>
              <div className='flex gap-2'>
                <Edit className='h-4 w-4 text-[#52baf3] cursor-pointer' />
                <Trash2 className='h-4 w-4 text-[#52baf3] cursor-pointer' />
                <Plus className='h-4 w-4 text-[#52baf3] cursor-pointer' />
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <Label className='text-sm text-[#52baf3]'>
                    Work Instructions:
                  </Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Textarea
                  className={`text-sm ${getInputStyle('workInstructions')}`}
                  rows={4}
                  placeholder='Detailed step-by-step instructions for completing the work'
                />
              </div>
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <Label className='text-sm text-[#52baf3]'>
                    Reference Procedures:
                  </Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Input
                  className={`text-sm ${getInputStyle('referenceProcedures')}`}
                  placeholder='Reference manual sections, procedures, or technical bulletins'
                />
              </div>
            </div>
          </div>

          {/* A4. Safety Requirements */}
          <div className='border border-[#52baf3] rounded-lg p-4 mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='text-md font-medium text-[#52baf3]'>
                A4. Safety Requirements
              </h4>
              <div className='flex gap-2'>
                <Edit className='h-4 w-4 text-[#52baf3] cursor-pointer' />
                <Trash2 className='h-4 w-4 text-[#52baf3] cursor-pointer' />
                <Plus className='h-4 w-4 text-[#52baf3] cursor-pointer' />
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <Label className='text-sm text-[#52baf3]'>
                    PPE Requirements:
                  </Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Input
                  value={workOrderData.ppeRequirements}
                  onChange={e =>
                    handleInputChange('ppeRequirements', e.target.value)
                  }
                  className={`text-sm ${getInputStyle('ppeRequirements')}`}
                  placeholder='[Leather Gloves] [Goggles] [Safety Helmet]'
                />
              </div>
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <Label className='text-sm text-[#52baf3]'>
                    Permit Requirements:
                  </Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Input
                  value={workOrderData.permitRequirements}
                  onChange={e =>
                    handleInputChange('permitRequirements', e.target.value)
                  }
                  className={`text-sm ${getInputStyle('permitRequirements')}`}
                  placeholder='[Enclosed Space Entry Permit]'
                />
              </div>
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <Label className='text-sm text-[#52baf3]'>
                    Other Safety Requirements:
                  </Label>
                  <Edit className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                  <Trash2 className='h-3 w-3 text-[#52baf3] cursor-pointer' />
                </div>
                <Input
                  value={workOrderData.otherSafetyRequirements}
                  onChange={e =>
                    handleInputChange('otherSafetyRequirements', e.target.value)
                  }
                  className={`text-sm ${getInputStyle('otherSafetyRequirements')}`}
                  placeholder='Free Text'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className='flex justify-end gap-3 p-4 border-t bg-gray-50'>
          <Button
            variant='outline'
            onClick={onClose}
            className='border-[#52baf3] text-[#52baf3] hover:bg-[#52baf3] hover:text-white'
          >
            Cancel
          </Button>
          <Button
            className='bg-[#52baf3] hover:bg-[#40a8e0] text-white'
            onClick={handleSubmit}
          >
            Save Change Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkOrdersChangeRequestForm;
