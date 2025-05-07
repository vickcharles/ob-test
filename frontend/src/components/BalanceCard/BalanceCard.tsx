import type { TokenBalance } from '../../types/ethereum';
import { formatBalance } from '../../utils/formatters';
import styles from './BalanceCard.module.css';

interface BalanceCardProps {
  balance: TokenBalance;
}

export const BalanceCard = ({ balance }: BalanceCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.tokenName}>{balance.symbol}</div>
      <div className={styles.balanceAmount}>{formatBalance(balance.balance, balance.decimals)}</div>
    </div>
  );
};