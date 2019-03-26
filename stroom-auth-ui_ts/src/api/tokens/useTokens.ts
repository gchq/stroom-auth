import { useCallback, useEffect } from "react";

import useApi from "./useApi";
import { useActionCreators as useTokenActionCreators, Token } from '../tokens';
import { useApi as useTokenSearchApi, useActionCreators as useTokenSearchActionCreators } from '../tokenSearch';
import { useActionCreators } from "./redux";
import { useRouter } from "../../lib/useRouter";
import { TokenSearchRequest } from '../tokenSearch/types';

/**
 * This hook connects the REST API calls to the Redux Store.
 */
const useUsers = () => {
  const {
  } = useActionCreators();
  const { history } = useRouter();


  /**
   * Deletes the user and then refreshes our browser cache of users.
   */
  const { toggleEnabledState: toggleEnabledStateUsingApi } = useApi();
  const { toggleState } = useActionCreators();
  const toggleEnabledState = useCallback(
    (tokenId: string, state: boolean) => {
      toggleEnabledStateUsingApi(tokenId)
        .then(() => toggleState())
    },
    [toggleEnabledStateUsingApi]
  );

  const {
    showSearchLoader,
    updateResults,
    selectRow,
  } = useTokenSearchActionCreators();
  const { performTokenSearch: performTokenSearchUsingApi } = useTokenSearchApi();
  const performTokenSearch = useCallback(
    (tokenSearchRequest: TokenSearchRequest) => {
      performTokenSearchUsingApi(tokenSearchRequest)
          .then(data => {
            showSearchLoader(false);
            updateResults(data);
          })
    }, [performTokenSearchUsingApi, showSearchLoader, updateResults]
  );

  const { deleteSelectedToken: deletedSelectedTokenUsingApi, } = useApi();
  const deleteSelectedToken = useCallback(
    () => {
      deletedSelectedTokenUsingApi()
        .then(() => {
          performTokenSearch({});
          selectRow('');
        });
    }, [deletedSelectedTokenUsingApi, performTokenSearchUsingApi]
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
    }, [createTokenUsingApi, toggleIsCreating]
  )

  const { changeReadCreatedToken } = useTokenActionCreators();
  const {fetchApiKey: fetchApiKeyUsingApi } = useApi();
  const fetchApiKey = useCallback((tokenId:string) => {
    fetchApiKeyUsingApi(tokenId)
      .then((apiKey:Token) => {
        changeReadCreatedToken(apiKey);
    })
  }, []);

  return {
    toggleEnabledState,
    deleteSelectedToken,
    createToken,
    fetchApiKey,
    performTokenSearch
  };
};
export default useUsers;
