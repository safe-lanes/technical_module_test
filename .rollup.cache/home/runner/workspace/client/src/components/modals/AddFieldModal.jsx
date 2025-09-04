import { __assign, __spreadArray } from 'tslib';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
var AddFieldModal = function (_a) {
  var isOpen = _a.isOpen,
    onClose = _a.onClose,
    onSave = _a.onSave,
    section = _a.section,
    existingKeys = _a.existingKeys,
    _b = _a.isAdmin,
    isAdmin = _b === void 0 ? true : _b;
  var _c = useState({
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      defaultValue: '',
      unit: '',
      validation: {
        min: undefined,
        max: undefined,
        minDate: '',
        maxDate: '',
        regex: '',
        maxLength: undefined,
      },
      options: [],
      key: '',
    }),
    fieldData = _c[0],
    setFieldData = _c[1];
  var _d = useState({ value: '', label: '' }),
    newOption = _d[0],
    setNewOption = _d[1];
  // Auto-generate field key from label
  useEffect(
    function () {
      if (fieldData.label && !fieldData.key) {
        var slug_1 = fieldData.label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_|_$/g, '');
        var suffix_1 = Math.random().toString(36).substring(2, 6);
        setFieldData(function (prev) {
          return __assign(__assign({}, prev), {
            key: ''.concat(slug_1, '_').concat(suffix_1),
          });
        });
      }
    },
    [fieldData.label]
  );
  var handleAddOption = function () {
    if (newOption.value && newOption.label) {
      setFieldData(function (prev) {
        return __assign(__assign({}, prev), {
          options: __spreadArray(
            __spreadArray([], prev.options, true),
            [newOption],
            false
          ),
        });
      });
      setNewOption({ value: '', label: '' });
    }
  };
  var handleRemoveOption = function (index) {
    setFieldData(function (prev) {
      return __assign(__assign({}, prev), {
        options: prev.options.filter(function (_, i) {
          return i !== index;
        }),
      });
    });
  };
  var handleSave = function () {
    if (!fieldData.label || !fieldData.type) {
      return;
    }
    if (existingKeys.includes(fieldData.key)) {
      alert('Field key must be unique within the form');
      return;
    }
    onSave(
      __assign(__assign({}, fieldData), {
        id: 'field_'.concat(Date.now()),
        section: section,
        active: true,
        locked: false,
      })
    );
    // Reset form
    setFieldData({
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      defaultValue: '',
      unit: '',
      validation: {
        min: undefined,
        max: undefined,
        minDate: '',
        maxDate: '',
        regex: '',
        maxLength: undefined,
      },
      options: [],
      key: '',
    });
    onClose();
  };
  var isValid =
    fieldData.label &&
    fieldData.type &&
    fieldData.key &&
    !existingKeys.includes(fieldData.key);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add Field to Section {section}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Label */}
          <div className='space-y-2'>
            <Label>Label *</Label>
            <Input
              value={fieldData.label}
              onChange={function (e) {
                return setFieldData(function (prev) {
                  return __assign(__assign({}, prev), {
                    label: e.target.value,
                  });
                });
              }}
              placeholder='Field Label'
            />
          </div>

          {/* Data Type */}
          <div className='space-y-2'>
            <Label>Data Type *</Label>
            <Select
              value={fieldData.type}
              onValueChange={function (value) {
                return setFieldData(function (prev) {
                  return __assign(__assign({}, prev), { type: value });
                });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='text'>Text</SelectItem>
                <SelectItem value='textarea'>Textarea</SelectItem>
                <SelectItem value='number'>Number</SelectItem>
                <SelectItem value='date'>Date</SelectItem>
                <SelectItem value='boolean'>Boolean</SelectItem>
                <SelectItem value='select'>Select</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Required */}
          <div className='flex items-center space-x-2'>
            <Switch
              checked={fieldData.required}
              onCheckedChange={function (checked) {
                return setFieldData(function (prev) {
                  return __assign(__assign({}, prev), { required: checked });
                });
              }}
            />
            <Label>Required</Label>
          </div>

          {/* Placeholder/Help Text */}
          <div className='space-y-2'>
            <Label>Placeholder / Help Text</Label>
            <Input
              value={fieldData.placeholder}
              onChange={function (e) {
                return setFieldData(function (prev) {
                  return __assign(__assign({}, prev), {
                    placeholder: e.target.value,
                  });
                });
              }}
              placeholder='Optional help text'
            />
          </div>

          {/* Default Value */}
          <div className='space-y-2'>
            <Label>Default Value</Label>
            <Input
              value={fieldData.defaultValue}
              onChange={function (e) {
                return setFieldData(function (prev) {
                  return __assign(__assign({}, prev), {
                    defaultValue: e.target.value,
                  });
                });
              }}
              placeholder='Default value for this field'
            />
          </div>

          {/* Unit (UOM) */}
          <div className='space-y-2'>
            <Label>Unit (UOM)</Label>
            <Input
              value={fieldData.unit}
              onChange={function (e) {
                return setFieldData(function (prev) {
                  return __assign(__assign({}, prev), { unit: e.target.value });
                });
              }}
              placeholder='e.g., kg, hours, °C'
            />
          </div>

          {/* Validation based on type */}
          {fieldData.type === 'number' && (
            <div className='space-y-2'>
              <Label>Validation</Label>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm'>Min</Label>
                  <Input
                    type='number'
                    value={fieldData.validation.min || ''}
                    onChange={function (e) {
                      return setFieldData(function (prev) {
                        return __assign(__assign({}, prev), {
                          validation: __assign(__assign({}, prev.validation), {
                            min: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }),
                        });
                      });
                    }}
                  />
                </div>
                <div>
                  <Label className='text-sm'>Max</Label>
                  <Input
                    type='number'
                    value={fieldData.validation.max || ''}
                    onChange={function (e) {
                      return setFieldData(function (prev) {
                        return __assign(__assign({}, prev), {
                          validation: __assign(__assign({}, prev.validation), {
                            max: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }),
                        });
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {fieldData.type === 'date' && (
            <div className='space-y-2'>
              <Label>Validation</Label>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm'>Min Date</Label>
                  <Input
                    type='date'
                    value={fieldData.validation.minDate}
                    onChange={function (e) {
                      return setFieldData(function (prev) {
                        return __assign(__assign({}, prev), {
                          validation: __assign(__assign({}, prev.validation), {
                            minDate: e.target.value,
                          }),
                        });
                      });
                    }}
                  />
                </div>
                <div>
                  <Label className='text-sm'>Max Date</Label>
                  <Input
                    type='date'
                    value={fieldData.validation.maxDate}
                    onChange={function (e) {
                      return setFieldData(function (prev) {
                        return __assign(__assign({}, prev), {
                          validation: __assign(__assign({}, prev.validation), {
                            maxDate: e.target.value,
                          }),
                        });
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {(fieldData.type === 'text' || fieldData.type === 'textarea') && (
            <div className='space-y-2'>
              <Label>Validation</Label>
              <div className='space-y-2'>
                <div>
                  <Label className='text-sm'>Max Length</Label>
                  <Input
                    type='number'
                    value={fieldData.validation.maxLength || ''}
                    onChange={function (e) {
                      return setFieldData(function (prev) {
                        return __assign(__assign({}, prev), {
                          validation: __assign(__assign({}, prev.validation), {
                            maxLength: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }),
                        });
                      });
                    }}
                  />
                </div>
                <div>
                  <Label className='text-sm'>Regex Pattern (optional)</Label>
                  <Input
                    value={fieldData.validation.regex}
                    onChange={function (e) {
                      return setFieldData(function (prev) {
                        return __assign(__assign({}, prev), {
                          validation: __assign(__assign({}, prev.validation), {
                            regex: e.target.value,
                          }),
                        });
                      });
                    }}
                    placeholder='e.g., ^[A-Z0-9]+$'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Options for Select type */}
          {fieldData.type === 'select' && (
            <div className='space-y-2'>
              <Label>Options</Label>
              <div className='space-y-2'>
                {fieldData.options.map(function (option, index) {
                  return (
                    <div key={index} className='flex items-center gap-2'>
                      <Input value={option.value} readOnly className='flex-1' />
                      <Input value={option.label} readOnly className='flex-1' />
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={function () {
                          return handleRemoveOption(index);
                        }}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  );
                })}
                <div className='flex items-center gap-2'>
                  <Input
                    value={newOption.value}
                    onChange={function (e) {
                      return setNewOption(function (prev) {
                        return __assign(__assign({}, prev), {
                          value: e.target.value,
                        });
                      });
                    }}
                    placeholder='Value'
                    className='flex-1'
                  />
                  <Input
                    value={newOption.label}
                    onChange={function (e) {
                      return setNewOption(function (prev) {
                        return __assign(__assign({}, prev), {
                          label: e.target.value,
                        });
                      });
                    }}
                    placeholder='Label'
                    className='flex-1'
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleAddOption}
                    disabled={!newOption.value || !newOption.label}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Field Key (Advanced) */}
          {isAdmin && (
            <div className='space-y-2'>
              <Label>Field Key (Advanced)</Label>
              <Input
                value={fieldData.key}
                onChange={function (e) {
                  return setFieldData(function (prev) {
                    return __assign(__assign({}, prev), {
                      key: e.target.value,
                    });
                  });
                }}
                placeholder='Auto-generated from label'
              />
              {existingKeys.includes(fieldData.key) && (
                <p className='text-sm text-red-500'>
                  This key already exists in the form
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddFieldModal;
//# sourceMappingURL=AddFieldModal.jsx.map
