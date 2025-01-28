// src/hooks/useWeb3.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACTS, WETH_ABI } from '@/lib/constants';
import { getTransactionHistory } from '@/lib/web3';
import type { Transaction } from '@/types';

interface BalanceState {
  eth: string;
  weth: string;
  erc20: string;
}

interface Web3State {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.providers.JsonRpcSigner | null;
  address: string;
  chainId: number;
  balances: BalanceState;
  transactions: Transaction[];
  error: string;
  isConnecting: boolean;
  isConnected: boolean;
}

const INITIAL_STATE: Web3State = {
  provider: null,
  signer: null,
  address: '',
  chainId: 1,
  balances: { eth: '0', weth: '0', erc20: '0' },
  transactions: [],
  error: '',
  isConnecting: false,
  isConnected: false,
};

// Add type guard
const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!window?.ethereum;
};

export function useWeb3() {
  const [state, setState] = useState<Web3State>(INITIAL_STATE);

  // Update balances
  const updateBalances = async (address: string, provider: ethers.providers.Web3Provider) => {
    try {
      const [ethBalance, wethBalance] = await Promise.all([
        provider.getBalance(address),
        getWethBalance(address, provider),
      ]);

      setState(prev => ({
        ...prev,
        balances: {
          ...prev.balances,
          eth: ethers.utils.formatEther(ethBalance),
          weth: ethers.utils.formatEther(wethBalance),
        },
      }));
    } catch (err) {
      console.error('Error updating balances:', err);
    }
  };

  // Get WETH balance
  const getWethBalance = async (
    address: string,
    provider: ethers.providers.Provider
  ): Promise<ethers.BigNumber> => {
    const wethContract = new ethers.Contract(CONTRACTS.WETH, WETH_ABI, provider);
    try {
      return await wethContract.balanceOf(address);
    } catch (err) {
      console.error('Error getting WETH balance:', err);
      return ethers.BigNumber.from(0);
    }
  };

  // Handle account changes
  const handleAccountsChanged = async (accounts: string[]) => {
    if (!isMetaMaskInstalled()) return;

    if (accounts.length === 0) {
      setState(prev => ({
        ...prev,
        signer: null,
        address: '',
        isConnected: false,
        balances: INITIAL_STATE.balances,
        transactions: [],
      }));
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum!);
      const address = accounts[0];
      const signer = provider.getSigner();
      const { chainId } = await provider.getNetwork();
      
      setState(prev => ({
        ...prev,
        provider,
        signer,
        address,
        chainId,
        isConnected: true,
      }));

      await updateBalances(address, provider);
      const history = await getTransactionHistory(address);
      setState(prev => ({ ...prev, transactions: history }));
    }
  };

  // Connect wallet
  const connect = async () => {
    if (!isMetaMaskInstalled() || !window.ethereum) {
      setState(prev => ({ ...prev, error: 'Please install MetaMask' }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: '' }));

    try {
      const ethereum = window.ethereum;
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      await handleAccountsChanged(accounts);
    } catch (error: unknown) {
      console.error('Connection error:', error);
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      setState(prev => ({ 
        ...prev, 
        error: message,
        isConnected: false,
      }));
    } finally {
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setState(prev => ({
      ...prev,
      provider: null,
      signer: null,
      address: '',
      isConnected: false,
      balances: INITIAL_STATE.balances,
      transactions: [],
      error: ''
    }));
  };

  // Setup initial connection and event listeners
  useEffect(() => {
    if (!isMetaMaskInstalled() || !window.ethereum) return;

    // Check initial connection
    window.ethereum?.request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
      .catch(console.error);

    // Setup listeners
    const ethereum = window.ethereum;
    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', () => window.location.reload());
    ethereum.on('disconnect', disconnect);

    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', () => {});
        ethereum.removeListener('disconnect', disconnect);
      }
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    updateBalances: () => state.provider && state.address && 
      updateBalances(state.address, state.provider),
  };
}