import { AnimatePresence, motion } from "framer-motion";

import LoadingButton from "../../common/LoadingButton";
import { useState } from "react";
import useTokenData from "../../../hooks/useTokenData";

interface SelectTokenStepProps {
  onClickAction: (address: string, symbol: string, tokenID: string) => void;
  onClickInfo: () => void;
}

const SelectTokenStep: React.FC<SelectTokenStepProps> = ({
  onClickAction,
  onClickInfo,
}) => {
  const [tokenId, setTokenId] = useState<string>("");
  const {
    address: interchainTokenAddress,
    name,
    symbol,
  } = useTokenData(tokenId);
  const isButtonDisabled = !interchainTokenAddress;

  const handleTokenIdChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTokenId(e.target.value);
  };
  return (
    <>
      <motion.div className="justify-between w-full flex text-xl text-blue-500">
        SELECT TOKEN
        <motion.div
          onClick={onClickInfo}
          className="mb-1 self-end border-2 text-blue-500 text-xs rounded-full border-blue-500 w-5 h-5 text-center transform hover:scale-110 transition-transform duration-100 cursor-pointer"
        >
          i
        </motion.div>
      </motion.div>
      <label htmlFor="amount" className="mt-8 block font-medium text-white">
        <motion.div className="flex justify-between w-full">
          <motion.p>Token ID:</motion.p>

          <AnimatePresence>
            <motion.div className="h-6">
              {name && symbol && (
                <motion.p key="token-info-content" className="text-green-400">
                  {`${name} (${symbol})`}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </label>
      <textarea
        value={tokenId}
        onChange={handleTokenIdChange}
        id="tokenId"
        placeholder="Enter Interchain Token ID"
        autoCorrect="off"
        spellCheck="false"
        className={`my-2 h-24 font-medium text-md text-white w-full bg-gray-900 border ${
          name ? "border-green-500" : "border-gray-700"
        } rounded-md py-2 px-4 focus:outline-none focus:border-blue-500`}
        style={{ resize: "none" }}
      />

      <motion.div className="mt-4 flex w-full justify-end">
        <LoadingButton
          onClick={() =>
            onClickAction(
              interchainTokenAddress as string,
              symbol as string,
              tokenId
            )
          }
          disabled={isButtonDisabled}
        >
          NEXT
        </LoadingButton>
      </motion.div>
    </>
  );
};

export default SelectTokenStep;
