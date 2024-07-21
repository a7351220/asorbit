// src/data/nft-data.ts

export interface NFT {
    id: number;
    name: string;
    group: string;
    price: string;
    image: string;
  }
  
  export const groups: string[] = [
    'Aespa', 'AB6IX', 'Apink', 'Astro', 'Ateez', 'Blackpink', 
    'BOYNEXTDOOR', 'BTOB', 'BTS', 'Cravity', 'Day6', 'EXID', 
    'Exo', 'Fromis 9', '(G)I-dle'
  ];
  
  export const nfts: NFT[] = [
    { id: 1, name: 'mingyu', group: 'SEVENTEEN', price: '0.14 ETH', image: '/images/nft-images/nft-1.jpg' },
    { id: 2, name: 'wonyoung', group: 'IVE', price: '0.11 ETH', image: '/images/nft-images/nft-2.jpg' },
    { id: 3, name: 'V', group: 'BTS', price: '0.21 ETH', image: '/images/nft-images/nft-3.jpg' },
    { id: 4, name: 'winter', group: 'Aespa', price: '0.07 ETH', image: '/images/nft-images/nft-4.jpg' },
    { id: 5, name: 'DK', group: 'SEVENTEEN', price: '0.06 ETH', image: '/images/nft-images/nft-5.jpg' },
    // 您可以继续添加更多 NFT...
  ];