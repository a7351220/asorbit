'use client';
import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useNFTContractData } from '@/hooks/useNFTContractData';
import { useLotteryContractData } from '@/hooks/useLotteryContractData';
import { nftSaleContractConfig, nftLotteryContractConfig } from '@/app/contracts';
import { useAccount, useReadContract } from 'wagmi';

interface NFT {
  id: number;
  image: string;
  name: string;
  contractAddress: string;
  isWinnerNFT: boolean;
  isLimitedEdition: boolean;
}

const MyNFTPage: React.FC = () => {
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

  const myNFTs: NFT[] = useMemo(() => {
    const saleNFTs = participantInfo?.[2].map(id => ({
      id: Number(id),
      image: `/event/1/event-1.jpg`,
      name: `${saleNFTName} #${id}`,
      contractAddress: nftSaleContractConfig.address,
      isWinnerNFT: false,
      isLimitedEdition: false
    })) || [];

    const lotteryNFT = winnerIndex !== -1
      ? [{
          id: winnerIndex + 1,
          image: `/event/1/event-1.jpg`,
          name: `Winner NFT #${winnerIndex + 1}`,
          contractAddress: nftLotteryContractConfig.address,
          isWinnerNFT: true,
          isLimitedEdition: isLimitedEditionForWinner ?? false
        }]
      : [];

    return [...saleNFTs, ...lotteryNFT];
  }, [participantInfo, winnerIndex, saleNFTName, isLimitedEditionForWinner]);

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">My NFTs</h1>
        {myNFTs.length === 0 ? (
          <p className="text-center">You don&apos;t own any NFTs from this collection yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {myNFTs.map((nft) => (
              <Link 
                href={`https://sepolia.basescan.org/token/${nft.contractAddress}?a=${nft.id}`} 
                key={`${nft.contractAddress}-${nft.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full" style={{ paddingTop: '100%' }}>
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-2 right-2 flex flex-col items-end">
                    {nft.isWinnerNFT && (
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs mb-1">
                        Winner
                      </div>
                    )}
                    {nft.isLimitedEdition && (
                      <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
                        Limited
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-2">
                  <p className="font-bold text-sm">{nft.name}</p>
                  {nft.isLimitedEdition && <p className="text-xs text-purple-600">Limited Edition</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyNFTPage;