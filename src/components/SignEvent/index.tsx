'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import BookingModal from '@/components/BookingModal';
import { events } from '@/data/event-data';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useAccount, useReadContracts } from 'wagmi';
import { nftSaleFactoryConfig, nftSaleContractConfig } from '@/app/contracts';
import { formatEther } from 'viem';

interface ContractEvent {
  id: number;
  address: `0x${string}`;
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

  const { data: nftSalesAddresses } = useReadContracts({
    contracts: [
      {
        ...nftSaleFactoryConfig,
        functionName: 'getAllNFTSales',
      },
    ],
  });

  const { data: nftSalesData } = useReadContracts({
    contracts: nftSalesAddresses?.[0]?.result?.flatMap((address: `0x${string}`) => [
      { address, abi: nftSaleContractConfig.abi, functionName: 'name' },
      { address, abi: nftSaleContractConfig.abi, functionName: 'price' },
      { address, abi: nftSaleContractConfig.abi, functionName: 'totalSupply' },
      { address, abi: nftSaleContractConfig.abi, functionName: 'saleEndTime' },
    ]) || [],
  });

  useEffect(() => {
    if (address) {
      const storedDIDs = JSON.parse(localStorage.getItem('userDIDs') || '{}');
      setHasDID(!!storedDIDs[address]);
    } else {
      setHasDID(false);
    }
  }, [address]);

  useEffect(() => {
    if (nftSalesAddresses?.[0]?.result && nftSalesData) {
      const addresses = nftSalesAddresses[0].result as `0x${string}`[];
      const eventsData = addresses.map((address, index) => {
        const offset = index * 4;
        return {
          id: index,
          address,
          title: nftSalesData[offset]?.result as string || 'Unknown',
          price: nftSalesData[offset + 1]?.result ? formatEther(nftSalesData[offset + 1].result as bigint) : '0',
          totalSupply: nftSalesData[offset + 2]?.result ? (nftSalesData[offset + 2].result as bigint).toString() : '0',
          saleEndTime: nftSalesData[offset + 3]?.result ? new Date(Number(nftSalesData[offset + 3].result as bigint) * 1000).toLocaleString() : '',
          image: events[index % events.length]?.image || '',
        };
      });
      setContractEvents(eventsData);
    }
  }, [nftSalesAddresses, nftSalesData]);

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
        />
      )}
    </section>
  );
};

export default SignEvent;
