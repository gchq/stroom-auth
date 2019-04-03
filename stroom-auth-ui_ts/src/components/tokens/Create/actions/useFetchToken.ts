import { useApi, Token } from "../../api";
import { useCallback } from 'react';

const useFetchToken = (setToken: Function) => {
  const { fetchApiKey } = useApi();
  return useCallback((tokenId: string) => {
    fetchApiKey(tokenId)
      .then((apiKey: Token) => {
        setToken(apiKey);
      })
  }, [])
}

export default useFetchToken;