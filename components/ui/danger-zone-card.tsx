"use client";

import { AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";

interface DangerZoneCardProps {
  entityLabel: string;
  entityDisplayName: string;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
  deleteDescription: string;
  warning: string;
  redirectUrl?: string;
}

export const DangerZoneCard = ({
  entityLabel,
  entityDisplayName,
  onDelete,
  deleteDescription,
  warning,
  redirectUrl,
}: DangerZoneCardProps) => {
  const capitalizedLabel =
    entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1);

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-destructive" />
          <CardTitle className="text-lg font-semibold text-destructive">
            Danger Zone
          </CardTitle>
        </div>
        <CardDescription>
          Irreversible actions for this {entityLabel}. Proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Delete this {entityLabel}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {deleteDescription}
              </p>
            </div>
            <ConfirmDeleteDialog
              onDelete={onDelete}
              title={`Delete ${capitalizedLabel}`}
              description={
                <>
                  Are you sure you want to delete{" "}
                  <strong>&ldquo;{entityDisplayName}&rdquo;</strong>? This
                  action cannot be undone.
                </>
              }
              entityName={entityLabel}
              deleteLabel={`Delete ${capitalizedLabel}`}
              variant="icon"
              redirectUrl={redirectUrl}
              warning={warning}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
