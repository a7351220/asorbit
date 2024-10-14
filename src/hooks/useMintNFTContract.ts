import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { mintNFTContractConfig } from '@/app/contracts';
import { useCallback, useEffect } from 'react';

export function useMintNFTContract() {
  const { address: userAddress } = useAccount();

  // 讀取用戶擁有的 NFT
  const { data: ownedTokens, isLoading: isLoadingOwnedTokens, refetch: refetchOwnedTokens } = useReadContract({
    ...mintNFTContractConfig,
    functionName: 'tokensOfOwner',
    args: userAddress ? [userAddress] : undefined,
  });

  useEffect(() => {
    console.log('Owned tokens:', ownedTokens);
  }, [ownedTokens]);

  // 鑄造 NFT
  const { writeContract: writeNFTContract, isPending: isMinting } = useWriteContract();

  // 鑄造單個 NFT 的函數
  const mintNFT = useCallback((recipient: `0x${string}`, tokenId: bigint) => {
    writeNFTContract({
      ...mintNFTContractConfig,
      functionName: 'mintSpecificNFT',
      args: [recipient, tokenId],
    });
  }, [writeNFTContract]);

  // 批量鑄造 NFT 的函數
  const batchMintNFTs = useCallback((recipient: `0x${string}`, tokenIds: bigint[]) => {
    writeNFTContract({
      ...mintNFTContractConfig,
      functionName: 'batchMintNFTs',
      args: [recipient, tokenIds],
    });
  }, [writeNFTContract]);

  // 讀取合約名稱
  const { data: contractName } = useReadContract({
    ...mintNFTContractConfig,
    functionName: 'name',
  });

  // 讀取合約符號
  const { data: contractSymbol } = useReadContract({
    ...mintNFTContractConfig,
    functionName: 'symbol',
  });

  // 讀取 NFT 的 URI
  const getTokenURI = useCallback((tokenId: bigint) => {
    return useReadContract({
      ...mintNFTContractConfig,
      functionName: 'tokenURI',
      args: [tokenId],
    });
  }, []);

  return {
    ownedTokens,
    isLoadingOwnedTokens,
    refetchOwnedTokens,
    mintNFT,
    batchMintNFTs,
    isMinting,
    contractName,
    contractSymbol,
    getTokenURI,
  };
}