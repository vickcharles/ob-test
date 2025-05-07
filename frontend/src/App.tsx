import { EthereumBalanceChecker } from './components/EthereumBalanceChecker/EthereumBalanceChecker';
import { useEffect } from 'react';

function App() {
  // Set dark mode based on class
  useEffect(() => {
    // Add 'dark' class to html for dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center bg-white dark:bg-gray-900">
      <div className="w-full flex flex-col items-center p-4 md:p-6">
        <EthereumBalanceChecker />
      </div>
    </div>
  );
}

export default App;
