"use client"

import Link from 'next/link'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Copy, ImageIcon } from 'lucide-react'
import { Metadata } from '@/app/dashboard/page'
import { useCallback, useEffect, useState } from 'react'
import fetchInterested from '@/actions/fetchInterested'
import { Button } from './ui/button'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js'
import { createTransferInstruction, getAccount } from '@solana/spl-token';

export interface Content extends Metadata {
    imageClickUrl: string
}

export function ContentCard({ content }: {
    content: Content
}) {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [interestedATAs, setInterestedATAs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);
  const [balance, setBalance] = useState<number>()

  const tokenTransfer = async (
    creatorATA: string,
    buyerAccounts: string[],
    requiredToken: number,
  ) => {
    setIsTransferring(true)
    const cATA = new PublicKey(creatorATA)
  
    if (buyerAccounts.length === 0) {
      alert("Please provide at least one buyer account.");
      return;
    }
  
    const walletPublicKey = wallet.publicKey;
  
    if (!walletPublicKey) {
      throw new Error("Wallet is not connected.");
    }
  
    const destinationAccountInfo = await connection.getAccountInfo(cATA);
    if (!destinationAccountInfo) {
      throw new Error("Destination ATA does not exist or is not valid.");
    }
    
    const totalAmountToTransfer = requiredToken * buyerAccounts.length;

    if (balance && totalAmountToTransfer > balance) {
      alert(`Insufficient balance. You need at least ${totalAmountToTransfer} tokens.`)
      return;
    }

    const { blockhash } = await connection.getLatestBlockhash("confirmed");
  
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: walletPublicKey,
    });
  
    for (let i = 0; i < buyerAccounts.length; i++) {
      const bATA = new PublicKey(buyerAccounts[i]);
  
      const sourceAccountInfo = await connection.getAccountInfo(bATA);
      if (!sourceAccountInfo) {
        console.error(`Buyer ATA ${bATA.toString()} does not exist or is not valid.`);
        continue;
      }
  
      const transferInstruction = createTransferInstruction(
        cATA,
        bATA, 
        walletPublicKey, 
        requiredToken * LAMPORTS_PER_SOL, 
        [] 
      );
  
      transaction.add(transferInstruction);
    }
  
    if (!wallet.signTransaction) {
      alert("Your wallet does not support transaction signing.");
      return;
    }

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });
  
    console.log(`Transaction sent with signature for transferring tokens: ${signature}`);
    setIsTransferring(false)
    alert('transfered tokens')
    window.location.reload()
  };  

  useEffect(() => {
    const main = async () => {
      try {
        const data = await fetchInterested()
        
        if (data.groupedData) {
          const matchingGroup = data.groupedData.find(
            (group) =>
              group.mintAddress === content.mintAddress &&
              group.creatorATA === content.ataForMint
          );

          if (matchingGroup) {
            setInterestedATAs(matchingGroup.userATAs);
          }
        }
      } catch (error) {
        console.error("Error fetching interested ATAs:", error);
      } finally {
        setIsLoading(false)
      }
    }

    main()

    const getATABalance = async () => {
      const ataPubKey = new PublicKey(content.ataForMint)
      const tokenAccountInfo = await getAccount(connection, ataPubKey)
      const tokenBalance = Number(tokenAccountInfo.amount)
      const tokenBalanceFormatted = tokenBalance / Math.pow(10, 9)
      setBalance(tokenBalanceFormatted)
    }

    getATABalance()
  }, [content.mintAddress, content.ataForMint, connection]);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="p-4 flex-grow">
        <div>{}</div>
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
            <div className="col-span-1 my-3">
              <dt className="font-medium text-gray-500 dark:text-gray-400">Required Tokens</dt>
              <dd className="text-gray-900 dark:text-gray-100">
                <Badge variant="secondary" className="mt-1">{content.requiredTokens}</Badge>
              </dd>
            </div>
            <div className='col-span-1 my-3'>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Token balance</dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  <Badge variant="secondary" className="mt-1">{balance}</Badge>
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
          <Card className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Interested ATAs</h4>
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading ATAs...</p>
            ) : (
              <ul className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {interestedATAs.length > 0 ? (
                  interestedATAs.map((ata, index) => (
                    <li key={index} className="overflow-hidden">
                      <CopyToClipboard text={ata} />
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No ATAs found.</p>
                )}
              </ul>
            )}
            <Button
              onClick={() => tokenTransfer(
                content.ataForMint,
                interestedATAs,
                content.requiredTokens
              )}
              disabled={isTransferring || isLoading || interestedATAs.length === 0}
              className="w-full"
            >
              {isTransferring ? "Transferring..." : "Transfer Tokens"}
            </Button>
          </Card>
        </div>
      </CardFooter>
    </Card>
  )
}

export function CopyToClipboard({ text }: { text: string }) {
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

