import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const userRequired = async () => {
    const {isAuthenticated, getUser} = await getKindeServerSession()
    const isUserAuthenticated = await isAuthenticated()
    if (!isUserAuthenticated) {
        redirect("/api/auth/login");
    }
    const user = await getUser()
    if (!user) {
        throw new Error("User not found")
    }
    return {
        user,
        isUserAuthenticated
    }
}
    
