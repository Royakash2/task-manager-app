"use client";

import { useState } from "react";
import { DataTable } from "../data-table";
import { createColumns, TaskTableItem } from "./columns";
import { AccessLevel } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { bulkDeleteTasks } from "@/app/actions/task";
import { BatchActionBar } from "./batch-action-bar";

export const ProjectTable = ({
    tasks,
    userRole
}: {tasks: TaskTableItem[], userRole: AccessLevel | null}) => {
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const selectedRowIds = Object.keys(rowSelection);
    const selectedTaskIds = selectedRowIds
        .map((idx) => tasks[parseInt(idx)]?.id)
        .filter(Boolean) as string[];

    const workspaceId = tasks[0]?.project?.workspaceId ?? "";

    const handleBulkDelete = async () => {
        if (selectedTaskIds.length === 0) return;
        setIsDeleting(true);
        try {
            const result = await bulkDeleteTasks(selectedTaskIds, workspaceId);
            if (result.success) {
                toast.success(`Deleted ${result.count} task(s)`);
                setRowSelection({});
                router.refresh();
            } else {
                toast.error(result.error || "Failed to delete tasks");
            }
        } catch {
            toast.error("Failed to delete tasks");
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = createColumns(userRole);
    const isMember = userRole === AccessLevel.MEMBER;

    return (
        <div className="space-y-2">
            {selectedTaskIds.length > 0 && !isMember && (
                <BatchActionBar
                    selectedCount={selectedTaskIds.length}
                    isDeleting={isDeleting}
                    onDelete={handleBulkDelete}
                    onCancel={() => setRowSelection({})}
                />
            )}
            <DataTable
                data={tasks}
                columns={columns}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
            />
        </div>
    );
};
