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

const iconColors: Record<NotificationType, string> = {
  TASK_ASSIGNED: "text-muted-foreground",
  TASK_UPDATED: "text-muted-foreground",
  COMMENT_ADDED: "text-muted-foreground",
  COMMENT_EDITED: "text-muted-foreground",
  MEMBER_JOINED: "text-muted-foreground",
  PROJECT_CREATED: "text-muted-foreground",
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const Icon = notificationIcons[notification.type];
  const iconColor = iconColors[notification.type];

  const content = (
    <div
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
        "hover:bg-accent/50",
        !notification.isRead && "bg-accent/30"
      )}
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
    >
      {/* Icon */}
      <div className="shrink-0 mt-0.5">
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {notification.actor && (
            <ProfileAvatar
              name={notification.actor.name}
              url={notification.actor.image || undefined}
              size="xs"
            />
          )}
          <div className="flex items-baseline gap-1.5 min-w-0 flex-1">
            <span className="text-sm font-semibold text-foreground truncate max-w-[35%]">
              {notification.actor?.name || "Unknown"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {notification.title}
            </span>
          </div>
        </div>
        {notification.message && (
          <p className="text-xs text-muted-foreground/80 line-clamp-1 mt-0.5">
            {notification.message}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[11px] text-muted-foreground/50">
            {formatDistanceToNowStrict(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete(notification.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-destructive/10 text-muted-foreground/50 hover:text-destructive"
              aria-label="Delete notification"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
          {!notification.isRead && (
            <div className="h-1.5 w-1.5 rounded-full bg-primary/70 ml-auto" />
          )}
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
