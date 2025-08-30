"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { NavigationHeader } from "@/components/ui/navigation-header"
import { TabNavigation } from "@/components/ui/tab-navigation"
import { Trophy, Zap, Clock, Target, TrendingUp } from "lucide-react"
import { getGameStats, getGameRecords, type GameStats, type GameRecord } from "@/lib/game-storage"

interface RecordsScreenProps {
  onNavigate: (screen: "menu" | "character-select" | "game" | "options" | "records") => void
}

export function RecordsScreen({ onNavigate }: RecordsScreenProps) {
  const [stats, setStats] = useState<GameStats | null>(null)
  const [records, setRecords] = useState<GameRecord[]>([])
  const [activeTab, setActiveTab] = useState<"stats" | "records">("stats")

  useEffect(() => {
    setStats(getGameStats())
    setRecords(getGameRecords())
  }, [])

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

  const tabs = [
    { id: "stats", label: "Personal", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
    { id: "records", label: "Global", icon: <Trophy className="h-4 w-4 mr-2" /> },
  ]

  return (
    <div className="min-h-screen p-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Night Sky Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800 via-slate-900 to-slate-900"></div>
      
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <NavigationHeader title="RECORDS" subtitle="Your best scores" onBack={() => onNavigate("menu")} />

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as "stats" | "records")}
        />

        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard value={stats.bestScore} label="Best Score" icon={Trophy} variant="dark" color="text-blue-900" />
              <StatCard value={stats.totalTransactions} label="Transactions" icon={Zap} variant="dark" color="text-yellow-300" />
              <StatCard value={stats.totalGamesPlayed} label="Games" icon={Target} variant="dark" color="text-blue-900" />
              <StatCard
                value={formatDuration(stats.totalPlayTime)}
                label="Total Time"
                icon={Clock}
                variant="dark"
                color="text-blue-900"
              />
            </div>
          </div>
        )}

        {activeTab === "records" && (
          <div className="space-y-4">
            {records.length === 0 ? (
              <Card className="p-12 text-center bg-sky-200 border-sky-300">
                <Trophy className="h-16 w-16 mx-auto text-blue-900 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-black">No records yet</h3>
                <p className="text-black mb-6">Play your first game to start creating records!</p>
                <Button onClick={() => onNavigate("game")} className="bg-blue-600 hover:bg-blue-700 text-white border-black hover:border-blue-900" style={{ borderColor: 'black' }}>
                  Play Now
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Top {records.length} Games</h3>
                  <p className="text-sm text-white">Sorted by score</p>
                </div>

                {records.map((record, index) => (
                  <Card key={record.id} className={`p-4 ${index < 3 ? "border-primary/50" : ""}`}>
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
                          <p className="text-xs text-muted-foreground">
                            {formatDate(record.date)} • {formatDuration(record.duration)}
                          </p>
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
        )}
      </div>
    </div>
  )
}
