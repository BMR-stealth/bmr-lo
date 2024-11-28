import { create } from 'zustand';
import { User, Notification } from '@/types';

interface AppState {
  user: User | null;
  notifications: Notification[];
  unreadNotifications: number;
  setUser: (user: User | null) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  notifications: [],
  unreadNotifications: 0,
  setUser: (user) => set({ user }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadNotifications: state.unreadNotifications + 1,
    })),
  markNotificationAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadNotifications: Math.max(0, state.unreadNotifications - 1),
    })),
  clearNotifications: () =>
    set({ notifications: [], unreadNotifications: 0 }),
}));
