"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { KnittingProject } from "@/lib/types";
import { Pencil, Trash2 } from "lucide-react";

interface ProjectListProps {
  projects: KnittingProject[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onEditProject: (project: KnittingProject) => void;
}

export function ProjectList({
  projects,
  activeProjectId,
  onSelectProject,
  onDeleteProject,
  onEditProject,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-muted-foreground">
          No projects yet. Create your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {projects.map((project, index) => {
        const progress =
          project.totalRows > 0
            ? (project.currentRow / project.totalRows) * 100
            : 0;
        const isActive = project.id === activeProjectId;

        return (
          <div
            key={project.id}
            className={`group animate-in fade-in slide-in-from-bottom-4 cursor-pointer rounded-[32px] border-2 p-6 backdrop-blur-sm transition-all duration-500 ${
              isActive
                ? "from-primary/10 to-secondary/10 border-primary shadow-primary/20 scale-[1.02] bg-gradient-to-br shadow-2xl"
                : "bg-card border-border hover:bg-accent/30 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]"
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "backwards",
            }}
            onClick={() => onSelectProject(project.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-foreground truncate text-xl font-bold">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {project.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3 text-sm font-medium">
                  <span className="bg-primary/15 text-primary rounded-[16px] px-3 py-1.5">
                    Row {project.currentRow}
                  </span>
                  {project.totalRows > 0 && (
                    <span className="bg-secondary/15 text-secondary rounded-[16px] px-3 py-1.5">
                      {Math.round(progress)}% complete
                    </span>
                  )}
                </div>
                {project.totalRows > 0 && (
                  <div className="bg-muted/50 mt-3 h-2.5 overflow-hidden rounded-full backdrop-blur-sm">
                    <div
                      className="from-primary via-secondary to-tertiary h-full rounded-full bg-gradient-to-r shadow-lg transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                {(project.yarn || project.needleSize || project.pattern) && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {project.yarn && (
                      <span className="bg-muted/50 text-muted-foreground rounded-[14px] px-3 py-1.5 font-medium">
                        🧶 {project.yarn}
                      </span>
                    )}
                    {project.needleSize && (
                      <span className="bg-muted/50 text-muted-foreground rounded-[14px] px-3 py-1.5 font-medium">
                        🪡 {project.needleSize}
                      </span>
                    )}
                    {project.pattern && (
                      <span className="bg-muted/50 text-muted-foreground rounded-[14px] px-3 py-1.5 font-medium">
                        📋 {project.pattern}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProject(project);
                  }}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent flex h-10 w-10 items-center justify-center rounded-[20px] transition-all duration-300 active:scale-90"
                  aria-label="Edit project"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project.id);
                  }}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-[20px] transition-all duration-300 active:scale-90"
                  aria-label="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
