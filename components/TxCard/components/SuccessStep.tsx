import { AnimatePresence, motion } from "framer-motion";

import LoadingButton from "../../common/LoadingButton";

interface SuccessContentProps {
  onClickAction: () => void;
}
const SuccessContent: React.FC<SuccessContentProps> = ({ onClickAction }) => (
  <AnimatePresence>
    <motion.div className="w-full flex flex-col text-green-400 pt-4 break-all items-center">
      <motion.img height={100} width={100} src="/assets/icons/check.svg" />
      <motion.div className="my-5">Transaction submitted!</motion.div>
      <motion.div className="mt-4 flex w-full justify-end">
        <LoadingButton onClick={onClickAction}>ok</LoadingButton>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);
export default SuccessContent;
