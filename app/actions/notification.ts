"use server";

import db from "@/lib/db";
import { userRequired } from "../data/user/get-user";
import { getAllNotifications, getUnreadCount } from "@/app/data/notification/get-notifications";
import { getAblyClient } from "@/lib/ably";
import { revalidatePath } from "next/cache";
import { NotificationType } from "@prisma/client";
import { actionError } from "@/utils/actions";

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  userId: string; 
  actorId?: string;
  link?: string;
  workspaceId?: string;
  projectId?: string;
  taskId?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await db.notification.create({
      data: {
        type: params.type,
        title: params.title,
        message: params.message,
        userId: params.userId,
        actorId: params.actorId,
        link: params.link,
        workspaceId: params.workspaceId,
        projectId: params.projectId,
        taskId: params.taskId,
      },
      include: {
        actor: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Publish to Ably for real-time delivery
    try {
      const ably = getAblyClient();
      const channel = ably.channels.get(`notifications:${params.userId}`);
      await channel.publish("new-notification", {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        isRead: notification.isRead,
        actor: notification.actor
          ? {
              id: notification.actor.id,
              name: notification.actor.name,
              image: notification.actor.image,
            }
          : null,
        createdAt: notification.createdAt.toISOString(),
      });
    } catch (ablyError) {
      // Ably publish is non-critical - don't fail if it errors
      console.error("Failed to publish to Ably:", ablyError);
    }

    return { success: true, data: notification };
  } catch (error) {
    console.error("Failed to create notification:", error);
    return actionError(error, "Failed to create notification");
  }
}

/**
 * Convenience helper: creates a TASK_ASSIGNED notification.
 */
export async function notifyTaskAssigned(
  userId: string,
  actorId: string,
  taskId: string,
  projectId: string,
  workspaceId: string,
  taskTitle: string,
) {
  return createNotification({
    type: "TASK_ASSIGNED",
    title: "Task Assigned",
    message: `You were assigned to task "${taskTitle}"`,
    userId,
    actorId,
    link: `/workspace/${workspaceId}/projects/${projectId}/${taskId}`,
    workspaceId,
    projectId,
    taskId,
  });
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { user } = await userRequired();

    await db.notification.update({
      where: { id: notificationId, userId: user.id },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return actionError(error, "Failed to mark notification as read");
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const { user } = await userRequired();

    await db.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return actionError(error, "Failed to mark all notifications as read");
  }
}

export async function getNotificationsAction(page: number = 1, limit: number = 20, isRead?: boolean) {
  try {
    const { user } = await userRequired();
    return { success: true, ...(await getAllNotifications(user.id, page, limit, isRead)) };
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return actionError(error, "Failed to get notifications");
  }
}

export async function getUnreadCountAction() {
  try {
    const { user } = await userRequired();
    const count = await getUnreadCount(user.id);
    return { success: true, count };
  } catch (error) {
    console.error("Failed to get unread count:", error);
    return actionError(error, "Failed to get unread count");
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const { user } = await userRequired();

    await db.notification.delete({
      where: { id: notificationId, userId: user.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return actionError(error, "Failed to delete notification");
  }
}
