import { Environment } from "@axelar-network/axelarjs-sdk";

export const getEnv = (chainId: Number) =>
  chainId === 1 ? Environment.MAINNET : Environment.TESTNET;

export const getChain = (chainId: Number) =>
  chainId === 1 ? "ethereum" : "base-sepolia";

export const isNumericInput = (input: string) => /^\d*\.?\d*$/.test(input);
