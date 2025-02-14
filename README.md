# Overview

The Operator CLI is a command line tool for managing a validator instance on a Shardeum network. The Operator CLI tool also collects debug data from running Shardus app network.

## Getting Started with Local Development

Before running Shardus CLI, it's essential to set up the Shardeum server. Detailed instructions for this setup can be found in the [Shardeum README](https://github.com/shardeum/shardeum).

### Cloning and Preparing the CLI

Clone the Shardus CLI repository and navigate into the project directory:

```bash
git clone git@github.com:shardeum/validator-cli.git
cd validator-cli
```

The validator CLI typically requires a symlink to the Shardeum repo at a specific path. If you're running the CLI manually, ensure the symlink is set up correctly:

```bash
ln -s /path/to/shardeum/repo ../validator
ls ../validator  # Should print the shardeum repo
```

### Installing Dependencies

Install the necessary dependencies and link the CLI for global accessibility:

```bash
npm ci && npm link
```

### Utilizing the Shardus CLI

You can customize network configuration in [default-network-config.ts](./src/config/default-network-config.ts) file. After configuring, make sure to compile again using `npm run compile`.

`default-network-config.ts` config for running a local network node:

```ts
export const defaultNetworkConfig = {
  server: {
    baseDir: '.',
    p2p: {
      existingArchivers: [
        {
          ip: '127.0.0.1',
          port: 4000,
          publicKey:
            '758b1c119412298802cd28dbfa394cdfeecc4074492d60844cc192d632d84de3',
        },
      ],
    },
    ip: {
      externalIp: '127.0.0.1',
      externalPort: 9050,
      internalIp: '127.0.0.1',
      internalPort: 10045,
    },
    reporting: {
      report: true,
      recipient: 'http://localhost:3000/api',
      interval: 2,
      console: false,
    },
  },
};
```

For running on the live Atomium network, use:

```json
export const defaultNetworkConfig = {
  server: {
    baseDir: '.',
    p2p: {
      existingArchivers: [
        {
          ip: '198.58.110.213',
          port: 4000,
          publicKey:
            'd34b80a5a6f9638b7c75d6eb6e59d35d9a3e103f1877827eebbe973b8281f794',
        },
        {
          ip: '3.73.66.238',
          port: 4000,
          publicKey:
            '7af699dd711074eb96a8d1103e32b589e511613ebb0c6a789a9e8791b2b05f34',
        },
        {
          ip: '35.233.225.113',
          port: 4000,
          publicKey:
            '59c3794461c7f58a0a7f24d70dfd512d4364cd179d2670ac58e9ae533d50c7eb',
        },
      ],
    },
    ip: {
      externalIp: '127.0.0.1',
      externalPort: 9001,
      internalIp: '127.0.0.1',
      internalPort: 10001,
    },
    reporting: {
      report: true,
      recipient: 'http://localhost:3000/api',
      interval: 2,
      console: false,
    },
  },
};
```

#### Starting the CLI

To initiate the Shardus CLI, run:

```bash
operator-cli start
```

### Set password for logging into the GUI

```bash
operator-cli gui set password 123456 #log into the GUI with 123456 as your password
```

#### Checking CLI Status

```bash
operator-cli status
```

For a complete list of node commands, check the [node-commands.ts](https://github.com/shardeum/shardeum-validator-cli/blob/main/src/node-commands.ts) file.

For GUI-related commands, refer to the [gui-commands.ts](https://github.com/shardeum/shardeum-validator-cli/blob/main/src/gui-commands.ts) file.

## Getting Started with Local Development

Before running Shardus CLI, it's essential to set up the [Shardeum server](https://github.com/shardeum/shardeum), [JSON RPC server](https://github.com/shardeum/json-rpc-server) and configure [CLI](https://github.com/shardeum/validator-cli) with updated node details.

```bash
git clone git@github.com:shardeum/validator-gui.git
cd validator-gui
```

### Install Dependencies

```bash
npm install
```

### Set Environment Variables & Link to Operator CLI

1. Create a `.env` file in the root directory and configure necessary environment variables as required. If running the RPC locally, set the NEXT_PUBLIC_RPC_URL variable.

```bash
export NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8081
```

Adjust the port (8081 in this example) as needed.

`.env` file configuration for running against a local network:

```bash
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8080
PORT=8081
RPC_SERVER_URL=http://127.0.0.1:8080
```

2. Link to the Operator CLI and set the environment to development:

```bash
npm link operator-cli
export NODE_ENV=development
```

### Build and Start the Development Server

```bash
npm run build
npm run start
```

## Contributing

Contributions are very welcome! Everyone interacting in our codebases, issue trackers, and any other form of communication, including chat rooms and mailing lists, is expected to follow our [code of conduct](./CODE_OF_CONDUCT.md) so we can all enjoy the effort we put into this project.

## Community

For help, discussion about code, or any other conversation that would benefit from being searchable:

[Discuss Shardeum on GitHub](https://github.com/shardeum/shardeum/discussions)

For chatting with others using Shardeum:

[Join the Shardeum Discord Server](https://discord.com/invite/shardeum)
