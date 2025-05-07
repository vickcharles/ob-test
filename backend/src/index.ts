import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { BalanceService } from './application/balanceService'
import { BalanceRoutes } from './api/routes/balanceRoutes'
import { TokenService } from './infrastructure/ethereum/tokenService'

const server: FastifyInstance = fastify({
  logger: true
})

// Register CORS
server.register(cors, {
  origin: true, // Permite todas las origenes en desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
});

const tokenService = new TokenService()
const balanceService = new BalanceService(tokenService)
const balanceRoutes = new BalanceRoutes(balanceService)

balanceRoutes.registerRoutes(server)

interface IQuerystring {
  name?: string
}

interface IHeaders {
  'h-Custom': string
}

server.get<{
  Querystring: IQuerystring,
  Headers: IHeaders
}>('/hello', {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    },
    headers: {
      type: 'object',
      required: ['h-Custom'],
      properties: {
        'h-Custom': { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  const { name } = request.query
  const customHeader = request.headers['h-Custom']
  
  return {
    hello: name || 'world',
    customHeader
  }
})

// Add error handler
server.setErrorHandler((error, request, reply) => {
  request.log.error(error)
  
  // Handle validation errors from schema validation
  if (error.validation) {
    reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: error.message
    })
    return
  }
  
  reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  })
})

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001
    await server.listen({ port, host: '0.0.0.0' })
    console.log(`Server is running on http://localhost:${port}`)
  } catch (err: any) {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${process.env.PORT || 3001} is already in use. Please try a different port by setting the PORT environment variable.`)
    } else {
      server.log.error(err)
    }
    process.exit(1)
  }
}

start()
