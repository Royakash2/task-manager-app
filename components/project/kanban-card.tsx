"use client"

import { ProjectTaskProps } from "@/utils/types"
import { Draggable } from "@hello-pangea/dnd"
import { Badge } from "@/components/ui/badge"
import { ProfileAvatar } from "@/components/profile-avatar"
import { CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface KanbanCardProps {
    task: ProjectTaskProps;
    index: number;
}

export default function KanbanCard({ task, index }: KanbanCardProps) {
    const isOverdue = task.dueDate
        && task.status !== "COMPLETED"
        && new Date(task.dueDate) < new Date();

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                        "group bg-white dark:bg-card border border-border/50 rounded-md p-3 mb-2 cursor-grab active:cursor-grabbing",
                        "transition-all duration-150",
                        "hover:border-border/80 hover:shadow-sm",
                        snapshot.isDragging && "shadow-md border-border scale-[1.01] opacity-90"
                    )}
                >
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                            {task.title}
                        </p>
                        <Badge 
                            variant="outline" 
                            className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-medium shrink-0",
                                task.priority === "HIGH" ? "text-red-500/80 border-red-400/50" :
                                task.priority === "MEDIUM" ? "text-amber-500/80 border-amber-400/50" :
                                "text-blue-500/70 border-blue-400/40"
                            )}
                        >
                            {task.priority}
                        </Badge>
                    </div>

                    {task.description && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-xs text-muted-foreground/70">
                            {task.project?.name || "Project"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/20">
                        <div className="flex items-center gap-1.5">
                            <ProfileAvatar
                                name={task.assigneeTo?.name || "?"}
                                url={task.assigneeTo?.image || undefined}
                                size="sm"
                            />
                            <span className="text-xs text-muted-foreground">
                                {task.assigneeTo?.name || "Unassigned"}
                            </span>
                        </div>

                        {task.dueDate && (
                            <div className={cn(
                                "flex items-center gap-1 text-xs text-muted-foreground",
                                isOverdue && "text-foreground/60"
                            )}>
                                <CalendarDays className="h-3 w-3" />
                                <span>{format(new Date(task.dueDate), "MMM d")}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    )
}
