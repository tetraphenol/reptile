import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

export const SheetPortal = SheetPrimitive.Portal;
export const SheetOverlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>>(function SheetOverlay(
  { className, ...props },
  ref,
) {
  return (
    <SheetPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-50 bg-black/60 backdrop-blur-sm', className)}
      {...props}
    />
  );
});

export const SheetContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>>(function SheetContent(
  { className, side = 'right', children, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & { side?: 'left' | 'right' | 'top' | 'bottom' },
  ref,
) {
  const sideClasses =
    side === 'right'
      ? 'right-0 top-0 h-full w-80 border-l'
      : side === 'left'
      ? 'left-0 top-0 h-full w-80 border-r'
      : side === 'top'
      ? 'top-0 left-0 w-full h-80 border-b'
      : 'bottom-0 left-0 w-full h-80 border-t';
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 bg-neutral-950 p-6 shadow-2xl border-neutral-800',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          sideClasses,
          className,
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
});