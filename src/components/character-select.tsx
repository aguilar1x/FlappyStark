"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavigationHeader } from "@/components/ui/navigation-header"
import { Check } from "lucide-react"

interface CharacterSelectProps {
  selectedCharacter: string
  onSelectCharacter: (character: string) => void
  onNavigate: (screen: "menu" | "character-select" | "game" | "options") => void
}

const characters = [
  {
    id: "bird-1",
    name: "Crypto Bird",
    description: "The classic blockchain bird",
    color: "bg-primary",
    unlocked: true,
  },
  {
    id: "bird-2",
    name: "Stark Eagle",
    description: "Eagle of Stark",
    color: "bg-secondary",
    unlocked: true,
  },
  {
    id: "bird-3",
    name: "DeFi Falcon",
    description: "Falcon of decentralized finance",
    color: "bg-accent",
    unlocked: false,
    requirement: "100 transactions",
  },
  {
    id: "bird-4",
    name: "NFT Phoenix",
    description: "Unique collectible phoenix",
    color: "bg-gradient-to-r from-primary to-secondary",
    unlocked: false,
    requirement: "500 transactions",
  },
]

export function CharacterSelect({ selectedCharacter, onSelectCharacter, onNavigate }: CharacterSelectProps) {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <NavigationHeader title="SELECT CHARACTER" onBack={() => onNavigate("menu")} />

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters.map((character) => (
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
                      <p className="text-xs text-muted-foreground">🔒 Requires: {character.requirement}</p>
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
            Play with {characters.find((c) => c.id === selectedCharacter)?.name}
          </Button>
        </div>
      </div>
    </div>
  )
}
