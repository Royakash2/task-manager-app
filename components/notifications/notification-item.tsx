"use client";

import { NotificationProps } from "@/utils/types";
import { ProfileAvatar } from "@/components/profile-avatar";
import { formatDistanceToNowStrict } from "date-fns";
import { NotificationType } from "@prisma/client";
import {
  MessageSquare,
  UserPlus,
  Edit,
  ClipboardList,
  FolderPlus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NotificationItemProps {
  notification: NotificationProps;
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
}

const notificationIcons: Record<NotificationType, React.ElementType> = {
  TASK_ASSIGNED: ClipboardList,
  TASK_UPDATED: Edit,
  COMMENT_ADDED: MessageSquare,
  COMMENT_EDITED: MessageSquare,
  MEMBER_JOINED: UserPlus,
  PROJECT_CREATED: FolderPlus,
};

// Makes quoted text bold and removes the quotes
function formatTitle(title: string) {
  const parts = title.split('"');
  if (parts.length === 3) {
    return (
      <>
        {parts[0]}
        <span className="font-semibold text-foreground">{parts[1]}</span>
        {parts[2]}
      </>
    );
  }
  return title;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const Icon = notificationIcons[notification.type];

  const content = (
    <div
      role={notification.link ? undefined : "button"}
      tabIndex={notification.link ? undefined : 0}
      className={cn(
        "group relative flex items-start gap-4 p-4 sm:px-6 transition-colors cursor-pointer border-b border-border/40 last:border-b-0",
        notification.isRead 
          ? "hover:bg-muted/40" 
          : "bg-accent/30 hover:bg-accent/50",
        !notification.link && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
      onKeyDown={(e) => {
        if (!notification.link && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          if (!notification.isRead) onMarkAsRead(notification.id);
        }
      }}
    >
      {/* Unread Indicator Bar */}
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r-full" />
      )}

      {/* Left: Avatar & Badge */}
      <div className="relative shrink-0 mt-0.5">
        {notification.actor ? (
          <div className="relative">
            <ProfileAvatar
              name={notification.actor.name}
              url={notification.actor.image || undefined}
              size="md"
            />
            {/* Icon Badge */}
            <div className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-background p-[2px]">
              <div className="flex size-4 items-center justify-center rounded-full bg-muted shadow-sm">
                <Icon className="size-2.5 text-muted-foreground" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-muted shadow-sm">
            <Icon className="size-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Right: Content Flex */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col min-w-0 gap-1">
            {/* Line 1: Action Context */}
            <p className="text-[13px] leading-snug">
              {notification.actor && (
                <span className="font-semibold text-foreground mr-1.5">
                  {notification.actor.name}
                </span>
              )}
              <span className="text-muted-foreground">
                {formatTitle(notification.title)}
              </span>
            </p>

            {/* Line 2: Message Preview (if exists) */}
            {notification.message && (
              <p className="text-sm text-foreground/85 line-clamp-2 leading-relaxed mt-0.5">
                &quot;{notification.message}&quot;
              </p>
            )}
          </div>
          
          {/* Timestamp & Actions */}
          <div className="flex flex-col items-end shrink-0 gap-2">
            <span className="text-[11px] text-muted-foreground whitespace-nowrap font-medium">
              {formatDistanceToNowStrict(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>
            
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete(notification.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground/50 hover:text-destructive"
                aria-label="Delete notification"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
