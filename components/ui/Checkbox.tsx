import React from 'react';
import Icon from '../shared/Icon';

// This is a custom prop type for our component
interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, id, checked = false, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <button
        type="button"
        role="checkbox"
        id={id}
        aria-checked={checked}
        onClick={() => onCheckedChange && onCheckedChange(!checked)}
        ref={ref}
        disabled={disabled}
        className={`h-4 w-4 shrink-0 rounded-sm border border-card-border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'bg-accent border-accent' : 'bg-transparent'
        } ${className}`}
        {...props}
      >
        {checked && <Icon name="check" className="h-3 w-3 text-white" />}
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };