"use client";

import { SessionProvider } from "next-auth/react";
import { WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
// import { useMemo } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
   
    // const endpoint = useMemo(() => "https://api.devnet.solana.com", []);

    // const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!

    return (
        <SessionProvider>
            <ConnectionProvider endpoint={RPC_URL}>
                    <WalletProvider wallets={[]}>
                        <WalletModalProvider>
                            {children}
                        </WalletModalProvider>
                    </WalletProvider>
            </ConnectionProvider>
        </SessionProvider>
    )
}
