// Game storage utilities for FlappyStark
export interface GameStats {
  bestScore: number
  totalTransactions: number
  totalGamesPlayed: number
  averageScore: number
  bestStreak: number
  maxLevel: number
  totalPlayTime: number
  lastPlayed: string
}

export interface GameRecord {
  id: string
  userId: string
  username: string
  score: number
  transactions: number
  level: number
  date: string
  duration: number
}

const getStorageKeys = (userId?: string) => ({
  STATS: `flappystark_stats_${userId || 'anonymous'}`,
  RECORDS: `flappystark_records_global`, // Global records for all users
  SETTINGS: `flappystark_settings_${userId || 'anonymous'}`,
})

export function getGameStats(userId?: string): GameStats {
  if (typeof window === "undefined") {
    return {
      bestScore: 0,
      totalTransactions: 0,
      totalGamesPlayed: 0,
      averageScore: 0,
      bestStreak: 0,
      maxLevel: 1,
      totalPlayTime: 0,
      lastPlayed: new Date().toISOString(),
    }
  }

  const keys = getStorageKeys(userId)
  const stored = localStorage.getItem(keys.STATS)
  if (!stored) {
    return {
      bestScore: 0,
      totalTransactions: 0,
      totalGamesPlayed: 0,
      averageScore: 0,
      bestStreak: 0,
      maxLevel: 1,
      totalPlayTime: 0,
      lastPlayed: new Date().toISOString(),
    }
  }

  return JSON.parse(stored)
}

export function saveGameStats(stats: GameStats, userId?: string): void {
  if (typeof window === "undefined") return
  const keys = getStorageKeys(userId)
  localStorage.setItem(keys.STATS, JSON.stringify(stats))
}

export function getGameRecords(): GameRecord[] {
  if (typeof window === "undefined") return []

  const keys = getStorageKeys()
  const stored = localStorage.getItem(keys.RECORDS)
  if (!stored) return []

  return JSON.parse(stored)
}

export function saveGameRecord(record: Omit<GameRecord, "id">): void {
  if (typeof window === "undefined") return

  const records = getGameRecords()
  const newRecord: GameRecord = {
    ...record,
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }

  // Check if user already has a record
  const existingUserIndex = records.findIndex(r => r.userId === record.userId)
  
  if (existingUserIndex !== -1) {
    // User already has a record, check if new score is better
    const existingRecord = records[existingUserIndex]
    if (newRecord.score > existingRecord.score) {
      // Replace with better score
      records[existingUserIndex] = newRecord
    } else {
      // New score is not better, don't save it
      return
    }
  } else {
    // New user, add their record
    records.push(newRecord)
  }

  // Sort by score (highest first)
  records.sort((a, b) => b.score - a.score)

  // Keep only top 50 records
  const trimmedRecords = records.slice(0, 50)

  const keys = getStorageKeys()
  localStorage.setItem(keys.RECORDS, JSON.stringify(trimmedRecords))
}

export function updateGameStats(gameResult: {
  score: number
  transactions: number
  level: number
  duration: number
  userId: string
  username: string
}, userId?: string): void {
  const stats = getGameStats(userId)

  stats.totalGamesPlayed += 1
  stats.totalTransactions += gameResult.transactions
  stats.totalPlayTime += gameResult.duration
  stats.lastPlayed = new Date().toISOString()

  if (gameResult.score > stats.bestScore) {
    stats.bestScore = gameResult.score
  }

  if (gameResult.level > stats.maxLevel) {
    stats.maxLevel = gameResult.level
  }

  stats.averageScore = Math.round(
    (stats.averageScore * (stats.totalGamesPlayed - 1) + gameResult.score) / stats.totalGamesPlayed,
  )

  saveGameStats(stats, userId)
  saveGameRecord({
    userId: gameResult.userId,
    username: gameResult.username,
    score: gameResult.score,
    transactions: gameResult.transactions,
    level: gameResult.level,
    date: new Date().toISOString(),
    duration: gameResult.duration,
  })
}
