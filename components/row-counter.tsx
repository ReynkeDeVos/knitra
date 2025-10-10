"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Counter, KnittingProject } from "@/lib/types";
import {
  Minus,
  MoreVertical,
  PlusIcon,
  RotateCcw,
  Settings,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface RowCounterProps {
  project: KnittingProject;
  onUpdateProject: (updates: Partial<KnittingProject>) => void;
}

export function RowCounter({ project, onUpdateProject }: RowCounterProps) {
  const [activeCounterId, setActiveCounterId] = useState<string>(
    project.counters[0]?.id || "",
  );
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCounterDialog, setShowCounterDialog] = useState(false);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const [counterForm, setCounterForm] = useState({
    name: "",
    targetValue: "",
    resetAt: "",
    alerts: "",
  });

  const activeCounter =
    project.counters.find((c) => c.id === activeCounterId) ||
    project.counters[0];

  useEffect(() => {
    if (!activeCounter && project.counters.length > 0) {
      setActiveCounterId(project.counters[0].id);
    }
  }, [project.counters, activeCounter]);

  const handleIncrement = () => {
    if (!activeCounter) return;

    const newValue = activeCounter.currentValue + 1;
    const updatedCounters = project.counters.map((c) => {
      if (c.id === activeCounter.id) {
        if (c.alerts?.includes(newValue)) {
          alert(`Alert: ${c.name} reached ${newValue}!`);
        }
        const shouldReset = c.resetAt && newValue >= c.resetAt;
        return { ...c, currentValue: shouldReset ? 0 : newValue };
      }
      if (activeCounter.linkedCounters?.includes(c.id)) {
        return { ...c, currentValue: c.currentValue + 1 };
      }
      return c;
    });

    const rowsCounter = updatedCounters.find((c) => c.name === "Rows");
    onUpdateProject({
      counters: updatedCounters,
      currentRow: rowsCounter?.currentValue || project.currentRow,
    });
  };

  const handleDecrement = () => {
    if (!activeCounter) return;
    const updatedCounters = project.counters.map((c) =>
      c.id === activeCounter.id
        ? { ...c, currentValue: Math.max(0, c.currentValue - 1) }
        : c,
    );
    const rowsCounter = updatedCounters.find((c) => c.name === "Rows");
    onUpdateProject({
      counters: updatedCounters,
      currentRow: rowsCounter?.currentValue || project.currentRow,
    });
  };

  const handleReset = () => {
    if (!activeCounter) return;
    const updatedCounters = project.counters.map((c) =>
      c.id === activeCounter.id ? { ...c, currentValue: 0 } : c,
    );
    const rowsCounter = updatedCounters.find((c) => c.name === "Rows");
    onUpdateProject({
      counters: updatedCounters,
      currentRow: rowsCounter?.currentValue ?? 0,
    });
    setShowResetDialog(false);
    setDropdownOpen(false);
  };

  const handleAddCounter = () => {
    setEditingCounter(null);
    setCounterForm({ name: "", targetValue: "", resetAt: "", alerts: "" });
    setShowCounterDialog(true);
  };

  const handleEditCounter = (counter: Counter) => {
    setEditingCounter(counter);
    setCounterForm({
      name: counter.name,
      targetValue: counter.targetValue?.toString() || "",
      resetAt: counter.resetAt?.toString() || "",
      alerts: counter.alerts?.join(", ") || "",
    });
    setShowCounterDialog(true);
  };

  const handleSaveCounter = () => {
    const alerts = counterForm.alerts
      .split(",")
      .map((a) => Number.parseInt(a.trim()))
      .filter((a) => !isNaN(a));

    if (editingCounter) {
      const updatedCounters = project.counters.map((c) =>
        c.id === editingCounter.id
          ? {
              ...c,
              name: counterForm.name,
              targetValue: counterForm.targetValue
                ? Number.parseInt(counterForm.targetValue)
                : undefined,
              resetAt: counterForm.resetAt
                ? Number.parseInt(counterForm.resetAt)
                : undefined,
              alerts: alerts.length > 0 ? alerts : undefined,
            }
          : c,
      );
      onUpdateProject({ counters: updatedCounters });
    } else {
      const newCounter: Counter = {
        id: crypto.randomUUID(),
        name: counterForm.name,
        currentValue: 0,
        targetValue: counterForm.targetValue
          ? Number.parseInt(counterForm.targetValue)
          : undefined,
        resetAt: counterForm.resetAt
          ? Number.parseInt(counterForm.resetAt)
          : undefined,
        alerts: alerts.length > 0 ? alerts : undefined,
      };
      onUpdateProject({ counters: [...project.counters, newCounter] });
      setActiveCounterId(newCounter.id);
    }
    setShowCounterDialog(false);
  };

  const handleDeleteCounter = (counterId: string) => {
    if (project.counters.length === 1) {
      alert("Cannot delete the last counter");
      return;
    }
    const updatedCounters = project.counters.filter((c) => c.id !== counterId);
    onUpdateProject({ counters: updatedCounters });
    if (activeCounterId === counterId) {
      setActiveCounterId(updatedCounters[0].id);
    }
  };

  const progress = activeCounter?.targetValue
    ? (activeCounter.currentValue / activeCounter.targetValue) * 100
    : 0;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 px-6 py-8">
      <div className="flex w-full max-w-md items-center justify-between px-4">
        <div className="flex-1 text-left">
          <h1 className="text-foreground text-2xl font-semibold text-balance">
            {project.name}
          </h1>
        </div>

        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-secondary hover:text-secondary-foreground hover:border-secondary h-10 w-10 rounded-full border-2 bg-transparent transition-all duration-200"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48"
            onPointerDownOutside={() => setDropdownOpen(false)}
          >
            <DropdownMenuItem
              onClick={handleDecrement}
              disabled={activeCounter?.currentValue === 0}
              onSelect={(e) => e.preventDefault()}
            >
              <Minus className="mr-2 h-4 w-4" />
              Decrease
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowResetDialog(true)}
              disabled={activeCounter?.currentValue === 0}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset counter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {project.counters.length > 1 && (
        <div className="flex max-w-md flex-wrap justify-center gap-2">
          {project.counters.map((counter) => (
            <button
              key={counter.id}
              className={`rounded-[24px] px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                counter.id === activeCounterId
                  ? "bg-primary text-primary-foreground shadow-xl"
                  : "bg-card border-border text-foreground hover:bg-accent border-2 shadow-md"
              }`}
              onClick={() => setActiveCounterId(counter.id)}
            >
              {counter.name}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        {activeCounter?.targetValue && (
          <svg className="absolute inset-0 -rotate-90" width="300" height="300">
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--secondary))"
                  stopOpacity="0.4"
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--tertiary))"
                  stopOpacity="0.6"
                />
              </linearGradient>
            </defs>
            <circle
              cx="150"
              cy="150"
              r="142"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/20"
            />
            <circle
              cx="150"
              cy="150"
              r="142"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="10"
              className="drop-shadow-lg transition-all duration-700 ease-out"
              strokeDasharray={`${2 * Math.PI * 142}`}
              strokeDashoffset={`${2 * Math.PI * 142 * (1 - progress / 100)}`}
              strokeLinecap="round"
            />
          </svg>
        )}

        <button
          onClick={handleIncrement}
          className="group text-primary-foreground hover:shadow-primary/40 relative flex h-[300px] w-[300px] touch-manipulation items-center justify-center rounded-full shadow-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_20px_60px] active:scale-90 active:duration-150"
          aria-label="Increment counter"
          style={{
            background:
              activeCounter?.currentValue === 0
                ? "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)"
                : "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--tertiary)) 100%)",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          {/* Animated ring on hover */}
          <div className="bg-primary/20 pointer-events-none absolute inset-0 scale-110 rounded-full opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

          <div className="pointer-events-none relative z-10 text-center">
            <div
              className="text-8xl font-bold tracking-tight tabular-nums drop-shadow-lg"
              style={{ color: "hsl(var(--primary-foreground))" }}
            >
              {activeCounter?.currentValue || 0}
            </div>
            <div
              className="mt-2 text-lg font-medium opacity-95"
              style={{ color: "hsl(var(--primary-foreground))" }}
            >
              {activeCounter?.currentValue === 0
                ? "Tap to start"
                : `Tap to add ${activeCounter?.name || "row"}`}
            </div>
          </div>
        </button>
      </div>

      {activeCounter?.targetValue && (
        <div className="text-center">
          <div className="text-tertiary text-3xl font-semibold">
            {Math.round(progress)}%
          </div>
          <div className="text-muted-foreground text-sm">
            {activeCounter.currentValue} of {activeCounter.targetValue}
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-4 px-4">
        {activeCounter && (
          <div className="bg-card border-border rounded-[28px] border-2 p-5 shadow-xl backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-foreground text-lg font-bold">
                {activeCounter.name}
              </h3>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="hover:bg-accent flex h-9 w-9 touch-manipulation items-center justify-center rounded-[18px] transition-all duration-300 active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCounter(activeCounter);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </button>
                {project.counters.length > 1 && (
                  <button
                    type="button"
                    className="hover:bg-destructive/10 text-destructive flex h-9 w-9 touch-manipulation items-center justify-center rounded-[18px] transition-all duration-300 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCounter(activeCounter.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="text-muted-foreground space-y-2 text-sm">
              {activeCounter.targetValue && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Target:</span>
                  <span className="text-foreground font-semibold">
                    {activeCounter.targetValue}
                  </span>
                </div>
              )}
              {activeCounter.resetAt && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Auto-reset at:</span>
                  <span className="text-foreground font-semibold">
                    {activeCounter.resetAt}
                  </span>
                </div>
              )}
              {activeCounter.alerts && activeCounter.alerts.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">Alerts:</span>
                  {activeCounter.alerts.map((alert) => (
                    <span
                      key={alert}
                      className="bg-secondary/20 text-secondary-foreground rounded-[12px] px-3 py-1 text-xs font-semibold"
                    >
                      {alert}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          className="bg-card border-border hover:bg-accent h-12 w-full touch-manipulation rounded-[24px] border-2 px-4 font-semibold shadow-md transition-all duration-300 hover:shadow-lg active:scale-95"
          onClick={handleAddCounter}
        >
          <div className="pointer-events-none flex items-center justify-center gap-2">
            <PlusIcon className="h-5 w-5" />
            <span>Add Counter</span>
          </div>
        </button>
      </div>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset counter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset {activeCounter?.name} to 0. This action cannot be
              undone.
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
            <DialogTitle>
              {editingCounter ? "Edit Counter" : "Add Counter"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="counter-name">Counter Name *</Label>
              <Input
                id="counter-name"
                value={counterForm.name}
                onChange={(e) =>
                  setCounterForm({ ...counterForm, name: e.target.value })
                }
                placeholder="e.g., Pattern Repeats, Color Changes"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-value">Target Value (optional)</Label>
              <Input
                id="target-value"
                type="number"
                value={counterForm.targetValue}
                onChange={(e) =>
                  setCounterForm({
                    ...counterForm,
                    targetValue: e.target.value,
                  })
                }
                placeholder="e.g., 10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-at">Auto-reset at (optional)</Label>
              <Input
                id="reset-at"
                type="number"
                value={counterForm.resetAt}
                onChange={(e) =>
                  setCounterForm({ ...counterForm, resetAt: e.target.value })
                }
                placeholder="e.g., 4"
              />
              <p className="text-muted-foreground text-xs">
                Counter will reset to 0 when reaching this value
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alerts">Alerts (optional)</Label>
              <Input
                id="alerts"
                value={counterForm.alerts}
                onChange={(e) =>
                  setCounterForm({ ...counterForm, alerts: e.target.value })
                }
                placeholder="e.g., 5, 10, 15"
              />
              <p className="text-muted-foreground text-xs">
                Comma-separated values for alerts
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCounterDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCounter} disabled={!counterForm.name}>
              {editingCounter ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
