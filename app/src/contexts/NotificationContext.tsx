import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Notification } from '@/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      userId: '1',
      type: 'success',
      title: 'Content Published',
      message: 'Your blog post "AI Trends 2025" has been published successfully.',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      userId: '1',
      type: 'info',
      title: 'New Trend Detected',
      message: 'A new trending topic "Sustainable Tech" has been identified.',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: '3',
      userId: '1',
      type: 'warning',
      title: 'Schedule Conflict',
      message: 'Two posts are scheduled for the same time slot.',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
