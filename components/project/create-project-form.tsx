'use client'

import { projectSchema } from "@/lib/schema"
import { workspaceMembersProps } from "@/utils/types"
import z from "zod"

interface Props {
    workspaceMembers: workspaceMembersProps[]
}
type projectDataType = z.infer<typeof projectSchema>
export const CreateProjectForm = ({
    workspaceMembers
}: Props) => {
    return (
        <>
        
        </>
    )
}