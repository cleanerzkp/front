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

export interface EtherscanTx {
  hash: string;
  value: string;
  to: string;
  contractAddress: string;
  timeStamp: string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
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
];


export const WETH_ABI = [
    'function deposit() payable',
    'function withdraw(uint wad)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function balanceOf(address) view returns (uint)',
  ] as const;
  
  export const ROUTER_ABI = [
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)',
    'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)',
  ] as const;
  
  export const CONTRACTS = {
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    ROUTER: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f'
  } as const;