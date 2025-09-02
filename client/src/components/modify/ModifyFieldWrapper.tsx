import { ReactNode, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';

interface ModifyFieldWrapperProps {
  children: ReactNode;
  originalValue: any;
  currentValue: any;
  fieldName: string;
  isModifyMode: boolean;
  onFieldChange?: (fieldName: string, newValue: any, oldValue: any) => void;
}

export function ModifyFieldWrapper({
  children,
  originalValue,
  currentValue,
  fieldName,
  isModifyMode,
  onFieldChange,
}: ModifyFieldWrapperProps) {
  // Check if the field has been modified
  const isModified =
    originalValue !== undefined && originalValue !== currentValue;

  // Define colors according to specifications
  const baselineColor = '#52BAF3'; // Blue for editable fields
  const changedColor = '#FF3B30'; // Red for changed fields

  if (!isModifyMode) {
    return <>{children}</>;
  }

  // Clone the child element and add onChange tracking if it's a form element
  const enhancedChildren = isValidElement(children)
    ? cloneElement(children as any, {
        onChange: (e: any) => {
          // Call original onChange if it exists
          if ((children as any).props.onChange) {
            (children as any).props.onChange(e);
          }
          // Track the field change
          if (onFieldChange) {
            const newValue = e.target?.value !== undefined ? e.target.value : e;
            onFieldChange(fieldName, newValue, originalValue);
          }
        },
        // Apply color styling
        style: {
          ...(children as any).props.style,
          borderColor: isModified ? changedColor : baselineColor,
          borderWidth: '2px',
        },
        className: cn(
          (children as any).props.className,
          'transition-colors duration-200'
        ),
      })
    : children;

  return (
    <div className='relative'>
      {/* Field wrapper with color indication */}
      <div
        className={cn(
          'relative',
          isModified &&
            'after:absolute after:inset-0 after:border-2 after:border-[#FF3B30] after:rounded-md after:pointer-events-none'
        )}
      >
        {enhancedChildren}
      </div>

      {/* Visual indicator for modified fields */}
      {isModified && (
        <div className='absolute -right-2 -top-2 w-3 h-3 bg-[#FF3B30] rounded-full border-2 border-white shadow-sm' />
      )}

      {/* Label styling applied via CSS classes */}
    </div>
  );
}
