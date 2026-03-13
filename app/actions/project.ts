"use server";
import { userRequired } from "../data/user/get-user";

export const createProject = async (data: projectDataType) => {
    const { user } = await userRequired();
}