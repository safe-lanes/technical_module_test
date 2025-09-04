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

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fieldData: any) => void;
  section: string;
  existingKeys: string[];
  isAdmin?: boolean;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({
  isOpen,
  onClose,
  onSave,
  section,
  existingKeys,
  isAdmin = true,
}) => {
  const [fieldData, setFieldData] = useState({
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    defaultValue: '',
    unit: '',
    validation: {
      min: undefined as number | undefined,
      max: undefined as number | undefined,
      minDate: '',
      maxDate: '',
      regex: '',
      maxLength: undefined as number | undefined,
    },
    options: [] as { value: string; label: string }[],
    key: '',
  });

  const [newOption, setNewOption] = useState({ value: '', label: '' });

  // Auto-generate field key from label
  useEffect(() => {
    if (fieldData.label && !fieldData.key) {
      const slug = fieldData.label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');
      const suffix = Math.random().toString(36).substring(2, 6);
      setFieldData(prev => ({ ...prev, key: `${slug}_${suffix}` }));
    }
  }, [fieldData.label]);

  const handleAddOption = () => {
    if (newOption.value && newOption.label) {
      setFieldData(prev => ({
        ...prev,
        options: [...prev.options, newOption],
      }));
      setNewOption({ value: '', label: '' });
    }
  };

  const handleRemoveOption = (index: number) => {
    setFieldData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!fieldData.label || !fieldData.type) {
      return;
    }

    if (existingKeys.includes(fieldData.key)) {
      window.alert('Field key must be unique within the form');
      return;
    }

    onSave({
      ...fieldData,
      id: `field_${Date.now()}`,
      section,
      active: true,
      locked: false,
    });

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

  const isValid =
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
              onChange={e =>
                setFieldData(prev => ({ ...prev, label: e.target.value }))
              }
              placeholder='Field Label'
            />
          </div>

          {/* Data Type */}
          <div className='space-y-2'>
            <Label>Data Type *</Label>
            <Select
              value={fieldData.type}
              onValueChange={value =>
                setFieldData(prev => ({ ...prev, type: value }))
              }
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
              onCheckedChange={checked =>
                setFieldData(prev => ({ ...prev, required: checked }))
              }
            />
            <Label>Required</Label>
          </div>

          {/* Placeholder/Help Text */}
          <div className='space-y-2'>
            <Label>Placeholder / Help Text</Label>
            <Input
              value={fieldData.placeholder}
              onChange={e =>
                setFieldData(prev => ({ ...prev, placeholder: e.target.value }))
              }
              placeholder='Optional help text'
            />
          </div>

          {/* Default Value */}
          <div className='space-y-2'>
            <Label>Default Value</Label>
            <Input
              value={fieldData.defaultValue}
              onChange={e =>
                setFieldData(prev => ({
                  ...prev,
                  defaultValue: e.target.value,
                }))
              }
              placeholder='Default value for this field'
            />
          </div>

          {/* Unit (UOM) */}
          <div className='space-y-2'>
            <Label>Unit (UOM)</Label>
            <Input
              value={fieldData.unit}
              onChange={e =>
                setFieldData(prev => ({ ...prev, unit: e.target.value }))
              }
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
                    onChange={e =>
                      setFieldData(prev => ({
                        ...prev,
                        validation: {
                          ...prev.validation,
                          min: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className='text-sm'>Max</Label>
                  <Input
                    type='number'
                    value={fieldData.validation.max || ''}
                    onChange={e =>
                      setFieldData(prev => ({
                        ...prev,
                        validation: {
                          ...prev.validation,
                          max: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        },
                      }))
                    }
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
                    onChange={e =>
                      setFieldData(prev => ({
                        ...prev,
                        validation: {
                          ...prev.validation,
                          minDate: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className='text-sm'>Max Date</Label>
                  <Input
                    type='date'
                    value={fieldData.validation.maxDate}
                    onChange={e =>
                      setFieldData(prev => ({
                        ...prev,
                        validation: {
                          ...prev.validation,
                          maxDate: e.target.value,
                        },
                      }))
                    }
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
                    onChange={e =>
                      setFieldData(prev => ({
                        ...prev,
                        validation: {
                          ...prev.validation,
                          maxLength: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className='text-sm'>Regex Pattern (optional)</Label>
                  <Input
                    value={fieldData.validation.regex}
                    onChange={e =>
                      setFieldData(prev => ({
                        ...prev,
                        validation: {
                          ...prev.validation,
                          regex: e.target.value,
                        },
                      }))
                    }
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
                {fieldData.options.map((option, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <Input value={option.value} readOnly className='flex-1' />
                    <Input value={option.label} readOnly className='flex-1' />
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
                <div className='flex items-center gap-2'>
                  <Input
                    value={newOption.value}
                    onChange={e =>
                      setNewOption(prev => ({ ...prev, value: e.target.value }))
                    }
                    placeholder='Value'
                    className='flex-1'
                  />
                  <Input
                    value={newOption.label}
                    onChange={e =>
                      setNewOption(prev => ({ ...prev, label: e.target.value }))
                    }
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
                onChange={e =>
                  setFieldData(prev => ({ ...prev, key: e.target.value }))
                }
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
