"use client"
import { $Enums } from "@/lib/generated/prisma/browser"
import { ProjectTaskProps } from "@/utils/types"

const columnsTitle : Record<$Enums.TaskStatus, string> = {
    TODO: "Todo",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    BACKLOG: "Backlog",
    COMPLETED: "Completed",
    BLOCKED: "Blocked",
   
}

export default function KanbanBoardContainer({ initialTasks }: { initialTasks: ProjectTaskProps[] }) {
    return (
        <div>
            <h1>Kanban Board</h1>
        </div>
    )
}