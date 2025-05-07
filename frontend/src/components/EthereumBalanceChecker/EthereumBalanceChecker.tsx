import { useState } from 'react';
import type { BalanceResponse } from '../../types/ethereum';
import { fetchEthereumBalance } from '../../services/ethereumService';
import { EthereumAddressForm } from '../EthereumAddressForm/EthereumAddressForm';
import { BalancesList } from '../BalancesList/BalancesList';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import styles from './EthereumBalanceChecker.module.css';

export const EthereumBalanceChecker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balanceData, setBalanceData] = useState<BalanceResponse | null>(null);

  const handleAddressSubmit = async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchEthereumBalance(address);
      setBalanceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance data');
      setBalanceData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <div className={styles.container}>
      <EthereumAddressForm onSubmit={handleAddressSubmit} isLoading={isLoading} />
      
      {error && <ErrorMessage message={error} onDismiss={clearError} />}
      
      {isLoading && <div className={styles.loading}>Loading balance data...</div>}
      
      {balanceData && !isLoading && (
        <BalancesList address={balanceData.address} balances={balanceData.balances} />
      )}
    </div>
  );
};
