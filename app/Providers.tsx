"use client"

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <ConnectionProvider endpoint={process.env.RPC_URL || "https://api.devnet.solana.com"}>
                    <WalletProvider wallets={[]} autoConnect>
                        <WalletModalProvider>
                            {children}
                        </WalletModalProvider>
                    </WalletProvider>
            </ConnectionProvider>
        </SessionProvider>
    )
}