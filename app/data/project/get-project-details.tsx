export const getProjectDetails = async () => {
    try {
        
        
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: true,
            message: "Failed to get project details",
        };
    }
}