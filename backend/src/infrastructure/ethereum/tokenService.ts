import { ethers } from 'ethers';
import { AppError, ErrorType, TokenBalance, TokenDefinition } from '../../domain/types';
import { ETHEREUM_RPC_URL } from './config';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

export class TokenService {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);
  }

  public isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  public async getEthBalance(address: string, tokenDef: TokenDefinition): Promise<TokenBalance> {
    try {
      const balance = await this.provider.getBalance(address);
      
      return {
        symbol: tokenDef.symbol,
        address: tokenDef.address,
        balance: balance.toString(),
        decimals: tokenDef.decimals
      };
    } catch (error) {
      throw this.handleRpcError(error, `Failed to get ETH balance for ${address}`);
    }
  }


  public async getTokenBalance(address: string, tokenDef: TokenDefinition): Promise<TokenBalance> {
    try {
      const tokenContract = new ethers.Contract(tokenDef.address, ERC20_ABI, this.provider);
      const balance = await tokenContract.balanceOf(address);
      
      return {
        symbol: tokenDef.symbol,
        address: tokenDef.address,
        balance: balance.toString(),
        decimals: tokenDef.decimals
      };
    } catch (error) {
      throw this.handleRpcError(error, `Failed to get ${tokenDef.symbol} balance for ${address}`);
    }
  }

  private handleRpcError(error: unknown, message: string): AppError {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      type: ErrorType.RPC_ERROR,
      message,
      details: errorMessage
    };
  }
} 
