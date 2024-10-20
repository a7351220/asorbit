export interface Event {
  id: number;
  title: string;
  date?: string;
  price: string;
  image: string;
  fansignDate?: string;
  applicationPeriod?: string;
  availableSlots?: number;
  winnersAnnouncement?: string;
  nftPurchaseLimit?: number;
  currentParticipants?: number;
  member?: number;
  nftImages?: string[];
  contractAddress?: string;
  transactionHash?: string;
  isDeployed?: boolean;
  currentOwner?: string;
}

export const events: Event[] = [
  { 
    id: 1, 
    title: '(G)I-DLE-MEET & CALL EVENT', 
    date: '2024.10.26(SAT) 13:00 TAIPEI', 
    price: '15 USDT', 
    image: '/event/1/event-1.jpg', 
    fansignDate: '2024.10.26 13:00-17:00', 
    applicationPeriod: '2024.10.10 11:00 - 2024.10.17 23:59', 
    availableSlots: 50, 
    winnersAnnouncement: '2024.10.20 15:00', 
    nftPurchaseLimit: 24, 
    currentParticipants: 136,
    member: 5,
    nftImages: ['/event/1/1.jpg', '/event/1/2.jpg', '/event/1/3.jpg', '/event/1/4.jpg', '/event/1/5.jpg']
  },
  { 
    id: 2, 
    title: 'H1KEY PRE-ORDER MEET&CALL EVENT', 
    date: '2024.10.19(SAT) 14:00 TAIPEI', 
    price: '10 USDT', 
    image: '/event/2/event-2.jpg', 
    fansignDate: '2024.10.19 14:00-18:00', 
    applicationPeriod: '2024.10.01 10:00 - 2024.10.10 23:59', 
    availableSlots: 40, 
    winnersAnnouncement: '2024.10.13 12:00', 
    nftPurchaseLimit: 20, 
    currentParticipants: 98,
    member: 4,
    nftImages: ['/event/2/1.jpg', '/event/2/2.jpg', '/event/2/3.jpg', '/event/2/4.jpg']
  },
  { 
    id: 3, 
    title: 'ATEEZ LUCKY DRAW EVENT ', 
    date: '2024.10.27(SUN) 18:00 TAIPEI', 
    price: '12 USDT', 
    image: '/event/3/event-3.jpg', 
    fansignDate: '2024.10.27 18:00-22:00', 
    applicationPeriod: '2024.10.10 09:00 - 2024.10.20 23:59', 
    availableSlots: 60, 
    winnersAnnouncement: '2024.10.23 15:00', 
    nftPurchaseLimit: 30, 
    currentParticipants: 215,
    member: 8,
    nftImages: ['/event/3/1.jpg', '/event/3/2.jpg', '/event/3/3.jpg', '/event/3/4.jpg', '/event/3/5.jpg', '/event/3/6.jpg', '/event/3/7.jpg', '/event/3/8.jpg']
  },
  { 
    id: 4, 
    title: 'IVE ONLINE LUCKY DRAW EVENT', 
    date: '2024.10.30(WED) 15:00-19:00', 
    price: '7 USDT', 
    image: '/event/4/event-4.jpg', 
    fansignDate: '2024.10.30 15:00-19:00', 
    applicationPeriod: '2024.10.15 00:00 - 2024.10.22 23:59', 
    availableSlots: 100, 
    winnersAnnouncement: '2024.10.25 12:00', 
    nftPurchaseLimit: 50, 
    currentParticipants: 432,
    member: 6,
    nftImages: ['/event/4/1.jpg', '/event/4/2.jpg', '/event/4/3.jpg', '/event/4/4.jpg', '/event/4/5.jpg', '/event/4/6.jpg']
  },
  { 
    id: 5, 
    title: 'TWS LUCKY DRAW EVENT', 
    date: '2024.10.24(THU) 19:00-21:00', 
    price: '5 USDT', 
    image: '/event/5/event-5.jpg', 
    fansignDate: '2024.10.24 19:00-21:00', 
    applicationPeriod: '2024.10.05 10:00 - 2024.10.15 23:59', 
    availableSlots: 80, 
    winnersAnnouncement: '2024.10.18 15:00', 
    nftPurchaseLimit: 40, 
    currentParticipants: 267,
    member: 6,
    nftImages: ['/event/5/1.jpg', '/event/5/2.jpg', '/event/5/3.jpg', '/event/5/4.jpg', '/event/5/5.jpg', '/event/5/6.jpg']
  },
  { 
    id: 6, 
    title: 'ITZY LUCKY DRAW EVENT', 
    date: '2024.10.31(THU) 14:00-18:00', 
    price: '5 USDT', 
    image: '/event/6/event-6.jpg', 
    fansignDate: '2024.10.31 14:00-18:00', 
    applicationPeriod: '2024.10.15 14:00 - 2024.10.22 23:59', 
    availableSlots: 70, 
    winnersAnnouncement: '2024.10.25 18:00', 
    nftPurchaseLimit: 35, 
    currentParticipants: 189,
    member: 4,
    nftImages: ['/event/6/1.jpg', '/event/6/2.jpg', '/event/6/3.jpg', '/event/6/4.jpg']
  },
  { 
    id: 7, 
    title: 'NMIXX MEET&CALL EVENT', 
    date: '2024.10.15(TUE) 19:00 SEOUL', 
    price: '25 USDT', 
    image: '/event/winning/1.jpg', 
    fansignDate: '2024.10.15 19:00-21:30', 
    applicationPeriod: '2024.10.01 10:00 - 2024.10.08 23:59', 
    availableSlots: 100, 
    winnersAnnouncement: '2024.10.10 15:00', 
    nftPurchaseLimit: 30, 
    currentParticipants: 967,
    member: 7,
    contractAddress: "0x58Cc717C9061c4bB08aF7Fb610Eb209eD6b0647e",
    transactionHash: "0xb2eb587c19ca283ce70caa4872706feb24a3f88f4a6e8c3e4739ca828383d74f"
  },
  { 
    id: 8, 
    title: 'StrayKids FAN SIGN EVENT ', 
    date: '2024.10.20(SUN) 20:00 BANGKOK', 
    price: '22 USDT', 
    image: '/event/winning/2.jpg', 
    fansignDate: '2024.10.20 20:00-22:00', 
    applicationPeriod: '2024.10.01 09:00 - 2024.10.10 23:59', 
    availableSlots: 80, 
    winnersAnnouncement: '2024.10.13 14:00', 
    nftPurchaseLimit: 25, 
    currentParticipants: 1423,
    member: 8,
    contractAddress: "0x58Cc717C9061c4bB08aF7Fb610Eb209eD6b0647e",
    transactionHash: "0xb2eb587c19ca283ce70caa4872706feb24a3f88f4a6e8c3e4739ca828383d74f"
  },
  { 
    id: 9, 
    title: 'tripleS PRE-ORDER EVENT', 
    date: '2024.09.20(FRI) 18:00 TOKYO', 
    price: '20 USDT', 
    image: '/event/winning/3.jpg', 
    fansignDate: '2024.09.20 18:00-20:30', 
    applicationPeriod: '2024.09.01 10:00 - 2024.09.10 23:59', 
    availableSlots: 90, 
    winnersAnnouncement: '2024.09.13 16:00', 
    nftPurchaseLimit: 27, 
    currentParticipants: 781,
    member: 24,
    contractAddress: "0x58Cc717C9061c4bB08aF7Fb610Eb209eD6b0647e",
    transactionHash: "0xb2eb587c19ca283ce70caa4872706feb24a3f88f4a6e8c3e4739ca828383d74f"
  },
  { 
    id: 10, 
    title: 'BTOB LUCKY DRAW EVENT', 
    date: '2024.09.09(MON) 19:30 JEJU', 
    price: '23 USDT', 
    image: '/event/winning/4.jpg', 
    fansignDate: '2024.09.09 19:30-21:30', 
    applicationPeriod: '2024.08.25 09:00 - 2024.08.31 23:59', 
    availableSlots: 70, 
    winnersAnnouncement: '2024.09.05 15:00', 
    nftPurchaseLimit: 24, 
    currentParticipants: 1187,
    member: 6
  },
  { 
    id: 11, 
    title: 'STAYC VIDEO CALL EVENT', 
    date: '2024.09.05(THU) 17:00 SEOUL', 
    price: '21 USDT', 
    image: '/event/winning/5.jpg', 
    fansignDate: '2024.09.05 17:00-19:00', 
    applicationPeriod: '2024.08.20 10:00 - 2024.08.30 23:59', 
    availableSlots: 75, 
    winnersAnnouncement: '2024.09.03 14:00', 
    nftPurchaseLimit: 26, 
    currentParticipants: 458,
    member: 5
  },
  { 
    id: 12, 
    title: 'KISSOFLIFE Meet&Call Event', 
    date: '2024.08.31(SAT) 18:30 BUSAN', 
    price: '24 USDT', 
    image: '/event/winning/6.jpg', 
    fansignDate: '2024.08.31 18:30-21:00', 
    applicationPeriod: '2024.08.15 09:00 - 2024.08.25 23:59', 
    availableSlots: 80, 
    winnersAnnouncement: '2024.08.28 16:00', 
    nftPurchaseLimit: 28, 
    currentParticipants: 681,
    member: 4,
    contractAddress: "0x58Cc717C9061c4bB08aF7Fb610Eb209eD6b0647e",
    transactionHash: "0xb2eb587c19ca283ce70caa4872706feb24a3f88f4a6e8c3e4739ca828383d74f"
  }
];