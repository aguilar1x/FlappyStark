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
  score: number
  transactions: number
  level: number
  date: string
  duration: number
}

const STORAGE_KEYS = {
  STATS: "flappystark_stats",
  RECORDS: "flappystark_records",
  SETTINGS: "flappystark_settings",
}

export function getGameStats(): GameStats {
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

  const stored = localStorage.getItem(STORAGE_KEYS.STATS)
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

export function saveGameStats(stats: GameStats): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats))
}

export function getGameRecords(): GameRecord[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEYS.RECORDS)
  if (!stored) return []

  return JSON.parse(stored)
}

export function saveGameRecord(record: Omit<GameRecord, "id">): void {
  if (typeof window === "undefined") return

  const records = getGameRecords()
  const newRecord: GameRecord = {
    ...record,
    id: Date.now().toString(),
  }

  records.push(newRecord)
  records.sort((a, b) => b.score - a.score)

  // Keep only top 50 records
  const trimmedRecords = records.slice(0, 50)

  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(trimmedRecords))
}

export function updateGameStats(gameResult: {
  score: number
  transactions: number
  level: number
  duration: number
}): void {
  const stats = getGameStats()

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

  saveGameStats(stats)
  saveGameRecord({
    score: gameResult.score,
    transactions: gameResult.transactions,
    level: gameResult.level,
    date: new Date().toISOString(),
    duration: gameResult.duration,
  })
}
