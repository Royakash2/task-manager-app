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
import { LoadingButton } from "../ui/loading-button";
import { Task, User, File as PrismaFile, TaskStatus, TaskPriority } from "@prisma/client";
import { EditIcon } from "lucide-react";
import { updateTaskDetails } from "@/app/actions/task";
import { toast } from "sonner";
import { useUploadThing } from "@/utils/uploadthing";
import { uploadPendingAttachments } from "@/utils/upload-attachments";
import { TaskFormFields } from "./task-form-fields";

type Props = {
  task: Task & {
    assigneeTo: User;
    project: projectProps;
    attachments: PrismaFile[];
  };
  project: projectProps;
};

export const EditTaskDialog = ({ task, project }: Props) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("attachmentUploader");

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title || "",
      description: task.description || "",
      status: task.status || TaskStatus.TODO,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      startDate: task.startDate ? new Date(task.startDate) : undefined,
      priority: task.priority || TaskPriority.MEDIUM,
      attachments:
        task.attachments?.map((file) => ({
          name: file.name,
          url: file.url,
          type: file.type,
        })) || [],
      assigneeId: task.assigneeId || "",
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

      const res = await updateTaskDetails(task.id, {
        ...data,
        attachments: finalAttachments,
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setOpen(false);
      toast.success("Task updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size="icon"
          className="h-7 w-7 rounded-md cursor-pointer"
        >
          <EditIcon className="w-3.5 h-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to update the task.
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
            <div className="flex justify-end space-x-2">
              <LoadingButton
                type="submit"
                loading={pending}
                className="cursor-pointer"
              >
                Update
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
