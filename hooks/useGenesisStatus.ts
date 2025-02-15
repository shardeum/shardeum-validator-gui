import useSWR from "swr";
import { AccountStakeInfo } from "../model/account-stake-info";
import { useGlobals } from "../utils/globals";
import { useContext } from "react";
import { FetcherContext } from "../components/FetcherContextProvider";

type GenesisNodeResponse = {
  isGenesisNode: boolean;
};

export const useGenesisStatus = (eoa: string | null): GenesisNodeResponse => {
  const { apiBase } = useGlobals();
  const fetcher = useContext(FetcherContext);
  const { data, error } = useSWR<GenesisNodeResponse, Error>(
    eoa != null ? `${apiBase}/api/is-genesis-node/${eoa}` : null,
    fetcher,
    { refreshInterval: 1000 }
  );

  return { isGenesisNode: data?.isGenesisNode || false };
};
