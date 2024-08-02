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
import { Event } from '@/data/event-data';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, event }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [isOpen]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= 1) {
      setQuantity(newValue);
    }
  };
  
  const calculateTotalPrice = () => {
    if (!event) return 0;
    const priceValue = parseFloat(event.price.replace(' USDT', ''));
    return (priceValue * quantity).toFixed(2);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] lg:max-w-[1100px] overflow-y-auto max-h-[90vh] text-base lg:text-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl lg:text-3xl font-bold">{event?.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div>
            {event && <Image src={event.image} alt={event.title} width={400} height={400} className="rounded-lg w-full h-auto" />}
          </div>
          <div className="space-y-3">
            <p><span className="font-semibold">Fansign Date:</span> {event?.fansignDate}</p>
            <p><span className="font-semibold">Application Period:</span> {event?.applicationPeriod}</p>
            <p><span className="font-semibold">Available Slots:</span> {event?.availableSlots}</p>
            <p><span className="font-semibold">Winners Announcement:</span> {event?.winnersAnnouncement}</p>
            <p><span className="font-semibold">NFT Purchase Limit:</span> {event?.nftPurchaseLimit}</p>
            <div className="mt-4">
              <span className="font-semibold">Current Participants: </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{event?.currentParticipants}</span>
            </div>
            <br /><br />
            <div className="flex items-center space-x-4 mt-4">
              <span className="font-semibold text-xl">{event?.price}</span>
              <div className="flex items-center border rounded">
                <button className="px-3 py-1 text-xl" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input type="number" value={quantity} onChange={handleQuantityChange} className="w-16 text-center text-lg no-spinner" min="1"/>
                <button className="px-3 py-1 text-xl" onClick={() => setQuantity(Math.min(event?.nftPurchaseLimit || 24, quantity + 1))}>+</button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="font-semibold text-2xl">Total: </span>
                <span className="text-2xl text-blue-600">{calculateTotalPrice()} USDT</span>
              </div>
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-2">Add to Cart</Button>
            </div>
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
  );
};

export default BookingModal;