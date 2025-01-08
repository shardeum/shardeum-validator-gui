# Shardeum Validator GUI

## Overview

The Shardeum Validator GUI provides a user-friendly graphical interface for managing nodes on the Shardeum network. This tool simplifies the process of monitoring and controlling your nodes, making it easy and accessible to all users of varying experiences.

## Prerequisites

Before setting up the Validator GUI, ensure you have the following components installed and configured:

1. [Shardeum server](https://github.com/shardeum/shardeum)
2. [JSON RPC server](https://github.com/shardeum/json-rpc-server)
3. [Shardeum Validator CLI](https://github.com/shardeum/validator-cli) (configured)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone git@github.com:shardeum/validator-gui.git 
cd validator-gui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory with the necessary environment variables. For a local network setup, use:

```
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8080
PORT=8081
RPC_SERVER_URL=http://127.0.0.1:8080
```

Note: Adjust these values according to your specific network configuration.

### 4. Link Operator CLI and Set Environment

```bash
npm link operator-cli
export NODE_ENV=development
```

### 5. Build and Launch

```bash
npm run build
npm run start
```

### 6. Access the Dashboard

Open your web browser and navigate to `http://localhost:8081` (or the port you specified in the `.env` file).

Log in using the password set in the Validator CLI. If you haven't set a password yet, you can do so by running the following command in the CLI directory:

```bash
operator-cli gui set password <your-chosen-password>
```

## Usage

The Validator GUI dashboard provides various features for managing your Shardeum nodes:

1. **Node Status**: Monitor the current status of your node.
2. **Performance Metrics**: View key performance indicators and network statistics.
3. **Configuration Settings**: Adjust node settings through the GUI.
4. **Reward Tracking**: Monitor your earned rewards and payout history.
5. **Network Information**: Access real-time data about the Shardeum network.

Explore the intuitive interface to familiarize yourself with all available features.

## Troubleshooting

If you encounter issues:

1. Ensure all prerequisites are correctly installed and configured.
2. Verify that the Shardeum network and JSON RPC server are running.
3. Check the console for any error messages.
4. Ensure the environment variables in the `.env` file are correct.
5. Restart the GUI application after making any configuration changes.

## Contributing

We welcome contributions to improve the Shardeum Validator GUI! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

Ensure that you adhere to our [code of conduct](./CODE_OF_CONDUCT.md) in all interactions within the project ecosystem.

## Community and Support

Join our vibrant community for support, discussions, and updates:

- [GitHub Discussions](https://github.com/shardeum/shardeum/discussions): For technical discussions and searchable conversations.
- [Discord Server](https://discord.com/invite/shardeum): For real-time chat and community interaction.

## License

[LICENSE](./LICENSE.md)