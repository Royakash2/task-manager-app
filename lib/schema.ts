import { z } from "zod";
import { TaskStatus, TaskPriority, AccessLevel, FileTypes } from "@prisma/client";

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .max(100, "Name is too long max 100 characters"),
  about: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  industryType: z.string().min(1, "Industry type is required"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Role is required"),
  image: z.string().optional(),
});
export const workspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name is required")
    .max(100, "Workspace name is too long max 100 characters"),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name is required")
    .max(100, "Project name is too long max 100 characters"),
  description: z.string().optional(),
  workspaceId: z.string(),
  membersAccess: z.array(z.string()).optional(),
});

const memberRoles = [AccessLevel.ADMIN, AccessLevel.MEMBER] as const;

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  dueDate: z.date().optional(),
  startDate: z.date().optional(),
  priority: z.nativeEnum(TaskPriority),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        type: z.nativeEnum(FileTypes),
      }),
    )
    .optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(memberRoles),
});

export const updateMemberRoleSchema = z.object({
  memberId: z.string().min(1),
  newRole: z.enum(memberRoles),
});

// Inferred types for use across both server actions and UI components
export type UserData = z.infer<typeof userSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type SettingsFormValues = z.infer<typeof workspaceSchema>;
export type WorkspaceData = z.infer<typeof workspaceSchema>;
export type InviteMemberData = z.infer<typeof inviteMemberSchema>;
