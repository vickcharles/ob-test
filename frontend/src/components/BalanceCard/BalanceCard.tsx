import type { TokenBalance } from '@/types/balance';
import { formatBalance } from '@/utils/formatters';

interface BalanceCardProps {
  balance: TokenBalance;
}

export const BalanceCard = ({ balance }: BalanceCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">{balance.symbol}</div>
      <div className="text-2xl font-mono text-primary-600 dark:text-primary-400">
        {formatBalance(balance.balance, balance.decimals)}
      </div>
    </div>
  );
};