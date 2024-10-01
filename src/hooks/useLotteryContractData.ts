import { useReadContract, useWriteContract } from 'wagmi';
import { nftLotteryContractConfig } from '@/app/contracts';
import { useState } from 'react';

export function useLotteryContractData() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: winners } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getWinners',
  });

  const { data: winnerTokenIds } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getWinnerTokenIds',
  });

  const { data: limitedEditionTokenIds } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getLimitedEditionTokenIds',
  });

  const { data: isLimitedEdition } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'isLimitedEdition',
  });

  const { data: lotteryFinished } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'lotteryFinished',
  });

  const { data: totalWeightData } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getTotalWeight',
  });

  const refreshLotteryData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    winners: winners as `0x${string}`[] | undefined,
    winnerTokenIds: winnerTokenIds as bigint[] | undefined,
    limitedEditionTokenIds: limitedEditionTokenIds as bigint[] | undefined,
    isLimitedEdition: isLimitedEdition as boolean | undefined,
    lotteryFinished: lotteryFinished as boolean | undefined,
    totalWeight: totalWeightData as bigint | undefined,
    refreshLotteryData,
  };
}
