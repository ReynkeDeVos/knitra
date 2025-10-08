"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import type { KnittingProject } from "@/lib/types"

interface NewProjectDialogProps {
  onCreateProject: (projectData: {
    name: string
    totalRows: number
    description?: string
    pattern?: string
    yarn?: string
    needleSize?: string
  }) => void
  editProject?: KnittingProject
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function NewProjectDialog({
  onCreateProject,
  editProject,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: NewProjectDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [pattern, setPattern] = useState("")
  const [yarn, setYarn] = useState("")
  const [needleSize, setNeedleSize] = useState("")
  const [totalRows, setTotalRows] = useState("")

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  useEffect(() => {
    if (editProject) {
      setName(editProject.name)
      setDescription(editProject.description || "")
      setPattern(editProject.pattern || "")
      setYarn(editProject.yarn || "")
      setNeedleSize(editProject.needleSize || "")
      setTotalRows(editProject.totalRows > 0 ? editProject.totalRows.toString() : "")
    } else {
      setName("")
      setDescription("")
      setPattern("")
      setYarn("")
      setNeedleSize("")
      setTotalRows("")
    }
  }, [editProject, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onCreateProject({
        name: name.trim(),
        totalRows: Number.parseInt(totalRows) || 0,
        description: description.trim() || undefined,
        pattern: pattern.trim() || undefined,
        yarn: yarn.trim() || undefined,
        needleSize: needleSize.trim() || undefined,
      })
      setName("")
      setDescription("")
      setPattern("")
      setYarn("")
      setNeedleSize("")
      setTotalRows("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && (
        <DialogTrigger asChild>
          <Button size="lg" className="rounded-full h-14 px-8">
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editProject ? "Edit Project" : "Create New Project"}</DialogTitle>
            <DialogDescription>
              {editProject ? "Update your project details" : "Start tracking a new knitting project"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Cozy Winter Scarf"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What are you making?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pattern">Pattern</Label>
              <Input
                id="pattern"
                placeholder="e.g., Garter stitch, Cable knit"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yarn">Yarn</Label>
              <Input
                id="yarn"
                placeholder="e.g., Merino wool, 4-ply"
                value={yarn}
                onChange={(e) => setYarn(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="needleSize">Needle Size</Label>
              <Input
                id="needleSize"
                placeholder="e.g., 4mm, US 6"
                value={needleSize}
                onChange={(e) => setNeedleSize(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalRows">Total Rows</Label>
              <Input
                id="totalRows"
                type="number"
                min="0"
                placeholder="e.g., 200"
                value={totalRows}
                onChange={(e) => setTotalRows(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Leave empty if you don't know the total yet</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!name.trim()}>
              {editProject ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
