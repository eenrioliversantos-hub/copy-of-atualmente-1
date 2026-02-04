
import React, { useState } from 'react';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';
import { useNotificationStore } from '../../hooks/useNotificationStore';
import NotificationCenter from '../notifications/NotificationCenter';

interface HeaderProps {
    title: string;
    onLogout: () => void;
    setCurrentView: (view: string, context?: any) => void;
    onMenuClick?: () => void; // Prop to toggle sidebar
}

const Header: React.FC<HeaderProps> = ({ title, onLogout, setCurrentView, onMenuClick }) => {
  const { notifications, unreadCount } = useNotificationStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="bg-background border-b border-card-border px-4 py-3 md:px-6 md:py-2 flex items-center justify-between flex-shrink-0 h-16">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-sidebar text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Abrir menu"
        >
            <Icon name="menu" className="h-6 w-6" />
        </button>
        
        <h1 className="text-lg md:text-xl font-semibold text-text-primary truncate">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden md:block">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-sidebar w-48 lg:w-64 pl-9 pr-4 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent border border-transparent focus:border-accent transition-all"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            className="p-2 rounded-full hover:bg-sidebar transition-colors relative focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label={`Notificações (${unreadCount} não lidas)`}
          >
            <Icon name="bell" className="text-text-secondary h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center border-2 border-background">
                  {unreadCount}
                </span>
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <NotificationCenter 
              onClose={() => setIsNotificationsOpen(false)} 
              setCurrentView={setCurrentView}
            />
          )}
        </div>
        
        <div className="group relative">
            <button className="focus:outline-none focus:ring-2 focus:ring-accent rounded-full">
                <Avatar
                  src="https://i.pravatar.cc/150?u=user-4"
                  alt="Carlos Silva"
                  fallback="CS"
                />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-sidebar rounded-md shadow-lg border border-card-border opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible p-1 z-10">
                 <div className="px-3 py-2 border-b border-card-border mb-1">
                    <p className="text-sm font-medium text-text-primary">Carlos Silva</p>
                    <p className="text-xs text-text-secondary truncate">carlos@nexus.com</p>
                 </div>
                 <button onClick={onLogout} className="flex items-center w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-slate-700 rounded-md">
                     <Icon name="externalLink" className="mr-2 rotate-180 h-4 w-4" />
                     Logout
                 </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
