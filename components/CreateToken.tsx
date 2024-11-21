"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateToken } from "@/actions/createMint"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Loader } from "lucide-react"
import { handleUploadToPinata } from "@/actions/uploadToPinata"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Token name must be at least 2 characters.",
  }),
  symbol: z
    .string()
    .min(1, { message: "Token symbol is required." })
    .max(10, { message: "Token symbol must not exceed 10 characters." }),
  content: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, { message: "Max file size is 50MB." })
    .refine((file) => !!file, { message: "File is required." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(500, { message: "Description must not exceed 500 characters." }),
  mintAmount: z
    .number()
    .int()
    .positive({ message: "Mint amount must be a positive integer." }),
})

export function TokenCreationForm() {
  const { connection } = useConnection()
  const wallet  = useWallet()
  const [contentName, setContentName] = useState<string | null>(null) 
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      mintAmount: 1,
      content: undefined, 
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(!wallet.publicKey) {
      alert('connect your wallet!')
      return
    }
    setLoading(true)
    const ipfsHash = await handleUploadToPinata(values.content)
    const {mint, ata } = await CreateToken({ connection, wallet, supply: values.mintAmount })
    setLoading(false)
    // toast({
    //   title: "Success",
    //   description: "Your token has been mint and the content has been uploaded successfully",
    // })
    alert(`Mint address: ${mint}\nAssociated token address: ${ata}\nIPFS hash: ${ipfsHash}`)
    window.location.reload()
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setContentName(file.name)
      form.setValue("content", file)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload your content and mint tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Token" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the full name of your token.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="MAT" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the abbreviated symbol for your token (e.g., BTC for Bitcoin).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={() => (
                <FormItem>
                  <FormLabel>Content File</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="video/*,audio/*,image/*,.pdf,.doc,.docx,.txt"
                      onChange={handleContentChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a video, audio, image, or document file associated with your token (optional, max 50MB).
                  </FormDescription>
                  {contentName && (
                    <p className="text-sm text-muted-foreground mt-2">Selected file: {contentName}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your token and its purpose..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of your token and its purpose.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mintAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Tokens to Mint</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      min={1}
                    />
                  </FormControl>
                  <FormDescription>
                    Specify how many tokens you want to mint initially.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {loading ? <Loader className="animate-spin" size={16} /> : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

