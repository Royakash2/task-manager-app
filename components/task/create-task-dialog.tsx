'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { taskFormSchema } from "@/lib/schema";
import { projectProps } from "@/utils/types";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useWorkSpaceId } from "@/hooks/UseWorkspaceId";

type TaskFormValues = z.infer<typeof taskFormSchema>;

type Props = {
  project: projectProps;
};

export const CreateTaskDialog = ({ project }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const workspaceId = useWorkSpaceId();
  const [pending, setPending] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "TODO",
      dueDate: new Date(),
      startDate: new Date(),
      priority: "MEDIUM",
      attachments: [],
    },
  });

  const handleOnSubmit = async (data: TaskFormValues) => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Task</Button>
      </DialogTrigger>
    </Dialog>
  );
};