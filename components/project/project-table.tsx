
"use client";

import { DataTable } from "../data-table";
import { createColumns, TaskTableItem } from "./columns";
import { AccessLevel } from "@prisma/client";
export const ProjectTable = ({
    tasks,
    userRole
}: {tasks: TaskTableItem[], userRole: AccessLevel | null}) => {
    const columns = createColumns(userRole);
    return (
        <>
        <DataTable
        data={tasks}
        columns={columns}
        />
        </>
    );
};
