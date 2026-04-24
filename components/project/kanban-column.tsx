"use client"

import { Column } from "@/utils/types"
import { Droppable } from "@hello-pangea/dnd"
import KanbanCard from "./kanban-card"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
    column: Column;
}

const statusColors: Record<string, string> = {
    TODO: "bg-[#4b71f3]",
    IN_PROGRESS: "bg-[#f59e0b]",
    IN_REVIEW: "bg-[#a855f7]",
    BACKLOG: "bg-[#ec4899]",
    COMPLETED: "bg-[#10b981]",
    BLOCKED: "bg-[#ef4444]",
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
    return (
        <div className={cn(
            "min-w-[280px] w-[280px]",
            "bg-[#f8f9fa] dark:bg-muted/10 rounded-xl overflow-hidden",
            "flex flex-col h-full border border-border/40"
        )}>
            <div className="flex items-center justify-between px-4 py-4 bg-transparent border-b border-border/40 sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                    <div className={cn("w-3.5 h-3.5 rounded-[4px]", statusColors[column.id] || "bg-gray-400")} />
                    <h3 className="text-[14px] font-bold text-foreground tracking-tight">
                        {column.title}
                    </h3>
                </div>
            </div>

            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                            "flex-1 overflow-y-auto p-3 min-h-[120px] transition-colors duration-200",
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
