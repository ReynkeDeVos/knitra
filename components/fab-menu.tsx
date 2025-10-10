"use client";

import { List, Menu, Plus, X } from "lucide-react";
import { useState } from "react";

interface FabMenuProps {
  onProjectsClick: () => void;
  onNewProjectClick: () => void;
  showProjects: boolean;
}

export function FabMenu({
  onProjectsClick,
  onNewProjectClick,
  showProjects,
}: FabMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleProjectsClick = () => {
    onProjectsClick();
    setIsExpanded(false);
  };

  const handleNewProjectClick = () => {
    onNewProjectClick();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-2 left-2 sm:right-8 sm:bottom-8">
      {/* Menu items - appear above FAB when expanded with stagger animation */}
      <div
        className={`mb-4 flex flex-col gap-4 transition-all duration-500 ease-out ${
          isExpanded
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-8 opacity-0"
        }`}
      >
        {/* Projects button */}
        <div
          className={`flex flex-row-reverse items-center justify-start gap-4 transition-all duration-500 sm:flex-row sm:justify-end ${
            isExpanded
              ? "translate-x-0 opacity-100 delay-100"
              : "-translate-x-8 opacity-0 sm:translate-x-8"
          }`}
        >
          <div className="bg-card border-border rounded-[20px] border-2 px-5 py-2.5 shadow-xl backdrop-blur-sm">
            <span className="text-foreground text-sm font-semibold">
              Projects
            </span>
          </div>
          <button
            onClick={handleProjectsClick}
            className={`flex h-16 w-16 items-center justify-center rounded-[28px] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
              showProjects
                ? "bg-secondary text-secondary-foreground hover:shadow-secondary/30"
                : "bg-card border-border text-foreground hover:bg-accent border-2"
            }`}
            aria-label="View projects"
          >
            <List className="h-7 w-7" strokeWidth={2.5} />
          </button>
        </div>

        {/* New project button */}
        <div
          className={`flex flex-row-reverse items-center justify-start gap-4 transition-all duration-500 sm:flex-row sm:justify-end ${
            isExpanded
              ? "translate-x-0 opacity-100 delay-200"
              : "-translate-x-8 opacity-0 sm:translate-x-8"
          }`}
        >
          <div className="bg-card border-border rounded-[20px] border-2 px-5 py-2.5 shadow-xl backdrop-blur-sm">
            <span className="text-foreground text-sm font-semibold">
              New Project
            </span>
          </div>
          <button
            onClick={handleNewProjectClick}
            className="bg-tertiary text-tertiary-foreground hover:bg-tertiary/90 hover:shadow-tertiary/30 flex h-16 w-16 items-center justify-center rounded-[28px] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="New project"
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Main FAB - toggles menu with expressive shape morphing */}
      <button
        onClick={toggleMenu}
        className={`bg-primary text-primary-foreground hover:shadow-primary/40 flex h-20 w-20 items-center justify-center shadow-2xl transition-all duration-500 ease-out ${
          isExpanded
            ? "scale-95 rotate-180 rounded-[20px]"
            : "scale-100 rotate-0 rounded-[32px] hover:scale-110 active:scale-95"
        }`}
        aria-label={isExpanded ? "Close menu" : "Open menu"}
      >
        <div className="relative flex h-8 w-8 items-center justify-center">
          <Menu
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
              isExpanded
                ? "scale-0 rotate-180 opacity-0"
                : "scale-100 rotate-0 opacity-100"
            }`}
            strokeWidth={2.5}
          />
          <X
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
              isExpanded
                ? "scale-100 rotate-0 opacity-100"
                : "scale-0 -rotate-180 opacity-0"
            }`}
            strokeWidth={2.5}
          />
        </div>
      </button>
    </div>
  );
}
