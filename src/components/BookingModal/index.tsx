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
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { nftSaleContractConfig } from '@/app/contracts'; 
import { BaseError } from 'viem';
import { useToast } from "@/hooks/use-toast"
import { formatEther, parseEther } from 'viem';

const shortenHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const getBlockExplorerLink = (hash: string) => {
  return `https://sepolia.basescan.org/tx/${hash}`;
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    address: `0x${string}`;
    title: string;
    price: string;
    totalSupply: string;
    saleEndTime: string;
    image: string;
  };
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, event }) => {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState('0');

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { toast } = useToast();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data: name } = useReadContract({
    address: event?.address,
    abi: nftSaleContractConfig.abi,
    functionName: 'name',
  });

  const { data: symbol } = useReadContract({
    address: event?.address,
    abi: nftSaleContractConfig.abi,
    functionName: 'symbol',
  });

  const { data: price } = useReadContract({
    address: event?.address,
    abi: nftSaleContractConfig.abi,
    functionName: 'price',
  });

  const { data: totalSupply } = useReadContract({
    address: event?.address,
    abi: nftSaleContractConfig.abi,
    functionName: 'totalSupply',
  });

  const { data: allParticipants } = useReadContract({
    address: event?.address,
    abi: nftSaleContractConfig.abi,
    functionName: 'getAllParticipants',
  });

  useEffect(() => {
    if (price) {
      setQuantity(1);
      setTotalPrice(formatEther(price as bigint));
    }
  }, [isOpen, price]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= 1 && price) {
      setQuantity(newValue);
      setTotalPrice(calculateTotalPrice(newValue));
    }
  };

  const calculateTotalPrice = (qty: number = quantity) => {
    if (!price) return '0.0000';
    const priceValue = parseFloat(formatEther(price as bigint));
    return (priceValue * qty).toFixed(5);
  };

  const handleMint = async () => {
    if (!price) return;
    writeContract({
      address: event.address,
      abi: nftSaleContractConfig.abi,
      functionName: 'mintNFT',
      args: [BigInt(quantity)],
      value: (price as bigint) * BigInt(quantity),
    });
  };

  useEffect(() => {
    if (hash) {
      toast({
        title: "Transaction Submitted",
        description: (
          <a href={getBlockExplorerLink(hash)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            View on BaseScan: {shortenHash(hash)}
          </a>
        ),
      })
    }
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: (
          <>
            Your NFT has been minted successfully!
            <br />
            <a href={getBlockExplorerLink(hash!)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View on BaseScan
            </a>
          </>
        ),
      })
    }
    if (error) {
      let errorMessage = (error as BaseError).shortMessage || error.message;
      
      if (errorMessage.includes("Sale has ended")) {
        errorMessage = "The sale has ended. You can no longer mint NFTs for this event.";
      }
      
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [hash, isConfirmed, error, toast]);

  const handleDecrement = () => {
    const newQty = Math.max(1, quantity - 1);
    setQuantity(newQty);
    setTotalPrice(calculateTotalPrice(newQty));
  };

  const handleIncrement = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    setTotalPrice(calculateTotalPrice(newQty));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] lg:max-w-[1100px] overflow-y-auto max-h-[90vh] text-base lg:text-lg">
        {event ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl lg:text-3xl font-bold">{name as string}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <Image src={event.image} alt={name as string} width={400} height={400} className="rounded-lg w-full h-auto" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold">SIGN EVENT</h3>
                <p><span className="font-semibold">Name:</span> {name as string}</p>
                <p><span className="font-semibold">Symbol:</span> {symbol as string}</p>
                <p><span className="font-semibold">Current Supply:</span> {totalSupply?.toString()}</p>
                <p><span className="font-semibold">Price:</span> {price ? formatEther(price as bigint) : '0'} ETH</p>
                <p><span className="font-semibold">Sale End Time:</span> {event.saleEndTime}</p>
                <div className="mt-4">
                  <span className="font-semibold">Current Participants: </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{allParticipants?.length || 0}</span>
                </div>
                <br /><br />
                <div className="flex items-center space-x-4 mt-4">
                  <span className="font-semibold text-xl">{price ? formatEther(price as bigint) : '0'} ETH</span>
                  <div className="flex items-center border rounded">
                    <button className="px-3 py-1 text-xl" onClick={handleDecrement}>-</button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={handleQuantityChange} 
                      className="w-16 text-center text-lg no-spinner" 
                      min="1"
                    />
                    <button className="px-3 py-1 text-xl" onClick={handleIncrement}>+</button>
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
                    disabled={isPending || !price}
                  >
                    {isPending ? 'Minting...' : `Mint NFT (${price ? formatEther(price as bigint) : '0'} ETH each)`}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Loading event details...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
