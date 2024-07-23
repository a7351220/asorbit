"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

const events = [
  { id: 1, title: '(G)I-DLE-MEET & CALL EVENT', date: '241013 TAIPEI', price: '10 USDT' },
  { id: 2, title: 'SVT FANSIGN EVENT', date: '241108 TAIPEI', price: '0.02 ETH' },
  { id: 3, title: 'AESPA FANSIGN EVENT', date: '241110 TAIPEI', price: '0.03 ETH' },
  { id: 4, title: 'NEW EVENT', date: '241225 TAIPEI', price: '0.04 ETH' },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(events.length / 2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  return (
    <section className="relative h-[500px] overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full" 
        style={{
          transform: `translateX(-${currentSlide * 50}%)`,
          width: `${events.length * 50}%`
        }}
      >
        {events.map((event, index) => (
          <div key={event.id} className="w-1/2 h-full p-2">
            <div className="relative h-full rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-200/20 to-pink-300/20 mix-blend-overlay z-10"></div>
              <Image
                src={`/event-${event.id}.jpg`}
                alt={event.title}
                layout="fill"
                objectFit="cover"
                className="filter sepia-[0.15] contrast-125 brightness-110 saturate-90"
                quality={100}
                priority={index < 2}
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
    </section>
  );
}