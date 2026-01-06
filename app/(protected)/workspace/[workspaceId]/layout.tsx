import React from 'react'
interface Props {
    children: React.ReactNode;
    params:Promise<{workspaceId: string}>;
}

const workspaceLayout = async ({children, params}: Props) => {
    const {workspaceId} = await params;
    console.log(workspaceId)
  return (
    <div>workspaceId layout</div>
  )
}

export default workspaceLayout;