"use client";

import { createContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from "react";
import { NotificationProps } from "@/utils/types";
import Ably from "ably";
import { toast } from "sonner";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationAction,
  getNotificationsAction,
  getUnreadCountAction,
} from "@/app/actions/notification";

type AblyRealtimeClient = Ably.Realtime;
type AblyRealtimeChannel = Ably.RealtimeChannel;

// Preload notification sound once
let notificationSound: HTMLAudioElement | null = null;
if (typeof window !== "undefined") {
  notificationSound = new Audio("/notification.mp3");
  notificationSound.volume = 0.5;
}

function playNotificationSound() {
  if (!notificationSound) return;
  notificationSound.currentTime = 0;
  notificationSound.play().catch(() => {
    // Browser blocked autoplay - first user interaction will allow it
  });
}

async function getAblyClient(): Promise<{
  client: AblyRealtimeClient;
  userId: string;
} | null> {
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch("/api/notifications/subscribe");
    if (!response.ok) return null;

    const { tokenRequest, userId } = await response.json();
    if (!tokenRequest || !userId) return null;

    const client = new Ably.Realtime({
      authCallback: (_tokenParams, cb) => cb(null, tokenRequest),
    });

    return { client, userId };
  } catch {
    return null;
  }
}

interface NotificationsContextValue {
  notifications: NotificationProps[];
  unreadCount: number;
  total: number;
  isLoading: boolean;
  isDropdownOpen: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  openDropdown: () => void;
  closeDropdown: () => void;
  fetchNotifications: (targetPage?: number) => Promise<void>;
  setAutoRefreshPage: (page: number) => void;
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ablyChannelRef = useRef<AblyRealtimeChannel | null>(null);
  const prevCountRef = useRef(-1);
  const autoRefreshPageRef = useRef(1);
  const limit = 20;

  const setAutoRefreshPage = useCallback((page: number) => {
    autoRefreshPageRef.current = page;
  }, []);

  const fetchNotifications = useCallback(async (targetPage: number = 1) => {
    try {
      const result = await getNotificationsAction(targetPage, limit);
      if (result.success) {
        setNotifications(result.notifications);
        setTotal(result.total);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await getUnreadCountAction();
      if (!result.success) return;

      // If count increased from a known baseline, a new notification arrived
      if (prevCountRef.current >= 0 && result.count > prevCountRef.current) {
        playNotificationSound();
        fetchNotifications(autoRefreshPageRef.current);
      }
      prevCountRef.current = result.count;

      setUnreadCount(result.count);
    } catch {
      // Silently fail
    }
  }, [fetchNotifications]);

  // Initialize Ably and fetch initial data
  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications(1);

    const setupAbly = async () => {
      try {
        const result = await getAblyClient();
        if (!result) return;

        const { client, userId } = result;
        const channel = client.channels.get(`notifications:${userId}`) as AblyRealtimeChannel;
        ablyChannelRef.current = channel;

        channel.subscribe("new-notification", () => {
          fetchUnreadCount();
          fetchNotifications(autoRefreshPageRef.current);
        });
      } catch {
        // Ably not available
      }
    };

    setupAbly();

    return () => {
      if (ablyChannelRef.current) {
        ablyChannelRef.current.unsubscribe();
        ablyChannelRef.current = null;
      }
    };
  }, [fetchUnreadCount, fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await markNotificationAsRead(notificationId);

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // Silently fail
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch {
      // Silently fail
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    let removedNotification: NotificationProps | undefined;

    setNotifications((prev) => {
      removedNotification = prev.find((n) => n.id === notificationId);
      if (removedNotification && !removedNotification.isRead) {
        setUnreadCount((u) => Math.max(0, u - 1));
      }
      return prev.filter((n) => n.id !== notificationId);
    });
    setTotal((prev) => Math.max(0, prev - 1));

    // Rollback helper — restores the notification if the server operation fails
    const revert = () => {
      if (!removedNotification) return;
      setNotifications((prev) => [...prev, removedNotification!]);
      if (!removedNotification.isRead) setUnreadCount((u) => u + 1);
      setTotal((prev) => prev + 1);
    };

    try {
      const result = await deleteNotificationAction(notificationId);
      if (!result.success) {
        revert();
        if ('error' in result) toast.error(result.error);
      }
    } catch {
      revert();
      toast.error("Failed to delete notification");
    }
  }, []);

  const openDropdown = useCallback(() => {
    setIsDropdownOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const ctx = useMemo(() => ({
    notifications,
    unreadCount,
    total,
    isLoading,
    isDropdownOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    openDropdown,
    closeDropdown,
    fetchNotifications,
    setAutoRefreshPage,
  }), [
    notifications,
    unreadCount,
    total,
    isLoading,
    isDropdownOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    openDropdown,
    closeDropdown,
    fetchNotifications,
    setAutoRefreshPage,
  ]);

  return (
    <NotificationsContext.Provider value={ctx}>
      {children}
    </NotificationsContext.Provider>
  );
}
