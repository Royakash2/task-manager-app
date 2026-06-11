import { getUserWorkspaceProjects } from '@/app/data/project/get-user-workspace-projects';
import { getUserWorkspaces } from '@/app/data/workspace/getUserWorkspace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, Users } from 'lucide-react';
import Link from 'next/link';
import { ProjectAvatar } from '@/components/project/Project-avatar';
import React from 'react';

interface WorkspaceHomeProps {
  params: Promise<{ workspaceId: string }>;
}

const WorkspaceHomePage = async (props: WorkspaceHomeProps) => {
  const { workspaceId } = await props.params;

  const { projects, workspaceMembers } = await getUserWorkspaceProjects(workspaceId);
  const { data } = await getUserWorkspaces();

  const currentWorkspace = data?.workspaces?.find(
    (w) => w.workspaceId === workspaceId,
  );

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground capitalize">
          {currentWorkspace?.workspace?.name || 'Workspace'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome to your workspace overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projects
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projects?.length ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{workspaceMembers?.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      {projects && projects.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">
            Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/workspace/${workspaceId}/projects/${project.id}`}
                className="block"
              >
                <Card className="hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <ProjectAvatar
                        name={project.name}
                        className="size-10 rounded-lg shrink-0"
                        fallbackClassName="text-sm font-bold"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-foreground truncate capitalize">
                          {project.name}
                        </p>
                        {project.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No projects yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Create your first project to start organizing tasks and collaborating with your team.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkspaceHomePage;
