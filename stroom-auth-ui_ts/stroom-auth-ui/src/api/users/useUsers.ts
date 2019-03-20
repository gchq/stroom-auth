import { useCallback, useEffect } from "react";

import useApi from "./useApi";
import { useActionCreators } from './redux';
import { useApi as useUserSearchApi, useActionCreators as useUserSearchActionCreators } from "../userSearch";
import { useApi as useAuthorisationApi } from '../authorisation';
import { User } from "../users/types";
import useReduxState from "../../lib/useReduxState";
import { useRouter } from '../../lib/useRouter';

/**
 * This hook connects the REST API calls to the Redux Store.
 */
interface UseUsers {
    deleteUser: (userId: string) => void;
    updateUser: (user: User) => void;
    createUser: (user: User) => void;
    fetchUser: (userId: string) => void;
}

export default (): UseUsers => {
    const {
        add: createUserUsingApi,
        remove: deleteUserUsingApi,
        fetch: fetchUserUsingApi,
        change: updateUserUsingApi,
    } = useApi();

    const { history } = useRouter();
    const { updateResults } = useUserSearchActionCreators();
    const { getUsers } = useUserSearchApi();

    /**
     * Deletes the user and then refreshes our browser cache of users.
     */
    const deleteUser = useCallback(
        (userId: string) => {
            deleteUserUsingApi(userId).then(() =>
                getUsers().then((results) => updateResults(results))
            );
        },
        [deleteUserUsingApi, getUsers, updateResults]
    );


    /**
     * Updates the user
     */
    const {
        toggleIsSaving,
        saveUserBeingEdited,
        toggleAlertVisibility
    } = useActionCreators();
    const updateUser = useCallback((user: User) => {
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
    }, [saveUserBeingEdited, toggleAlertVisibility, toggleIsSaving]);


    /**
     * Creates a user
     */
    const { showCreateLoader } = useActionCreators();
    const { createUser: createAuthorisationUser } = useAuthorisationApi();
    const createUser = useCallback((user: User) => {
        createUserUsingApi(user)
            .then(newUserId => {
                toggleIsSaving(true);
                createAuthorisationUser(user.email)
                    .then(newUserId => {
                        showCreateLoader(false);
                        toggleAlertVisibility(true, "User has been created");
                        toggleIsSaving(false);
                        history.push("/userSearch");
                    })
            })
            .catch(error => {
                toggleIsSaving(false);
            });

    }, [createUserUsingApi, createAuthorisationUser, showCreateLoader, toggleAlertVisibility, toggleIsSaving]);

    const fetchUser = useCallback((userId:string) => {
        fetchUserUsingApi(userId)
        .then(users => {
          showCreateLoader(false);
          saveUserBeingEdited(users[0]);
        })
    }, [showCreateLoader, saveUserBeingEdited])
    return {
        deleteUser,
        updateUser,
        createUser,
        fetchUser
    };
};
