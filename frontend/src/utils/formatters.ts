import { formatEther, formatUnits } from 'viem';

/**
 * Formats a balance to display it user-friendly:
 * - Large numbers (≥1): Up to 4 decimal places with comma separators
 * - Small numbers (<1 and ≥0.0001): Up to 5 digits after first non-zero decimal
 * - Very small numbers (<0.0001): Up to 8 digits after first non-zero decimal
 * 
 * @param balance The balance as a string or number
 * @param decimals The number of decimals for the token (default: 18 for ETH)
 * @returns A formatted string representation of the balance
 */

export const formatBalance = (balance: string | number, decimals: number = 18): string => {
  try {
    // Convert to bigint for viem functions
    const balanceBigInt = typeof balance === 'string' 
      ? BigInt(balance)
      : BigInt(balance.toString());
    
    // Use viem's formatUnits (or formatEther for ETH)
    const formattedValue = decimals === 18 
      ? formatEther(balanceBigInt) 
      : formatUnits(balanceBigInt, decimals);
    
    const numericValue = parseFloat(formattedValue);
    
    if (numericValue >= 1) {
      // Format larger numbers with commas and up to 4 decimal places
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
      }).format(numericValue);
    } else if (numericValue >= 0.0001) {
      // For smaller but not tiny numbers: show 5 significant digits
      return numericValue.toFixed(5);
    } else {
      // For very small numbers: show 8 significant digits
      return numericValue.toFixed(8);
    }
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0';
  }
}; 