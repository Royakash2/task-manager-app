"use client"
import { $Enums } from "@prisma/client"
import { Column, ProjectTaskProps } from "@/utils/types"
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

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        const newColumns = columns.map((col) => ({
            ...col,
            tasks: [...col.tasks],
        }));

        const sourceCol = newColumns.find((c) => c.id === source.droppableId)!;
        const destCol = newColumns.find((c) => c.id === destination.droppableId)!;

        const [movedTask] = sourceCol.tasks.splice(source.index, 1);

        if (source.droppableId !== destination.droppableId) {
            movedTask.status = destination.droppableId as $Enums.TaskStatus;
        }

        destCol.tasks.splice(destination.index, 0, movedTask);

        startTransition(() => {
            setColumns(newColumns);
        });

        updateTaskPosition(draggableId, destination.droppableId, destination.index);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto w-full h-full bg-muted/50 dark:bg-muted/15 border border-border/40 rounded-lg [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
                {columns.map((column) => (
                    <KanbanColumn key={column.id} column={column} /> 
                ))}
            </div>
        </DragDropContext>
    )
}