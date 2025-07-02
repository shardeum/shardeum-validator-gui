# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shardeum Validator GUI is a Next.js-based web application for managing Shardeum blockchain validator nodes. It provides a secure interface for node operators to monitor performance, manage staking, and control validator operations.

## Essential Commands

```bash
# Development
npm install          # Install dependencies
npm run build        # Build Next.js app and compile server
npm start           # Start the production server

# Code Quality - ALWAYS run before committing
npm run lint        # Run ESLint
npm run format-check # Check Prettier formatting
npm run format-fix  # Fix formatting issues

# Testing
npm test            # Run tests
npm test:watch      # Run tests in watch mode
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 13.4.7, React 18.2.0, TypeScript 5.1.6
- **Styling**: Tailwind CSS + DaisyUI
- **State**: Zustand stores, SWR for server state
- **Backend**: Express.js with JWT auth
- **Blockchain**: ethers.js, wagmi, RainbowKit

### Key Architectural Patterns

1. **API Security Layer**
   - All API routes protected by JWT middleware (`/api/auth.ts`)
   - CSRF protection on state-changing operations (`/api/csrf.ts`)
   - Rate limiting: 1500 req/10min general, 20 req/10min for auth
   - Passwords SHA256 hashed client-side before transmission

2. **Data Flow**
   ```
   React Component → Custom Hook → Fetcher → API Endpoint → CLI Command → Response
   ```
   - All node operations go through official Shardeum CLI (`/usr/local/bin/operator-cli`)
   - Responses are YAML parsed to JSON
   - Real-time updates via SWR polling (1-second intervals)

3. **Component Structure**
   - `/components/atoms/`: Basic UI elements
   - `/components/molecules/`: Composite components
   - `/components/organisms/`: Page sections
   - Use existing component patterns when creating new ones

4. **Critical Files**
   - `/api/index.ts`: Server entry point with middleware chain
   - `/api/handlers/node.ts`: All validator node operations
   - `/hooks/fetcher.ts`: Centralized API client with auth handling
   - `/utils/constants.ts`: Global configuration

### Important Conventions

1. **Error Handling**
   - API errors return standardized format: `{ error: string }`
   - Use `makeErrorResponse()` helper for consistency
   - Client-side errors trigger logout on 403 status

2. **Authentication Flow**
   - Login creates JWT token (8hr expiry) + CSRF token (24hr expiry)
   - Tokens stored in httpOnly cookies
   - Check auth status with `/api/auth/check` endpoint

3. **CLI Integration**
   - Never execute system commands directly
   - Always use the official operator-cli binary
   - Handle YAML responses with proper error checking

4. **Security Requirements**
   - Sanitize all file paths and user inputs
   - Use parameterized CLI commands (execFile, not exec)
   - Maintain CSP headers and security middleware

## Testing Approach

The project uses Jest with React Testing Library. Run tests with `npm test`. When adding new features:
- Test critical user flows
- Mock API responses using MSW
- Test error states and edge cases

## Common Development Tasks

### Adding a New API Endpoint
1. Add handler in `/api/handlers/`
2. Register route in `/api/api.ts`
3. Add corresponding hook in `/hooks/`
4. Update TypeScript types as needed

### Adding a New Component
1. Check existing components for patterns
2. Place in appropriate directory (atoms/molecules/organisms)
3. Follow existing naming conventions
4. Use Tailwind + DaisyUI classes

### Modifying Node Operations
1. All changes must go through `/api/handlers/node.ts`
2. Use appropriate CLI commands from operator-cli
3. Handle YAML parsing errors gracefully
4. Update status polling if needed

## Environment Variables

Required for deployment:
- `NEXT_PUBLIC_RPC_URL`: Public RPC endpoint
- `PORT`: GUI server port (default: 8080)
- `RPC_SERVER_URL`: Backend RPC server URL