import { Environment } from "@axelar-network/axelarjs-sdk";
import { Contract, getDefaultProvider } from "ethers";

export const getEnv = (chainId) =>
  chainId === 1 ? Environment.MAINNET : Environment.TESTNET;

export const getChain = (chainId) =>
  chainId === 1 ? "ethereum" : "base-sepolia";

export const isNumericInput = (input) => /^\d*\.?\d*$/.test(input);

// for (const chain of chains) {
//   chain.provider = getDefaultProvider(chain.rpc);
//   const connectedWallet = wallet.connect(chain.provider);

//   // Initialize contracts to chain object.
//   deserializeContract(chain, connectedWallet);

//   // Recover axelar contracts to chain object.
//   chain.gateway = new Contract(
//     chain.gateway,
//     AxelarGatewayContract.abi,
//     connectedWallet
//   );
//   chain.gasService = new Contract(
//     chain.gasService,
//     AxelarGasServiceContract.abi,
//     connectedWallet
//   );
//   const tokenAddress = await chain.gateway.tokenAddresses("aUSDC");
//   chain.usdc = new Contract(tokenAddress, IERC20.abi, connectedWallet);
// }

// /**
//  * Deserialize the contracts in the chain object.
//  * @param {*} chain - The chain object.
//  * @param {*} wallet - The wallet to use for execution.
//  * @returns The chain object with the contracts deserialized.
//  */
// function deserializeContract(chain, wallet) {
//   // Loop through every keys in the chain object.
//   for (const key of Object.keys(chain)) {
//     // If the object has an abi, it is a contract.

//     if (chain[key].abi) {
//       // Get the contract object.
//       const contract = chain[key];

//       // Deserialize the contract. Assign the contract to the chain object.
//       chain[key] = new Contract(contract.address, contract.abi, wallet);
//     }
//   }

//   return chain;
// }
