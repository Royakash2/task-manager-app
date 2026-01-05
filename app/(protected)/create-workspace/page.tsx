import { getUserWorkspaces } from '@/app/workspace/getUserWorkspace';
import { CreateWorkspaceForm } from '@/components/workspace/create-workspace-form'
import { redirect } from 'next/navigation';

const CreateWorkspacePage = async () => {
    const {data} = await getUserWorkspaces();
    if(!data?.onboardingCompleted){
        redirect("/onboarding")
    }
    return (
        <CreateWorkspaceForm />
    )
}

export default CreateWorkspacePage;
