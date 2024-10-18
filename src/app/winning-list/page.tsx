'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import WinnerModal from '@/components/WinnerModal';
import Navbar from '@/components/Navbar';
import { events, Event } from '@/data/event-data';
import { getEventStatus, getEventStatusDescription } from '@/lib/event-status';
import { useLotteryContractData } from '@/hooks/useLotteryContractData';
import { useNFTContractData } from '@/hooks/useNFTContractData';

const WinningList: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { 
    lotteryFinished, 
    isLoading,
    isError
  } = useLotteryContractData();
  const { 
    name, 
    saleEndTime, 
    allParticipants 
  } = useNFTContractData();

  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        const status = getEventStatus(event);
        return status === 'ended' || status === 'announced' || status === 'completed';
      })
      .sort((a, b) => {
        const dateA = new Date(a.winnersAnnouncement || '');
        const dateB = new Date(b.winnersAnnouncement || '');
        return dateB.getTime() - dateA.getTime();
      });
  }, []);
  
  const handleEventClick = (event: Event) => {
    const status = getEventStatus(event);
    if (status === 'ended' || status === 'announced' || status === 'completed') {
      setSelectedEvent(event);
    }
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Winning List</h1>
        {isLoading ? (
          <p className="text-center">Loading lottery data...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Error loading lottery data. Please try again later.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredEvents.map((event, index) => {
              let status = getEventStatus(event);
              let statusDescription = getEventStatusDescription(status);
              let participantsCount = event.currentParticipants?.toString() || 'Loading...';
              let title = event.title;
              let winnersAnnouncement = event.winnersAnnouncement;
              
              if (index === 0) {
                status = lotteryFinished ? 'announced' : 'ended';
                statusDescription = getEventStatusDescription(status);
                participantsCount = allParticipants ? allParticipants.length.toString() : 'Loading...';
                title = name || 'Loading...';
                winnersAnnouncement = saleEndTime || 'Loading...';
              }
              
              return (
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
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                      {statusDescription}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 truncate">{title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-2 font-medium">
                      Winners Announcement: {winnersAnnouncement}
                    </p>
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm sm:text-base text-blue-500 font-semibold">
                        {participantsCount} Participants
                      </span>
                      <Button onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }} className="bg-blue-600 hover:bg-blue-700 self-start mt-4">View Details</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
