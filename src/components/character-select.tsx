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
    name: "Cavos Bird",
    description: "The classic Cavos bird",
    color: "bg-primary",
    unlocked: true,
    image: "/CavosLogo.png",
  },
  {
    id: "bird-2",
    name: "Starknet Bird",
    description: "Bird of Starknet",
    color: "bg-secondary",
    unlocked: true,
    image: "/favicon.png",
  },
  {
    id: "bird-3",
    name: "Shark Pepe",
    description: "The fierce Shark Pepe",
    color: "bg-accent",
    unlocked: true,
    image: "/SharkPepe.png",
  },
  {
    id: "bird-4",
    name: "Mr. Quack",
    description: "The legendary Mr. Quack",
    color: "bg-gradient-to-r from-primary to-secondary",
    unlocked: true,
    image: "/MrQuack.png",
  },
]

export function CharacterSelect({ selectedCharacter, onSelectCharacter, onNavigate }: CharacterSelectProps) {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <NavigationHeader title="SELECT CHARACTER" onBack={() => onNavigate("menu")} />

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters.map((character) => (
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
                    className={`w-24 h-24 rounded-full ${character.color} flex items-center justify-center relative overflow-hidden`}
                  >
                    {character.image ? (
                      <img 
                        src={character.image} 
                        alt={character.name}
                        className="w-full h-full object-contain"
                        style={{ 
                          imageRendering: 'pixelated',
                          imageRendering: '-moz-crisp-edges',
                          imageRendering: 'crisp-edges'
                        }}
                      />
                    ) : (
                      <div className="text-4xl">🐦</div>
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
                    <div className="mt-3 p-2 bg-gray-100 rounded-lg">
                      <p className="text-xs text-gray-600">🔒 Requires: {character.requirement}</p>
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
          <Button onClick={() => onNavigate("game")} className="px-8 py-3 text-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
            Play with {characters.find((c) => c.id === selectedCharacter)?.name}
          </Button>
        </div>
      </div>
    </div>
  )
}
