import { motion } from "framer-motion";

import LoadingButton from "../../common/LoadingButton";
import Dropdown from "../../common/Dropdown";
import { Chain } from "viem";

interface CreateStepContentProps {
  onClickAction: () => void;
  isLoadingTx: boolean;
  amountInputValue: string;
  handleAmountInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  destinationAddressValue: string;
  handleDestinationAddressChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  setSelectedToChain: React.Dispatch<React.SetStateAction<Chain | null>>;
  selectedToChain: Chain | null;
  tokenSymbol: string;
  goBack: () => void;
}
const CreateStepContent: React.FC<CreateStepContentProps> = ({
  onClickAction,
  isLoadingTx,
  amountInputValue,
  handleAmountInputChange,
  destinationAddressValue,
  handleDestinationAddressChange,
  setSelectedToChain,
  selectedToChain,
  tokenSymbol,
  goBack,
}) => {
  const isButtonDisabled =
    !destinationAddressValue ||
    !amountInputValue ||
    parseFloat(amountInputValue) <= 0 ||
    !selectedToChain?.id;
  return (
    <>
      <motion.div className="justify-center w-full flex text-xl text-blue-500">
        TRANSFER {tokenSymbol}
      </motion.div>
      <label htmlFor="amount" className="mt-5 block font-medium text-white">
        Send:
      </label>
      <motion.div className="mt-2 flex md:flex-row gap-4 items-center">
        <motion.div className="relative flex flex-grow">
          <input
            inputMode="decimal"
            disabled={isLoadingTx}
            type="text"
            value={amountInputValue}
            onChange={handleAmountInputChange}
            id="amount"
            placeholder="Enter amount"
            className="text-right font-medium w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
          />
        </motion.div>
      </motion.div>
      <label
        htmlFor="destinationAddress"
        className="mt-4 block font-medium text-white"
      >
        To:
      </label>
      <motion.div className="mt-2 flex md:flex-row gap-4 items-center">
        <motion.div className="relative flex flex-grow">
          <textarea
            disabled={isLoadingTx}
            value={destinationAddressValue}
            onChange={handleDestinationAddressChange}
            id="destinationAddress"
            placeholder="Enter destination address"
            autoCorrect="off"
            spellCheck="false"
            className="h-24 text-right font-medium text-md text-white w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
            style={{ resize: "none" }}
          />
          <motion.div className="ml-4 mt-1">
            <Dropdown
              option="chains"
              onSelectValue={setSelectedToChain}
              value={selectedToChain}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="mt-10 flex w-full justify-between">
        <LoadingButton onClick={goBack}>&lt; Back</LoadingButton>

        <LoadingButton onClick={onClickAction} disabled={isButtonDisabled}>
          Send
        </LoadingButton>
      </motion.div>
    </>
  );
};

export default CreateStepContent;
