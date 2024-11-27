"use client";

import WalletButton from "@/components/WalletConnect";
import { TokenCreationForm } from "@/components/CreateToken";
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from "react";
import { TokenContentGrid } from "@/components/ContentGrid";
import { fetchParticularContent } from "@/actions/fetchParticularContent";

export interface Metadata {
  tokenName: string,
  tokenSymbol: string,
  description: string,
  mintAddress: string,
  ataForMint: string,
  ipfsHash: string,
  requiredTokens: number
  id: number,
  title: string
}

export default function Component() {
  const wallet = useWallet();
  const [metadata, setMetadata] = useState<Metadata[]>([])

  useEffect(() => {
    async function main() {
      if(!wallet.publicKey) {
        alert("Connect your wallet")
        return;
      }

      const res = await fetchParticularContent({ creatorPublicKey: wallet.publicKey.toBase58()})
      
      if(res) {
        setMetadata(res)
      } else {
        setMetadata([])
      }
      
    }

    main()
  }, [wallet.publicKey])

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
        <div className="container mx-auto p-6 space-y-8">
          <nav className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Creator Dashboard</h1>
            <WalletButton />
          </nav>

          <header className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Welcome Back, Creator!
            </h2>
            <p className="text-gray-300">Manage your content and track your performance</p>
          </header>

          <section className="mb-12">
            <div className="mt-10">
              <TokenContentGrid metadata={metadata}/>
            </div>
          </section>
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6 flex justify-center items-center mt-20">Upload content and mint tokens</h3>
            <TokenCreationForm/>
          </section>
        </div>
      </div>
    </div>
  )
}
