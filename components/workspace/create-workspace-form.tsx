"use client";

import { workspaceSchema, WorkspaceData } from '@/lib/schema';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { createWorkspace } from '@/app/actions/workspace';
import { useRouter } from 'next/navigation';

export type createWorkspaceDatatype = WorkspaceData

export const CreateWorkspaceForm = () => {
    const [pending, setPending] = useState(false);
    const router = useRouter();

    const form = useForm<createWorkspaceDatatype>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            description: ""
        }
    })

    const onSubmit = async (data: createWorkspaceDatatype) => {
        try {
            setPending(true);
            const result = await createWorkspace(data);
            if ("error" in result) {
                toast.error(result.error || "Failed to create workspace");
                return;
            }
            toast.success("Workspace created successfully!");
            router.push(`/workspace/${result.data?.id}`);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again later")
        } finally {
            setPending(false);
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-background'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold'>Create new Workspace</CardTitle>
                    <CardDescription>
                        Setup a workspace for you and your team
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-md space-y-5'>
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
                                        <FormLabel>Description</FormLabel>
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
                                <Button type='button' variant="outline" className='flex-1' disabled={pending} onClick={() => router.back()}>
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
        </div>
    )
}
