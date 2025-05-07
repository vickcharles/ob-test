import { createPublicClient, http, formatUnits, isAddress, getContract } from 'viem';
import { mainnet } from 'viem/chains';
import { AppError, ErrorType, TokenBalance, TokenDefinition } from '../../domain/types';
import { ETHEREUM_RPC_URL } from './config';
import { ERC20_ABI } from './erc20Abi';

export class TokenService {
  private client: ReturnType<typeof createPublicClient>;

  constructor() {
    this.client = createPublicClient({
      chain: mainnet,
      transport: http(ETHEREUM_RPC_URL)
    });
  }

  public isValidAddress(address: string): boolean {
    return isAddress(address);
  }

  public async getEthBalance(address: string, tokenDef: TokenDefinition): Promise<TokenBalance> {
    try {
      const balance = await this.client.getBalance({ 
        address: address as `0x${string}` 
      });
      
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
      const contract = getContract({
        address: tokenDef.address as `0x${string}`,
        abi: ERC20_ABI,
        client: this.client
      });
      
      const balance = await contract.read.balanceOf([address as `0x${string}`]);
      
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
