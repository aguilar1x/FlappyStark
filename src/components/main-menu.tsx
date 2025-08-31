"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { Play, Users, Settings, Trophy, User, LogIn } from "lucide-react"
import { getGameStats, type GameStats } from "@/lib/game-storage"
import { useAuth } from "@/hooks/use-auth"
import { useTransactions } from "@/hooks/use-transactions"

interface MainMenuProps {
  onNavigate: (screen: "menu" | "character-select" | "game" | "options" | "records" | "login" | "register" | "profile") => void
}

export function MainMenu({ onNavigate }: MainMenuProps) {
  const [stats, setStats] = useState<GameStats | null>(null)
  const { user, isAuthenticated } = useAuth()
  const { transactions } = useTransactions(user?.id)

  useEffect(() => {
    setStats(getGameStats(user?.id))
  }, [user?.id])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Game Title */}
        <div className="text-center space-y-4">
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
              FLAPPY
            </h1>
            <h2 className="text-4xl font-bold text-secondary">STARK</h2>
          </div>
          <p className="text-muted-foreground text-lg">Generate transactions while you fly</p>
        </div>

        {/* Floating Animation Elements */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full animate-bounce" />
          <div className="absolute -top-2 -right-6 w-6 h-6 bg-secondary/20 rounded-full animate-bounce delay-300" />
          <div className="absolute -bottom-4 left-1/2 w-4 h-4 bg-accent/20 rounded-full animate-bounce delay-700" />
        </div>

        {/* Menu Buttons */}
        <Card className="p-6 space-y-4 backdrop-blur-sm bg-card/80 border-primary/20">
          {isAuthenticated ? (
            <>
              <Button
                onClick={() => onNavigate("game")}
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Play className="mr-2 h-6 w-6" />
                PLAY NOW
              </Button>

              <Button
                onClick={() => onNavigate("character-select")}
                variant="outline"
                className="w-full h-12 text-base font-medium border-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
              >
                <Users className="mr-2 h-5 w-5" />
                Select Character
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => onNavigate("options")}
                  variant="outline"
                  className="h-12 border-muted hover:bg-muted hover:text-muted-foreground"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Options
                </Button>

                <Button
                  onClick={() => onNavigate("records")}
                  variant="outline"
                  className="h-12 border-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Records
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-muted-foreground">Authentication Required</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please sign in or create an account to access the game and features.
              </p>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">🎮 Play Flappy Bird</p>
                <p className="text-xs text-muted-foreground">⚡ Generate StarkNet Transactions</p>
                <p className="text-xs text-muted-foreground">🏆 Unlock Characters</p>
                <p className="text-xs text-muted-foreground">📊 Track Your Progress</p>
              </div>
            </div>
          )}

          {/* Authentication Section */}
          <div className="pt-4 border-t border-border">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{user?.username}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Connected</span>
                </div>
                <Button
                  onClick={() => onNavigate("profile")}
                  variant="outline"
                  className="w-full h-10 text-sm"
                >
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={() => onNavigate("login")}
                  variant="outline"
                  className="w-full h-10 text-sm"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  onClick={() => onNavigate("register")}
                  variant="outline"
                  className="w-full h-10 text-sm"
                >
                  <User className="mr-2 h-4 w-4" />
                  Create Account
                </Button>
              </div>
            )}
          </div>
        </Card>

        {isAuthenticated && (
          <div className="grid grid-cols-2 gap-4">
            <StatCard value={transactions.length} label="Transactions" color="text-primary" size="sm" />
            <StatCard value={stats?.bestScore || 0} label="Best Score" color="text-secondary" size="sm" />
          </div>
        )}
      </div>
    </div>
  )
}
