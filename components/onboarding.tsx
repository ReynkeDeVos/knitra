"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function Onboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("knittingpal_onboarding_seen")
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem("knittingpal_onboarding_seen", "true")
    setShowOnboarding(false)
  }

  if (!showOnboarding) return null

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-surface-container rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-primary/20 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-full"
          aria-label="Close onboarding"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🧶</div>
          <h2 className="text-3xl font-bold text-foreground">Welcome to KnittingPal</h2>

          <div className="space-y-4 text-left">
            <div className="bg-primary/10 rounded-2xl p-4">
              <div className="text-5xl font-bold text-primary mb-2">Tap</div>
              <p className="text-muted-foreground">Tap the big button to add a row</p>
            </div>

            <div className="bg-secondary/10 rounded-2xl p-4">
              <div className="text-2xl font-semibold text-secondary mb-2">Menu</div>
              <p className="text-muted-foreground">Use the menu button (⋮) at the top to decrease or reset</p>
            </div>

            <div className="bg-tertiary/10 rounded-2xl p-4">
              <div className="text-2xl font-semibold text-tertiary mb-2">Projects</div>
              <p className="text-muted-foreground">Switch between projects using the bottom navigation</p>
            </div>
          </div>

          <Button onClick={handleClose} size="lg" className="w-full rounded-full mt-6">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  )
}
