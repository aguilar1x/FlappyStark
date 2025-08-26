import { useState, useEffect, useCallback } from 'react'
import { 
  GameTransaction, 
  TransactionStats,
  processScoreTransaction,
  processAchievementTransaction,
  processRewardTransaction,
  getTransactionStats,
  getTransactions,
  syncTransactions,
  checkPendingTransactions
} from '@/lib/cavos-transactions'

export function useTransactions(userId?: string) {
  const [transactions, setTransactions] = useState<GameTransaction[]>([])
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    completedTransactions: 0,
    averageScore: 0,
    bestScore: 0,
    totalScoreTransactions: 0,
    totalAchievementTransactions: 0,
    totalRewardTransactions: 0,
    pendingTransactions: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar transacciones locales
  useEffect(() => {
    const loadTransactions = () => {
      try {
        const localTransactions = getTransactions()
        setTransactions(localTransactions)
        setStats(getTransactionStats())
      } catch (error) {
        setError('Failed to load transactions')
        console.error('Load transactions error:', error)
      }
    }

    loadTransactions()
  }, [])

  // Sincronizar con Cavos si hay usuario
  useEffect(() => {
    if (!userId) return

    const syncWithCavos = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        await syncTransactions(userId)
        await checkPendingTransactions()
        
        // Recargar datos locales
        const localTransactions = getTransactions()
        setTransactions(localTransactions)
        setStats(getTransactionStats())
      } catch (error) {
        setError('Failed to sync transactions')
        console.error('Sync transactions error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    syncWithCavos()
  }, [userId])

  // Procesar transacción de score
  const processScore = useCallback(async (score: number, level: number) => {
    if (!userId) {
      throw new Error('User not authenticated')
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const transaction = await processScoreTransaction(userId, score, level)
      
      setTransactions(prev => [transaction, ...prev])
      setStats(getTransactionStats())
      
      return transaction
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process score transaction'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Procesar transacción de logro
  const processAchievement = useCallback(async (score: number, level: number, achievement: string) => {
    if (!userId) {
      throw new Error('User not authenticated')
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const transaction = await processAchievementTransaction(userId, score, level, achievement)
      
      setTransactions(prev => [transaction, ...prev])
      setStats(getTransactionStats())
      
      return transaction
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process achievement transaction'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Procesar transacción de recompensa
  const processReward = useCallback(async (score: number, level: number, gameDuration: number) => {
    if (!userId) {
      throw new Error('User not authenticated')
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const transaction = await processRewardTransaction(userId, score, level, gameDuration)
      
      setTransactions(prev => [transaction, ...prev])
      setStats(getTransactionStats())
      
      return transaction
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process reward transaction'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Verificar transacciones pendientes
  const checkPending = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      await checkPendingTransactions()
      
      // Recargar datos
      const localTransactions = getTransactions()
      setTransactions(localTransactions)
      setStats(getTransactionStats())
    } catch (error) {
      setError('Failed to check pending transactions')
      console.error('Check pending error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Sincronizar transacciones
  const sync = useCallback(async () => {
    if (!userId) {
      throw new Error('User not authenticated')
    }

    try {
      setIsLoading(true)
      setError(null)
      
      await syncTransactions(userId)
      
      // Recargar datos
      const localTransactions = getTransactions()
      setTransactions(localTransactions)
      setStats(getTransactionStats())
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync transactions'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    transactions,
    stats,
    isLoading,
    error,
    processScore,
    processAchievement,
    processReward,
    checkPending,
    sync,
    clearError
  }
}
