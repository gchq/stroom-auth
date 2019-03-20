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
import { ChangePasswordRequest, ResetPasswordRequest, User } from "./types";
import { GlobalStoreState } from "../../modules/GlobalStoreState";
import { useActionCreators } from "./redux";
import useRouter from '../../lib/useRouter';
import { userInfo } from 'os';

//FIXME: make a type for editedUser
interface Api {
  createUser: (user: User) => Promise<void>;
  deleteUser: (userId:string) => Promise<void>;
  changePasswordForCurrentUser: () => void;
  resetPassword: (resetPasswordRequest: ResetPasswordRequest) => void;
  changePassword: (changePasswordRequest: ChangePasswordRequest) => void;
  submitPasswordChangeRequest: (
    formData: any,
    formikBag: FormikBag<any, any>
  ) => void;
  fetchUser: (userId: String) => void;
  updateUser: (user:User) => Promise<void>;
}
// TODO: all the useCallback functions in one function is disgusting. The functions need splitting out.
export const useApi = (): Api => {
  const store = useContext(StoreContext);
  const { history } = useRouter();
  const { httpDeleteEmptyResponse, httpPostEmptyResponse } = useHttpClient();

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

  const updateUser = useCallback(
    user => {
      const reduxState: GlobalStoreState = store.getState();
      toggleIsSaving(true);
      const url = `${reduxState.config.values.userServiceUrl}/${user.id}`;
      return httpPutEmptyResponse(url, {
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          first_name: user.first_name,
          last_name: user.last_name,
          comments: user.comments,
          state: user.state,
          never_expires: user.never_expires,
          force_password_change: user.force_password_change
        })
      })
    },
    [ toggleIsSaving ]
  );

  const createUser = useCallback(
    user => {
      const reduxState: GlobalStoreState = store.getState();
      toggleIsSaving(true);
      showCreateLoader(true);

      const url = reduxState.config.values.userServiceUrl;
      return httpPostJsonResponse(url, {
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          first_name: user.first_name,
          last_name: user.last_name,
          comments: user.comments,
          state: user.state,
          never_expires: user.never_expires,
          force_password_change: user.force_password_change
        })
      })
    },
    [toggleIsSaving, showCreateLoader, toggleAlertVisibility]
  );

  const deleteUser = useCallback((userId:string) => {
    const state: GlobalStoreState = store.getState();
    const url = `${state.config.values.userServiceUrl}/${userId}`;
    return httpDeleteEmptyResponse(url, {});
  }, []);

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
    createUser,
    changePasswordForCurrentUser,
    resetPassword,
    changePassword,
    submitPasswordChangeRequest,
    fetchUser,
    deleteUser,
    updateUser,
  } as Api;
};

export default useApi;
