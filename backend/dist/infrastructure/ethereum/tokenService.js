"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const types_1 = require("../../domain/types");
const config_1 = require("./config");
const erc20Abi_1 = require("./erc20Abi");
class TokenService {
    constructor() {
        this.client = (0, viem_1.createPublicClient)({
            chain: chains_1.mainnet,
            transport: (0, viem_1.http)(config_1.ETHEREUM_RPC_URL)
        });
    }
    isValidAddress(address) {
        return (0, viem_1.isAddress)(address);
    }
    async getEthBalance(address, tokenDef) {
        try {
            const balance = await this.client.getBalance({
                address: address
            });
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
    async getTokenBalance(address, tokenDef) {
        try {
            const contract = (0, viem_1.getContract)({
                address: tokenDef.address,
                abi: erc20Abi_1.ERC20_ABI,
                client: this.client
            });
            const balance = await contract.read.balanceOf([address]);
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
