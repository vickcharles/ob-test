import { TokenDefinition } from '@/domain/types';

export const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo';

export const SUPPORTED_TOKENS: TokenDefinition[] = [
  {
    symbol: 'ETH',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Conventional address for native ETH
    decimals: 18
  },
  {
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum mainnet
    decimals: 6
  },
  {
    symbol: 'LINK',
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK on Ethereum mainnet
    decimals: 18
  }
];
