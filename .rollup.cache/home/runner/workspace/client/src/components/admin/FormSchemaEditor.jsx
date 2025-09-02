import { __assign, __spreadArray } from "tslib";
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, X, Eye, Code, Settings, Plus, Trash2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
export default function FormSchemaEditor(_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange, version = _a.version, formName = _a.formName, onUpdate = _a.onUpdate;
    var _b = useState('visual'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = useState({ title: '', sections: [] }), schema = _c[0], setSchema = _c[1];
    var _d = useState(null), selectedSection = _d[0], setSelectedSection = _d[1];
    var _e = useState(false), publishDialogOpen = _e[0], setPublishDialogOpen = _e[1];
    var _f = useState(''), changelog = _f[0], setChangelog = _f[1];
    var toast = useToast().toast;
    useEffect(function () {
        if (version.schemaJson) {
            try {
                var parsed = JSON.parse(version.schemaJson);
                setSchema(parsed);
            }
            catch (error) {
                console.error('Failed to parse schema JSON:', error);
            }
        }
    }, [version.schemaJson]);
    // Update schema mutation
    var updateSchemaMutation = useMutation({
        mutationFn: function (schemaJson) {
            return apiRequest("/api/admin/forms/".concat(version.formId, "/versions/").concat(version.id, "/schema"), {
                method: 'PUT',
                body: JSON.stringify({ schemaJson: schemaJson }),
            });
        },
        onSuccess: function () {
            toast({
                title: 'Success',
                description: 'Schema saved successfully',
            });
            onUpdate();
        },
        onError: function (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to save schema',
                variant: 'destructive',
            });
        },
    });
    // Publish version mutation
    var publishMutation = useMutation({
        mutationFn: function (changelog) {
            return apiRequest("/api/admin/forms/".concat(version.formId, "/versions/").concat(version.id, "/publish"), {
                method: 'POST',
                body: JSON.stringify({ userId: 'admin', changelog: changelog }),
            });
        },
        onSuccess: function () {
            toast({
                title: 'Success',
                description: 'Version published successfully',
            });
            setPublishDialogOpen(false);
            onUpdate();
            onOpenChange(false);
        },
        onError: function (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to publish version',
                variant: 'destructive',
            });
        },
    });
    // Discard draft mutation
    var discardMutation = useMutation({
        mutationFn: function () {
            return apiRequest("/api/admin/forms/".concat(version.formId, "/versions/").concat(version.id, "/discard"), {
                method: 'POST',
            });
        },
        onSuccess: function () {
            toast({
                title: 'Success',
                description: 'Draft discarded',
            });
            onUpdate();
            onOpenChange(false);
        },
        onError: function (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to discard draft',
                variant: 'destructive',
            });
        },
    });
    var handleSave = function () {
        updateSchemaMutation.mutate(JSON.stringify(schema));
    };
    var handlePublish = function () {
        if (!changelog) {
            toast({
                title: 'Error',
                description: 'Please enter a changelog',
                variant: 'destructive',
            });
            return;
        }
        publishMutation.mutate(changelog);
    };
    var handleDiscard = function () {
        if (confirm('Are you sure you want to discard this draft? All changes will be lost.')) {
            discardMutation.mutate();
        }
    };
    var addSection = function () {
        var newSection = {
            key: "section_".concat(Date.now()),
            title: 'New Section',
            layout: 'grid-2',
            fields: []
        };
        setSchema(__assign(__assign({}, schema), { sections: __spreadArray(__spreadArray([], schema.sections, true), [newSection], false) }));
    };
    var updateSection = function (index, section) {
        var newSections = __spreadArray([], schema.sections, true);
        newSections[index] = section;
        setSchema(__assign(__assign({}, schema), { sections: newSections }));
    };
    var deleteSection = function (index) {
        var newSections = schema.sections.filter(function (_, i) { return i !== index; });
        setSchema(__assign(__assign({}, schema), { sections: newSections }));
    };
    var addField = function (sectionIndex) {
        var newField = {
            key: "field_".concat(Date.now()),
            label: 'New Field',
            type: 'text',
            required: false
        };
        var newSections = __spreadArray([], schema.sections, true);
        newSections[sectionIndex].fields.push(newField);
        setSchema(__assign(__assign({}, schema), { sections: newSections }));
    };
    var updateField = function (sectionIndex, fieldIndex, field) {
        var newSections = __spreadArray([], schema.sections, true);
        newSections[sectionIndex].fields[fieldIndex] = field;
        setSchema(__assign(__assign({}, schema), { sections: newSections }));
    };
    var deleteField = function (sectionIndex, fieldIndex) {
        var newSections = __spreadArray([], schema.sections, true);
        newSections[sectionIndex].fields = newSections[sectionIndex].fields.filter(function (_, i) { return i !== fieldIndex; });
        setSchema(__assign(__assign({}, schema), { sections: newSections }));
    };
    return (<>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  Form Schema Editor - {formName}
                </DialogTitle>
                <DialogDescription>
                  Version {version.versionNo} ({version.status})
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                {version.status === 'DRAFT' && (<>
                    <Button variant="outline" size="sm" onClick={handleDiscard}>
                      <X className="h-4 w-4 mr-1"/>
                      Discard
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1"/>
                      Save
                    </Button>
                    <Button size="sm" onClick={function () { return setPublishDialogOpen(true); }} style={{ backgroundColor: '#52baf3', color: 'white' }}>
                      Publish
                    </Button>
                  </>)}
              </div>
            </div>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList>
              <TabsTrigger value="visual">
                <Settings className="h-4 w-4 mr-2"/>
                Visual Editor
              </TabsTrigger>
              <TabsTrigger value="json">
                <Code className="h-4 w-4 mr-2"/>
                JSON Editor
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2"/>
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual" className="flex-1 overflow-y-auto">
              <div className="space-y-4 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Form Sections</h3>
                  <Button size="sm" onClick={addSection}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Add Section
                  </Button>
                </div>
                
                {schema.sections.map(function (section, sIndex) { return (<Card key={section.key}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge style={{ backgroundColor: '#52baf3', color: 'white' }}>
                            {section.key}
                          </Badge>
                          <Input value={section.title} onChange={function (e) { return updateSection(sIndex, __assign(__assign({}, section), { title: e.target.value })); }} className="max-w-xs"/>
                        </div>
                        <div className="flex gap-2">
                          <Select value={section.layout} onValueChange={function (value) { return updateSection(sIndex, __assign(__assign({}, section), { layout: value })); }}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grid-1">Single Column</SelectItem>
                              <SelectItem value="grid-2">2 Columns</SelectItem>
                              <SelectItem value="grid-3">3 Columns</SelectItem>
                              <SelectItem value="grid-4">4 Columns</SelectItem>
                              <SelectItem value="grid-5">5 Columns</SelectItem>
                              <SelectItem value="file-upload">File Upload</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="icon" variant="ghost" onClick={function () { return deleteSection(sIndex); }}>
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <Label>Fields</Label>
                          <Button size="sm" variant="outline" onClick={function () { return addField(sIndex); }}>
                            <Plus className="h-3 w-3 mr-1"/>
                            Add Field
                          </Button>
                        </div>
                        {section.fields.map(function (field, fIndex) { return (<div key={field.key} className="flex gap-2 items-center p-2 border rounded">
                            <Input value={field.key} onChange={function (e) { return updateField(sIndex, fIndex, __assign(__assign({}, field), { key: e.target.value })); }} placeholder="Field Key" className="w-32"/>
                            <Input value={field.label} onChange={function (e) { return updateField(sIndex, fIndex, __assign(__assign({}, field), { label: e.target.value })); }} placeholder="Label" className="flex-1"/>
                            <Select value={field.type} onValueChange={function (value) { return updateField(sIndex, fIndex, __assign(__assign({}, field), { type: value })); }}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="datetime">DateTime</SelectItem>
                                <SelectItem value="select">Select</SelectItem>
                                <SelectItem value="textarea">Textarea</SelectItem>
                                <SelectItem value="checkbox">Checkbox</SelectItem>
                                <SelectItem value="radio">Radio</SelectItem>
                                <SelectItem value="file">File</SelectItem>
                                <SelectItem value="repeater">Repeater</SelectItem>
                              </SelectContent>
                            </Select>
                            <label className="flex items-center gap-1">
                              <input type="checkbox" checked={field.required} onChange={function (e) { return updateField(sIndex, fIndex, __assign(__assign({}, field), { required: e.target.checked })); }}/>
                              Required
                            </label>
                            <Button size="icon" variant="ghost" onClick={function () { return deleteField(sIndex, fIndex); }}>
                              <Trash2 className="h-3 w-3"/>
                            </Button>
                          </div>); })}
                      </div>
                    </CardContent>
                  </Card>); })}
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="flex-1 overflow-y-auto">
              <div className="p-4">
                <textarea className="w-full h-full min-h-[500px] p-4 font-mono text-sm border rounded" value={JSON.stringify(schema, null, 2)} onChange={function (e) {
            try {
                var newSchema = JSON.parse(e.target.value);
                setSchema(newSchema);
            }
            catch (error) {
                // Invalid JSON, don't update
            }
        }}/>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold mb-4">{schema.title || formName}</h3>
                  {schema.sections.map(function (section) { return (<div key={section.key} className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge style={{ backgroundColor: '#52baf3', color: 'white' }}>
                          {section.key}
                        </Badge>
                        <h4 className="text-lg font-medium">{section.title}</h4>
                      </div>
                      <div className={"grid gap-4 ".concat(section.layout === 'grid-1' ? 'grid-cols-1' :
                section.layout === 'grid-2' ? 'grid-cols-2' :
                    section.layout === 'grid-3' ? 'grid-cols-3' :
                        section.layout === 'grid-4' ? 'grid-cols-4' :
                            section.layout === 'grid-5' ? 'grid-cols-5' :
                                'grid-cols-1')}>
                        {section.fields.map(function (field) { return (<div key={field.key}>
                            <Label>
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            {field.type === 'textarea' ? (<textarea className="w-full p-2 border rounded mt-1" rows={3} disabled/>) : field.type === 'select' ? (<Select disabled>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select..."/>
                                </SelectTrigger>
                              </Select>) : (<Input type={field.type} disabled className="mt-1"/>)}
                          </div>); })}
                      </div>
                    </div>); })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Form Version</DialogTitle>
            <DialogDescription>
              Enter a changelog to describe the changes in this version. This will make the current published version archived.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="changelog">Changelog *</Label>
              <textarea id="changelog" className="w-full px-3 py-2 border rounded-md mt-1" rows={4} placeholder="Describe what changed in this version..." value={changelog} onChange={function (e) { return setChangelog(e.target.value); }}/>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={function () { return setPublishDialogOpen(false); }}>
              Cancel
            </Button>
            <Button onClick={handlePublish} disabled={!changelog} style={{ backgroundColor: '#52baf3', color: 'white' }}>
              Publish Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>);
}
//# sourceMappingURL=FormSchemaEditor.jsx.map