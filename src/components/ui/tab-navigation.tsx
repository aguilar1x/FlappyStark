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
      <div className="flex bg-gray-300 rounded-lg p-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={`rounded-md ${
              activeTab === tab.id 
                ? "bg-yellow-400 hover:bg-yellow-500 text-black border-black hover:border-black" 
                : "text-black hover:bg-yellow-200"
            }`}
            style={activeTab === tab.id ? { borderColor: 'black' } : {}}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
