
import React from 'react';
import Icon from '../shared/Icon';

type NavItemType = {
  id: string;
  label: string;
  icon: string;
};

type NavCategory = {
  category: string;
  items: NavItemType[];
};

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  navStructure: NavCategory[];
  onLogout: () => void;
  isOpen?: boolean; // New prop for mobile state
  onClose?: () => void; // New prop for closing mobile menu
}

const NavItem: React.FC<{
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2.5 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
        isActive
          ? 'bg-accent text-white'
          : 'text-text-secondary hover:bg-slate-700 hover:text-text-primary'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon name={icon} className="mr-3 h-5 w-5" />
      <span>{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, navStructure, onLogout, isOpen = false, onClose }) => {
  
  // Classes for mobile overlay vs desktop sidebar
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-card-border transform transition-transform duration-300 ease-in-out
    lg:translate-x-0 lg:static lg:h-screen flex flex-col p-4
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  const overlayClasses = `
    fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300
    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      <div className={overlayClasses} onClick={onClose} aria-hidden="true" />

      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between px-4 mb-8">
          <div className="flex items-center gap-2">
            <Icon name="logo" className="h-8 w-8 text-accent" />
            <h1 className="text-xl font-bold text-text-primary">Nexus</h1>
          </div>
          {/* Close button for mobile */}
          <button onClick={onClose} className="lg:hidden text-text-secondary hover:text-text-primary p-1">
            <Icon name="x" className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <nav className="flex-1 overflow-y-auto pr-2 -mr-4 space-y-6 custom-scrollbar">
            {navStructure.map((category) => (
              <div key={category.category}>
                <h2 className="px-4 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">{category.category}</h2>
                <div className="flex flex-col gap-1">
                  {category.items.map((item) => (
                    <NavItem
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      isActive={currentView === item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        if (onClose) onClose(); // Close sidebar on mobile when item clicked
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-4 pt-4 border-t border-card-border">
          <NavItem
            icon="settings"
            label="Configurações"
            isActive={currentView === 'settings'}
            onClick={() => {
                setCurrentView('settings');
                if (onClose) onClose();
            }}
          />
           <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2.5 text-sm rounded-md transition-colors text-text-secondary hover:bg-slate-700 hover:text-text-primary mt-1 focus:outline-none focus:ring-2 focus:ring-accent"
          >
              <Icon name="externalLink" className="mr-3 h-5 w-5 rotate-180" />
              <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
