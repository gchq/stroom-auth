import { useEffect, useReducer, useCallback } from "react";

import { User } from "../users/types";
import { useApi } from "../users";

interface UsersStateApi {
  users: User[];
  set: (users: User[]) => void;
}

type UsersState = {
  users: User[];
};

type SetUsersAction = {
  type: "set_user";
  users: User[];
};

const reducer = (state: UsersState, action: SetUsersAction) => {
  switch (action.type) {
    case "set_user":
      return { ...state, users: action.users };
    default:
      return state;
  }
};

const useUsersState = (): UsersStateApi => {
  const [userState, dispatch] = useReducer(reducer, { users: [] });
  return {
    users: userState.users,
    set: (users: User[]) => dispatch({ type: "set_user", users })
  };
};

interface UsersApi {
  users: User[];
  remove: (userId: string) => void;
}

const useUserSearch = (): UsersApi => {
  const { users, set } = useUsersState();
  const { search } = useApi();

  useEffect(() => {
    search().then(users => set(users));
  }, [search]);

  const { remove: removeUserUsingApi } = useApi();

  const remove = useCallback(
    (userId: string) => {
      removeUserUsingApi(userId).then(() => search().then(users => set(users)));
    },
    [removeUserUsingApi, search, set]
  );

  return {
    users,
    remove
  };
};

export default useUserSearch;
