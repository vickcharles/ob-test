import type { TokenBalance } from '../../types/ethereum';
import { BalanceCard } from '../BalanceCard/BalanceCard';

interface BalancesListProps {
  address: string;
  balances: TokenBalance[];
}

export const BalancesList = ({ address, balances }: BalancesListProps) => {
  if (!balances.length) {
    return <div className="p-6 text-center text-gray-600 dark:text-gray-400 italic">No token balances found for this address.</div>;
  }

  return (
    <div className="w-full mt-6">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Balances for</h3>
        <div className="mt-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-hidden overflow-ellipsis break-all text-primary-700 dark:text-primary-400 font-mono">
          {address}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {balances.map((balance, index) => (
          <BalanceCard key={`${balance.symbol}-${index}`} balance={balance} />
        ))}
      </div>
    </div>
  );
}; 