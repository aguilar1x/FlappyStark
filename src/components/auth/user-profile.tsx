"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { User, Wallet, Calendar, LogOut, RefreshCw, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTransactions } from "@/hooks/use-transactions"
import { useEffect } from "react"

interface UserProfileProps {
  onNavigate: (screen: string) => void
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const { user, logout, refresh, isLoading: authLoading } = useAuth()
  const { stats, sync, isLoading: txLoading } = useTransactions(user?.id)

  useEffect(() => {
    if (user?.id) {
      sync()
    }
  }, [user?.id, sync])

  const handleLogout = async () => {
    await logout()
    onNavigate("menu")
  }

  const handleRefresh = async () => {
    await refresh()
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p>Loading user profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("menu")}
            variant="ghost"
            size="sm"
          >
            ← Back to Menu
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={authLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${authLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              disabled={authLoading}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Last login {new Date(user.lastLogin).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          {user.walletAddress && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="font-medium">StarkNet Wallet</span>
              </div>
              <p className="text-sm font-mono text-muted-foreground break-all">
                {user.walletAddress}
              </p>
            </div>
          )}
        </Card>

        {/* Transaction Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            value={stats.totalTransactions}
            label="Total Transactions"
            color="text-primary"
            size="sm"
          />
          <StatCard
            value={stats.completedTransactions}
            label="Completed Transactions"
            color="text-secondary"
            size="sm"
          />
          <StatCard
            value={stats.bestScore}
            label="Best Score"
            color="text-accent"
            size="sm"
          />
          <StatCard
            value={stats.pendingTransactions}
            label="Pending"
            color="text-orange-500"
            size="sm"
          />
        </div>

        {/* Loading State */}
        {(authLoading || txLoading) && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Updating...</span>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Powered by Cavos - StarkNet Integration</p>
        </div>
      </div>
    </div>
  )
}
