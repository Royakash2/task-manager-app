"use client"

import { Column } from "@/utils/types"
import { Droppable } from "@hello-pangea/dnd"
import KanbanCard from "./kanban-card"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
    column: Column;
    isViewer?: boolean;
}

export default function KanbanColumn({ column, isViewer }: KanbanColumnProps) {
    return (
        <div className={cn(
            "flex-1 min-w-[170px] max-w-[240px]",
            "bg-transparent",
            "flex flex-col border-r border-border last:border-r-0"
        )}>
            <div className="flex items-center justify-between px-4 py-3.5 bg-transparent border-b border-border sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                        {column.title}
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium">
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
                                isDragDisabled={isViewer}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
