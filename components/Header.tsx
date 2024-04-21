import { motion } from "framer-motion";
import { CustomConnectBtn } from "./common/CustomConnectBtn";

const Header = () => {
  return (
    <header className="flex text-white py-4 w-full fixed top-0 z-50 border-b border-blue-600">
      <div className="flex justify-between w-full px-8">
        <div className="h-8 flex gap-4 text-xl font-bold text-center justify-center">
          <motion.img
            initial={{ opacity: 1 }}
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Infinity,
            }}
            className="w-10 h-10"
            src="favicon.ico"
            style={{
              filter:
                "invert(54%) sepia(81%) saturate(516%) hue-rotate(173deg) brightness(102%) contrast(101%)",
            }}
          ></motion.img>
          <motion.div className="mt-1.5 hidden sm:block">
            {"INTERCHAIN TOKEN TRANSFER".split("").map((el, i) => (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1] }}
                style={{ color: "#3898FF" }}
                transition={{
                  times: [0, 0.8, 1],
                  duration: 5,
                  delay: i / 6,
                  repeat: 0,
                  repeatDelay: 2,
                }}
                key={i}
              >
                {el}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <CustomConnectBtn />
      </div>
    </header>
  );
};

export default Header;
