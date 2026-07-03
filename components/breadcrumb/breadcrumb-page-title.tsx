"use client";

import { useEffect } from "react";
import { useBreadcrumb } from "./breadcrumb-provider";

export function BreadcrumbPageTitle({
  projectName,
  taskName,
}: {
  projectName?: string | null;
  taskName?: string | null;
}) {
  const { setProjectName, setTaskName } = useBreadcrumb();

  useEffect(() => {
    if (projectName !== undefined) setProjectName(projectName);
    if (taskName !== undefined) setTaskName(taskName);

    return () => {
      setProjectName(null);
      setTaskName(null);
    };
  }, [projectName, taskName, setProjectName, setTaskName]);

  return null;
}
