# Ethereum Balance Tracker 

A full-stack application for tracking Ethereum token balances built with TypeScript.

## Project Structure 🏗️

This is a monorepo containing:

- **Backend**: Fastify API with Ethereum integration via viem
- **Frontend**: React application with Vite and Tailwind CSS

## Clean Architecture 🧩

The backend is structured following Clean Architecture principles:

- **Domain**: Contains business entities and interfaces that define the core business rules
- **Application**: Contains application-specific business rules and services that orchestrate the flow of data
- **Infrastructure**: Contains implementations of interfaces defined in the domain layer, external services, and adapters
- **API**: Contains controllers, routes, and input/output models

This layered approach provides:
- Clear separation of concerns
- Improved testability
- Domain-driven design
- Independence from external frameworks and tools
- Flexibility to change implementations without affecting business rules

## Prerequisites ✅

- Node.js (v18+ recommended)
- npm or yarn
- Git

## Installation 📦

1. Clone the repository:
```bash
git clone https://github.com/your-username/ethereum-balance-tracker.git
cd ethereum-balance-tracker
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Configuration ⚙️

### Backend

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=3001
# Add any required Ethereum RPC URLs or API keys here
# ETHEREUM_RPC_URL=
```

## Running the Application 🚀

### Step 1: Configure Environment Variables

1. Create a `.env` file in the `backend` directory:
```bash
cd backend
touch .env
```

2. Add the following to the `.env` file:
```
PORT=3001
# Add your Ethereum RPC URL if needed
# ETHEREUM_RPC_URL=https://your-ethereum-node
```

### Step 2: Start the Backend Server

```bash
cd backend
npm run dev
```

### Step 3: Start the Frontend Development Server

In a new terminal window:
```bash
cd frontend
npm run dev
```

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## API Endpoints 🔌

- `GET /api/balance/:address`: Get token balance for a specific Ethereum address

## Assumptions 💭

- The application assumes a working Ethereum node connection or API access for token balance retrieval.
- Frontend and backend are intended to run on the same machine during development.
- The default backend port is 3001 and the default frontend development server port is 5173.
- In-memory caching is implemented with a 60-second TTL for balance queries.

## Technologies Used 💻

### Backend
- TypeScript
- Fastify
- viem (Ethereum interaction)
- Fastify caching

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- viem (Ethereum interaction)

## Testing 🧪

### Frontend Tests

The frontend uses Vitest with React Testing Library for component testing.

1. Run the tests in watch mode:
```bash
cd frontend
npm test
```

2. Run tests with coverage:
```bash
cd frontend
npm test -- --coverage
```

3. Run a specific test file:
```bash
cd frontend
npm test -- src/components/Button/__tests__/Button.test.tsx
```

The frontend tests focus on behavior rather than implementation details, following the React Testing Library philosophy of testing how users interact with components. Tests include:

- Form validation and submission
- API call handling and error states
- UI state transitions
- Component rendering based on props

#### Test Coverage

The main components in the UI flow have 100% test coverage:
- `EthereumAddressForm`: 100% coverage
- `BalancesList`: 100% coverage 
- `Button`: 100% coverage
- `EthereumBalanceChecker`: 100% line coverage

For more details on the testing approach, see the [frontend testing documentation](./frontend/TESTING.md).

# Backend Tests

This directory contains tests for the backend API endpoints.

## Running Tests

To run the tests, use the following command from the root of the backend directory:

```bash
npm run build && npm test
```

This will compile the TypeScript code and run the tests using the Tap test framework.

## Test Structure

The tests use `tap` as the testing framework and Fastify's built-in `inject()` method for HTTP injection. This allows testing the API endpoints without actually running a server.

### Balance Endpoint Tests

`balanceRoutes.test.ts` contains tests for the `/api/balance` endpoint:

1. **Successful request** - Tests that a valid address returns the expected balance data
2. **Invalid address** - Tests that an invalid Ethereum address returns a 400 Bad Request
3. **No balances available** - Tests error handling when token services fail
4. **Missing address parameter** - Tests schema validation for a missing required parameter
5. **Invalid address format** - Tests schema validation for an incorrectly formatted Ethereum address

## Mocking

The tests use mocked versions of the `TokenService` to avoid making actual blockchain RPC calls during testing. This approach allows testing the API behavior in isolation from external dependencies. 



