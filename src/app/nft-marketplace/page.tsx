'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import NFTGroupLogo from '@/components/NFTGroupLogo';
import { useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { nftSaleFactoryConfig, nftSaleContractConfig } from '@/app/contracts';
import { formatEther } from 'viem';
import { useToast } from "@/hooks/use-toast";
import { BaseError } from 'viem';

export interface ListedNFT {
  tokenId: bigint;
  seller: `0x${string}`;
  price: bigint;
  contractAddress: `0x${string}`;
  name: string;
}

export default function NFTMarketplace() {
  const [listedNFTs, setListedNFTs] = useState<ListedNFT[]>([]);
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [searchName, setSearchName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('HOT');
  const [priceSort, setPriceSort] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const { data: nftSalesAddresses } = useReadContracts({
    contracts: [
      {
        ...nftSaleFactoryConfig,
        functionName: 'getAllNFTSales',
      },
    ],
  });

  const { data: nftSalesData } = useReadContracts({
    contracts: nftSalesAddresses?.[0]?.result?.flatMap((contractAddress: `0x${string}`) => [
      { address: contractAddress, abi: nftSaleContractConfig.abi, functionName: 'name' },
      { address: contractAddress, abi: nftSaleContractConfig.abi, functionName: 'getAllListedNFTs' },
    ]) || [],
  });

  useEffect(() => {
    if (nftSalesAddresses?.[0]?.result && nftSalesData) {
      const addresses = nftSalesAddresses[0].result as `0x${string}`[];
      let allListedNFTs: ListedNFT[] = [];

      addresses.forEach((contractAddress, index) => {
        const offset = index * 2;
        const name = nftSalesData[offset]?.result as string;
        const listedTokenIds = nftSalesData[offset + 1]?.result as bigint[];

        if (listedTokenIds) {
          const nfts = listedTokenIds.map(tokenId => ({
            tokenId,
            seller: '0x' as `0x${string}`,
            price: BigInt(0),
            contractAddress,
            name
          }));
          allListedNFTs = [...allListedNFTs, ...nfts];
        }
      });

      setListedNFTs(allListedNFTs);
    }
  }, [nftSalesAddresses, nftSalesData]);

  const filteredAndSortedNFTs = useMemo(() => {
    return listedNFTs.filter(nft => {
      const matchesCategory = selectedCategory === 'HOT'; // 简化类别匹配逻辑
      const matchesName = nft.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(nft.name);
      const nftPrice = parseFloat(formatEther(nft.price));
      const matchesMinPrice = !minPrice || nftPrice >= parseFloat(minPrice);
      const matchesMaxPrice = !maxPrice || nftPrice <= parseFloat(maxPrice);

      return matchesCategory && matchesName && matchesGroup && matchesMinPrice && matchesMaxPrice;
    }).sort((a, b) => {
      if (priceSort === 'high-to-low') {
        return Number(b.price) - Number(a.price);
      } else if (priceSort === 'low-to-high') {
        return Number(a.price) - Number(b.price);
      }
      return 0;
    });
  }, [listedNFTs, selectedCategory, searchName, selectedGroups, minPrice, maxPrice, priceSort]);

  const handleGroupCheckboxChange = (group: string) => {
    setSelectedGroups(prev => 
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">NFT Marketplace</h1>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className={`lg:w-1/4 bg-white p-4 rounded-lg shadow-md ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              {/* Price Range Inputs */}
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="border border-gray-300 rounded p-2 w-1/2"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="border border-gray-300 rounded p-2 w-1/2"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
              {/* Group Search and Checkboxes */}
              <div>
                <h3 className="font-medium mb-2">Group</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Group"
                    className="border border-gray-300 rounded p-2 w-full pr-8"
                    value={searchGroup}
                    onChange={(e) => setSearchGroup(e.target.value)}
                  />
                  <FaSearch className="absolute right-3 top-3 text-gray-400" />
                </div>
                <div className="mt-2 max-h-40 overflow-y-auto">
                  {/* Group checkboxes would go here */}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 lg:ml-6 mt-6 lg:mt-0">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Category Buttons */}
                <div className="flex flex-wrap gap-2">
                  {['HOT', 'NEW', 'BOYS', 'GIRLS'].map((category) => (
                    <button
                      key={category}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                {/* Sort and Search */}
                <div className="flex items-center gap-2">
                  <select
                    className="border border-gray-300 rounded p-2 text-sm"
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value)}
                  >
                    <option value="">Sort by Price</option>
                    <option value="high-to-low">High to Low</option>
                    <option value="low-to-high">Low to High</option>
                  </select>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by Name"
                      className="border border-gray-300 rounded p-2 pr-8 text-sm"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-3 text-gray-400" />
                  </div>
                  <button
                    className="lg:hidden bg-blue-500 text-white p-2 rounded"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <FaFilter />
                  </button>
                </div>
              </div>
            </div>

            {/* NFT Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAndSortedNFTs.map((nft) => (
                <NFTItem key={`${nft.contractAddress}-${nft.tokenId.toString()}`} nft={nft} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const NFTItem: React.FC<{ nft: ListedNFT }> = ({ nft }) => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { toast } = useToast();
  const [seller, setSeller] = useState<`0x${string}`>(nft.seller);
  const [price, setPrice] = useState<bigint>(nft.price);

  const listingQuery = useMemo(() => ({
    address: nft.contractAddress,
    abi: nftSaleContractConfig.abi,
    functionName: 'getListing' as const,
    args: [nft.tokenId] as const,  // 使用 as const 来确保参数类型正确
  }), [nft.contractAddress, nft.tokenId]);

  const { data: listing } = useReadContracts({
    contracts: [listingQuery],
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (listing && listing[0]?.result) {
      const result = listing[0].result;
      if (Array.isArray(result) && result.length === 2) {
        const [newSeller, newPrice] = result;
        if (typeof newSeller === 'string' && typeof newPrice === 'bigint') {
          setSeller(newSeller as `0x${string}`);
          setPrice(newPrice);
        }
      }
    }
  }, [listing]);

  const handleBuy = useCallback(async () => {
    try {
      await writeContract({
        address: nft.contractAddress,
        abi: nftSaleContractConfig.abi,
        functionName: 'buyNFT',
        args: [nft.tokenId],
        value: price,
      });
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  }, [writeContract, nft.contractAddress, nft.tokenId, price]);

  useEffect(() => {
    if (hash) {
      toast({
        title: "Transaction Submitted",
        description: "Transaction has been submitted to the network.",
      });
    }
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "You have successfully purchased the NFT!",
      });
    }
    if (error) {
      let errorMessage = (error as BaseError).shortMessage || error.message;
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [hash, isConfirmed, error, toast]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link 
        href={`https://sepolia.basescan.org/token/${nft.contractAddress}?a=${nft.tokenId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-full" style={{ paddingTop: '100%' }}>
          <Image
            src="/event/1/event-1.jpg"
            alt={`NFT ${nft.tokenId.toString()}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-2">
          <p className="font-bold text-sm">{nft.name} #{nft.tokenId.toString()}</p>
          <p className="text-sm text-gray-600">Price: {formatEther(price)} ETH</p>
          <p className="text-sm text-gray-600 truncate">Seller: {seller}</p>
        </div>
      </Link>
      <div className="p-2 border-t border-gray-300">
        <button 
          onClick={handleBuy} 
          className="w-full bg-green-500 text-white py-1 rounded hover:bg-green-600"
          disabled={isPending || isConfirming}
        >
          {isPending || isConfirming ? 'Processing...' : 'Buy NFT'}
        </button>
      </div>
    </div>
  );
};
