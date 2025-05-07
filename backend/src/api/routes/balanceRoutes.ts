import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { BalanceService } from '../../application/balanceService';
import { ErrorType } from '../../domain/types';
import { balanceSchema } from '../schemas/balanceSchema';

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
    }, this.getBalance.bind(this));
  }

  private async getBalance(
    request: FastifyRequest<{ Querystring: BalanceQuery }>,
    reply: FastifyReply
  ): Promise<void> {
    const { address } = request.query;

    try {
      const result = await this.balanceService.getBalances(address);
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