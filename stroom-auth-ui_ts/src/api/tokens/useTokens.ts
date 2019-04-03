import { useCallback } from "react";

import useApi from "./useApi";
import { useActionCreators as useTokenActionCreators, Token } from '../tokens';
import { useActionCreators } from "./redux";
import { useRouter } from "src/lib/useRouter";

const useTokens = () => {
  const { history } = useRouter();

  const { toggleEnabledState: toggleEnabledStateUsingApi } = useApi();
  const { toggleState } = useActionCreators();
  const toggleEnabledState = useCallback(
    () => {
      toggleEnabledStateUsingApi()
        .then(() => toggleState())
    },
    [toggleEnabledStateUsingApi]
  );

  const { toggleIsCreating } = useTokenActionCreators();
  const { createToken: createTokenUsingApi } = useApi();
  const createToken = useCallback(
    (email: string) => {
      createTokenUsingApi(email)
        .then((newToken: Token) => {
          toggleIsCreating();
          history.push(`/token/${newToken.id}`);
        });
    },
    [createTokenUsingApi, toggleIsCreating]
  )

  const { changeReadCreatedToken } = useTokenActionCreators();
  const { fetchApiKey: fetchApiKeyUsingApi } = useApi();
  const fetchApiKey = useCallback(
    (tokenId: string) => {
      fetchApiKeyUsingApi(tokenId)
        .then((apiKey: Token) => {
          changeReadCreatedToken(apiKey);
        })
    }, []
  );

  return {
    toggleEnabledState,
    createToken,
    fetchApiKey,
  }
}

export default useTokens;
