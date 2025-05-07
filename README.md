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

### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a separate terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Access the application in your browser at http://localhost:5173

### Production Mode

1. Build the backend:
```bash
cd backend
npm run build
```

2. Build the frontend:
```bash
cd frontend
npm run build
```

3. Start the backend server:
```bash
cd backend
npm start
```

4. The frontend build can be served using any static file server from the `frontend/dist` directory.

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

