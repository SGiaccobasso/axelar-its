import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { LayoutGroup, motion } from "framer-motion";
import { parseUnits } from "viem";

import interchainTokenAbi from "../../utils/its";
import { DropdownItem } from "../../types/types";
import { isNumericInput } from "../../utils/utils";
import LoadingStepContent from "./components/LoadingStep";
import DisconnectedContent from "./components/DisconnectedStep";
import SuccessContent from "./components/SuccessStep";
import ErrorContent from "./components/ErrorStep";
import CreateStepContent from "./components/CreateStep";
import SelectTokenStep from "./components/SelectTokenStep";

const TxCard: React.FC = () => {
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [error, setError] = useState("");
  const [selectedToChain, setSelectedToChain] = useState<DropdownItem | null>(
    null
  );
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

  const handleOnClickSelectToken = (address: string, symbol: string) => {
    setInterchainTokenAddress(address);
    setInterchainTokenSymbol(symbol);
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
    console.log("hashWriteContract", hashWriteContract);
    if (hashWriteContract) setIsLoadingTx(false);
  }, [errorWrite, isPending]);

  const onClickFinish = () => {
    setError("");
    reset();
  };

  const onClickProceed = async () => {
    setIsLoadingTx(true);
    try {
      const abi = interchainTokenAbi;
      const bnAmount = parseUnits(amountInputValue, 18);
      selectedToChain &&
        writeContract({
          address: `0x${interchainTokenAddress.substring(2)}`,
          abi,
          functionName: "interchainTransfer",
          args: [selectedToChain.name, destinationAddressValue, bnAmount, "0x"],
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
        {successStep && <SuccessContent onClickAction={onClickFinish} />}
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
