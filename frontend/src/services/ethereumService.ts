import type { BalanceResponse } from '../types/ethereum';

/**
 * Fetches Ethereum balances for a given address
 * @param address Ethereum wallet address
 * @returns Promise with balance information
 */
export const fetchEthereumBalance = async (address: string): Promise<BalanceResponse> => {
  try {
    const response = await fetch(`/api/balance?address=${encodeURIComponent(address)}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching balance: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch balance:', error);
    throw error;
  }
};
