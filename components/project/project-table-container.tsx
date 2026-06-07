import { getProjectById } from "@/app/data/project/get-project-by-id";
import { ProjectTable } from "./project-table";

export const ProjectTableContainer = async ({
    projectId,
    workspaceId,
    currentUserRole
}: {
    projectId: string;
    workspaceId: string;
    currentUserRole: string | null;
}) => {
    const { tasks } = await getProjectById(workspaceId, projectId);
    return (
        <>
            <ProjectTable tasks={tasks} userRole={currentUserRole} />
        </>
    );
};