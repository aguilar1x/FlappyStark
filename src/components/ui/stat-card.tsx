import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  value: string | number
  label: string
  icon?: LucideIcon
  color?: string
  size?: "sm" | "md" | "lg"
}

export function StatCard({ value, label, icon: Icon, color = "text-primary", size = "md" }: StatCardProps) {
  const sizeClasses = {
    sm: "p-4 text-xl",
    md: "p-6 text-2xl",
    lg: "p-8 text-3xl",
  }

  return (
    <Card className={`${sizeClasses[size]} text-center space-y-2`}>
      {Icon && <Icon className={`h-8 w-8 mx-auto ${color}`} />}
      <p className={`${sizeClasses[size].split(" ")[1]} font-bold ${color}`}>{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Card>
  )
}
