'use client';

import React, { createContext, useContext, useState } from 'react';
import Icon from '../shared/Icon';

// Main Accordion Context
interface AccordionContextProps {
  activeItem: string | null;
  setActiveItem: (value: string) => void;
  collapsible: boolean;
}
const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);

// Context for each Item to know its own value
const AccordionItemContext = createContext<string | undefined>(undefined);

// Main Accordion Wrapper
export const Accordion: React.FC<{
  type: 'single';
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
  defaultValue?: string;
  value?: string | null; // Controlled value
  onValueChange?: (value: string | null) => void; // Callback for controlled component
}> = ({ collapsible = false, children, className, defaultValue, value, onValueChange }) => {
  const [internalActiveItem, setInternalActiveItem] = useState<string | null>(defaultValue || null);
  
  const isControlled = value !== undefined;
  const activeItem = isControlled ? value : internalActiveItem;

  const setActiveItem = (newValue: string) => {
    const finalValue = (collapsible && activeItem === newValue) ? null : newValue;
    if (!isControlled) {
        setInternalActiveItem(finalValue);
    }
    if (onValueChange) {
        onValueChange(finalValue);
    }
  };

  return (
    <AccordionContext.Provider value={{ activeItem: activeItem, setActiveItem, collapsible }}>
      <div className={` ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
};

// Accordion Item Wrapper
export const AccordionItem: React.FC<{ value: string; children: React.ReactNode; className?: string }> = ({ value, children, className }) => {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={`border-b border-card-border ${className}`}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

// Accordion Trigger Button
export const AccordionTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => {
  const accordionContext = useContext(AccordionContext);
  const itemValue = useContext(AccordionItemContext);

  if (!accordionContext || !itemValue) {
    throw new Error('AccordionTrigger must be used within an AccordionItem inside an Accordion');
  }

  const { activeItem, setActiveItem } = accordionContext;
  const isOpen = activeItem === itemValue;

  return (
    <h3>
      <button
        onClick={() => setActiveItem(itemValue)}
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between py-4 font-medium transition-all hover:bg-sidebar/50 text-text-primary text-left rounded-md ${className}`}
        {...props}
      >
        {children}
        <Icon name="chevronDown" className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </h3>
  );
};

// Accordion Content Panel
export const AccordionContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  const { activeItem } = useContext(AccordionContext)!;
  const itemValue = useContext(AccordionItemContext)!;
  
  const isOpen = activeItem === itemValue;

  return (
    <div
      hidden={!isOpen}
      className={`overflow-hidden text-sm text-text-secondary transition-all ${isOpen ? 'animate-in fade-in-0' : ''} ${className}`}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
};