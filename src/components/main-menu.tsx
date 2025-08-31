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
  const [isClient, _setIsClient] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { transactions } = useTransactions(user?.id)

  useEffect(() => {
    setStats(getGameStats(user?.id))
  }, [user?.id])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Night Sky Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800 via-slate-900 to-slate-900"></div>
      
      {/* Night Clouds */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => {
            const cloudData = {
              top: 10 + Math.random() * 70,
              delay: Math.random() * 20,
              duration: 30 + Math.random() * 20,
              parts: [
                { width: 80 + Math.random() * 120, height: 50 + Math.random() * 80, left: 0, top: 0 },
                { width: 60 + Math.random() * 80, height: 40 + Math.random() * 60, left: 20 + Math.random() * 40, top: -20 + Math.random() * 20 },
                { width: 50 + Math.random() * 70, height: 35 + Math.random() * 50, left: -15 + Math.random() * 30, top: 10 + Math.random() * 20 },
                { width: 40 + Math.random() * 60, height: 30 + Math.random() * 40, left: 40 + Math.random() * 50, top: 15 + Math.random() * 25 }
              ]
            }
            
            return (
              <div
                key={i}
                className="absolute animate-cloud-move"
                style={{
                  top: `${cloudData.top}%`,
                  left: '-300px',
                  animationDelay: `${cloudData.delay}s`,
                  animationDuration: `${cloudData.duration}s`,
                }}
              >
                <div className="relative">
                  {cloudData.parts.map((part, j) => (
                    <div 
                      key={j}
                      className="absolute bg-gray-300/40 rounded-full"
                      style={{
                        width: `${part.width}px`,
                        height: `${part.height}px`,
                        left: `${part.left}px`,
                        top: `${part.top}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}



      {/* Stars */}
      {isClient && (
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => {
            const starData = {
              left: Math.random() * 100,
              top: Math.random() * 100,
              delay: Math.random() * 3,
              duration: 2 + Math.random() * 3
            }
            
            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${starData.left}%`,
                  top: `${starData.top}%`,
                  animationDelay: `${starData.delay}s`,
                  animationDuration: `${starData.duration}s`,
                }}
              />
            )
          })}
        </div>
      )}

      {/* Moon */}
      <div className="absolute top-8 right-8 w-16 h-16 bg-yellow-200 rounded-full shadow-lg shadow-yellow-200/50 animate-pulse"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Game Title */}
        <div className="text-center space-y-4">
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent animate-moving-gradient drop-shadow-lg">
              FLAPPY
            </h1>
            <h2 className="text-4xl font-bold text-white drop-shadow-lg">STARK</h2>
          </div>
          <p className="text-white text-lg drop-shadow-md">Generate transactions while you fly</p>
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
          <div className="pt-4 border-t border-blue-200/40">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-100/30 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-black" />
                    <span className="text-sm font-medium text-black">{user?.username}</span>
                  </div>
                  <span className="text-xs text-black">Connected</span>
                </div>
                <Button
                  onClick={() => onNavigate("profile")}
                  variant="outline"
                  className="w-full h-10 text-sm border-black text-black hover:bg-blue-600 hover:text-blue-900 hover:border-blue-900"
                  style={{ borderColor: 'black' }}
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
                  className="w-full h-10 text-sm border-black text-black hover:bg-blue-600 hover:text-blue-900 hover:border-blue-900"
                  style={{ borderColor: 'black' }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  onClick={() => onNavigate("register")}
                  variant="outline"
                  className="w-full h-10 text-sm border-black text-black hover:bg-blue-600 hover:text-blue-900 hover:border-blue-900"
                  style={{ borderColor: 'black' }}
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
