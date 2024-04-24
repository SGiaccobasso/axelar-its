import { useEffect, useState } from "react";
import { useChainId, useWriteContract } from "wagmi";
import { Chain, parseUnits } from "viem";
import { AxelarQueryAPI, Environment } from "@axelar-network/axelarjs-sdk";

import chainsData from "../chains/chains";
import InterchainTokenService from "../contract-abis/InterchainTokenService.abi.json";

// Constants
const ITS_ADDRESS = "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C";
const ITS_TRANSFER_METHOD_NAME = "interchainTransfer";
const gasLimit = 700000;

const sdk = new AxelarQueryAPI({
  environment:
    process.env.NEXT_PUBLIC_IS_TESTNET === "true"
      ? Environment.TESTNET
      : Environment.MAINNET,
});

const useInterchainTransfer = () => {
  const {
    data: hash,
    writeContract,
    error: errorWrite,
    isPending,
    reset: resetTransfer,
  } = useWriteContract();
  const chainid = useChainId();
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setError("");
    resetTransfer();
  };

  useEffect(() => {
    if (errorWrite) {
      setIsLoadingTx(false);
      setError(errorWrite?.message);
    }
    if (hash) setIsLoadingTx(false);
  }, [errorWrite, isPending, hash]);

  const sendTransfer = async (
    selectedToChain: Chain,
    amountInputValue: string,
    interchainTokenID: string,
    destinationAddressValue: string
  ) => {
    setIsLoadingTx(true);
    let gasfee = null;
    try {
      gasfee =
        selectedToChain &&
        (await sdk.estimateGasFee(
          chainsData[chainid].nameID,
          chainsData[selectedToChain?.id].nameID,
          gasLimit
        ));
    } catch (e: any) {
      console.error(e);
      setIsLoadingTx(false);
      setError("Failed to estimate gas fee.");
      return;
    }
    try {
      const bnAmount = parseUnits(amountInputValue, 18);
      selectedToChain &&
        writeContract({
          address: ITS_ADDRESS,
          abi: InterchainTokenService,
          functionName: ITS_TRANSFER_METHOD_NAME,
          args: [
            interchainTokenID,
            chainsData[selectedToChain?.id].nameID,
            destinationAddressValue,
            bnAmount,
            "0x",
            gasfee,
          ],
        });
    } catch (e: any) {
      setIsLoadingTx(false);
      setError(e?.message);
    }
  };

  return { error, isLoadingTx, isPending, sendTransfer, reset, hash };
};

export default useInterchainTransfer;
