import type React from "react"
import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface SettingsSectionProps {
  title: string
  icon?: LucideIcon
  children: React.ReactNode
}

export function SettingsSection({ title, icon: Icon, children }: SettingsSectionProps) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5" />}
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </Card>
  )
}
