import { useCallback } from "react";

import useApi from "./useApi";
import { useActionCreators } from './redux';
import { useApi as useUserSearchApi, useActionCreators as useUserSearchActionCreators } from "../userSearch";
import { User } from "../users/types";
import useReduxState from "../../lib/useReduxState";
import { useRouter } from '../../lib/useRouter';

/**
 * This hook connects the REST API calls to the Redux Store.
 */
interface UseUsers {
    deleteUser: (userId: string) => void;
    updateUser:(user:User) => void;
}

export default (): UseUsers => {
    const {
        deleteUser: deleteUserUsingApi,
        updateUser: updateUserUsingApi
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

    return {
        deleteUser,
        updateUser
    };
};
