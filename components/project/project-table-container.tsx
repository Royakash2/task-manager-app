import { getProjectById } from "@/app/data/project/get-project-by-id";
import { ProjectTable } from "./project-table";

export const ProjectTableContainer = async ({
    projectId
}: {
    projectId: string;
}) => {
    const { tasks } = await getProjectById(projectId);
    return (
        <>
            <ProjectTable projectId={projectId} tasks={tasks} />
        </>
    );
};