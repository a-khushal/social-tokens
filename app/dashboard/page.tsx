"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Video, Music, Plus, Image, BarChart } from "lucide-react"
import WalletButton from "@/components/WalletConnect";
import { TokenCreationForm } from "@/components/CreateToken";


export default function Component() {
  // const [mintAddress, setMintAddress] = useState<string | null>(null);
  // const [creatorTokenAccount, setCreatorTokenAccount] = useState<string | null>(null);
  


  // const connection = new Connection(clusterApiUrl("devnet"), {
  //   commitment: "confirmed",
  // });
  // const payer = Keypair.generate();

  // const generateMintAddress = async () => {


  //   await connection.requestAirdrop(payer.publicKey, 2 * 100);

  //   const mint = await createMint(
  //     connection,
  //     payer,
  //     payer.publicKey,
  //     null,
  //     2
  //   );

  //   setMintAddress(mint.toBase58());
  //   alert(`New Mint Address Created: ${mint.toBase58()}`);
  // };

  //Need to write function if token account is already created or not

  // const createTokenAccount = async () => {
  //   if (!mintAddress) {
  //     alert("Please create a mint address first!");
  //     return;
  //   }


  //   const mint = new PublicKey(mintAddress);

  //   const tokenAccount = await getOrCreateAssociatedTokenAccount(
  //     connection,
  //     payer,
  //     mint,
  //     payer.publicKey
  //   );

  //   setCreatorTokenAccount(tokenAccount.address.toBase58());
  //   alert(`Creator Token Account Created: ${tokenAccount.address.toBase58()}`);
  // };

  // const mintTokens = async () => {
  //   if (!mintAddress || !creatorTokenAccount) {
  //     alert("Please provide both mint address and creator token account.");
  //     return;
  //   }


  //   const mint = new PublicKey(mintAddress);
  //   const tokenAccount = new PublicKey(creatorTokenAccount);

  //   await mintTo(
  //     connection,
  //     payer,
  //     mint,
  //     tokenAccount,
  //     payer.publicKey,
  //     100
  //   );

  //   alert("Minted 100 tokens to creator's token account.");
  // };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
        <div className="container mx-auto p-6 space-y-8">
          <nav className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Creator Dashboard</h1>
            <WalletButton />
            <Input type="search" placeholder="Search Your Content" className="w-64 bg-gray-800 border-purple-500 text-white placeholder-gray-400" />
          </nav>

          <header className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Welcome Back, Creator!
            </h2>
            <p className="text-gray-300">Manage your content and track your performance</p>
          </header>

          <section className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Total Views", icon: BarChart, color: "from-blue-500 to-cyan-500", value: "1.2M" },
              { title: "Subscribers", icon: Plus, color: "from-green-500 to-emerald-500", value: "50K" },
              { title: "Revenue", icon: BarChart, color: "from-yellow-500 to-orange-500", value: "$5,230" }
            ].map((stat) => (
              <Card key={stat.title} className="bg-gray-800 border-0 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className={`bg-gradient-to-br ${stat.color}`}>
                  <CardTitle className="flex items-center justify-between text-white">
                    {stat.title}
                    <stat.icon className="w-6 h-6" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-gray-100">{stat.value}</p>
                  <p className="text-gray-300 mt-2">Last 30 days</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Your Recent Content</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: "Summer Vlog", type: "video", views: "10K" },
                { title: "New Single", type: "audio", plays: "5K" },
                { title: "Photo Series", type: "image", likes: "2K" },
                { title: "Upcoming", type: "draft" }
              ].map((content) => (
                <Card key={content.title} className="bg-gray-800 border-0 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-violet-600 to-indigo-800 rounded-lg flex items-center justify-center mb-4 group-hover:from-violet-500 group-hover:to-indigo-700 transition-colors duration-300">
                      {content.type === "video" && <Video className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                      {content.type === "audio" && <Music className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                      {content.type === "image" && <Image className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300"/>}
                      {content.type === "draft" && <Plus className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-200">{content.title}</span>
                      {content.type !== "draft" ? (
                        <span className="text-sm text-gray-400">{content.views || content.plays || content.likes}</span>
                      ) : (
                        <span className="text-sm text-gray-400">Draft</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          <TokenCreationForm/>
        </div>
      </div>
    </div>
  )
}
