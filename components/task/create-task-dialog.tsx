"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, TaskFormValues } from "@/lib/schema";
import { projectProps } from "@/utils/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "../ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Plus } from "lucide-react";
import { createTask } from "@/app/actions/task";
import { toast } from "sonner";
import { useUploadThing } from "@/utils/uploadthing";
import { uploadPendingAttachments } from "@/utils/upload-attachments";
import { TaskFormFields } from "./task-form-fields";

type Props = {
  project: projectProps;
};

export const CreateTaskDialog = ({ project }: Props) => {
  const [open, setOpen] = useState(false);
  const workspaceId = useWorkspaceId();
  const [pending, setPending] = useState(false);

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("attachmentUploader");

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "TODO",
      dueDate: undefined,
      startDate: undefined,
      priority: "MEDIUM",
      attachments: [],
      assigneeId: "",
    },
  });

  const handleOnSubmit = async (data: TaskFormValues) => {
    setPending(true);
    try {
      const finalAttachments = await uploadPendingAttachments(
        pendingFiles,
        data.attachments || [],
        startUpload,
      );
      setPendingFiles([]);
      const res = await createTask(
        { ...data, attachments: finalAttachments },
        project.id,
        workspaceId,
      );
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      form.reset();
      setOpen(false);
      toast.success("Task created successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create task");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-md shadow-md font-semibold px-5 flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="space-y-4"
          >
            <TaskFormFields
              form={form}
              project={project}
              onPendingChange={setPendingFiles}
            />
            <div className="flex justify-end space-x-2 ">
              <Button
                type="submit"
                disabled={pending}
                className="cursor-pointer"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
