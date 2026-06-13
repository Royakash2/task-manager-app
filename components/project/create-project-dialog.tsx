"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectData } from "@/lib/schema";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AccessLevel } from "@prisma/client";
import { createProject } from "@/app/actions/project";

import type { workspaceMembersProps } from "@/utils/types";
import CreateProjectDialogBody from "./create-project-form-content";

interface Props {
  workspaceMembers: workspaceMembersProps[];
}

export const CreateProjectForm = ({ workspaceMembers }: Props) => {
  const workspaceId = useWorkspaceId();
  const [pending, setPending] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const lockedMemberIds = useMemo(
    () =>
      workspaceMembers
        .filter(
          (m) => m.accessLevel === AccessLevel.OWNER || m.accessLevel === AccessLevel.ADMIN,
        )
        .map((m) => m.userId),
    [workspaceMembers],
  );

  const form = useForm<ProjectData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      workspaceId: workspaceId as string,
      membersAccess: lockedMemberIds,
    },
  });

  const handleSubmit = async (data: ProjectData) => {
    try {
      setPending(true);
      const result = await createProject(data);
      if ("error" in result) {
        toast.error(result.error || "Failed to create project");
        return;
      }
      form.reset();
      toast.success("Project created successfully");
      setDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create project");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="size-7 shrink-0 hover:bg-sidebar-accent cursor-pointer"
              size="icon"
            >
              <Plus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">Create Project</TooltipContent>
      </Tooltip>
      <DialogContent className="max-h-[95vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create new Project
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new project and manage member
            access.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full max-w-md space-y-5"
          >
            <CreateProjectDialogBody
              form={form}
              workspaceMembers={workspaceMembers}
              pending={pending}
              onCancel={() => setDialogOpen(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
