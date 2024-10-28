import { createConfig, http } from 'wagmi';
import { Chain } from 'wagmi/chains';
import { metaMask, walletConnect } from 'wagmi/connectors';

// Define the constants for RPC URL, Explorer URL, and Chain ID
export const RPC_URL = process.env.RPC_SERVER_URL ?? "https://atomium.shardeum.org/";
export const EXPLORER_URL = process.env.NEXT_EXPLORER_URL ?? "https://explorer-atomium.shardeum.org/";
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID ? +process.env.NEXT_PUBLIC_CHAIN_ID : 8082;

// Define the devnet chain configuration
export const devnet: Chain = {
  id: CHAIN_ID,
  name: "shardeum_devnet",
  nativeCurrency: {
    decimals: 18,
    name: "Shardeum",
    symbol: "SHM",
  },
  rpcUrls: {
    default: { http: [RPC_URL] },
    public: { http: [RPC_URL] },
  },
  blockExplorers: {default: {name: 'Atomium Explorer', url: EXPLORER_URL}},
};

// Create the Wagmi config using the devnet chain
export const config = createConfig({
  chains: [devnet],
  connectors: [metaMask(), /* walletConnect({
    projectId: '<WALLETCONNECT_PROJECT_ID>', // TODO: Replace with actual project ID when available
  }) */],
  transports: {
    [devnet.id]: http(),
  },
});