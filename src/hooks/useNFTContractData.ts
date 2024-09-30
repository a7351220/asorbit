import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { nftSaleContractConfig } from '@/app/contracts';
import { useAccount } from 'wagmi';

export function useNFTContractData() {
  const { address } = useAccount();

  const { data: name } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'name',
  });

  const { data: symbol } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'symbol',
  });

  const { data: totalSupply } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'totalSupply',
  });

  const { data: price } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'price',
  });

  const { data: saleEndTime } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'saleEndTime',
  });

  const { data: allParticipants } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'getAllParticipants',
  });

  const { data: participantInfo } = useReadContract({
    ...nftSaleContractConfig,
    functionName: 'getParticipantInfo',
    args: address ? [address] : undefined,
  });

  return {
    name: name as string,
    symbol: symbol as string,
    totalSupply: totalSupply?.toString() || '0',
    price: price ? formatEther(price) : '0',
    saleEndTime: saleEndTime ? new Date(Number(saleEndTime) * 1000).toLocaleString() : 'N/A',
    rawPrice: price, // Add this line to include the raw price
    rawSaleEndTime: saleEndTime,
    allParticipants: allParticipants as `0x${string}`[] | undefined,
    participantInfo: participantInfo as [bigint, bigint, bigint[]] | undefined,
  };
}