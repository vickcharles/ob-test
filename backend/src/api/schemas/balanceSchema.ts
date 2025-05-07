import { FastifySchema } from 'fastify';

export const balanceSchema: FastifySchema = {
  querystring: {
    type: 'object',
    required: ['address'],
    properties: {
      address: { 
        type: 'string',
        pattern: '^0x[a-fA-F0-9]{40}$',
        description: 'Ethereum address to fetch balances for'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        address: { type: 'string' },
        balances: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              symbol: { type: 'string' },
              address: { type: 'string' },
              balance: { type: 'string' },
              decimals: { type: 'number' }
            }
          }
        }
      }
    },
    400: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    500: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};