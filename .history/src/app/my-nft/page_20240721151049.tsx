'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import { Input } from "@/components/ui/input";
import NFTDetailModal from "@/components/NFTDetailModal";
import { NFT, nfts as sharedNfts } from "@/data/nft-data";
import NFTGroupLogo from '@/components/NFTGroupLogo';

const categories: string[] = ['All', 'My fav', 'SVT', 'WSN', '+'];

const MyNFTPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchName, setSearchName] = useState<string>('');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft);
  };

  const closeModal = () => {
    setSelectedNFT(null);
  };

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">- MY NFT -</h1>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 pr-0 md:pr-4 mb-4 md:mb-0">
            <div className="flex justify-between items-center md:block">
              <h2 className="font-bold mb-2 md:mb-4">Categories</h2>
              <button 
                className="md:hidden bg-blue-500 text-white px-2 py-1 rounded"
                onClick={toggleCategoryMenu}
              >
                {isCategoryMenuOpen ? 'Close' : 'Open'}
              </button>
            </div>
            <div className={`space-y-2 ${isCategoryMenuOpen ? 'block' : 'hidden'} md:block`}>
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="radio"
                    id={category}
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="mr-2"
                  />
                  <label htmlFor={category} className="text-black">{category}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-3/4">
            <div className="flex justify-end mb-4">
              <div className="relative w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search NFT"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pr-10 w-full"
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sharedNfts.map((nft) => (
                <div key={nft.id} className="nft-card" onClick={() => handleNFTClick(nft)}>
                  <div className="nft-card-image">
                    <Image src={nft.image} alt={nft.name} layout="fill" objectFit="cover" />
                  </div>
                  <div className="nft-card-content">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{nft.group}</span>
                      <NFTGroupLogo group={nft.group} />
                    </div>
                    <p className="nft-card-name">{nft.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <NFTDetailModal nft={selectedNFT} isOpen={!!selectedNFT} onClose={closeModal} />
    </div>
  );
};

export default MyNFTPage;