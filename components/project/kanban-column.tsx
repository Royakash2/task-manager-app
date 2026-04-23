"use client"

import { Column } from "@/utils/types"
import { Droppable } from "@hello-pangea/dnd"
import KanbanCard from "./kanban-card"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
    column: Column;
}

const statusColors: Record<string, string> = {
    TODO: "border-t-blue-500",
    IN_PROGRESS: "border-t-yellow-500",
    IN_REVIEW: "border-t-purple-500",
    BACKLOG: "border-t-pink-500",
    COMPLETED: "border-t-green-500",
    BLOCKED: "border-t-red-500",
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
    return (
        <div className={cn(
            "min-w-[250px] w-[250px]", // Made columns much smaller! (Was 280px-320px)
            "bg-muted/40 dark:bg-muted/20 rounded-xl overflow-hidden",
            "flex flex-col h-full",
            "border-t-[3px]",
            statusColors[column.id] || "border-t-gray-400"
        )}>
            {/* Column Header - Fixed/Sticky at the top */}
            <div className="flex items-center justify-between px-3 py-3 bg-muted/20 border-b border-border/50 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-semibold text-foreground tracking-tight">
                        {column.title}
                    </h3>
                    {/* Number of tasks in column */}
                    <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[11px] font-medium rounded-full bg-background text-muted-foreground border border-border shadow-sm">
                        {column.tasks.length}
                    </span>
                </div>
            </div>

            {/* Droppable Task Area - Scrollable */}
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                            "flex-1 overflow-y-auto p-2 min-h-[120px] transition-colors duration-200",
                            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                            snapshot.isDraggingOver && "bg-primary/5 dark:bg-primary/10"
                        )}
                    >
                        {column.tasks.map((task, index) => (
                            <KanbanCard
                                key={task.id}
                                task={task}
                                index={index}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
