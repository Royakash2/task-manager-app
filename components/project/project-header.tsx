import { projectProps } from "@/utils/types";
import { ProjectAvatar } from "./Project-avatar";
import { CreateTaskDialog } from "../task/create-task-dialog";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Users } from "lucide-react";

export const ProjectHeader = ({ project }: { project: projectProps }) => {
    return (
        <Card className="p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Avatar + Project Info */}
                <div className="flex items-center gap-4">
                    <ProjectAvatar 
                        name={project.name} 
                        className="size-12 2xl:size-14 shadow-sm"
                        fallbackClassName="text-xl 2xl:text-2xl font-bold"
                    />
                    <div className="flex flex-col justify-center">
                        <h1 className="text-xl 2xl:text-2xl font-bold tracking-tight text-foreground">
                            {project?.name}
                        </h1>
                        {project?.description && (
                            <p className="text-sm 2xl:text-base text-muted-foreground mt-0.5 max-w-xl truncate">
                                {project?.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: Members + Action */}
                <div className="flex flex-row flex-wrap items-center justify-between w-full md:w-auto gap-4 mt-2 md:mt-0">
                    {/* Team Members */}
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {project?.members?.slice(0, 5).map((member) => (
                                <Avatar
                                    key={member.id}
                                    className="size-8 border-2 border-background shadow-sm"
                                >
                                    <AvatarImage src={member?.user.image || undefined} />
                                    <AvatarFallback className="text-xs">
                                        {member.user.name.substring(0, 1).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                            <Users className="h-3.5 w-3.5" />
                            <span>{project?.members?.length ?? 0} members</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-6 w-px bg-border hidden md:block" />

                    {/* Action */}
                    <CreateTaskDialog project={project} />
                </div>
            </div>
        </Card>
    );
};