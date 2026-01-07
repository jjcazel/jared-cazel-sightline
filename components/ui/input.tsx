import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, clearable, onClear, value, ...props }, ref) => {
    return (
      <div className={cn('relative w-full', className)}>
        <input
          type={type}
          value={value}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            clearable && value && 'pr-8'
          )}
          ref={ref}
          {...props}
        />
        {clearable && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear input</span>
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };

