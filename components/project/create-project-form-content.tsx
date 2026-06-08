"use client";

import { useMemo, useState } from "react";
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
import { Search, Users, Check } from "lucide-react";
import { ProfileAvatar } from "../profile-avatar";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectData } from "@/lib/schema";
import type { workspaceMembersProps } from "@/utils/types";

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
  const [memberSearch, setMemberSearch] = useState("");

  const filteredMembers = useMemo(
    () =>
      workspaceMembers.filter((member) => {
        const q = memberSearch.toLowerCase();
        return (
          member.user.name.toLowerCase().includes(q) ||
          member.user.email.toLowerCase().includes(q)
        );
      }),
    [workspaceMembers, memberSearch],
  );

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
          render={({ field }) => {
            const selectedIds = field.value || [];
            const allMemberIds = workspaceMembers.map((m) => m.userId);
            const allSelected =
              allMemberIds.length > 0 &&
              allMemberIds.every((id) => selectedIds.includes(id));

            const toggleAll = () => {
              if (allSelected) {
                field.onChange([]);
              } else {
                field.onChange([...allMemberIds]);
              }
            };

            return (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span>Member Access</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {selectedIds.length} of {workspaceMembers.length} selected
                  </span>
                </FormLabel>

                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="h-8 pl-8 text-sm"
                  />
                </div>

                <div className="rounded-md border border-border">
                  <div
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 border-b border-border",
                      "hover:bg-muted/40 transition-colors cursor-pointer",
                    )}
                    onClick={toggleAll}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") toggleAll();
                    }}
                  >
                    <div
                      className={cn(
                        "size-4 shrink-0 rounded-lg border flex items-center justify-center transition-colors",
                        allSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input bg-transparent",
                      )}
                    >
                      {allSelected && <Check className="size-3.5" />}
                    </div>
                    <Users className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium text-foreground">
                      {allSelected ? "Deselect All" : "Select All Members"}
                    </span>
                  </div>

                  <div className="max-h-37.5 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
                    <div className="divide-y divide-border">
                      {filteredMembers.map((member) => {
                        const isSelected = selectedIds.includes(member.userId);
                        return (
                          <div
                            key={member.id}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2.5",
                              "hover:bg-muted/40 transition-colors cursor-pointer",
                              isSelected && "bg-muted/20",
                            )}
                            onClick={() => {
                              if (isSelected) {
                                field.onChange(
                                  selectedIds.filter(
                                    (id) => id !== member.userId,
                                  ),
                                );
                              } else {
                                field.onChange([...selectedIds, member.userId]);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                if (isSelected) {
                                  field.onChange(
                                    selectedIds.filter(
                                      (id) => id !== member.userId,
                                    ),
                                  );
                                } else {
                                  field.onChange([
                                    ...selectedIds,
                                    member.userId,
                                  ]);
                                }
                              }
                            }}
                          >
                            <div
                              className={cn(
                                "size-4 shrink-0 rounded-lg border flex items-center justify-center transition-colors",
                                isSelected
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-input bg-transparent",
                              )}
                            >
                              {isSelected && <Check className="size-3.5" />}
                            </div>
                            <ProfileAvatar
                              name={member.user.name}
                              url={member.user.image}
                              size="sm"
                              className="size-7 rounded-full"
                            />
                            <div className="min-w-0 flex-1 flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground truncate">
                                {member.user.name}
                              </span>
                              <Badge
                                variant={
                                  member.accessLevel as
                                    | "OWNER"
                                    | "ADMIN"
                                    | "MEMBER"
                                }
                                className="text-[10px] px-2 shrink-0"
                              >
                                {member.accessLevel}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}

                      {filteredMembers.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Users className="size-8 text-muted-foreground/30 mb-2" />
                          <p className="text-xs text-muted-foreground">
                            No members found matching &ldquo;{memberSearch}
                            &rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
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
