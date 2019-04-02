import { useEffect } from "react";

import useReduxState from "src/lib/useReduxState";
import { GlobalStoreState } from "src/startup/GlobalStoreState";

import { useApi } from "./config";

export const useConfig = () => {
  const api = useApi();

  useEffect(() => {
    api.fetchConfig();
  }, []);

  // Get data from and subscribe to the store
  const config = useReduxState(({ config }: GlobalStoreState) => config);

  return config;
};

export default useConfig;
