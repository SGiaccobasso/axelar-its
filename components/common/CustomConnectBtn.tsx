import { ConnectButton } from "@rainbow-me/rainbowkit";
import LoadingButton from "./LoadingButton";
import Image from "next/image";

export const CustomConnectBtn = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <LoadingButton onClick={openConnectModal}>
                    Connect Wallet
                  </LoadingButton>
                );
              }
              if (chain.unsupported) {
                return (
                  <LoadingButton onClick={openChainModal}>
                    Wrong network
                  </LoadingButton>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <LoadingButton onClick={openChainModal}>
                    <div className="flex justify-between items-center">
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 20,
                            height: 20,
                            borderRadius: 999,
                            overflow: "hidden",
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 20, height: 20 }}
                            />
                          )}
                        </div>
                      )}
                      <div className="hidden md:block ml-5">{chain.name}</div>
                    </div>
                  </LoadingButton>
                  <div className="hidden lg:block">
                    <LoadingButton onClick={openAccountModal}>
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </LoadingButton>
                  </div>
                  <div className="block lg:hidden">
                    <LoadingButton onClick={openAccountModal}>
                      <Image
                        alt="avatar"
                        width={24}
                        height={24}
                        src={account.ensAvatar || "/assets/icons/avatar.svg"}
                      ></Image>
                    </LoadingButton>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
