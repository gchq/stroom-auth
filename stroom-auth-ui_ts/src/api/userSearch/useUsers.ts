import { useEffect } from "react";

import useApi from "./useApi";
import useReduxState from "../../lib/useReduxState";
import { User } from "../users/types";
import { useActionCreators } from "./redux";

/**
 * This hook connects the REST API calls to the Redux Store.
 */
interface UseUsers {
  users: Array<User>;
}
const useUsers = (): UseUsers => {
  const users = useReduxState(({ userSearch: { users } }) => users);
  const { getUsers } = useApi();

  const { updateResults } = useActionCreators();

  useEffect(() => {
    getUsers().then(updateResults);
  }, [updateResults]);

  return { users };
}

export default useUsers;
