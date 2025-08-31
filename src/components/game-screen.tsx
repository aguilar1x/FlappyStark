"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { GameOverlay } from "@/components/ui/game-overlay"
import { ArrowLeft, Pause, RotateCcw, Play } from "lucide-react"
import { updateGameStats, getGameStats } from "@/lib/game-storage"
import { useAuth } from "@/hooks/use-auth"
import { useTransactions } from "@/hooks/use-transactions"


interface GameScreenProps {
  selectedCharacter: string
  onNavigate: (screen: "menu" | "character-select" | "game" | "options" | "records" | "login") => void
}

interface Bird {
  x: number
  y: number
  velocity: number
}

interface Pipe {
  x: number
  topHeight: number
  bottomHeight: number
  passed: boolean
}

type GameState = "waiting" | "playing" | "paused" | "gameOver"

export function GameScreen({ selectedCharacter, onNavigate }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const _animationRef = useRef<number | undefined>(undefined)
  const gameStartTimeRef = useRef<number>(0)

  const { user, isAuthenticated } = useAuth()
  const { processScore, stats: _stats, transactions: userTransactions } = useTransactions(user?.id)

  const [gameState, setGameState] = useState<GameState>("waiting")
  const [score, setScore] = useState(0)
  const [transactions, _setTransactions] = useState(0)
  const [bird, setBird] = useState<Bird>({ x: 100, y: 200, velocity: 0 })
  const [pipes, setPipes] = useState<Pipe[]>([])
  const [bestScore, setBestScore] = useState(() => getGameStats(user?.id).bestScore)
  const [difficulty, setDifficulty] = useState(1)
  const [currentSpeed, setCurrentSpeed] = useState(2)
  const [currentGap, setCurrentGap] = useState(150)
  const [showTransactionIndicator, setShowTransactionIndicator] = useState(false)
  const [characterImage, setCharacterImage] = useState<HTMLImageElement | null>(null)

  const GRAVITY = 0.5
  const JUMP_FORCE = -8
  const PIPE_WIDTH = 60
  const BASE_PIPE_GAP = 150
  const BASE_PIPE_SPEED = 2
  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 400
  const PIPES_PER_LEVEL = 3
  const SPEED_INCREMENT = 0.5
  const GAP_DECREASE = 8

  const updateDifficulty = useCallback(
    (newScore: number) => {
      const newDifficulty = Math.floor(newScore / PIPES_PER_LEVEL) + 1
      if (newDifficulty !== difficulty) {
        setDifficulty(newDifficulty)
        setCurrentSpeed(BASE_PIPE_SPEED + (newDifficulty - 1) * SPEED_INCREMENT)
        setCurrentGap(Math.max(100, BASE_PIPE_GAP - (newDifficulty - 1) * GAP_DECREASE))
      }
    },
    [difficulty],
  )

  const initGame = useCallback(() => {
    setBird({ x: 100, y: 200, velocity: 0 })
    setPipes([])
    setScore(0)
    setGameState("waiting")
    setDifficulty(1)
    setCurrentSpeed(BASE_PIPE_SPEED)
    setCurrentGap(BASE_PIPE_GAP)
    gameStartTimeRef.current = 0
  }, [])

  const jump = useCallback(() => {
    if (gameState === "waiting") {
      setGameState("playing")
      gameStartTimeRef.current = Date.now()
      
      // Procesar transacción de inicio de juego si el usuario está autenticado
      if (isAuthenticated && user?.id) {
        processScore(0, 1).catch(console.error)
      }
    }
    if (gameState === "playing") {
      setBird((prev) => ({ ...prev, velocity: JUMP_FORCE }))
      
      // Procesar transacción por cada salto si el usuario está autenticado
      if (isAuthenticated && user?.id) {
        processScore(score, difficulty).then(() => {
          // Mostrar indicador de transacción
          setShowTransactionIndicator(true)
          setTimeout(() => setShowTransactionIndicator(false), 1000)
        })        .catch((error) => {
          console.error('Transaction failed:', error)
          
          // Si el error es de sesión expirada, redirigir al login
          if (error.message.includes('Session expired') || error.message.includes('Please login again')) {
            console.log('Session expired, redirecting to login...')
            onNavigate('login')
            return
          }
          
          // Mostrar indicador de error para otros tipos de errores
          setShowTransactionIndicator(true)
          setTimeout(() => setShowTransactionIndicator(false), 2000)
          console.log('Transaction processed successfully')
        })
      }
    }
  }, [gameState, isAuthenticated, user?.id, processScore, score, difficulty])

  const generatePipe = useCallback(
    (x: number): Pipe => {
      const topHeight = Math.random() * (CANVAS_HEIGHT - currentGap - 100) + 50
      return {
        x,
        topHeight,
        bottomHeight: CANVAS_HEIGHT - topHeight - currentGap,
        passed: false,
      }
    },
    [currentGap],
  )

  const checkCollision = useCallback((bird: Bird, pipes: Pipe[]): boolean => {
    const birdSize = selectedCharacter === "bird-4" ? 50 : 30
    
    // Para MrQuack, ajustar la posición de colisión para que coincida con la imagen
    const birdLeft = selectedCharacter === "bird-4" ? bird.x - 10 : bird.x
    const birdRight = birdLeft + birdSize
    const birdTop = selectedCharacter === "bird-4" ? bird.y - 10 : bird.y
    const birdBottom = birdTop + birdSize
    
    // Colisión con los bordes del canvas
    if (birdTop <= 0 || birdBottom >= CANVAS_HEIGHT) {
      return true
    }

    // Colisión con los tubos
    for (const pipe of pipes) {
      if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
        if (birdTop < pipe.topHeight || birdBottom > CANVAS_HEIGHT - pipe.bottomHeight) {
          return true
        }
      }
    }
    return false
  }, [selectedCharacter])

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return

    setBird((prev) => {
      const newBird = {
        ...prev,
        y: prev.y + prev.velocity,
        velocity: prev.velocity + GRAVITY,
      }

              if (checkCollision(newBird, pipes)) {
          setGameState("gameOver")
          const duration = Math.round((Date.now() - gameStartTimeRef.current) / 1000)
          updateGameStats({
            score,
            transactions,
            level: difficulty,
            duration,
            userId: user?.id || '',
            username: user?.username || 'Anonymous',
          }, user?.id)
          

          
          const newStats = getGameStats(user?.id)
          setBestScore(newStats.bestScore)
          return prev
        }

      return newBird
    })

    setPipes((prev) => {
      let newPipes = prev.map((pipe) => ({ ...pipe, x: pipe.x - currentSpeed }))

      newPipes = newPipes.filter((pipe) => pipe.x > -PIPE_WIDTH)

      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < CANVAS_WIDTH - 300) {
        newPipes.push(generatePipe(CANVAS_WIDTH))
      }

      newPipes.forEach((pipe) => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
          pipe.passed = true
          const newScore = score + 1
          setScore(newScore)
          updateDifficulty(newScore)
          
          // Procesar transacción de obstáculo superado si el usuario está autenticado
          if (isAuthenticated && user?.id) {
            processScore(newScore, difficulty).catch(console.error)
          }
        }
      })

      return newPipes
    })
  }, [
    gameState,
    pipes,
    bird,
    score,
    bestScore,
    checkCollision,
    generatePipe,
    currentSpeed,
    updateDifficulty,
    transactions,
    difficulty,
  ])

  useEffect(() => {
    if (gameState === "playing") {
      const interval = setInterval(gameLoop, 16)
      return () => clearInterval(interval)
    }
  }, [gameLoop, gameState])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Fondo de día
    ctx.fillStyle = "#87CEEB"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Tubos verdes
    ctx.fillStyle = "#228B22"
    pipes.forEach((pipe) => {
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)
      ctx.fillRect(pipe.x, CANVAS_HEIGHT - pipe.bottomHeight, PIPE_WIDTH, pipe.bottomHeight)
    })

    // Pájaro
    if (characterImage) {
      // Desactivar suavizado para mantener píxeles nítidos
      ctx.imageSmoothingEnabled = false
      
      // MrQuack más grande
      if (selectedCharacter === "bird-4") {
        ctx.drawImage(characterImage, bird.x - 10, bird.y - 10, 50, 50)
      } else {
        ctx.drawImage(characterImage, bird.x, bird.y, 30, 30)
      }
    } else {
      // Pájaro dorado por defecto
      ctx.fillStyle = "#FFD700"
      ctx.fillRect(bird.x, bird.y, 30, 30)
    }

    // Suelo marrón
    ctx.fillStyle = "#8B4513"
    ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20)
  }, [bird, pipes, characterImage])

  // Cargar imagen del personaje
  useEffect(() => {
    const characters = [
      { id: "bird-1", image: "/CavosLogo.png" },
      { id: "bird-2", image: "/favicon.png" },
      { id: "bird-3", image: "/SharkPepe.png" },
      { id: "bird-4", image: "/MrQuack.png" },
      { id: "bird-5", image: "/stark.png" },
      { id: "bird-6", image: "/nyan.png" },
    ]
    
    const character = characters.find(c => c.id === selectedCharacter)
    if (character?.image) {
      const img = new Image()
      img.onload = () => setCharacterImage(img)
      img.src = character.image
    } else {
      setCharacterImage(null)
    }
  }, [selectedCharacter])



  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        jump()
      }
    }

    const handleClick = () => jump()

    window.addEventListener("keydown", handleKeyPress)
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener("click", handleClick)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      if (canvas) {
        canvas.removeEventListener("click", handleClick)
      }
    }
  }, [jump])

  const togglePause = () => {
    if (gameState === "playing") {
      setGameState("paused")
    } else if (gameState === "paused") {
      setGameState("playing")
    }
  }

  const restart = () => {
    initGame()
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button onClick={() => onNavigate("menu")} variant="outline" size="sm" className="border-black text-black hover:bg-blue-600 hover:text-blue-900 hover:border-blue-900" style={{ borderColor: 'black' }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Menu
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-300">{score}</p>
              <p className="text-xs text-white">Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">{userTransactions.length}</p>
              <p className="text-xs text-white">Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-300">Lv.{difficulty}</p>
              <p className="text-xs text-white">Level</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={togglePause}
              variant="outline"
              size="sm"
              disabled={gameState === "waiting" || gameState === "gameOver"}
              className="border-black text-black hover:bg-blue-600 hover:text-blue-900 hover:border-blue-900"
              style={{ borderColor: 'black' }}
            >
              {gameState === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button onClick={restart} variant="outline" size="sm" className="border-black text-black hover:bg-blue-600 hover:text-blue-900 hover:border-blue-900" style={{ borderColor: 'black' }}>
              <RotateCcw className="h-4 w-4" />
            </Button>

          </div>
        </div>

        <Card className="relative overflow-hidden bg-sky-200 border-sky-300">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-auto cursor-pointer"
            style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
          />

          <GameOverlay visible={gameState === "waiting"}>
            <div className="text-6xl">🐦</div>
            <p className="text-xl font-semibold text-white">Click or press SPACE to fly!</p>
            <p className="text-sm text-white">Each obstacle passed = 1 transaction</p>
            <p className="text-xs text-white">Difficulty increases every {PIPES_PER_LEVEL} pipes</p>
          </GameOverlay>

          <GameOverlay visible={gameState === "paused"}>
            <p className="text-2xl font-semibold text-black">PAUSED</p>
            <Button onClick={togglePause} variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Play className="h-4 w-4 mr-2" />
              Continue
            </Button>
          </GameOverlay>

          <GameOverlay visible={gameState === "gameOver"}>
            <p className="text-2xl font-semibold">GAME OVER</p>
            <p className="text-lg">Score: {score}</p>
            <p className="text-lg">Transactions: {userTransactions.length}</p>
            <p className="text-md">Level Reached: {difficulty}</p>
            <Button onClick={restart} variant="secondary">
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </GameOverlay>

          {/* Transaction Indicator */}
          {showTransactionIndicator && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
              ⚡ Transaction Sent!
            </div>
          )}
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <StatCard value={userTransactions.length} label="Total Transactions" color="text-primary" size="sm" />
          <StatCard value={bestScore} label="Best Score" color="text-accent" size="sm" />
          <StatCard value={`x${currentSpeed.toFixed(1)}`} label="Speed" color="text-orange-500" size="sm" />
        </div>
      </div>
    </div>
  )
}
