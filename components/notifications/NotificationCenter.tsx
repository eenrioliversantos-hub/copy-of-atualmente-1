import React from 'react';
import { useNotificationStore } from '../../hooks/useNotificationStore';
import Icon from '../shared/Icon';
import NotificationItem from './NotificationItem';
import { Button } from '../ui/Button';

interface NotificationCenterProps {
    onClose: () => void;
    setCurrentView: (view: string, context?: any) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, setCurrentView }) => {
    const { notifications, unreadCount, markAllAsRead, clearAll } = useNotificationStore();

    return (
        <div 
            className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-sidebar rounded-md shadow-lg border border-card-border animate-in fade-in-0 zoom-in-95 z-20"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            <div className="p-3 border-b border-card-border flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">Notificações</h3>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="text-xs">
                        Marcar como lidas
                    </Button>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <NotificationItem 
                            key={notification.id} 
                            notification={notification} 
                            setCurrentView={setCurrentView}
                            onClosePanel={onClose}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 px-4">
                        <Icon name="checkCircle" className="h-10 w-10 text-green-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-text-primary">Você está em dia!</p>
                        <p className="text-xs text-text-secondary">Nenhuma notificação nova.</p>
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-card-border text-center">
                 <Button variant="ghost" size="sm" onClick={clearAll} disabled={notifications.length === 0} className="text-xs w-full text-text-secondary hover:text-red-400">
                    Limpar todas as notificações
                </Button>
            </div>
        </div>
    );
};

export default NotificationCenter;
