import db from "@/lib/db";
import { NotificationProps } from "@/utils/types";
import type { Notification, User } from "@prisma/client";

type NotificationWithActor = Notification & {
  actor: Pick<User, "id" | "name" | "image"> | null;
};

function formatNotification(n: NotificationWithActor): NotificationProps {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    link: n.link,
    isRead: n.isRead,
    userId: n.userId,
    actorId: n.actorId,
    actor: n.actor
      ? {
          id: n.actor.id,
          name: n.actor.name,
          image: n.actor.image,
        }
      : null,
    workspaceId: n.workspaceId,
    projectId: n.projectId,
    taskId: n.taskId,
    createdAt: n.createdAt,
  };
}

export async function getUnreadNotifications(
  userId: string,
  limit: number = 20
): Promise<NotificationProps[]> {
  const notifications = await db.notification.findMany({
    where: { userId, isRead: false },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      actor: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return notifications.map(formatNotification);
}

export async function getAllNotifications(
  userId: string,
  page: number = 1,
  limit: number = 20,
  isRead?: boolean
): Promise<{ notifications: NotificationProps[]; total: number }> {
  const skip = (page - 1) * limit;
  const where = isRead !== undefined ? { userId, isRead } : { userId };

  const [notifications, total] = await Promise.all([
    db.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        actor: {
          select: { id: true, name: true, image: true },
        },
      },
    }),
    db.notification.count({ where }),
  ]);

  return {
    notifications: notifications.map(formatNotification),
    total,
  };
}

export async function getUnreadCount(userId: string): Promise<number> {
  return db.notification.count({
    where: { userId, isRead: false },
  });
}
