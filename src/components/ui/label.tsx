import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../../lib/utils';

export const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(function Label(
  { className, ...props },
  ref,
) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn('text-sm font-medium leading-none text-neutral-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    />
  );
});