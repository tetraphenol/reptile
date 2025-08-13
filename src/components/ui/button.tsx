import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

export type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function getVariantClasses(variant: ButtonVariant | undefined): string {
  switch (variant) {
    case 'secondary':
      return 'bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700';
    case 'ghost':
      return 'bg-transparent hover:bg-neutral-900 text-neutral-200';
    case 'outline':
      return 'bg-transparent border border-neutral-700 hover:bg-neutral-900 text-neutral-200';
    case 'destructive':
      return 'bg-red-600 text-white hover:bg-red-700';
    case 'default':
    default:
      return 'bg-brand text-neutral-950 hover:bg-brand-dark';
  }
}

function getSizeClasses(size: ButtonSize | undefined): string {
  switch (size) {
    case 'sm':
      return 'h-8 px-3';
    case 'lg':
      return 'h-10 px-5';
    case 'icon':
      return 'h-9 w-9 p-0';
    case 'md':
    default:
      return 'h-9 px-4';
  }
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'default', size = 'md', asChild = false, ...props },
  ref,
) {
  const Comp: any = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50',
        getVariantClasses(variant),
        getSizeClasses(size),
        className,
      )}
      {...props}
    />
  );
});