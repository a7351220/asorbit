'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import BookingModal from '@/components/BookingModal';
import { events, Event } from '@/data/event-data';
import { getEventStatus, getEventStatusDescription } from '@/lib/event-status';
import { useNFTContractData } from '@/hooks/useNFTContractData';

interface ContractEvent extends Event {
  totalSupply: string;
  saleEndTime: string;
  isDeployed: boolean;
}

const SignEvent: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<ContractEvent | null>(null);
  const [activeEvents, setActiveEvents] = useState<ContractEvent[]>([]);

  const nftData = useNFTContractData();

  const contractEvent = useMemo(() => {
    if (nftData.name && nftData.totalSupply && nftData.price && nftData.saleEndTime) {
      const matchedEvent = events.find(e => e.title.toLowerCase().includes(nftData.name.toLowerCase()));
      if (matchedEvent) {
        const updatedEvent = {
          ...matchedEvent,
          price: nftData.price,
          totalSupply: nftData.totalSupply,
          saleEndTime: nftData.saleEndTime,
          isDeployed: true,
        } as ContractEvent;
        return updatedEvent;
      }
    }
    return null;
  }, [nftData.name, nftData.totalSupply, nftData.price, nftData.saleEndTime]);

  useEffect(() => {
    const updatedEvents: ContractEvent[] = events.map(event => {
      if (contractEvent && event.id === contractEvent.id) {
        return contractEvent;
      }
      return {
        ...event,
        totalSupply: 'N/A',
        saleEndTime: 'N/A',
        isDeployed: false,
      };
    });

    const filteredEvents = updatedEvents.filter(event => {
      const status = getEventStatus(event);
      console.log(`Event: ${event.title}, Status: ${status}`);
      return status === 'upcoming' || status === 'ongoing'|| event.isDeployed;;
    });
    
    const sortedEvents = filteredEvents.sort((a, b) => {
      if (a.isDeployed && !b.isDeployed) return -1;
      if (!a.isDeployed && b.isDeployed) return 1;
      
      const statusA = getEventStatus(a);
      const statusB = getEventStatus(b);

      if (statusA === 'ongoing' && statusB === 'upcoming') return -1;
      if (statusA === 'upcoming' && statusB === 'ongoing') return 1;
      
      const dateA = new Date(a.applicationPeriod?.split(' - ')[0] || '');
      const dateB = new Date(b.applicationPeriod?.split(' - ')[0] || '');
      return dateA.getTime() - dateB.getTime();
    });
    setActiveEvents(sortedEvents);
  }, [contractEvent]);

  const handleEventClick = (event: ContractEvent) => {
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
        {activeEvents.map((event) => {
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
                {getEventStatusDescription(getEventStatus(event))}
              </div>
              {!event.isDeployed && (
                <div className="absolute bottom-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                  Coming Soon
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 truncate">{event.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2 font-medium">
                {event.saleEndTime !== 'N/A' ? `Sale End: ${event.saleEndTime}` : event.date}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-blue-500 font-semibold">{event.price} ETH</span>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event);
                  }}
                  disabled={!event.isDeployed}
                >
                  {event.isDeployed ? 'Book Now' : 'View Details'}
                </Button>
              </div>
            </div>
          </div>
        )})}
      </div>
      {selectedEvent && (
        <BookingModal
          isOpen={!!selectedEvent}
          onClose={handleCloseModal}
          event={selectedEvent}
          nftInfo={nftData}
        />
      )}
    </section>
  );
};

export default SignEvent;