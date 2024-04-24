import { motion } from "framer-motion";

import LoadingButton from "../../common/LoadingButton";
import Dropdown from "../../common/Dropdown";
import { Chain } from "viem";
import { BigNumberish, formatUnits, isAddress } from "ethers";
import { useAccount, useReadContract } from "wagmi";
import tokenABI from "../../../contract-abis/token.abi.json";

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
  interchainTokenAddress: string;
  onClickInfo: () => void;
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
  interchainTokenAddress,
  onClickInfo,
}) => {
  const account = useAccount();

  const { data: balance } = useReadContract({
    abi: tokenABI,
    address: `0x${(interchainTokenAddress as string)?.substring(2)}`,
    functionName: "balanceOf",
    args: [account.address],
  });

  const balanceFormatted = formatUnits((balance as BigNumberish) || "0");

  const isValidAddress = () => isAddress(destinationAddressValue);

  const isValidAmount = () =>
    parseFloat(amountInputValue) > 0 &&
    parseFloat(amountInputValue) <= parseFloat(balanceFormatted);

  const isButtonDisabled =
    !destinationAddressValue ||
    !amountInputValue ||
    !isValidAmount() ||
    !isValidAddress();
  !selectedToChain?.id;

  return (
    <>
      <motion.div className="justify-between w-full flex text-xl text-blue-500">
        TRANSFER {tokenSymbol}
        <motion.div
          onClick={onClickInfo}
          className="mb-1 self-end border-2 text-blue-500 text-xs rounded-full border-blue-500 w-5 h-5 text-center transform hover:scale-110 transition-transform duration-100 cursor-pointer"
        >
          i
        </motion.div>
      </motion.div>
      <label htmlFor="amount" className="mt-5 block font-medium text-white">
        <motion.div className="flex justify-between w-full">
          <motion.p>Send {tokenSymbol}:</motion.p>
          <motion.p className="text-gray-400 text-xs pt-1">
            Max: {balance !== undefined ? balanceFormatted : "Loading..."}
          </motion.p>
        </motion.div>
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
            className={`text-right font-medium w-full bg-gray-900 border ${
              isValidAmount() ? "border-gray-700" : "border-red-500"
            } rounded-md py-2 px-4 focus:outline-none focus:border-blue-500`}
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
            className={`h-24 text-right font-medium w-full bg-gray-900 border ${
              (destinationAddressValue ? isValidAddress() : true)
                ? "border-gray-700"
                : "border-red-500"
            } rounded-md py-2 px-4 focus:outline-none focus:border-blue-500`}
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
