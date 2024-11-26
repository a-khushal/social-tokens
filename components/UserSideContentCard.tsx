"use client"

import Link from 'next/link'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { CreateATADialog } from './CreateATADialogue'
import { Content, CopyToClipboard } from './ContentCard'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

export function UserSideContentCard({ content }: {
    content: Content
}) {
    const wallet = useWallet()
    const { connection } = useConnection()
    // const [userATA, setUserATA] = useState<string | undefined>("") 

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // useEffect(() => {
    //     async function main() {
    //         const ata = await createATA({ mint: content.mintAddress, connection, wallet})
    //         setUserATA(ata)
    //     }

    //     main()
    // }, [connection, wallet, content])

    const handleShowInterest = async () => {
        setIsDialogOpen(true)
    }

    return (
        <Card className="w-full h-full flex flex-col">
            <CardContent className="p-4 flex-grow">
            <Link href={""} className="aspect-video relative mb-2 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
            </Link>
            <h3 className="text-lg font-semibold mb-1 mt-3">{content.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{content.description}</p>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4 rounded-b-lg">
            <div className="w-full">
                <h4 className="text-sm font-semibold mb-2">Token Metadata</h4>
                <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Name</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{content.tokenName}</dd>
                </div>
                <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Symbol</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{content.tokenSymbol}</dd>
                </div>
                <div className="col-span-2 my-3">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Required Tokens</dt>
                    <dd className="text-gray-900 dark:text-gray-100">
                    <Badge variant="secondary" className="mt-1">{content.requiredTokens}</Badge>
                    </dd>
                </div>
                <div className="col-span-2">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Mint Address</dt>
                    <CopyToClipboard text={content.mintAddress} />
                </div>
                <div className="col-span-2 mt-2">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Creator ATA</dt>
                    <CopyToClipboard text={content.ataForMint} />
                </div>
                {/* <div className="col-span-2 mt-2">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Your ATA</dt>
                    <CopyToClipboard text={content.ataForMint} />
                </div> */}
                </dl>
                <div className="mt-4">
                    {content.requiredTokens === 0 ? (
                        <Button className="w-full" asChild>
                        <Link href={content.imageClickUrl} target="_blank">Watch for Free</Link>
                        </Button>
                    ) : (
                        <Button className="w-full" onClick={handleShowInterest}>
                        Show Interest
                        </Button>
                    )}
                </div>
            </div>
            </CardFooter>
            <CreateATADialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                tokenName={content.tokenName}
                mint={content.mintAddress}
                wallet={wallet}
                connection={connection}
                ataForMint={content.ataForMint}
            />
        </Card>
    )
}