import React from 'react';
import { ListedNFT } from '@/app/nft-marketplace/page';
import { formatEther } from 'viem';

interface NFTmarketModalProps {
  nft: ListedNFT;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  isBuyLoading: boolean;
}

const NFTmarketModal: React.FC<NFTmarketModalProps> = ({ nft, isOpen, onClose, onPurchase, isBuyLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">NFT #{nft.tokenId.toString()}</h2>
        <p>Price: {formatEther(nft.price)} ETH</p>
        <p>Seller: {nft.seller}</p>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={onPurchase}
            disabled={isBuyLoading}
          >
            {isBuyLoading ? 'Processing...' : 'Purchase'}
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
