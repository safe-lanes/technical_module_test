import { __assign, __spreadArray } from 'tslib';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Trash2, X } from 'lucide-react';
var SparesChangeRequestForm = function (_a) {
  var onClose = _a.onClose,
    onSubmit = _a.onSubmit,
    _b = _a.initialData,
    initialData = _b === void 0 ? {} : _b;
  var _c = useState([
      {
        partCode: initialData.partCode || 'SP-ME-001',
        partName: initialData.partName || 'Fuel Injector',
        linkedComponent: initialData.linkedComponent || 'component1',
        qty: initialData.qty || '1',
        minQty: initialData.minQty || '1',
        critical: initialData.critical || 'Y',
        location: initialData.location || 'Store Room A',
      },
      {
        partCode: '',
        partName: '',
        linkedComponent: '',
        qty: '',
        minQty: '',
        critical: '',
        location: '',
      },
      {
        partCode: '',
        partName: '',
        linkedComponent: '',
        qty: '',
        minQty: '',
        critical: '',
        location: '',
      },
    ]),
    spareItems = _c[0],
    setSpareItems = _c[1];
  var _d = useState(new Set()),
    changedFields = _d[0],
    setChangedFields = _d[1];
  var handleInputChange = function (index, field, value) {
    setSpareItems(function (prev) {
      var _a;
      var newItems = __spreadArray([], prev, true);
      newItems[index] = __assign(
        __assign({}, newItems[index]),
        ((_a = {}), (_a[field] = value), _a)
      );
      return newItems;
    });
    // Track changed fields for red highlighting
    var fieldKey = ''.concat(index, '.').concat(field);
    var initialValue = initialData[field];
    if (value !== initialValue) {
      setChangedFields(function (prev) {
        return new Set(
          __spreadArray(
            __spreadArray([], Array.from(prev), true),
            [fieldKey],
            false
          )
        );
      });
    } else {
      setChangedFields(function (prev) {
        var newSet = new Set(Array.from(prev));
        newSet.delete(fieldKey);
        return newSet;
      });
    }
  };
  var handleSubmit = function () {
    if (onSubmit) {
      onSubmit({ spareItems: spareItems });
      onClose();
    }
  };
  var getInputStyle = function (index, field) {
    var fieldKey = ''.concat(index, '.').concat(field);
    var isChanged = changedFields.has(fieldKey);
    return 'text-sm '.concat(
      isChanged
        ? 'text-red-500 border-red-500'
        : 'text-[#52baf3] border-[#52baf3]'
    );
  };
  var getLabelStyle = function () {
    return 'text-[#52baf3] text-sm font-medium';
  };
  return (
    <div className='w-[95%] max-w-7xl max-h-[90vh] overflow-auto bg-white rounded-lg shadow-lg'>
      {/* Modal Header */}
      <div className='flex justify-between items-center p-4 border-b border-[#52baf3]'>
        <h2 className='text-xl font-semibold text-[#52baf3]'>
          Add Spares - Change Request
        </h2>
        <Button
          variant='ghost'
          size='sm'
          onClick={onClose}
          className='h-8 w-8 p-0 ml-[90px] mr-[90px] text-[#52baf3] hover:bg-[#52baf3] hover:text-white'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      {/* Modal Body */}
      <div className='p-6'>
        {/* Add Spare Button */}
        <div className='flex justify-end mb-4'>
          <Button className='bg-[#52baf3] hover:bg-[#40a8e0] text-white text-sm'>
            + Add Spare
          </Button>
        </div>

        {/* Table Headers */}
        <div className='grid grid-cols-12 gap-3 bg-gray-50 p-3 rounded-t text-sm font-medium border border-[#52baf3]'>
          <div className={'col-span-2 '.concat(getLabelStyle())}>Part Code</div>
          <div className={'col-span-2 '.concat(getLabelStyle())}>Part Name</div>
          <div className={'col-span-3 '.concat(getLabelStyle())}>
            Linked Component
          </div>
          <div className={'col-span-1 '.concat(getLabelStyle())}>Qty</div>
          <div className={'col-span-1 '.concat(getLabelStyle())}>Min Qty</div>
          <div className={'col-span-1 '.concat(getLabelStyle())}>Critical</div>
          <div className={'col-span-2 '.concat(getLabelStyle())}>Location</div>
        </div>

        {/* Form Rows */}
        <div className='border border-t-0 rounded-b border-[#52baf3]'>
          {spareItems.map(function (item, index) {
            return (
              <div
                key={index}
                className='grid grid-cols-12 gap-3 p-3 border-b bg-white items-center'
              >
                <div className='col-span-2'>
                  <Input
                    value={item.partCode}
                    onChange={function (e) {
                      return handleInputChange(
                        index,
                        'partCode',
                        e.target.value
                      );
                    }}
                    placeholder={index === 0 ? 'SP-ME-001' : ''}
                    className={getInputStyle(index, 'partCode')}
                  />
                </div>
                <div className='col-span-2'>
                  <Input
                    value={item.partName}
                    onChange={function (e) {
                      return handleInputChange(
                        index,
                        'partName',
                        e.target.value
                      );
                    }}
                    placeholder={index === 0 ? 'Fuel Injector' : ''}
                    className={getInputStyle(index, 'partName')}
                  />
                </div>
                <div className='col-span-3'>
                  <Select
                    value={item.linkedComponent}
                    onValueChange={function (value) {
                      return handleInputChange(index, 'linkedComponent', value);
                    }}
                  >
                    <SelectTrigger
                      className={getInputStyle(index, 'linkedComponent')}
                    >
                      <SelectValue placeholder='Search Component' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='component1'>Main Engine #1</SelectItem>
                      <SelectItem value='component2'>Main Engine #2</SelectItem>
                      <SelectItem value='component3'>Main Engine #3</SelectItem>
                      <SelectItem value='aux1'>Auxiliary Engine #1</SelectItem>
                      <SelectItem value='aux2'>Auxiliary Engine #2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  value={item.qty}
                  onChange={function (e) {
                    return handleInputChange(index, 'qty', e.target.value);
                  }}
                  placeholder={index === 0 ? '1' : ''}
                  className={getInputStyle(index, 'qty')}
                />
                <Input
                  value={item.minQty}
                  onChange={function (e) {
                    return handleInputChange(index, 'minQty', e.target.value);
                  }}
                  placeholder={index === 0 ? '1' : ''}
                  className={getInputStyle(index, 'minQty')}
                />
                <Select
                  value={item.critical}
                  onValueChange={function (value) {
                    return handleInputChange(index, 'critical', value);
                  }}
                >
                  <SelectTrigger className={getInputStyle(index, 'critical')}>
                    <SelectValue placeholder='Y' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Y'>Y</SelectItem>
                    <SelectItem value='N'>N</SelectItem>
                  </SelectContent>
                </Select>
                <div className='col-span-2 flex items-center gap-2'>
                  <Input
                    value={item.location}
                    onChange={function (e) {
                      return handleInputChange(
                        index,
                        'location',
                        e.target.value
                      );
                    }}
                    placeholder={index === 0 ? 'Store Room A' : ''}
                    className={'flex-1 '.concat(
                      getInputStyle(index, 'location')
                    )}
                  />
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 w-6 p-0 text-[#52baf3] hover:bg-[#52baf3] hover:text-white'
                  >
                    <Edit className='h-3 w-3' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 w-6 p-0 text-[#52baf3] hover:bg-red-500 hover:text-white'
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
              </div>
            );
          })}
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
          Save
        </Button>
      </div>
    </div>
  );
};
export default SparesChangeRequestForm;
//# sourceMappingURL=SparesChangeRequestForm.jsx.map
