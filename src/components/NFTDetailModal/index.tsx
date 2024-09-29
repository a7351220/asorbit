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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NFTGroupLogo from '@/components/NFTGroupLogo';

interface NFTDetailModalProps {
  nft: NFT | null;
  isOpen: boolean;
  onClose: () => void;
}

const NFTDetailModal: React.FC<NFTDetailModalProps> = ({ nft, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showFullAddress, setShowFullAddress] = useState(false);

  if (!isOpen || !nft) return null;

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
          <div className="w-full lg:w-[55%] flex flex-col">
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
                <TabsTrigger value="redeem">Redeem</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg mb-4">
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
                  <p className="text-sm text-gray-600">Purchase Price</p>
                </div>
              </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-lg">Details</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <p className="font-semibold">NFT ID #{nft.tokenId}</p>
                    </div>
                    
                    {nft.purchaseDate && (
                      <div>
                        <p className="font-semibold">Purchase Date</p>
                        <p className="text-gray-600">{nft.purchaseDate}</p>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">transaction contract address</p>
                      <div className="bg-white p-2 rounded-md overflow-x-auto">
                      <p 
                        className="text-gray-600 cursor-pointer hover:text-blue-500 whitespace-nowrap"
                        onClick={toggleAddress}
                        title="Click to toggle full address"
                      >
                        {showFullAddress ? '0xb0a7ff2181df295f45864e2c9e077ecdc43e872cd075de88826c8a49950343a1' : truncateAddress('0xb0a7ff2181df295f45864e2c9e077ecdc43e872cd075de88826c8a49950343a1')}
                      </p>
                    </div>
                    </div>
                  
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sell" className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-4 text-lg">Sell Your NFT</h3>
                  <div className="space-y-4">
                    <Input placeholder="Set price" />
                    <Input placeholder="Notes" />
                    <div className="flex items-center space-x-2">
                      <span className="whitespace-nowrap">Sale end date</span>
                      <Input type="date" className="flex-grow" />
                    </div>
                    <Button className="w-full">Confirm Sale</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="redeem" className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-4 text-lg">Redeem Your NFT</h3>
                  <div className="space-y-4">
                    <Input placeholder="Recipient name" />
                    <Input placeholder="Shipping address" />
                    <div className="flex space-x-2">
                      <Button className="w-full">Confirm Redemption</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-xs text-gray-500 mt-4">
              <p>* This NFT cannot be traded after redemption</p>
              <p>* Each redemption costs 0.05 ETH</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NFTDetailModal;