// src/components/weth-interface.tsx
'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { CONTRACTS, WETH_ABI } from '@/lib/constants';
import { GasDetails } from './gas-details';

interface Props {
  onSuccess?: (txHash: string, amount: string) => void;
}

interface GasInfo {
  gasPrice: ethers.BigNumber;
  gasLimit: ethers.BigNumber;
  totalCost: ethers.BigNumber;
  maxPriorityFeePerGas?: ethers.BigNumber | undefined;
  maxFeePerGas?: ethers.BigNumber | undefined;
  baseFee?: ethers.BigNumber | undefined;
}

export default function WethInterface({ onSuccess }: Props) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gasInfo, setGasInfo] = useState<GasInfo | null>(null);
  const { provider, signer, address, updateBalances } = useWeb3();

  // Get current gas estimates
  const getGasEstimates = async () => {
    if (!provider) return null;
    
    try {
      const [feeData, block] = await Promise.all([
        provider.getFeeData(),
        provider.getBlock('latest')
      ]);

      const { maxFeePerGas, maxPriorityFeePerGas, gasPrice } = feeData;
      
      // Calculate gas limit for wrap only
      const wrapGasLimit = ethers.BigNumber.from('65000');
      const bufferedGasLimit = wrapGasLimit.mul(12).div(10); // 20% buffer

      const effectiveGasPrice = maxFeePerGas || gasPrice || ethers.BigNumber.from(0);
      const totalCost = effectiveGasPrice.mul(bufferedGasLimit);

      return {
        gasPrice: effectiveGasPrice,
        gasLimit: bufferedGasLimit,
        totalCost,
        maxPriorityFeePerGas: maxPriorityFeePerGas || undefined,
        maxFeePerGas: maxFeePerGas || undefined,
        baseFee: block.baseFeePerGas || undefined
      };
    } catch (err) {
      console.error('Error getting gas estimates:', err);
      return null;
    }
  };

  const calculateMax = async () => {
    if (!provider || !address) return;
    setError('');
    setGasInfo(null);

    try {
      const balance = await provider.getBalance(address);
      if (balance.isZero()) {
        setError('No ETH balance available');
        return;
      }

      const estimates = await getGasEstimates();
      if (!estimates) {
        throw new Error('Failed to estimate gas costs');
      }

      setGasInfo(estimates);
      const maxAmount = balance.sub(estimates.totalCost);

      if (maxAmount.lte(0)) {
        setError('Insufficient balance after gas costs');
        return;
      }

      const formattedAmount = ethers.utils.formatUnits(maxAmount, 18);
      const roundedAmount = (+formattedAmount).toFixed(4);
      setAmount(roundedAmount);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to calculate max amount';
      console.error('Error calculating max amount:', err);
      setError(message);
    }
  };

  const handleWrap = async () => {
    if (!signer || !amount || !provider) return;
    setLoading(true);
    setError('');
    setGasInfo(null);

    try {
      const wethContract = new ethers.Contract(CONTRACTS.WETH, WETH_ABI, signer);
      const value = parseEther(amount);

      const estimates = await getGasEstimates();
      if (!estimates) {
        throw new Error('Failed to estimate gas costs');
      }

      const balance = await provider.getBalance(address);
      const totalRequired = value.add(estimates.totalCost);

      if (balance.lt(totalRequired)) {
        throw new Error('Insufficient balance including gas costs');
      }

      const tx = await wethContract.deposit({ 
        value,
        maxFeePerGas: estimates.maxFeePerGas,
        maxPriorityFeePerGas: estimates.maxPriorityFeePerGas
      });

      await tx.wait();
      await updateBalances();
      onSuccess?.(tx.hash, amount);
      setAmount('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      console.error('Error in transaction:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Amount of ETH to wrap"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.0001"
        />
        <Button
          variant="outline"
          onClick={calculateMax}
          disabled={loading || !address}
        >
          Max
        </Button>
        <Button
          onClick={handleWrap}
          disabled={loading || !amount || !address || parseFloat(amount) <= 0}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Wrap ETH
        </Button>
      </div>

      {gasInfo && (
        <GasDetails 
          gasPrice={gasInfo.gasPrice}
          gasLimit={gasInfo.gasLimit}
          totalGasCost={gasInfo.totalCost}
          maxFeePerGas={gasInfo.maxFeePerGas}
          maxPriorityFeePerGas={gasInfo.maxPriorityFeePerGas}
        />
      )}
    </div>
  );
}