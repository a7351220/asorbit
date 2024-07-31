"use client";
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { events, Event } from '@/data/event-data';
import BookingModal from '@/components/BookingModal';
import { getEventStatus } from '@/lib/event-status';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const activeEvents = useMemo(() => {
    return events.filter(event => {
      const status = getEventStatus(event);
      return status === 'upcoming' || status === 'ongoing';
    });
  }, []);

  const totalSlides = Math.ceil(activeEvents.length / 2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  if (activeEvents.length === 0) {
    return <div>No active events at the moment.</div>;
  }

  return (
    <section className="relative h-[500px] overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full" 
        style={{
          transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
          width: `${totalSlides * 100}%`
        }}
      >
        {Array.from({ length: totalSlides }).map((_, slideIndex) => (
          <div key={slideIndex} className="flex w-full h-full">
            {activeEvents.slice(slideIndex * 2, slideIndex * 2 + 2).map((event) => (
              <div 
                key={event.id} 
                className="w-1/2 h-full p-2 cursor-pointer" 
                onClick={() => handleEventClick(event)}
              >
                <div className="relative h-full rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-yellow-200/20 to-pink-300/20 mix-blend-overlay z-10"></div>
                  <Image
                    src={event.image}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    className="filter contrast-100 brightness-110 saturate-70"
                    quality={100}
                    priority={slideIndex === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-20"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-30">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1 drop-shadow-lg">{event.title}</h3>
                    <p className="text-xs sm:text-sm mb-1 opacity-90 drop-shadow-md">{event.date}</p>
                    <p className="text-right text-sm sm:text-base font-semibold drop-shadow-lg">{event.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {totalSlides > 1 && (
        <>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-40">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-gray-400 hover:bg-gray-300'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          {/* 左箭頭 */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-50 hover:bg-opacity-75 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 右箭頭 */}
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-50 hover:bg-opacity-75 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <BookingModal
        isOpen={!!selectedEvent}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </section>
  );
}