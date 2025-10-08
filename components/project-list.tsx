"use client"

import type { KnittingProject } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Pencil } from "lucide-react"

interface ProjectListProps {
  projects: KnittingProject[]
  activeProjectId: string
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string) => void
  onEditProject: (project: KnittingProject) => void
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
      <div className="text-center py-12 px-6">
        <p className="text-muted-foreground">No projects yet. Create your first one!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      {projects.map((project, index) => {
        const progress = project.totalRows > 0 ? (project.currentRow / project.totalRows) * 100 : 0
        const isActive = project.id === activeProjectId

        return (
          <div
            key={project.id}
            className={`group p-6 rounded-[32px] cursor-pointer transition-all duration-500 border-2 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 ${
              isActive
                ? "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary shadow-2xl shadow-primary/20 scale-[1.02]"
                : "bg-card border-border hover:bg-accent/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "backwards",
            }}
            onClick={() => onSelectProject(project.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-foreground truncate">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
                )}
                <div className="flex items-center gap-3 mt-3 text-sm font-medium">
                  <span className="px-3 py-1.5 rounded-[16px] bg-primary/15 text-primary">
                    Row {project.currentRow}
                  </span>
                  {project.totalRows > 0 && (
                    <span className="px-3 py-1.5 rounded-[16px] bg-secondary/15 text-secondary">
                      {Math.round(progress)}% complete
                    </span>
                  )}
                </div>
                {project.totalRows > 0 && (
                  <div className="mt-3 h-2.5 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-secondary to-tertiary transition-all duration-700 ease-out rounded-full shadow-lg"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                {(project.yarn || project.needleSize || project.pattern) && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {project.yarn && (
                      <span className="px-3 py-1.5 rounded-[14px] bg-muted/50 text-muted-foreground font-medium">
                        🧶 {project.yarn}
                      </span>
                    )}
                    {project.needleSize && (
                      <span className="px-3 py-1.5 rounded-[14px] bg-muted/50 text-muted-foreground font-medium">
                        🪡 {project.needleSize}
                      </span>
                    )}
                    {project.pattern && (
                      <span className="px-3 py-1.5 rounded-[14px] bg-muted/50 text-muted-foreground font-medium">
                        📋 {project.pattern}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditProject(project)
                  }}
                  className="h-10 w-10 rounded-[20px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300 active:scale-90"
                  aria-label="Edit project"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteProject(project.id)
                  }}
                  className="h-10 w-10 rounded-[20px] flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 active:scale-90"
                  aria-label="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
