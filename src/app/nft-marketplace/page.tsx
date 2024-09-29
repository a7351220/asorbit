'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import { groups, getMarketplaceNFTs, NFT } from '@/data/nft-data';
import NFTGroupLogo from '@/components/NFTGroupLogo';
import NFTmarketModal from '@/components/NFTmarketModal';

export default function NFTMarketplace() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('HOT');
  const [priceSort, setPriceSort] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getGender = (group: string) => {
    const boyGroups = [
      'AB6IX', 'Astro', 'Ateez', 'BOYNEXTDOOR', 'BTOB', 'BTS',
      'Cravity', 'Day6', 'ENHYPEN', 'Exo', 'GOT7', 'iKON',
      'LUCY', 'MONSTA X', 'N.Flying', 'NCT', 'Pentagon',
      'RIIZE', 'SEVENTEEN', 'SHINee', 'Stray Kids', 'Super Junior',
      'THE BOYZ', 'TXT', 'TWS', 'WINNER'
    ];
    
    const girlGroups = [
      'Aespa', 'Apink', 'Blackpink', 'Dreamcatcher', 'EXID', 
      'Fromis 9', '(G)I-dle', "Girls' Generation", 'H1-KEY', 
      'ILLIT', 'ITZY', 'IVE', 'Kep1er', 'KISS OF LIFE', 
      'LE SSERAFIM', 'MAMAMOO', 'NewJeans', 'NMIXX', 'Oh My Girl', 
      'Red Velvet', 'STAYC', 'tripleS', 'TWICE', 'VIVIZ', 
      'Weeekly', 'WJSN', 'woo!ah!', 'XG'
    ];
    
    if (boyGroups.includes(group)) return 'male';
    if (girlGroups.includes(group)) return 'female';
    return 'unknown';
  };

  const filteredGroups = useMemo(() => {
    return groups.filter(group => 
      group.toLowerCase().includes(searchGroup.toLowerCase())
    );
  }, [searchGroup]);

  const handleGroupCheckboxChange = (group: string) => {
    setSelectedGroups(prev => 
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const filteredAndSortedNFTs = useMemo(() => {
    let filtered = getMarketplaceNFTs().filter((nft) => {
      const matchesCategory = 
        selectedCategory === 'HOT' || 
        (selectedCategory === 'NEW') ||
        (selectedCategory === 'BOYS' && getGender(nft.group) === 'male') ||
        (selectedCategory === 'GIRLS' && getGender(nft.group) === 'female');
      
      const matchesName = nft.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesGroup = (selectedGroups.length === 0 || selectedGroups.includes(nft.group)) &&
                           nft.group.toLowerCase().includes(searchGroup.toLowerCase());
      const nftPrice = parseFloat(nft.price.split(' ')[0]);
      const matchesMinPrice = !minPrice || nftPrice >= parseFloat(minPrice);
      const matchesMaxPrice = !maxPrice || nftPrice <= parseFloat(maxPrice);

      return matchesCategory && matchesName && matchesGroup && matchesMinPrice && matchesMaxPrice;
    });

    if (selectedCategory === 'NEW') {
      filtered.sort((a, b) => new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime());
    } else if (priceSort === 'high-to-low') {
      filtered.sort((a, b) => parseFloat(b.price.split(' ')[0]) - parseFloat(a.price.split(' ')[0]));
    } else if (priceSort === 'low-to-high') {
      filtered.sort((a, b) => parseFloat(a.price.split(' ')[0]) - parseFloat(b.price.split(' ')[0]));
    }

    return filtered;
  }, [selectedCategory, searchName, searchGroup, selectedGroups, minPrice, maxPrice, priceSort]);
  
  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedNFT(null);
  };

  const handlePurchase = () => {
    console.log('Purchasing NFT:', selectedNFT);
    handleCloseModal();
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">- NFT Marketplace -</h1>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Filters */}
          <div className="w-full md:w-1/4 pr-0 md:pr-4 mb-4 md:mb-0">
            <button
              className="md:hidden w-full bg-blue-500 text-white py-2 px-4 rounded mb-4"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
              <h2 className="font-bold mb-2">Price</h2>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Min"
                  className="border border-gray-300 p-2 w-1/2 text-black"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>to</span>
                <input
                  type="text"
                  placeholder="Max"
                  className="border border-gray-300 p-2 w-1/2 text-black"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <h2 className="font-bold mb-2">Group</h2>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search Group"
                  className="border border-gray-300 p-2 w-full text-black"
                  value={searchGroup}
                  onChange={(e) => setSearchGroup(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
              <div className="h-85 overflow-y-auto">
                {filteredGroups.map((group) => (
                  <div key={group} className="flex items-center mb-2">
                    <input 
                      type="checkbox" 
                      id={group} 
                      className="mr-2"
                      checked={selectedGroups.includes(group)}
                      onChange={() => handleGroupCheckboxChange(group)}
                    />
                    <label htmlFor={group} className="text-black">{group}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
                {['HOT', 'NEW', 'BOYS', 'GIRLS'].map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
                <select
                  className="border border-gray-300 p-2 text-black"
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                >
                  <option value="">Price</option>
                  <option value="high-to-low">High to Low</option>
                  <option value="low-to-high">Low to High</option>
                </select>
              </div>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Name"
                  className="border border-gray-300 p-2 pr-10 text-black w-full"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredAndSortedNFTs.map((nft) => (
                <div 
                  key={nft.id} 
                  className="border border-gray-300 rounded-lg overflow-hidden flex flex-col cursor-pointer"
                  onClick={() => handleNFTClick(nft)}
                >
                  <div className="relative w-full" style={{ paddingTop: '133.33%' }}>
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm font-bold">
                      {nft.price}
                    </div>
                  </div>
                  <div className="p-2 flex-grow">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-2 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-300">
                        <NFTGroupLogo group={nft.group} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-sm truncate leading-snug">{nft.name}</p>
                        <p className="text-xs text-gray-600 truncate leading-snug">{nft.group}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {selectedNFT && (
          <NFTmarketModal
            nft={selectedNFT}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPurchase={handlePurchase}
          />
        )}
      </main>
    </div>
  );
}