import { useEffect, useReducer, useCallback } from "react";

import { User } from "../api";
import { useApi } from "../api";

interface UsersStateApi {
  users: User[];
  totalPages: number;
  selectedUser: string;
  setUsers: (users: User[]) => void;
  setTotalPages: (totalPages: number) => void;
  setSelectedUser: (userId: string) => void;
}

type UsersState = {
  users: User[];
  totalPages: number;
  selectedUser: string;
};

type SetUsersAction = {
  type: "set_user";
  users: User[];
};

type SetTotalPagesAction = {
  type: "set_total_pages";
  totalPages: number;
};

type ChangeSelectedUserAction = {
  type: "change_selected_user";
  userId: string;
};

const reducer = (
  state: UsersState,
  action: SetUsersAction | SetTotalPagesAction | ChangeSelectedUserAction
) => {
  switch (action.type) {
    case "set_user":
      return { ...state, users: action.users };
    case "change_selected_user":
      return { ...state, selectedUser: action.userId };
    case "set_total_pages":
      return { ...state, totalPages: action.totalPages };
    default:
      return state;
  }
};

const useUsersState = (): UsersStateApi => {
  const [userState, dispatch] = useReducer(reducer, {
    users: [],
    totalPages: 0,
    selectedUser: ""
  });
  return {
    users: userState.users,
    totalPages: userState.totalPages,
    selectedUser: userState.selectedUser,
    setUsers: (users: User[]) => dispatch({ type: "set_user", users }),
    setTotalPages: (totalPages: number) =>
      dispatch({ type: "set_total_pages", totalPages }),
    setSelectedUser: (userId: string) =>
      dispatch({ type: "change_selected_user", userId })
  };
};

interface UsersApi {
  users: User[];
  selectedUser: string;
  remove: (userId: string) => void;
  changeSelectedUser: (userId: string) => void;
}

const useUserSearch = (): UsersApi => {
  const { users, selectedUser, setSelectedUser, setUsers } = useUsersState();
  const { search } = useApi();

  useEffect(() => {
    search().then(users => {
      setUsers(users);
    });
  }, [search]);

  const { remove: removeUserUsingApi } = useApi();

  const remove = useCallback(
    (userId: string) => {
      removeUserUsingApi(userId).then(() =>
        search().then(users => setUsers(users))
      );
    },
    [removeUserUsingApi, search, setUsers]
  );

  const changeSelectedUser = useCallback((userId: string) => {
    setSelectedUser(userId);
  }, []);

  return {
    users,
    selectedUser,
    remove,
    changeSelectedUser
  };
};

export default useUserSearch;
