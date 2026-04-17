"use client";

import { Task, File } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { ProjectAvatar } from "./Project-avatar";
import { Badge } from "../ui/badge";
import { format } from "date-fns";

export type TaskTableItem = Task & {
  assigneeTo: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
  project: {
    id: string;
    name: string;
    workspaceId: string;
  };
  attachments: File[];
};

export const columns: ColumnDef<TaskTableItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Task Title <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;

      return (
        <Link
          href={`/workspace/${row.original.project.workspaceId}/projects/${row.original.project.id}/${row.original.id}`}
        >
          <div className="flex items-center gap-2">
            <ProjectAvatar name={title} />
            <span className="text-sm font-medium xl:text-base capitalize">
              {title}
            </span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Badge variant={status as any}>
          {status === "IN_PROGRESS" ? "IN_PROGRESS" : status}
        </Badge>
      )
    }
  },
  {
    accessorKey: "priority",
    header: "priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Badge variant={"secondary"}>
          {priority}
        </Badge>
      )
    }

  },
  {
    accessorKey: "assigneeTo",
    header: "Assignee",
    cell: ({ row }) => {
      const assignee = row.getValue("assigneeTo") as {
        name: string;
        image: string | null;
      } | null;

      if (!assignee) {
        return (
          <span className="text-sm font-medium xl:text-base text-muted-foreground italic">
            Unassigned
          </span>
        )
      }

      return (
        <div className="flex items-center gap-2">
          <ProjectAvatar name={assignee.name} />
          <span className="text-sm font-medium xl:text-base capitalize">
            {assignee.name}
          </span>
        </div>
      )
    }

  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as Date | null;
      return (
        <span className="text-sm font-medium xl:text-base capitalize">
          {dueDate ? format(new Date(dueDate), "PPP") : "No due date"}
        </span>
      )
    }

  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return (
        <span className="text-sm font-medium xl:text-base capitalize">
          {format(new Date(createdAt), "PPP")}
        </span>
      )
    }

  },
 



];
