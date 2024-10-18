'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { nftSaleContractConfig } from '@/app/contracts';
import { formatEther } from 'viem';
import { useToast } from "@/hooks/use-toast";
import { BaseError } from 'viem';

const shortenHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const getBlockExplorerLink = (hash: string) => {
  return `https://sepolia.basescan.org/tx/${hash}`;
};

export interface ListedNFT {
  tokenId: bigint;
  seller: `0x${string}`;
  price: bigint;
}

export default function NFTMarketplace() {
  const [listedNFTs, setListedNFTs] = useState<ListedNFT[]>([]);
  const { toast } = useToast();

  const { data: listedNFTsData, isLoading, isError, refetch } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'getAllListedNFTs',
  });

  useEffect(() => {
    if (listedNFTsData && Array.isArray(listedNFTsData)) {
      setListedNFTs(listedNFTsData.map(tokenId => ({ tokenId, seller: '0x', price: BigInt(0) })));
    }
  }, [listedNFTsData]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading NFTs</div>;

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">NFT Marketplace</h1>
        {listedNFTs.length === 0 ? (
          <p className="text-center">No NFTs are currently listed for sale.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listedNFTs.map((nft) => (
              <NFTItem key={nft.tokenId.toString()} nft={nft} refetch={refetch} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const NFTItem: React.FC<{ nft: ListedNFT; refetch: () => void }> = ({ nft, refetch }) => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { toast } = useToast();

  const { data: listing } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'getListing',
    args: [nft.tokenId],
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (listing) {
      const [seller, price] = listing;
      nft.seller = seller;
      nft.price = price;
    }
  }, [listing, nft]);

  const handleBuy = async () => {
    try {
      await writeContract({
        ...nftSaleContractConfig,
        functionName: 'buyNFT',
        args: [nft.tokenId],
        value: nft.price,
      });
    } catch (error) {
      console.error('Error buying NFT:', error);
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
        description: "You have successfully purchased the NFT!",
      });
      refetch();
    }
    if (error) {
      let errorMessage = (error as BaseError).shortMessage || error.message;
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [hash, isConfirmed, error, toast, refetch]);

  if (!listing) return null;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link 
        href={`https://sepolia.basescan.org/token/${nftSaleContractConfig.address}?a=${nft.tokenId}`}
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
          <p className="font-bold text-sm">Token ID: {nft.tokenId.toString()}</p>
          <p className="text-sm text-gray-600">Price: {formatEther(nft.price)} ETH</p>
          <p className="text-sm text-gray-600 truncate">Seller: {nft.seller}</p>
        </div>
      </Link>
      <div className="p-2 border-t border-gray-300">
        <button 
          onClick={handleBuy} 
          className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
          disabled={isPending || isConfirming}
        >
          {isPending || isConfirming ? 'Processing...' : 'Buy NFT'}
        </button>
      </div>
    </div>
  );
};
