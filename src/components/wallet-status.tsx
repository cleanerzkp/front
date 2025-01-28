// src/components/wallet-status.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Wallet, AlertCircle, LogOut } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,

} from '@/components/ui/dropdown-menu';

function truncateAddress(addr: string) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatBalance(balance: string) {
  return parseFloat(balance).toFixed(4);
}

export default function WalletStatus() {
  const { 
    address, 
    isConnected, 
    isConnecting,
    error,
    balances,
    connect,
    disconnect
  } = useWeb3();

  // Connect button when not connected
  if (!isConnected) {
    return (
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button 
          onClick={connect} 
          disabled={isConnecting}
          variant="outline"
          size="lg"
          className="min-w-[200px]"
        >
          {isConnecting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          <Wallet className="mr-2 h-5 w-5" />
          Connect Wallet
        </Button>
      </div>
    );
  }

  // Connected state with wallet info and balances
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-secondary/50">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground font-medium">ETH</div>
              <div className="font-mono text-lg">{formatBalance(balances.eth)}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/50">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground font-medium">WETH</div>
              <div className="font-mono text-lg">{formatBalance(balances.weth)}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/50">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground font-medium">DAI</div>
              <div className="font-mono text-lg">{formatBalance(balances.erc20)}</div>
            </CardContent>
          </Card>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="lg"
              className="font-mono min-w-[180px]"
            >
              <Wallet className="mr-2 h-5 w-5" />
              {truncateAddress(address)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive p-3"
              onClick={disconnect}
            >
              <LogOut className="h-5 w-5" />
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}