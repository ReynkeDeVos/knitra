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
    <div className="space-y-3 p-4">
      {projects.map((project) => {
        const progress = project.totalRows > 0 ? (project.currentRow / project.totalRows) * 100 : 0
        const isActive = project.id === activeProjectId

        return (
          <Card
            key={project.id}
            className={`p-4 cursor-pointer transition-all ${
              isActive ? "ring-2 ring-primary bg-primary/5" : "hover:bg-accent/50"
            }`}
            onClick={() => onSelectProject(project.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <span>Row {project.currentRow}</span>
                  {project.totalRows > 0 && (
                    <>
                      <span>•</span>
                      <span>{Math.round(progress)}% complete</span>
                    </>
                  )}
                </div>
                {project.totalRows > 0 && (
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                )}
                {(project.yarn || project.needleSize || project.pattern) && (
                  <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                    {project.yarn && <div>Yarn: {project.yarn}</div>}
                    {project.needleSize && <div>Needles: {project.needleSize}</div>}
                    {project.pattern && <div>Pattern: {project.pattern}</div>}
                  </div>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditProject(project)
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Edit project"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteProject(project.id)
                  }}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
