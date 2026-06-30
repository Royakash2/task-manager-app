"use client";

import { AccessLevel } from "@prisma/client";
import { ProjectTable } from "@/components/project/project-table";
import type { TaskTableItem } from "@/components/project/columns";

interface MyTasksContentProps {
  tasks: TaskTableItem[];
  userRole: AccessLevel | null;
}

export const MyTasksContent = ({
  tasks,
  userRole,
}: MyTasksContentProps) => {

  return (
    <div className="flex flex-col gap-8 pb-3 px-3">
      {/* ── Title row ──────────────────────────────────────────────────── */}
      <div className="flex flex-col">
        <div className="flex flex-row items-start justify-between gap-3 sm:gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              My Tasks
            </h1>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground pr-2">{tasks.length}</span>{" "}
              task{tasks.length !== 1 ? "s" : ""} assigned to you
            </p>
          </div>
        </div>

      </div>

      {/* ── Table ──────────────────────────────────────────────────── */}
      <ProjectTable tasks={tasks} userRole={userRole} />
    </div>
  );
};