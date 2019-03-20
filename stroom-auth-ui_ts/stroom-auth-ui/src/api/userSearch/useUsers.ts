import { useEffect } from "react";

import useApi from "./useApi";
import { useActionCreators } from "./redux";
import { User } from "../users/types";
import useReduxState from "../../lib/useReduxState";

/**
 * This hook connects the REST API calls to the Redux Store.
 */
interface UseUsers {
  users: Array<User>;
}
const useUsers = () => {
  const users = useReduxState(({ userSearch: { users } }) => users);
  const { getUsers } = useApi();

  const { updateResults } = useActionCreators();

  useEffect(() => {
    getUsers().then(updateResults);
  }, [updateResults]);

  return {
    users
  };
};

export default useUsers;
