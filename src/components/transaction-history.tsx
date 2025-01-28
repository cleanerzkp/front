import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { Transaction, MOCK_TRANSACTIONS } from '@/types';

function TransactionStatus({ status }: { status: Transaction['status'] }) {
  switch (status) {
    case 'success':
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          <span>Success</span>
        </div>
      );
    case 'pending':
      return (
        <div className="flex items-center text-yellow-600">
          <Clock className="h-4 w-4 mr-1 animate-pulse" />
          <span>Pending</span>
        </div>
      );
    case 'failed':
      return (
        <div className="flex items-center text-red-600">
          <XCircle className="h-4 w-4 mr-1" />
          <span>Failed</span>
        </div>
      );
  }
}

function truncateAddress(addr: string) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatAmount(amount: string) {
  return parseFloat(amount).toFixed(4);
}

function getTimeAgo(timestamp: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function TransactionHistory() {
  const { isConnected, transactions } = useWeb3();
  
  // Use transactions from web3 hook if available, otherwise fall back to mock data
  const displayTransactions = transactions.length > 0 ? transactions : MOCK_TRANSACTIONS;

  if (!isConnected) return null;

  if (displayTransactions.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No transactions yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <span className="text-sm text-muted-foreground">
          Last {displayTransactions.length} transactions
        </span>
      </div>
      
      <div className="space-y-3">
        {displayTransactions.map((tx) => (
          <Card key={tx.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {truncateAddress(tx.recipient)}
                    </span>
                    <a
                      href={`https://etherscan.io/tx/${tx.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center space-x-2">
                    <span>{getTimeAgo(tx.timestamp)}</span>
                    <span>•</span>
                    <TransactionStatus status={tx.status} />
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="font-medium">
                    {formatAmount(tx.amountWETH)} WETH
                  </div>
                  <div className="text-sm text-muted-foreground">
                    → {formatAmount(tx.amountERC20)} DAI
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}