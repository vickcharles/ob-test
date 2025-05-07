import { useState } from 'react';
import type { FormEvent } from 'react';
import styles from './EthereumAddressForm.module.css';

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
    <div className={styles.form}>
      <h2 className={styles.heading}>Ethereum Balance Checker</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="address" className={styles.label}>Ethereum Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            disabled={isLoading}
            className={styles.input}
          />
          {error && <div className={styles.errorText}>{error}</div>}
        </div>
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? 'Loading...' : 'Check Balance'}
        </button>
      </form>
    </div>
  );
}; 