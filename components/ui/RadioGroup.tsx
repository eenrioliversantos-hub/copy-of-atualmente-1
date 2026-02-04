

import React, { createContext, useContext, useId } from 'react';

// FIX: Add context to manage RadioGroup state and props
interface RadioGroupContextProps {
  value?: string;
  onValueChange?: (value: string) => void;
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextProps | undefined>(undefined);

// FIX: Add value, onValueChange, and name to props to make it a controlled component
interface RadioGroupProps {
  children: React.ReactNode;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ children, className, value, onValueChange, name }) => {
  const generatedName = useId();
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name: name || generatedName }}>
      <div className={`grid gap-2 ${className}`} role="radiogroup">{children}</div>
    </RadioGroupContext.Provider>
  );
};

interface RadioGroupItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
    id: string;
    value: string; // value is required for a radio item
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ id, className, value, ...props }) => {
  const context = useContext(RadioGroupContext);

  if (!context) {
    return null;
  }

  const { value: groupValue, onValueChange, name } = context;
  const isChecked = groupValue === value;
  
  return (
    <button 
        type="button" 
        role="radio"
        aria-checked={isChecked}
        id={id} 
        name={name}
        value={value}
        onClick={() => onValueChange?.(value)}
        className={`peer h-4 w-4 shrink-0 rounded-full border-2 border-accent flex items-center justify-center ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
        {...props} 
      >
        {isChecked && <div className="h-2 w-2 bg-accent rounded-full"></div>}
      </button>
  );
};