import { Environment } from "@axelar-network/axelarjs-sdk";
import { MAINNET_AXELARSCAN_URL, TESTNET_AXELARSCAN_URL } from "./constants";

export const getEnv = (chainId) =>
  chainId === 1 ? Environment.MAINNET : Environment.TESTNET;

export const getChain = (chainId) =>
  chainId === 1 ? "ethereum" : "base-sepolia";

export const isNumericInput = (input) => /^\d*\.?\d*$/.test(input);

export const getAxelarscanBaseURL = () =>
  process.env.NEXT_PUBLIC_IS_TESTNET === "true"
    ? TESTNET_AXELARSCAN_URL
    : MAINNET_AXELARSCAN_URL;
