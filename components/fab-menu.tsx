"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, List, Plus } from "lucide-react"

interface FabMenuProps {
  onProjectsClick: () => void
  onNewProjectClick: () => void
  showProjects: boolean
}

export function FabMenu({ onProjectsClick, onNewProjectClick, showProjects }: FabMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleMenu = () => {
    setIsExpanded(!isExpanded)
  }

  const handleProjectsClick = () => {
    onProjectsClick()
    setIsExpanded(false)
  }

  const handleNewProjectClick = () => {
    onNewProjectClick()
    setIsExpanded(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menu items - appear above FAB when expanded */}
      <div
        className={`flex flex-col gap-3 mb-3 transition-all duration-300 ease-out ${
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Projects button */}
        <div className="flex items-center gap-3 justify-end">
          <div className="bg-surface-container px-4 py-2 rounded-full shadow-lg">
            <span className="text-sm font-medium text-foreground">Projects</span>
          </div>
          <Button
            onClick={handleProjectsClick}
            size="lg"
            className={`h-14 w-14 rounded-full shadow-lg transition-all duration-200 ${
              showProjects
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                : "bg-surface-container text-foreground hover:bg-surface-container-high"
            }`}
            aria-label="View projects"
          >
            <List className="h-6 w-6" />
          </Button>
        </div>

        {/* New project button */}
        <div className="flex items-center gap-3 justify-end">
          <div className="bg-surface-container px-4 py-2 rounded-full shadow-lg">
            <span className="text-sm font-medium text-foreground">New Project</span>
          </div>
          <Button
            onClick={handleNewProjectClick}
            size="lg"
            className="h-14 w-14 rounded-full bg-tertiary text-tertiary-foreground hover:bg-tertiary/90 shadow-lg transition-all duration-200"
            aria-label="New project"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Main FAB - toggles menu */}
      <Button
        onClick={toggleMenu}
        size="lg"
        className="h-16 w-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl transition-all duration-300 ease-out hover:scale-110 active:scale-95"
        aria-label={isExpanded ? "Close menu" : "Open menu"}
      >
        <div className="relative w-6 h-6">
          <Menu
            className={`absolute inset-0 transition-all duration-300 ${
              isExpanded ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
            }`}
          />
          <X
            className={`absolute inset-0 transition-all duration-300 ${
              isExpanded ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"
            }`}
          />
        </div>
      </Button>
    </div>
  )
}
