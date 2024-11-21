import { Link } from "lucide-react";
import WalletButton from "./WalletConnect";

export default function Appbar() {
    return (
        <>
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
            <header className="border-b border-gray-800">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold">SocialToken</div>
                <nav>
                    <ul className="flex space-x-4">
                    <li><Link href="#" className="hover:text-gray-300">About</Link></li>
                    <li><Link href="#" className="hover:text-gray-300">Features</Link></li>
                    <li><Link href="#" className="hover:text-gray-300">Creators</Link></li>
                    <li><Link href="#" className="hover:text-gray-300">FAQ</Link></li>
                    </ul>
                </nav>
                <WalletButton/>
                </div>
            </header>
        </div>
        </>
    )
}