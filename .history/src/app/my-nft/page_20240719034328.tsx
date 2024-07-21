'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Navbar from '@/components/Navbar';

// 定义 NFT 对象的接口
interface NFT {
  id: number;
  name: string;
  group: string;
  image: string;
}

const categories: string[] = ['All', 'My fav', 'SVT', 'WSN', '已兑换', '+'];

const nfts: NFT[] = [
  { id: 1, name: 'WJSN Bona - As You Wish #95819', group: 'WJSN', image: '/images/nft-images/bona.jpg' },
  // ... 其他 NFT
];

// 定义 NFTDetailModal 的属性类型
interface NFTDetailModalProps {
  nft: NFT | null;
  isOpen: boolean;
  onClose: () => void;
}

const NFTDetailModal: React.FC<NFTDetailModalProps> = ({ nft, isOpen, onClose }) => {
  if (!isOpen || !nft) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{nft.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="flex">
          <div className="w-1/2 pr-4">
            <Image src={nft.image} alt={nft.name} width={300} height={300} objectFit="cover" className="rounded-lg" />
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="mb-4">
              <h3 className="font-bold mb-2">出售</h3>
              <div className="space-y-2">
                <input type="text" placeholder="设定金额" className="border p-2 w-full" />
                <input type="text" placeholder="備註" className="border p-2 w-full" />
                <div className="flex items-center">
                  <span className="mr-2">截止販售日期</span>
                  <input type="date" className="border p-2" />
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">确认出售</button>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2">兑换</h3>
              <div className="space-y-2">
                <input type="text" placeholder="收件人姓名" className="border p-2 w-full" />
                <input type="text" placeholder="寄送地址" className="border p-2 w-full" />
                <button className="bg-yellow-500 text-white px-4 py-2 rounded w-full">兑换实体</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyNFTPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchName, setSearchName] = useState<string>('');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft);
  };

  const closeModal = () => {
    setSelectedNFT(null);
  };

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
                <div key={nft.id} className="border border-gray-300 rounded-lg overflow-hidden cursor-pointer" onClick={() => handleNFTClick(nft)}>
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
      <NFTDetailModal nft={selectedNFT} isOpen={!!selectedNFT} onClose={closeModal} />
    </div>
  );
};

export default MyNFTPage;