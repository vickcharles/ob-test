import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../Button';

interface EthereumAddressFormProps {
  onSubmit: (address: string) => void;
  isLoading: boolean;
}

export const EthereumAddressForm = ({ onSubmit, isLoading }: EthereumAddressFormProps) => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const validateEthereumAddress = (address: string): boolean => {
    // Basic Ethereum address validation (starts with 0x and has 42 chars total)
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setError('Please enter an Ethereum address');
      return;
    }
    
    if (!validateEthereumAddress(address)) {
      setError('Please enter a valid Ethereum address (0x followed by 40 hexadecimal characters)');
      return;
    }
    
    setError('');
    onSubmit(address);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Check Your Balance</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ethereum Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                      focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
          {error && <div className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</div>}
        </div>
        <Button 
          type="submit" 
          isLoading={isLoading}
          className="w-full"
        >
          Continue
        </Button>
      </form>
    </div>
  );
}; 