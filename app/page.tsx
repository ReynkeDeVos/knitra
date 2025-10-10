"use client";

import { FabMenu } from "@/components/fab-menu";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { ProjectList } from "@/components/project-list";
import { RowCounter } from "@/components/row-counter";
import { createProject, getProjects, saveProjects } from "@/lib/storage";
import type { KnittingProject } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState<KnittingProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showProjects, setShowProjects] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<
    KnittingProject | undefined
  >(undefined);

  useEffect(() => {
    const loadedProjects = getProjects();
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
        };
      }
      return p;
    });
    setProjects(migratedProjects);

    if (migratedProjects.length > 0) {
      setActiveProjectId(migratedProjects[0].id);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveProjects(projects);
    }
  }, [projects, mounted]);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const handleCreateProject = (projectData: {
    name: string;
    totalRows: number;
    description?: string;
    pattern?: string;
    yarn?: string;
    needleSize?: string;
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
      );
      setEditingProject(undefined);
    } else {
      const newProject = createProject(
        projectData.name,
        projectData.totalRows,
        projectData.description,
        projectData.pattern,
        projectData.yarn,
        projectData.needleSize,
      );
      setProjects((prev) => [newProject, ...prev]);
      setActiveProjectId(newProject.id);
      setShowProjects(false);
    }
    setShowNewProjectDialog(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (activeProjectId === id && filtered.length > 0) {
        setActiveProjectId(filtered[0].id);
      } else if (filtered.length === 0) {
        setActiveProjectId(null);
      }
      return filtered;
    });
  };

  const handleEditProject = (project: KnittingProject) => {
    setEditingProject(project);
    setShowNewProjectDialog(true);
  };

  const updateProject = (updates: Partial<KnittingProject>) => {
    if (!activeProjectId) return;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? { ...p, ...updates, updatedAt: new Date() }
          : p,
      ),
    );
  };

  const handleIncrement = () => {
    if (!activeProject) return;
    updateProject({ currentRow: activeProject.currentRow + 1 });
  };

  const handleDecrement = () => {
    if (!activeProject) return;
    updateProject({ currentRow: Math.max(0, activeProject.currentRow - 1) });
  };

  const handleReset = () => {
    if (!activeProject) return;
    if (confirm("Reset row counter to 0?")) {
      updateProject({ currentRow: 0 });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="from-background via-background to-primary/5 flex h-dvh flex-col bg-gradient-to-br">
      <main className="flex flex-1 flex-col pb-32">
        {showProjects ? (
          <div className="flex-1 overflow-auto">
            <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl py-8 duration-700">
              <div className="mb-6 px-6">
                <h1 className="text-foreground text-3xl font-bold">
                  Your Projects
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage all your knitting projects
                </p>
              </div>
              <ProjectList
                projects={projects}
                activeProjectId={activeProjectId || ""}
                onSelectProject={(id) => {
                  setActiveProjectId(id);
                  setShowProjects(false);
                }}
                onDeleteProject={handleDeleteProject}
                onEditProject={handleEditProject}
              />
            </div>
          </div>
        ) : activeProject ? (
          <div className="animate-in fade-in zoom-in-95 flex flex-1 items-center justify-center duration-700">
            <RowCounter
              project={activeProject}
              onUpdateProject={updateProject}
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-1 items-center justify-center duration-500">
            <div className="px-6 py-12 text-center">
              <div className="mb-6 text-6xl">🧶</div>
              <h2 className="text-foreground mb-3 text-2xl font-bold">
                Welcome to KnittingPal
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Create your first project to start tracking rows, pattern
                repeats, and more
              </p>
            </div>
          </div>
        )}
      </main>

      <FabMenu
        onProjectsClick={() => setShowProjects(!showProjects)}
        onNewProjectClick={() => {
          setEditingProject(undefined);
          setShowNewProjectDialog(true);
        }}
        showProjects={showProjects}
      />

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={(open) => {
          setShowNewProjectDialog(open);
          if (!open) setEditingProject(undefined);
        }}
        onCreateProject={handleCreateProject}
        editProject={editingProject}
      />
    </div>
  );
}
