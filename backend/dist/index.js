"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const balanceService_1 = require("./application/balanceService");
const balanceRoutes_1 = require("./api/routes/balanceRoutes");
const tokenService_1 = require("./infrastructure/ethereum/tokenService");
const server = (0, fastify_1.default)({
    logger: true
});
// Register CORS
server.register(cors_1.default, {
    origin: true, // Permite todas las origenes en desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
});
const tokenService = new tokenService_1.TokenService();
const balanceService = new balanceService_1.BalanceService(tokenService);
const balanceRoutes = new balanceRoutes_1.BalanceRoutes(balanceService);
balanceRoutes.registerRoutes(server);
server.get('/hello', {
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
    const { name } = request.query;
    const customHeader = request.headers['h-Custom'];
    return {
        hello: name || 'world',
        customHeader
    };
});
// Add error handler
server.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    // Handle validation errors from schema validation
    if (error.validation) {
        reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: error.message
        });
        return;
    }
    reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
    });
});
const start = async () => {
    try {
        const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server is running on http://localhost:${port}`);
    }
    catch (err) {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${process.env.PORT || 3001} is already in use. Please try a different port by setting the PORT environment variable.`);
        }
        else {
            server.log.error(err);
        }
        process.exit(1);
    }
};
start();
