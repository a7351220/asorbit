import { useReadContract } from 'wagmi';
import { nftLotteryContractConfig } from '@/app/contracts';

export function useLotteryContractData() {
  const { data: winnersData, isError: winnersError, isLoading: winnersLoading } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getWinners',
  });

  const { data: lotteryFinished, isError: finishedError, isLoading: finishedLoading } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'lotteryFinished',
  });

  const { data: winnerTokenIds, isError: winnerTokenIdsError, isLoading: winnerTokenIdsLoading } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getWinnerTokenIds',
  });

  const { data: limitedEditionTokenIds, isError: limitedEditionTokenIdsError, isLoading: limitedEditionTokenIdsLoading } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getLimitedEditionTokenIds',
  });

  const winners = winnersData ? winnersData[0] as readonly string[] : [];
  const winnerCounts = winnersData ? winnersData[1] as readonly bigint[] : [];

  return { 
    winners, 
    winnerCounts, 
    lotteryFinished, 
    winnerTokenIds,
    limitedEditionTokenIds,
    isLoading: winnersLoading || finishedLoading || winnerTokenIdsLoading || limitedEditionTokenIdsLoading,
    isError: winnersError || finishedError || winnerTokenIdsError || limitedEditionTokenIdsError
  };
}
