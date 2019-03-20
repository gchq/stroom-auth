/*
 * Copyright 2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { FormikBag } from "formik";
import { StoreContext } from "redux-react-hook";
import { useContext, useCallback } from "react";

import useHttpClient from "../useHttpClient";
import { ChangePasswordRequest, ResetPasswordRequest } from "./types";
import { GlobalStoreState } from "../../modules/GlobalStoreState";
import { useApi as useUserSearchApi, useActionCreators as useUserSearchActionCreators } from "../userSearch";
import { useActionCreators } from "./redux";
import useRouter from '../../lib/useRouter';

//FIXME: make a type for editedUser
interface Api {
  saveChanges: (editedUser: any) => void;
  createUser: (editedUser: any) => void;
  deleteSelectedUser: () => void;
  changePasswordForCurrentUser: () => void;
  resetPassword: (resetPasswordRequest: ResetPasswordRequest) => void;
  changePassword: (changePasswordRequest: ChangePasswordRequest) => void;
  submitPasswordChangeRequest: (
    formData: any,
    formikBag: FormikBag<any, any>
  ) => void;
  fetchUser: (userId: String) => void;
}
// TODO: all the useCallback functions in one function is disgusting. The functions need splitting out.
export const useApi = (): Api => {
  const store = useContext(StoreContext);
  const { history } = useRouter();
  const { httpDeleteEmptyResponse, httpPostEmptyResponse } = useHttpClient();
  const { selectRow, updateResults } = useUserSearchActionCreators();
  const {getUsers} = useUserSearchApi();

  const {
    showChangePasswordErrorMessage,
    hideChangePasswordErrorMessage
  } = useActionCreators();
  const { httpPostJsonResponse } = useHttpClient();
  const { showCreateLoader } = useActionCreators();
  const { httpPutEmptyResponse, httpGetJson } = useHttpClient();
  const {
    toggleIsSaving,
    saveUserBeingEdited,
    toggleAlertVisibility
  } = useActionCreators();

  const saveChanges = useCallback(
    editedUser => {
      const reduxState: GlobalStoreState = store.getState();
      toggleIsSaving(true);
      const {
        id,
        email,
        password,
        first_name,
        last_name,
        comments,
        state,
        never_expires,
        force_password_change
      } = editedUser;

      const url = `${reduxState.config.values.userServiceUrl}/${id}`;
      httpPutEmptyResponse(url, {
        body: JSON.stringify({
          email,
          password,
          first_name,
          last_name,
          comments,
          state,
          never_expires,
          force_password_change
        })
      })
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
      toggleIsSaving,
      saveUserBeingEdited,
      toggleAlertVisibility,
      toggleIsSaving
    ]
  );

  const createUser = useCallback(
    newUser => {
      const reduxState: GlobalStoreState = store.getState();
      toggleIsSaving(true);
      const {
        email,
        password,
        first_name,
        last_name,
        comments,
        state,
        never_expires,
        force_password_change
      } = newUser;

      showCreateLoader(true);

      const url = reduxState.config.values.userServiceUrl;
      httpPostJsonResponse(url, {
        body: JSON.stringify({
          email,
          password,
          first_name,
          last_name,
          comments,
          state,
          never_expires,
          force_password_change
        })
      })
        .then(newUserId => {
          toggleIsSaving(true);
          /**
           * This function creates a user within Stroom. This avoids the problem of creating
           * a user here but that user having to log into Stroom before permissions
           * can be assigned to them.
           */
          const url = `${reduxState.config.values.authorisationServiceUrl}/createUser?id=${email}`;
          httpPostEmptyResponse(url, {})
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
    },
    [toggleIsSaving, showCreateLoader, toggleAlertVisibility]
  );

  const deleteSelectedUser = useCallback(() => {
    const state: GlobalStoreState = store.getState();
    const userIdToDelete = state.userSearch.selectedUserRowId;
    const user = state.userSearch.results.find(
      result => result.id === userIdToDelete
    );
    const url = `${state.config.values.userServiceUrl}/${userIdToDelete}`;
    httpDeleteEmptyResponse(url, {})
      .then(() => {
        if (user !== undefined && userIdToDelete !== undefined) {
          const url = `${
            state.config.values.authorisationServiceUrl
            }/setUserStatus?userId=${user.email}&status=disabled`;
          httpPutEmptyResponse(url);
          getUsers().then((data) => updateResults(data));
          toggleAlertVisibility(true, "User has been deleted");
        } else {
          console.error("No access to user or user id!");
        }
      })
  }, [selectRow, toggleAlertVisibility]);

  const changePassword = useCallback(
    (changePasswordRequest: ChangePasswordRequest) => {
      const state: GlobalStoreState = store.getState();
      hideChangePasswordErrorMessage();
      const url = `${state.config.values.authenticationServiceUrl}/changePassword/`;
      const {
        password,
        oldPassword,
        email,
        redirectUrl
      } = changePasswordRequest;
      httpPostJsonResponse(url, {
        body: JSON.stringify({ newPassword: password, oldPassword, email })
      })
        .then(response => {
          if (response.changeSucceeded) {
            // If we successfully changed the password then we want to redirect if there's a redirection URL
            if (redirectUrl !== undefined) {
              window.location.href = redirectUrl;
            } else {
              toggleAlertVisibility(true, "Your password has been changed");
            }
          } else {
            let errorMessage = [];
            if (response.failedOn.includes("BAD_OLD_PASSWORD")) {
              errorMessage.push("Your new old password is not correct");
            }
            if (response.failedOn.includes("COMPLEXITY")) {
              errorMessage.push(
                "Your new password does not meet the complexity requirements"
              );
            }
            if (response.failedOn.includes("REUSE")) {
              errorMessage.push("You may not reuse your previous password");
            }
            if (response.failedOn.includes("LENGTH")) {
              errorMessage.push("Your new password is too short");
            }
            showChangePasswordErrorMessage(errorMessage);
          }
        });
    },
    [
      hideChangePasswordErrorMessage,
      toggleAlertVisibility,
      showChangePasswordErrorMessage
    ]
  );

  const resetPassword = useCallback(
    (resetPasswordRequest: ResetPasswordRequest) => {
      const state: GlobalStoreState = store.getState();
      const newPassword = resetPasswordRequest.password;
      const stroomUiUrl = state.config.values.stroomUiUrl;
      const url = `${
        state.config.values.authenticationServiceUrl
        }/resetPassword/`;
      httpPostJsonResponse(url, { body: JSON.stringify({ newPassword }) })
        .then(response => {
          if (response.changeSucceeded) {
            if (stroomUiUrl !== undefined) {
              window.location.href = stroomUiUrl;
            } else {
              console.error("No stroom UI url available for redirect!");
            }
          } else {
            let errorMessage = [];
            if (response.failedOn.includes("COMPLEXITY")) {
              errorMessage.push(
                "Your new password does not meet the complexity requirements"
              );
            }
            if (response.failedOn.includes("LENGTH")) {
              errorMessage.push("Your new password is too short");
            }
            showChangePasswordErrorMessage(errorMessage);
          }
        });
    },
    [showChangePasswordErrorMessage]
  );

  const changePasswordForCurrentUser = useCallback(() => {
    const state: GlobalStoreState = store.getState();
    const url = `${state.config.values.userServiceUrl}/me`;
    httpGetJson(url, {})
      .then(users => users[0])
      .then(user => {
        changePassword(user.email);
      });
  }, [changePassword]);

  const submitPasswordChangeRequest = useCallback(
    (formData: any, formikBag: FormikBag<any, any>) => {
      const state: GlobalStoreState = store.getState();
      const { setSubmitting } = formikBag;
      const url = `${state.config.values.authenticationServiceUrl}/reset/${
        formData.email
        }`;
      httpGetJson(url, {}).then(() => {
        setSubmitting(false);
        history.push("/confirmPasswordResetEmail");
      });
    },
    []
  );

  const fetchUser = useCallback(
    (userId: String) => {
      const state: GlobalStoreState = store.getState();
      const url = `${state.config.values.userServiceUrl}/${userId}`;
      httpGetJson(url)
        .then(users => {
          showCreateLoader(false);
          saveUserBeingEdited(users[0]);
        })
    },
    [showCreateLoader, saveUserBeingEdited]
  );

  return {
    saveChanges,
    createUser,
    deleteSelectedUser,
    changePasswordForCurrentUser,
    resetPassword,
    changePassword,
    submitPasswordChangeRequest,
    fetchUser,
  } as Api;
};

export default useApi;
