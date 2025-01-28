// src/components/gas-details.tsx
import { Card, CardContent } from '@/components/ui/card';
import { ethers } from 'ethers';
import { Fuel } from 'lucide-react';

interface GasDetailsProps {
  gasPrice: ethers.BigNumber;
  gasLimit: ethers.BigNumber;
  totalGasCost: ethers.BigNumber;
  maxFeePerGas?: ethers.BigNumber | undefined;
  maxPriorityFeePerGas?: ethers.BigNumber | undefined;
}

export function GasDetails({ 
  gasPrice, 
  gasLimit, 
  totalGasCost,
  maxFeePerGas,
  maxPriorityFeePerGas 
}: GasDetailsProps) {
  return (
    <Card className="bg-secondary/50">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Fuel className="h-4 w-4" />
          Gas Calculation Details
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gas Limit:</span>
            <span className="font-mono">{gasLimit.toString()}</span>
          </div>
          {maxFeePerGas ? (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Fee:</span>
                <span className="font-mono">{ethers.utils.formatUnits(maxFeePerGas, 'gwei')} Gwei</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority Fee:</span>
                <span className="font-mono">
                  {ethers.utils.formatUnits(maxPriorityFeePerGas || 0, 'gwei')} Gwei
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gas Price:</span>
              <span className="font-mono">{ethers.utils.formatUnits(gasPrice, 'gwei')} Gwei</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2">
            <span className="text-muted-foreground">Estimated Cost:</span>
            <span className="font-mono">{ethers.utils.formatEther(totalGasCost)} ETH</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}