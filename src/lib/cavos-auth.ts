import { CavosAuth } from 'cavos-service-sdk'

// Tipos para la autenticación
export interface User {
  id: string
  email: string
  username: string
  walletAddress?: string
  createdAt: string
  lastLogin: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  username: string
}

// Configuración de Cavos
const CAVOS_CONFIG = {
  appId: process.env.NEXT_PUBLIC_CAVOS_APP_ID || '',
  orgSecret: process.env.NEXT_PUBLIC_CAVOS_ORG_SECRET || '',
  network: process.env.NEXT_PUBLIC_CAVOS_NETWORK || 'mainnet',
}

// Instancia del servicio Cavos
let cavosAuth: CavosAuth | null = null

export function getCavosAuth(): CavosAuth {
  if (!cavosAuth) {
    console.log('🔧 Initializing CavosAuth with:', {
      network: CAVOS_CONFIG.network,
      appId: CAVOS_CONFIG.appId ? 'configured' : 'missing',
      orgSecret: CAVOS_CONFIG.orgSecret ? 'configured' : 'missing'
    })
    cavosAuth = new CavosAuth(CAVOS_CONFIG.network, CAVOS_CONFIG.appId)
  }
  return cavosAuth
}

// Gestión de sesión local
const SESSION_KEYS = {
  ACCESS_TOKEN: 'flappystark_access_token',
  REFRESH_TOKEN: 'flappystark_refresh_token',
  USER: 'flappystark_user',
  WALLET_ADDRESS: 'flappystark_wallet_address'
}

export function saveSession(user: User, accessToken: string, refreshToken: string, walletAddress?: string): void {
  if (typeof window === "undefined") return
  
  localStorage.setItem(SESSION_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, refreshToken)
  localStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user))
  if (walletAddress) {
    localStorage.setItem(SESSION_KEYS.WALLET_ADDRESS, walletAddress)
  }
}

export function getSession(): { user: User | null; accessToken: string | null; refreshToken: string | null; walletAddress: string | null } {
  if (typeof window === "undefined") {
    return { user: null, accessToken: null, refreshToken: null, walletAddress: null }
  }
  
  const accessToken = localStorage.getItem(SESSION_KEYS.ACCESS_TOKEN)
  const refreshToken = localStorage.getItem(SESSION_KEYS.REFRESH_TOKEN)
  const userStr = localStorage.getItem(SESSION_KEYS.USER)
  const walletAddress = localStorage.getItem(SESSION_KEYS.WALLET_ADDRESS)
  
  let user: User | null = null
  if (userStr) {
    try {
      user = JSON.parse(userStr)
    } catch {
      user = null
    }
  }
  
  return { user, accessToken, refreshToken, walletAddress }
}

export function clearSession(): void {
  if (typeof window === "undefined") return
  
  localStorage.removeItem(SESSION_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(SESSION_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(SESSION_KEYS.USER)
  localStorage.removeItem(SESSION_KEYS.WALLET_ADDRESS)
}

// Funciones de autenticación
export async function registerUser(credentials: RegisterCredentials): Promise<User> {
  try {
    const auth = getCavosAuth()
    
    // Registrar usuario en Cavos
    const result = await auth.signUp(
      credentials.email,
      credentials.password,
      CAVOS_CONFIG.orgSecret
    )
    
    console.log('Cavos registration result:', result)
    console.log('Cavos registration data:', result.data)
    
    // Extraer datos de la respuesta de Cavos
    const data = result.data || result
    
    // Extraer ID de usuario de manera segura
    const userId = data.user_id || data.user?.id || data.id || Date.now().toString()
    
    // Extraer dirección de wallet de manera segura
    const walletAddress = data.wallet?.address || data.walletAddress || null
    
    // Extraer tokens de manera segura
    const accessToken = data.authData?.accessToken || data.access_token || data.accessToken || result.access_token
    const refreshToken = data.authData?.refreshToken || data.refresh_token || data.refreshToken || result.refresh_token
    
    console.log('Registration - Extracted tokens:', { accessToken: accessToken ? 'present' : 'missing', refreshToken: refreshToken ? 'present' : 'missing' })
    
    const user: User = {
      id: userId,
      email: credentials.email,
      username: credentials.username,
      walletAddress: walletAddress,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
    
    // Guardar sesión
    saveSession(user, accessToken, refreshToken, walletAddress)
    
    return user
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

export async function loginUser(credentials: LoginCredentials): Promise<User> {
  try {
    const auth = getCavosAuth()
    
    // Login con Cavos
    const result = await auth.signIn(
      credentials.email,
      credentials.password,
      CAVOS_CONFIG.orgSecret
    )
    
    console.log('Cavos login result:', result)
    console.log('Cavos login data:', result.data)
    
    // Extraer datos de la respuesta de Cavos
    const data = result.data || result
    
    // Extraer ID de usuario de manera segura
    const userId = data.user_id || data.user?.id || data.id || Date.now().toString()
    
    // Extraer dirección de wallet de manera segura
    const walletAddress = data.wallet?.address || data.walletAddress || null
    
    // Extraer tokens de manera segura
    const accessToken = data.authData?.accessToken || data.access_token || data.accessToken || result.access_token
    const refreshToken = data.authData?.refreshToken || data.refresh_token || data.refreshToken || result.refresh_token
    
    const user: User = {
      id: userId,
      email: credentials.email,
      username: data.user?.username || credentials.email.split('@')[0],
      walletAddress: walletAddress,
      createdAt: data.user?.created_at || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
    
    // Guardar sesión
    saveSession(user, accessToken, refreshToken, walletAddress)
    
    return user
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export async function logoutUser(): Promise<void> {
  try {
    // No necesitamos hacer logout en Cavos, solo limpiar sesión local
    clearSession()
  } catch (error) {
    console.error('Logout error:', error)
    clearSession()
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = getSession()
  if (!session.user || !session.accessToken) return null
  
  try {
    // Si tenemos un access token, intentar usarlo directamente
    // Solo refrescar si es necesario
    return session.user
  } catch (error) {
    console.error('Get current user error:', error)
    clearSession()
    return null
  }
}

export async function refreshSession(): Promise<User | null> {
  const session = getSession()
  if (!session.refreshToken) {
    console.log('No refresh token available')
    return null
  }
  
  try {
    const auth = getCavosAuth()
    console.log('Refreshing token with:', session.refreshToken)
    console.log('Cavos auth instance created for refresh')
    
    const result = await auth.refreshToken(session.refreshToken, CAVOS_CONFIG.network)
    console.log('Refresh result:', result)
    console.log('Refresh result structure:', {
      hasAccessToken: !!result.access_token,
      hasAccessTokenAlt: !!result.accessToken,
      hasDataAccessToken: !!result.data?.accessToken,
      hasRefreshToken: !!result.refresh_token,
      hasRefreshTokenAlt: !!result.refreshToken,
      hasDataRefreshToken: !!result.data?.refreshToken
    })
    
    if (session.user) {
      session.user.lastLogin = new Date().toISOString()
      
      // Extraer tokens de la respuesta
      const accessToken = result.access_token || result.accessToken || result.data?.accessToken
      const refreshToken = result.refresh_token || result.refreshToken || result.data?.refreshToken
      
      console.log('Extracted tokens:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        userId: session.user.id
      })
      
      if (accessToken && refreshToken) {
        saveSession(session.user, accessToken, refreshToken, session.walletAddress || undefined)
        console.log('Session refreshed successfully')
        return session.user
      } else {
        console.error('No tokens in refresh response')
        clearSession()
        return null
      }
    } else {
      console.log('No user in session for refresh')
      return null
    }
  } catch (error) {
    console.error('Refresh session error:', error)
    console.error('Refresh error details:', {
      message: error instanceof Error ? error.message : 'Not an Error object',
      type: typeof error
    })
    clearSession()
  }
  
  return null
}

// Función para ejecutar transacciones usando nuestra API route
export async function executeTransaction(calls: unknown[]): Promise<{ txHash?: string; transactionHash?: string; accessToken?: string }> {
  const session = getSession()
  if (!session.accessToken || !session.walletAddress) {
    throw new Error('No active session')
  }
  
  console.log('Executing transaction with session:', {
    walletAddress: session.walletAddress,
    hasAccessToken: !!session.accessToken
  })
  
  try {
    console.log('Sending transaction to API route with:', {
      walletAddress: session.walletAddress,
      calls: JSON.stringify(calls, null, 2),
      hasAccessToken: !!session.accessToken,
      network: CAVOS_CONFIG.network
    })
    
    // Log para debugging
    console.log('Full request body:', JSON.stringify({
      walletAddress: session.walletAddress,
      calls,
      accessToken: session.accessToken,
      network: CAVOS_CONFIG.network
    }, null, 2))
    
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: session.walletAddress,
        calls,
        accessToken: session.accessToken,
        network: CAVOS_CONFIG.network
      })
    })
    
    const result = await response.json()
    console.log('API response:', result)
    
    if (!response.ok) {
      if (response.status === 401) {
        // Si es un error de autenticación, limpiar la sesión
        clearSession()
        throw new Error('Session expired. Please login again.')
      }
      throw new Error(result.error || result.details || 'Transaction failed')
    }
    
    if (!result.success) {
      throw new Error(result.message || 'Transaction failed')
    }
    
    // Si se refrescó el token, actualizar la sesión
    if (result.data?.accessToken && session.user && session.refreshToken) {
      saveSession(session.user, result.data.accessToken, session.refreshToken, session.walletAddress || undefined)
    }
    
    return {
      txHash: result.data?.txHash,
      transactionHash: result.data?.txHash,
      accessToken: result.data?.accessToken
    }
      } catch (error) {
      console.error('Execute transaction error:', error)
      console.error('Error type:', typeof error)
      console.error('Error message:', error instanceof Error ? error.message : 'Not an Error object')
      
              // Si el error es 401, intentar refrescar el token y reintentar
        if ((error as { status?: number })?.status === 401 || 
            (error instanceof Error && error.message.includes('401')) ||
            (error instanceof Error && error.message.includes('Unauthorized'))) {
      console.log('Token expired, attempting to refresh...')
      
              try {
          const refreshedUser = await refreshSession()
          if (refreshedUser) {
            const newSession = getSession()
            console.log('Token refreshed, retrying transaction...')
            console.log('New session:', { 
              walletAddress: newSession.walletAddress, 
              hasAccessToken: !!newSession.accessToken 
            })
            
            const auth = getCavosAuth()
            const retryResult = await auth.executeCalls(
              newSession.walletAddress!,
              calls,
              newSession.accessToken!
            )
            
            console.log('Transaction retry successful:', retryResult)
            
            return {
              txHash: retryResult.txHash,
              transactionHash: retryResult.transactionHash,
              accessToken: retryResult.accessToken
            }
          } else {
            console.log('Token refresh failed - no user returned')
          }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Si el refresh falla, limpiar la sesión
        clearSession()
        throw new Error('Session expired. Please login again.')
      }
    }
    
          console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        status: (error as { status?: number })?.status,
        response: (error as { response?: unknown })?.response
      })
    throw error
  }
}
