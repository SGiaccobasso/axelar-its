import { motion } from "framer-motion";

import LoadingButton from "../../common/LoadingButton";
import { INTERCHAIN_DOCS_URL } from "../../../utils/constants";

interface InfoStepProps {
  goBack: () => void;
}


const InfoStep: React.FC<InfoStepProps> = ({ goBack }) => {
  return (
    <>
      <motion.div className=" w-full flex text-xl text-gray-400">
        ABOUT THIS APP
      </motion.div>
      <motion.div className="w-full my-8 max-h-40 overflow-scroll text-xs text-gray-400">
        <motion.p className="mb-4">
          Transfer interchain tokens using the interchain token service from
          Axelar.
        </motion.p>
        <motion.p className="mb-4">
          Use the interchain token id to select an existing interchain token and
          transfer it to any of the available chains.
        </motion.p>
        <motion.p>
          To learn more about the Interchain Token Service visit the&nbsp;
          <motion.a
            href={INTERCHAIN_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pt-4 text-blue-400 hover:scale-105 transition-transform duration-100"
          >
            docs
          </motion.a>
          .
        </motion.p>
      </motion.div>

      <motion.div className="mt-10 flex w-full justify-end">
        <LoadingButton onClick={goBack}>ok!</LoadingButton>
      </motion.div>
    </>
  );
};

export default InfoStep;
