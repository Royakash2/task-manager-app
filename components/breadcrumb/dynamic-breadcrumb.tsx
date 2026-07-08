"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBuildBreadcrumbs } from "./use-build-breadcrumbs";

export function DynamicBreadcrumb() {
  const crumbs = useBuildBreadcrumbs();

  // Not inside a workspace — don't render
  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink
                  href={crumb.href}
                  className={crumb.style === "link" ? undefined : undefined}
                  title={crumb.label}
                >
                  <span className="max-w-[200px] truncate block">{crumb.label}</span>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage
                  className={
                    crumb.style === "root"
                      ? undefined
                      : "max-w-[200px] truncate block"
                  }
                  title={crumb.label}
                >
                  {crumb.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
