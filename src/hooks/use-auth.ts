import { useState, useEffect, useCallback } from 'react'
import { 
  AuthState, 
  LoginCredentials, 
  RegisterCredentials,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshSession
} from '@/lib/cavos-auth'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  })

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
        
        const user = await getCurrentUser()
        
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed'
        })
      }
    }

    checkSession()
  }, [])

  // Función de registro
  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const user = await registerUser(credentials)
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })
      
      return user
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      throw error
    }
  }, [])

  // Función de login
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const user = await loginUser(credentials)
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })
      
      return user
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      throw error
    }
  }, [])

  // Función de logout
  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      await logoutUser()
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
    }
  }, [])

  // Función para refrescar sesión
  const refresh = useCallback(async () => {
    try {
      const user = await refreshSession()
      
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      }
      
      return user
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Session refresh failed'
      })
      return null
    }
  }, [])

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...authState,
    register,
    login,
    logout,
    refresh,
    clearError
  }
}
