# Shardeum Validator GUI

The Shardeum Validator GUI is a web application that allows you to manage your Shardeum validator with ease.

## Local Development Setup

Before setting up the Validator GUI, ensure you have the following prerequisites:
- [Shardeum Server](https://github.com/shardeum/shardeum) installed and running
- [JSON RPC Server](https://github.com/shardeum/json-rpc-server) configured and running
- [Shardeum CLI](https://github.com/shardeum/validator-cli) set up and running

Follow the README file in the individual repositories to set up the Shardeum Server, JSON RPC Server, and Shardeum CLI.

Once you have the prerequisites set up, follow these steps to set up the Validator GUI for local development:

1. Clone the repository:
   ```bash
   git clone https://github.com/shardeum/validator-gui.git
   cd validator-gui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   If you are running the JSON RPC server locally, create a `.env` file in the root directory with the following content:
   
   ```
   NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8080
   RPC_SERVER_URL=http://127.0.0.1:8080
   ```
  Adjust the URLs and ports as needed for your setup.

4. Link to the Operator CLI and set the environment:
   ```bash
   npm link operator-cli
   export NODE_ENV=development
   ```

5. Build and start the development server:
   ```bash
   npm run build
   npm run start
   ```

## Contributing

We welcome contributions to the Shardeum Validator GUI! Please read our [code of conduct](./CODE_OF_CONDUCT.md) before contributing. Everyone interacting in our codebases, issues, and chat rooms is expected to follow these guidelines.

## Community

Join our community to get help, discuss code, or engage in any other Shardeum-related conversations:

- [Shardeum GitHub Discussions](https://github.com/shardeum/shardeum/discussions)
- [Shardeum Discord Server](https://discord.com/invite/shardeum)

We look forward to your participation in the Shardeum ecosystem!
