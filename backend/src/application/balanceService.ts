import { AppError, BalanceResponse, ErrorType, TokenBalance } from '../domain/types';
import { SUPPORTED_TOKENS } from '../infrastructure/ethereum/config';
import { TokenService } from '../infrastructure/ethereum/tokenService';

export class BalanceService {
  private tokenService: TokenService;

  constructor(tokenService: TokenService) {
    this.tokenService = tokenService;
  }

  public async getBalances(address: string): Promise<BalanceResponse> {
    // Validate address format
    if (!this.tokenService.isValidAddress(address)) {
      throw {
        type: ErrorType.INVALID_ADDRESS,
        message: `Invalid Ethereum address: ${address}`
      } as AppError;
    }

    // Get all token balances in parallel, handling errors for each individually
    const balancePromises = SUPPORTED_TOKENS.map(async (token) => {
      try {
        // ETH needs special handling as it's the native token
        if (token.symbol === 'ETH') {
          return await this.tokenService.getEthBalance(address, token);
        } else {
          return await this.tokenService.getTokenBalance(address, token);
        }
      } catch (error) {
        // Log the error but don't fail the entire request
        console.error(`Error fetching ${token.symbol} balance:`, error);
        return null;
      }
    });


    const results = await Promise.all(balancePromises);
    

    const balances = results.filter((balance): balance is TokenBalance => balance !== null);


    if (balances.length === 0) {
      throw {
        type: ErrorType.NO_BALANCES_AVAILABLE,
        message: 'Failed to retrieve any token balances'
      } as AppError;
    }

    return {
      address,
      balances
    };
  }
}