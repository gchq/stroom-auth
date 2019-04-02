import { useCallback, useReducer } from "react";

import useApi from "../api/useApi";
import { useActionCreators as useAuthenticationActionCreators } from "src/api/authentication";
import { useApi as useAuthorisationApi } from "src/api/authorisation";
import { User } from "../types";
import { useRouter } from "src/lib/useRouter";
import useUserState from "./useUserState";

/**
 * This hook connects the REST API calls to the Redux Store.
 */
const useUsers = () => {
  // const { toggleIsSaving, toggleAlertVisibility } = useActionCreators();
  const { history } = useRouter();

  const {
    user,
    isCreating,
    setUser,
    clearUser,
    setIsCreating
  } = useUserState();

  /**
   * Deletes the user and then refreshes our browser cache of users.
   */
  // const { updateResults } = useUserSearchActionCreators();
  const { remove: removeUserUsingApi, search } = useApi();
  const deleteUser = useCallback(
    (userId: string) => {
      removeUserUsingApi(userId);
      // .then(() =>
      // search().then(results => updateResults(results))
      // )
    },
    [removeUserUsingApi, search]
  );

  /**
   * Updates the user
   */
  const { change: updateUserUsingApi } = useApi();
  const updateUser = useCallback(
    (user: User) => {
      updateUserUsingApi(user).then(() => {
        history.push("/userSearch");
      });
    },
    [updateUserUsingApi, clearUser]
  );

  /**
   * Creates a user
   */
  const { createUser: createAuthorisationUser } = useAuthorisationApi();
  const { add: createUserUsingApi } = useApi();
  const createUser = useCallback(
    (user: User) => {
      createUserUsingApi(user).then(newUserId => {
        createAuthorisationUser(user.email).then(newUserId => {
          setIsCreating(false);
          history.push("/userSearch");
        });
      });
    },
    [createUserUsingApi, createAuthorisationUser, setIsCreating]
  );

  /**
   * Fetches a user by id/email, and puts it into the redux state.
   */
  const { fetch: fetchUserUsingApi } = useApi();
  const fetchUser = useCallback(
    (userId: string) => {
      fetchUserUsingApi(userId).then(users => {
        setIsCreating(false);
        setUser(users[0]);
        // dispatch({type:"save_user_being_edited", user:users[0]})
        // saveUserBeingEdited(users[0]);
      });
    },
    [setIsCreating, setUser]
  );

  /**
   * Fetches a user by id/email, and puts it into the redux state.
   */
  const { fetchCurrentUser: apiFetchCurrentUser } = useApi();
  const { setCurrentUser } = useAuthenticationActionCreators();
  const fetchCurrentUser = useCallback(() => {
    apiFetchCurrentUser().then(users => {
      setCurrentUser(users[0]);
    });
  }, [setCurrentUser, apiFetchCurrentUser]);

  return {
    // deleteUser,
    updateUser,
    createUser,
    fetchUser,
    fetchCurrentUser,
    user
  };
};
export default useUsers;
