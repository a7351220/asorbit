'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { nftSaleFactoryConfig, nftSaleContractConfig, nftLotteryContractConfig } from '@/app/contracts';
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { useToast } from "@/hooks/use-toast";
import { BaseError } from 'viem';
import { cn } from "@/lib/utils";

const shortenHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const getBlockExplorerLink = (hash: string) => {
  return `https://sepolia.basescan.org/tx/${hash}`;
};

interface NFT {
  id: bigint;
  contractAddress: `0x${string}`;
  name: string;
  image: string;
  isListed: boolean;
  price?: bigint;
  isWinnerNFT: boolean;
  isLimitedEdition: boolean;
}

const MyNFTPage: React.FC = () => {
  const { address } = useAccount();
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [listedNFTs, setListedNFTs] = useState<NFT[]>([]);
  const [winnerNFTs, setWinnerNFTs] = useState<NFT[]>([]);

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
      { address: contractAddress, abi: nftSaleContractConfig.abi, functionName: 'getOwnedNFTs', args: [address] },
      { address: contractAddress, abi: nftSaleContractConfig.abi, functionName: 'getAllListedNFTs' },
    ]) || [],
  });

  const { data: lotteryData } = useReadContracts({
    contracts: address ? [
      {
        ...nftLotteryContractConfig,
        functionName: 'getWinners',
      },
      {
        ...nftLotteryContractConfig,
        functionName: 'getWinnerTokenIds',
      },
      {
        ...nftLotteryContractConfig,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
    ] : [],
  });

  useEffect(() => {
    if (nftSalesAddresses?.[0]?.result && nftSalesData && address && lotteryData) {
      const addresses = nftSalesAddresses[0].result as `0x${string}`[];
      let ownedNFTsTemp: NFT[] = [];
      let listedNFTsTemp: NFT[] = [];
      let winnerNFTsTemp: NFT[] = [];

      const [winners] = lotteryData[0]?.result || [[]];
      const winnerTokenIds = lotteryData[1]?.result || [];
      const winnerNFTBalance = lotteryData[2]?.result as bigint || BigInt(0);

      addresses.forEach((contractAddress, index) => {
        const offset = index * 3;
        const name = nftSalesData[offset]?.result as string;
        const ownedTokenIds = nftSalesData[offset + 1]?.result as bigint[];
        const listedTokenIds = nftSalesData[offset + 2]?.result as bigint[];

        if (ownedTokenIds) {
          ownedTokenIds.forEach(id => {
            const isListed = listedTokenIds?.includes(id);
            const isWinnerNFT = false; // 將這裡設置為 false
            
            const nft: NFT = {
              id,
              contractAddress,
              name,
              image: `/event/${index + 1}/event-${index + 1}.jpg`,
              isListed,
              isWinnerNFT,
              isLimitedEdition: false,
            };

            if (isListed) {
              listedNFTsTemp.push(nft);
            } else {
              ownedNFTsTemp.push(nft);
            }
          });
        }
      });

      // 只有通過 mintAndDistributeWinnerNFTs 創建的 NFT 才會被標記為 Winner NFT
      if (winnerNFTBalance > BigInt(0)) {
        for (let i = 0; i < Number(winnerNFTBalance); i++) {
          const eventIndex = (i % addresses.length) + 1;
          winnerNFTsTemp.push({
            id: BigInt(i + 1),
            contractAddress: nftLotteryContractConfig.address,
            name: "Winner NFT",
            image: `/event/${eventIndex}/event-${eventIndex}.jpg`,
            isListed: false,
            isWinnerNFT: true,
            isLimitedEdition: false,
          });
        }
      }

      setOwnedNFTs(ownedNFTsTemp);
      setListedNFTs(listedNFTsTemp);
      setWinnerNFTs(winnerNFTsTemp);
    }
  }, [nftSalesAddresses, nftSalesData, address, lotteryData]);

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">My NFTs</h1>
        {winnerNFTs.length > 0 && (
          <WinnerNFTs nfts={winnerNFTs} />
        )}
        <OwnedNFTs nfts={ownedNFTs} setOwnedNFTs={setOwnedNFTs} setListedNFTs={setListedNFTs} />
        <ListedNFTs nfts={listedNFTs} setOwnedNFTs={setOwnedNFTs} setListedNFTs={setListedNFTs} />
      </main>
    </div>
  );
};

const OwnedNFTs: React.FC<{ 
  nfts: NFT[], 
  setOwnedNFTs: React.Dispatch<React.SetStateAction<NFT[]>>,
  setListedNFTs: React.Dispatch<React.SetStateAction<NFT[]>>
}> = ({ nfts, setOwnedNFTs, setListedNFTs }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Owned NFTs</h2>
      {nfts.length === 0 ? (
        <p className="text-center">You don&apos;t own any NFTs from this collection yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {nfts.map((nft) => (
            <NFTItem 
              key={`${nft.contractAddress}-${nft.id.toString()}`} 
              nft={nft} 
              setOwnedNFTs={setOwnedNFTs}
              setListedNFTs={setListedNFTs}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ListedNFTs: React.FC<{ 
  nfts: NFT[], 
  setOwnedNFTs: React.Dispatch<React.SetStateAction<NFT[]>>,
  setListedNFTs: React.Dispatch<React.SetStateAction<NFT[]>>
}> = ({ nfts, setOwnedNFTs, setListedNFTs }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Listed NFTs</h2>
      {nfts.length === 0 ? (
        <p className="text-center">You haven&apos;t listed any NFTs for sale yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {nfts.map((nft) => (
            <ListedNFTItem 
              key={`${nft.contractAddress}-${nft.id.toString()}`} 
              nft={nft} 
              setOwnedNFTs={setOwnedNFTs}
              setListedNFTs={setListedNFTs}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NFTItem: React.FC<{ 
  nft: NFT, 
  setOwnedNFTs: React.Dispatch<React.SetStateAction<NFT[]>>,
  setListedNFTs: React.Dispatch<React.SetStateAction<NFT[]>>
}> = ({ nft, setOwnedNFTs, setListedNFTs }) => {
  const [listingPrice, setListingPrice] = useState('');
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { toast } = useToast();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleList = async () => {
    if (listingPrice && !nft.isListed) {
      try {
        await writeContract({
          address: nft.contractAddress,
          abi: nftSaleContractConfig.abi,
          functionName: 'listNFT',
          args: [nft.id, parseEther(listingPrice)],
        });
      } catch (error) {
        console.error('Error listing NFT:', error);
      }
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "Your NFT has been listed successfully!",
      });
      setOwnedNFTs(prev => prev.filter(item => item.id !== nft.id || item.contractAddress !== nft.contractAddress));
      setListedNFTs(prev => [...prev, { ...nft, isListed: true, price: parseEther(listingPrice) }]);
    }
    if (hash) {
      toast({
        title: "Transaction Submitted",
        description: (
          <a href={getBlockExplorerLink(hash)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            View on BaseScan: {shortenHash(hash)}
          </a>
        ),
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
  }, [hash, isConfirmed, error, toast, nft, listingPrice, setOwnedNFTs, setListedNFTs]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link 
        href={`https://sepolia.basescan.org/token/${nft.contractAddress}?a=${nft.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-full" style={{ paddingTop: '100%' }}>
          <Image
            src={nft.image}
            alt={`${nft.name} #${nft.id}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-2">
          <p className="font-bold text-sm">{`${nft.name} #${nft.id}`}</p>
          {nft.isLimitedEdition && <p className="text-sm text-purple-600">Limited Edition</p>}
        </div>
      </Link>
      <div className="p-2 border-t border-gray-300">
        <input
          type="text"
          value={listingPrice}
          onChange={(e) => setListingPrice(e.target.value)}
          placeholder="Listing Price (ETH)"
          className="w-full p-1 mb-2 border border-gray-300 rounded"
        />
        <button 
          onClick={handleList} 
          className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
          disabled={isPending}
        >
          {isPending ? 'Processing...' : 'List for Sale'}
        </button>
      </div>
    </div>
  );
};

const ListedNFTItem: React.FC<{ 
  nft: NFT, 
  setOwnedNFTs: React.Dispatch<React.SetStateAction<NFT[]>>,
  setListedNFTs: React.Dispatch<React.SetStateAction<NFT[]>>
}> = ({ nft, setOwnedNFTs, setListedNFTs }) => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { toast } = useToast();
  const [price, setPrice] = useState<bigint | undefined>(nft.price);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const listingQuery = useMemo(() => ({
    address: nft.contractAddress,
    abi: nftSaleContractConfig.abi,
    functionName: 'getListing' as const,
    args: [nft.id] as const,
  }), [nft.contractAddress, nft.id]);

  const { data: listing } = useReadContracts({
    contracts: [listingQuery],
  });

  useEffect(() => {
    if (listing && listing[0]?.result) {
      const result = listing[0].result;
      if (Array.isArray(result) && result.length === 2) {
        const [, newPrice] = result;
        if (typeof newPrice === 'bigint') {
          setPrice(newPrice);
        }
      }
    }
  }, [listing]);

  const handleCancelListing = async () => {
    try {
      await writeContract({
        address: nft.contractAddress,
        abi: nftSaleContractConfig.abi,
        functionName: 'cancelListing',
        args: [nft.id],
      });
    } catch (error) {
      console.error('Error cancelling listing:', error);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "Your NFT listing has been cancelled successfully!",
      });
      setListedNFTs(prev => prev.filter(item => item.id !== nft.id || item.contractAddress !== nft.contractAddress));
      setOwnedNFTs(prev => [...prev, { ...nft, isListed: false, price: undefined }]);
    }
    if (hash) {
      toast({
        title: "Transaction Submitted",
        description: (
          <a href={getBlockExplorerLink(hash)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            View on BaseScan: {shortenHash(hash)}
          </a>
        ),
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
  }, [hash, isConfirmed, error, toast, nft, setOwnedNFTs, setListedNFTs]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link 
        href={`https://sepolia.basescan.org/token/${nft.contractAddress}?a=${nft.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-full" style={{ paddingTop: '100%' }}>
          <Image
            src={nft.image}
            alt={`${nft.name} #${nft.id}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-2">
          <p className="font-bold text-sm">{`${nft.name} #${nft.id}`}</p>
          <p className="text-sm text-gray-600">Price: {price ? formatEther(price) : 'N/A'} ETH</p>
          {nft.isLimitedEdition && <p className="text-sm text-purple-600">Limited Edition</p>}
        </div>
      </Link>
      <div className="p-2 border-t border-gray-300">
        <button 
          onClick={handleCancelListing} 
          className="w-full bg-red-500 text-white py-1 rounded hover:bg-red-600"
          disabled={isPending}
        >
          {isPending ? 'Processing...' : 'Cancel Listing'}
        </button>
      </div>
    </div>
  );
};

// 新增 WinnerNFTs 組件
const WinnerNFTs: React.FC<{ nfts: NFT[] }> = ({ nfts }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Winner NFTs</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {nfts.map((nft) => (
          <WinnerNFTItem key={`${nft.contractAddress}-${nft.id.toString()}`} nft={nft} />
        ))}
      </div>
    </div>
  );
};

const WinnerNFTItem: React.FC<{ nft: NFT }> = ({ nft }) => {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative group">
      <Link 
        href={`https://sepolia.basescan.org/token/${nft.contractAddress}?a=${nft.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-full" style={{ paddingTop: '100%' }}>
          <Image
            src={nft.image}
            alt={`${nft.name} #${nft.id}`}
            layout="fill"
            objectFit="cover"
            className={cn(
              "winner-nft-image",
              "transition-all duration-500",
              "group-hover:scale-105",
              "filter brightness-110 contrast-110 saturate-85"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] group-hover:animate-shimmer"></div>
          <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform -rotate-12">
            Winner
          </div>
        </div>
        <div className="p-3 bg-gradient-to-r from-gray-100 to-gray-200">
          <p className="font-bold text-sm text-gray-800">{`${nft.name} #${nft.id}`}</p>
          <p className="text-xs text-gray-600 font-semibold mt-1">Exclusive Winner NFT</p>
        </div>
      </Link>
    </div>
  );
};

export default MyNFTPage;
