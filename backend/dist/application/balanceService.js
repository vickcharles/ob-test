"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceService = void 0;
const types_1 = require("../domain/types");
const config_1 = require("../infrastructure/ethereum/config");
class BalanceService {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    async getBalances(address) {
        // Validate address format
        if (!this.tokenService.isValidAddress(address)) {
            throw {
                type: types_1.ErrorType.INVALID_ADDRESS,
                message: `Invalid Ethereum address: ${address}`
            };
        }
        // Get all token balances in parallel, handling errors for each individually
        const balancePromises = config_1.SUPPORTED_TOKENS.map(async (token) => {
            try {
                // ETH needs special handling as it's the native token
                if (token.symbol === 'ETH') {
                    return await this.tokenService.getEthBalance(address, token);
                }
                else {
                    return await this.tokenService.getTokenBalance(address, token);
                }
            }
            catch (error) {
                // Log the error but don't fail the entire request
                console.error(`Error fetching ${token.symbol} balance:`, error);
                return null;
            }
        });
        // Wait for all promises to resolve
        const results = await Promise.all(balancePromises);
        // Filter out failed token balance requests
        const balances = results.filter((balance) => balance !== null);
        // If no balances could be retrieved, return an error
        if (balances.length === 0) {
            throw {
                type: types_1.ErrorType.NO_BALANCES_AVAILABLE,
                message: 'Failed to retrieve any token balances'
            };
        }
        return {
            address,
            balances
        };
    }
}
exports.BalanceService = BalanceService;
