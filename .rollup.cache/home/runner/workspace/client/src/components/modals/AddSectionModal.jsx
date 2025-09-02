import { __assign } from "tslib";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { ChevronDown, ChevronRight } from 'lucide-react';
var AddSectionModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSave = _a.onSave, nextSectionLetter = _a.nextSectionLetter;
    var _b = useState(''), sectionTitle = _b[0], setSectionTitle = _b[1];
    var _c = useState(false), addFirstField = _c[0], setAddFirstField = _c[1];
    var _d = useState({
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
    }), firstFieldData = _d[0], setFirstFieldData = _d[1];
    var handleSave = function () {
        if (!sectionTitle) {
            return;
        }
        var sectionData = {
            id: "section-".concat(nextSectionLetter),
            title: "".concat(nextSectionLetter, ". ").concat(sectionTitle),
            fields: [],
        };
        // Add first field if specified
        if (addFirstField && firstFieldData.label) {
            var fieldKey = firstFieldData.label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_|_$/g, '');
            var suffix = Math.random().toString(36).substring(2, 6);
            sectionData.fields.push({
                id: "field_".concat(Date.now()),
                key: "".concat(fieldKey, "_").concat(suffix),
                label: firstFieldData.label,
                type: firstFieldData.type,
                required: firstFieldData.required,
                placeholder: firstFieldData.placeholder,
                active: true,
                locked: false,
            });
        }
        onSave(sectionData);
        // Reset form
        setSectionTitle('');
        setAddFirstField(false);
        setFirstFieldData({
            label: '',
            type: 'text',
            required: false,
            placeholder: '',
        });
        onClose();
    };
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Section Title */}
          <div className="space-y-2">
            <Label>Section Title *</Label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-[#16569e]">{nextSectionLetter}.</span>
              <Input value={sectionTitle} onChange={function (e) { return setSectionTitle(e.target.value); }} placeholder="e.g., Vendor Extras" className="flex-1"/>
            </div>
          </div>

          {/* Add First Field Option */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <button onClick={function () { return setAddFirstField(!addFirstField); }} className="flex items-center gap-2 text-sm font-medium">
                {addFirstField ? (<ChevronDown className="h-4 w-4"/>) : (<ChevronRight className="h-4 w-4"/>)}
                Add first field now (optional)
              </button>
            </div>

            {addFirstField && (<div className="ml-6 space-y-4 p-4 border rounded-lg bg-gray-50">
                {/* Field Label */}
                <div className="space-y-2">
                  <Label>Field Label</Label>
                  <Input value={firstFieldData.label} onChange={function (e) { return setFirstFieldData(function (prev) { return (__assign(__assign({}, prev), { label: e.target.value })); }); }} placeholder="Field Label"/>
                </div>

                {/* Field Type */}
                <div className="space-y-2">
                  <Label>Field Type</Label>
                  <Select value={firstFieldData.type} onValueChange={function (value) { return setFirstFieldData(function (prev) { return (__assign(__assign({}, prev), { type: value })); }); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Required */}
                <div className="flex items-center space-x-2">
                  <Switch checked={firstFieldData.required} onCheckedChange={function (checked) { return setFirstFieldData(function (prev) { return (__assign(__assign({}, prev), { required: checked })); }); }}/>
                  <Label>Required</Label>
                </div>

                {/* Placeholder */}
                <div className="space-y-2">
                  <Label>Placeholder</Label>
                  <Input value={firstFieldData.placeholder} onChange={function (e) { return setFirstFieldData(function (prev) { return (__assign(__assign({}, prev), { placeholder: e.target.value })); }); }} placeholder="Optional placeholder text"/>
                </div>
              </div>)}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!sectionTitle}>
            Create Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
};
export default AddSectionModal;
//# sourceMappingURL=AddSectionModal.jsx.map