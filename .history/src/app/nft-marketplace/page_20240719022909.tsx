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
  // Add more NFTs here...
];

export default function NFTMarketplace() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [searchName, setSearchName] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">- NFT Marketplace -</h1>

        <div className="flex flex-col md:flex-row mb-8">
          <div className="w-full md:w-1/4 pr-0 md:pr-4 mb-4 md:mb-0">
            <h2 className="font-bold mb-2">Price</h2>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="number"
                placeholder="Min"
                className="border bg-blue-800 border-blue-700 p-2 w-1/2 text-white placeholder-blue-300"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                className="border bg-blue-800 border-blue-700 p-2 w-1/2 text-white placeholder-blue-300"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <h2 className="font-bold mb-2">Group</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Group"
                className="border bg-blue-800 border-blue-700 p-2 w-full mb-2 text-white placeholder-blue-300"
                value={searchGroup}
                onChange={(e) => setSearchGroup(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-blue-300" />
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
          <div className="w-full md:w-3/4">
            <div className="flex flex-wrap justify-between mb-4">
              <div className="flex flex-wrap space-x-2 mb-2">
                <button className="bg-blue-700 text-white px-4 py-2 rounded">HOT</button>
                <button className="bg-blue-800 text-white px-4 py-2 rounded">New</button>
                <button className="bg-blue-800 text-white px-4 py-2 rounded">Boys</button>
                <button className="bg-blue-800 text-white px-4 py-2 rounded">Girls</button>
                <select className="bg-blue-800 border border-blue-700 text-white p-2 rounded">
                  <option>Price</option>
                  {/* Add more options here */}
                </select>
              </div>
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Name"
                  className="border bg-blue-800 border-blue-700 p-2 pr-10 w-full text-white placeholder-blue-300"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-3 text-blue-300" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {nfts.map((nft) => (
                <div key={nft.id} className="bg-blue-800 border border-blue-700 rounded-lg overflow-hidden shadow-lg">
                  <Image src={nft.image} alt={nft.name} width={200} height={200} objectFit="cover" />
                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{nft.group}</span>
                      <Image src="/images/group-logo.png" alt={nft.group} width={20} height={20} />
                    </div>
                    <p className="font-bold">{nft.name}</p>
                    <p className="text-right text-blue-300">{nft.price}</p>
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