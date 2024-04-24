import { useState } from "react";
import { useAccount } from "wagmi";
import { LayoutGroup, motion } from "framer-motion";
import { Chain } from "viem";

import { isNumericInput } from "../../utils/utils";
import LoadingStepContent from "./components/LoadingStep";
import DisconnectedContent from "./components/DisconnectedStep";
import SuccessContent from "./components/SuccessStep";
import ErrorContent from "./components/ErrorStep";
import CreateStepContent from "./components/CreateStep";
import SelectTokenStep from "./components/SelectTokenStep";
import InfoStep from "./components/InfoStep";
import useInterchainTransfer from "../../hooks/useInterchainTransfer";

const TxCard: React.FC = () => {
  const [selectedToChain, setSelectedToChain] = useState<Chain | null>(null);
  const { isConnected } = useAccount();
  const [amountInputValue, setAmountInputValue] = useState<string>("0.1");
  const [destinationAddressValue, setDestinationAddressValue] =
    useState<string>("");
  const [interchainTokenAddress, setInterchainTokenAddress] = useState("");
  const [interchainTokenSymbol, setInterchainTokenSymbol] = useState("");
  const [interchainTokenID, setInterchainTokenID] = useState("");
  const [isInfoStep, setIsInfoStep] = useState(false);
  const { error, isLoadingTx, isPending, sendTransfer, reset, hash } =
    useInterchainTransfer();

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
    if (isNumericInput(inputValue) || inputValue === "")
      setAmountInputValue(inputValue);
  };

  const handleDestinationAddressChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => setDestinationAddressValue(e.target.value);

  const onClickFinish = () => reset();

  const onClickProceed = async () =>
    selectedToChain &&
    sendTransfer(
      selectedToChain,
      amountInputValue,
      interchainTokenID,
      destinationAddressValue
    );

  const goBackToTokenSelection = () => setInterchainTokenAddress("");

  const getStep = () => {
    if (!isConnected) return <DisconnectedContent />;
    if (isInfoStep) return <InfoStep goBack={() => setIsInfoStep(false)} />;
    if (!interchainTokenAddress)
      return (
        <SelectTokenStep
          onClickInfo={() => setIsInfoStep(true)}
          onClickAction={handleOnClickSelectToken}
        />
      );
    if (error)
      return <ErrorContent error={error} onClickAction={onClickFinish} />;
    if (hash)
      return <SuccessContent onClickAction={onClickFinish} hash={hash} />;
    if (isLoadingTx)
      return <LoadingStepContent isWaitingForUserApproval={isPending} />;
    return (
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
        onClickInfo={() => setIsInfoStep(true)}
      />
    );
  };

  return (
    <LayoutGroup>
      <motion.div
        layout
        className="p-6 bg-gray-900 rounded-lg shadow-md w-full max-w-sm border border-blue-600"
      >
        {getStep()}
      </motion.div>
    </LayoutGroup>
  );
};

export default TxCard;
