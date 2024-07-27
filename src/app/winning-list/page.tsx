'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import WinnerModal from '@/components/WinnerModal';
import Navbar from '@/components/Navbar';
import { events, Event } from '@/data/event-data';

const WinningList: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-10">
          <span className="border-b-4 border-blue-500 pb-2">Winning List</span>
        </h1>
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
                <p className="text-sm sm:text-base text-gray-600 mb-2 font-medium">
                  Winners Announcement: {event.winnersAnnouncement}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-blue-500 font-semibold">{event.availableSlots} Winners</span>
                  <Button onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event);
                  }} className="bg-blue-600 hover:bg-blue-700">View Winners</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <WinnerModal
        isOpen={!!selectedEvent}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </div>
  );
};

export default WinningList;