"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface LoginFormProps {
  onNavigate: (screen: string) => void
  onSuccess?: () => void
}

export function LoginForm({ onNavigate, onSuccess }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      await login({
        email: formData.email,
        password: formData.password
      })
      onSuccess?.()
    } catch (error) {
      // Error ya manejado por el hook
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) clearError()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Button
            onClick={() => onNavigate("menu")}
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 text-white hover:bg-blue-800/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent animate-moving-gradient drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="text-white drop-shadow-md">
            Sign in to your FlappyStark account
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-6 space-y-4 bg-sky-200 border-sky-300 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-black">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-900" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black placeholder-blue-600/60"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-black">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-900" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black placeholder-blue-600/60"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-900 hover:text-blue-700"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-blue-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-sky-200 px-2 text-blue-900">Or</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-blue-900">
              Don't have an account?{" "}
              <button
                onClick={() => onNavigate("register")}
                className="text-yellow-600 hover:text-yellow-700 hover:underline font-medium"
                disabled={isLoading}
              >
                Create one
              </button>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-white/80">
          <p>Powered by Cavos - StarkNet Authentication</p>
        </div>
      </div>
    </div>
  )
}
