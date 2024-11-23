"use client"

import Link from 'next/link'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Copy, ImageIcon } from 'lucide-react'
import { Metadata } from '@/app/dashboard/page'
import { useCallback, useState } from 'react'

interface Content extends Metadata {
    imageClickUrl: string
}

export function ContentCard({ content }: {
    content: Content
}) {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="p-4 flex-grow">
        <Link target='_blank' href={content.imageClickUrl} className="aspect-video relative mb-2 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-400" />
        </Link>
        <p className='text-sm font-thin'>(click the above image to view the content)</p>
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
              <dt className="font-medium text-gray-500 dark:text-gray-400">ATA</dt>
              <CopyToClipboard text={content.ataForMint} />
            </div>
          </dl>
        </div>
      </CardFooter>
    </Card>
  )
}

function CopyToClipboard({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)
  
    const copyToClipboard = useCallback(() => {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1000) 
        },
        (err) => {
          console.error('Failed to copy text: ', err)
        }
      )
    }, [text])
  
    return (
      <button
        onClick={copyToClipboard}
        className="group inline-flex items-center justify-between w-full text-sm"
        aria-label={copied ? "Copied" : "Copy to clipboard"}
      >
        <span className="truncate text-gray-900 dark:text-gray-100">{text}</span>
        <span className="ml-2 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </span>
      </button>
    )
  }

