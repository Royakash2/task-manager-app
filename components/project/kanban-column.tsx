"use client"

import { Column } from "@/utils/types"
import { Droppable } from "@hello-pangea/dnd"
import KanbanCard from "./kanban-card"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
    column: Column;
}

const statusColors: Record<string, string> = {
    TODO: "bg-[#94a3b8]",
    IN_PROGRESS: "bg-[#a3a3a3]",
    IN_REVIEW: "bg-[#9ca3af]",
    BACKLOG: "bg-[#b0b0b0]",
    COMPLETED: "bg-[#86a89a]",
    BLOCKED: "bg-[#bfa0a0]",
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
    return (
        <div className={cn(
            "flex-1 min-w-[200px]",
            "bg-transparent",
            "flex flex-col h-full border-r border-border last:border-r-0"
        )}>
            <div className="flex items-center justify-between px-4 py-3.5 bg-transparent sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                    <div className={cn("w-2.5 h-2.5 rounded-full", statusColors[column.id] || "bg-gray-400")} />
                    <h3 className="text-[13px] font-medium text-muted-foreground tracking-tight">
                        {column.title}
                    </h3>
                    <span className="text-[11px] text-muted-foreground/50 font-normal">
                        {column.tasks.length}
                    </span>
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
