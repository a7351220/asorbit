'use client';
import React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Event } from '@/data/event-data';

// 模擬中獎名單數據
const generateWinners = (event: Event) => {
  const winners = [];
  for (let i = 0; i < event.availableSlots; i++) {
    winners.push(Math.floor(Math.random() * event.currentParticipants) + 1);
  }
  return winners.sort((a, b) => a - b);
};

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, onClose, event }) => {
  const winners = event ? generateWinners(event) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl lg:text-2xl font-bold">{event?.title} - Winners</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div>
            {event && <Image src={event.image} alt={event.title} width={400} height={400} className="rounded-lg w-full h-auto" />}
          </div>
          <div className="space-y-2 text-sm lg:text-base">
            <p><span className="font-semibold">Fansign Date:</span> {event?.fansignDate}</p>
            <p><span className="font-semibold">Available Slots:</span> {event?.availableSlots}</p>
            <p><span className="font-semibold">Total Participants:</span> {event?.currentParticipants}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-bold mb-3 text-lg">Winning Numbers</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {winners.map((winner, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-center">
                {winner}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerModal;