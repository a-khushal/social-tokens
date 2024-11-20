"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Play, Coins } from "lucide-react"
import axios from "axios";
import { useState } from "react";
import { clusterApiUrl, PublicKey, Connection, Transaction, Keypair } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";


export default function Component() {
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [creatorTokenAccount, setCreatorTokenAccount] = useState<string | null>(null);
  const uploadToPinata = async(file: File) => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const formData = new FormData();
    formData.append('file', file);

    const apiKey = "69bc12652fdfb42f5345";
    const apiSecret = "ac09c873b88cd24fc25695e8c93628a2a4a255bd25722301d40d4cba19310e11";

    try{
      const response = await axios.post(url, formData, {
        maxContentLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data`,
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      });
      console.log("Uploaded to Pinata:", response.data);
      return response.data.IpfsHash;
    }catch(error){
      console.error("Error uploading to Pinata:", error);
      throw error;
    }
  };

  
  const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
  });
  const payer = Keypair.generate();

  const generateMintAddress = async () => {
    

    await connection.requestAirdrop(payer.publicKey, 2*100);

    const mint = await createMint(
      connection,
      payer,
      payer.publicKey,
      null,
      2
    );

    setMintAddress(mint.toBase58());
    alert(`New Mint Address Created: ${mint.toBase58()}`);
  };

  //Need to write function if token account is already created or not

  const createTokenAccount = async() => {
    if(!mintAddress){
      alert("Please create a mint address first!");
      return;
    }

    
    const mint = new PublicKey(mintAddress);

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );

    setCreatorTokenAccount(tokenAccount.address.toBase58());
    alert(`Creator Token Account Created: ${tokenAccount.address.toBase58()}`);
  };

  const mintTokens = async () => {
    if(!mintAddress || !creatorTokenAccount){
      alert("Please provide both mint address and creator token account.");
      return;
    }

    
    const mint = new PublicKey(mintAddress);
    const tokenAccount = new PublicKey(creatorTokenAccount);

    await mintTo(
      connection,
      payer,
      mint,
      tokenAccount,
      payer.publicKey,
      100
    );

    alert("Minted 100 tokens to creator's token account.");
  };

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async() =>{
    if(!file){
    alert("Please select a file to Upload!");
    return;
    }
    try{
    const ipfsHash = await uploadToPinata(file);
    alert(`Content uploaded! IPFS Hash: ${ipfsHash}`);
    }catch(error){
    alert("Failed to upload conetnt.");
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="max-w-xl mx-auto">
        <Input type="search" placeholder="Search" className="w-full" />
      </div>
      
      <h1 className="text-2xl font-semibold text-center">Welcome Creator!</h1>
      
      <div className="grid md:grid-cols-3 gap-4">
        {["X", "Y", "Z"].map((creator, index) => (
          <Card key={creator}>
            <CardHeader>
              <CardTitle>Creator {creator}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                Content {index + 1}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Videos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3].map((video) => (
            <Card key={video}>
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-2">
                  <Play className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Video {video}</span>
                  <Coins className="w-5 h-5 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardContent className="p-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-2">
                <Play className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Video 4</span>
                <span className="text-sm text-muted-foreground">No token</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Mint token to corresponding content</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">

        <div>
          <Button onClick={generateMintAddress}>Generate Mint Address</Button>
          <Button onClick={createTokenAccount}>Create Token Account</Button>
          <Button onClick={mintTokens}>Mint Tokens</Button>
        </div> 
        <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
        />
          <Button className="w-full" onClick={handleUpload}>Upload Content</Button>
        </CardContent>
      </Card>
    </div>
  )
}