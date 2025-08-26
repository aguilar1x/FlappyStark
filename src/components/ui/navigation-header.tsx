"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface NavigationHeaderProps {
  title: string
  subtitle?: string
  onBack: () => void
  actions?: React.ReactNode
}

export function NavigationHeader({ title, subtitle, onBack, actions }: NavigationHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Button onClick={onBack} variant="outline" size="sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="w-20 flex justify-end">{actions}</div>
    </div>
  )
}
