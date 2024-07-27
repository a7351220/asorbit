'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { FaUser, FaEnvelope, FaPhone, FaCopy } from 'react-icons/fa';

export default function RegisterDID() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+886');
  const [did, setDID] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerateDID = () => {
    setDID('did:ethr:sepolia:0x034ff5038af3cc0558f403e3fd74d4e86e13747aec71fa6218f1588a9d7be88ec9');
    setPrivateKey('0x1283a5e692ae550eacdd441d7a5aba9f9c9ee628e6d0973acd10bd3a725656d6');
    setIsGenerated(true);
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Create DID on Sepolia</h1>
        <p className="text-center text-gray-600 mb-8">Generate your unique Decentralized Identifier on the Sepolia network.</p>

        {!isGenerated ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
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
              <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white">
                <FaCopy />
              </button>
            </div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Your Private Key (Keep this secret!):</h2>
            <div className="bg-gray-100 p-3 rounded-lg mb-4 flex justify-between items-center">
              <span className="break-all text-black">{privateKey}</span>
              <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white">
                <FaCopy />
              </button>
            </div>
            <p className="text-red-500 mb-6">Warning: Store this private key securely. It&apos;s required to control your DID.</p>          </div>
        )}
      </main>
    </div>
  );
}