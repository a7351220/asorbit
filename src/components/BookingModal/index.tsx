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
import { BaseError } from 'viem';
import { useNFTContractData } from '@/hooks/useNFTContractData';

interface ContractEvent {
  id: number;
  title: string;
  price: string;
  totalSupply: string;
  saleEndTime: string;
  image: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ContractEvent | null;
  nftInfo: ReturnType<typeof useNFTContractData>;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, event, nftInfo }) => {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState('0');

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (nftInfo && nftInfo.price) {
      setQuantity(1);
      setTotalPrice(nftInfo.price);
    }
  }, [isOpen, nftInfo]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= 1 && nftInfo) {
      setQuantity(newValue);
      setTotalPrice(calculateTotalPrice(newValue));
    }
  };

  const calculateTotalPrice = (qty: number = quantity) => {
    if (!nftInfo || !nftInfo.price) return '0.0000';
    const priceValue = parseFloat(nftInfo.price);
    return (priceValue * qty).toFixed(4);
  };

  const handleMint = async () => {
    if (!nftInfo.rawPrice) return;
    writeContract({
      ...nftSaleContractConfig,
      functionName: 'mintNFT',
      args: [BigInt(quantity)],
      value: nftInfo.rawPrice * BigInt(quantity),
    });
  };

  if (!nftInfo) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] lg:max-w-[1100px] overflow-y-auto max-h-[90vh] text-base lg:text-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl lg:text-3xl font-bold">{nftInfo.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div>
            {event && <Image src={event.image} alt={nftInfo.name} width={400} height={400} className="rounded-lg w-full h-auto" />}
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold">SIGN EVENT</h3>
            <p><span className="font-semibold">Name:</span> {nftInfo.name}</p>
            <p><span className="font-semibold">Symbol:</span> {nftInfo.symbol}</p>
            <p><span className="font-semibold">Total Supply:</span> {nftInfo.totalSupply}</p>
            <p><span className="font-semibold">Price:</span> {nftInfo.price} ETH</p>
            <p><span className="font-semibold">Sale End Time:</span> {nftInfo.saleEndTime}</p>
            <div className="mt-4">
              <span className="font-semibold">Current Participants: </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{nftInfo.allParticipants?.length || 0}</span>
            </div>
            <br /><br />
            <div className="flex items-center space-x-4 mt-4">
              <span className="font-semibold text-xl">{nftInfo.price} ETH</span>
              <div className="flex items-center border rounded">
                <button className="px-3 py-1 text-xl" onClick={() => {
                  const newQty = Math.max(1, quantity - 1);
                  setQuantity(newQty);
                  setTotalPrice(calculateTotalPrice(newQty));
                }}>-</button>
                <input type="number" value={quantity} onChange={handleQuantityChange} className="w-16 text-center text-lg no-spinner" min="1"/>
                <button className="px-3 py-1 text-xl" onClick={() => {
                  const newQty = Math.min(parseInt(nftInfo.totalSupply), quantity + 1);
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
                {isPending ? 'Minting...' : `Mint NFT (${nftInfo.price} ETH each)`}
              </Button>
            </div>
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
            {error && (
              <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;