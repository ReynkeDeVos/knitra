export interface Counter {
  id: string
  name: string
  currentValue: number
  targetValue?: number
  linkedCounters?: string[] // IDs of counters that increment when this one does
  alerts?: number[] // Values at which to show alerts
  resetAt?: number // Value at which to auto-reset to 0
}

export interface KnittingProject {
  id: string
  name: string
  currentRow: number // Keep for backward compatibility
  totalRows: number
  counters: Counter[] // New: multiple counters per project
  description?: string
  pattern?: string
  yarn?: string
  needleSize?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}
