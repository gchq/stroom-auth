import { useApi } from 'src/api/tokens';
import { useCallback } from 'react';

/**
 * Toggles the state of a token
 */
const useToggleState = (toggleEnabled: Function) => {
  const { toggleState } = useApi();
  return useCallback(
    (tokenId: string, nextState: boolean) => {
      toggleState(tokenId, nextState)
        .then(() => toggleEnabled(tokenId));
    },
    [toggleState]
  );
};

export default useToggleState;