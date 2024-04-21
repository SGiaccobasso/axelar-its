import { AxelarAssetTransfer } from "@axelar-network/axelarjs-sdk";

const getAPIURI = (chainId) =>
  chainId === 1
    ? "https://api.axelarscan.io/api"
    : "https://testnet.api.axelarscan.io/api";

const getAPPURL = (chainId) =>
  chainId === 1
    ? "https://api.axelarscan.io"
    : "https://testnet.api.axelarscan.io";

export async function getDepositAddress(
  fromChain,
  toChain,
  destinationAddress,
  asset,
  env
) {
  const axelarAssetTransfer = new AxelarAssetTransfer({
    environment: env,
  });

  const depositAddress = await axelarAssetTransfer.getDepositAddress({
    fromChain,
    toChain,
    destinationAddress,
    asset,
  });

  return { depositAddress };
}

const toCase = (string, to_case = "normal") => {
  if (typeof string === "string") {
    string = string.trim();
    switch (to_case) {
      case "upper":
        string = string.toUpperCase();
        break;
      case "lower":
        string = string.toLowerCase();
        break;
      default:
        break;
    }
  }
  return string;
};

export const split = (
  string,
  to_case = "normal",
  delimiter = ",",
  filter_blank = true
) =>
  (typeof string !== "string" && ![undefined, null].includes(string)
    ? [string]
    : (typeof string === "string" ? string : "")
        .split(delimiter)
        .map((s) => toCase(s, to_case))
  ).filter((s) => !filter_blank || s);

export const toArray = (
  x,
  to_case = "normal",
  delimiter = ",",
  filter_blank = true
) =>
  Array.isArray(x)
    ? x.map((v) => toCase(v, to_case)).filter((v) => !filter_blank || v)
    : split(x, to_case, delimiter, filter_blank);

const request = async (chainId, method) => {
  const response = await fetch(`${getAPIURI(chainId)}/${method}`, {
    method: "POST",
  }).catch((error) => {
    return null;
  });
  return response && (await response.json());
};

export const getAssets = async (chainId) => {
  const response = await request(chainId, "getAssets");
  return toArray(response)
    .filter((a) => !a.is_staging || STAGING)
    .map((a) => {
      const { addresses } = { ...a };
      return {
        ...a,
        addresses: Object.fromEntries(
          Object.entries({ ...addresses }).filter(([k, v]) => !v.is_staging)
        ),
      };
    });
};

export const getChains = async (chainId) => {
  const response = await request(chainId, "getChains");

  return toArray(response)
    .filter((c) => !c.is_staging)
    .map((c) => {
      const { id, explorer } = { ...c };
      const { url } = { ...explorer };
      if (url) {
        for (const explorer_url of [
          "https://axelarscan.io",
          "https://testnet.axelarscan.io",
        ]) {
          c.explorer.url = c.explorer.url.replace(
            explorer_url,
            getAPPURL(chainId)
          );
        }
      }

      return c;
    });
};
