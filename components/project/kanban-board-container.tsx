"use client"
import { $Enums } from "@/lib/generated/prisma/browser"
import { Column, ProjectTaskProps } from "@/utils/types"
import { useRouter } from "next/navigation"
import { startTransition, useEffect, useState } from "react"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import KanbanColumn from "./kanban-column"
import { updateTaskPosition } from "@/app/actions/task"

const columnsTitle: Record<$Enums.TaskStatus, string> = {
    TODO: "Todo",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    BACKLOG: "Backlog",
    COMPLETED: "Completed",
    BLOCKED: "Blocked",
}

export default function KanbanBoardContainer({ initialTasks }: { initialTasks: ProjectTaskProps[] }) {
    const router = useRouter();

    const [columns, setColumns] = useState<Column[]>([]);

    useEffect(() => {
        const initialColumns: Column[] = Object.entries(columnsTitle).map(
            ([status, title]) => ({
                id: status as $Enums.TaskStatus,
                title,
                tasks: initialTasks
                    .filter((task) => task.status === status)
                    .sort((a, b) => a.position - b.position),
            })
        );

        startTransition(() => {
            setColumns(initialColumns);
        });
    }, [initialTasks]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        // 1. Dropped outside any column → do nothing
        if (!destination) return;

        // 2. Dropped in exact same spot → do nothing
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        // 3. Clone columns to avoid mutating state directly
        const newColumns = columns.map((col) => ({
            ...col,
            tasks: [...col.tasks],
        }));

        // 4. Find the source and destination columns
        const sourceCol = newColumns.find((c) => c.id === source.droppableId)!;
        const destCol = newColumns.find((c) => c.id === destination.droppableId)!;

        // 5. Remove the task from the source column
        const [movedTask] = sourceCol.tasks.splice(source.index, 1);

        // 6. Update the task status if it moved to a different column
        if (source.droppableId !== destination.droppableId) {
            movedTask.status = destination.droppableId as $Enums.TaskStatus;
        }

        // 7. Insert the task into the destination column at the new position
        destCol.tasks.splice(destination.index, 0, movedTask);

        // 8. Optimistic UI update — instant, no loading spinner
        startTransition(() => {
            setColumns(newColumns);
        });

        // 9. Persist to database in the background
        updateTaskPosition(draggableId, destination.droppableId, destination.index);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 py-4 overflow-x-auto w-full h-[calc(100vh-200px)] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
                {columns.map((column) => (
                    <KanbanColumn key={column.id} column={column} />
                ))}
            </div>
        </DragDropContext>
    )
}