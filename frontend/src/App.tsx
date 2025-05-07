import { EthereumBalanceChecker } from './components/EthereumBalanceChecker/EthereumBalanceChecker';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <EthereumBalanceChecker />
      </div>
    </div>
  );
}

export default App;
