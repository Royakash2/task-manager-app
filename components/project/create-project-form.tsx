'use client'

import { useWorkSpaceId } from "@/hooks/UseWorkspaceId"
import { projectSchema } from "@/lib/schema"
import { workspaceMembersProps } from "@/utils/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Plus } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { toast } from "sonner"
import { createProject } from "@/app/actions/project"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface Props {
    workspaceMembers: workspaceMembersProps[]
}
export type projectDataType = z.infer<typeof projectSchema>
export const CreateProjectForm = ({
    workspaceMembers
}: Props) => {
    const workspaceId = useWorkSpaceId();
    const [pending, setPending] = useState(false);
    const router = useRouter();
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
        try{
            setPending(true);
            await createProject(data);
            form.reset();
            toast.success("Project created successfully")
            router.refresh();
        }catch(error){
            console.log(error);
            toast.error("Failed to create project")
        }finally{
            setPending(false);
        }
    }
    return (
        <>
            <Dialog>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant='ghost' className="size-7 shrink-0 hover:bg-sidebar-accent cursor-pointer" size="icon">
                                <Plus />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        Create Project
                    </TooltipContent>
                </Tooltip>
                <DialogContent>
                        <DialogHeader>
                            <DialogTitle className='text-2xl font-bold'>Create new Project</DialogTitle>
                            <DialogDescription>Fill in the details to create a new project and manage member access.</DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full max-w-md space-y-5'>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter project name' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='description'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder='What is this project for?'
                                                    className='resize-none'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <FormField
                                        control={form.control}
                                        name='membersAccess'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Members Access</FormLabel>
                                                <div>
                                                    {workspaceMembers.map((member) => (
                                                        <div key={member.id} className="flex items-center space-x-2" >
                                                            <Checkbox
                                                                id={member.userId}
                                                                checked={field.value?.includes(member.userId)}
                                                                onCheckedChange={(checked) => {
                                                                    const currentValue = field.value || [];
                                                                    if (checked) {
                                                                        field.onChange([...currentValue, member.userId]);
                                                                    } else {
                                                                        field.onChange(currentValue.filter((id) => id !== member.userId));
                                                                    }
                                                                }}
                                                            />
                                                            <label className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed
                                                             cursor-pointer capitalize" htmlFor={member.userId}>
                                                                {member.user.name} ({member.accessLevel.toLowerCase()})</label>
                                                        </div>
                                                    ))}

                                                </div>
                                                <FormMessage />
                                            </FormItem>

                                        )}

                                    />
                                </div>

                                <div className='flex items-center gap-3 w-full'>
                                    <Button type='button' variant="outline" className='flex-1 cursor-pointer' disabled={pending}>
                                        cancel
                                    </Button>
                                    <Button type='submit' disabled={pending} className='flex-1 cursor-pointer'>
                                        {pending ? "Creating..." : "Create Project"}
                                    </Button>
                                </div>
                            </form>
                        </Form>

                </DialogContent>
            </Dialog>

        </>
    )
}