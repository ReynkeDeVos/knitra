"use client"

import { useState, useEffect } from "react"
import type { KnittingProject } from "@/lib/types"
import { getProjects, saveProjects, createProject } from "@/lib/storage"
import { RowCounter } from "@/components/row-counter"
import { ProjectList } from "@/components/project-list"
import { NewProjectDialog } from "@/components/new-project-dialog"
import { Onboarding } from "@/components/onboarding"
import { FabMenu } from "@/components/fab-menu"

export default function Home() {
  const [projects, setProjects] = useState<KnittingProject[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [showProjects, setShowProjects] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)
  const [editingProject, setEditingProject] = useState<KnittingProject | undefined>(undefined)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const loadedProjects = getProjects()
    const migratedProjects = loadedProjects.map((p) => {
      if (!p.counters || p.counters.length === 0) {
        return {
          ...p,
          counters: [
            {
              id: crypto.randomUUID(),
              name: "Rows",
              currentValue: p.currentRow || 0,
              targetValue: p.totalRows > 0 ? p.totalRows : undefined,
            },
          ],
        }
      }
      return p
    })
    setProjects(migratedProjects)

    if (migratedProjects.length > 0) {
      setActiveProjectId(migratedProjects[0].id)
    }

    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      saveProjects(projects)
    }
  }, [projects, mounted])

  const activeProject = projects.find((p) => p.id === activeProjectId)

  const handleCreateProject = (projectData: {
    name: string
    totalRows: number
    description?: string
    pattern?: string
    yarn?: string
    needleSize?: string
  }) => {
    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id
            ? {
                ...p,
                ...projectData,
                updatedAt: new Date(),
              }
            : p,
        ),
      )
      setEditingProject(undefined)
    } else {
      const newProject = createProject(
        projectData.name,
        projectData.totalRows,
        projectData.description,
        projectData.pattern,
        projectData.yarn,
        projectData.needleSize,
      )
      setProjects((prev) => [newProject, ...prev])
      setActiveProjectId(newProject.id)
      setShowProjects(false)
    }
    setShowNewProjectDialog(false)
  }

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id)
      if (activeProjectId === id && filtered.length > 0) {
        setActiveProjectId(filtered[0].id)
      } else if (filtered.length === 0) {
        setActiveProjectId(null)
      }
      return filtered
    })
  }

  const handleEditProject = (project: KnittingProject) => {
    setEditingProject(project)
    setShowNewProjectDialog(true)
  }

  const updateProject = (updates: Partial<KnittingProject>) => {
    if (!activeProjectId) return

    setProjects((prev) => prev.map((p) => (p.id === activeProjectId ? { ...p, ...updates, updatedAt: new Date() } : p)))
  }

  const handleIncrement = () => {
    if (!activeProject) return
    updateProject({ currentRow: activeProject.currentRow + 1 })
  }

  const handleDecrement = () => {
    if (!activeProject) return
    updateProject({ currentRow: Math.max(0, activeProject.currentRow - 1) })
  }

  const handleReset = () => {
    if (!activeProject) return
    if (confirm("Reset row counter to 0?")) {
      updateProject({ currentRow: 0 })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Onboarding onVisibilityChange={setShowOnboarding} />

      <main className="flex-1 flex flex-col pb-32">
        {showProjects ? (
          <div className="flex-1 overflow-auto">
            <div className="max-w-3xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="px-6 mb-6">
                <h1 className="text-3xl font-bold text-foreground">Your Projects</h1>
                <p className="text-muted-foreground mt-2">Manage all your knitting projects</p>
              </div>
              <ProjectList
                projects={projects}
                activeProjectId={activeProjectId || ""}
                onSelectProject={(id) => {
                  setActiveProjectId(id)
                  setShowProjects(false)
                }}
                onDeleteProject={handleDeleteProject}
                onEditProject={handleEditProject}
              />
            </div>
          </div>
        ) : activeProject ? (
          <div className="flex-1 flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
            <RowCounter project={activeProject} onUpdateProject={updateProject} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center px-6 py-12">
              <div className="mb-6 text-6xl">🧶</div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Welcome to KnittingPal</h2>
              <p className="text-muted-foreground mb-6 max-w-md">Create your first project to start tracking rows, pattern repeats, and more</p>
            </div>
          </div>
        )}
      </main>

      {!showOnboarding && (
        <FabMenu
          onProjectsClick={() => setShowProjects(!showProjects)}
          onNewProjectClick={() => {
            setEditingProject(undefined)
            setShowNewProjectDialog(true)
          }}
          showProjects={showProjects}
        />
      )}

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={(open) => {
          setShowNewProjectDialog(open)
          if (!open) setEditingProject(undefined)
        }}
        onCreateProject={handleCreateProject}
        editProject={editingProject}
      />
    </div>
  )
}
