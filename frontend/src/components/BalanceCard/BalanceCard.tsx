import type { EthereumBalance } from '../../types/ethereum';
import { formatBalance } from '../../utils/formatters';
import styles from './BalanceCard.module.css';

interface BalanceCardProps {
  balance: EthereumBalance;
}

export const BalanceCard = ({ balance }: BalanceCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.tokenName}>{balance.token}</div>
      <div className={styles.balanceAmount}>{formatBalance(balance.balance)}</div>
    </div>
  );
};