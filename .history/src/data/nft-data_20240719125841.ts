// src/data/nft-data.ts

export interface NFT {
    id: number;
    name: string;
    group: string;
    price: string;
    image: string;
    rarity: string;
    releaseDate: string;
    description: string;
    totalSupply: number;
    currentOwner: string;
  }
  
  export const groups: string[] = [
    'Aespa', 'AB6IX', 'Apink', 'Astro', 'Ateez', 'Blackpink', 
    'BOYNEXTDOOR', 'BTOB', 'BTS', 'Cravity', 'Day6', 'EXID', 
    'Exo', 'Fromis 9', '(G)I-dle', 'SEVENTEEN', 'IVE'
  ];
  
  export const nfts: NFT[] = [
    { 
      id: 1, 
      name: 'mingyu', 
      group: 'SEVENTEEN', 
      price: '0.14 ETH', 
      image: '/images/nft-images/nft-1.jpg',
      rarity: 'Rare',
      releaseDate: '2023-05-15',
      description: "Limited edition Mingyu NFT from SEVENTEEN's latest comeback.",
      totalSupply: 100,
      currentOwner: '0x1234...5678'
    },
    { 
      id: 2, 
      name: 'wonyoung', 
      group: 'IVE', 
      price: '0.11 ETH', 
      image: '/images/nft-images/nft-2.jpg',
      rarity: 'Epic',
      releaseDate: '2023-06-01',
      description: 'Exclusive Wonyoung NFT featuring her iconic smile.',
      totalSupply: 50,
      currentOwner: '0x8765...4321'
    },
    { 
      id: 3, 
      name: 'V', 
      group: 'BTS', 
      price: '0.21 ETH', 
      image: '/images/nft-images/nft-3.jpg',
      rarity: 'Legendary',
      releaseDate: '2023-04-20',
      description: "One-of-a-kind V NFT from BTS's world tour.",
      totalSupply: 10,
      currentOwner: '0x2468...1357'
    },
    { 
      id: 4, 
      name: 'winter', 
      group: 'Aespa', 
      price: '0.07 ETH', 
      image: '/images/nft-images/nft-4.jpg',
      rarity: 'Common',
      releaseDate: '2023-07-01',
      description: "Winter NFT from Aespa's latest virtual reality concert.",
      totalSupply: 500,
      currentOwner: '0x1357...2468'
    },
    { 
      id: 5, 
      name: 'DK', 
      group: 'SEVENTEEN', 
      price: '0.06 ETH', 
      image: '/images/nft-images/nft-5.jpg',
      rarity: 'Uncommon',
      releaseDate: '2023-05-20',
      description: 'DK NFT showcasing his powerful vocals.',
      totalSupply: 200,
      currentOwner: '0x9876...5432'
    },
    // 您可以继续添加更多 NFT...
  ];