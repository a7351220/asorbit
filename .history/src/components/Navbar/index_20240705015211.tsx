import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-blue-800 p-4 flex justify-between items-center">
      <Link href="/" className="text-white text-2xl font-bold">AsOrbit</Link>
      <div className="flex items-center space-x-4">
        <Link href="/marketplace" className="text-white">NFT Marketplace</Link>
        <Link href="/中著名單" className="text-white">中簽名單</Link>
        <button className="bg-white text-blue-800 px-4 py-2 rounded">Connect Wallet</button>
      </div>
    </nav>
  )
}