import type { EthereumBalance } from '../../types/ethereum';
import { BalanceCard } from '../BalanceCard/BalanceCard';
import styles from './BalancesList.module.css';

interface BalancesListProps {
  address: string;
  balances: EthereumBalance[];
}

export const BalancesList = ({ address, balances }: BalancesListProps) => {
  if (!balances.length) {
    return <div className={styles.noBalances}>No token balances found for this address.</div>;
  }

  return (
    <div className={styles.list}>
      <div className={styles.addressSection}>
        <h3 className={styles.heading}>Balances for</h3>
        <div className={styles.addressDisplay}>{address}</div>
      </div>
      
      <div className={styles.grid}>
        {balances.map((balance, index) => (
          <BalanceCard key={`${balance.token}-${index}`} balance={balance} />
        ))}
      </div>
    </div>
  );
}; 