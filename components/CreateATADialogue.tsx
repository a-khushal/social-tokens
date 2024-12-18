import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token'
import { WalletContextState } from '@solana/wallet-adapter-react'
import showInterestToDB from '@/actions/showInterestToDB'

export const createATA = async ({
    mint,
    connection,
    wallet,
  }: {
    mint: string;
    connection: Connection;
    wallet: WalletContextState;
  }): Promise<string | undefined> => {
    if (!wallet.connected || !wallet.publicKey) {
      return;
    }
  
    const feePayer = wallet.publicKey;
    const mintAddress = new PublicKey(mint);
  
    try {
      const ata = await getAssociatedTokenAddress(
        mintAddress,
        feePayer 
      )

      const { blockhash } = await connection.getLatestBlockhash("confirmed");

      console.log(blockhash)
  
      const transaction = new Transaction({
        feePayer,
        recentBlockhash: blockhash,
      }).add(
        createAssociatedTokenAccountInstruction(
          feePayer, 
          ata, 
          feePayer, 
          mintAddress
        )
      );
  
      if (!wallet.signTransaction) {
        alert("Your wallet does not support transaction signing.");
        return;
      }
  
      const signedTransaction = await wallet.signTransaction(transaction);
      await connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        }
      );

      console.log(`ATA created at address: ${ata.toBase58()}`);
      return ata.toBase58();
    } catch (error) {
      console.error("Error creating ATA:", error);
      alert(`Failed to create ATA: ${error}`);
    }
}

interface CreateATADialogProps {
  isOpen: boolean
  onClose: () => void
  tokenName: string
  mint: string
  wallet: WalletContextState
  connection: Connection,
  ataForMint: string
}

export function CreateATADialog({ isOpen, onClose, tokenName, mint, wallet, connection, ataForMint }: CreateATADialogProps) {
  const [isCreating, setIsCreating] = useState(false)

  const handleConfirm = async () => {
    setIsCreating(true)
    try {
      const ata = await createATA({ mint, wallet, connection })
      if(ata) {
        showInterestToDB({ mint, creatorATA: ataForMint, userATA: ata })
      }
      alert(`Your ATA: ${ata}`)
      onClose()
    } catch (error) {
      console.error('Failed to create ATA:', error)
    } finally {
      setIsCreating(false)
      window.location.reload()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Create Associated Token Account</DialogTitle>
            <DialogDescription>
                Do you want to create an Associated Token Account for `{tokenName}`? (has gas fees)
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create ATA'}
            </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}

