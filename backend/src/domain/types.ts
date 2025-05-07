export interface TokenBalance {
  symbol: string;
  address: string;
  balance: string;
  decimals: number;
}

export interface BalanceResponse {
  address: string;
  balances: TokenBalance[];
}

export interface TokenDefinition {
  symbol: string;
  address: string;
  decimals: number;
}

export enum ErrorType {
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  NO_BALANCES_AVAILABLE = 'NO_BALANCES_AVAILABLE',
  RPC_ERROR = 'RPC_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: unknown;
}
