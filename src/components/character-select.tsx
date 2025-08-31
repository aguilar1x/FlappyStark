"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavigationHeader } from "@/components/ui/navigation-header"
import { Check, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTransactions } from "@/hooks/use-transactions"

interface CharacterSelectProps {
  selectedCharacter: string
  onSelectCharacter: (character: string) => void
  onNavigate: (screen: "menu" | "character-select" | "game" | "options") => void
}

const CHARACTERS = [
  {
    id: "bird-1",
    name: "Crypto Bird",
    description: "The classic blockchain bird",
    color: "bg-primary",
    requirement: 0,
  },
  {
    id: "bird-2",
    name: "Stark Eagle",
    description: "Eagle of Stark",
    color: "bg-secondary",
    requirement: 10,
  },
  {
    id: "bird-3",
    name: "DeFi Falcon",
    description: "Falcon of decentralized finance",
    color: "bg-accent",
    requirement: 100,
  },
  {
    id: "bird-4",
    name: "NFT Phoenix",
    description: "Unique collectible phoenix",
    color: "bg-gradient-to-r from-primary to-secondary",
    requirement: 500,
  },
  {
    id: "bird-5",
    name: "StarkNet Dragon",
    description: "Legendary dragon of StarkNet",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    requirement: 1000,
  },
  {
    id: "bird-6",
    name: "Cavos Master",
    description: "Master of all transactions",
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
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <NavigationHeader title="SELECT CHARACTER" onBack={() => onNavigate("menu")} />
        
        {/* Progress Indicator */}
        {isAuthenticated && (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Total Transactions: <span className="font-bold text-primary">{transactions.length}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Unlocked: {unlockedCharacters.filter(c => c.unlocked).length}/{CHARACTERS.length} characters
            </p>
          </div>
        )}

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {unlockedCharacters.map((character: any) => (
            <Card
              key={character.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedCharacter === character.id ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
              } ${!character.unlocked ? "opacity-60" : ""}`}
              onClick={() => character.unlocked && onSelectCharacter(character.id)}
            >
              <div className="space-y-4">
                {/* Character Avatar */}
                <div className="flex justify-center">
                  <div
                    className={`w-24 h-24 rounded-full ${character.color} flex items-center justify-center relative`}
                  >
                    <div className="text-4xl">🐦</div>
                    {selectedCharacter === character.id && (
                      <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Character Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">{character.name}</h3>
                  <p className="text-muted-foreground text-sm">{character.description}</p>

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
                    className="w-full"
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
            Play with {unlockedCharacters.find((c: any) => c.id === selectedCharacter)?.name}
          </Button>
        </div>
      </div>
    </div>
  )
}
