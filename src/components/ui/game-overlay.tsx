import type React from "react"
interface GameOverlayProps {
  visible: boolean
  children: React.ReactNode
}

export function GameOverlay({ visible, children }: GameOverlayProps) {
  if (!visible) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 pointer-events-none">
      <div className="text-center space-y-4 text-white pointer-events-auto">{children}</div>
    </div>
  )
}
