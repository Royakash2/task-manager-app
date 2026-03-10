'use client'

import { useWorkSpaceId } from "@/hooks/UseWorkspaceId"
import { projectSchema } from "@/lib/schema"
import { workspaceMembersProps } from "@/utils/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import {  useForm } from "react-hook-form"
import z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
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
            <DialogContent>
                <Card className='w-full border-none shadow-none max-w-md'>
                <DialogHeader>
                    <DialogTitle className='text-2xl font-bold'>Create new Project</DialogTitle>
                    <DialogDescription>
                        Setup a project for you and your team
                    </DialogDescription>
                </DialogHeader>
                <CardContent>
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

                            <div className='flex items-center gap-3 w-full'>
                                <Button type='button' variant="outline" className='flex-1' disabled={pending}>
                                    cancel
                                </Button>
                                <Button type='submit' disabled={pending} className='flex-1'>
                                    {pending ? "Creating..." : "Create Project"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
                
            </DialogContent>
         </Dialog>

        </>
    )
}