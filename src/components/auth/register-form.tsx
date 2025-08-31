"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface RegisterFormProps {
  onNavigate: (screen: string) => void
  onSuccess?: () => void
}

export function RegisterForm({ onNavigate, onSuccess }: RegisterFormProps) {
  const { register, isLoading, error: _error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      return
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username
      })
      onSuccess?.()
    } catch (error) {
      // Error ya manejado por el hook
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (_error) clearError()
  }

  const isFormValid = () => {
    return (
      formData.email &&
      formData.username &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      formData.password.length >= 6
    )
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
            Join FlappyStark
          </h1>
          <p className="text-white drop-shadow-md">
            Create your account and start earning rewards
          </p>
        </div>

        {/* Register Form */}
        <Card className="p-6 space-y-4 bg-sky-200 border-sky-300 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-black">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-900" />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black placeholder-blue-600/60"
                  placeholder="Choose a username"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                  minLength={6}
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
              <p className="text-xs text-blue-700">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-black">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-900" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`w-full pl-10 pr-12 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black placeholder-blue-600/60 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-red-400"
                      : "border-blue-300"
                  }`}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-900 hover:text-blue-700"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            {/* Error Message */}
            {_error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                <p className="text-sm text-red-700">{_error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-blue-900">
              Already have an account?{" "}
              <button
                onClick={() => onNavigate("login")}
                className="text-yellow-600 hover:text-yellow-700 hover:underline font-medium"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-white/80 space-y-1">
          <p>Powered by Cavos - StarkNet Authentication</p>
          <p>Your wallet will be automatically created</p>
        </div>
      </div>
    </div>
  )
}
