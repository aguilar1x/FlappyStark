"use client"

import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

interface SettingItemProps {
  label: string
  type: "switch" | "slider"
  defaultValue?: boolean | number[]
  max?: number
  step?: number
  onChange?: (value: boolean | number[]) => void
}

export function SettingItem({ label, type, defaultValue, max = 100, step = 1, onChange }: SettingItemProps) {
  if (type === "switch") {
    return (
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <Switch defaultChecked={defaultValue as boolean} onCheckedChange={(checked) => onChange?.(checked)} />
      </div>
    )
  }

  if (type === "slider") {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <Slider
          defaultValue={defaultValue as number[]}
          max={max}
          step={step}
          onValueChange={(value) => onChange?.(value)}
        />
      </div>
    )
  }

  return null
}
