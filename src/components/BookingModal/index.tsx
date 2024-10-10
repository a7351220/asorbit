'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { nftSaleContractConfig } from '@/app/contracts'; 
import { useNFTContractData } from '@/hooks/useNFTContractData';
import { Event } from '@/data/event-data';
import TransactionModal from '@/components/TransactionModal'; 

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  nftInfo: ReturnType<typeof useNFTContractData>;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, event, nftInfo }) => {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState('0');
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const isDeployed = event?.isDeployed ?? false;

  useEffect(() => {
    if (hash) {
      setShowTransactionModal(true);
    }
  }, [hash]);

  useEffect(() => {
    if (isDeployed && nftInfo.price) {
      setQuantity(1);
      setTotalPrice(nftInfo.price);
    }
  }, [isDeployed, nftInfo.price]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDeployed) return;
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= 1) {
      setQuantity(newValue);
      setTotalPrice(calculateTotalPrice(newValue));
    }
  };

  const calculateTotalPrice = (qty: number = quantity) => {
    if (!isDeployed || !nftInfo.price) return '0.0000';
    const priceValue = parseFloat(nftInfo.price);
    return (priceValue * qty).toFixed(4);
  };

  const handleMint = async () => {
    if (!isDeployed || !nftInfo.rawPrice) return;
    writeContract({
      ...nftSaleContractConfig,
      functionName: 'mintNFT',
      args: [BigInt(quantity)],
      value: nftInfo.rawPrice * BigInt(quantity),
    });
  };

  const closeTransactionModal = () => {
    setShowTransactionModal(false);
    if (isConfirmed) {
      onClose();
    }
  };

  const generateNFTPreviews = () => {
    if (!event || !event.nftImages) return null;
    
    return event.nftImages.map((imageUrl, index) => (
      <div key={index} className="relative w-full pb-[133.33%] bg-gray-200 rounded-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={`NFT ${index + 1}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
    ));
  };

  if (!event) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] lg:max-w-[1100px] overflow-y-auto max-h-[90vh] text-base lg:text-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl lg:text-3xl font-bold">Event Not Found</DialogTitle>
          </DialogHeader>
          <p>Sorry, the event information is not available.</p>
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] lg:max-w-[1100px] overflow-y-auto max-h-[90vh] text-base lg:text-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl lg:text-3xl font-bold">{event.title}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <Image src={event.image} alt={event.title} width={400} height={400} className="rounded-lg w-full h-auto" />
            </div>
            <div className="space-y-3">
              <p><span className="font-semibold">Fansign Date:</span> {event.fansignDate}</p>
              <p><span className="font-semibold">Application Period:</span> {event.applicationPeriod}</p>
              <p><span className="font-semibold">Winners Announcement:</span> {event.winnersAnnouncement}</p>
              <p><span className="font-semibold">NFT Purchase Limit:</span> {event.nftPurchaseLimit}</p>
              {isDeployed ? (
                <>
                  <p><span className="font-semibold">Available Slots:</span> {nftInfo.totalSupply}</p>
                  <p><span className="font-semibold">Sale End Time:</span> {nftInfo.saleEndTime}</p>
                  <div className="mt-4">
                    <span className="font-semibold">Current Participants: </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{nftInfo.allParticipants?.length || 0}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-4">
                    <span className="font-semibold text-xl">{nftInfo.price} ETH</span>
                    <div className="flex items-center border rounded">
                      <button className="px-3 py-1 text-xl" onClick={() => {
                        const newQty = Math.max(1, quantity - 1);
                        setQuantity(newQty);
                        setTotalPrice(calculateTotalPrice(newQty));
                      }}>-</button>
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={handleQuantityChange} 
                        className="w-16 text-center text-lg no-spinner" 
                        min="1" 
                        max={event.nftPurchaseLimit || Number(nftInfo.totalSupply)}
                      />
                      <button className="px-3 py-1 text-xl" onClick={() => {
                        const newQty = Math.min(event.nftPurchaseLimit || Number(nftInfo.totalSupply), quantity + 1);
                        setQuantity(newQty);
                        setTotalPrice(calculateTotalPrice(newQty));
                      }}>+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="font-semibold text-2xl">Total: </span>
                      <span className="text-2xl text-blue-600">{totalPrice} ETH</span>
                    </div>
                    <Button 
                      onClick={handleMint}
                      className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-2" 
                      disabled={isPending || !nftInfo.rawPrice}
                    >
                      {isPending ? 'Minting...' : 'Mint NFT'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-yellow-600 font-semibold">This event's contract has not been deployed yet.</p>
                  <Button 
                    className="bg-gray-400 hover:bg-gray-500 text-lg px-6 py-2 mt-4" 
                    disabled
                  >
                    Coming Soon
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="mt-8">
            <h3 className="font-bold mb-4 text-xl">Random NFT Preview</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {generateNFTPreviews()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={closeTransactionModal}
        hash={hash}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error as Error | null}
      />
    </>
  );
};

export default BookingModal;