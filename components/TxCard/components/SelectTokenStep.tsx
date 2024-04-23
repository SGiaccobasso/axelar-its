import { AnimatePresence, motion } from "framer-motion";

import LoadingButton from "../../common/LoadingButton";
import { useState } from "react";
import useTokenData from "../../../hooks/useTokenData";

interface SelectTokenStepProps {
  onClickAction: (address: string, symbol: string, tokenID: string) => void;
}

const SelectTokenStep: React.FC<SelectTokenStepProps> = ({ onClickAction }) => {
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
  const selectedTokenTitleClasses = symbol ? "mt-4" : "mt-4 text-gray-600";
  return (
    <>
      <motion.div className="justify-center w-full flex text-xl text-blue-500">
        SELECT TOKEN
      </motion.div>
      <label htmlFor="amount" className="mt-5 block font-medium text-white">
        Token ID:
      </label>
      <textarea
        value={tokenId}
        onChange={handleTokenIdChange}
        id="tokenId"
        placeholder="Enter Interchain Token ID"
        autoCorrect="off"
        spellCheck="false"
        className="mt-2 h-24 text-right font-medium text-md text-white w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
        style={{ resize: "none" }}
      />
      <AnimatePresence>
        <motion.p key="token-info-title" className={selectedTokenTitleClasses}>
          Selected Token:{symbol ? " " : " none"}
        </motion.p>
        <motion.div className="h-6">
          {name && symbol && (
            <motion.p key="token-info-content" className="text-green-400">
              {`${name} (${symbol})`}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div className="mt-4 flex w-full justify-end">
        <LoadingButton
          onClick={() => onClickAction(interchainTokenAddress, symbol, tokenId)}
          disabled={isButtonDisabled}
        >
          NEXT
        </LoadingButton>
      </motion.div>
    </>
  );
};

export default SelectTokenStep;
