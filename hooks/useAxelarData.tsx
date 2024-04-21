import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssets, getChains } from "../utils/axelar";
import { useChainId } from "wagmi";

type QueryKeyType = "chains" | "assets";

const useAxelarData = (queryKey: QueryKeyType) => {
  const queryClient = useQueryClient();
  const chain = useChainId();

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey],
    queryFn:
      queryKey === "chains" ? () => getChains(chain) : () => getAssets(chain),
  });

  useEffect(() => {
    if (!isLoading) queryClient.invalidateQueries({ queryKey: [queryKey] });
  }, [chain, isLoading]);

  return { data, isLoading, error };
};

export default useAxelarData;
