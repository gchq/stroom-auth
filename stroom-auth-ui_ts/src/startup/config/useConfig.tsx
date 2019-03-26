import { useEffect } from "react";

import useReduxState from "../../lib/useReduxState";
import { GlobalStoreState } from "../../modules";

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
