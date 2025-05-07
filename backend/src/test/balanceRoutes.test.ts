import { test } from 'tap';
import { FastifyInstance } from 'fastify';
import fastify from 'fastify';

// Use require to handle path mappings with ts-node
const BalanceService = require('../application/balanceService').BalanceService;
const BalanceRoutes = require('../api/routes/balanceRoutes').BalanceRoutes;
const TokenService = require('../infrastructure/ethereum/tokenService').TokenService;
const { TokenBalance } = require('../domain/types');
const { SUPPORTED_TOKENS } = require('../infrastructure/ethereum/config');

// Define token interface for the tests
interface TokenDefinition {
  symbol: string;
  address: string;
  decimals: number;
}

interface TokenBalanceItem {
  symbol: string;
  address: string;
  balance: string;
  decimals: number;
}

// Mock implementation of the TokenService
class MockTokenService extends TokenService {
  private mockValidAddress: boolean = true;
  private mockBalances: TokenBalanceItem[] = [];
  private mockError: Error | null = null;

  setMockValidAddress(isValid: boolean): void {
    this.mockValidAddress = isValid;
  }

  setMockBalances(balances: TokenBalanceItem[]): void {
    this.mockBalances = balances;
  }

  setMockError(error: Error | null): void {
    this.mockError = error;
  }

  // Override methods that would make actual RPC calls
  isValidAddress(address: string): boolean {
    return this.mockValidAddress;
  }

  async getEthBalance(address: string, tokenDef: TokenDefinition): Promise<TokenBalanceItem> {
    if (this.mockError) {
      throw this.mockError;
    }
    
    const mockEthBalance = this.mockBalances.find(b => b.symbol === 'ETH');
    return mockEthBalance || {
      symbol: 'ETH',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      balance: '1000000000000000000', // 1 ETH
      decimals: 18
    };
  }

  async getTokenBalance(address: string, tokenDef: TokenDefinition): Promise<TokenBalanceItem> {
    if (this.mockError) {
      throw this.mockError;
    }
    
    const mockTokenBalance = this.mockBalances.find(b => b.symbol === tokenDef.symbol);
    return mockTokenBalance || {
      symbol: tokenDef.symbol,
      address: tokenDef.address,
      balance: '1000000000', // Just a default value
      decimals: tokenDef.decimals
    };
  }
}

// Setup function to create a test server
function buildTestServer(): {
  app: FastifyInstance;
  mockTokenService: MockTokenService;
} {
  const app = fastify({
    logger: false // Disable logging for tests
  });
  
  const mockTokenService = new MockTokenService();
  const balanceService = new BalanceService(mockTokenService);
  const balanceRoutes = new BalanceRoutes(balanceService);
  
  balanceRoutes.registerRoutes(app);
  
  return { app, mockTokenService };
}

// Test suite
test('Balance Routes', async (t) => {
  
  t.test('GET /api/balance - should return balances for valid address', async (t) => {
    const { app, mockTokenService } = buildTestServer();
    
    // Create mock balances for all supported tokens to ensure consistency
    const mockBalances = SUPPORTED_TOKENS.map((token: TokenDefinition) => ({
      symbol: token.symbol,
      address: token.address,
      balance: token.symbol === 'ETH' ? '2000000000000000000' : // 2 ETH
               token.symbol === 'USDC' ? '5000000' : // 5 USDC
               '1000000000', // Default for other tokens
      decimals: token.decimals
    }));
    
    mockTokenService.setMockBalances(mockBalances);
    
    const response = await app.inject({
      method: 'GET',
      url: '/api/balance?address=0x123456789012345678901234567890123456789A'
    });
    
    t.equal(response.statusCode, 200);
    
    const payload = JSON.parse(response.payload);
    t.equal(payload.address, '0x123456789012345678901234567890123456789A');
    
    // Check that all expected tokens are present
    t.equal(payload.balances.length, mockBalances.length);
    
    // Check each token individually to make debugging easier
    for (const token of SUPPORTED_TOKENS) {
      const expectedToken = mockBalances.find((b: TokenBalanceItem) => b.symbol === token.symbol);
      const actualToken = payload.balances.find((b: TokenBalanceItem) => b.symbol === token.symbol);
      t.ok(actualToken, `Should include ${token.symbol} token`);
      t.same(actualToken, expectedToken, `${token.symbol} token data should match`);
    }
  });
  
  t.test('GET /api/balance - should return 400 for invalid address', async (t) => {
    const { app, mockTokenService } = buildTestServer();
    
    mockTokenService.setMockValidAddress(false);
    
    const response = await app.inject({
      method: 'GET',
      url: '/api/balance?address=invalid'
    });
    
    t.equal(response.statusCode, 400);
    
    const payload = JSON.parse(response.payload);
    t.equal(payload.statusCode, 400);
    t.equal(payload.error, 'Bad Request');
    t.type(payload.message, 'string');
  });
  
  t.test('GET /api/balance - should return 500 when no balances are available', async (t) => {
    const { app, mockTokenService } = buildTestServer();
    
    // Set empty balances to simulate failure to retrieve balances
    mockTokenService.setMockBalances([]);
    
    // Set error for token service methods
    mockTokenService.setMockError(new Error('Test error'));
    
    const response = await app.inject({
      method: 'GET',
      url: '/api/balance?address=0x123456789012345678901234567890123456789A'
    });
    
    t.equal(response.statusCode, 500);
    
    const payload = JSON.parse(response.payload);
    t.equal(payload.statusCode, 500);
    t.equal(payload.error, 'Internal Server Error');
  });
  
  t.test('GET /api/balance - should validate request schema for missing address', async (t) => {
    const { app } = buildTestServer();
    
    // Missing required address parameter
    const response = await app.inject({
      method: 'GET',
      url: '/api/balance'
    });
    
    t.equal(response.statusCode, 400);
    
    const payload = JSON.parse(response.payload);
    t.equal(payload.statusCode, 400);
    t.equal(payload.error, 'Bad Request');
  });
  
  t.test('GET /api/balance - should validate address format in request schema', async (t) => {
    const { app } = buildTestServer();
    
    // Address with invalid format (not matching Ethereum address pattern)
    const response = await app.inject({
      method: 'GET',
      url: '/api/balance?address=0xinvalidAddressFormat'
    });
    
    t.equal(response.statusCode, 400);
    
    const payload = JSON.parse(response.payload);
    t.equal(payload.statusCode, 400);
    t.equal(payload.error, 'Bad Request');
    t.match(payload.message, /pattern/, 'Error message should mention pattern validation');
  });
});
