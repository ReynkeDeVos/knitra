"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DockedToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "top" | "bottom"
  children: React.ReactNode
}

const DockedToolbar = React.forwardRef<HTMLDivElement, DockedToolbarProps>(
  ({ className, position = "bottom", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed left-0 right-0 z-40 mx-auto max-w-2xl px-4",
          position === "bottom" ? "bottom-4" : "top-4",
          className
        )}
        {...props}
      >
        <div className="bg-card/80 backdrop-blur-xl border-2 border-border rounded-[28px] shadow-2xl px-4 py-2 flex items-center justify-around gap-2">
          {children}
        </div>
      </div>
    )
  }
)

DockedToolbar.displayName = "DockedToolbar"

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  icon?: React.ReactNode
  label?: string
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, active, icon, label, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-[20px] transition-all duration-300",
          active
            ? "bg-primary/15 text-primary scale-105"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground active:scale-95",
          className
        )}
        {...props}
      >
        {icon && <div className="transition-transform duration-300">{icon}</div>}
        {label && (
          <span className={cn("text-xs font-medium", active ? "font-semibold" : "")}>
            {label}
          </span>
        )}
        {children}
      </button>
    )
  }
)

ToolbarButton.displayName = "ToolbarButton"

export { DockedToolbar, ToolbarButton }
