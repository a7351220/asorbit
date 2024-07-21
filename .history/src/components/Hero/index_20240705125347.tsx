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
    }, 5000); // 每5秒切換一次圖片

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="p-8 relative h-96">
      <div className="flex justify-between items-center h-full">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={`/event-${event.id}.jpg`}
              alt={event.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <h3 className="text-xl font-bold">{event.title}</h3>
              <p>{event.date}</p>
              <p className="text-right">{event.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}