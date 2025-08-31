"use client"

import { useState, useEffect } from "react"
import { MainMenu } from "@/components/main-menu"
import { CharacterSelect } from "@/components/character-select"
import { GameScreen } from "@/components/game-screen"
import { OptionsScreen } from "@/components/options-screen"
import { RecordsScreen } from "@/components/records-screen"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { UserProfile } from "@/components/auth/user-profile"
import { useAuth } from "@/hooks/use-auth"

export type ScreenType = "menu" | "character-select" | "game" | "options" | "records" | "login" | "register" | "profile"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("menu")
  const [selectedCharacter, setSelectedCharacter] = useState<string>("bird-1")
  const { isAuthenticated } = useAuth()

  // Protección de rutas - redirigir al login si no está autenticado
  useEffect(() => {
    const protectedScreens: ScreenType[] = ["game", "character-select", "options", "records", "profile"]
    
    if (!isAuthenticated && protectedScreens.includes(currentScreen)) {
      setCurrentScreen("login")
    }
  }, [isAuthenticated, currentScreen])

  const renderScreen = () => {
    switch (currentScreen) {
      case "menu":
        return <MainMenu onNavigate={setCurrentScreen} />
      case "character-select":
        return (
          <CharacterSelect
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
            onNavigate={setCurrentScreen}
          />
        )
      case "game":
        return <GameScreen selectedCharacter={selectedCharacter} onNavigate={setCurrentScreen} />
      case "options":
        return <OptionsScreen onNavigate={setCurrentScreen} />
      case "records":
        return <RecordsScreen onNavigate={setCurrentScreen} />
      case "login":
        return <LoginForm onNavigate={(screen) => setCurrentScreen(screen as ScreenType)} onSuccess={() => setCurrentScreen("menu")} />
      case "register":
        return <RegisterForm onNavigate={(screen) => setCurrentScreen(screen as ScreenType)} onSuccess={() => setCurrentScreen("menu")} />
      case "profile":
        return <UserProfile onNavigate={(screen) => setCurrentScreen(screen as ScreenType)} />
      default:
        return <MainMenu onNavigate={setCurrentScreen} />
    }
  }

  return <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">{renderScreen()}</div>
}
