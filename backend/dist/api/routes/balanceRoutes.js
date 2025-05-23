"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceRoutes = void 0;
const types_1 = require("@/domain/types");
const balanceSchema_1 = require("@/api/schemas/balanceSchema");
class BalanceRoutes {
    constructor(balanceService) {
        this.balanceService = balanceService;
    }
    registerRoutes(server) {
        server.get('/api/balance', {
            schema: balanceSchema_1.balanceSchema,
            config: {
                // Enable caching for this route with 60 seconds TTL
                cache: {
                    // Generate a unique cache key based on the address parameter
                    generateCacheKey: (request) => {
                        return `balance:${request.query.address}`;
                    }
                }
            },
            onRequest: (request, reply, done) => {
                request.log.info(`Processing balance request for address: ${request.query.address}`);
                done();
            }
        }, this.getBalance.bind(this));
    }
    async getBalance(request, reply) {
        const { address } = request.query;
        try {
            const result = await this.balanceService.getBalances(address);
            request.log.info(`Retrieved balances for address: ${address}`);
            reply.send(result);
        }
        catch (error) {
            if (error.type === types_1.ErrorType.INVALID_ADDRESS) {
                reply.code(400).send({
                    statusCode: 400,
                    error: 'Bad Request',
                    message: error.message
                });
            }
            else if (error.type === types_1.ErrorType.NO_BALANCES_AVAILABLE) {
                reply.code(500).send({
                    statusCode: 500,
                    error: 'Internal Server Error',
                    message: error.message
                });
            }
            else {
                request.log.error(error);
                reply.code(500).send({
                    statusCode: 500,
                    error: 'Internal Server Error',
                    message: 'An unexpected error occurred while fetching balances'
                });
            }
        }
    }
}
exports.BalanceRoutes = BalanceRoutes;
//# sourceMappingURL=balanceRoutes.js.map