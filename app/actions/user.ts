'use server';

import { userDatatype } from "@/components/OnboardingForm";
import { userRequired } from "../data/user/get-user";
import { userSchema } from "@/lib/schema";
import db from "@/lib/db";


export const createUser = async (data: userDatatype) => {
    const { user } = await userRequired();
    if (!user) {
        throw new Error("Unauthorized: User not found");
    }
    const validateData = userSchema.safeParse(data);

    if (!validateData.success) {
        throw new Error("Invalid data");
    }

    const userData = await db.user.create({
        data: {
            id: user.id,
            email: data.email as string,
            name: validateData.data.name,
            about: validateData.data.about,
            country: validateData.data.country,
            indrustryType: validateData.data.industryType,
            role: validateData.data.role,
            onboardingCompleted: true,
            image: data.image,
            subscription: {
               create: {
                plan: "FREE",
                status: "ACTIVE",
                customerPeriodEnd: new Date(),
                cancelAtPeriodEnd: false,
                
               }
                
            }
            
        }
    })
    return userData
}