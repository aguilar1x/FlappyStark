import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  value: string | number
  label: string
  icon?: LucideIcon
  color?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "dark"
}

export function StatCard({ value, label, icon: Icon, color = "text-primary", size = "md", variant = "default" }: StatCardProps) {
  const sizeClasses = {
    sm: "p-4 text-xl",
    md: "p-6 text-2xl",
    lg: "p-8 text-3xl",
  }

  const variantClasses = {
    default: "bg-card",
    dark: "bg-sky-200 border-sky-300",
  }

  return (
    <Card className={`${sizeClasses[size]} ${variantClasses[variant]} text-center space-y-2`}>
      {Icon && <Icon className={`h-8 w-8 mx-auto ${color}`} />}
      <p className={`${sizeClasses[size].split(" ")[1]} font-bold ${color}`}>{value}</p>
      <p className={`text-sm ${variant === "dark" ? "text-black" : "text-muted-foreground"}`}>{label}</p>
    </Card>
  )
}
