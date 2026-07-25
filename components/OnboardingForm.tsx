"use client";

import { userSchema, UserData } from '@/lib/schema';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { LoadingButton } from './ui/loading-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { countryList } from '@/utils/countryLists';
import Image from 'next/image';
import { industryTypesList, roleList } from '@/utils';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { createUser, updateUser } from '@/app/actions/user';

interface Props {
    name: string;
    email: string;
    image?: string;
    // settings mode extras
    mode?: 'onboarding' | 'settings';
    about?: string;
    country?: string;
    industryType?: string;
    role?: string;
}

export const OnboardingForm = ({
    name,
    email,
    image,
    mode = 'onboarding',
    about = '',
    country = '',
    industryType = '',
    role = '',
}: Props) => {
    const [pending, setPending] = useState(false);
    const router = useRouter();
    const isSettings = mode === 'settings';

    const form = useForm<UserData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            about,
            name: name || '',
            email: email || '',
            image: image || '',
            role,
            industryType,
            country,
        },
    });

    const onSubmit = async (data: UserData) => {
        try {
            setPending(true);

            if (isSettings) {
                const response = await updateUser(data);
                if (response?.success) {
                    toast.success('Profile updated successfully');
                    form.reset(data);
                } else {
                    const errorMsg = response && 'error' in response ? response.error : 'Failed to update profile';
                    toast.error(errorMsg);
                }
            } else {
                const response = await createUser(data);
                if (response?.success && response.redirectTo) {
                    router.push(response.redirectTo);
                } else {
                    toast.error('Something went wrong. Try again later');
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong. Try again later');
        } finally {
            setPending(false);
        }
    };

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-5'>
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

                {isSettings && (
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input type='email' disabled placeholder='Email address' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select a country' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
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
                    <FormField
                        control={form.control}
                        name='industryType'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Industry Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select an industry type' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
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

                    <FormField
                        control={form.control}
                        name='role'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a role' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
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

                {isSettings ? (
                    <div className='flex items-center gap-3 pt-2'>
                        <LoadingButton
                            type='button'
                            variant='outline'
                            className='cursor-pointer'
                            onClick={() => form.reset({ name, email, image, about, country, industryType, role })}
                        >
                            Reset
                        </LoadingButton>
                        <LoadingButton
                            type='submit'
                            loading={pending}
                            loadingText='Saving...'
                            disabled={!form.formState.isDirty}
                            className='cursor-pointer'
                        >
                            Save Changes
                        </LoadingButton>
                    </div>
                ) : (
                    <LoadingButton type='submit' loading={pending} className='w-full'>
                        Submit
                    </LoadingButton>
                )}
            </form>
        </Form>
    );

    // Onboarding: full-page card wrapper
    if (!isSettings) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-background'>
                <Card className='w-full max-w-md'>
                    <CardHeader>
                        <CardTitle className='text-2xl font-bold'>Welcome to Aura</CardTitle>
                        <CardDescription>
                            Aura is a premium task management platform designed to bring clarity and speed to your workflow.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>{formContent}</CardContent>
                </Card>
            </div>
        );
    }

    // Settings: bare card (no full-page wrapper)
    return (
        <Card className='h-full'>
            <CardHeader>
                <CardTitle className='text-lg font-semibold'>Personal Information</CardTitle>
                <CardDescription>Update your personal profile details and contact information</CardDescription>
            </CardHeader>
            <CardContent>{formContent}</CardContent>
        </Card>
    );
};
