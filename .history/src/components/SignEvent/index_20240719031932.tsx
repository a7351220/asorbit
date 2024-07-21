import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const events = [
  { id: 1, title: 'ATEEZ FANSIGN EVENT', date: '241013 TAIPEI', price: '0.01 ETH', image: '/event-1.jpg' },
  { id: 2, title: 'SVT FANSIGN EVENT', date: '241108 TAIPEI', price: '0.02 ETH', image: '/event-2.jpg' },
  { id: 3, title: 'AESPA FANSIGN EVENT', date: '241110 TAIPEI', price: '0.03 ETH', image: '/event-3.jpg' },
];

const BookingModal = ({ isOpen, onClose, event }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event?.title}</DialogTitle>
          <DialogDescription>{event?.date}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <img src={event?.image} alt={event?.title} className="w-full h-48 object-cover rounded-lg" />
          <p>簽售日期: 2024年10月13日(日)13:30~17:00</p>
          <p>應募期間: 2024年10月2號 11:00 ~ 2024年10月5號 23:59</p>
          <p>應募人數: 50名</p>
          <p>中獎名單公佈: 2024年10月7號 15:00 (名單公佈後即可查看NFT)</p>
          <p>限購NFT數量: 24</p>
          <p>競爭目前參與人數: 136名</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">{event?.price}</span>
          <div>
            <Button className="mr-2" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button>Book Now</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function SignEvent() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleBookNow = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <section className="py-12">
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
}