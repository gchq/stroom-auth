import { useCallback } from "react";

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
}

export default (): UseUsers => {
    const {
        deleteUser: deleteUserUsingApi,
        updateUser: updateUserUsingApi,
        createUser: createUserUsingApi,
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


    const {
        toggleIsSaving,
        saveUserBeingEdited,
        toggleAlertVisibility
    } = useActionCreators();
    /**
     * Updates the user
     */
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
    return {
        deleteUser,
        updateUser,
        createUser
    };
};
