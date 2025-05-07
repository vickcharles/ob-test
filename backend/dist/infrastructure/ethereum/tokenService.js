"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const ethers_1 = require("ethers");
const types_1 = require("../../domain/types");
const config_1 = require("./config");
// Standard ERC20 ABI for balanceOf method
const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)'
];
class TokenService {
    constructor() {
        this.provider = new ethers_1.ethers.JsonRpcProvider(config_1.ETHEREUM_RPC_URL);
    }
    // Validates Ethereum address format
    isValidAddress(address) {
        return ethers_1.ethers.isAddress(address);
    }
    // Get ETH balance
    async getEthBalance(address, tokenDef) {
        try {
            const balance = await this.provider.getBalance(address);
            return {
                symbol: tokenDef.symbol,
                address: tokenDef.address,
                balance: balance.toString(),
                decimals: tokenDef.decimals
            };
        }
        catch (error) {
            throw this.handleRpcError(error, `Failed to get ETH balance for ${address}`);
        }
    }
    // Get ERC20 token balance
    async getTokenBalance(address, tokenDef) {
        try {
            const tokenContract = new ethers_1.ethers.Contract(tokenDef.address, ERC20_ABI, this.provider);
            const balance = await tokenContract.balanceOf(address);
            return {
                symbol: tokenDef.symbol,
                address: tokenDef.address,
                balance: balance.toString(),
                decimals: tokenDef.decimals
            };
        }
        catch (error) {
            throw this.handleRpcError(error, `Failed to get ${tokenDef.symbol} balance for ${address}`);
        }
    }
    handleRpcError(error, message) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            type: types_1.ErrorType.RPC_ERROR,
            message,
            details: errorMessage
        };
    }
}
exports.TokenService = TokenService;
