"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Video, Music, Plus, Image, BarChart } from "lucide-react"
import axios from "axios";
import { useState } from "react";

export default function Component() {
  const uploadToPinata = async (file: File) => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const formData = new FormData();
    formData.append('file', file);

    const apiKey = "69bc12652fdfb42f5345";
    const apiSecret = "ac09c873b88cd24fc25695e8c93628a2a4a255bd25722301d40d4cba19310e11";

    try {
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
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw error;
    }
  };

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to Upload!");
      return;
    }
    try {
      const ipfsHash = await uploadToPinata(file);
      alert(`Content uploaded! IPFS Hash: ${ipfsHash}`);
    } catch (error) {
      console.log(error)
      alert("Failed to upload conetnt.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <div className="container mx-auto p-6 space-y-8">
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Creator Dashboard</h1>
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
                    {content.type === "image" && <Image className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity duration-300" />}
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

        <Card className="max-w-md mx-auto bg-gray-800 border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Upload New Content
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-full bg-gray-700 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-600 transition-colors duration-300">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <span className="text-gray-300">Choose file to upload</span>
              </label>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors duration-300" onClick={handleUpload}>
              Upload Content
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

  )
}
