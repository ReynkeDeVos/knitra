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
    <div className="fixed bottom-4 right-4 z-50">
      {/* Menu items - appear above FAB when expanded with stagger animation */}
      <div
        className={`flex flex-col gap-4 mb-4 transition-all duration-500 ease-out ${
          isExpanded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        {/* Projects button */}
        <div
          className={`flex items-center gap-4 justify-end transition-all duration-500 ${
            isExpanded
              ? "translate-x-0 opacity-100 delay-100"
              : "translate-x-8 opacity-0"
          }`}
        >
          <div className="bg-card px-5 py-2.5 rounded-[20px] shadow-xl backdrop-blur-sm border-2 border-border">
            <span className="text-sm font-semibold text-foreground">
              Projects
            </span>
          </div>
          <button
            onClick={handleProjectsClick}
            className={`h-16 w-16 rounded-[28px] shadow-2xl transition-all duration-300 flex items-center justify-center active:scale-95 hover:scale-105 ${
              showProjects
                ? "bg-secondary text-secondary-foreground hover:shadow-secondary/30"
                : "bg-card border-2 border-border text-foreground hover:bg-accent"
            }`}
            aria-label="View projects"
          >
            <List className="h-7 w-7" strokeWidth={2.5} />
          </button>
        </div>

        {/* New project button */}
        <div
          className={`flex items-center gap-4 justify-end transition-all duration-500 ${
            isExpanded
              ? "translate-x-0 opacity-100 delay-200"
              : "translate-x-8 opacity-0"
          }`}
        >
          <div className="bg-card px-5 py-2.5 rounded-[20px] shadow-xl backdrop-blur-sm border-2 border-border">
            <span className="text-sm font-semibold text-foreground">
              New Project
            </span>
          </div>
          <button
            onClick={handleNewProjectClick}
            className="h-16 w-16 rounded-[28px] bg-tertiary text-tertiary-foreground hover:bg-tertiary/90 shadow-2xl transition-all duration-300 flex items-center justify-center active:scale-95 hover:scale-105 hover:shadow-tertiary/30"
            aria-label="New project"
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Main FAB - toggles menu with expressive shape morphing */}
      <button
        onClick={toggleMenu}
        className={`h-20 w-20 bg-primary text-primary-foreground shadow-2xl transition-all duration-500 ease-out flex items-center justify-center hover:shadow-primary/40 ${
          isExpanded
            ? "rounded-[20px] rotate-180 scale-95"
            : "rounded-[32px] rotate-0 scale-100 hover:scale-110 active:scale-95"
        }`}
        aria-label={isExpanded ? "Close menu" : "Open menu"}
      >
        <div className="relative flex items-center justify-center w-8 h-8">
          <Menu
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
              isExpanded
                ? "rotate-180 opacity-0 scale-0"
                : "rotate-0 opacity-100 scale-100"
            }`}
            strokeWidth={2.5}
          />
          <X
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
              isExpanded
                ? "rotate-0 opacity-100 scale-100"
                : "-rotate-180 opacity-0 scale-0"
            }`}
            strokeWidth={2.5}
          />
        </div>
      </button>
    </div>
  );
}
