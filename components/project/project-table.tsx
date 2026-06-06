
"use client";

import { DataTable } from "../data-table";
import { createColumns, TaskTableItem } from "./columns";
export const ProjectTable = ({
    tasks,
    userRole
}: {tasks: TaskTableItem[], userRole: string | null}) => {
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
