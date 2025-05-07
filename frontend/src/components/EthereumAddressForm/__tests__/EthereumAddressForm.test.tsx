import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EthereumAddressForm } from '../EthereumAddressForm';

// Mock the isAddress function from viem
vi.mock('viem', () => ({
  isAddress: (address: string) => address === '0x123456789012345678901234567890123456789a',
}));

describe('EthereumAddressForm', () => {
  it('renders the form with input and submit button', () => {
    // Arrange
    render(<EthereumAddressForm onSubmit={vi.fn()} isLoading={false} />);
    
    // Assert
    expect(screen.getByLabelText(/ethereum address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('validates empty address and shows error message', async () => {
    // Arrange
    render(<EthereumAddressForm onSubmit={vi.fn()} isLoading={false} />);
    
    // Act
    await userEvent.click(screen.getByRole('button', { name: /continue/i }));
    
    // Assert
    expect(screen.getByText(/please enter an ethereum address/i)).toBeInTheDocument();
  });

  it('validates invalid ethereum address and shows error message', async () => {
    // Arrange
    render(<EthereumAddressForm onSubmit={vi.fn()} isLoading={false} />);
    
    // Act
    const input = screen.getByLabelText(/ethereum address/i);
    await userEvent.type(input, 'invalid-address');
    await userEvent.click(screen.getByRole('button', { name: /continue/i }));
    
    // Assert
    expect(screen.getByText(/please enter a valid ethereum address/i)).toBeInTheDocument();
  });

  it('calls onSubmit with ethereum address when form is submitted with valid address', async () => {
    // Arrange
    const handleSubmit = vi.fn();
    render(<EthereumAddressForm onSubmit={handleSubmit} isLoading={false} />);
    
    // Act
    const input = screen.getByLabelText(/ethereum address/i);
    const validAddress = '0x123456789012345678901234567890123456789a';
    await userEvent.type(input, validAddress);
    await userEvent.click(screen.getByRole('button', { name: /continue/i }));
    
    // Assert
    expect(handleSubmit).toHaveBeenCalledWith(validAddress);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables the form when isLoading is true', () => {
    // Arrange
    render(<EthereumAddressForm onSubmit={vi.fn()} isLoading={true} />);
    
    // Assert
    expect(screen.getByLabelText(/ethereum address/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });
}); 