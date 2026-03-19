import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const userRequired = async () => {
    const {isAuthenticated, getUser} = await getKindeServerSession()
    const isUserAuthenticated = await isAuthenticated()
    if (!isUserAuthenticated) {
        throw new Error("Unauthorized")
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
    
