
import { Connection, Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import { WalletContextState } from "@solana/wallet-adapter-react"
import { createAssociatedTokenAccountInstruction, createInitializeMint2Instruction, createMintToInstruction, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token"

export async function CreateToken({ connection, wallet, supply }: {
  connection: Connection,
  wallet: WalletContextState,
  supply: number
}) {
  const mintKeypair = Keypair.generate()
  const lamports = await getMinimumBalanceForRentExemptMint(connection)
  const tokensToMint = supply * 1000000000

  const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
    mintKeypair.publicKey!,
    wallet.publicKey!,
    false,
    TOKEN_PROGRAM_ID
  )

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey!,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMint2Instruction(mintKeypair.publicKey, 9, wallet.publicKey!, wallet.publicKey, TOKEN_PROGRAM_ID),
    createAssociatedTokenAccountInstruction(
      wallet.publicKey!,
      associatedTokenAccountAddress,
      wallet.publicKey!,
      mintKeypair.publicKey,
      TOKEN_PROGRAM_ID,
    ),
    createMintToInstruction(mintKeypair.publicKey, associatedTokenAccountAddress, wallet.publicKey!, tokensToMint, [], TOKEN_PROGRAM_ID) 
  )

  transaction.feePayer = wallet.publicKey!
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.partialSign(mintKeypair);

  await wallet.sendTransaction(transaction, connection);
  console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);  
  console.log(`ATA: ${associatedTokenAccountAddress.toBase58()}`); 

  return {
    mint: mintKeypair.publicKey.toBase58(),
    ata: associatedTokenAccountAddress.toBase58()
  }
}