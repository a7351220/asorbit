// src/data/events.ts

export interface Event {
    id: number;
    title: string;
    date: string;
    price: string;
    image: string;
    fansignDate: string;
    applicationPeriod: string;
    availableSlots: number;
    winnersAnnouncement: string;
    nftPurchaseLimit: number;
    currentParticipants: number;
    member: number;
    nftImages: string[];
  }
  
  export const events: Event[] = [
    { 
      id: 1, 
      title: '(G)I-DLE-MEET & CALL EVENT', 
      date: '2024.10.06(SUN) 13:00 TAIPEI', 
      price: '15 USDT', 
      image: '/event/1/event-1.jpg', 
      fansignDate: '2024.10.06 13:00-17:00', 
      applicationPeriod: '2024.09.25 11:00 - 2024.10.01 23:59', 
      availableSlots: 50, 
      winnersAnnouncement: '2024.10.03 15:00', 
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
      applicationPeriod: '2024.10.05 10:00 - 2024.10.12 23:59', 
      availableSlots: 40, 
      winnersAnnouncement: '2024.10.15 12:00', 
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
      applicationPeriod: '2024.10.13 09:00 - 2024.10.20 23:59', 
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
      date: '2024.10.31 ~ 2024.11.07 23:59', 
      price: '7 USDT', 
      image: '/event/4/event-4.jpg', 
      fansignDate: '2024.11.10 15:00-19:00', 
      applicationPeriod: '2024.10.31 00:00 - 2024.11.07 23:59', 
      availableSlots: 100, 
      winnersAnnouncement: '2024.11.08 12:00', 
      nftPurchaseLimit: 50, 
      currentParticipants: 432,
      member: 6,
      nftImages: ['/event/4/1.jpg', '/event/4/2.jpg', '/event/4/3.jpg', '/event/4/4.jpg', '/event/4/5.jpg', '/event/4/6.jpg']
    },
    { 
      id: 5, 
      title: 'TWS LUCKY DRAW EVENT', 
      date: '2024.11.06 ~ 2024.11.10 23:59', 
      price: '5 USDT', 
      image: '/event/5/event-5.jpg', 
      fansignDate: '2024.11.15 19:00-21:00', 
      applicationPeriod: '2024.11.06 10:00 - 2024.11.10 23:59', 
      availableSlots: 80, 
      winnersAnnouncement: '2024.11.12 15:00', 
      nftPurchaseLimit: 40, 
      currentParticipants: 267,
      member: 6,
      nftImages: ['/event/5/1.jpg', '/event/5/2.jpg', '/event/5/3.jpg', '/event/5/4.jpg', '/event/5/5.jpg', '/event/5/6.jpg']
    },
    { 
      id: 6, 
      title: 'ITZY LUCKY DRAW EVENT', 
      date: '2024.11.26 14:00 ~ 2024.11.28 23:59', 
      price: '5 USDT', 
      image: '/event/6/event-6.jpg', 
      fansignDate: '2024.12.01 14:00-18:00', 
      applicationPeriod: '2024.11.26 14:00 - 2024.11.28 23:59', 
      availableSlots: 70, 
      winnersAnnouncement: '2024.11.29 18:00', 
      nftPurchaseLimit: 35, 
      currentParticipants: 189,
      member: 4,
      nftImages: ['/event/6/1.jpg', '/event/6/2.jpg', '/event/6/3.jpg', '/event/6/4.jpg']
    },
  ];