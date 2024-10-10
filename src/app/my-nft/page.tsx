"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaHeart, FaRegHeart, FaPlus, FaEllipsisV, FaCheck } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import { Input } from "@/components/ui/input";
import NFTDetailModal from "@/components/NFTDetailModal";
import NFTGroupLogo from '@/components/NFTGroupLogo';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useNFTContractData } from '@/hooks/useNFTContractData';
import { useLotteryContractData } from '@/hooks/useLotteryContractData';
import { nftSaleContractConfig, nftLotteryContractConfig } from '@/app/contracts';
import { useAccount, useWatchContractEvent, useReadContract } from 'wagmi';


interface NFT {
  id: number;
  image: string;
  name: string;
  contractAddress: string;
  isWinnerNFT: boolean;
  isLimitedEdition: boolean;
  group: string;
  status: 'active' | 'redeemed';
  transactionHash?: string;
}

const MyNFTPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchName, setSearchName] = useState<string>('');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [customCategories, setCustomCategories] = useState<{ name: string; nfts: number[] }[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isNFTSelectionModalOpen, setIsNFTSelectionModalOpen] = useState(false);
  const [selectedNFTsForCategory, setSelectedNFTsForCategory] = useState<number[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [nftTransactionHashes, setNftTransactionHashes] = useState<Record<number, string>>({});


  const { address } = useAccount();
  const { participantInfo, name: saleNFTName } = useNFTContractData();
  const { winners } = useLotteryContractData();

  const winnerIndex = useMemo(() => {
    return address && winners 
      ? winners.findIndex(winner => winner.toLowerCase() === address.toLowerCase()) 
      : -1;
  }, [address, winners]);

  const { data: isLimitedEditionForWinner } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'isLimitedEdition',
    args: winnerIndex !== -1 ? [BigInt(winnerIndex + 1)] : undefined,
  });

  const handleTransferEvent = useCallback((
    logs: any[],
    // 如果需要，可以添加更多參數
  ) => {
    logs.forEach(log => {
      if (log.args.to.toLowerCase() === address?.toLowerCase()) {
        setNftTransactionHashes(prev => ({
          ...prev,
          [Number(log.args.tokenId)]: log.transactionHash
        }));
      }
    });
  }, [address]);


  useWatchContractEvent({
    ...nftSaleContractConfig,
    eventName: 'Transfer',
    onLogs: handleTransferEvent,
  });

  // 監聽抽獎 NFT 合約的轉移事件
  useWatchContractEvent({
    ...nftLotteryContractConfig,
    eventName: 'Transfer',
    onLogs: handleTransferEvent,
  });


  const handleMintComplete = useCallback((tokenIds: number[], transactionHash: string) => {
    setNftTransactionHashes(prev => {
      const newHashes = { ...prev };
      tokenIds.forEach(id => {
        newHashes[id] = transactionHash;
      });
      return newHashes;
    });
  }, []);

  const myNFTs: NFT[] = useMemo(() => {
    const saleNFTs = participantInfo?.[2].map(id => ({
      id: Number(id),
      image: `/nft-images/unknow.png`,
      name: `${saleNFTName} #${id}`,
      contractAddress: nftSaleContractConfig.address,
      isWinnerNFT: false,
      isLimitedEdition: false,
      group: `${saleNFTName}`,
      status: 'active' as const,
      transactionHash: nftTransactionHashes[Number(id)]
    })) || [];

    const lotteryNFT = winnerIndex !== -1
      ? [{
          id: winnerIndex + 1,
          image: `/event/1/event-1.jpg`,
          name: `Winner NFT #${winnerIndex + 1}`,
          contractAddress: nftLotteryContractConfig.address,
          isWinnerNFT: true,
          isLimitedEdition: isLimitedEditionForWinner ?? false,
          group: 'Lottery NFT',
          status: 'active' as const,
          transactionHash: nftTransactionHashes[winnerIndex + 1]
        }]
      : [];

      return [...saleNFTs, ...lotteryNFT];
    }, [participantInfo, winnerIndex, saleNFTName, isLimitedEditionForWinner, nftTransactionHashes]);


  useEffect(() => {
    const groups = Array.from(new Set(myNFTs.map(nft => nft.group)));
    setCustomCategories(groups.map(group => ({ name: group, nfts: [] })));

    const savedFavorites = localStorage.getItem('nftFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [myNFTs]);

  const categories = useMemo(() => {
    return ['All', 'My fav', 'Redeemed', ...customCategories.map(cat => cat.name)];
  }, [customCategories]);

  const filteredNFTs = useMemo(() => {
    return myNFTs
      .filter(nft => 
        nft.name.toLowerCase().includes(searchName.toLowerCase()) &&
        (selectedCategory === 'All' || 
         (selectedCategory === 'My fav' && favorites.includes(nft.id)) ||
         (selectedCategory === 'Redeemed' && nft.status === 'redeemed') ||
         customCategories.find(cat => cat.name === selectedCategory)?.nfts.includes(nft.id) ||
         nft.group === selectedCategory)
      )
      .sort((a, b) => {
        if (a.status === 'redeemed' && b.status !== 'redeemed') return 1;
        if (a.status !== 'redeemed' && b.status === 'redeemed') return -1;
        return 0;
      });
  }, [myNFTs, searchName, selectedCategory, favorites, customCategories]);

  const handleNFTClick = (nft: NFT) => {
    if (nft.status !== 'redeemed') {
      setSelectedNFT(nft);
    }
  };

  const closeModal = () => {
    setSelectedNFT(null);
  };

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  const addCustomCategory = () => {
    if (newCategory && !customCategories.some(cat => cat.name === newCategory)) {
      setCustomCategories([...customCategories, { name: newCategory, nfts: [] }]);
      setNewCategory('');
    }
  };

  const openNFTSelectionModal = (categoryName: string, closePopover: () => void) => {
    setEditingCategory(categoryName);
    const category = customCategories.find(cat => cat.name === categoryName);
    setSelectedNFTsForCategory(category ? category.nfts : []);
    setIsNFTSelectionModalOpen(true);
    closePopover();
  };

  const removeCustomCategory = (categoryName: string, closePopover: () => void) => {
    setCustomCategories(customCategories.filter(cat => cat.name !== categoryName));
    if (selectedCategory === categoryName) {
      setSelectedCategory('All');
    }
    closePopover();
  };

  const closeNFTSelectionModal = () => {
    setIsNFTSelectionModalOpen(false);
    setEditingCategory(null);
    setSelectedNFTsForCategory([]);
  };

  const toggleNFTSelection = (nftId: number) => {
    setSelectedNFTsForCategory(prev => 
      prev.includes(nftId) ? prev.filter(id => id !== nftId) : [...prev, nftId]
    );
  };

  const saveNFTSelection = () => {
    if (editingCategory) {
      setCustomCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.name === editingCategory
            ? { ...cat, nfts: selectedNFTsForCategory }
            : cat
        )
      );
    }
    closeNFTSelectionModal();
  };

  const toggleFavorite = (nftId: number) => {
    const newFavorites = favorites.includes(nftId)
      ? favorites.filter(id => id !== nftId)
      : [...favorites, nftId];
    setFavorites(newFavorites);
    localStorage.setItem('nftFavorites', JSON.stringify(newFavorites));
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">- MY NFT -</h1>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 pr-0 md:pr-4 mb-4 md:mb-0">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="font-bold mb-4 text-lg">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`text-left w-full py-2 px-3 rounded ${selectedCategory === category ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                    >
                      {category}
                    </button>
                    {!['All', 'My fav', 'Redeemed'].includes(category) && (
                      <Popover
                        trigger={
                          <button className="text-gray-500 hover:text-gray-700">
                            <FaEllipsisV />
                          </button>
                        }
                        content={(closePopover) => (
                          <div className="py-1">
                            <button
                              onClick={() => openNFTSelectionModal(category, closePopover)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              Add NFTs
                            </button>
                            <button
                              onClick={() => removeCustomCategory(category, closePopover)}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              Delete Category
                            </button>
                          </div>
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center mt-4">
                <Input
                  type="text"
                  placeholder="New category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mr-2"
                />
                <button 
                  onClick={addCustomCategory}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  <FaPlus />
                </button>
              </div>
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
              {filteredNFTs.map((nft) => (
                <div 
                  key={nft.id} 
                  className={`border border-gray-300 rounded-lg overflow-hidden flex flex-col ${nft.status !== 'redeemed' ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleNFTClick(nft)}
                >
                  <div className="relative w-full" style={{ paddingTop: '133.33%' }}>
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      layout="fill"
                      objectFit="cover"
                    />
                    {nft.status === 'redeemed' && (
                      <>
                        <div className="absolute inset-0 bg-white opacity-50"></div>
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                          Redeemed
                        </div>
                      </>
                    )}
                    {nft.isWinnerNFT && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                        Winner
                      </div>
                    )}
                    {nft.isLimitedEdition && (
                      <div className="absolute bottom-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
                        Limited
                      </div>
                    )}
                  </div>
                  <div className="p-2 flex-grow">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-2 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-300">
                        <NFTGroupLogo group={nft.group} />
                      </div>
                      <div className="flex-grow min-w-0 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm truncate leading-snug">{nft.name}</p>
                          <p className="text-xs text-gray-600 truncate leading-snug">{nft.group}</p>
                        </div>
                        {nft.status !== 'redeemed' && (
                          <button 
                            className="text-red-500 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(nft.id);
                            }}
                          >
                            {favorites.includes(nft.id) ? <FaHeart /> : <FaRegHeart />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <NFTDetailModal 
        nft={selectedNFT} 
        isOpen={!!selectedNFT} 
        onClose={closeModal} 
        transactionHash={selectedNFT ? selectedNFT.transactionHash : undefined}
      />
      {isNFTSelectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Select NFTs for {editingCategory}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {myNFTs.filter(nft => nft.status !== 'redeemed').map((nft) => (
                <div 
                  key={nft.id} 
                  className={`border ${selectedNFTsForCategory.includes(nft.id) ? 'border-blue-500' : 'border-gray-300'} rounded-lg overflow-hidden cursor-pointer`}
                  onClick={() => toggleNFTSelection(nft.id)}
                >
                  <div className="relative w-full" style={{ paddingTop: '133.33%' }}>
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      layout="fill"
                      objectFit="cover"
                    />
                    {selectedNFTsForCategory.includes(nft.id) && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                        <FaCheck />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-bold text-sm truncate">{nft.name}</p>
                    <p className="text-xs text-gray-600 truncate">{nft.group}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button 
                onClick={closeNFTSelectionModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={saveNFTSelection}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNFTPage;
        