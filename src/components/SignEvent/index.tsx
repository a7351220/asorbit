'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { events, Event } from '@/data/event-data';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, event }) => {
  const [quantity, setQuantity] = useState(1);

  // 計算總金額
  const calculateTotalPrice = () => {
    if (!event) return 0;
    const priceValue = parseFloat(event.price.replace(' USDT', ''));
    return (priceValue * quantity).toFixed(2);
  };
  //預覽NFT
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
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-300">
          <span className="text-white text-xs opacity-0 hover:opacity-100 transition-opacity duration-300">
            NFT {index + 1}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl lg:text-2xl font-bold">{event?.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div>
            {event && <Image src={event.image} alt={event.title} width={400} height={400} className="rounded-lg w-full h-auto" />}
          </div>
          <div className="space-y-2 text-sm lg:text-base">
            <p><span className="font-semibold">Fansign Date:</span> {event?.fansignDate}</p>
            <p><span className="font-semibold">Application Period:</span><br/> {event?.applicationPeriod}</p>
            <p><span className="font-semibold">Available Slots:</span> {event?.availableSlots}</p>
            <p><span className="font-semibold">Winners Announcement:</span> {event?.winnersAnnouncement}</p>
            <p><span className="font-semibold">NFT Purchase Limit:</span> {event?.nftPurchaseLimit}</p>
            <div className="mt-4">
              <span className="font-bold">Current Participants: </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{event?.currentParticipants}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-lg lg:text-xl">{event?.price}</span>
            <div className="flex items-center border rounded">
              <button className="px-3 py-1" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="number" value={quantity} readOnly className="w-12 text-center" />
              <button className="px-3 py-1" onClick={() => setQuantity(Math.min(event?.nftPurchaseLimit || 24, quantity + 1))}>+</button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="font-bold">Total: </span>
              <span className="text-lg text-blue-600">{calculateTotalPrice()} USDT</span>
            </div>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">Add to Cart</Button>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-bold mb-3 text-lg">Random NFT Preview</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-4">
              {generateNFTPreviews()}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SignEvent: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-10">
        <span className="border-b-4 border-blue-500 pb-2">Sign Event</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="group bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer"
            onClick={() => handleEventClick(event)}
          >
            <div className="relative w-full" style={{ paddingTop: '75%' }}>
              <Image
                src={event.image}
                alt={event.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 truncate">{event.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2 font-medium">{event.date}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-blue-500 font-semibold">{event.price}</span>
                <Button onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event);
                }}>Book Now</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BookingModal
        isOpen={!!selectedEvent}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </section>
  );
};

export default SignEvent;