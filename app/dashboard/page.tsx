import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Play, Coins } from "lucide-react"

export default function Component() {
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
          <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <Button className="w-full">Upload Content</Button>
        </CardContent>
      </Card>
    </div>
  )
}