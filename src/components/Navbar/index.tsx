'use client'; 
import React, { useState } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';

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
            <img src="/AsOrbit_logo.png" alt="AsOrbit Logo" className="w-36 sm:w-40 h-auto" />
          </Link>
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link href="/" className="block text-white hover:text-blue-200 py-2">Sign Event</Link>
            <Link href="/my-nft" className="text-white hover:text-blue-200 text-sm lg:text-base">MY NFT</Link>
            <Link href="/nft-marketplace" className="text-white hover:text-blue-200 text-sm lg:text-base">NFT Marketplace</Link>
            <Link href="/winning-list" className="text-white hover:text-blue-200 text-sm lg:text-base">Winning List</Link>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button className="bg-white text-blue-900 px-3 py-2 rounded hover:bg-blue-100 text-sm sm:text-base">
              Connect Wallet
            </button>
            <Link href="/register-did" className="bg-blue-300 text-blue-900 px-3 py-2 rounded hover:bg-blue-400 text-sm sm:text-base">
              Register DID
            </Link>
          </div>
          <button onClick={toggleMenu} className="text-white md:hidden">
            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <Link href="/sign-event" className="block text-white hover:text-blue-200 py-2">Sign Event</Link>
            <Link href="/my-nft" className="block text-white hover:text-blue-200 py-2">MY NFT</Link>
            <Link href="/nft-marketplace" className="block text-white hover:text-blue-200 py-2">NFT Marketplace</Link>
            <Link href="/winning-list" className="block text-white hover:text-blue-200 py-2">Winning List</Link>
            <button className="block w-full text-left bg-white text-blue-900 px-3 py-2 rounded hover:bg-blue-100 text-sm sm:text-base mt-2">
              Connect Wallet
            </button>
            <Link href="/register-did" className="block w-full text-left bg-blue-300 text-blue-900 px-3 py-2 rounded hover:bg-blue-400 text-sm sm:text-base mt-2">
              Register DID
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}