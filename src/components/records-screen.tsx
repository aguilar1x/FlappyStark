"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavigationHeader } from "@/components/ui/navigation-header"
import { Trophy} from "lucide-react"
import { getGameStats, getGameRecords, type GameStats, type GameRecord } from "@/lib/game-storage"
import { useAuth } from "@/hooks/use-auth"

interface RecordsScreenProps {
  onNavigate: (screen: "menu" | "character-select" | "game" | "options" | "records") => void
}

export function RecordsScreen({ onNavigate }: RecordsScreenProps) {
  const [stats, setStats] = useState<GameStats | null>(null)
  const [records, setRecords] = useState<GameRecord[]>([])
  const { user } = useAuth()

  useEffect(() => {
    setStats(getGameStats(user?.id))
    setRecords(getGameRecords())
  }, [user?.id])

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!stats) {
    return <div>Loading...</div>
  }

  const _tabs = [
    { id: "records", label: "Leaderboard", icon: <Trophy className="h-4 w-4 mr-2" /> },
  ]

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <NavigationHeader title="RECORDS" subtitle="Global leaderboard" onBack={() => onNavigate("menu")} />

        <div className="space-y-4">
          {records.length === 0 ? (
              <Card className="p-12 text-center">
                <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No records yet</h3>
                <p className="text-muted-foreground mb-6">Play your first game to start creating records!</p>
                <Button onClick={() => onNavigate("game")} className="bg-primary hover:bg-primary/90">
                  Play Now
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Top {records.length} Players</h3>
                  <p className="text-sm text-white">Best score per player</p>
                </div>

                {records.map((record, index) => (
                  <Card key={`${record.id}_${record.userId}_${index}`} className={`p-4 ${index < 3 ? "border-primary/50" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0
                              ? "bg-yellow-500 text-yellow-900"
                              : index === 1
                                ? "bg-gray-400 text-gray-900"
                                : index === 2
                                  ? "bg-amber-600 text-amber-900"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold">{record.score} pts</span>
                            <span className="text-sm text-muted-foreground">{record.transactions} tx</span>
                            <span className="text-sm text-muted-foreground">Lv.{record.level}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              {formatDate(record.date)} • {formatDuration(record.duration)}
                            </p>
                            <span className="text-xs font-medium text-primary">by {record.username}</span>
                          </div>
                        </div>
                      </div>

                      {index < 3 && (
                        <Trophy
                          className={`h-5 w-5 ${
                            index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"
                          }`}
                        />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
      </div>
    </div>
  )
}
