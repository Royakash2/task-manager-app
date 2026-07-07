"use client";

import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";

interface EntitySettingsFormData {
  name: string;
  description?: string;
}

interface EntitySettingsFormProps {
  schema: z.ZodType<FieldValues, FieldValues>;
  defaultValues: EntitySettingsFormData;
  onSave: (data: EntitySettingsFormData) => Promise<
    { success: boolean; error?: string }
  >;
  disabled: boolean;
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
}

export const EntitySettingsForm = ({
  schema,
  defaultValues,
  onSave,
  disabled,
  title,
  description,
  nameLabel,
  namePlaceholder,
  descriptionLabel = "Description",
  descriptionPlaceholder = "Add a description...",
}: EntitySettingsFormProps) => {
  const [pending, setPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FieldValues) => {
    setPending(true);
    try {
      const result = await onSave(data as EntitySettingsFormData);
      if (!result.success) {
        toast.error(result.error || "Failed to update");
        return;
      }
      form.reset(data);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("[ENTITY_SETTINGS_ERROR]:", error);
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{nameLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={namePlaceholder}
                      disabled={disabled}
                      {...field}
                    />
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
                  <FormLabel>{descriptionLabel}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={descriptionPlaceholder}
                      className="resize-none"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!disabled && (
              <div className="flex items-center gap-3 pt-2">
                <LoadingButton
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => form.reset(defaultValues)}
                >
                  Reset
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  loading={pending}
                  loadingText="Saving..."
                  disabled={!form.formState.isDirty}
                  className="cursor-pointer"
                >
                  Save Changes
                </LoadingButton>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
