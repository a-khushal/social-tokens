"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import WalletButton from "@/components/WalletConnect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Heart, Coins, Lock, Video, Music, Image } from 'lucide-react'
import { clusterApiUrl, Connection, PublicKey, Keypair, Transaction, sendAndConfirmRawTransaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { createAssociatedTokenAccount, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { accessContent } from '@/actions/contentAccess'

export default function FanDashboard() {
  const [tokenBalance, setTokenBalance] = useState(0)
  const [buyerAccount, setBuyerAccount] = useState<string | null>(null);

  const wallet = useWallet();

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

  const createATA = async (mint: string)  => {
   
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    if (!wallet.connected || !wallet.publicKey) {
      alert("Connect Wallet Please");
      return;
  }

  const feePayer = wallet.publicKey;
  const mintAddress = new PublicKey(mint);

  try {
    
    const ata = await getAssociatedTokenAddress(
        mintAddress, //The mint address of creator
        feePayer    
    );



    // Checking if ATA already exists
    const ataInfo = await connection.getAccountInfo(ata);
    if (ataInfo) {
        console.log(`ATA already exists: ${ata.toBase58()}`);
        setBuyerAccount(ata.toBase58());
        return;
    }

    const { blockhash } = await connection.getLatestBlockhash("confirmed");

    // Create transaction for the ATA
    const transaction = new Transaction({
      feePayer,
      recentBlockhash: blockhash, 
    }).add(
      createAssociatedTokenAccountInstruction(
        feePayer,    // Fee payer
        ata,         
        feePayer,    // Wallet's public key (of owner i guess)
        mintAddress  // Mint address
      )
    );

    if (!wallet.signTransaction) {
      alert("Your wallet does not support transaction signing.");
      return;
  }

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
    });

    console.log(`Transaction sent with signature: ${signature}`);
    setBuyerAccount(ata.toBase58());
    console.log(`ATA created at address: ${ata.toBase58()}`);
    
} catch (error) {
    console.error("Error creating ATA:", error);
    return;
}

  }

  const programId = new PublicKey("6ef4EwS3jZscUryqqZWNvoxJUpgPcLMnjv5MDTjrQiWZ");
  const userTokenAccount = new PublicKey("Ad373pYcsDSr2y43pzy92CEfP3wqh2PzbcGoZu4KDbJy");
  const creatorTokenAccount = new PublicKey("HDjxY6k12eWJEZ9eEwfunaPzo2nsmdXEvtUpCwqbADQk");
  const creatorAccount = new PublicKey("59gE1CgA51imxhy9yhDoGN4frhHR2Hxai7TZ8nM1jJ8X");


  const handleAccess = async () => {
    const connection = new Connection("https://api.devnet.solana.com");
    try {
      const result = await accessContent({
        connection,
        wallet,
        programId,
        userTokenAccount,
        creatorTokenAccount,
        creatorAccount,
      });
      console.log(`Content CID: ${result.ipfs_cid}`);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTokenBalance = async(mint : string) =>{
    const connection = new Connection("https://api.devnet.solana.com");
    if(!wallet.connected || !wallet.publicKey){
      alert("Connect wallet Please");
      return;
    }
    if(!mint){
      alert("No acount exist.");
      return;
    }
    const mintAddress = new PublicKey(mint);
    try{
      const userATA = await getAssociatedTokenAddress(
        mintAddress,
        wallet.publicKey
      );

      const balance = await connection.getTokenAccountBalance(userATA);
      console.log(`Token balance: ${balance.value.amount}`);
      setTokenBalance(Number(balance.value.uiAmount));
      setBuyerAccount(userATA.toBase58());
    } catch(error){
      console.error("Error fetching token balance:", error);
    }
  }

  

  // const handlePurchase = (cost: number) => {
  //   if (tokenBalance >= cost) {
  //     setTokenBalance(tokenBalance - cost)
  //     alert(`Content purchased! Remaining balance: ${tokenBalance - cost} tokens`)
  //   } else {
  //     alert("Insufficient tokens. Please top up your balance.")
  //   }
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <div className="container mx-auto p-6 space-y-8">
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Fan Dashboard</h1>
          <div className="flex items-center space-x-4">
            
            {/* <button onClick={() => fetchTokenBalance("44vVXuohEg629U1dSzWcgpuSDoET4a7xNrtebwZzWzYg")} disabled={!wallet.connected}>
            Check Balance
          </button> */}
            <Button variant="outline" className="bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900">
              Buy Tokens
            </Button>
            <WalletButton />
            <Button onClick={() => createATA("44vVXuohEg629U1dSzWcgpuSDoET4a7xNrtebwZzWzYg")}> Create Token</Button>
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
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:from-yellow-600 hover:to-red-600 transition-colors duration-300" onClick={() => fetchTokenBalance("")}>Check Balance</Button>
                    <span className="text-yellow-400"><Coins className="inline mr-2" />{tokenBalance*1000000000} Tokens</span>
                    {item.isFree || tokenBalance >= {requiredTokens} ? (
                      <a
                      href={`https://gateway.pinata.cloud/ipfs/{ipfshash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block text-center mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors duration-300"
                    >
                      Watch Now
                    </a>
                    ) : (
                      <Button className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:from-yellow-600 hover:to-red-600 transition-colors duration-300" onClick={() => alert("Please buy more tokens to access this content.")}>
                    Buy Tokens
                    </Button>
                    )}
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
