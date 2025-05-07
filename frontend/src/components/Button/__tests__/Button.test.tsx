import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('renders button with text', () => {
    // Arrange
    render(<Button>Click me</Button>);
    
    // Act
    const button = screen.getByText('Click me');
    
    // Assert
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    // Arrange
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    // Act
    const button = screen.getByText('Click me');
    await userEvent.click(button);
    
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading is true', () => {
    // Arrange
    render(<Button isLoading>Click me</Button>);
    
    // Act & Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Click me')).not.toBeInTheDocument();
  });

  it('is disabled when isLoading is true', async () => {
    // Arrange
    const handleClick = vi.fn();
    render(<Button isLoading onClick={handleClick}>Click me</Button>);
    
    // Act
    const button = screen.getByText('Loading...');
    await userEvent.click(button);
    
    // Assert
    expect(handleClick).not.toHaveBeenCalled();
    expect(button.closest('button')).toBeDisabled();
  });
}); 