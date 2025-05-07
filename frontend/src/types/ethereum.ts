/**
 * Representa el balance de un token individual
 */
export interface TokenBalance {
  symbol: string;
  address: string;
  balance: string;
  decimals: number;
}

/**
 * Respuesta completa de balances para una dirección
 */
export interface BalanceResponse {
  address: string;
  balances: TokenBalance[];
}

/**
 * Tipo de error de la API
 */
export enum ErrorType {
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  NO_BALANCES_AVAILABLE = 'NO_BALANCES_AVAILABLE',
  RPC_ERROR = 'RPC_ERROR'
}

/**
 * Estructura de error de la API
 */
export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}