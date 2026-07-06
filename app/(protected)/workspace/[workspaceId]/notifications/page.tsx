"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { NotificationItem } from "@/components/notifications/notification-item";
import { Bell, CheckCheck, Loader2, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getNotificationsAction } from "@/app/actions/notification";
import { useNotifications } from "@/hooks/use-notifications";
import type { NotificationProps } from "@/utils/types";

const PAGE_LIMIT = 20;

export default function NotificationsPage() {
  const {
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    setAutoRefreshPage,
  } = useNotifications();

  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hideRead, setHideRead] = useState(false);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(total / PAGE_LIMIT);
  const isFirstLoad = useRef(true);

  const handleMarkAsRead = useCallback((id: string) => {
    markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, [markAsRead]);

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  }, [markAllAsRead]);

  const handleDelete = useCallback((id: string) => {
    deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, [deleteNotification]);

  const fetchNotifications = useCallback(async (targetPage: number, readFilter?: boolean, showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const result = await getNotificationsAction(targetPage, PAGE_LIMIT, readFilter);
      if (result.success) {
        setNotifications(result.notifications);
        setTotal(result.total);
      }
    } catch {
      // Silently fail
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotifications(page, hideRead ? false : undefined, true);
    setAutoRefreshPage(page);
    isFirstLoad.current = false;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch on page change or hide-read toggle (user-initiated)
  useEffect(() => {
    if (isFirstLoad.current) return;
    fetchNotifications(page, hideRead ? false : undefined, true);
    setAutoRefreshPage(page);
  }, [page, hideRead]); // eslint-disable-line react-hooks/exhaustive-deps

  // Silently re-fetch when unread count changes (new notification or marked-as-read from elsewhere)
  const prevUnreadRef = useRef(unreadCount);
  useEffect(() => {
    if (isFirstLoad.current) return;
    prevUnreadRef.current = unreadCount;
    fetchNotifications(page, hideRead ? false : undefined, false);
  }, [unreadCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-6 p-3">
      {/* Sticky header with inline actions */}
      <div className="sticky top-15 z-10 bg-background -mx-4 md:-mx-6 px-4 md:px-6 pb-4 border-border flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Notifications
          </h1>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {unreadCount} unread
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={hideRead}
                onCheckedChange={() => setHideRead((v) => !v)}
              >
                Hide read
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notifications list */}
      {isLoading ? (
        <Card className="shadow-none">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No notifications yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Notifications will appear here when someone assigns you a task, comments, or adds you to a workspace.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="shadow-none">
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={notification.isRead ? "opacity-50" : ""}
              >
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                   onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
