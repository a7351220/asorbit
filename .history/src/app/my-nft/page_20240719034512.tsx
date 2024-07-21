'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

interface NFTDetailModalProps {
  nft: NFT | null;
  isOpen: boolean;
  onClose: () => void;
}

const NFTDetailModal: React.FC<NFTDetailModalProps> = ({ nft, isOpen, onClose }) => {
  if (!isOpen || !nft) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{nft.name}</DialogTitle>
        </DialogHeader>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <Image src={nft.image} alt={nft.name} width={300} height={300} className="rounded-lg" />
          </div>
          <div className="w-1/2 flex flex-col space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">出售</h3>
              <div className="space-y-2">
                <Input placeholder="设定金额" />
                <Input placeholder="備註" />
                <div className="flex items-center space-x-2">
                  <span>截止販售日期</span>
                  <Input type="date" className="flex-grow" />
                </div>
                <Button className="w-full">確認出售</Button>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">兑换</h3>
              <div className="space-y-2">
                <Input placeholder="收件人姓名" />
                <Input placeholder="寄送地址" />
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-grow">確認兑换</Button>
                  <Button variant="secondary" className="flex-grow">实物兑换</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-4">
          <p>* 兑换後此NFT將無法再進行交易</p>
          <p>* 每張兑换金額為0.05ETH</p>
        </div>
      </DialogContent>
    </Dialog>
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
                <Input
                  type="text"
                  placeholder="Search NFT"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pr-10"
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