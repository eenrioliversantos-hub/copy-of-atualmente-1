

'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useMemo } from 'react';
import Icon from '../shared/Icon';

interface SelectContextProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedValue: string | undefined;
  setSelectedValue: (value: string | undefined) => void;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
  onValueChange?: (value: string) => void;
  // FIX: Add disabled to context
  disabled?: boolean;
}

const SelectContext = createContext<SelectContextProps | undefined>(undefined);

// FIX: Add disabled prop
interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({ children, value, onValueChange, defaultValue, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value ?? defaultValue);
  const [selectedLabel, setSelectedLabel] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (value !== undefined) {
        setSelectedValue(value);
     }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const contextValue = useMemo(() => ({
    isOpen,
    setIsOpen,
    selectedValue,
    setSelectedValue,
    selectedLabel,
    setSelectedLabel,
    onValueChange,
    disabled,
  }), [isOpen, selectedValue, selectedLabel, onValueChange, disabled]);


  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative" ref={selectRef}>{children}</div>
    </SelectContext.Provider>
  );
};

// FIX: Pass disabled state from context to the button
export const SelectTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within a Select');

  return (
    <button
      type="button"
      onClick={() => !context.disabled && context.setIsOpen(!context.isOpen)}
      disabled={context.disabled}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-card-border bg-sidebar px-3 py-2 text-sm ring-offset-background placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {/* FIX: Delegate rendering to SelectValue */}
      {children}
      <Icon name="chevronDown" className={`h-4 w-4 opacity-50 transition-transform ${context.isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};

// FIX: Handle placeholder display logic
interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
    placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ children, placeholder, ...props }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within a Select');

  // FIX: Removed incorrect useEffect that was causing errors.
  // The logic to set the selected label is correctly handled in SelectItem.

  const content = context.selectedLabel || children;

  if (!context.selectedValue && placeholder) {
      return <span {...props} className="text-text-secondary">{placeholder}</span>
  }

  return <span {...props}>{content}</span>;
};

export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within a Select');

  if (!context.isOpen) return null;

  return (
    <div
      className={`absolute z-50 mt-1 w-full rounded-md border border-card-border bg-sidebar p-1 text-text-primary shadow-md animate-in fade-in-0 zoom-in-95 ${className}`}
      {...props}
    >
        {children}
    </div>
  );
};

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({ children, value, className, ...props }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within a Select');

  const isSelected = context.selectedValue === value;

  // This useEffect was causing an infinite re-render loop.
  // When the parent state updated, the context object changed, triggering the effect,
  // which updated the state again, creating a loop.
  // The logic is now correctly handled only inside handleSelect.
  /*
   useEffect(() => {
    if (isSelected) {
      context.setSelectedLabel(children as string);
    }
  }, [isSelected, children, context, value]);
  */
  
  // This effect sets the initial label for a controlled component
  useEffect(() => {
    if (isSelected) {
      context.setSelectedLabel(children as string);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected, children]);


  const handleSelect = () => {
    context.setSelectedValue(value);
    context.setSelectedLabel(children as string);
    if (context.onValueChange) {
      context.onValueChange(value);
    }
    context.setIsOpen(false);
  };
  

  return (
    <div
      onClick={handleSelect}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-700 ${className}`}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Icon name="check" className="h-4 w-4" />
        </span>
      )}
      {children}
    </div>
  );
};