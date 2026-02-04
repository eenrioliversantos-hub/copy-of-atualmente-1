import { create } from 'zustand';
import { Notification } from '../types';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => {
      const newNotification: Notification = {
        ...notification,
        id: new Date().getTime().toString(),
        timestamp: new Date(),
        read: false,
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),
  markAsRead: (id) =>
    set((state) => {
      let wasUnread = false;
      const updatedNotifications = state.notifications.map((n) => {
        if (n.id === id && !n.read) {
          wasUnread = true;
          return { ...n, read: true };
        }
        return n;
      });
      return {
        notifications: updatedNotifications,
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}));
