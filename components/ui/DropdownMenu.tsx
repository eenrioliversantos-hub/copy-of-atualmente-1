


'use client';
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

// Context to manage open/close state
interface DropdownMenuContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const DropdownMenuContext = createContext<DropdownMenuContextProps | undefined>(undefined);

// Main wrapper
export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
        <div ref={menuRef} className="relative">
            {children}
        </div>
    </DropdownMenuContext.Provider>
  );
};

// Trigger element
export const DropdownMenuTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children, asChild }) => {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within a DropdownMenu');
  
  const { setIsOpen } = context;

  if (asChild) {
    // FIX: Clone element with chained onClick and proper typing to avoid overload error.
    const child = React.Children.only(children) as React.ReactElement<any>;
    return React.cloneElement(child, {
        ...child.props,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
            setIsOpen(prev => !prev);
            if (child.props.onClick) {
              child.props.onClick(e);
            }
        },
    });
  }
  return <button onClick={() => setIsOpen(prev => !prev)}>{children}</button>;
};

// Content element
// FIX: Update component to accept and spread standard HTML attributes like onClick.
export const DropdownMenuContent: React.FC<React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; className?: string; align?: 'end' | 'start' }> = ({ children, className, align = 'start', ...props }) => {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuContent must be used within a DropdownMenu');

  const { isOpen } = context;
  const alignClass = align === 'end' ? 'right-0 origin-top-right' : 'left-0 origin-top-left';

  if (!isOpen) return null;

  return (
    <div {...props} className={`absolute z-50 mt-2 w-56 rounded-md bg-sidebar shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-card-border p-1 animate-in fade-in-0 zoom-in-95 ${alignClass} ${className}`}>
      <div role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
        {children}
      </div>
    </div>
  );
};

// Item element
export const DropdownMenuItem: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => {
    const context = useContext(DropdownMenuContext);
    if (!context) throw new Error('DropdownMenuItem must be used within a DropdownMenu');
    
    const { setIsOpen } = context;

    return (
        <button
            {...props}
            onClick={(e) => {
                if(props.onClick) props.onClick(e);
                setIsOpen(false);
            }}
            className={`flex w-full items-center rounded-md px-2 py-2 text-sm text-text-secondary hover:bg-slate-700 hover:text-text-primary ${className}`}
        >
            {children}
        </button>
    );
};

// Label element
export const DropdownMenuLabel: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className }) => (
    <div className={`px-2 py-2 text-sm text-text-primary ${className}`}>{children}</div>
);

// Separator element
export const DropdownMenuSeparator: React.FC = () => (
    <div className="my-1 h-px bg-card-border" />
);