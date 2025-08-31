"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavigationHeader } from "@/components/ui/navigation-header"
import { Check, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTransactions } from "@/hooks/use-transactions"
import Image from "next/image"

interface CharacterSelectProps {
  selectedCharacter: string
  onSelectCharacter: (character: string) => void
  onNavigate: (screen: "menu" | "character-select" | "game" | "options") => void
}

const CHARACTERS = [
  {
    id: "bird-1",
    name: "Cavos Bird",
    description: "The classic Cavos bird",
    color: "bg-primary",
    unlocked: true,
    image: "/CavosLogo.png",
    requirement: 0,
  },
  {
    id: "bird-2",
    name: "Starknet Bird",
    description: "Bird of Starknet",
    color: "bg-secondary",
    requirement: 200,
    image: "/favicon.png",
  },
  {
    id: "bird-3",
    name: "Shark Pepe",
    description: "The fierce Shark Pepe",
    color: "bg-accent",
    requirement: 350,
    image: "/SharkPepe.png",
  },
  {
    id: "bird-4",
    name: "Mr. Quack",
    description: "The legendary Mr. Quack",
    color: "bg-gradient-to-r from-primary to-secondary",
    requirement: 500,
    image: "/MrQuack.png",
  },
  {
    id: "bird-5", 
    name: "StarkGlass",
    description: "Almost invisible like a Ninja",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    requirement: 1000,
    image: "/stark.png",
  },
  {
    id: "bird-6",
    name: "Secret", 
    description: "A LEGEND",
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
    requirement: 5000,
  },
]

export function CharacterSelect({ selectedCharacter, onSelectCharacter, onNavigate }: CharacterSelectProps) {
  const { user, isAuthenticated } = useAuth()
  const { transactions } = useTransactions(user?.id)
  
  // Calcular personajes desbloqueados basado en transacciones
  const unlockedCharacters = CHARACTERS.map(character => ({
    ...character,
    unlocked: transactions.length >= character.requirement
  }))
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <NavigationHeader title="SELECT CHARACTER" onBack={() => onNavigate("menu")} />
        
        {/* Progress Indicator */}
        {isAuthenticated && (
          <div className="text-center space-y-2">
            <p className="text-sm text-white">
              Total Transactions: <span className="font-bold text-primary">{transactions.length}</span>
            </p>
            <p className="text-xs text-white">
              Unlocked: {unlockedCharacters.filter(c => c.unlocked).length}/{CHARACTERS.length} characters
            </p>
          </div>
        )}

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {unlockedCharacters.map((character) => (
            <Card
              key={character.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 bg-sky-200 border-sky-300 ${
                selectedCharacter === character.id ? "ring-2 ring-yellow-300 shadow-lg" : "hover:shadow-md"
              } ${!character.unlocked ? "opacity-60" : ""}`}
              onClick={() => character.unlocked && onSelectCharacter(character.id)}
            >
              <div className="space-y-4">
                {/* Character Avatar */}
                <div className="flex justify-center">
                  <div
                    className={`w-24 h-24 rounded-full ${character.image ? 'bg-white' : character.id === 'bird-6' ? 'bg-black' : character.color} flex items-center justify-center relative overflow-hidden`}
                  >
                    {character.image ? (
                      <div 
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'white' }}
                      >
                        <Image 
                          src={character.image} 
                          alt={character.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain"
                          style={{ 
                            imageRendering: 'pixelated'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-4xl">🐱</div>
                    )}
                    {selectedCharacter === character.id && (
                      <div className="absolute -top-2 -right-2 bg-yellow-300 rounded-full p-1">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Character Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-black">{character.name}</h3>
                  <p className="text-black text-sm">{character.description}</p>

                  {!character.unlocked && (
                    <div className="mt-3 p-2 bg-muted rounded-lg">
                      <div className="flex items-center justify-center space-x-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {transactions.length}/{character.requirement} transactions
                        </p>
                      </div>
                      <div className="mt-2 w-full bg-muted-foreground/20 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((transactions.length / character.requirement) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Selection Button */}
                {character.unlocked && (
                  <Button
                    onClick={() => onSelectCharacter(character.id)}
                    variant={selectedCharacter === character.id ? "default" : "outline"}
                    className={`w-full ${
                      selectedCharacter === character.id 
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white" 
                        : "border-black text-black hover:bg-blue-600 hover:text-blue-900 hover:border-blue-900"
                    }`}
                    style={selectedCharacter !== character.id ? { borderColor: 'black' } : {}}
                  >
                    {selectedCharacter === character.id ? "Selected" : "Select"}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button onClick={() => onNavigate("game")} className="px-8 py-3 text-lg bg-primary hover:bg-primary/90">
            Play with {unlockedCharacters.find((c) => c.id === selectedCharacter)?.name}
          </Button>
        </div>
      </div>
    </div>
  )
}
