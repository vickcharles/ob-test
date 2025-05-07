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
  // Convert string balance to a number, considering decimals
  const numericBalance = typeof balance === 'string' 
    ? Number(balance) / Math.pow(10, decimals)
    : balance;
    
  if (numericBalance >= 1) {
    // Format larger numbers with commas and up to 4 decimal places
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4
    }).format(numericBalance);
  } else if (numericBalance >= 0.0001) {
    // For smaller but not tiny numbers: show 5 significant digits
    return numericBalance.toFixed(5);
  } else {
    // For very small numbers: show 8 significant digits
    return numericBalance.toFixed(8);
  }
}; 