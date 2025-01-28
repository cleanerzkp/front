'use client';

import { useEffect, useState } from 'react';
import { Fuel } from 'lucide-react';
import { getAlchemyProvider } from '@/lib/web3';
import { formatGwei } from '@/lib/utils';

export function GasPrice() {
  const [gasPrice, setGasPrice] = useState<string>('0');

  useEffect(() => {
    const provider = getAlchemyProvider();
    
    const updateGasPrice = async () => {
      const price = await provider.getGasPrice();
      setGasPrice(formatGwei(price));
    };

    updateGasPrice();
    const interval = setInterval(updateGasPrice, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Fuel className="h-4 w-4" />
      <span>{gasPrice} Gwei</span>
    </div>
  );
} 