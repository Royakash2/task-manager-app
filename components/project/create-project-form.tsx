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
         <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold'>Create new Workspace</CardTitle>
                    <CardDescription>
                        Setup a workspace for you and your team
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit()} className='w-full max-w-md space-y-5'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Workspace Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter workspace name' {...field} />
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
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='What is this workspace for?'
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
                                    {pending ? "Creating..." : "Create Workspace"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}