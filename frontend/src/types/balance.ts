
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

export enum ErrorType {
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  NO_BALANCES_AVAILABLE = 'NO_BALANCES_AVAILABLE',
  RPC_ERROR = 'RPC_ERROR'
}


export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}