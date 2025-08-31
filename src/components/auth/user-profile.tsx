"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { User, Wallet, Calendar, LogOut, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTransactions } from "@/hooks/use-transactions"

interface UserProfileProps {
  onNavigate: (screen: string) => void
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const { user, logout, isLoading: authLoading } = useAuth()
  const { stats, isLoading: txLoading } = useTransactions(user?.id)

  const handleLogout = async () => {
    await logout()
    onNavigate("menu")
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
    <div className="min-h-screen p-4 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("menu")}
            variant="ghost"
            size="sm"
            className="border-white text-white hover:bg-blue-600 hover:text-blue-900 hover:border-blue-900"
            style={{ borderColor: 'white' }}
          >
            ← Back to Menu
          </Button>
          
          <div className="flex gap-2">          
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              disabled={authLoading}
              className="border-white text-white hover:bg-blue-600 hover:text-blue-900 hover:border-blue-900"
              style={{ borderColor: 'white' }}
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
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Wallet className="h-4 w-4 text-white" />
                <span className="font-white text-white">StarkNet Wallet</span>
              </div>
              <p className="text-sm font-mono text-white break-all">
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
        <div className="text-center text-xs text-white">
          <p>Powered by Cavos - StarkNet Integration</p>
        </div>
      </div>
    </div>
  )
}
