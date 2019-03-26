import { useCallback } from "react";

import useApi from "./useApi";
import { useActionCreators } from "./redux";
import {
  useApi as useUserSearchApi,
  useActionCreators as useUserSearchActionCreators
} from "../userSearch";
import { useActionCreators as useAuthenticationActionCreators } from "../authentication";
import { useApi as useAuthorisationApi } from "../authorisation";
import { User } from "../users/types";
import { useRouter } from "../../lib/useRouter";

/**
 * This hook connects the REST API calls to the Redux Store.
 */
const useUsers = () => {
  const {
    toggleIsSaving,
    saveUserBeingEdited,
    toggleAlertVisibility
  } = useActionCreators();
  const { history } = useRouter();

  /**
   * Deletes the user and then refreshes our browser cache of users.
   */
  const { updateResults } = useUserSearchActionCreators();
  const { getUsers } = useUserSearchApi();
  const { remove: removeUserUsingApi } = useApi();
  const deleteUser = useCallback(
    (userId: string) => {
      removeUserUsingApi(userId).then(() =>
        getUsers().then(results => updateResults(results))
      );
    },
    [removeUserUsingApi, getUsers, updateResults]
  );

  /**
   * Updates the user
   */
  const { change: updateUserUsingApi } = useApi();
  const updateUser = useCallback(
    (user: User) => {
      updateUserUsingApi(user)
        .then(response => {
          saveUserBeingEdited(undefined);
          toggleAlertVisibility(true, "User has been updated");
          toggleIsSaving(false);
          history.push("/userSearch");
        })
        .catch(error => {
          toggleIsSaving(false);
        });
    },
    [
      updateUserUsingApi,
      saveUserBeingEdited,
      toggleAlertVisibility,
      toggleIsSaving
    ]
  );

  /**
   * Creates a user
   */
  const { showCreateLoader } = useActionCreators();
  const { createUser: createAuthorisationUser } = useAuthorisationApi();
  const { add: createUserUsingApi } = useApi();
  const createUser = useCallback(
    (user: User) => {
      createUserUsingApi(user)
        .then(newUserId => {
          toggleIsSaving(true);
          createAuthorisationUser(user.email).then(newUserId => {
            showCreateLoader(false);
            toggleAlertVisibility(true, "User has been created");
            toggleIsSaving(false);
            history.push("/userSearch");
          });
        })
        .catch(error => {
          toggleIsSaving(false);
        });
    },
    [
      createUserUsingApi,
      createAuthorisationUser,
      showCreateLoader,
      toggleAlertVisibility,
      toggleIsSaving
    ]
  );

  /**
   * Fetches a user by id/email, and puts it into the redux state.
   */
  const { fetch: fetchUserUsingApi } = useApi();
  const fetchUser = useCallback(
    (userId: string) => {
      fetchUserUsingApi(userId).then(users => {
        showCreateLoader(false);
        saveUserBeingEdited(users[0]);
      });
    },
    [showCreateLoader, saveUserBeingEdited]
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
    deleteUser,
    updateUser,
    createUser,
    fetchUser,
    fetchCurrentUser
  };
};
export default useUsers;
