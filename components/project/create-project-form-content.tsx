"use client";

import { useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ProjectData } from "@/lib/schema";
import type { workspaceMembersProps } from "@/utils/types";
import { MemberAccessPicker } from "./member-access-picker";

interface CreateProjectDialogBodyProps {
  form: ReturnType<typeof useForm<ProjectData>>;
  workspaceMembers: workspaceMembersProps[];
  pending: boolean;
  onCancel: () => void;
}

const CreateProjectDialogBody = ({
  form,
  workspaceMembers,
  pending,
  onCancel,
}: CreateProjectDialogBodyProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter project name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="What is this project for?"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormField
          control={form.control}
          name="membersAccess"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                <span>Member Access</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {(field.value || []).length} of {workspaceMembers.length} selected
                </span>
              </FormLabel>
              <MemberAccessPicker
                value={field.value || []}
                onChange={field.onChange}
                workspaceMembers={workspaceMembers}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex items-center gap-3 w-full">
        <Button
          type="button"
          variant="outline"
          className="flex-1 cursor-pointer"
          disabled={pending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={pending}
          className="flex-1 cursor-pointer"
        >
          {pending ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </>
  );
};

export default CreateProjectDialogBody;
