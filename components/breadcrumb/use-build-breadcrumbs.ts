import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useBreadcrumb } from "./breadcrumb-provider";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useProjectId } from "@/hooks/use-project-id";

export type CrumbStyle = "root" | "label" | "link";

export interface Crumb {
  label: string;
  href?: string;
  style: CrumbStyle;
}

export function useBuildBreadcrumbs() {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const { projectName, taskName } = useBreadcrumb();

  return useMemo(() => {
    if (!workspaceId) return [];

    const segments = pathname.split("/").filter(Boolean);
    const workspaceIndex = segments.indexOf("workspace");
    
    // If 'workspace' isn't in URL, fallback to empty
    if (workspaceIndex === -1) return [];

    const rest = segments.slice(workspaceIndex + 2);
    const crumbs: Crumb[] = [];

    // Root: always "Home" — linked unless we're on the home page
    crumbs.push({
      label: "Home",
      style: "root",
      href: rest.length > 0 ? `/workspace/${workspaceId}` : undefined,
    });

    if (rest.length > 0 && rest[0]) {
      if (!rest[0].startsWith("projects")) {
        // Flat pages: /my-tasks, /members, /settings, /notifications
        const formattedLabel = rest[0].replace(/-/g, " ");
        const firstLetterCap = formattedLabel.charAt(0).toUpperCase() + formattedLabel.slice(1);
        crumbs.push({ label: firstLetterCap, style: "label" });
      } else if (rest[0] === "projects" && rest[1]) {
        // Project context — add project name
        if (projectName) {
          crumbs.push({
            label: projectName,
            style: rest[2] ? "link" : "label",
            href: rest[2] ? `/workspace/${workspaceId}/projects/${projectId}` : undefined,
          });
        }
        // Task context — add task name
        if (rest[2] && taskName) {
          crumbs.push({ label: taskName, style: "label" });
        }
      }
    }

    return crumbs;
  }, [pathname, workspaceId, projectId, projectName, taskName]);
}
