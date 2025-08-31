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
  const [isHydrated, setIsHydrated] = useState(false)
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // Hidratación - cargar datos del localStorage después del montaje
  useEffect(() => {
    const savedScreen = localStorage.getItem("flappystark_current_screen") as ScreenType
    const savedCharacter = localStorage.getItem("flappystark_selected_character")
    
    if (savedScreen) {
      setCurrentScreen(savedScreen)
    }
    if (savedCharacter) {
      setSelectedCharacter(savedCharacter)
    }
    
    setIsHydrated(true)
  }, [])

  // Guardar el estado de navegación cuando cambie
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("flappystark_current_screen", currentScreen)
    }
  }, [currentScreen, isHydrated])

  // Guardar el personaje seleccionado cuando cambie
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("flappystark_selected_character", selectedCharacter)
    }
  }, [selectedCharacter, isHydrated])

  // Protección de rutas - redirigir al login si no está autenticado
  useEffect(() => {
    // Solo verificar después de la hidratación y cuando no esté cargando
    if (!isHydrated || authLoading) return
    
    const protectedScreens: ScreenType[] = ["game", "character-select", "options", "records", "profile"]
    
    if (!isAuthenticated && protectedScreens.includes(currentScreen)) {
      setCurrentScreen("login")
    }
  }, [isAuthenticated, currentScreen, isHydrated, authLoading])

  // Función para navegar y guardar el estado
  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "menu":
        return <MainMenu onNavigate={navigateTo} />
      case "character-select":
        return (
          <CharacterSelect
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
            onNavigate={navigateTo}
          />
        )
      case "game":
        return <GameScreen selectedCharacter={selectedCharacter} onNavigate={navigateTo} />
      case "options":
        return <OptionsScreen onNavigate={navigateTo} />
      case "records":
        return <RecordsScreen onNavigate={navigateTo} />
      case "login":
        return <LoginForm onNavigate={(screen) => navigateTo(screen as ScreenType)} onSuccess={() => navigateTo("menu")} />
      case "register":
        return <RegisterForm onNavigate={(screen) => navigateTo(screen as ScreenType)} onSuccess={() => navigateTo("menu")} />
      case "profile":
        return <UserProfile onNavigate={(screen) => navigateTo(screen as ScreenType)} />
      default:
        return <MainMenu onNavigate={navigateTo} />
    }
  }

  // Mostrar loading mientras se hidrata o autentica
  if (!isHydrated || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">{renderScreen()}</div>
}
