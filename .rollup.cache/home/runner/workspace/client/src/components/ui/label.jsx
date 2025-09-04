import { __rest } from "tslib";
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
var labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70');
var Label = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props}/>);
});
Label.displayName = LabelPrimitive.Root.displayName;
export { Label };
//# sourceMappingURL=label.jsx.map