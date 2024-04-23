import { useEffect, useState } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { LayoutGroup, motion } from "framer-motion";
import { Chain, parseUnits } from "viem";

import { isNumericInput } from "../../utils/utils";
import LoadingStepContent from "./components/LoadingStep";
import DisconnectedContent from "./components/DisconnectedStep";
import SuccessContent from "./components/SuccessStep";
import ErrorContent from "./components/ErrorStep";
import CreateStepContent from "./components/CreateStep";
import SelectTokenStep from "./components/SelectTokenStep";
import InterchainTokenService from "../../contract-abis/InterchainTokenService.abi.json";
import { AxelarQueryAPI, Environment } from "@axelar-network/axelarjs-sdk";
import chainsData from "../../chains/chains";

const ITS_ADDRESS = "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C";
const ITS_TRANSFER_METHOD_NAME = "interchainTransfer";
const gasLimit = 700000;

const sdk = new AxelarQueryAPI({
  environment:
    process.env.NEXT_PUBLIC_IS_TESTNET === "true"
      ? Environment.TESTNET
      : Environment.MAINNET,
});

const TxCard: React.FC = () => {
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [error, setError] = useState("");
  const [selectedToChain, setSelectedToChain] = useState<Chain | null>(null);
  const { isConnected } = useAccount();
  const [amountInputValue, setAmountInputValue] = useState<string>("0.1");
  const [destinationAddressValue, setDestinationAddressValue] =
    useState<string>("");
  const {
    data: hashWriteContract,
    writeContract,
    error: errorWrite,
    isPending,
    reset,
  } = useWriteContract();
  const [interchainTokenAddress, setInterchainTokenAddress] = useState("");
  const [interchainTokenSymbol, setInterchainTokenSymbol] = useState("");
  const [interchainTokenID, setInterchainTokenID] = useState("");
  const chainid = useChainId();

  const handleOnClickSelectToken = (
    address: string,
    symbol: string,
    tokenID: string
  ) => {
    setInterchainTokenAddress(address);
    setInterchainTokenSymbol(symbol);
    setInterchainTokenID(tokenID);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (isNumericInput(inputValue) || inputValue === "") {
      setAmountInputValue(inputValue);
    }
  };

  const handleDestinationAddressChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDestinationAddressValue(e.target.value);
  };

  useEffect(() => {
    if (errorWrite) {
      setIsLoadingTx(false);
      setError(errorWrite?.message);
    }
    if (hashWriteContract) setIsLoadingTx(false);
  }, [errorWrite, isPending, hashWriteContract]);

  const onClickFinish = () => {
    setError("");
    reset();
  };

  const onClickProceed = async () => {
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

  const goBackToTokenSelection = () => setInterchainTokenAddress("");

  const disconnectedStep = !isConnected;
  const selectTokenStep = isConnected && !interchainTokenAddress;
  const createTxStep =
    isConnected &&
    interchainTokenAddress &&
    !isLoadingTx &&
    !hashWriteContract &&
    !error;
  const successStep =
    isConnected &&
    interchainTokenAddress &&
    !isLoadingTx &&
    hashWriteContract &&
    !error;
  const errorStateStep = isConnected && interchainTokenAddress && !!error;
  const loadingStep =
    isConnected &&
    interchainTokenAddress &&
    isLoadingTx &&
    !hashWriteContract &&
    !error;

  return (
    <LayoutGroup>
      <motion.div
        layout
        className="p-6 bg-gray-900 rounded-lg shadow-md w-full max-w-sm border border-blue-600"
      >
        {successStep && (
          <SuccessContent
            onClickAction={onClickFinish}
            hash={hashWriteContract}
          />
        )}
        {errorStateStep && (
          <ErrorContent error={error} onClickAction={onClickFinish} />
        )}
        {selectTokenStep && (
          <SelectTokenStep onClickAction={handleOnClickSelectToken} />
        )}
        {createTxStep && (
          <CreateStepContent
            goBack={goBackToTokenSelection}
            tokenSymbol={interchainTokenSymbol}
            interchainTokenAddress={interchainTokenAddress}
            isLoadingTx={isLoadingTx}
            amountInputValue={amountInputValue}
            handleAmountInputChange={handleAmountInputChange}
            destinationAddressValue={destinationAddressValue}
            handleDestinationAddressChange={handleDestinationAddressChange}
            setSelectedToChain={setSelectedToChain}
            selectedToChain={selectedToChain}
            onClickAction={onClickProceed}
          />
        )}
        {loadingStep && (
          <LoadingStepContent isWaitingForUserApproval={isPending} />
        )}
        {disconnectedStep && <DisconnectedContent />}
      </motion.div>
    </LayoutGroup>
  );
};

export default TxCard;
