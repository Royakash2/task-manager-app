"use client";

import { userSchema } from '@/lib/schema';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
interface Props {
    name: string;
    email: string;
    image?: string;

}

type userDatatype = z.infer<typeof userSchema>

export const OnboardingForm = ({ name, email, image }: Props) => {
    const [pending, setPending] = useState(false);
    const form = useForm<userDatatype>({
        resolver: zodResolver(userSchema), defaultValues: {
            about: '',
            name: name || '',
            email: email || '',
            image: image || '',
            role: '',
            industryType: '',

        }

    })
    const onSubmit = async (data: userDatatype) => {

    }
    return (
        <div className='min-h-screen flex items-center justify-center bg-background'>

            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Welcome to Aura</CardTitle>
                    <CardDescription>
                        Aura is a premium task management platform designed to bring clarity and speed to your workflow.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-md space-y-6'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter your name' {...field} />
                                        </FormControl>
                                        <FormMessage/>  
                                    </FormItem>
                                )}
                            />
                                
                        </form>
                    </Form>
                </CardContent>
            </Card>

        </div>
    )
}
