import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ArrowLeft } from 'lucide-react';

interface AddComponentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddComponentForm({ open, onOpenChange }: AddComponentFormProps) {
  const [formData, setFormData] = useState({
    // Component Specs
    component: '',
    location: '',
    partNo: '',
    serialNo: '',
    componentCode: '',
    manufacturer: '',
    rating: '',
    installedDate: '',
    installBy: '',
    type: '',
    modelSpecification: '',
    blackoutComponent: '',
    
    // Running Hours & Condition Monitoring Metrics
    runningHours: '',
    conditionMonitoring: '',
    
    // Work Orders
    workBy: '',
    jobTitle: '',
    dueDateBy: '',
    dueDate: '',
    status: '',
    
    // Maintenance History
    serialNumber: '',
    performedBy: '',
    nextDueDate: '',
    completionDate: '',
    
    // Spares
    sparePart: '',
    partName: '',
    qty: '',
    critical: '',
    spareLocation: '',
    
    // Classification & Regulatory Data
    classificationSociety: '',
    certificateNo: '',
    lastClassDate: '',
    nextClassDate: '',
    classCode: '',
    classRemarks: '',
    classCode2: '',
    certificate: '',
    
    // New Service Notes
    serviceNote: '',
    noteDate: '',
    nextNote: '',
    noteLevel: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving component:', formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl font-semibold">
              Component Register - Add Component
            </DialogTitle>
            <Badge variant="secondary" className="ml-2">Configuration Mode</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm">
              Cancel
            </Button>
            <Button variant="outline" size="sm">
              Clear Form
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-[#52baf3] hover:bg-[#3da8e0] text-white"
              size="sm"
            >
              Save Form
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Component Specs Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Component Specs
                <Button variant="link" size="sm" className="text-blue-600 ml-auto">
                  Add Field
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="component">Component</Label>
                  <Input
                    id="component"
                    value={formData.component}
                    onChange={(e) => handleInputChange('component', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="part-no">Part No</Label>
                  <Input
                    id="part-no"
                    value={formData.partNo}
                    onChange={(e) => handleInputChange('partNo', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="serial-no">Serial No</Label>
                  <Input
                    id="serial-no"
                    value={formData.serialNo}
                    onChange={(e) => handleInputChange('serialNo', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="component-code">Component Code</Label>
                  <Input
                    id="component-code"
                    value={formData.componentCode}
                    onChange={(e) => handleInputChange('componentCode', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="installed-date">Installed Date</Label>
                  <Input
                    id="installed-date"
                    type="date"
                    value={formData.installedDate}
                    onChange={(e) => handleInputChange('installedDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="install-by">Install By</Label>
                  <Input
                    id="install-by"
                    value={formData.installBy}
                    onChange={(e) => handleInputChange('installBy', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="model-spec">Model Specification</Label>
                  <Input
                    id="model-spec"
                    value={formData.modelSpecification}
                    onChange={(e) => handleInputChange('modelSpecification', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="blackout">Blackout Component</Label>
                  <Select value={formData.blackoutComponent} onValueChange={(value) => handleInputChange('blackoutComponent', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Running Hours & Condition Monitoring Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Running Hours & Condition Monitoring Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="running-hours">Running Hours</Label>
                  <Input
                    id="running-hours"
                    value={formData.runningHours}
                    onChange={(e) => handleInputChange('runningHours', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="condition-monitoring">Condition Monitoring Metrics</Label>
                  <Input
                    id="condition-monitoring"
                    value={formData.conditionMonitoring}
                    onChange={(e) => handleInputChange('conditionMonitoring', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Work Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="work-by">Work By</Label>
                  <Input
                    id="work-by"
                    value={formData.workBy}
                    onChange={(e) => handleInputChange('workBy', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="due-date-by">Due Date By</Label>
                  <Input
                    id="due-date-by"
                    value={formData.dueDateBy}
                    onChange={(e) => handleInputChange('dueDateBy', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                Maintenance History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="serial-number">Serial Number</Label>
                  <Input
                    id="serial-number"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="performed-by">Performed By</Label>
                  <Input
                    id="performed-by"
                    value={formData.performedBy}
                    onChange={(e) => handleInputChange('performedBy', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="next-due">Next Due Date</Label>
                  <Input
                    id="next-due"
                    type="date"
                    value={formData.nextDueDate}
                    onChange={(e) => handleInputChange('nextDueDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="completion">Completion Date</Label>
                  <Input
                    id="completion"
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => handleInputChange('completionDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spares */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                Spares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="spare-part">Spare Part</Label>
                  <Input
                    id="spare-part"
                    value={formData.sparePart}
                    onChange={(e) => handleInputChange('sparePart', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="part-name">Part Name</Label>
                  <Input
                    id="part-name"
                    value={formData.partName}
                    onChange={(e) => handleInputChange('partName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="qty">Qty</Label>
                  <Input
                    id="qty"
                    type="number"
                    value={formData.qty}
                    onChange={(e) => handleInputChange('qty', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="critical">Critical</Label>
                  <Select value={formData.critical} onValueChange={(value) => handleInputChange('critical', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="spare-location">Location</Label>
                  <Input
                    id="spare-location"
                    value={formData.spareLocation}
                    onChange={(e) => handleInputChange('spareLocation', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Drawings & Manuals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                Drawings & Manuals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No drawings or manuals uploaded yet
              </div>
            </CardContent>
          </Card>

          {/* Classification & Regulatory Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
                Classification & Regulatory Data
                <Button variant="link" size="sm" className="text-blue-600 ml-auto">
                  Add Field
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="classification-society">Classification Society</Label>
                  <Input
                    id="classification-society"
                    value={formData.classificationSociety}
                    onChange={(e) => handleInputChange('classificationSociety', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="certificate-no">Certificate No</Label>
                  <Input
                    id="certificate-no"
                    value={formData.certificateNo}
                    onChange={(e) => handleInputChange('certificateNo', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="last-class">Last Class Date</Label>
                  <Input
                    id="last-class"
                    type="date"
                    value={formData.lastClassDate}
                    onChange={(e) => handleInputChange('lastClassDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="next-class">Next Class Date</Label>
                  <Input
                    id="next-class"
                    type="date"
                    value={formData.nextClassDate}
                    onChange={(e) => handleInputChange('nextClassDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="class-code">Class Code</Label>
                  <Input
                    id="class-code"
                    value={formData.classCode}
                    onChange={(e) => handleInputChange('classCode', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="class-remarks">Class Remarks</Label>
                  <Input
                    id="class-remarks"
                    value={formData.classRemarks}
                    onChange={(e) => handleInputChange('classRemarks', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="class-code-2">Class Code</Label>
                  <Input
                    id="class-code-2"
                    value={formData.classCode2}
                    onChange={(e) => handleInputChange('classCode2', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="certificate">Certificate</Label>
                  <Input
                    id="certificate"
                    value={formData.certificate}
                    onChange={(e) => handleInputChange('certificate', e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-center">
                <Button variant="outline" className="text-blue-600">
                  Add New Service
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* New Service Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">8</span>
                New Service Notes
                <Button variant="link" size="sm" className="text-blue-600 ml-auto">
                  Add Field
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="service-note">Service Note</Label>
                  <Input
                    id="service-note"
                    value={formData.serviceNote}
                    onChange={(e) => handleInputChange('serviceNote', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="note-date">Note Date</Label>
                  <Input
                    id="note-date"
                    type="date"
                    value={formData.noteDate}
                    onChange={(e) => handleInputChange('noteDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="next-note">Next Note</Label>
                  <Input
                    id="next-note"
                    type="date"
                    value={formData.nextNote}
                    onChange={(e) => handleInputChange('nextNote', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="note-level">Note Level</Label>
                  <Input
                    id="note-level"
                    value={formData.noteLevel}
                    onChange={(e) => handleInputChange('noteLevel', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save button at bottom */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}