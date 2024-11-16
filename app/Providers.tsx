"use client";

import { SessionProvider } from "next-auth/react";
import { WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export default function Providers({ children }: { children: React.ReactNode }) {
   
    //const endpoint = useMemo(() => "https://api.devnet.solana.com", []);

    //const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <SessionProvider>
            <ConnectionProvider endpoint={process.env.RPC_URL || "https://api.devnet.solana.com"}>
                    <WalletProvider wallets={[]}>
                        <WalletModalProvider>
                            {children}
                        </WalletModalProvider>
                    </WalletProvider>
            </ConnectionProvider>
        </SessionProvider>
    )
}
