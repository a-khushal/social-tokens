"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Coins, Users, Lock, TrendingUp } from "lucide-react"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">SocialToken</div>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="#" className="hover:text-gray-300">About</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Features</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Creators</Link></li>
              <li><Link href="#" className="hover:text-gray-300">FAQ</Link></li>
            </ul>
          </nav>
          <ConnectionProvider endpoint={process.env.RPC_URL || "https://api.devnet.solana.com"}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                  <WalletMultiButton/>
                </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 flex-grow">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">Empower Your Community with Social Tokens</h1>
          <p className="text-xl text-gray-400 mb-8">Create, trade, and engage with personalized tokens on our cutting-edge Web3 platform.</p>
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
              <Link href="/creator-registration">Launch as Creator</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-white hover:text-white border-transparent">
              <Link href="/viewer-registration">Join as Fan</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
           <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Coins className="w-8 h-8 mb-2 text-purple-500" />
              <CardTitle className="text-white">Create Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">Launch your own social token and build a tokenized community around your brand.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Users className="w-8 h-8 mb-2 text-purple-500" />
              <CardTitle className="text-white">Engage Fans</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">Offer exclusive perks, content, and experiences to your token holders.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <TrendingUp className="w-8 h-8 mb-2 text-purple-500" />
              <CardTitle className="text-white">Trade & Earn</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">Buy, sell, and trade social tokens on our decentralized marketplace.</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Lock className="w-8 h-8 mb-2 text-purple-500" />
              <CardTitle className="text-white">Secure & Transparent</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">Built on blockchain technology for maximum security and transparency.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">How it works</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Pricing</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Use cases</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">API</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Contact us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">About us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}