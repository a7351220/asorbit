import React, { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NFT } from "@/data/nft-data";
import NFTGroupLogo from '@/components/NFTGroupLogo';

interface NFTmarketModalProps {
  nft: NFT | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

const NFTmarketModal: React.FC<NFTmarketModalProps> = ({ nft, isOpen, onClose, onPurchase }) => {
  const [sellPrice, setSellPrice] = useState('');
  const [sellNotes, setSellNotes] = useState('');
  const [saleEndDate, setSaleEndDate] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  if (!isOpen || !nft) return null;

  const handleConfirmSale = () => {
    console.log('Confirming sale:', { sellPrice, sellNotes, saleEndDate });
    // Implement sale logic here
  };

  const handleConfirmRedemption = () => {
    console.log('Confirming redemption:', { recipientName, shippingAddress });
    // Implement redemption logic here
  };

  const handlePhysicalRedemption = () => {
    console.log('Initiating physical redemption');
    // Implement physical redemption logic here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[600px] lg:max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold">{nft.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <div className="relative w-full pt-[100%]">
              <Image 
                src={nft.image} 
                alt={nft.name} 
                layout="fill" 
                objectFit="cover" 
                className="rounded-lg" 
              />
            </div>
            <div className="mt-4 flex items-center">
              <div className="w-12 h-12 mr-3 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-300">
                <NFTGroupLogo group={nft.group} />
              </div>
              <div>
                <p className="font-bold">{nft.group}</p>
                <p className="text-sm text-gray-600">Current Price: {nft.price}</p>
              </div>
            </div>
            <p className="mt-4 text-sm">{nft.description}</p>
          </div>
          <div className="w-full md:w-1/2 flex flex-col space-y-4">
            <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-sm sm:text-base md:text-lg">Sell</h3>
              <div className="space-y-2">
                <Input 
                  placeholder="Set price" 
                  className="text-sm sm:text-base"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                />
                <Input 
                  placeholder="Notes" 
                  className="text-sm sm:text-base"
                  value={sellNotes}
                  onChange={(e) => setSellNotes(e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <span className="whitespace-nowrap text-sm sm:text-base">Sale end date</span>
                  <Input 
                    type="date" 
                    className="flex-grow text-sm sm:text-base"
                    value={saleEndDate}
                    onChange={(e) => setSaleEndDate(e.target.value)}
                  />
                </div>
                <Button className="w-full text-sm sm:text-base" onClick={handleConfirmSale}>Confirm Sale</Button>
              </div>
            </div>
            <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-sm sm:text-base md:text-lg">Redeem</h3>
              <div className="space-y-2">
                <Input 
                  placeholder="Recipient name" 
                  className="text-sm sm:text-base"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
                <Input 
                  placeholder="Shipping address" 
                  className="text-sm sm:text-base"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button variant="outline" className="w-full sm:w-1/2 text-sm sm:text-base" onClick={handleConfirmRedemption}>Confirm Redemption</Button>
                  <Button variant="secondary" className="w-full sm:w-1/2 text-sm sm:text-base" onClick={handlePhysicalRedemption}>Physical Redemption</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 mt-4">
          <p>* This NFT cannot be traded after redemption</p>
          <p>* Each redemption costs 0.05 ETH</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NFTmarketModal;