import { getWorkspaceById } from "@/app/data/workspace/get-workspace-by-id";
import { SettingsPageClient } from "@/components/workspace/workspace-settings";

interface SettingsPageProps {
  params: Promise<{ workspaceId: string }>;
}

const SettingsPage = async (props: SettingsPageProps) => {
  const { workspaceId } = await props.params;
  const result = await getWorkspaceById(workspaceId);

  if ("error" in result && result.error) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your workspace settings
          </p>
        </div>
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
          <p className="text-destructive font-medium">{result.error}</p>
        </div>
      </div>
    );
  }

  if (!result.workspace) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your workspace settings
          </p>
        </div>
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
          <p className="text-destructive font-medium">Workspace not found</p>
        </div>
      </div>
    );
  }

  return (
    <SettingsPageClient
      workspace={result.workspace}
      workspaceId={workspaceId}
      currentUserRole={result.currentUserRole}
    />
  );
};

export default SettingsPage;
