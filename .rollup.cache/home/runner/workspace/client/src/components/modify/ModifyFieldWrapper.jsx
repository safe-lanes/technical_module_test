import { __assign } from 'tslib';
import { cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';
export function ModifyFieldWrapper(_a) {
  var children = _a.children,
    originalValue = _a.originalValue,
    currentValue = _a.currentValue,
    fieldName = _a.fieldName,
    isModifyMode = _a.isModifyMode,
    onFieldChange = _a.onFieldChange;
  // Check if the field has been modified
  var isModified =
    originalValue !== undefined && originalValue !== currentValue;
  // Define colors according to specifications
  var baselineColor = '#52BAF3'; // Blue for editable fields
  var changedColor = '#FF3B30'; // Red for changed fields
  if (!isModifyMode) {
    return <>{children}</>;
  }
  // Clone the child element and add onChange tracking if it's a form element
  var enhancedChildren = isValidElement(children)
    ? cloneElement(children, {
        onChange: function (e) {
          var _a;
          // Call original onChange if it exists
          if (children.props.onChange) {
            children.props.onChange(e);
          }
          // Track the field change
          if (onFieldChange) {
            var newValue =
              ((_a = e.target) === null || _a === void 0
                ? void 0
                : _a.value) !== undefined
                ? e.target.value
                : e;
            onFieldChange(fieldName, newValue, originalValue);
          }
        },
        // Apply color styling
        style: __assign(__assign({}, children.props.style), {
          borderColor: isModified ? changedColor : baselineColor,
          borderWidth: '2px',
        }),
        className: cn(
          children.props.className,
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
//# sourceMappingURL=ModifyFieldWrapper.jsx.map
