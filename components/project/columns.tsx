"use client";

import { Task, File } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";

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
    
  },
];
