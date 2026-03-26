import { projectProps } from "@/utils/types";
import { ProjectAvatar } from "./Project-avatar";

export const ProjectHeader = ({ project }: { project: projectProps }) => {
    return (
        <div className="space-y-4 ">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex gap-2">
                    <ProjectAvatar name={project.name} />

                    <div>
                        <h1 className="text-xl 2xl:text-2xl font-bold">{project?.name}</h1>
                        {project?.description && (
                            <p className="text-sm 2xl:text-lg text-muted-foreground">
                                {project?.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};