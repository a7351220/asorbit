'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import Navbar from '@/components/Navbar';

const categories = ['All', 'My fav', 'SVT', 'WSN', '已兑换', '+'];

const nfts = [
  { id: 1, name: 'Ateez', group: 'Ateez', image: '/images/nft-images/ateez-logo.jpg' },
  { id: 2, name: 'Ateez', group: 'Ateez', image: '/images/nft-images/ateez-logo.jpg' },
  { id: 3, name: 'Ateez', group: 'Ateez', image: '/images/nft-images/ateez-logo.jpg' },
  { id: 4, name: 'Member 1', group: 'Group A', image: '/images/nft-images/member1.jpg' },
  { id: 5, name: 'Member 2', group: 'Group B', image: '/images/nft-images/member2.jpg' },
  { id: 6, name: 'Member 3', group: 'Group C', image: '/images/nft-images/member3.jpg' },
  { id: 7, name: 'Member 4', group: 'Group A', image: '/images/nft-images/member4.jpg' },
  { id: 8, name: 'Member 5', group: 'Group B', image: '/images/nft-images/member5.jpg' },
  { id: 9, name: 'Member 6', group: 'Group C', image: '/images/nft-images/member6.jpg' },
  { id: 10, name: 'Member 7', group: 'Group A', image: '/images/nft-images/member7.jpg' },
  // 添加更多 NFT...
];

export default function MyNFTPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchName, setSearchName] = useState('');

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">- MY NFT -</h1>

        <div className="flex">
          <div className="w-1/4 pr-4">
            <h2 className="font-bold mb-4">Categories</h2>
            <div className="space-y-2">
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
          <div className="w-3/4">
            <div className="flex justify-end mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search NFT"
                  className="border border-gray-300 p-2 pr-10 text-black"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {nfts.map((nft) => (
                <div key={nft.id} className="border border-gray-300 rounded-lg overflow-hidden">
                  <Image src={nft.image} alt={nft.name} width={200} height={200} objectFit="cover" />
                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{nft.group}</span>
                      <Image src={`/images/group-logos/${nft.group.toLowerCase()}.png`} alt={nft.group} width={20} height={20} />
                    </div>
                    <p className="font-bold">{nft.name}</p>
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