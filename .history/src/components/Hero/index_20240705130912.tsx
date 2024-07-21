"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

const events = [
  { id: 1, title: 'FANSIGN EVENT', date: '241013 TAIPEI', price: '0.01 ETH' },
  { id: 2, title: 'SVT FANSIGN EVENT', date: '241108 TAIPEI', price: '0.02 ETH' },
  { id: 3, title: 'AESPA FANSIGN EVENT', date: '241110 TAIPEI', price: '0.03 ETH' },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % events.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-64 sm:h-80 md:h-96 lg:h-112 xl:h-128 rounded-lg overflow-hidden">
      {events.map((event, index) => (
        <div
          key={event.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
          <Image
            src={`/event-${event.id}.jpg`}
            alt={event.title}
            layout="fill"
            objectFit="cover"
            className="filter brightness-110 contrast-105 saturate-105"
            quality={100}
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-shadow">{event.title}</h3>
            <p className="text-sm sm:text-base mb-1 opacity-90">{event.date}</p>
            <p className="text-right text-lg sm:text-xl font-semibold text-shadow">{event.price}</p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {events.map((_, index) => (
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