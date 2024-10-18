'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import BookingModal from '@/components/BookingModal';
import { events } from '@/data/event-data';
import { useNFTContractData } from '@/hooks/useNFTContractData';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';

interface ContractEvent {
  id: number;
  title: string;
  price: string;
  totalSupply: string;
  saleEndTime: string;
  image: string;
}

const SignEvent: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<ContractEvent | null>(null);
  const [contractEvents, setContractEvents] = useState<ContractEvent[]>([]);
  const [hasDID, setHasDID] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { address } = useAccount();

  const nftData = useNFTContractData();

  useEffect(() => {
    if (address) {
      const storedDIDs = JSON.parse(localStorage.getItem('userDIDs') || '{}');
      setHasDID(!!storedDIDs[address]);
    } else {
      setHasDID(false);
    }
  }, [address]);

  useEffect(() => {
    if (nftData.name && nftData.totalSupply && nftData.price && nftData.saleEndTime) {
      const contractEvent: ContractEvent = {
        id: 1,
        title: nftData.name,
        price: nftData.price,
        totalSupply: nftData.totalSupply,
        saleEndTime: nftData.saleEndTime,
        image: events[0]?.image || ''
      };

      // 只有當新的事件與當前事件不同時才更新狀態
      setContractEvents(prevEvents => {
        if (prevEvents.length === 0 || JSON.stringify(prevEvents[0]) !== JSON.stringify(contractEvent)) {
          return [contractEvent];
        }
        return prevEvents;
      });
    }
  }, [nftData.name, nftData.totalSupply, nftData.price, nftData.saleEndTime]);

  const handleEventClick = (event: ContractEvent) => {
    if (!hasDID) {
      toast({
        title: "DID Required",
        description: "You need to register a DID before signing the event. Please go to the DID registration page.",
        variant: "destructive",
      });
      router.push('/register-did');
      return;
    }
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
        {contractEvents.map((event) => (
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
            </div>
            
            <div className="p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 truncate">{event.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2 font-medium">Sale End: {event.saleEndTime}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-blue-500 font-semibold">{event.price} ETH</span>
                <Button onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event);
                }}>Book Now</Button>
              </div>
            </div>
          </div>
        ))}
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
