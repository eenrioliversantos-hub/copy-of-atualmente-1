import React from 'react';
import { Notification } from '../../types';
import Icon from '../shared/Icon';
import { useNotificationStore } from '../../hooks/useNotificationStore';
import { Button } from '../ui/Button';

interface NotificationItemProps {
    notification: Notification;
    setCurrentView: (view: string, context?: any) => void;
    onClosePanel: () => void;
}

const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, setCurrentView, onClosePanel }) => {
    const { markAsRead } = useNotificationStore();

    const handleClick = () => {
        setCurrentView(notification.cta.view, notification.cta.context);
        markAsRead(notification.id);
        onClosePanel();
    };

    return (
        <div className={`p-3 border-b border-card-border flex items-start gap-3 transition-colors ${!notification.read ? 'bg-accent/5' : 'hover:bg-sidebar/50'}`}>
            {!notification.read && <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>}
            <Icon name={notification.icon} className={`h-5 w-5 ${!notification.read ? 'text-accent' : 'text-text-secondary'} mt-1 flex-shrink-0`} />
            <div className="flex-1">
                <p className={`text-sm ${!notification.read ? 'text-text-primary' : 'text-text-secondary'}`}>{notification.message}</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-text-secondary">{timeAgo(notification.timestamp)} atrás</span>
                    <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-accent" onClick={handleClick}>
                        {notification.cta.label}
                    </Button>
                </div>
            </div>
            <button onClick={() => markAsRead(notification.id)} aria-label="Marcar como lida" className="p-1">
                 <Icon name="x" className="h-4 w-4 text-text-secondary hover:text-text-primary" />
            </button>
        </div>
    );
};

export default NotificationItem;
