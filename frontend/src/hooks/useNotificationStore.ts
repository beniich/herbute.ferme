import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
    id: string;
    type: 'complaint_assigned' | 'status_update' | 'alert' | 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    timestamp: string; // ISO string for storage
    read: boolean;
    data?: any;
}

interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,

            addNotification: (notification) => {
                const newNotification = {
                    ...notification,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    read: false
                };

                set((state) => ({
                    notifications: [newNotification, ...state.notifications],
                    unreadCount: state.unreadCount + 1
                }));
            },

            markAsRead: (id) => {
                const state = get();
                const notification = state.notifications.find(n => n.id === id);

                if (notification && !notification.read) {
                    set((state) => ({
                        notifications: state.notifications.map(n =>
                            n.id === id ? { ...n, read: true } : n
                        ),
                        unreadCount: Math.max(0, state.unreadCount - 1)
                    }));
                }
            },

            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0
            })),

            clearAll: () => set({ notifications: [], unreadCount: 0 }),

            removeNotification: (id) => {
                const state = get();
                const notification = state.notifications.find(n => n.id === id);
                const wasUnread = notification && !notification.read;

                set((state) => ({
                    notifications: state.notifications.filter(n => n.id !== id),
                    unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
                }));
            },
        }),
        { name: 'notification-storage' }
    )
);
