"use client"

import type { KnittingProject, Counter } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Minus, RotateCcw, MoreVertical, PlusIcon, Settings, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface RowCounterProps {
  project: KnittingProject
  onUpdateProject: (updates: Partial<KnittingProject>) => void
}

export function RowCounter({ project, onUpdateProject }: RowCounterProps) {
  const [activeCounterId, setActiveCounterId] = useState<string>(project.counters[0]?.id || "")
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showCounterDialog, setShowCounterDialog] = useState(false)
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null)
  const [counterForm, setCounterForm] = useState({
    name: "",
    targetValue: "",
    resetAt: "",
    alerts: "",
  })

  const activeCounter = project.counters.find((c) => c.id === activeCounterId) || project.counters[0]

  useEffect(() => {
    if (!activeCounter && project.counters.length > 0) {
      setActiveCounterId(project.counters[0].id)
    }
  }, [project.counters, activeCounter])

  const handleIncrement = () => {
    if (!activeCounter) return

    const newValue = activeCounter.currentValue + 1
    const updatedCounters = project.counters.map((c) => {
      if (c.id === activeCounter.id) {
        if (c.alerts?.includes(newValue)) {
          alert(`Alert: ${c.name} reached ${newValue}!`)
        }
        const shouldReset = c.resetAt && newValue >= c.resetAt
        return { ...c, currentValue: shouldReset ? 0 : newValue }
      }
      if (activeCounter.linkedCounters?.includes(c.id)) {
        return { ...c, currentValue: c.currentValue + 1 }
      }
      return c
    })

    const rowsCounter = updatedCounters.find((c) => c.name === "Rows")
    onUpdateProject({
      counters: updatedCounters,
      currentRow: rowsCounter?.currentValue || project.currentRow,
    })
  }

  const handleDecrement = () => {
    if (!activeCounter) return
    const updatedCounters = project.counters.map((c) =>
      c.id === activeCounter.id ? { ...c, currentValue: Math.max(0, c.currentValue - 1) } : c,
    )
    const rowsCounter = updatedCounters.find((c) => c.name === "Rows")
    onUpdateProject({
      counters: updatedCounters,
      currentRow: rowsCounter?.currentValue || project.currentRow,
    })
  }

  const handleReset = () => {
    if (!activeCounter) return
    const updatedCounters = project.counters.map((c) => (c.id === activeCounter.id ? { ...c, currentValue: 0 } : c))
    const rowsCounter = updatedCounters.find((c) => c.name === "Rows")
    onUpdateProject({
      counters: updatedCounters,
      currentRow: rowsCounter?.currentValue ?? 0,
    })
    setShowResetDialog(false)
    setDropdownOpen(false)
  }

  const handleAddCounter = () => {
    setEditingCounter(null)
    setCounterForm({ name: "", targetValue: "", resetAt: "", alerts: "" })
    setShowCounterDialog(true)
  }

  const handleEditCounter = (counter: Counter) => {
    setEditingCounter(counter)
    setCounterForm({
      name: counter.name,
      targetValue: counter.targetValue?.toString() || "",
      resetAt: counter.resetAt?.toString() || "",
      alerts: counter.alerts?.join(", ") || "",
    })
    setShowCounterDialog(true)
  }

  const handleSaveCounter = () => {
    const alerts = counterForm.alerts
      .split(",")
      .map((a) => Number.parseInt(a.trim()))
      .filter((a) => !isNaN(a))

    if (editingCounter) {
      const updatedCounters = project.counters.map((c) =>
        c.id === editingCounter.id
          ? {
              ...c,
              name: counterForm.name,
              targetValue: counterForm.targetValue ? Number.parseInt(counterForm.targetValue) : undefined,
              resetAt: counterForm.resetAt ? Number.parseInt(counterForm.resetAt) : undefined,
              alerts: alerts.length > 0 ? alerts : undefined,
            }
          : c,
      )
      onUpdateProject({ counters: updatedCounters })
    } else {
      const newCounter: Counter = {
        id: crypto.randomUUID(),
        name: counterForm.name,
        currentValue: 0,
        targetValue: counterForm.targetValue ? Number.parseInt(counterForm.targetValue) : undefined,
        resetAt: counterForm.resetAt ? Number.parseInt(counterForm.resetAt) : undefined,
        alerts: alerts.length > 0 ? alerts : undefined,
      }
      onUpdateProject({ counters: [...project.counters, newCounter] })
      setActiveCounterId(newCounter.id)
    }
    setShowCounterDialog(false)
  }

  const handleDeleteCounter = (counterId: string) => {
    if (project.counters.length === 1) {
      alert("Cannot delete the last counter")
      return
    }
    const updatedCounters = project.counters.filter((c) => c.id !== counterId)
    onUpdateProject({ counters: updatedCounters })
    if (activeCounterId === counterId) {
      setActiveCounterId(updatedCounters[0].id)
    }
  }

  const progress = activeCounter?.targetValue ? (activeCounter.currentValue / activeCounter.targetValue) * 100 : 0

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-8 w-full">
      <div className="w-full max-w-md flex items-center justify-between px-4">
        <div className="text-left flex-1">
          <h1 className="text-2xl font-semibold text-foreground text-balance">{project.name}</h1>
        </div>

        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-2 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all duration-200 bg-transparent"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48" onPointerDownOutside={() => setDropdownOpen(false)}>
            <DropdownMenuItem
              onClick={handleDecrement}
              disabled={activeCounter?.currentValue === 0}
              onSelect={(e) => e.preventDefault()}
            >
              <Minus className="h-4 w-4 mr-2" />
              Decrease
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowResetDialog(true)} disabled={activeCounter?.currentValue === 0}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset counter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {project.counters.length > 1 && (
        <div className="flex gap-2 flex-wrap justify-center max-w-md">
          {project.counters.map((counter) => (
            <Button
              key={counter.id}
              variant={counter.id === activeCounterId ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setActiveCounterId(counter.id)}
            >
              {counter.name}
            </Button>
          ))}
        </div>
      )}

      <div className="relative">
        {activeCounter?.targetValue && (
          <svg className="absolute inset-0 -rotate-90" width="280" height="280">
            <circle
              cx="140"
              cy="140"
              r="130"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-secondary/30"
            />
            <circle
              cx="140"
              cy="140"
              r="130"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-primary transition-all duration-500 ease-out"
              strokeDasharray={`${2 * Math.PI * 130}`}
              strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress / 100)}`}
              strokeLinecap="round"
            />
          </svg>
        )}

        <button
          onClick={handleIncrement}
          className="relative flex items-center justify-center w-[280px] h-[280px] rounded-full bg-primary text-primary-foreground shadow-2xl active:scale-95 transition-all duration-200 ease-out touch-manipulation hover:shadow-primary/30 hover:scale-105"
          aria-label="Increment counter"
        >
          <div className="text-center">
            <div className="text-8xl font-bold tabular-nums">{activeCounter?.currentValue || 0}</div>
            <div className="text-lg mt-2 opacity-90">
              {activeCounter?.currentValue === 0 ? "Tap to start" : `Tap to add ${activeCounter?.name || "row"}`}
            </div>
          </div>
        </button>
      </div>

      {activeCounter?.targetValue && (
        <div className="text-center">
          <div className="text-3xl font-semibold text-tertiary">{Math.round(progress)}%</div>
          <div className="text-sm text-muted-foreground">
            {activeCounter.currentValue} of {activeCounter.targetValue}
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-3">
        {activeCounter && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">{activeCounter.name}</h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEditCounter(activeCounter)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                {project.counters.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeleteCounter(activeCounter.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              {activeCounter.targetValue && <div>Target: {activeCounter.targetValue}</div>}
              {activeCounter.resetAt && <div>Auto-reset at: {activeCounter.resetAt}</div>}
              {activeCounter.alerts && activeCounter.alerts.length > 0 && (
                <div className="flex gap-1 flex-wrap items-center">
                  <span>Alerts:</span>
                  {activeCounter.alerts.map((alert) => (
                    <Badge key={alert} variant="secondary" className="text-xs">
                      {alert}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        <Button variant="outline" className="w-full rounded-full bg-transparent" onClick={handleAddCounter}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Counter
        </Button>
      </div>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset counter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset {activeCounter?.name} to 0. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showCounterDialog} onOpenChange={setShowCounterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCounter ? "Edit Counter" : "Add Counter"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="counter-name">Counter Name *</Label>
              <Input
                id="counter-name"
                value={counterForm.name}
                onChange={(e) => setCounterForm({ ...counterForm, name: e.target.value })}
                placeholder="e.g., Pattern Repeats, Color Changes"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-value">Target Value (optional)</Label>
              <Input
                id="target-value"
                type="number"
                value={counterForm.targetValue}
                onChange={(e) => setCounterForm({ ...counterForm, targetValue: e.target.value })}
                placeholder="e.g., 10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-at">Auto-reset at (optional)</Label>
              <Input
                id="reset-at"
                type="number"
                value={counterForm.resetAt}
                onChange={(e) => setCounterForm({ ...counterForm, resetAt: e.target.value })}
                placeholder="e.g., 4"
              />
              <p className="text-xs text-muted-foreground">Counter will reset to 0 when reaching this value</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alerts">Alerts (optional)</Label>
              <Input
                id="alerts"
                value={counterForm.alerts}
                onChange={(e) => setCounterForm({ ...counterForm, alerts: e.target.value })}
                placeholder="e.g., 5, 10, 15"
              />
              <p className="text-xs text-muted-foreground">Comma-separated values for alerts</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCounterDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCounter} disabled={!counterForm.name}>
              {editingCounter ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
