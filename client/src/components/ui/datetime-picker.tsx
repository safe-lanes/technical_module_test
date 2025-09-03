import * as React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar as CalendarComponent } from './calendar';
import { format, parse, isValid } from 'date-fns';

interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date & time",
  className,
  disabled
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [timeValue, setTimeValue] = React.useState('');
  
  // Parse the datetime-local string format (YYYY-MM-DDTHH:MM)
  const dateTime = value ? parse(value, "yyyy-MM-dd'T'HH:mm", new Date()) : undefined;
  const isValidDateTime = dateTime && isValid(dateTime);
  
  // Extract time from value
  React.useEffect(() => {
    if (value) {
      const timePart = value.split('T')[1] || '';
      setTimeValue(timePart);
    }
  }, [value]);
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const time = timeValue || '00:00';
    const newValue = `${dateStr}T${time}`;
    
    onChange?.(newValue);
  };
  
  const handleTimeChange = (time: string) => {
    setTimeValue(time);
    
    if (dateTime) {
      const dateStr = format(dateTime, 'yyyy-MM-dd');
      const newValue = `${dateStr}T${time}`;
      onChange?.(newValue);
    }
  };
  
  const displayValue = isValidDateTime 
    ? `${format(dateTime, 'dd/MM/yyyy')} ${timeValue}`
    : '';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 cursor-pointer',
            !displayValue && 'text-muted-foreground',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
          style={{
            height: '36px',
            minHeight: '36px',
            maxHeight: '36px',
            boxSizing: 'border-box'
          }}
        >
          <span>{displayValue || placeholder}</span>
          <Calendar className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="border-b border-border p-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 opacity-50" />
            <Input
              type="time"
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="h-8"
            />
          </div>
        </div>
        <CalendarComponent
          mode="single"
          selected={isValidDateTime ? dateTime : undefined}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}