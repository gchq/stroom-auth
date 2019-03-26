import { useCallback, useEffect } from "react";

import useApi from "./useApi";
import {useApi as useTokenSearchApi} from '../tokenSearch';
import { useActionCreators } from "./redux";
import { useRouter } from "../../lib/useRouter";

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
  const{ toggleState } = useActionCreators();
  const toggleEnabledState = useCallback(
    (tokenId: string, state:boolean) => {
      toggleEnabledStateUsingApi(tokenId)
      .then(() => toggleState())
    },
    [toggleEnabledStateUsingApi]
  );


  const {deleteSelectedToken: deletedSelectedTokenUsingApi} = useApi();
  const {performTokenSearch} = useTokenSearchApi();
  const deleteSelectedToken = useCallback(
    () => {
      deletedSelectedTokenUsingApi();
      performTokenSearch();
    }, []
  );

  return {
      toggleEnabledState,
      deleteSelectedToken
  };
};
export default useUsers;
