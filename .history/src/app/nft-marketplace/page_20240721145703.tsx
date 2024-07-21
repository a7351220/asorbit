'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import { groups, nfts } from '@/data/nft-data';
import NFTGroupLogo from '@/components/NFTGroupLogo';
export default function NFTMarketplace() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">- NFT Marketplace -</h1>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Filters */}
          <div className="w-full md:w-1/4 pr-0 md:pr-4 mb-4 md:mb-0">
            <button
              className="md:hidden w-full bg-blue-500 text-white py-2 px-4 rounded mb-4"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
              <h2 className="font-bold mb-2">Price</h2>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Min"
                  className="border border-gray-300 p-2 w-1/2 text-black"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>to</span>
                <input
                  type="text"
                  placeholder="Max"
                  className="border border-gray-300 p-2 w-1/2 text-black"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <h2 className="font-bold mb-2">Group</h2>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Group"
                  className="border border-gray-300 p-2 w-full text-black"
                  value={searchGroup}
                  onChange={(e) => setSearchGroup(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
              <div className="h-64 overflow-y-auto">
                {groups.map((group) => (
                  <div key={group} className="flex items-center mb-2">
                    <input type="checkbox" id={group} className="mr-2" />
                    <label htmlFor={group} className="text-black">{group}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
                <button className="bg-blue-100 text-blue-900 px-4 py-2 rounded">HOT</button>
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded">New</button>
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded">Boys</button>
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded">Girls</button>
                <select className="border border-gray-300 p-2 text-black">
                  <option>Price</option>
                  {/* 添加更多选项 */}
                </select>
              </div>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Name"
                  className="border border-gray-300 p-2 pr-10 text-black w-full"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {nfts.map((nft) => (
                <div key={nft.id} className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="relative w-full pt-[100%]">
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-2">
                  <div className="flex items-center justify-between">
                      <span className="text-sm">{nft.group}</span>
                      <NFTGroupLogo group={nft.group} />
                    </div>
                    <p className="font-bold">{nft.name}</p>
                    <p className="text-right">{nft.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}