'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import BookingModal from '@/components/BookingModal';
import { events, Event } from '@/data/event-data';
import { getEventStatus, getEventStatusDescription } from '@/lib/event-status';

const SignEvent: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);

  useEffect(() => {
    const filteredEvents = events.filter(event => {
      const status = getEventStatus(event);
      return status === 'upcoming' || status === 'ongoing';
    });
    
    const sortedEvents = filteredEvents.sort((a, b) => {
      const statusA = getEventStatus(a);
      const statusB = getEventStatus(b);

      if (statusA === 'ongoing' && statusB === 'upcoming') {
        return -1;
      } else if (statusA === 'upcoming' && statusB === 'ongoing') {
        return 1;
      } else {
        const dateA = new Date(a.applicationPeriod.split(' - ')[0]);
        const dateB = new Date(b.applicationPeriod.split(' - ')[0]);
        return dateA.getTime() - dateB.getTime();
      }
    });

    setActiveEvents(sortedEvents);
  }, []);

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
        {activeEvents.map((event) => (
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