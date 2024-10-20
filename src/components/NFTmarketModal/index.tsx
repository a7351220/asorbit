import React, { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NFT, getMarketplaceNFTs } from "@/data/nft-data"; 
import NFTGroupLogo from '@/components/NFTGroupLogo';

interface NFTmarketModalProps {
  nft: NFT | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

const NFTmarketModal: React.FC<NFTmarketModalProps> = ({ nft, isOpen, onClose, onPurchase }) => {
  const [showFullAddress, setShowFullAddress] = useState(false);

  if (!isOpen || !nft) return null;

  const isOnMarket = getMarketplaceNFTs().some(marketNFT => marketNFT.id === nft.id);

  if (!isOnMarket) {
    onClose();  // 如果 NFT 不在市場上，關閉模態框
    return null;
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const toggleAddress = () => {
    setShowFullAddress(!showFullAddress);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[600px] lg:max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold">{nft.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="w-full lg:w-[45%] mb-4 lg:mb-0">
            <div className="relative w-full" style={{ paddingTop: '133.33%' }}>
              <Image
                src={nft.image}
                alt={nft.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="w-full lg:w-[55%] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between  p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-3 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-300">
                    <NFTGroupLogo group={nft.group} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{nft.group}</p>
                    <p className="text-sm text-gray-600">Rarity: {nft.rarity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-blue-600">{nft.price}</p>
                  <p className="text-sm text-gray-600">Current Price</p>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Description</h3>
                <p className="text-sm mb-4">{nft.description}</p>
                
                <h3 className="font-bold mb-2 text-lg">Details</h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <p className="font-semibold">NFT ID  #{nft.tokenId}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Current Owner</p>
                    <div className="bg-white p-2 rounded-md overflow-x-auto">
                      <p 
                        className="text-gray-600 cursor-pointer hover:text-blue-500 whitespace-nowrap"
                        onClick={toggleAddress}
                        title="Click to toggle full address"
                      >
                        {nft.currentOwner 
                          ? (showFullAddress ? nft.currentOwner : truncateAddress(nft.currentOwner))
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Dates</p>
                    <p className="text-gray-600">
                      Listed: {nft.listingDate} / Expires: {nft.expirationDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button
                className="w-full text-base font-semibold py-3"
                onClick={onPurchase}
              >
                Purchase Now
              </Button>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                By purchasing, you agree to our Terms of Service and NFT Trading Policy.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NFTmarketModal;
