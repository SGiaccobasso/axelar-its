import { AnimatePresence, motion } from "framer-motion";

import LoadingButton from "../../common/LoadingButton";
import {
  MAINNET_AXELARSCAN_URL,
  TESTNET_AXELARSCAN_URL,
} from "../../../utils/constants";

interface SuccessContentProps {
  onClickAction: () => void;
  hash: string;
}

const AXELARSCAN_BASE_URL =
  process.env.NEXT_PUBLIC_IS_TESTNET === "true"
    ? TESTNET_AXELARSCAN_URL
    : MAINNET_AXELARSCAN_URL;

const SuccessContent: React.FC<SuccessContentProps> = ({
  onClickAction,
  hash,
}) => (
  <AnimatePresence>
    <motion.div className="w-full flex flex-col text-green-400 pt-4 break-all items-center">
      <motion.img
        className="my-4"
        height={100}
        width={100}
        src="/assets/icons/check.svg"
      />
      <motion.div className="mb-6 text-lg">Transaction submitted!</motion.div>

      <motion.div className="mt-4 flex w-full justify-between">
        <motion.a
          href={`${AXELARSCAN_BASE_URL}${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pt-4 text-gray-400 text-xs hover:scale-105 transition-transform duration-100"
        >
          Check it on Axelarscan
        </motion.a>
        <LoadingButton onClick={onClickAction}>ok</LoadingButton>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);
export default SuccessContent;
