import { motion } from "framer-motion";
import Image from "next/image";
import { CustomConnectBtn } from "../../common/CustomConnectBtn";

const DisconnectedContent: React.FC = () => (
  <>
    <motion.div className="justify-center w-full flex text-xl text-blue-500 sm:hidden">
      AXELAR ITS
    </motion.div>
    <motion.div className="flex w-full items-center justify-center flex-col">
      <Image
        height={100}
        width={100}
        className="m-5 my-10 "
        alt="axelar logo loading animation"
        src="/assets/animations/logo.svg"
      />
      <CustomConnectBtn />
    </motion.div>
  </>
);

export default DisconnectedContent;
