import { useState } from 'react';
import type { BalanceResponse } from '../../types/balance';
import { fetchEthereumBalance } from '../../services/balanceService';
import { EthereumAddressForm } from '../EthereumAddressForm/EthereumAddressForm';
import { BalancesList } from '../BalancesList/BalancesList';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Button } from '../Button';

export const EthereumBalanceChecker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balanceData, setBalanceData] = useState<BalanceResponse | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleAddressSubmit = async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchEthereumBalance(address);
      setBalanceData(data);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance data');
      setBalanceData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  
  const handleCheckAnother = () => {
    setShowForm(true);
    setBalanceData(null);
  };

  return (
    <div className="flex flex-col items-center p-8 w-full max-w-3xl mx-auto dark:text-white">
      {showForm && <EthereumAddressForm onSubmit={handleAddressSubmit} isLoading={isLoading} />}   
      {error && <ErrorMessage message={error} onDismiss={clearError} />}
  
      {balanceData && !isLoading && (
        <>
          <BalancesList address={balanceData.address} balances={balanceData.balances} />
          <div className="mt-6">
            <Button onClick={handleCheckAnother}>Check Another Address</Button>
          </div>
        </>
      )}
    </div>
  );
};
