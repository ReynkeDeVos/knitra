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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4 sm:bottom-8 sm:right-8">
      {/* Menu items - appear above FAB when expanded with stagger animation */}
      <div
        className={`flex flex-col items-end gap-3 transform-gpu transition-all duration-400 ease-out ${
          isExpanded
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        {/* Projects button */}
        <div
          className={`flex items-center gap-3 transform-gpu transition-all duration-400 ease-out ${
            isExpanded
              ? "translate-y-0 scale-100 opacity-100 delay-75"
              : "translate-y-3 scale-95 opacity-0"
          }`}
        >
          <div className="bg-card border-border rounded-[20px] border px-4 py-2 shadow-lg sm:border-2 sm:px-5 sm:py-2.5 sm:shadow-xl">
            <span className="text-foreground text-sm font-semibold leading-none">
              Projects
            </span>
          </div>
          <button
            onClick={handleProjectsClick}
            className={`flex h-16 w-16 items-center justify-center rounded-[28px] shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95 sm:shadow-2xl ${
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
          className={`flex items-center gap-3 transform-gpu transition-all duration-400 ease-out ${
            isExpanded
              ? "translate-y-0 scale-100 opacity-100 delay-150"
              : "translate-y-3 scale-95 opacity-0"
          }`}
        >
          <div className="bg-card border-border rounded-[20px] border px-4 py-2 shadow-lg sm:border-2 sm:px-5 sm:py-2.5 sm:shadow-xl">
            <span className="text-foreground text-sm font-semibold leading-none">
              New Project
            </span>
          </div>
          <button
            onClick={handleNewProjectClick}
            className="bg-tertiary text-tertiary-foreground hover:bg-tertiary/90 hover:shadow-tertiary/30 flex h-16 w-16 items-center justify-center rounded-[28px] shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95 sm:shadow-2xl"
            aria-label="New project"
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Main FAB - toggles menu with expressive shape morphing */}
      <button
        onClick={toggleMenu}
        className={`bg-primary text-primary-foreground hover:shadow-primary/40 flex h-20 w-20 items-center justify-center rounded-[32px] shadow-2xl transition-[transform,background,box-shadow] duration-300 ease-out ${
          isExpanded
            ? "scale-95 rotate-180 rounded-[24px]"
            : "scale-100 rotate-0 hover:scale-110 active:scale-95"
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
