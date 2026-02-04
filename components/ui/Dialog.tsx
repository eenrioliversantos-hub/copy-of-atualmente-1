import React, { createContext, useContext, useEffect, useRef } from 'react';
import Icon from '../shared/Icon';

interface DialogContextProps {
  onClose: () => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const Dialog: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ onClose }}>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        aria-labelledby="dialog-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            ref={dialogRef}
            className="relative w-full max-w-2xl transform rounded-xl border border-card-border bg-sidebar shadow-xl transition-all animate-in fade-in-0 zoom-in-95"
          >
            {children}
          </div>
        </div>
      </div>
    </DialogContext.Provider>
  );
};

export const DialogHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`px-6 pt-6 ${className}`}>{children}</div>
);

export const DialogTitle: React.FC<{ children: React.ReactNode, id?: string }> = ({ children, id = "dialog-title" }) => (
  <h2 id={id} className="text-xl font-semibold text-text-primary">{children}</h2>
);

export const DialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-2 text-sm text-text-secondary">{children}</p>
);

export const DialogContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`p-6 max-h-[70vh] overflow-y-auto ${className}`}>{children}</div>
);

export const DialogFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`flex justify-end gap-2 px-6 pb-6 border-t border-card-border pt-4 ${className}`}>{children}</div>
);

export const DialogCloseButton: React.FC = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogCloseButton must be used within a Dialog');
  return (
    <button
      onClick={context.onClose}
      className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
    >
      <Icon name="x" className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
};
