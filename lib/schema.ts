import { z } from "zod";

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

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "COMPLETED",
    "BLOCKED",
    "BACKLOG",
    "IN_REVIEW",
  ]),
  dueDate: z.date().optional(),
  startDate: z.date().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        type: z.enum(["IMAGE", "PDF"]),
      })
    )
    .optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["MEMBER", "VIEWER"]),
});

export const updateMemberRoleSchema = z.object({
  memberId: z.string().min(1),
  newRole: z.enum(["MEMBER", "VIEWER"]),
});

