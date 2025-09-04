import * as React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar as CalendarComponent } from './calendar';
import { format, parse, isValid } from 'date-fns';
export function DateTimePicker(_a) {
    var value = _a.value, onChange = _a.onChange, _b = _a.placeholder, placeholder = _b === void 0 ? 'Select date & time' : _b, className = _a.className, disabled = _a.disabled;
    var _c = React.useState(false), isOpen = _c[0], setIsOpen = _c[1];
    var _d = React.useState(''), timeValue = _d[0], setTimeValue = _d[1];
    // Parse the datetime-local string format (YYYY-MM-DDTHH:MM)
    var dateTime = value
        ? parse(value, "yyyy-MM-dd'T'HH:mm", new Date())
        : undefined;
    var isValidDateTime = dateTime && isValid(dateTime);
    // Extract time from value
    React.useEffect(function () {
        if (value) {
            var timePart = value.split('T')[1] || '';
            setTimeValue(timePart);
        }
    }, [value]);
    var handleDateSelect = function (date) {
        if (!date)
            return;
        var dateStr = format(date, 'yyyy-MM-dd');
        var time = timeValue || '00:00';
        var newValue = "".concat(dateStr, "T").concat(time);
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    var handleTimeChange = function (time) {
        setTimeValue(time);
        if (dateTime) {
            var dateStr = format(dateTime, 'yyyy-MM-dd');
            var newValue = "".concat(dateStr, "T").concat(time);
            onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
        }
    };
    var displayValue = isValidDateTime
        ? "".concat(format(dateTime, 'dd/MM/yyyy'), " ").concat(timeValue)
        : '';
    return (<Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={cn('flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 cursor-pointer', !displayValue && 'text-muted-foreground', disabled && 'cursor-not-allowed opacity-50', className)} style={{
            height: '36px',
            minHeight: '36px',
            maxHeight: '36px',
            boxSizing: 'border-box',
        }}>
          <span>{displayValue || placeholder}</span>
          <Calendar className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <div className='border-b border-border p-3'>
          <div className='flex items-center space-x-2'>
            <Clock className='h-4 w-4 opacity-50'/>
            <Input type='time' value={timeValue} onChange={function (e) { return handleTimeChange(e.target.value); }} className='h-8'/>
          </div>
        </div>
        <CalendarComponent mode='single' selected={isValidDateTime ? dateTime : undefined} onSelect={handleDateSelect} initialFocus/>
      </PopoverContent>
    </Popover>);
}
//# sourceMappingURL=datetime-picker.jsx.map