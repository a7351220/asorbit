'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Event } from '@/data/event-data';
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";
import { getEventStatus, getEventStatusDescription } from '@/lib/event-status';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

// 模擬中獎名單數據
const generateWinners = (event: Event) => {
  const winners = [];
  for (let i = 0; i < event.availableSlots; i++) {
    winners.push({
      number: Math.floor(Math.random() * event.currentParticipants) + 1,
      walletAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
    });
  }
  return winners.sort((a, b) => a.number - b.number);
};

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, onClose, event }) => {
  const [isWinnersExpanded, setIsWinnersExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const { status, statusDescription, winners } = useMemo(() => {
    if (!event) {
      return { status: '', statusDescription: '', winners: [] };
    }
    const status = getEventStatus(event);
    const statusDescription = getEventStatusDescription(status);
    const winners = (status === 'announced' || status === 'completed')
      ? generateWinners(event)
      : [];
    return { status, statusDescription, winners };
  }, [event]);

  if (!event) {
    return null;
  }

  const toggleWinnersExpanded = () => {
    setIsWinnersExpanded(!isWinnersExpanded);
  };

  const handleSearch = () => {
    const searchTermLower = searchTerm.toLowerCase();
    const foundWinner = winners.find(winner => 
      winner.walletAddress.toLowerCase().includes(searchTermLower) ||
      winner.number.toString() === searchTermLower
    );

    if (foundWinner) {
      setSearchResult(`恭喜！您的錢包地址 ${foundWinner.walletAddress.slice(0, 6)}...${foundWinner.walletAddress.slice(-4)} 中獎，獲獎號碼為 ${foundWinner.number}。`);
    } else {
      setSearchResult('很抱歉，未找到匹配的中獎記錄。');
    }
  };

  // 根據狀態決定顯示內容
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
                <span>Winning Numbers and Wallet Addresses</span>
                {isWinnersExpanded ? <ChevronUp size={20} className="ml-2" /> : <ChevronDown size={20} className="ml-2" />}
              </button>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  name="search"
                  id="search"
                  className="w-60 text-sm"
                  placeholder="輸入錢包地址/號碼查詢中獎結果"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleSearch}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {searchResult && (
              <div className="px-4 py-2 bg-blue-200 text-blue-800 text-sm">
                {searchResult}
              </div>
            )}
          </div>
          {isWinnersExpanded && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {winners.map((winner, index) => (
                <div key={index} className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-sm">
                  {`${winner.number}. ${winner.walletAddress.slice(0, 6)}...${winner.walletAddress.slice(-4)}`}
                </div>
              ))}
            </div>
          )}
        </div>
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-3 text-lg">可驗證抽獎結果</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Consumer address：</span>
                <a href={`https://sepolia.etherscan.io/address/${event.contractAddress}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  {event.contractAddress}
                </a>
              </p>
              <p>
                <span className="font-semibold">Transaction Hash：</span>
                <a href={`https://sepolia.etherscan.io/tx/${event.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  {event.transactionHash}
                </a>
              </p>
              <p><a href="#" className="text-blue-600 hover:underline">查看驗證指南</a></p>
            </div>
          </div>
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
          <DialogTitle className="text-xl lg:text-2xl font-bold">{event.title} - Results</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <Image src={event.image} alt={event.title} width={400} height={400} className="rounded-lg w-full h-auto" />
          </div>
          <div className="space-y-2 text-sm lg:text-base">
            <p><span className="font-semibold">Status:</span> {statusDescription}</p>
            <p><span className="font-semibold">Fansign Date:</span> {event.fansignDate}</p>
            <p><span className="font-semibold">Available Slots:</span> {event.availableSlots}</p>
            <p><span className="font-semibold">Total Participants:</span> {event.currentParticipants}</p>
            <p><span className="font-semibold">Winners Announcement:</span> {event.winnersAnnouncement}</p>
          </div>
        </div>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default WinnerModal;