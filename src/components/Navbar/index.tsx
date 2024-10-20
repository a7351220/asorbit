'use client'; 
import React, { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-900 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/AsOrbit_logo.png"
              alt="AsOrbit Logo"
              width={100}
              height={50}
            />
          </Link>
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link href="/" className="block text-white hover:text-blue-200 py-2">Sign Event</Link>
            <Link href="/nft-marketplace" className="text-white hover:text-blue-200 text-sm lg:text-base">NFT Marketplace</Link>
            <Link href="/winning-list" className="text-white hover:text-blue-200 text-sm lg:text-base">Winning List</Link>
            <Link href="/my-nft" className="text-white hover:text-blue-200 text-sm lg:text-base">MY NFT</Link>
          </div>
          <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
            <ConnectButton />
            <Link href="/register-did" className="bg-blue-300 text-blue-900 px-2 py-1 sm:px-3 sm:py-2 rounded hover:bg-blue-400 text-xs sm:text-sm">
              Register DID
            </Link>
          </div>
          <button onClick={toggleMenu} className="text-white md:hidden">
            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <Link href="/" className="block text-white hover:text-blue-200 py-2">Sign Event</Link>
            <Link href="/my-nft" className="block text-white hover:text-blue-200 py-2">MY NFT</Link>
            <Link href="/nft-marketplace" className="block text-white hover:text-blue-200 py-2">NFT Marketplace</Link>
            <Link href="/winning-list" className="block text-white hover:text-blue-200 py-2">Winning List</Link>
            <div className="mt-2">
              <ConnectButton />
            </div>
            <Link href="/register-did" className="block w-full text-left bg-blue-300 text-blue-900 px-2 py-1 rounded hover:bg-blue-400 text-xs mt-2">
              Register DID
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
