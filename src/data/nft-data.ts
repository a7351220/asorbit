export interface NFT {
  id: number;
  name: string;
  group: string;
  price: string;
  image: string;
  rarity: string;
  description: string;
  currentOwner: string;
  listingDate: string;
  expirationDate: string;
}

export const groups: string[] = [
  'AB6IX', 'Aespa', 'Apink', 'Astro', 'Ateez',
  'Blackpink', 'BOYNEXTDOOR', 'BTOB', 'BTS',
  'Cravity', 'Day6', 'Dreamcatcher',
  'ENHYPEN', 'EXID', 'Exo',
  'Fromis 9', '(G)I-dle', "Girls' Generation", 'GOT7',
  'H1-KEY', 'iKON', 'ILLIT', 'ITZY', 'IVE',
  'Kep1er', 'KISS OF LIFE',
  'LE SSERAFIM', 'LUCY',
  'MAMAMOO', 'MONSTA X',
  'N.Flying', 'NCT', 'NewJeans', 'NMIXX',
  'Oh My Girl',
  'Pentagon',
  'Red Velvet', 'RIIZE',
  'SEVENTEEN', 'SHINee', 'STAYC', 'Stray Kids', 'Super Junior',
  'THE BOYZ', 'tripleS', 'TWICE', 'TXT', 'TWS',
  'VIVIZ',
  'Weeekly', 'WINNER', 'WJSN', 'woo!ah!',
  'XG'
];

export const nfts: NFT[] = [
  { 
    id: 1, 
    name: 'mingyu', 
    group: 'SEVENTEEN', 
    price: '0.14 ETH', 
    image: '/nft-images/1.jpg',
    rarity: 'Rare',
    description: "Limited edition Mingyu NFT from SEVENTEEN's latest comeback.",
    currentOwner: '0x1234...5678',
    listingDate: '2024-07-01',
    expirationDate: '2024-10-01'
  },
  { 
    id: 2, 
    name: 'wonyoung', 
    group: 'IVE', 
    price: '0.11 ETH', 
    image: '/nft-images/2.jpg',
    rarity: 'Epic',
    description: 'Exclusive Wonyoung NFT featuring her iconic smile.',
    currentOwner: '0x8765...4321',
    listingDate: '2024-07-15',
    expirationDate: '2024-10-15'
  },
  { 
    id: 3, 
    name: 'V', 
    group: 'BTS', 
    price: '0.21 ETH', 
    image: '/nft-images/3.jpg',
    rarity: 'Legendary',
    description: "One-of-a-kind V NFT from BTS's world tour.",
    currentOwner: '0x2468...1357',
    listingDate: '2024-08-01',
    expirationDate: '2024-11-01'
  },
  { 
    id: 4, 
    name: 'winter', 
    group: 'Aespa', 
    price: '0.07 ETH', 
    image: '/nft-images/4.png',
    rarity: 'Common',
    description: "Winter NFT from Aespa's latest virtual reality concert.",
    currentOwner: '0x1357...2468',
    listingDate: '2024-08-15',
    expirationDate: '2024-11-15'
  },
  { 
    id: 5, 
    name: 'DK', 
    group: 'SEVENTEEN', 
    price: '0.06 ETH', 
    image: '/nft-images/5.jpg',
    rarity: 'Uncommon',
    description: 'DK NFT showcasing his powerful vocals.',
    currentOwner: '0x9876...5432',
    listingDate: '2024-09-01',
    expirationDate: '2024-12-01'
  },
  { 
    id: 6, 
    name: 'shuhua', 
    group: '(G)I-dle', 
    price: '0.09 ETH', 
    image: '/nft-images/6.jpg',
    rarity: 'Rare',
    description: "Shuhua NFT featuring her stunning visuals from (G)I-dle's recent photoshoot.",
    currentOwner: '0x5678...9012',
    listingDate: '2024-09-15',
    expirationDate: '2024-12-15'
  },
  { 
    id: 7, 
    name: 'chaewon', 
    group: 'LE SSERAFIM', 
    price: '0.13 ETH', 
    image: '/nft-images/7.jpg',
    rarity: 'Epic',
    description: "Limited edition Kim Chaewon NFT from LE SSERAFIM's debut anniversary celebration.",
    currentOwner: '0x3456...7890',
    listingDate: '2024-07-05',
    expirationDate: '2024-10-05'
  },
  { 
    id: 8, 
    name: 'jake', 
    group: 'ENHYPEN', 
    price: '0.08 ETH', 
    image: '/nft-images/8.jpg',
    rarity: 'Uncommon',
    description: "ENHYPEN Jake NFT showcasing his charismatic stage presence.",
    currentOwner: '0x7890...1234',
    listingDate: '2024-07-20',
    expirationDate: '2024-10-20'
  },
  { 
    id: 9, 
    name: 'wonwoo', 
    group: 'SEVENTEEN', 
    price: '0.10 ETH', 
    image: '/nft-images/9.jpg',
    rarity: 'Rare',
    description: "Wonwoo NFT featuring his iconic glasses look from SEVENTEEN's latest concert.",
    currentOwner: '0x2345...6789',
    listingDate: '2024-08-05',
    expirationDate: '2024-11-05'
  },
  { 
    id: 10, 
    name: 'jisoo', 
    group: 'Blackpink', 
    price: '0.18 ETH', 
    image: '/nft-images/10.jpg',
    rarity: 'Legendary',
    description: "Exclusive Jisoo NFT from Blackpink's world tour finale.",
    currentOwner: '0x6789...0123',
    listingDate: '2024-08-20',
    expirationDate: '2024-11-20'
  },
  { 
    id: 11, 
    name: 'wonpil', 
    group: 'Day6', 
    price: '0.12 ETH', 
    image: '/nft-images/11.jpg',
    rarity: 'Epic',
    description: "Exclusive Wonpil NFT featuring his soulful piano performance from Day6's latest concert.",
    currentOwner: '0x8901...2345',
    listingDate: '2024-09-05',
    expirationDate: '2024-12-05'
  },
  { 
    id: 12, 
    name: 'cha eunwoo', 
    group: 'Astro', 
    price: '0.15 ETH', 
    image: '/nft-images/12.jpg',
    rarity: 'Legendary',
    description: "Limited edition Cha Eunwoo NFT showcasing his visual perfection from Astro's summer photoshoot.",
    currentOwner: '0x3456...7890',
    listingDate: '2024-09-20',
    expirationDate: '2024-12-20'
  },
  { 
    id: 13, 
    name: 'wooyoung', 
    group: 'Ateez', 
    price: '0.09 ETH', 
    image: '/nft-images/13.jpg',
    rarity: 'Rare',
    description: "Wooyoung NFT capturing his dynamic dance moves from Ateez's world tour.",
    currentOwner: '0x9012...3456',
    listingDate: '2024-07-10',
    expirationDate: '2024-10-10'
  },
  { 
    id: 14, 
    name: 'yoona', 
    group: "Girls' Generation", 
    price: '0.17 ETH', 
    image: '/nft-images/14.jpg',
    rarity: 'Legendary',
    description: "Iconic Yoona NFT celebrating Girls' Generation's lasting influence in K-pop.",
    currentOwner: '0x5678...9012',
    listingDate: '2024-07-25',
    expirationDate: '2024-10-25'
  },
  { 
    id: 15, 
    name: 'ryujin', 
    group: 'ITZY', 
    price: '0.11 ETH', 
    image: '/nft-images/15.jpg',
    rarity: 'Epic',
    description: "Ryujin NFT featuring her charismatic stage presence from ITZY's latest comeback.",
    currentOwner: '0x1234...5678',
    listingDate: '2024-08-10',
    expirationDate: '2024-11-10'
  },
  { 
    id: 16, 
    name: 'ahn yujin', 
    group: 'IVE', 
    price: '0.13 ETH', 
    image: '/nft-images/16.jpg',
    rarity: 'Epic',
    description: "Ahn Yujin NFT showcasing her elegant visuals from IVE's recent magazine cover shoot.",
    currentOwner: '0x7890...1234',
    listingDate: '2024-08-25',
    expirationDate: '2024-11-25'
  },
  { 
    id: 17, 
    name: 'wheein', 
    group: 'MAMAMOO', 
    price: '0.14 ETH', 
    image: '/nft-images/17.jpg',
    rarity: 'Rare',
    description: "Wheein NFT capturing her powerful vocals from MAMAMOO's special anniversary concert.",
    currentOwner: '0x2345...6789',
    listingDate: '2024-09-10',
    expirationDate: '2024-12-10'
  },
  { 
    id: 18, 
    name: 'soobin', 
    group: 'TXT', 
    price: '0.12 ETH', 
    image: '/nft-images/18.jpg',
    rarity: 'Epic',
    description: "Soobin NFT featuring his trendsetting fashion from TXT's latest music video.",
    currentOwner: '0x8901...2345',
    listingDate: '2024-09-25',
    expirationDate: '2024-12-25'
  },
  { 
    id: 19, 
    name: 'minho', 
    group: 'SHINee', 
    price: '0.16 ETH', 
    image: '/nft-images/19.jpg',
    rarity: 'Legendary',
    description: "Minho NFT showcasing his charismatic performance from SHINee's 15th anniversary concert.",
    currentOwner: '0x4567...8901',
    listingDate: '2024-07-30',
    expirationDate: '2024-10-30'
  },
  { 
    id: 20, 
    name: 'shinyu', 
    group: 'TWS', 
    price: '0.08 ETH', 
    image: '/nft-images/20.jpg',
    rarity: 'Uncommon',
    description: "Shinyu NFT featuring his debut performance with TWS, capturing the start of a promising career.",
    currentOwner: '0x0123...4567',
    listingDate: '2024-08-15',
    expirationDate: '2024-11-15'
  },
];