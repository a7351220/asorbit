import Link from 'next/link'
import { FaShoppingCart, FaUser } from 'react-icons/fa'

export default function Navbar() {
  return (
    <nav className="bg-blue-900 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src="https://via.placeholder.com/40" alt="AsOrbit Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-white text-lg sm:text-xl font-bold ml-2">AsOrbit</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link href="/marketplace" className="text-white hover:text-blue-200 text-sm lg:text-base">NFT Marketplace</Link>
            <Link href="/中簽名單" className="text-white hover:text-blue-200 text-sm lg:text-base">中簽名單</Link>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/cart" className="text-white p-2">
              <FaShoppingCart className="w-5 h-5" />
            </Link>
            <Link href="/profile" className="text-white p-2">
              <FaUser className="w-5 h-5" />
            </Link>
            <button className="bg-white text-blue-900 px-3 py-2 rounded hover:bg-blue-100 text-sm sm:text-base">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}