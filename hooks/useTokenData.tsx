import { erc20Abi } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

const {
  IInterchainTokenService,
} = require("@axelar-network/axelar-local-dev/dist/contracts");

const readAbi = IInterchainTokenService.abi;

const INTERCHAIN_TOKEN_SERVICE_ADDRESS =
  "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C";

const useTokenData = (tokenId: string) => {
  const {
    data: tokenAddress,
    error: errorGetValidTokenAddress,
    isPending,
  } = useReadContract({
    abi: readAbi,
    address: INTERCHAIN_TOKEN_SERVICE_ADDRESS,
    functionName: "validTokenAddress",
    args: [tokenId],
  });

  const {
    data,
    isLoading,
    error: errorGetTokenMetadata,
  } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });
  const response = {
    error: errorGetValidTokenAddress || errorGetTokenMetadata,
    decimals: data?.[0] || null,
    name: data?.[1] || null,
    symbol: data?.[2] || null,
    address: tokenAddress,
  };
  return response;
};

export default useTokenData;
