'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';

const groups = ['Aespa', 'AB6IX', 'Apink', 'Astro', 'Ateez', 'Blackpink', 'BOYNEXTDOOR', 'BTOB', 'BTS', 'Cravity', 'Day6', 'EXID', 'Exo', 'Fromis 9', '(G)I-dle'];

const nfts = [
  { id: 1, name: 'mingyu', group: 'SEVENTEEN', price: '0.14 ETH', image: '/images/nft-images/nft-1.jpg' },
  { id: 2, name: 'wonyoung', group: 'IVE', price: '0.11 ETH', image: '/images/nft-images/nft-2.jpg' },
  { id: 3, name: 'V', group: 'BTS', price: '0.21 ETH', image: '/images/nft-images/nft-3.jpg' },
  { id: 4, name: 'winter', group: 'Aespa', price: '0.07 ETH', image: '/images/nft-images/nft-4.jpg' },
  { id: 5, name: 'DK', group: 'SEVENTEEN', price: '0.06 ETH', image: '/images/nft-images/nft-5.jpg' },
  // 添加更多 NFT...
];

export default function NFTMarketplace() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [searchName, setSearchName] = useState('');

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">- NFT Marketplace -</h1>

        <div className="flex">
          <div className="w-1/4 pr-4">
            <h2 className="font-bold mb-2">Price</h2>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                placeholder="Min"
                className="border p-2 w-1/2"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>to</span>
              <input
                type="text"
                placeholder="Max"
                className="border p-2 w-1/2"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <h2 className="font-bold mb-2">Group</h2>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Group"
                className="border p-2 w-full"
                value={searchGroup}
                onChange={(e) => setSearchGroup(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
            <div className="h-64 overflow-y-auto">
              {groups.map((group) => (
                <div key={group} className="flex items-center mb-2">
                  <input type="checkbox" id={group} className="mr-2" />
                  <label htmlFor={group}>{group}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="w-3/4">
            <div className="flex justify-between mb-4">
              <div className="flex space-x-2">
                <button className="bg-blue-100 text-blue-900 px-4 py-2 rounded">HOT</button>
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded">New</button>
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded">Boys</button>
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded">Girls</button>
                <select className="border p-2">
                  <option>Price</option>
                  {/* 添加更多选项 */}
                </select>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Name"
                  className="border p-2 pr-10"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {nfts.map((nft) => (
                <div key={nft.id} className="border rounded-lg overflow-hidden">
                  <Image src={nft.image} alt={nft.name} width={200} height={200} objectFit="cover" />
                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <span>{nft.group}</span>
                      <Image src={`/images/group-logos/${nft.group.toLowerCase()}.png`} alt={nft.group} width={20} height={20} />
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