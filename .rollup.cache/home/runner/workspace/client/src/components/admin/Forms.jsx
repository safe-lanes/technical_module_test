import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
export default function Forms() {
    var _a = useState('add-component'), activeTab = _a[0], setActiveTab = _a[1];
    return (<div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='add-component'>Add Component</TabsTrigger>
              <TabsTrigger value='wo-planned'>Work Order (Planned)</TabsTrigger>
              <TabsTrigger value='wo-unplanned'>
                Work Order (Unplanned)
              </TabsTrigger>
            </TabsList>

            <TabsContent value='add-component' className='mt-6'>
              <AddComponentFormContent />
            </TabsContent>

            <TabsContent value='wo-planned' className='mt-6'>
              <WorkOrderPlannedForm />
            </TabsContent>

            <TabsContent value='wo-unplanned' className='mt-6'>
              <WorkOrderUnplannedForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>);
}
// Add Component Form - Exact replica from screenshot
function AddComponentFormContent() {
    return (<div className='bg-white p-6 rounded-lg border'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold'>
          Component Register - Add Component
        </h3>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm'>
            Register Now
          </Button>
          <Button size='sm' className='bg-[#52baf3] hover:bg-[#4aa3d9]'>
            Edit Config
          </Button>
          <Button size='sm' className='bg-green-600 hover:bg-green-700'>
            Save Final
          </Button>
        </div>
      </div>

      {/* Version and Status Bar */}
      <div className='flex items-center gap-4 mb-4 text-sm'>
        <span>
          Version No: <strong>01</strong>
        </span>
        <span>
          Version Date: <strong>Select Date</strong>
        </span>
        <span>
          Status: <span className='text-green-600'>Draft</span>
        </span>
      </div>

      {/* Component Name */}
      <div className='mb-6'>
        <Label className='text-[#52baf3] font-medium mb-2 block'>
          Component Name
        </Label>
        <Input placeholder='Component Information' className='mb-4'/>

        <Button variant='outline' size='sm' className='text-[#52baf3]'>
          <Plus className='h-4 w-4 mr-1'/> Add Field
        </Button>
      </div>

      {/* Component Details Grid */}
      <div className='grid grid-cols-3 gap-4 mb-6'>
        <div>
          <Label>Maker</Label>
          <Input />
        </div>
        <div>
          <Label>Serial No</Label>
          <Input />
        </div>
        <div>
          <Label>Drawing No</Label>
          <Input />
        </div>
        <div>
          <Label>Component Code</Label>
          <Input placeholder='Maker / System Category'/>
        </div>
        <div>
          <Label>Location</Label>
          <Input />
        </div>
        <div>
          <Label>Critical</Label>
          <Input />
        </div>
        <div>
          <Label>Installation Date</Label>
          <Input type='date' placeholder='Commissioned Date'/>
        </div>
        <div>
          <Label>Model</Label>
          <Input />
        </div>
        <div>
          <Label>Condition Based</Label>
          <Input />
        </div>
        <div>
          <Label>EQ Group</Label>
          <Input placeholder='Eq/Sys / System Requirement'/>
        </div>
        <div>
          <Label>Parent Component</Label>
          <Input />
        </div>
        <div>
          <Label>Dimension/Size</Label>
          <Input />
        </div>
      </div>

      {/* Icon Fields with Blue Icons */}
      <div className='grid grid-cols-4 gap-4 mb-6'>
        <div className='flex items-center gap-2'>
          <span className='text-[#52baf3]'>✓</span>
          <Input placeholder='Date Field'/>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-[#52baf3]'>✓</span>
          <Input placeholder='Text Field'/>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-[#52baf3]'>✓</span>
          <Input placeholder='Select Field'/>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-[#52baf3]'>✓</span>
          <Input placeholder='Item Field'/>
        </div>
      </div>

      {/* Notes */}
      <div className='mb-6'>
        <Label>Notes</Label>
        <Textarea className='h-20'/>
      </div>

      {/* B. Running Hours & Condition Monitoring Metrics */}
      <div className='border-t pt-4 mb-6'>
        <h4 className='font-medium mb-4'>
          B. Running Hours & Condition Monitoring Metrics
        </h4>
        <div className='grid grid-cols-4 gap-4'>
          <div>
            <Label>Running Hours</Label>
            <Input />
          </div>
          <div>
            <Label>Date Updated</Label>
            <Input type='date' defaultValue='2025-08-04'/>
          </div>
          <div>
            <Label>Meters</Label>
            <Input />
          </div>
          <div>
            <Label>Status / Thresholds</Label>
            <Input />
          </div>
        </div>
      </div>

      {/* C. Work Orders */}
      <div className='border-t pt-4 mb-6'>
        <h4 className='font-medium mb-4'>C. Work Orders</h4>
        <div className='grid grid-cols-4 gap-4'>
          <div>
            <Label>WO No</Label>
            <Input />
          </div>
          <div>
            <Label>Job Title</Label>
            <Input />
          </div>
          <div>
            <Label>Assigned to</Label>
            <Input />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input />
          </div>
        </div>
        <div className='text-right mt-2'>
          <Button variant='link' className='text-[#52baf3]'>
            Status
          </Button>
        </div>
      </div>

      {/* D. Maintenance History */}
      <div className='border-t pt-4 mb-6'>
        <h4 className='font-medium mb-4'>D. Maintenance History</h4>
        <div className='grid grid-cols-4 gap-4'>
          <div>
            <Label>Work Order No</Label>
            <Input />
          </div>
          <div>
            <Label>Performed By</Label>
            <Input />
          </div>
          <div>
            <Label>Date Time Start</Label>
            <Input />
          </div>
          <div>
            <Label>Completion Date</Label>
            <Input />
          </div>
        </div>
        <div className='text-right mt-2'>
          <Button variant='link' className='text-[#52baf3]'>
            Status
          </Button>
        </div>
      </div>

      {/* E. Spares */}
      <div className='border-t pt-4 mb-6'>
        <h4 className='font-medium mb-4'>E. Spares</h4>
        <div className='grid grid-cols-4 gap-4'>
          <div>
            <Label>Part Code</Label>
            <Input />
          </div>
          <div>
            <Label>Part Name</Label>
            <Input />
          </div>
          <div>
            <Label>Min</Label>
            <Input />
          </div>
          <div>
            <Label>Critical</Label>
            <Input />
          </div>
        </div>
        <div className='text-right mt-2'>
          <Button variant='link' className='text-[#52baf3]'>
            Location
          </Button>
        </div>
      </div>

      {/* F. Drawings & Manuals */}
      <div className='border-t pt-4 mb-6'>
        <h4 className='font-medium mb-4'>F. Drawings & Manuals</h4>
        {/* Empty section as shown in screenshot */}
      </div>

      {/* G. Classification & Regulatory Data */}
      <div className='border-t pt-4 mb-6'>
        <h4 className='font-medium mb-4'>
          G. Classification & Regulatory Data
        </h4>
        <Button variant='outline' size='sm' className='text-[#52baf3]'>
          <Plus className='h-4 w-4 mr-1'/> Add Field
        </Button>

        <div className='grid grid-cols-3 gap-4 mt-4'>
          <div>
            <Label>Classification Society</Label>
            <Input />
          </div>
          <div>
            <Label>Certificate No</Label>
            <Input />
          </div>
          <div>
            <Label>Last Data Survey</Label>
            <Input />
          </div>
          <div>
            <Label>Classification Elements</Label>
            <Input />
          </div>
          <div>
            <Label>Class Code</Label>
            <Input />
          </div>
          <div>
            <Label>Next Data Survey</Label>
            <Input />
          </div>
          <div>
            <Label>Survey Type</Label>
            <Input />
          </div>
          <div>
            <Label>Information</Label>
            <Input />
          </div>
        </div>
      </div>

      {/* Icon Fields with Blue Icons - Bottom Section */}
      <div className='grid grid-cols-4 gap-4 mb-6'>
        <div className='flex items-center gap-2'>
          <span className='text-[#52baf3]'>✓</span>
          <Input placeholder='Item Field'/>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-[#52baf3]'>✓</span>
          <Input placeholder='Text Field'/>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-[#52baf3]'>✓</span>
          <Input placeholder='Date Field'/>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-[#52baf3]'>✓</span>
          <Input placeholder='Item Field'/>
        </div>
      </div>

      {/* H. Misc Records/Notes */}
      <div className='border-t pt-4 mb-6'>
        <h4 className='font-medium mb-4'>H. Misc Records/Notes</h4>
        <Button variant='outline' size='sm' className='text-[#52baf3] mb-4'>
          <Plus className='h-4 w-4 mr-1'/> Add Field
        </Button>

        <div className='grid grid-cols-4 gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-[#52baf3]'>✓</span>
            <Input placeholder='Date Field'/>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-[#52baf3]'>✓</span>
            <Input placeholder='Text Field'/>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-[#52baf3]'>✓</span>
            <Input placeholder='Item Field'/>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-[#52baf3]'>✓</span>
            <Input placeholder='Item Field'/>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className='flex justify-end'>
        <Button className='bg-green-600 hover:bg-green-700'>Save</Button>
      </div>
    </div>);
}
// Work Order Planned Form - Exact replica
function WorkOrderPlannedForm() {
    return (<div className='bg-white p-6 rounded-lg border'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold'>New Work Order Form (Planned)</h3>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm'>
            Configuration Mode
          </Button>
          <Button variant='destructive' size='sm'>
            Discard
          </Button>
          <Button size='sm' className='bg-[#52baf3] hover:bg-[#4aa3d9]'>
            Edit Config
          </Button>
          <Button size='sm' className='bg-green-600 hover:bg-green-700'>
            Save Final
          </Button>
        </div>
      </div>

      {/* Version Info */}
      <div className='flex items-center gap-4 mb-4 text-sm'>
        <span>
          Version No: <strong>01</strong>
        </span>
        <span>
          Version Date: <strong>Select Date</strong>
        </span>
        <span>
          Status: <span className='text-green-600'>Draft</span>
        </span>
      </div>

      {/* Part A - Work Order Details */}
      <div className='mb-6'>
        <h4 className='text-[#52baf3] font-semibold mb-4'>
          Part A - Work Order Details
        </h4>
        <p className='text-sm text-gray-600 mb-4'>
          Enter details related to the new work order
        </p>

        <div className='space-y-6'>
          {/* A1. Work Order Information */}
          <div>
            <h5 className='font-medium mb-3'>A1. Work Order Information</h5>
            <Button variant='outline' size='sm' className='text-[#52baf3] mb-3'>
              <Plus className='h-4 w-4 mr-1'/> Add Field
            </Button>

            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Label>Work Order</Label>
                <Input />
              </div>
              <div>
                <Label>Job Title</Label>
                <Input />
              </div>
              <div>
                <Label>Component ID</Label>
                <Input />
              </div>
              <div>
                <Label>Maintenance Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='preventive'>Preventive</SelectItem>
                    <SelectItem value='corrective'>Corrective</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category In</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='None'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rank</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='None'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Job Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='maintenance'>Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Done By/Visit</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Shore'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='shore'>Shore</SelectItem>
                    <SelectItem value='crew'>Crew</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Priority'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='high'>High</SelectItem>
                    <SelectItem value='medium'>Medium</SelectItem>
                    <SelectItem value='low'>Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Icon Fields */}
            <div className='grid grid-cols-4 gap-4 mt-4'>
              <div className='flex items-center gap-2'>
                <span className='text-[#52baf3]'>✓</span>
                <Input placeholder='Item Field'/>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-[#52baf3]'>✓</span>
                <Input placeholder='Item Field'/>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-[#52baf3]'>✓</span>
                <Input placeholder='Item Field'/>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-[#52baf3]'>✓</span>
                <Input placeholder='Select'/>
              </div>
            </div>
          </div>

          {/* Blank Work Description */}
          <div>
            <Label>Blank Work Description</Label>
            <Textarea className='h-20'/>
          </div>

          {/* Edit Work Description */}
          <div>
            <Label>Edit Work Description</Label>
            <Textarea className='h-20'/>
          </div>

          {/* A2. Safety Requirements */}
          <div>
            <h5 className='font-medium mb-3'>A2. Safety Requirements</h5>
            <div className='space-y-3'>
              <div>
                <Label>PPS Requirements</Label>
                <div className='flex items-center gap-4 mt-2'>
                  <RadioGroup defaultValue='safety-helmet'>
                    <div className='flex items-center gap-8'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='safety-helmet'/>
                        <Label>Safety Helmet [Enquire Gallery Helmet]</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div>
                <Label>Planned Requirements</Label>
                <div className='flex items-center space-x-2'>
                  <Checkbox />
                  <Label>Enclosed Space Entry Checklist</Label>
                </div>
              </div>
              <div>
                <Label>Other Safety Requirements</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Every Two'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='every-two'>Every Two</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Part B Work Completion Record */}
          <div className='border-t pt-6'>
            <h4 className='text-[#52baf3] font-semibold mb-4'>
              Part B Work Completion Record
            </h4>
            <p className='text-sm text-gray-600 mb-4'>
              Enter work completion details here including WO#, assessments,
              checklist(s), comments etc.
            </p>

            {/* B1. Risk Assessment, Checklists & Records */}
            <div className='mb-6'>
              <h5 className='font-medium mb-3'>
                B1. Risk Assessment, Checklists & Records
              </h5>
              <Button variant='outline' size='sm' className='text-[#52baf3] mb-3'>
                <Plus className='h-4 w-4 mr-1'/> Add Field
              </Button>

              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <Label>B1.1 Risk Assessment Completed / Reviewed</Label>
                  <RadioGroup defaultValue='yes'>
                    <div className='flex gap-4 mt-2'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='yes'/>
                        <Label>Yes</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='na'/>
                        <Label>N/A</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div className='col-span-2'>
                  <Label className='mb-2 block'>&nbsp;</Label>
                  <Button variant='outline' size='sm'>
                    Upload
                  </Button>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 mt-4'>
                <div>
                  <Label>
                    B1.2 Safety Checklist(s) Completed (as applicable)
                  </Label>
                  <RadioGroup defaultValue='yes'>
                    <div className='flex gap-4 mt-2'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='yes'/>
                        <Label>Yes</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='na'/>
                        <Label>N/A</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div className='col-span-2'>
                  <Label className='mb-2 block'>&nbsp;</Label>
                  <Button variant='outline' size='sm'>
                    Upload
                  </Button>
                </div>
              </div>

              <div className='mt-4'>
                <Label>B1.3 Operational Events Completed (as applicable)</Label>
                <Input placeholder='New Field' className='mt-2'/>
              </div>
            </div>

            {/* B2. Details of Work Carried Out */}
            <div className='mb-6'>
              <h5 className='font-medium mb-3'>
                B2. Details of Work Carried Out
              </h5>
              <Button variant='outline' size='sm' className='text-[#52baf3] mb-3'>
                <Plus className='h-4 w-4 mr-1'/> Add Field
              </Button>

              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <Label>B2.1 Work Duration</Label>
                  <div className='grid grid-cols-2 gap-2 mt-2'>
                    <div>
                      <Label className='text-xs'>From Date</Label>
                      <Input type='date'/>
                    </div>
                    <div>
                      <Label className='text-xs'>To Date</Label>
                      <Input type='date'/>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Assigned To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Chief Engineer'/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='chief-engineer'>
                        Chief Engineer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Component</Label>
                  <Input />
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 mt-4'>
                <div>
                  <Label>Job done</Label>
                  <Input />
                </div>
                <div>
                  <Label>Completed Date</Label>
                  <Input type='date'/>
                </div>
                <div>
                  <Label>Chief Engineer</Label>
                  <Input />
                </div>
              </div>

              <div className='grid grid-cols-4 gap-4 mt-4'>
                <Input placeholder='None Field'/>
                <Input placeholder='None Field'/>
                <Input placeholder='None Field'/>
                <Input placeholder='None Field'/>
              </div>

              {/* Icon Fields */}
              <div className='grid grid-cols-4 gap-4 mt-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-[#52baf3]'>✓</span>
                  <Input placeholder='Date Field'/>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-[#52baf3]'>✓</span>
                  <Input placeholder='Item Field'/>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-[#52baf3]'>✓</span>
                  <Input placeholder='Item Field'/>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-[#52baf3]'>✓</span>
                  <Input placeholder='Date Field'/>
                </div>
              </div>
            </div>

            {/* Work Carried Out */}
            <div className='mb-6'>
              <Label>Work Carried Out</Label>
              <Textarea className='h-20 mt-2'/>
            </div>

            {/* Job Experience / Notes */}
            <div className='mb-6'>
              <Label>Job Experience / Notes</Label>
              <Textarea className='h-20 mt-2'/>
            </div>

            {/* B3. Running Hours */}
            <div className='mb-6'>
              <h5 className='font-medium mb-3'>B3. Running Hours</h5>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <Label>Previous Reading</Label>
                  <Input />
                </div>
                <div>
                  <Label>Current Reading</Label>
                  <Input />
                </div>
                <div>
                  <Label>Updated By</Label>
                  <Input />
                </div>
              </div>
            </div>

            {/* B5. Spare Parts Component */}
            <div className='mb-6'>
              <h5 className='font-medium mb-3'>B5. Spare Parts Component</h5>
              <Button variant='outline' size='sm' className='text-[#52baf3] mb-3'>
                <Plus className='h-4 w-4 mr-1'/> Add Spare Part
              </Button>

              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <Label>Item No</Label>
                  <Input />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input />
                </div>
                <div>
                  <Label>Quantity Consumed</Label>
                  <Input />
                </div>
                <div>
                  <Label>Comments (if any)</Label>
                  <Input />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <Button className='bg-green-600 hover:bg-green-700'>Submit</Button>
      </div>
    </div>);
}
// Work Order Unplanned Form - Exact replica
function WorkOrderUnplannedForm() {
    return (<div className='bg-white p-6 rounded-lg border'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold'>Unplanned Work Order Form</h3>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm'>
            Configuration Mode
          </Button>
          <Button variant='destructive' size='sm'>
            Discard
          </Button>
          <Button size='sm' className='bg-[#52baf3] hover:bg-[#4aa3d9]'>
            Edit Config
          </Button>
          <Button size='sm' className='bg-green-600 hover:bg-green-700'>
            Save Final
          </Button>
        </div>
      </div>

      {/* Version Info */}
      <div className='flex items-center gap-4 mb-4 text-sm'>
        <span>
          Version No: <strong>01</strong>
        </span>
        <span>
          Version Date: <strong>Select Date</strong>
        </span>
        <span>
          Status: <span className='text-green-600'>Draft</span>
        </span>
      </div>

      {/* Work Order Details */}
      <div className='mb-6'>
        <h4 className='text-[#52baf3] font-semibold mb-4'>Work Order</h4>
        <div className='flex items-center gap-4'>
          <span className='text-gray-600'>Details</span>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='breakdown' checked/>
            <Label>Breakdown</Label>
          </div>
        </div>
      </div>

      {/* Part A - Work Order Details */}
      <div className='mb-6'>
        <h4 className='text-[#52baf3] font-semibold mb-4'>
          Part A - Work Order Details
        </h4>
        <p className='text-sm text-gray-600 mb-4'>
          Enter details related to the new work order
        </p>

        {/* A1. Work Order Information */}
        <div className='mb-6'>
          <h5 className='font-medium mb-3'>A1. Work Order Information</h5>
          <Button variant='outline' size='sm' className='text-[#52baf3] mb-3'>
            <Plus className='h-4 w-4 mr-1'/> Add Field
          </Button>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <Label>Work Order</Label>
              <Input />
            </div>
            <div>
              <Label>Job Title</Label>
              <Input />
            </div>
            <div>
              <Label>Component ID</Label>
              <Input />
            </div>
            <div>
              <Label>Maintenance Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Select'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='breakdown'>Breakdown</SelectItem>
                  <SelectItem value='corrective'>Corrective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category In</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='None'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rank</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='None'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Job Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Select'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='repair'>Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Done By/Visit</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Crew'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='crew'>Crew</SelectItem>
                  <SelectItem value='shore'>Shore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Select'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='urgent'>Urgent</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='low'>Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Icon Fields */}
          <div className='grid grid-cols-4 gap-4 mt-4'>
            <div className='flex items-center gap-2'>
              <span className='text-[#52baf3]'>✓</span>
              <Input placeholder='Item Field'/>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-[#52baf3]'>✓</span>
              <Input placeholder='Item Field'/>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-[#52baf3]'>✓</span>
              <Input placeholder='Item Field'/>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-[#52baf3]'>✓</span>
              <Input placeholder='Select'/>
            </div>
          </div>
        </div>

        {/* Blank Work Description */}
        <div className='mb-6'>
          <Label>Blank Work Description</Label>
          <Textarea className='h-20 mt-2'/>
        </div>

        {/* Edit Work Description */}
        <div className='mb-6'>
          <Label>Edit Work Description</Label>
          <Textarea className='h-20 mt-2'/>
        </div>

        {/* A2. Safety Requirements */}
        <div className='mb-6'>
          <h5 className='font-medium mb-3'>A2. Safety Requirements</h5>
          <div className='space-y-3'>
            <div>
              <Label>PPS Requirements</Label>
              <div className='flex items-center gap-4 mt-2'>
                <RadioGroup defaultValue='safety-helmet'>
                  <div className='flex items-center gap-8'>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='safety-helmet'/>
                      <Label>Safety Helmet [Enquire Gallery Helmet]</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div>
              <Label>Planned Requirements</Label>
              <div className='flex items-center space-x-2'>
                <Checkbox />
                <Label>Enclosed Space Entry Checklist</Label>
              </div>
            </div>
            <div>
              <Label>Other Safety Requirements</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Every Two'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='every-two'>Every Two</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Part B Work Completion Record */}
      <div className='border-t pt-6'>
        <h4 className='text-[#52baf3] font-semibold mb-4'>
          Part B Work Completion Record
        </h4>
        <p className='text-sm text-gray-600 mb-4'>
          Enter work completion details here including WO#, assessments,
          checklist(s), comments etc.
        </p>

        {/* B1. Risk Assessment, Checklists & Records */}
        <div className='mb-6'>
          <h5 className='font-medium mb-3'>
            B1. Risk Assessment, Checklists & Records
          </h5>
          <Button variant='outline' size='sm' className='text-[#52baf3] mb-3'>
            <Plus className='h-4 w-4 mr-1'/> Add Field
          </Button>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <Label>B1.1 Risk Assessment Completed / Reviewed</Label>
              <RadioGroup defaultValue='yes'>
                <div className='flex gap-4 mt-2'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='yes'/>
                    <Label>Yes</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='na'/>
                    <Label>N/A</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <div className='col-span-2'>
              <Label className='mb-2 block'>&nbsp;</Label>
              <Button variant='outline' size='sm'>
                Upload
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4 mt-4'>
            <div>
              <Label>B1.2 Safety Checklist(s) Completed (as applicable)</Label>
              <RadioGroup defaultValue='yes'>
                <div className='flex gap-4 mt-2'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='yes'/>
                    <Label>Yes</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='na'/>
                    <Label>N/A</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <div className='col-span-2'>
              <Label className='mb-2 block'>&nbsp;</Label>
              <Button variant='outline' size='sm'>
                Upload
              </Button>
            </div>
          </div>

          <div className='mt-4'>
            <Label>B1.3 Operational Events Completed (as applicable)</Label>
            <div className='flex items-center gap-4 mt-2'>
              <RadioGroup defaultValue='yes'>
                <div className='flex gap-4'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='yes'/>
                    <Label>Yes</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='na'/>
                    <Label>N/A</Label>
                  </div>
                </div>
              </RadioGroup>
              <Button variant='outline' size='sm'>
                Upload
              </Button>
            </div>
          </div>
        </div>

        {/* B2. Details of Work Carried Out */}
        <div className='mb-6'>
          <h5 className='font-medium mb-3'>B2. Details of Work Carried Out</h5>
          <Button variant='outline' size='sm' className='text-[#52baf3] mb-3'>
            <Plus className='h-4 w-4 mr-1'/> Add Field
          </Button>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <Label>B2.1 Work Duration</Label>
              <div className='grid grid-cols-2 gap-2 mt-2'>
                <div>
                  <Label className='text-xs'>From Date</Label>
                  <Input type='date'/>
                </div>
                <div>
                  <Label className='text-xs'>To Date</Label>
                  <Input type='date'/>
                </div>
              </div>
            </div>
            <div>
              <Label>Assigned To</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Chief Engineer'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='chief-engineer'>Chief Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Component</Label>
              <Input />
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4 mt-4'>
            <div>
              <Label>Job done</Label>
              <Input />
            </div>
            <div>
              <Label>Completed Date</Label>
              <Input type='date'/>
            </div>
            <div>
              <Label>Chief Engineer</Label>
              <Input />
            </div>
          </div>

          <div className='grid grid-cols-4 gap-4 mt-4'>
            <Input placeholder='None Field'/>
            <Input placeholder='None Field'/>
            <Input placeholder='None Field'/>
            <Input placeholder='None Field'/>
          </div>

          {/* Icon Fields */}
          <div className='grid grid-cols-4 gap-4 mt-4'>
            <div className='flex items-center gap-2'>
              <span className='text-[#52baf3]'>✓</span>
              <Input placeholder='Date Field'/>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-[#52baf3]'>✓</span>
              <Input placeholder='Item Field'/>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-[#52baf3]'>✓</span>
              <Input placeholder='Item Field'/>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-[#52baf3]'>✓</span>
              <Input placeholder='Date Field'/>
            </div>
          </div>
        </div>

        {/* Work Carried Out */}
        <div className='mb-6'>
          <Label>Work Carried Out</Label>
          <Textarea className='h-20 mt-2'/>
        </div>

        {/* Job Experience / Notes */}
        <div className='mb-6'>
          <Label>Job Experience / Notes</Label>
          <Textarea className='h-20 mt-2'/>
        </div>

        {/* B3. Running Hours */}
        <div className='mb-6'>
          <h5 className='font-medium mb-3'>B3. Running Hours</h5>
          <div className='grid grid-cols-3 gap-4'>
            <div>
              <Label>Previous Reading</Label>
              <Input />
            </div>
            <div>
              <Label>Current Reading</Label>
              <Input />
            </div>
            <div>
              <Label>Updated By</Label>
              <Input />
            </div>
          </div>
        </div>

        {/* B5. Spare Parts Component */}
        <div className='mb-6'>
          <h5 className='font-medium mb-3'>B5. Spare Parts Component</h5>
          <Button variant='outline' size='sm' className='text-[#52baf3] mb-3'>
            <Plus className='h-4 w-4 mr-1'/> Add Spare Part
          </Button>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <Label>Item No</Label>
              <Input />
            </div>
            <div>
              <Label>Description</Label>
              <Input />
            </div>
            <div>
              <Label>Quantity Consumed</Label>
              <Input />
            </div>
            <div>
              <Label>Comments (if any)</Label>
              <Input />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <Button className='bg-green-600 hover:bg-green-700'>Submit</Button>
      </div>
    </div>);
}
//# sourceMappingURL=Forms.jsx.map