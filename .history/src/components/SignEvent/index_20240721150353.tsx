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

interface Event {
  id: number;
  title: string;
  date: string;
  price: string;
  image: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const events: Event[] = [
  { id: 1, title: 'ATEEZ FANSIGN EVENT', date: '241013 TAIPEI', price: '0.01 ETH', image: '/event-1.jpg' },
  { id: 2, title: 'SVT FANSIGN EVENT', date: '241108 TAIPEI', price: '0.02 ETH', image: '/event-2.jpg' },
  { id: 3, title: 'AESPA FANSIGN EVENT', date: '241110 TAIPEI', price: '0.03 ETH', image: '/event-3.jpg' },
  // ... other events
];

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, event }) => {
  const [quantity, setQuantity] = useState(1);

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
            <p><span className="font-semibold">Fansign Date:</span> October 13, 2024 (Sun) 13:30-17:00</p>
            <p><span className="font-semibold">Application Period:</span> October 2, 2024 11:00 - October 5, 2024 23:59</p>
            <p><span className="font-semibold">Available Slots:</span> 50</p>
            <p><span className="font-semibold">Winners Announcement:</span> October 7, 2024 15:00 (NFT viewable after announcement)</p>
            <p><span className="font-semibold">NFT Purchase Limit:</span> 24</p>
            <div className="mt-4">
              <span className="font-bold">Current Participants: </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">136</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-lg lg:text-xl">{event?.price}</span>
            <div className="flex items-center border rounded">
              <button className="px-3 py-1" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="number" value={quantity} readOnly className="w-12 text-center" />
              <button className="px-3 py-1" onClick={() => setQuantity(Math.min(24, quantity + 1))}>+</button>
            </div>
          </div>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">Add to Cart</Button>
        </div>
        <div className="mt-6">
          <h3 className="font-bold mb-3 text-lg">Random NFT Preview</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="w-12 h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SignEvent: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleBookNow = (event: Event) => {
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
          <div key={event.id} className="group bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
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
                <Button onClick={() => handleBookNow(event)}>Book Now</Button>
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