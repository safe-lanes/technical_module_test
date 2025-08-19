import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AddComponentForm from './AddComponentForm';

export default function Forms() {
  const [activeTab, setActiveTab] = useState('add-component');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add-component">Add Component</TabsTrigger>
              <TabsTrigger value="wo-planned">Work Order (Planned)</TabsTrigger>
              <TabsTrigger value="wo-unplanned">Work Order (Unplanned)</TabsTrigger>
            </TabsList>

            <TabsContent value="add-component" className="mt-6">
              <AddComponentForm />
            </TabsContent>

            <TabsContent value="wo-planned" className="mt-6">
              <WorkOrderPlannedForm />
            </TabsContent>

            <TabsContent value="wo-unplanned" className="mt-6">
              <WorkOrderUnplannedForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Work Order Planned Form Component
function WorkOrderPlannedForm() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">New Work Order Form (Planned)</h3>
        
        {/* Part A - Work Order Details */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3 text-blue-600">Part A - Work Order Details</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">WO Number *</label>
              <input type="text" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Component *</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Select Component</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Title *</label>
              <input type="text" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Work By *</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Select</option>
                <option>Crew</option>
                <option>Shore</option>
                <option>Contractor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Assigned To</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Select Person</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority *</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Planned Date *</label>
              <input type="date" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estimated Hours</label>
              <input type="number" className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
        </div>

        {/* Part B - Job Description */}
        <div>
          <h4 className="text-md font-medium mb-3 text-blue-600">Part B - Job Description & Instructions</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea className="w-full px-3 py-2 border rounded-md" rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instructions</label>
              <textarea className="w-full px-3 py-2 border rounded-md" rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Safety Precautions</label>
              <textarea className="w-full px-3 py-2 border rounded-md" rows={2}></textarea>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-100">Cancel</button>
          <button className="px-4 py-2 bg-[#52baf3] text-white rounded-md hover:bg-[#4aa3d9]">Save Draft</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Submit</button>
        </div>
      </div>
    </div>
  );
}

// Work Order Unplanned Form Component  
function WorkOrderUnplannedForm() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Unplanned Work Order Form</h3>
        
        {/* Part A - Breakdown Details */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3 text-blue-600">Part A - Breakdown Details</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">WO Number *</label>
              <input type="text" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Component *</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Select Component</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Breakdown Date *</label>
              <input type="datetime-local" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reported By *</label>
              <input type="text" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Severity *</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Impact on Operation *</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Operation Stopped</option>
                <option>Reduced Capacity</option>
                <option>No Impact</option>
              </select>
            </div>
          </div>
        </div>

        {/* Part B - Corrective Action */}
        <div>
          <h4 className="text-md font-medium mb-3 text-blue-600">Part B - Corrective Action</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Failure Description *</label>
              <textarea className="w-full px-3 py-2 border rounded-md" rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Root Cause</label>
              <textarea className="w-full px-3 py-2 border rounded-md" rows={2}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Corrective Action *</label>
              <textarea className="w-full px-3 py-2 border rounded-md" rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preventive Action</label>
              <textarea className="w-full px-3 py-2 border rounded-md" rows={2}></textarea>
            </div>
          </div>
        </div>

        {/* Part B Work Completion Record */}
        <div className="mt-6">
          <h4 className="text-md font-medium mb-3 text-blue-600">Part B Work Completion Record</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Risk Assessment Completed</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Yes</option>
                <option>No</option>
                <option>N/A</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Work Start Date/Time</label>
              <input type="datetime-local" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Work End Date/Time</label>
              <input type="datetime-local" className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-100">Cancel</button>
          <button className="px-4 py-2 bg-[#52baf3] text-white rounded-md hover:bg-[#4aa3d9]">Save Draft</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Submit</button>
        </div>
      </div>
    </div>
  );
}