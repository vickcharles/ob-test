import fastify, { FastifyInstance } from 'fastify'

// Create a Fastify instance
const server: FastifyInstance = fastify({
  logger: true
})

// Define a route with TypeScript interfaces
interface IQuerystring {
  name?: string
}

interface IHeaders {
  'h-Custom': string
}

// Define the route
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

// Start the server
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
