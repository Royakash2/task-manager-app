"use client"

import { ProjectTaskProps } from "@/utils/types"
import { Draggable } from "@hello-pangea/dnd"
import { Badge } from "@/components/ui/badge"
import { ProfileAvatar } from "@/components/profile-avatar"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface KanbanCardProps {
    task: ProjectTaskProps;
    index: number;
    isDragDisabled?: boolean;
}

export default function KanbanCard({ task, index, isDragDisabled }: KanbanCardProps) {
    const isOverdue = task.dueDate
        && task.status !== "COMPLETED"
        && new Date(task.dueDate) < new Date();

    return (
        <Draggable draggableId={task.id} index={index} isDragDisabled={isDragDisabled}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                        "group bg-white dark:bg-card border border-border/50 rounded-md mb-2 cursor-grab active:cursor-grabbing py-0 gap-0",
                        "transition-all duration-150",
                        "hover:border-border/80 hover:shadow-sm",
                        snapshot.isDragging && "shadow-md border-border scale-[1.01] opacity-90"
                    )}
                >
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                            {task.dueDate ? (
                                <div className={cn(
                                    "flex items-center gap-1 text-xs text-muted-foreground",
                                    isOverdue && "text-foreground/60"
                                )}>
                                    <CalendarDays className="h-3 w-3" />
                                    <span>{format(new Date(task.dueDate), "MMM d")}</span>
                                </div>
                            ) : <div />}
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-medium shrink-0 text-muted-foreground",
                                    task.priority === "HIGH" ? "border-red-400/50" :
                                        task.priority === "MEDIUM" ? "border-amber-400/50" :
                                            "border-blue-400/40"
                                )}
                            >
                                {task.priority}
                            </Badge>
                        </div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-xs 2xl:text-sm font-semibold text-foreground leading-snug line-clamp-3">
                                {task.title}
                            </p>
                        </div>

                        {task.description && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        <div className="flex items-center mt-auto pt-2 border-t border-border/20">
                            <div className="flex items-center gap-1.5">
                                <ProfileAvatar
                                    name={task.assigneeTo?.name || "?"}
                                    url={task.assigneeTo?.image || undefined}
                                    size="xs"
                                />
                                <span className="text-xs text-muted-foreground">
                                    {task.assigneeTo?.name || "Unassigned"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </Draggable>
    )
}
