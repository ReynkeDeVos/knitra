"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface DockedToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "top" | "bottom";
  children: React.ReactNode;
}

const DockedToolbar = React.forwardRef<HTMLDivElement, DockedToolbarProps>(
  ({ className, position = "bottom", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed right-0 left-0 z-40 mx-auto max-w-2xl px-4",
          position === "bottom" ? "bottom-4" : "top-4",
          className,
        )}
        {...props}
      >
        <div className="bg-card/80 border-border flex items-center justify-around gap-2 rounded-[28px] border-2 px-4 py-2 shadow-2xl backdrop-blur-xl">
          {children}
        </div>
      </div>
    );
  },
);

DockedToolbar.displayName = "DockedToolbar";

interface ToolbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, active, icon, label, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-1 rounded-[20px] px-3 py-2 transition-all duration-300",
          active
            ? "bg-primary/15 text-primary scale-105"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground active:scale-95",
          className,
        )}
        {...props}
      >
        {icon && (
          <div className="transition-transform duration-300">{icon}</div>
        )}
        {label && (
          <span
            className={cn("text-xs font-medium", active ? "font-semibold" : "")}
          >
            {label}
          </span>
        )}
        {children}
      </button>
    );
  },
);

ToolbarButton.displayName = "ToolbarButton";

export { DockedToolbar, ToolbarButton };
