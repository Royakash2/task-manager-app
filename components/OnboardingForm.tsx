"use client";

import { userSchema } from '@/lib/schema';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { countryList, } from '@/utils/countryLists';
import Image from 'next/image';
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-md space-y-5'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter your name' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='country'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder="Select a country" />

                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
                                                {countryList.map((country) => (
                                                    <SelectItem key={country.code} value={country.code}>
                                                        <div className='flex items-center gap-2'>
                                                            <Image src={country.flag} alt={country.name} width={20} height={20} />
                                                            <span>{country.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' >
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
