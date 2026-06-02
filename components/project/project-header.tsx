"use client";

import { projectProps } from "@/utils/types";
import { ProjectAvatar } from "./Project-avatar";
import { CreateTaskDialog } from "../task/create-task-dialog";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Users, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ProjectHeader = ({ project }: { project: projectProps }) => {
    return (
        <div className="flex flex-col">
            <div className="flex items-start justify-between gap-6 py-4">
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-5 min-w-0">
                    <ProjectAvatar 
                        name={project.name} 
                        className="size-14 2xl:size-16 rounded-xl shadow-sm shrink-0"
                        fallbackClassName="text-2xl 2xl:text-3xl font-bold"
                    />
                    
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl 2xl:text-3xl font-bold tracking-tight text-foreground leading-tight">
                            {project?.name}
                        </h1>
                        {project?.description && (
                            <p className="text-sm 2xl:text-base text-muted-foreground mt-1.5 max-w-2xl line-clamp-2">
                                {project?.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: Members + Action */}
                <div className="flex items-center gap-5 shrink-0 pt-1">
                    {/* Members */}
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
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

                    <CreateTaskDialog project={project} />

                    {/* Project actions menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-md cursor-pointer text-muted-foreground hover:bg-muted"
                        >
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 p-1">
                          <DeleteProjectDialog
                            projectId={project.id}
                            projectName={project.name}
                            workspaceId={project.workspaceId}
                            redirectOnDelete
                          />
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="border-b border-border" />
        </div>
    );
};
