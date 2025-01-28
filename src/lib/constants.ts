// src/types/index.ts
import { providers } from 'ethers';


export interface WalletState {
  provider: providers.Web3Provider | null;
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balances: {
    eth: string;
    weth: string;
    erc20: string;
  };
}

export interface Transaction {
  id: string;
  amountWETH: string;
  amountERC20: string;
  recipient: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
}

export const MOCK_TRANSACTIONS = [
  {
    id: '1',
    amountWETH: '0.1',
    amountERC20: '15',
    recipient: '0x1234...5678',
    status: 'success',
    timestamp: '2024-02-20T10:00:00Z'
  },
  {
    id: '2',
    amountWETH: '0.05',
    amountERC20: '8',
    recipient: '0x8765...4321',
    status: 'pending',
    timestamp: '2024-02-20T09:45:00Z'
  }
] as const;


export const WETH_ABI = [
  'function deposit() payable',
  'function withdraw(uint wad)',
  'function balanceOf(address) view returns (uint)',
  'function approve(address spender, uint256 amount) public returns (bool)'
] as const;

export const ROUTER_ABI = [
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)'
] as const;

export const CONTRACTS = {
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Mainnet WETH
  ROUTER: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F'   // Mainnet DAI
} as const;