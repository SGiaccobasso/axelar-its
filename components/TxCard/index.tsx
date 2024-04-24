import { useState } from "react";
import { useAccount } from "wagmi";
import { LayoutGroup, motion } from "framer-motion";
import { Chain } from "viem";

import { isNumericInput } from "../../utils/utils";
import LoadingStep from "./components/LoadingStep";
import DisconnectedContent from "./components/DisconnectedStep";
import SuccessStep from "./components/SuccessStep";
import ErrorStep from "./components/ErrorStep";
import CreateStepContent from "./components/CreateStep";
import SelectTokenStep from "./components/SelectTokenStep";
import InfoStep from "./components/InfoStep";
import useInterchainTransfer from "../../hooks/useInterchainTransfer";

const TxCard: React.FC = () => {
  const [selectedToChain, setSelectedToChain] = useState<Chain | null>(null);
  const { isConnected } = useAccount();
  const [amountInputValue, setAmountInputValue] = useState("0.1");
  const [destinationAddressValue, setDestinationAddressValue] = useState("");
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

  const handleAmountInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    (isNumericInput(value) || value === "") && setAmountInputValue(value);

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

  const getStepComponent = () =>
    !isConnected ? (
      <DisconnectedContent />
    ) : isInfoStep ? (
      <InfoStep goBack={() => setIsInfoStep(false)} />
    ) : !interchainTokenAddress ? (
      <SelectTokenStep
        onClickInfo={() => setIsInfoStep(true)}
        onClickAction={handleOnClickSelectToken}
      />
    ) : error ? (
      <ErrorStep error={error} onClickAction={onClickFinish} />
    ) : hash ? (
      <SuccessStep onClickAction={onClickFinish} hash={hash} />
    ) : isLoadingTx ? (
      <LoadingStep isWaitingForApproval={isPending} />
    ) : (
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

  return (
    <LayoutGroup>
      <motion.div
        layout
        className="p-6 bg-gray-900 rounded-lg shadow-md w-full max-w-sm border border-blue-600"
      >
        {getStepComponent()}
      </motion.div>
    </LayoutGroup>
  );
};

export default TxCard;
