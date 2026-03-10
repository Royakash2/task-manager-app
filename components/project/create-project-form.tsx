'use client'

import { useWorkSpaceId } from "@/hooks/UseWorkspaceId"
import { projectSchema } from "@/lib/schema"
import { workspaceMembersProps } from "@/utils/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Form, useForm } from "react-hook-form"
import z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Dialog } from "../ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Plus } from "lucide-react"

interface Props {
    workspaceMembers: workspaceMembersProps[]
}
type projectDataType = z.infer<typeof projectSchema>
export const CreateProjectForm = ({
    workspaceMembers
}: Props) => {
    const workspaceId = useWorkSpaceId();
    const [pending, setPending] = useState(false);
    const form = useForm<projectDataType>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            description: "",
            workspaceId: workspaceId as string,
            membersAccess: []
        }
    })
    const handleSubmit = async (data: projectDataType) => {

    }
    return (
        <>
         <Dialog>
            <DialogTrigger asChild>
                <Button className="size-5" size="icon">
                    <Plus/>
                </Button>
            </DialogTrigger>
         </Dialog>

        </>
    )
}