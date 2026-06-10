import { getProjectDetails } from "@/app/data/project/get-project-details";
import { getProjectSettings } from "@/app/data/project/get-project-settings";
import KanbanBoardContainer from "@/components/project/kanban-board-container";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectSettings } from "@/components/project/project-settings";
import ProjectDashboard from "@/components/project/project-dashboard";
import { ProjectTableContainer } from "@/components/project/project-table-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Activity,
  CommentProps,
  projectProps,
  TaskStats,
} from "@/utils/types";
import { userRequired } from "@/app/data/user/get-user";
import { getUserRole } from "@/lib/permissions";
import { NotFoundState } from "@/components/not-found-state";
import Link from "next/link";
import React from "react";
interface ProjectPageProps {
  params: Promise<{ workspaceId: string; projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ProjectPage = async (props: ProjectPageProps) => {
  const { workspaceId, projectId } = await props.params;
  const searchParams = await props.searchParams;
  const { user } = await userRequired();
  const currentUserRole = await getUserRole(user.id, workspaceId);
  const result = await getProjectDetails(workspaceId, projectId);

  // If project was deleted or not found, show a not-found state
  if ("error" in result) {
    return (
      <NotFoundState
        title="Project not found"
        description="This project may have been deleted or you may not have access to it."
      />
    );
  }

  const isMember = currentUserRole === "MEMBER";

  // Fetch settings data only if user can see settings
  const settingsResult = !isMember
    ? await getProjectSettings(workspaceId, projectId)
    : null;

  const project = result.project as unknown as projectProps;    const tasks = result.tasks as unknown as TaskStats;
  const activities = result.activities as unknown as Activity[];
  const comments = result.comments as unknown as CommentProps[];

  return (
    <div className="flex flex-col pb-3 px-3">
      <ProjectHeader project={project} />
      <Tabs
        defaultValue={(searchParams.view as string) || "Dashboard"}
        className="w-full"
      >
        <TabsList className="mt-4">
          <Link href={`?view=Dashboard`}>
            <TabsTrigger className="px-1.5 md:px-3" value="Dashboard">
              Dashboard
            </TabsTrigger>
          </Link>
          <Link href={`?view=Table`}>
            <TabsTrigger className="px-1.5 md:px-3" value="Table">
              Table
            </TabsTrigger>
          </Link>
          <Link href={`?view=Kanban`}>
            <TabsTrigger className="px-1.5 md:px-3" value="Kanban">
              Kanban
            </TabsTrigger>
          </Link>
          {!isMember && (
            <Link href={`?view=Settings`}>
              <TabsTrigger className="px-1.5 md:px-3" value="Settings">
                Settings
              </TabsTrigger>
            </Link>
          )}
        </TabsList>
        <TabsContent value="Dashboard">
          <ProjectDashboard
            project={project}
            tasks={tasks}
            activities={activities}
            totalWorkspaceMembers={result.totalWorkspaceMembers!}
            comments={comments}
          />
        </TabsContent>
        <TabsContent value="Table">
          <ProjectTableContainer
            projectId={projectId}
            workspaceId={workspaceId}
            currentUserRole={currentUserRole}
          />
        </TabsContent>
        <TabsContent value="Kanban">
          <KanbanBoardContainer
            initialTasks={tasks.items}
            currentUserRole={currentUserRole}
          />
        </TabsContent>
        {!isMember && settingsResult && !("error" in settingsResult) && (
          <TabsContent value="Settings">
            <ProjectSettings
              project={settingsResult.project}
              admins={settingsResult.admins ?? []}
              members={settingsResult.members}
              currentUserRole={settingsResult.currentUserRole}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
export default ProjectPage;
