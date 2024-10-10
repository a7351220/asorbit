import React from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BaseError } from 'viem';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  hash: string | undefined;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: Error | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  hash, 
  isConfirming, 
  isConfirmed, 
  error 
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {isConfirmed ? "Transaction Confirmed" : isConfirming ? "Transaction Pending" : "Transaction Initiated"}
        </DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        {hash && (
          <p>
            Transaction Hash:{' '}
            <Link href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {hash.slice(0, 6)}...{hash.slice(-4)}
            </Link>
          </p>
        )}
        {isConfirming && <p>Waiting for confirmation...</p>}
        {isConfirmed && <p>Your NFT has been minted successfully!</p>}
        {error && <p className="text-red-500">Error: {(error as BaseError).shortMessage || error.message}</p>}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={onClose} variant="outline">Close</Button>
        <Link href="/my-nft">
          <Button>View My NFTs</Button>
        </Link>
      </div>
    </DialogContent>
  </Dialog>
);

export default TransactionModal;