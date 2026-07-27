import { getWorkspaceMembers } from "@/app/data/members/get-workspace-members";
import { userRequired } from "@/app/data/user/get-user";
import { MembersPageClient } from "@/components/members/members-page-client";

interface MembersPageProps {
  params: Promise<{ workspaceId: string }>;
}

const MembersPage = async (props: MembersPageProps) => {
  const { workspaceId } = await props.params;
  const [result, { user }] = await Promise.all([
    getWorkspaceMembers(workspaceId),
    userRequired(),
  ]);

  if ("error" in result && result.error) {
    return (
      <MembersPageClient
        members={[]}
        currentUserId={user.id}
        currentUserRole={null}
        error={result.error}
      />
    );
  }

  return (
    <MembersPageClient
      members={result.members}
      currentUserId={user.id}
      currentUserRole={result.currentUserRole}
      workspaceName={result.workspaceName ?? "this workspace"}
    />
  );
};

export default MembersPage;
