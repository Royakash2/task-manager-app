import { getWorkspaceById } from "@/app/data/workspace/get-workspace-by-id";
import { getTrashedTasks } from "@/app/data/task/get-trashed-tasks";
import { SettingsPageClient } from "@/components/workspace/workspace-settings";

interface SettingsPageProps {
  params: Promise<{ workspaceId: string }>;
}

const SettingsPage = async (props: SettingsPageProps) => {
  const { workspaceId } = await props.params;
  const result = await getWorkspaceById(workspaceId);

  if ("error" in result) {
    return (
      <div className="flex flex-col gap-6 p-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your workspace settings
          </p>
        </div>
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
          <p className="text-destructive font-medium">{result.error || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  const trashedResult = await getTrashedTasks(workspaceId);
  const trashedTasks = "error" in trashedResult ? [] : trashedResult.tasks;

  return (
    <SettingsPageClient
      workspace={result.workspace}
      workspaceId={workspaceId}
      currentUserRole={result.currentUserRole}
      trashedTasks={trashedTasks}
    />
  );
};

export default SettingsPage;
