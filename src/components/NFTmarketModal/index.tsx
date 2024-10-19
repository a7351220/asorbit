import React from 'react';
import { ListedNFT } from '@/app/nft-marketplace/page';
import { formatEther } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { nftSaleContractConfig } from '@/app/contracts';
import { useToast } from "@/hooks/use-toast";
import { BaseError } from 'viem';

interface NFTmarketModalProps {
  nft: ListedNFT;
  isOpen: boolean;
  onClose: () => void;
}

const NFTmarketModal: React.FC<NFTmarketModalProps> = ({ nft, isOpen, onClose }) => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { toast } = useToast();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePurchase = async () => {
    try {
      await writeContract({
        address: nft.contractAddress,
        abi: nftSaleContractConfig.abi,
        functionName: 'buyNFT',
        args: [nft.tokenId],
        value: nft.price,
      });
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };

  React.useEffect(() => {
    if (hash) {
      toast({
        title: "Transaction Submitted",
        description: (
          <a href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            View on BaseScan: {hash.slice(0, 6)}...{hash.slice(-4)}
          </a>
        ),
      });
    }
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "You have successfully purchased the NFT!",
      });
      onClose();
    }
    if (error) {
      let errorMessage = (error as BaseError).shortMessage || error.message;
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [hash, isConfirmed, error, toast, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{nft.name} #{nft.tokenId.toString()}</h2>
        <p>Price: {formatEther(nft.price)} ETH</p>
        <p>Seller: {nft.seller}</p>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={handlePurchase}
            disabled={isPending || isConfirming}
          >
            {isPending || isConfirming ? 'Processing...' : 'Purchase'}
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTmarketModal;
