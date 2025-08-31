import { useState, useEffect, useCallback } from 'react'
import { 
  GameTransaction, 
  TransactionStats,
  processScoreTransaction,
  getTransactionStats,
  getTransactions
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
        const localTransactions = getTransactions(userId)
        setTransactions(localTransactions)
        setStats(getTransactionStats(userId))
      } catch (error) {
        setError('Failed to load transactions')
        console.error('Load transactions error:', error)
      }
    }

    loadTransactions()
    
    // Recargar transacciones cada segundo para detectar cambios
    const interval = setInterval(loadTransactions, 1000)
    
    return () => clearInterval(interval)
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
      
      // Recargar transacciones inmediatamente después de crear una nueva
      const updatedTransactions = getTransactions(userId)
      setTransactions(updatedTransactions)
      setStats(getTransactionStats(userId))
      
      return transaction
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process score transaction'
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
    clearError
  }
}
