import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NFTGroupLogo from '@/components/NFTGroupLogo';
import { NFT } from "@/data/nft-data"; 

interface NFTDetailModalProps {
  nft: NFT | null;
  isOpen: boolean;
  onClose: () => void;
  transactionHash?: string;
}

const NFTDetailModal: React.FC<NFTDetailModalProps> = ({ nft, isOpen, onClose, transactionHash }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showFullHash, setShowFullHash] = useState(false);

  if (!isOpen || !nft) return null;

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const toggleHash = () => {
    setShowFullHash(!showFullHash);
  };
  
  console.log("Transaction Hash in Modal:", transactionHash);


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
                      <p className="font-semibold">NFT ID #{nft.id}</p>
                    </div>
                    {transactionHash && (
                      <div>
                        <p className="font-semibold">Transaction Hash</p>
                        <div className="bg-white p-2 rounded-md overflow-x-auto">
                          <Link
                            href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-blue-500 whitespace-nowrap"
                          >
                            <p 
                              onClick={toggleHash}
                              title="Click to toggle full hash"
                            >
                              {showFullHash ? transactionHash : truncateHash(transactionHash)}
                            </p>
                          </Link>
                        </div>
                      </div>
                    )}
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