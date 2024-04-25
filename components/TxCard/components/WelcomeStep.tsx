import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import LoadingButton from "../../common/LoadingButton";
import { useAccount } from "wagmi";
import { truncateEthAddress } from "../../../utils/utils";

interface WelcomeStepProps {
  onClickAction: React.Dispatch<React.SetStateAction<boolean>>;
}

const WelcomeStep = ({ onClickAction }: WelcomeStepProps) => {
  const { address } = useAccount();
  return (
    <>
      <motion.div className="justify-center w-full flex text-xl text-centermb-2">
        <AnimatePresence>
          <motion.p className="text-gray-300">WELCOME&nbsp;</motion.p>
          <motion.p className="text-blue-400">
            {address && truncateEthAddress(address)}
          </motion.p>
          <motion.p className="text-gray-300">!</motion.p>
        </AnimatePresence>
      </motion.div>
      <motion.div className="flex w-full items-center justify-center flex-col">
        <Image
          height={100}
          width={100}
          className="m-5 my-10 "
          alt="axelar logo loading animation"
          src="/assets/animations/logo.svg"
        />
        <LoadingButton onClick={() => onClickAction(true)}>
          GET STARTED!
        </LoadingButton>
      </motion.div>
    </>
  );
};
export default WelcomeStep;
