"use client"

import { useEffect, useState } from 'react'
import WalletButton from "@/components/WalletConnect";
import { useWallet } from '@solana/wallet-adapter-react'
import { Metadata } from '../dashboard/page'
import { fetchAllContent } from '@/actions/fetchAllContent'
import { UserContentGrid } from '@/components/UserContentGrid'

export default function FanDashboard() {
  const wallet = useWallet();

  const [metadata, setMetadata] = useState<Metadata[]>([])
  useEffect(() => {
    async function main() {
      if(!wallet.publicKey) {
        alert("Connect your wallet")
        return;
      }
      const res = await fetchAllContent()
      
      if(res) {
        setMetadata(res)
      } else {
        setMetadata([])
      }
    }
    main()
  }, [wallet.publicKey])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <div className="container mx-auto p-6 space-y-8">
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Fan Dashboard</h1>
          <div className="flex items-center space-x-4">
            <WalletButton />
          </div>
        </nav>

        <header className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Discover Amazing Content
          </h2>
          
          <p className="text-gray-300">Support your favorite creators and unlock exclusive content</p>
        </header>

        <section>
          <div className='mt-10'>
              <UserContentGrid metadata={metadata}/>
            </div>
        </section>
      </div>
    </div>
  )
}
