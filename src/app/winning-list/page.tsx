'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import WinnerModal from '@/components/WinnerModal';
import Navbar from '@/components/Navbar';
import { getEventStatusDescription } from '@/lib/event-status';
import { useLotteryContractData } from '@/hooks/useLotteryContractData';
import { useNFTContractData } from '@/hooks/useNFTContractData';
import { useReadContracts } from 'wagmi';
import { nftSaleFactoryConfig, nftSaleContractConfig } from '@/app/contracts';
import { formatEther } from 'viem';
import { events } from '@/data/event-data';

interface ContractEvent {
  id: number;
  address: `0x${string}`;
  title: string;
  price: string;
  totalSupply: string;
  saleEndTime: string;
  status: 'upcoming' | 'ongoing' | 'ended' | 'announced' | 'completed';
  image: string;
}

const WinningList: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<ContractEvent | null>(null);
  const [contractEvents, setContractEvents] = useState<ContractEvent[]>([]);
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
    if (nftSalesAddresses?.[0]?.result && nftSalesData) {
      const addresses = nftSalesAddresses[0].result as `0x${string}`[];
      const eventsData = addresses.map((address, index) => {
        const offset = index * 4;
        const currentTime = Date.now();
        const endTime = Number(nftSalesData[offset + 3]?.result as bigint) * 1000;
        let status: ContractEvent['status'] = 'ongoing';
        if (currentTime > endTime) {
          status = lotteryFinished ? 'announced' : 'ended';
        } else if (currentTime < endTime) {
          status = 'upcoming';
        }
        return {
          id: index,
          address,
          title: nftSalesData[offset]?.result as string || 'Unknown',
          price: nftSalesData[offset + 1]?.result ? formatEther(nftSalesData[offset + 1].result as bigint) : '0',
          totalSupply: nftSalesData[offset + 2]?.result ? (nftSalesData[offset + 2].result as bigint).toString() : '0',
          saleEndTime: nftSalesData[offset + 3]?.result ? new Date(Number(nftSalesData[offset + 3].result as bigint) * 1000).toLocaleString() : '',
          status,
          image: events[index % events.length]?.image || '',
        };
      });
      setContractEvents(eventsData);
    }
  }, [nftSalesAddresses, nftSalesData, lotteryFinished]);

  const filteredEvents = useMemo(() => {
    return contractEvents.sort((a, b) => {
      const dateA = new Date(a.saleEndTime);
      const dateB = new Date(b.saleEndTime);
      return dateB.getTime() - dateA.getTime();
    });
  }, [contractEvents]);
  
  const handleEventClick = (event: ContractEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Event List</h1>
        {isLoading ? (
          <p className="text-center">Loading event data...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Error loading event data. Please try again later.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredEvents.map((event) => {
              const statusDescription = getEventStatusDescription(event.status);
              
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
                    <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 truncate">{event.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-2 font-medium">
                      Sale End: {event.saleEndTime}
                    </p>
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm sm:text-base text-blue-500 font-semibold">
                        Total Supply: {event.totalSupply}
                      </span>
                      <span className="text-sm sm:text-base text-blue-500 font-semibold">
                        Price: {event.price} ETH
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
        event={selectedEvent as any}
      />
    </div>
  );
};

export default WinningList;
