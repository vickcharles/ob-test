import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BalancesList } from '../BalancesList';
import type { TokenBalance } from '@/types/balance';

// Mock the BalanceCard component
vi.mock('@/components/BalanceCard/BalanceCard', () => ({
  BalanceCard: ({ balance }: { balance: TokenBalance }) => (
    <div data-testid={`balance-card-${balance.symbol}`}>
      Symbol: {balance.symbol}, Balance: {balance.balance}
    </div>
  ),
}));

describe('BalancesList', () => {
  const mockAddress = '0x123456789012345678901234567890123456789a';
  
  it('displays a message when there are no balances', () => {
    // Arrange
    render(<BalancesList address={mockAddress} balances={[]} />);
    
    // Assert
    expect(screen.getByText(/no token balances found/i)).toBeInTheDocument();
  });

  it('renders the Ethereum address', () => {
    // Arrange
    const mockBalances: TokenBalance[] = [
      { symbol: 'ETH', address: '0x0', balance: '1.5', decimals: 18 }
    ];
    
    render(<BalancesList address={mockAddress} balances={mockBalances} />);
    
    // Assert
    expect(screen.getByText(mockAddress)).toBeInTheDocument();
  });

  it('renders balance cards for each token', () => {
    // Arrange
    const mockBalances: TokenBalance[] = [
      { symbol: 'ETH', address: '0x0', balance: '1.5', decimals: 18 },
      { symbol: 'DAI', address: '0x1', balance: '100.0', decimals: 18 },
      { symbol: 'USDC', address: '0x2', balance: '200.0', decimals: 6 }
    ];
    
    render(<BalancesList address={mockAddress} balances={mockBalances} />);
    
    // Assert
    expect(screen.getByTestId('balance-card-ETH')).toBeInTheDocument();
    expect(screen.getByTestId('balance-card-DAI')).toBeInTheDocument();
    expect(screen.getByTestId('balance-card-USDC')).toBeInTheDocument();
    expect(screen.getByText(/symbol: eth, balance: 1.5/i)).toBeInTheDocument();
  });
}); 