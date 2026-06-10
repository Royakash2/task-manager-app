"use client";

import { projectProps } from "@/utils/types";
import { ProjectAvatar } from "./Project-avatar";
import { CreateTaskDialog } from "../task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Users } from "lucide-react";

export const ProjectHeader = ({ project }: { project: projectProps }) => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-6 py-4">
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                    <ProjectAvatar 
                        name={project.name} 
                        className="size-10 sm:size-14 2xl:size-16 rounded-xl shadow-sm shrink-0"
                        fallbackClassName="text-lg sm:text-2xl 2xl:text-3xl font-bold"
                    />
                    
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl sm:text-2xl 2xl:text-3xl font-bold tracking-tight text-foreground leading-tight">
                            {project?.name}
                        </h1>
                        {project?.description && (
                            <p className="text-xs sm:text-sm 2xl:text-base text-muted-foreground mt-1 max-w-2xl line-clamp-2">
                                {project?.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: Members + Action */}
                <div className="flex items-center gap-3 sm:gap-5 shrink-0 w-full sm:w-auto">
                    {/* Members */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:flex -space-x-2">
                            {project?.members?.slice(0, 5).map((member) => (
                                <Avatar
                                    key={member.id}
                                    className="size-7 border-2 border-background shadow-sm"
                                >
                                    <AvatarImage src={member?.user.image || undefined} />
                                    <AvatarFallback className="text-[10px]">
                                        {member.user.name.substring(0, 1).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap">
                            <Users className="h-3.5 w-3.5" />
                            <span>{project?.members?.length ?? 0} members</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5 ml-auto">
                      <CreateTaskDialog project={project} />
                    </div>
                </div>
            </div>
            <div className="border-b border-border" />
        </div>
    );
};
