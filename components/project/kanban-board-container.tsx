"use client"
import { $Enums } from "@/lib/generated/prisma/browser"
import { Column, ProjectTaskProps } from "@/utils/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


const columnsTitle : Record<$Enums.TaskStatus, string> = {
    TODO: "Todo",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    BACKLOG: "Backlog",
    COMPLETED: "Completed",
    BLOCKED: "Blocked",
   
}

export default function KanbanBoardContainer({ initialTasks }: { initialTasks: ProjectTaskProps[] }) {
    const router = useRouter();
    // if (initialTasks.length === 0) return null;

    const [columns, setColumns] = useState<Column[]>(() => {
        return Object.entries(columnsTitle).map(([status, title]) => ({
            id: status as $Enums.TaskStatus,
            title,
            tasks: initialTasks
                .filter((task) => task.status === status)
                .sort((a, b) => a.position - b.position),
        }));
    });

    return (
        <div>
          
        </div>
    )
}