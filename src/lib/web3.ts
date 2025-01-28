// src/lib/web3.ts
import { ethers } from 'ethers';
import { config } from './config';
import { CONTRACTS } from './constants';
import type { EtherscanTx, Transaction } from '@/types';

// Create Alchemy provider
export function getAlchemyProvider() {
  return new ethers.providers.JsonRpcProvider(config.alchemy.rpcUrl);
}

// Get transaction history from Etherscan
export async function getTransactionHistory(address: string): Promise<Transaction[]> {
  const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&apikey=${config.etherscan.apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === '1' && data.result) {
      return data.result
        .filter((tx: EtherscanTx) => 
          tx.contractAddress.toLowerCase() === CONTRACTS.WETH.toLowerCase() ||
          tx.contractAddress.toLowerCase() === CONTRACTS.DAI.toLowerCase()
        )
        .slice(0, 3)
        .map((tx: EtherscanTx) => ({
          id: tx.hash,
          amountWETH: ethers.utils.formatEther(tx.value),
          amountERC20: tx.contractAddress.toLowerCase() === CONTRACTS.DAI.toLowerCase() 
            ? ethers.utils.formatEther(tx.value)
            : '0',
          recipient: tx.to,
          status: 'success',
          timestamp: new Date(Number(tx.timeStamp) * 1000).toISOString()
        }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}