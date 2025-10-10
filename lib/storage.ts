import type { Counter, KnittingProject } from "./types";

const STORAGE_KEY = "knittingpal_projects";

export function getProjects(): KnittingProject[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const projects = JSON.parse(stored);
    return projects.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  } catch {
    return [];
  }
}

export function saveProjects(projects: KnittingProject[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function createProject(
  name: string,
  totalRows: number,
  description?: string,
  pattern?: string,
  yarn?: string,
  needleSize?: string,
): KnittingProject {
  const defaultCounter: Counter = {
    id: crypto.randomUUID(),
    name: "Rows",
    currentValue: 0,
    targetValue: totalRows > 0 ? totalRows : undefined,
  };

  return {
    id: crypto.randomUUID(),
    name,
    currentRow: 0,
    totalRows,
    counters: [defaultCounter], // Initialize with default counter
    description,
    pattern,
    yarn,
    needleSize,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
