import { useCallback } from "react";

import { useMappedState } from "redux-react-hook";
import { GlobalStoreState } from "../startup/GlobalStoreState";

/**
 * This is a convenience function to get Redux State Retrieval.
 */
export const useReduxState = function<T, State = GlobalStoreState>(
  mapper: (gss: State) => T,
  params: Array<any> = []
): T {
  const mapState = useCallback(mapper, params);
  return useMappedState(mapState);
};

export default useReduxState;
