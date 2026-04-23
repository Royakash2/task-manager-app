"use client"

import { ProjectTaskProps } from "@/utils/types"
import { Draggable } from "@hello-pangea/dnd"
import { Badge } from "@/components/ui/badge"
import { ProfileAvatar } from "@/components/profile-avatar"
import { CalendarDays, GripVertical } from "lucide-react"
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
                    className={cn(
                        "group bg-background border border-border rounded-lg p-2.5 mb-2 cursor-grab active:cursor-grabbing",
                        "transition-shadow duration-200",
                        "hover:border-primary/30 hover:shadow-sm",
                        snapshot.isDragging && "shadow-lg border-primary/50 rotate-2 scale-[1.02]"
                    )}
                >
                    <div className="flex items-center justify-between mb-1.5">
                        <div
                            {...provided.dragHandleProps}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <Badge variant={task.priority as any} className="text-[10px] px-1.5 py-0 leading-tight">
                            {task.priority}
                        </Badge>
                    </div>

                    <p className="text-[13px] font-medium leading-snug mb-3 line-clamp-2">
                        {task.title}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1.5">
                            <ProfileAvatar
                                name={task.assigneeTo?.name || "?"}
                                url={task.assigneeTo?.image || undefined}
                                size="sm"
                            />
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
