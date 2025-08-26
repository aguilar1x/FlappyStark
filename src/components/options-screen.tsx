"use client"

import { NavigationHeader } from "@/components/ui/navigation-header"
import { SettingsSection } from "@/components/ui/settings-section"
import { SettingItem } from "@/components/ui/setting-item"
import { Volume2 } from "lucide-react"

interface OptionsScreenProps {
  onNavigate: (screen: "menu" | "character-select" | "game" | "options") => void
}

export function OptionsScreen({ onNavigate }: OptionsScreenProps) {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <NavigationHeader title="SETTINGS" onBack={() => onNavigate("menu")} />

        <SettingsSection title="Audio" icon={Volume2}>
          <SettingItem label="Sound Effects" type="switch" defaultValue={true} />
          <SettingItem label="Volume" type="slider" defaultValue={[75]} max={100} step={1} />
        </SettingsSection>
      </div>
    </div>
  )
}
