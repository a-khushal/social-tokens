"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Heart, Coins, Lock, Video, Music, Image } from 'lucide-react'

export default function FanDashboard() {
  const [tokenBalance, setTokenBalance] = useState(100)

  const creators = [
    { name: "Alex", avatar: "/placeholder.svg?height=40&width=40", category: "Music" },
    { name: "Sam", avatar: "/placeholder.svg?height=40&width=40", category: "Video" },
    { name: "Jordan", avatar: "/placeholder.svg?height=40&width=40", category: "Art" },
  ]

  const content = [
    { title: "Summer Beats", creator: "Alex", type: "audio", cost: 5, isFree: false },
    { title: "City Timelapse", creator: "Sam", type: "video", cost: 10, isFree: false },
    { title: "Abstract Series", creator: "Jordan", type: "image", cost: 0, isFree: true },
    { title: "Acoustic Session", creator: "Alex", type: "audio", cost: 0, isFree: true },
    { title: "Travel Vlog", creator: "Sam", type: "video", cost: 15, isFree: false },
    { title: "Digital Paintings", creator: "Jordan", type: "image", cost: 8, isFree: false },
  ]

  const handlePurchase = (cost: number) => {
    if (tokenBalance >= cost) {
      setTokenBalance(tokenBalance - cost)
      alert(`Content purchased! Remaining balance: ${tokenBalance - cost} tokens`)
    } else {
      alert("Insufficient tokens. Please top up your balance.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <div className="container mx-auto p-6 space-y-8">
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Fan Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-yellow-400"><Coins className="inline mr-2" />{tokenBalance} Tokens</span>
            <Button variant="outline" className="bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900">
              Buy Tokens
            </Button>
          </div>
        </nav>

        <header className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Discover Amazing Content
          </h2>
          <p className="text-gray-300">Support your favorite creators and unlock exclusive content</p>
        </header>

        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Your Favorite Creators</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {creators.map((creator) => (
              <Card key={creator.name} className="bg-gray-800 border-0 flex-shrink-0">
                <CardContent className="p-4 flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>{creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{creator.name}</h4>
                    <p className="text-sm text-gray-400">{creator.category}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="all" className="rounded-md">All Content</TabsTrigger>
            <TabsTrigger value="free" className="rounded-md">Free</TabsTrigger>
            <TabsTrigger value="premium" className="rounded-md">Premium</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <Card key={item.title} className="bg-gray-800 border-0 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-violet-600 to-indigo-800 rounded-lg flex items-center justify-center mb-4 group-hover:from-violet-500 group-hover:to-indigo-700 transition-colors duration-300">
                      {item.type === "video" && <Video className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                      {item.type === "audio" && <Music className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                      {item.type === "image" && <Image className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-200">{item.title}</span>
                      {item.isFree ? (
                        <Badge variant="secondary" className="bg-green-500 text-white">Free</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-500 text-gray-900">{item.cost} Tokens</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-4">By {item.creator}</p>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors duration-300" onClick={() => item.isFree ? alert("Enjoy the free content!") : handlePurchase(item.cost)}>
                      {item.isFree ? "Watch Now" : "Purchase"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="free">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.filter(item => item.isFree).map((item) => (
                <Card key={item.title} className="bg-gray-800 border-0 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-violet-600 to-indigo-800 rounded-lg flex items-center justify-center mb-4 group-hover:from-violet-500 group-hover:to-indigo-700 transition-colors duration-300">
                      {item.type === "video" && <Video className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                      {item.type === "audio" && <Music className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                      {item.type === "image" && <Image className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-200">{item.title}</span>
                      <Badge variant="secondary" className="bg-green-500 text-white">Free</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">By {item.creator}</p>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors duration-300" onClick={() => alert("Enjoy the free content!")}>
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="premium">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.filter(item => !item.isFree).map((item) => (
                <Card key={item.title} className="bg-gray-800 border-0 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-violet-600 to-indigo-800 rounded-lg flex items-center justify-center mb-4 group-hover:from-violet-500 group-hover:to-indigo-700 transition-colors duration-300">
                      {item.type === "video" && <Video className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                      {item.type === "audio" && <Music className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                      {item.type === "image" && <Image className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-200">{item.title}</span>
                      <Badge variant="secondary" className="bg-yellow-500 text-gray-900">{item.cost} Tokens</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">By {item.creator}</p>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors duration-300" onClick={() => handlePurchase(item.cost)}>
                      Purchase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}