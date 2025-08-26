"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex justify-center">
      <div className="flex bg-muted rounded-lg p-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className="rounded-md"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
