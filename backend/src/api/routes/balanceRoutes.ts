import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { BalanceService } from '@/application/balanceService';
import { ErrorType } from '@/domain/types';
import { balanceSchema } from '@/api/schemas/balanceSchema';

interface BalanceQuery {
  address: string;
}

export class BalanceRoutes {
  private balanceService: BalanceService;

  constructor(balanceService: BalanceService) {
    this.balanceService = balanceService;
  }

  public registerRoutes(server: FastifyInstance): void {
    server.get<{
      Querystring: BalanceQuery;
    }>('/api/balance', {
      schema: balanceSchema,
      config: {
        // Enable caching for this route with 60 seconds TTL
        cache: {
          // Generate a unique cache key based on the address parameter
          generateCacheKey: (request: FastifyRequest<{ Querystring: BalanceQuery }>) => {
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

  private async getBalance(
    request: FastifyRequest<{ Querystring: BalanceQuery }>,
    reply: FastifyReply
  ): Promise<void> {
    const { address } = request.query;

    try {
      const result = await this.balanceService.getBalances(address);
      request.log.info(`Retrieved balances for address: ${address}`);
      reply.send(result);
    } catch (error: any) {

      if (error.type === ErrorType.INVALID_ADDRESS) {
        reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: error.message
        });
      } else if (error.type === ErrorType.NO_BALANCES_AVAILABLE) {
        reply.code(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: error.message
        });
      } else {

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