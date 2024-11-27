import {
    Connection,
    PublicKey,
    Transaction
  } from "@solana/web3.js";
  import { deserializeContentAccess } from "@/lib/utils";
  import { TOKEN_PROGRAM_ID, getAccount, createTransferInstruction } from "@solana/spl-token";
  import { WalletContextState } from "@solana/wallet-adapter-react";
  
  export async function accessContent({
    connection,
    wallet,
    userTokenAccount,
    creatorTokenAccount,
    creatorAccount,
  }: {
    connection: Connection;
    wallet: WalletContextState;
    programId: PublicKey;
    userTokenAccount: PublicKey;
    creatorTokenAccount: PublicKey;
    creatorAccount: PublicKey;
  }) {
    if (!wallet.publicKey) {
      throw new Error("Wallet not connected!");
    }
  
    // Fetch the user's token balance
    const tokenAccountInfo = await getAccount(connection, userTokenAccount);
    const userBalance = Number(tokenAccountInfo.amount);
  
    console.log(`User Token Balance: ${userBalance}`);
  
    // Fetch content access requirements from the creator account
    const creatorAccountInfo = await connection.getAccountInfo(creatorAccount);
    if (!creatorAccountInfo) {
      throw new Error("Creator account not found");
    }
  
    const contentAccess = deserializeContentAccess(creatorAccountInfo.data);
    //const contentAccess = Buffer.from(contentAcces);

    const { ipfs_cid, required_tokens } = contentAccess;
  
    console.log(`Content CID: ${ipfs_cid}, Required Tokens: ${required_tokens}`);
  
    // Verify token balance
    if (userBalance < required_tokens) {
      throw new Error("Insufficient token balance to access content.");
    }
  
    // Create a transaction for accessing content (token transfer)
    const transaction = new Transaction();
  
    const transferInstruction = createTransferInstruction(
      userTokenAccount, // Source account
      creatorTokenAccount, // Destination account
      wallet.publicKey, // Owner of the source account
      required_tokens, // Amount to transfer
      [], // Signers
      TOKEN_PROGRAM_ID
    );
  
    transaction.add(transferInstruction);
  
    // Send transaction
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
  
    const signature = await wallet.sendTransaction(transaction, connection);
    console.log(`Transaction sent: ${signature}`);
  
    // Wait for confirmation
    await connection.confirmTransaction(signature);
  
    console.log(`Content Access Granted. View content at IPFS: ${ipfs_cid}`);
  
    return { ipfs_cid, signature };
  }
  