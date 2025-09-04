import { __rest } from 'tslib';
import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';
var Separator = React.forwardRef(function (_a, ref) {
  var className = _a.className,
    _b = _a.orientation,
    orientation = _b === void 0 ? 'horizontal' : _b,
    _c = _a.decorative,
    decorative = _c === void 0 ? true : _c,
    props = __rest(_a, ['className', 'orientation', 'decorative']);
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  );
});
Separator.displayName = SeparatorPrimitive.Root.displayName;
export { Separator };
//# sourceMappingURL=separator.jsx.map
