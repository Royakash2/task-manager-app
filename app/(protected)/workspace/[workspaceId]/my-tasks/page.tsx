import { getMyTasks } from "@/app/data/task/get-my-tasks";
import { MyTasksContent } from "@/components/task/my-tasks-content";
import { NotFoundState } from "@/components/not-found-state";

interface MyTasksPageProps {
  params: Promise<{ workspaceId: string }>;
}

const MyTasksPage = async (props: MyTasksPageProps) => {
  const { workspaceId } = await props.params;

  const tasksResult = await getMyTasks(workspaceId);

  if (tasksResult.error) {
    return (
      <NotFoundState title="Something went wrong" description={tasksResult.error} />
    );
  }

  return (
    <MyTasksContent
      tasks={tasksResult.tasks}
      userRole={tasksResult.userRole}
    />
  );
};

export default MyTasksPage;
