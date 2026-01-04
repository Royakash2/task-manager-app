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
import { industryTypesList, roleList } from '@/utils';
import { Textarea } from './ui/textarea';
interface Props {
    name: string;
    email: string;
    image?: string;

}

export type userDatatype = z.infer<typeof userSchema>

export const OnboardingForm = ({ name, email, image }: Props) => {
    const [pending, setPending] = useState(false);
    console.log(pending, setPending);
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
        console.log(data);

    }
    return (
        <div className='min-h-screen flex items-center justify-center bg-background'>

            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold'>Welcome to Aura</CardTitle>
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
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                {/* industry type */}
                                <FormField
                                    control={form.control}
                                    name='industryType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Industry Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder="Select a industry type" />

                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent >
                                                    {industryTypesList.map((industry) => (
                                                        <SelectItem key={industry} value={industry}>
                                                            {industry}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* role */}
                                <FormField
                                    control={form.control}
                                    name='role'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder="Select a role" />

                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent >
                                                    {roleList.map((role) => (
                                                        <SelectItem key={role} value={role}>
                                                            {role}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name='about'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder='Tell us about yourself' className='resize-none' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' disabled={pending} className='w-full'>
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
