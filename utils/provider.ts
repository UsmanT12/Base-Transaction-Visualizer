import { ethers } from "ethers";

// Base Mainnet JSON-RPC
export const BASE_MAINNET_RPC = "https://mainnet.base.org";

// Base Sepolia Testnet JSON-RPC (alternative for testing)
export const BASE_SEPOLIA_RPC = "https://sepolia.base.org";

// Create a JSON-RPC provider for Base
export function createBaseProvider(network: "mainnet" | "testnet" = "mainnet") {
  const rpcUrl = network === "mainnet" ? BASE_MAINNET_RPC : BASE_SEPOLIA_RPC;
  return new ethers.JsonRpcProvider(rpcUrl);
}

// Get block explorer URL
export function getBlockExplorerUrl(
  txHash: string,
  network: "mainnet" | "testnet" = "mainnet"
) {
  const baseUrl =
    network === "mainnet"
      ? "https://basescan.org"
      : "https://sepolia.basescan.org";
  return `${baseUrl}/tx/${txHash}`;
}
