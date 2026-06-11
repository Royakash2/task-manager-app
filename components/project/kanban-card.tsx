"use client"

import { ProjectTaskProps } from "@/utils/types"
import { Draggable } from "@hello-pangea/dnd"
import { ProfileAvatar } from "@/components/profile-avatar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { 
    Calendar, 

    Activity, 
   
    FileText
} from "lucide-react"

interface KanbanCardProps {
    task: ProjectTaskProps;
    index: number;
    isDragDisabled?: boolean;
}



const PRIORITY_CIRCLE: Record<string, { bg: string; border: string; text: string }> = {
    CRITICAL: { bg: "bg-rose-500/10 dark:bg-rose-500/20", border: "border-rose-500/20 dark:border-rose-500/30", text: "text-rose-500 dark:text-rose-400" },
    HIGH:     { bg: "bg-amber-500/10 dark:bg-amber-500/20", border: "border-amber-500/20 dark:border-amber-500/30", text: "text-amber-500 dark:text-amber-400" },
    MEDIUM:   { bg: "bg-blue-500/10 dark:bg-blue-500/20",   border: "border-blue-500/20 dark:border-blue-500/30",   text: "text-blue-500 dark:text-blue-400" },
    LOW:      { bg: "bg-zinc-500/10 dark:bg-zinc-500/20",  border: "border-zinc-500/20 dark:border-zinc-500/30",  text: "text-zinc-500 dark:text-zinc-400" },
}

function WaveCircle({ priority }: { priority: string }) {
    const colors = PRIORITY_CIRCLE[priority] || PRIORITY_CIRCLE.LOW;
    return (
        <div className={cn(
            "w-[18px] h-[18px] rounded-full flex items-center justify-center border shrink-0",
            colors.bg,
            colors.border,
            colors.text
        )}>
            <Activity className="w-2.5 h-2.5" />
        </div>
    )
}



export default function KanbanCard({ task, index, isDragDisabled }: KanbanCardProps) {
    const priority = task.priority || "LOW";

    return (
        <Draggable draggableId={task.id} index={index} isDragDisabled={isDragDisabled}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                        "flex flex-col rounded-[6px] mb-2 p-3",
                        "bg-white border border-zinc-200 text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)]",
                        "dark:bg-[#161719] dark:border-[#222326] dark:text-zinc-100 dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)]",
                        "transition-all duration-150 ease-in-out",
                        "hover:border-zinc-300 dark:hover:border-[#2f3136] hover:shadow-md dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)]",
                        snapshot.isDragging && "shadow-lg scale-[1.02] opacity-90"
                    )}
                >
                    {/* Top row: Title, Icon, Wave circle status, Assignee Avatar */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                            <span className="font-semibold text-[13px] text-zinc-800 dark:text-zinc-100 tracking-tight truncate">
                                {task.title}
                            </span>
                        </div>
                       
                    </div>

                    {/* Middle row: Description (line-clamp-2) */}
                    {task.description && (
                        <p className="text-[12px] text-zinc-600 dark:text-[#8a8f98] font-normal leading-normal mb-3 line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    {/* Bottom row: Due date + project/percentage diamond */}
                    <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1.5 mt-auto text-[11px] text-zinc-500 dark:text-[#8a8f98] font-medium select-none">
                        <div className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                            <Calendar className="h-3.5 w-3.5 text-zinc-400 dark:text-[#8a8f98]/80 shrink-0" />
                            <span>{format(task.dueDate || task.createdAt, "MMM d, yyyy")}</span>
                        </div>
                         <div className="flex items-center gap-1.5 shrink-0">
                            <WaveCircle priority={priority} />
                            <ProfileAvatar
                                name={task.assigneeTo?.name || "?"}
                                url={task.assigneeTo?.image || undefined}
                                size="xs"
                            />
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}
