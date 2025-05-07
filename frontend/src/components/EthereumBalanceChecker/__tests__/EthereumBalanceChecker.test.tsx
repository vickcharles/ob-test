import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EthereumBalanceChecker } from '../EthereumBalanceChecker';
import type { BalanceResponse, TokenBalance } from '@/types/balance';

// Mock the services
vi.mock('@/services/balanceService', () => ({
  fetchEthereumBalance: vi.fn().mockImplementation(async (address: string) => {
    if (address === 'error') {
      throw new Error('Failed to fetch balance');
    }
    return {
      address,
      balances: [
        { symbol: 'ETH', address: '0x0', balance: '1.5', decimals: 18 },
        { symbol: 'DAI', address: '0x1', balance: '100.0', decimals: 18 }
      ]
    } as BalanceResponse;
  })
}));

// Mock child components
vi.mock('@/components/EthereumAddressForm/EthereumAddressForm', () => ({
  EthereumAddressForm: ({ onSubmit, isLoading }: { onSubmit: (address: string) => void, isLoading: boolean }) => (
    <div data-testid="address-form">
      <input 
        data-testid="address-input" 
        placeholder="Enter Ethereum address"
        disabled={isLoading}
      />
      <button 
        data-testid="submit-button" 
        onClick={() => onSubmit('0x123456789012345678901234567890123456789a')}
        disabled={isLoading}
      >
        Submit
      </button>
    </div>
  )
}));

vi.mock('@/components/BalancesList/BalancesList', () => ({
  BalancesList: ({ address, balances }: { address: string, balances: TokenBalance[] }) => (
    <div data-testid="balances-list">
      <div>Address: {address}</div>
      <div>Tokens: {balances.length}</div>
      {balances.map((b, i) => (
        <div key={i} data-testid={`token-${b.symbol}`}>
          {b.symbol}: {b.balance}
        </div>
      ))}
    </div>
  )
}));

vi.mock('@/components/ErrorMessage/ErrorMessage', () => ({
  ErrorMessage: ({ message, onDismiss }: { message: string, onDismiss: () => void }) => (
    <div data-testid="error-message">
      Error: {message}
      <button data-testid="dismiss-error" onClick={onDismiss}>Dismiss</button>
    </div>
  )
}));

describe('EthereumBalanceChecker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the address form initially', () => {
    // Arrange
    render(<EthereumBalanceChecker />);
    
    // Assert
    expect(screen.getByTestId('address-form')).toBeInTheDocument();
  });

  it('fetches balance data when address is submitted and displays balances', async () => {
    // Arrange
    render(<EthereumBalanceChecker />);
    
    // Act
    await userEvent.click(screen.getByTestId('submit-button'));
    
    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('balances-list')).toBeInTheDocument();
    });
    expect(screen.getByText('Address: 0x123456789012345678901234567890123456789a')).toBeInTheDocument();
    expect(screen.getByText('Tokens: 2')).toBeInTheDocument();
    expect(screen.getByTestId('token-ETH')).toBeInTheDocument();
    expect(screen.getByTestId('token-DAI')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    // Arrange
    render(<EthereumBalanceChecker />);
    
    // Mock a failure response
    const { fetchEthereumBalance } = await import('@/services/balanceService');
    vi.mocked(fetchEthereumBalance).mockRejectedValueOnce(new Error('Failed to fetch balance'));
    
    // Act
    await userEvent.click(screen.getByTestId('submit-button'));
    
    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
    expect(screen.getByText(/error: failed to fetch balance/i)).toBeInTheDocument();
  });

  it('allows checking another address after viewing results', async () => {
    // Arrange
    render(<EthereumBalanceChecker />);
    
    // Step 1: Submit an address and view results
    await userEvent.click(screen.getByTestId('submit-button'));
    
    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByTestId('balances-list')).toBeInTheDocument();
    });
    
    // Step 2: Click "Check Another Address" button
    const checkAnotherButton = screen.getByRole('button', { name: /check another address/i });
    await userEvent.click(checkAnotherButton);
    
    // Assert: Address form should be visible again
    expect(screen.getByTestId('address-form')).toBeInTheDocument();
    expect(screen.queryByTestId('balances-list')).not.toBeInTheDocument();
  });
}); 