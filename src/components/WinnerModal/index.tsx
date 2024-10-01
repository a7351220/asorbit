'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Event } from '@/data/event-data';
import { Button } from "@/components/ui/button";
import { getEventStatus, getEventStatusDescription } from '@/lib/event-status';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useLotteryContractData } from '@/hooks/useLotteryContractData';
import { useNFTContractData } from '@/hooks/useNFTContractData';
import { useAccount } from 'wagmi';
import { nftSaleContractConfig } from '@/app/contracts';

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, onClose, event }) => {
  const { address } = useAccount();
  
  const [isWinnersExpanded, setIsWinnersExpanded] = useState(false);
  const [isAllParticipantsExpanded, setIsAllParticipantsExpanded] = useState(false);

  const { 
    winners, 
    winnerTokenIds, 
    limitedEditionTokenIds,
    lotteryFinished,
    totalWeight,
    refreshLotteryData,
  } = useLotteryContractData();

  const { 
    name, 
    symbol, 
    totalSupply, 
    price, 
    saleEndTime, 
    rawPrice,
    rawSaleEndTime,
    allParticipants,
    participantInfo
  } = useNFTContractData();

  const toggleWinnersExpanded = () => setIsWinnersExpanded(!isWinnersExpanded);
  const toggleAllParticipantsExpanded = () => setIsAllParticipantsExpanded(!isAllParticipantsExpanded);

  const status = event ? getEventStatus(event) : '';
  const statusDescription = getEventStatusDescription(status as 'upcoming' | 'ongoing' | 'ended' | 'completed' | 'announced');

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openContractOnBasescan = () => {
    const baseUrl = "https://sepolia.basescan.org/address/";
    const contractAddress = nftSaleContractConfig.address;
    window.open(`${baseUrl}${contractAddress}`, '_blank');
  };

  const renderParticipantInfo = () => {
    if (!address || !participantInfo) return null;

    const [purchaseCount, tokenCount, tokenIds] = participantInfo;
    const isWinner = winners?.includes(address);

    return (
      <div className="mt-6 bg-yellow-100 text-yellow-800 p-4 rounded-lg">
        <h2 className="font-bold mb-2">Your Participant Info</h2>
        <p>Address: {shortenAddress(address)}</p>
        <p>Purchase Count: {purchaseCount.toString()}</p>
        <p>Token Count: {tokenCount.toString()}</p>
        <p>Token IDs: {tokenIds.join(', ')}</p>
        {isWinner && (
          <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-lg">
            <p className="font-bold">Congratulations! 🎉</p>
            <p>You are one of the winners!</p>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (status === 'announced' || status === 'completed') {
      return (
        <>
          <div className="mt-6">
            <div className="bg-blue-100 text-blue-800 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2">
                <button 
                  onClick={toggleWinnersExpanded}
                  className="flex items-center font-bold"
                >
                  <span>Lottery Results</span>
                  {isWinnersExpanded ? <ChevronUp size={20} className="ml-2" /> : <ChevronDown size={20} className="ml-2" />}
                </button>
              </div>
            </div>
            {isWinnersExpanded && (
              <div className="mt-2 bg-blue-50 p-4 rounded-lg">
                {winners && winners.length > 0 ? (
                  <div>
                    <h4 className="font-bold mb-2">Winners:</h4>
                    <ul className="list-disc pl-5">
                      {winners.map((winner, index) => (
                        <li key={index} className="mb-1">
                          {winner} - Token ID: {winnerTokenIds?.[index]?.toString()}
                          {limitedEditionTokenIds?.includes(winnerTokenIds?.[index] || BigInt(0)) && " (Limited Edition)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No winners yet</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="bg-purple-100 text-purple-800 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2">
                <button 
                  onClick={toggleAllParticipantsExpanded}
                  className="flex items-center font-bold"
                >
                  <span>All Participants</span>
                  {isAllParticipantsExpanded ? <ChevronUp size={20} className="ml-2" /> : <ChevronDown size={20} className="ml-2" />}
                </button>
              </div>
            </div>
            {isAllParticipantsExpanded && (
              <div className="mt-2 bg-purple-50 p-4 rounded-lg">
                <ul className="list-disc pl-5 max-h-60 overflow-y-auto">
                  {allParticipants?.map((participant, index) => (
                    <li key={index}>{participant}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {renderParticipantInfo()}
        </>
      );
    } else if (status === 'ended') {
      return (
        <div className="mt-6">
          <p className="text-xl lg:text-2xl font-semibold text-blue-600">Winners will be announced soon.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl lg:text-2xl font-bold">
            {event?.id === 1 ? name || 'Loading...' : event?.title} - Results
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <Image src={event?.image || ''} alt={event?.title || ''} width={400} height={400} className="rounded-lg w-full h-auto" />
          </div>
          <div className="space-y-2 text-sm lg:text-base">
            <p><span className="font-semibold">Status:</span> {statusDescription}</p>
            {/* <p><span className="font-semibold">Fansign Date:</span> {event?.fansignDate}</p>
            <p><span className="font-semibold">Available Slots:</span> {event?.availableSlots}</p> */}
            <p><span className="font-semibold">Total Participants:</span> {allParticipants?.length || 0}</p>
            <p><span className="font-semibold">Winners Announcement:</span> {saleEndTime}</p>

          </div>
        </div>
        {renderContent()}
        <div className="mt-4 flex flex-col space-y-4">
          <Button onClick={refreshLotteryData}>Refresh Lottery Data</Button>
          <Button 
            onClick={openContractOnBasescan}
            className="flex items-center justify-center"
          >
            View Contract on Basescan
            <ExternalLink size={16} className="ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerModal;