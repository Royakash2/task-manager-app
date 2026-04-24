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
                        "group bg-white dark:bg-card border border-border/50 shadow-sm rounded-lg p-3.5 mb-3 cursor-grab active:cursor-grabbing",
                        "transition-all duration-200",
                        "hover:border-primary/30 hover:shadow-md",
                        snapshot.isDragging && "shadow-lg border-primary/50 rotate-2 scale-[1.02]"
                    )}
                >
                    <p className="text-[14px] font-semibold text-foreground mb-1 leading-snug">
                        {task.title}
                    </p>
                    
                    <p className="text-[12px] text-muted-foreground mb-4 line-clamp-1">
                        {task.description || "Description"}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-[4px] bg-[#2563eb] text-white flex items-center justify-center text-[11px] font-bold">
                                {task.project?.name?.charAt(0).toUpperCase() || "P"}
                            </div>
                            <span className="text-[12px] font-medium text-muted-foreground">
                                {task.project?.name || "Project"}
                            </span>
                        </div>
                        <Badge 
                            variant="default" 
                            className={cn(
                                "text-[10px] px-2 py-0.5 rounded-[4px] uppercase tracking-wider font-bold border-0",
                                task.priority === "HIGH" ? "bg-red-500 hover:bg-red-600 text-white" :
                                task.priority === "MEDIUM" ? "bg-[#eab308] hover:bg-[#ca8a04] text-white" :
                                "bg-[#4b71f3] hover:bg-blue-600 text-white"
                            )}
                        >
                            {task.priority}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                            <ProfileAvatar
                                name={task.assigneeTo?.name || "Unassigned"}
                                url={task.assigneeTo?.image || undefined}
                                size="sm"
                            />
                            <span className="text-[12px] font-medium text-muted-foreground">
                                {task.assigneeTo?.name || "Unassigned"}
                            </span>
                        </div>

                        {task.dueDate && (
                            <div className={cn(
                                "flex items-center gap-1 text-[11px] text-muted-foreground",
                                isOverdue && "text-red-500 font-medium"
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
