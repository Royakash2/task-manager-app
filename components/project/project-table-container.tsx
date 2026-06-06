import { getProjectById } from "@/app/data/project/get-project-by-id";
import { ProjectTable } from "./project-table";

export const ProjectTableContainer = async ({
    projectId,
    currentUserRole
}: {
    projectId: string;
    currentUserRole: string | null;
}) => {
    const { tasks } = await getProjectById(projectId);
    return (
        <>
            <ProjectTable tasks={tasks} userRole={currentUserRole} />
        </>
    );
};