


'use client';

import React, { createContext, useContext, useState } from 'react';

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

// FIX: Add `value` prop and make `defaultValue` optional to support controlled component behavior
interface TabsProps {
  defaultValue?: string;
  value?: string;
  children: React.ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, value, children, className, onValueChange }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue || '');

  // Determine if the component is controlled or uncontrolled
  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : internalActiveTab;

  const handleTabChange = (newValue: string) => {
    if (!isControlled) {
      setInternalActiveTab(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-sidebar p-1 text-text-secondary ${className}`} {...props} />
);

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ className, value, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  const isActive = context.activeTab === value;
  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? 'bg-background text-text-primary shadow-sm' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

// FIX: Wrap TabsContent in forwardRef to allow passing a ref to the underlying div.
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ value, children, ...props }, ref) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  return context.activeTab === value ? <div ref={ref} {...props}>{children}</div> : null;
});
TabsContent.displayName = "TabsContent";
