// src/components/wallet.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import WalletStatus from '@/components/wallet-status';
import WethInterface from '@/components/weth-interface';
import TransactionHistory from './transaction-history';
import { GasPrice } from '@/components/gas-price';

export default function WalletInterface() {
  const handleSuccess = (txHash: string, amount: string) => {
    // Update transaction history or show success notification
    console.log(`Transaction successful: ${txHash}, Amount: ${amount}`);
  };

  return (
    <div className="container py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold">
                Frontend Developer{' '}
                <span className="text-blue-600 inline-block">[Blue]</span>
              </span>
              <GasPrice />
            </div>
            <WalletStatus />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <WethInterface onSuccess={handleSuccess} />
          <TransactionHistory />
        </CardContent>
      </Card>
    </div>
  );
}