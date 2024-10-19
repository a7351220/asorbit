'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { FaUser, FaEnvelope, FaPhone, FaCopy } from 'react-icons/fa';
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

export default function RegisterDID() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+886');
  const [did, setDID] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const { toast } = useToast();
  const { address } = useAccount();
  const [wallet, setWallet] = useState<ethers.HDNodeWallet | null>(null);

  useEffect(() => {
    if (address) {
      const storedDIDs = JSON.parse(localStorage.getItem('userDIDs') || '{}');
      const userDID = storedDIDs[address];
      if (userDID) {
        setDID(userDID);
        setIsGenerated(true);
      } else {
        setDID('');
        setIsGenerated(false);
      }
    }
  }, [address]);

  const handleGenerateDID = () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    // 生成新的 EVM 錢包
    const newWallet = ethers.Wallet.createRandom();
    setWallet(newWallet);

    // 使用錢包地址作為 DID
    const newDID = `did:ethr:sepolia:${newWallet.address}`;
    setDID(newDID);
    setIsGenerated(true);

    const storedDIDs = JSON.parse(localStorage.getItem('userDIDs') || '{}');
    storedDIDs[address] = newDID;
    localStorage.setItem('userDIDs', JSON.stringify(storedDIDs));

    toast({
      title: "Success",
      description: "Your DID has been successfully generated!",
    });
  };

  const handleCopyDID = () => {
    navigator.clipboard.writeText(did);
    toast({
      title: "Copied",
      description: "DID copied to clipboard",
    });
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">DID on Sepolia</h1>
        
        {!isGenerated ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <p className="text-center text-gray-600 mb-8">Generate your unique Decentralized Identifier on the Sepolia network.</p>
            <div className="mb-4">
              <label className="block mb-2 text-blue-900">Name</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 pl-10 border border-gray-300 rounded text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FaUser className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-blue-900">Email</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full p-2 pl-10 border border-gray-300 rounded text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-blue-900">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  className="w-full p-2 pl-10 border border-gray-300 rounded text-black"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <FaPhone className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <button
              onClick={handleGenerateDID}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Generate DID
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Your DID:</h2>
            <div className="bg-gray-100 p-3 rounded-lg mb-4 flex justify-between items-center">
              <span className="break-all text-black">{did}</span>
              <button 
                className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white"
                onClick={handleCopyDID}
              >
                <FaCopy />
              </button>
            </div>
            {wallet && (
              <>
                <h3 className="text-lg font-bold mt-6 mb-2 text-blue-900">Wallet Details:</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Public Key:</strong> {wallet.publicKey}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Private Key:</strong> {wallet.privateKey}
                </p>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                  <p className="font-bold">Warning</p>
                  <p>Keep your private key secret. Never share it with anyone.</p>
                </div>
              </>
            )}
            <p className="text-gray-600 mt-4">This is your Decentralized Identifier (DID) on the Sepolia network. You can use this to interact with DID-enabled services and applications.</p>
          </div>
        )}
      </main>
    </div>
  );
}
