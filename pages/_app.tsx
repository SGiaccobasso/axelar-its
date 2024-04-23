import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  arbitrum,
  avalanche,
  base,
  blast,
  opBNB,
  celo,
  fantom,
  filecoin,
  fraxtal,
  kava,
  linea,
  mantle,
  moonbeam,
  optimism,
  polygon,
  scroll,
} from "wagmi/chains";
import {
  avalancheFuji,
  sepolia,
  blastSepolia,
  baseSepolia,
  opBNBTestnet,
  celoAlfajores,
  fantomTestnet,
  filecoinCalibration,
  fraxtalTestnet,
  kavaTestnet,
  lineaGoerli,
  moonbaseAlpha,
  optimismSepolia,
  polygonMumbai,
  polygonZkEvmTestnet,
  scrollSepolia,
} from "wagmi/chains";
import {
  getDefaultConfig,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

const config = getDefaultConfig({
  appName: "ITS App",
  projectId: "ITS",
  chains:
    process.env.NEXT_PUBLIC_IS_TESTNET === "true"
      ? [
          avalancheFuji,
          sepolia,
          blastSepolia,
          baseSepolia,
          opBNBTestnet,
          celoAlfajores,
          fantomTestnet,
          filecoinCalibration,
          fraxtalTestnet,
          kavaTestnet,
          lineaGoerli,
          moonbaseAlpha,
          optimismSepolia,
          polygonMumbai,
          polygonZkEvmTestnet,
          scrollSepolia,
        ]
      : [
          mainnet,
          arbitrum,
          avalanche,
          base,
          blast,
          opBNB,
          celo,
          fantom,
          filecoin,
          fraxtal,
          kava,
          linea,
          mantle,
          moonbeam,
          optimism,
          polygon,
          scroll,
        ],
  ssr: true,
});

const client = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider
          modalSize="compact"
          theme={midnightTheme({
            borderRadius: "small",
            fontStack: "system",
          })}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
