export interface EthereumBalance {
  token: string;
  balance: number;
}

export interface BalanceResponse {
  address: string;
  balances: EthereumBalance[];
}