import { executeTransaction } from './cavos-auth'

// Helper function para convertir números a formato hexadecimal para calldata
function toHexString(value: string | number): string {
  const num = BigInt(value)
  return num.toString(16) // Sin prefijo 0x para calldata
}

// Tipos para las transacciones
export interface GameTransaction {
  id: string
  userId: string
  type: 'score' | 'achievement' | 'reward'
  amount: number
  score: number
  level: number
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
  hash?: string
  metadata?: Record<string, any>
}

export interface TransactionRequest {
  type: 'score' | 'achievement' | 'reward'
  amount: number
  score: number
  level: number
  metadata?: Record<string, any>
}

export interface TransactionStats {
  totalTransactions: number
  completedTransactions: number
  averageScore: number
  bestScore: number
  totalScoreTransactions: number
  totalAchievementTransactions: number
  totalRewardTransactions: number
  pendingTransactions: number
}

// Configuración de transacciones
const TRANSACTION_CONFIG = {
  // Configuración para diferentes tipos de transacciones
  score: {
    minAmount: 1,
    maxAmount: 10,
    multiplier: 1
  },
  achievement: {
    minAmount: 5,
    maxAmount: 50,
    multiplier: 2
  },
  reward: {
    minAmount: 10,
    maxAmount: 100,
    multiplier: 3
  }
}

// Almacenamiento local de transacciones
const TRANSACTIONS_KEY = 'flappystark_transactions'

export function saveTransaction(transaction: GameTransaction): void {
  if (typeof window === "undefined") return
  
  const transactions = getTransactions()
  transactions.push(transaction)
  
  // Mantener solo las últimas 100 transacciones
  if (transactions.length > 100) {
    transactions.splice(0, transactions.length - 100)
  }
  
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
}

export function getTransactions(): GameTransaction[] {
  if (typeof window === "undefined") return []
  
  const stored = localStorage.getItem(TRANSACTIONS_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function getTransactionStats(): TransactionStats {
  const transactions = getTransactions()
  const completedTransactions = transactions.filter(t => t.status === 'completed')
  
  return {
    totalTransactions: transactions.length,
    completedTransactions: completedTransactions.length,
    averageScore: completedTransactions.length > 0 
      ? Math.round(completedTransactions.reduce((sum, t) => sum + t.score, 0) / completedTransactions.length)
      : 0,
    bestScore: completedTransactions.length > 0 
      ? Math.max(...completedTransactions.map(t => t.score))
      : 0,
    totalScoreTransactions: completedTransactions.filter(t => t.type === 'score').length,
    totalAchievementTransactions: completedTransactions.filter(t => t.type === 'achievement').length,
    totalRewardTransactions: completedTransactions.filter(t => t.type === 'reward').length,
    pendingTransactions: transactions.filter(t => t.status === 'pending').length
  }
}

// Calcular recompensa basada en el score y nivel
export function calculateReward(score: number, level: number, type: 'score' | 'achievement' | 'reward'): number {
  const config = TRANSACTION_CONFIG[type]
  const baseAmount = Math.min(
    Math.max(config.minAmount, Math.floor(score / 10) * config.multiplier),
    config.maxAmount
  )
  
  // Bonus por nivel
  const levelBonus = Math.floor(level / 5) * 2
  
  return baseAmount + levelBonus
}

// Crear transacción real usando Cavos (basado en el ejemplo funcional)
export async function createTransaction(
  userId: string, 
  request: TransactionRequest
): Promise<GameTransaction> {
  try {
    console.log('Creating real transaction:', request)
    
    // Usar el contrato que funciona en el ejemplo de Cavos
    const calls = [
      {
        contractAddress: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        entrypoint: "approve",
        calldata: [
          "0x1234567890123456789012345678901234567890",
          "500000000000000000",
          "0",
        ],
      },
    ]
    
    console.log('Executing transaction with calls:', calls)
    
    const result = await executeTransaction(calls)
    console.log('Transaction result:', result)
    
    const transaction: GameTransaction = {
      id: Date.now().toString(),
      userId,
      type: request.type,
      amount: request.amount,
      score: request.score,
      level: request.level,
      timestamp: new Date().toISOString(),
      status: 'completed',
      hash: result.transactionHash || result.txHash,
      metadata: {
        ...request.metadata,
        real: true,
        note: 'Real transaction executed via Cavos'
      }
    }
    
    saveTransaction(transaction)
    console.log('Real transaction created:', transaction)
    
    return transaction
  } catch (error) {
    console.error('Create transaction error:', error)
    throw error
  }
}

// Procesar transacción de score (cuando el jugador pasa un obstáculo)
export async function processScoreTransaction(
  userId: string, 
  score: number, 
  level: number
): Promise<GameTransaction> {
  const amount = calculateReward(score, level, 'score')
  
  return createTransaction(userId, {
    type: 'score',
    amount,
    score,
    level,
    metadata: {
      action: 'obstacle_passed',
      gameSession: Date.now().toString()
    }
  })
}

// Procesar transacción de logro (cuando el jugador alcanza un milestone)
export async function processAchievementTransaction(
  userId: string, 
  score: number, 
  level: number,
  achievement: string
): Promise<GameTransaction> {
  const amount = calculateReward(score, level, 'achievement')
  
  return createTransaction(userId, {
    type: 'achievement',
    amount,
    score,
    level,
    metadata: {
      action: 'achievement_unlocked',
      achievement,
      gameSession: Date.now().toString()
    }
  })
}

// Procesar transacción de recompensa (cuando el jugador completa el juego)
export async function processRewardTransaction(
  userId: string, 
  score: number, 
  level: number,
  gameDuration: number
): Promise<GameTransaction> {
  const amount = calculateReward(score, level, 'reward')
  
  return createTransaction(userId, {
    type: 'reward',
    amount,
    score,
    level,
    metadata: {
      action: 'game_completed',
      gameDuration,
      gameSession: Date.now().toString()
    }
  })
}

// Verificar estado de transacciones pendientes
export async function checkPendingTransactions(): Promise<void> {
  const transactions = getTransactions()
  const pendingTransactions = transactions.filter(t => t.status === 'pending')
  
  if (pendingTransactions.length === 0) return
  
  try {
    // En una implementación real, aquí verificaríamos el estado de las transacciones
    // en la blockchain usando el hash de la transacción
    for (const transaction of pendingTransactions) {
      if (transaction.hash) {
        // Simular verificación de transacción
        // En producción, usaríamos un servicio para verificar el estado
        transaction.status = 'completed'
      }
    }
    
    // Actualizar almacenamiento local
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
  } catch (error) {
    console.error('Check pending transactions error:', error)
  }
}

// Sincronizar transacciones locales
export async function syncTransactions(userId: string): Promise<void> {
  try {
    // En una implementación real, aquí sincronizaríamos con un backend
    // que mantenga un registro de todas las transacciones del usuario
    await checkPendingTransactions()
  } catch (error) {
    console.error('Sync transactions error:', error)
  }
}
