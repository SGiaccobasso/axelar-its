import { useEffect, useState } from "react";
import { useAccount, useChainId, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { LayoutGroup, motion } from "framer-motion";

import { getDepositAddress } from "../../utils/axelar";
import { DropdownItem } from "../../types/types";
import { getChain, getEnv, isNumericInput } from "../../utils/utils";
import LoadingStepContent from "./components/LoadingStep";
import DisconnectedContent from "./components/DisconnectedStep";
import SuccessContent from "./components/SuccessStep";
import ErrorContent from "./components/ErrorStep";
import CreateStepContent from "./components/CreateStep";

const TxCard: React.FC = () => {
  const chain = useChainId();
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const {
    data: hash,
    error: errorSendTransaction,
    isPending: isPendingUserApproval,
    reset: resetTx,
    sendTransaction,
  } = useSendTransaction();
  const [error, setError] = useState("");
  const [selectedToChain, setSelectedToChain] = useState<DropdownItem | null>(
    null
  );
  const [selectedAsset, setSelectedAsset] = useState<DropdownItem | null>(null);
  const { isConnected } = useAccount();
  const [amountInputValue, setAmountInputValue] = useState<string>("0.1");
  const [destinationAddressValue, setDestinationAddressValue] =
    useState<string>("");

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
    if (errorSendTransaction) {
      setIsLoadingTx(false);
      setError(errorSendTransaction?.message.split("\n")[0]);
    }
    if (hash) setIsLoadingTx(false);
  }, [errorSendTransaction, isPendingUserApproval]);

  const onClickFinish = () => {
    setError("");
    resetTx();
  };

  const onClickProceed = async () => {
    setIsLoadingTx(true);
    const fromChain = getChain(chain);
    const env = getEnv(chain);
    try {
      const data = await getDepositAddress(
        fromChain,
        selectedToChain?.id,
        destinationAddressValue,
        selectedAsset?.id,
        env
      );
      sendTransaction({
        to: `0x${data.depositAddress.substring(2)}`,
        value: parseEther(amountInputValue),
      });
    } catch (e: any) {
      setIsLoadingTx(false);
      setError(e?.message);
    }
  };

  const disconnectedStep = !isConnected;
  const createTxStep = isConnected && !isLoadingTx && !hash && !error;
  const successStep = isConnected && !isLoadingTx && hash && !error;
  const errorStateStep = isConnected && !!error;
  const loadingStep = isConnected && isLoadingTx && !hash && !error;

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
        {createTxStep && (
          <CreateStepContent
            isLoadingTx={isLoadingTx}
            amountInputValue={amountInputValue}
            handleAmountInputChange={handleAmountInputChange}
            setSelectedAsset={setSelectedAsset}
            selectedAsset={selectedAsset}
            destinationAddressValue={destinationAddressValue}
            handleDestinationAddressChange={handleDestinationAddressChange}
            setSelectedToChain={setSelectedToChain}
            selectedToChain={selectedToChain}
            onClickAction={onClickProceed}
          />
        )}
        {loadingStep && (
          <LoadingStepContent
            isWaitingForUserApproval={isPendingUserApproval}
          />
        )}
        {disconnectedStep && <DisconnectedContent />}
      </motion.div>
    </LayoutGroup>
  );
};

export default TxCard;
