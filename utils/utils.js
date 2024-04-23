import { Environment } from "@axelar-network/axelarjs-sdk";

export const getEnv = (chainId) =>
  chainId === 1 ? Environment.MAINNET : Environment.TESTNET;

export const getChain = (chainId) =>
  chainId === 1 ? "ethereum" : "base-sepolia";

export const isNumericInput = (input) => /^\d*\.?\d*$/.test(input);
