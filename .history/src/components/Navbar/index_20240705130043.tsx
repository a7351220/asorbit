import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-blue-900 p-2 flex justify-between items-center">
      <Link href="/" className="flex items-center">
        <Image src="/logo.png" alt="AsOrbit Logo" width={40} height={40} />
        <span className="text-white text-xl font-bold ml-2">AsOrbit</span>
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/marketplace" className="text-white hover:text-blue-200">NFT Marketplace</Link>
        <Link href="/中簽名單" className="text-white hover:text-blue-200">中簽名單</Link>
        <Link href="/cart" className="text-white">
          <Image src="/cart-icon.png" alt="Cart" width={24} height={24} />
        </Link>
        <Link href="/profile" className="text-white">
          <Image src="/profile-icon.png" alt="Profile" width={24} height={24} />
        </Link>
        <button className="bg-white text-blue-900 px-4 py-2 rounded hover:bg-blue-100">Connect Wallet</button>
      </div>
    </nav>
  )
}