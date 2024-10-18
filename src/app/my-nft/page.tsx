'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useNFTContractData } from '@/hooks/useNFTContractData';
import { useLotteryContractData } from '@/hooks/useLotteryContractData';
import { nftSaleContractConfig, nftLotteryContractConfig } from '@/app/contracts';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { useToast } from "@/hooks/use-toast";
import { BaseError } from 'viem';

const shortenHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const getBlockExplorerLink = (hash: string) => {
  return `https://sepolia.basescan.org/tx/${hash}`;
};

interface NFT {
  id: number;
  image: string;
  name: string;
  contractAddress: typeof nftSaleContractConfig.address | typeof nftLotteryContractConfig.address;
  isWinnerNFT: boolean;
  isLimitedEdition: boolean;
  price?: bigint;
  seller?: `0x${string}`;
}

const MyNFTPage: React.FC = () => {
  const { address } = useAccount();
  const { name: saleNFTName } = useNFTContractData();
  const { winners, winnerCounts, lotteryFinished } = useLotteryContractData();

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">My NFTs</h1>
        <OwnedNFTs address={address} saleNFTName={saleNFTName} />
        <ListedNFTs address={address} saleNFTName={saleNFTName} />
      </main>
    </div>
  );
};

const OwnedNFTs: React.FC<{ address: `0x${string}` | undefined, saleNFTName: string }> = ({ address, saleNFTName }) => {
  const [ownedNFTs, setOwnedNFTs] = useState<bigint[]>([]);

  const { data: ownedNFTsData } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'getOwnedNFTs',
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (ownedNFTsData) {
      setOwnedNFTs(ownedNFTsData as bigint[]);
    }
  }, [ownedNFTsData]);

  if (!address) {
    return <p className="text-center">Please connect your wallet to view your NFTs.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Owned NFTs</h2>
      {ownedNFTs.length === 0 ? (
        <p className="text-center">You don&apos;t own any NFTs from this collection yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {ownedNFTs.map((tokenId) => (
            <NFTItem key={tokenId.toString()} tokenId={tokenId} saleNFTName={saleNFTName} />
          ))}
        </div>
      )}
    </div>
  );
};

const ListedNFTs: React.FC<{ address: `0x${string}` | undefined, saleNFTName: string }> = ({ address, saleNFTName }) => {
  const [listedNFTs, setListedNFTs] = useState<bigint[]>([]);

  const { data: listedNFTsData } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'getAllListedNFTs',
  });

  useEffect(() => {
    if (listedNFTsData) {
      setListedNFTs(listedNFTsData as bigint[]);
    }
  }, [listedNFTsData]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Listed NFTs</h2>
      {listedNFTs.length === 0 ? (
        <p className="text-center">You haven&apos;t listed any NFTs for sale yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {listedNFTs.map((tokenId) => (
            <ListedNFTItem key={tokenId.toString()} tokenId={tokenId} saleNFTName={saleNFTName} />
          ))}
        </div>
      )}
    </div>
  );
};

const NFTItem: React.FC<{ tokenId: bigint; saleNFTName: string }> = ({ tokenId, saleNFTName }) => {
  const [listingPrice, setListingPrice] = useState('');
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { toast } = useToast();

  const { data: isListed } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'isListed',
    args: [tokenId],
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleList = async () => {
    if (listingPrice && !isListed) {
      try {
        await writeContract({
          ...nftSaleContractConfig,
          functionName: 'listNFT',
          args: [tokenId, parseEther(listingPrice)],
        });
      } catch (error) {
        console.error('Error listing NFT:', error);
      }
    }
  };

  useEffect(() => {
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
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "Your NFT has been listed successfully!",
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

  if (isListed) return null;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link 
        href={`https://sepolia.basescan.org/token/${nftSaleContractConfig.address}?a=${tokenId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-full" style={{ paddingTop: '100%' }}>
          <Image
            src={`/event/1/event-1.jpg`}
            alt={`${saleNFTName} #${tokenId}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-2">
          <p className="font-bold text-sm">{`${saleNFTName} #${tokenId}`}</p>
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

const ListedNFTItem: React.FC<{ tokenId: bigint; saleNFTName: string }> = ({ tokenId, saleNFTName }) => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { toast } = useToast();
  const { data: listing } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'getListing',
    args: [tokenId],
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleCancelListing = async () => {
    try {
      await writeContract({
        ...nftSaleContractConfig,
        functionName: 'cancelListing',
        args: [tokenId],
      });
    } catch (error) {
      console.error('Error cancelling listing:', error);
    }
  };

  useEffect(() => {
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
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "Your NFT listing has been cancelled successfully!",
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

  if (!listing) return null;
  const [seller, price] = listing;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link 
        href={`https://sepolia.basescan.org/token/${nftSaleContractConfig.address}?a=${tokenId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-full" style={{ paddingTop: '100%' }}>
          <Image
            src={`/event/1/event-1.jpg`}
            alt={`${saleNFTName} #${tokenId}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-2">
          <p className="font-bold text-sm">{`${saleNFTName} #${tokenId}`}</p>
          <p className="text-sm text-gray-600">Price: {formatEther(price)} ETH</p>
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

export default MyNFTPage;
