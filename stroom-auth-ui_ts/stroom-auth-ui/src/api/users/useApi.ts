import { useContext, useCallback } from "react";
import { StoreContext } from "redux-react-hook";
import { useActionCreators } from "./redux";
import useHttpClient from "../useHttpClient";

// import { handleErrors } from "../../modules/fetchFunctions";
import {
  useApi as useUserSearchApi,
  useActionCreators as useUserSearchActionCreators
} from "../userSearch";
import { ChangePasswordRequest, ResetPasswordRequest } from "./types";
import { push } from "react-router-redux";

import { HttpError } from "../../ErrorTypes";
import { FormikBag } from "formik";
import { GlobalStoreState } from "../../modules/GlobalStoreState";

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

  const { httpDeleteJsonResponse, httpPostEmptyResponse } = useHttpClient();
  const { performUserSearch } = useUserSearchApi();
  const { selectRow } = useUserSearchActionCreators();

  const {
    showChangePasswordErrorMessage,
    hideChangePasswordErrorMessage
  } = useActionCreators();
  const { httpPostJsonResponse } = useHttpClient();
  const { showCreateLoader } = useActionCreators();
  const { httpPutJsonResponse, httpGetJson } = useHttpClient();
  const {
    toggleIsSaving,
    saveUserBeingEdited,
    toggleAlertVisibility
  } = useActionCreators();

  const saveChanges = useCallback(
    editedUser => {
      const reduxState:GlobalStoreState = store.getState();
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
      httpPutJsonResponse(url, {
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
        .then(handleStatus)
        .then(response => {
          saveUserBeingEdited(undefined);
          push("/userSearch");
          toggleAlertVisibility(true, "User has been updated");
          toggleIsSaving(false);
        })
        .catch(error => {
          toggleIsSaving(false);
          // handleErrors(error); 
        });
    },
    [
      toggleIsSaving,
      saveUserBeingEdited,
      push,
      toggleAlertVisibility,
      toggleIsSaving
    ]
  );

  const createUser = useCallback(
    newUser => {
      const reduxState:GlobalStoreState = store.getState();
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
        .then(handleStatus)
        .then(newUserId => {
          //   createAuthorisationUser(email, dispatch);
          toggleIsSaving(true);
          /**
           * This function creates a user within Stroom. This avoids the problem of creating
           * a user here but that user having to log into Stroom before permissions
           * can be assigned to them.
           */
          const url = `${ reduxState.config.values.authorisationServiceUrl }/createUser?id=${email}`;
          httpPostJsonResponse(url, {})
            .then(handleStatus)
            .then(newUserId => {
              showCreateLoader(false);
              push("/userSearch");
              toggleAlertVisibility(true, "User has been created");
              toggleIsSaving(false);
            })
            .catch(error => {
              // handleErrors(error); 
            });
        })
        .catch(error => {
          // handleErrors(error);
          toggleIsSaving(false);
        });
    },
    [toggleIsSaving, showCreateLoader, toggleAlertVisibility]
  );

  const deleteSelectedUser = useCallback(() => {
    const state:GlobalStoreState = store.getState();
    const userIdToDelete = state.userSearch.selectedUserRowId;
    const user = state.userSearch.results.find(
      result => result.id === userIdToDelete
    );
    const url = `${state.config.values.userServiceUrl}/${userIdToDelete}`;
    httpDeleteJsonResponse(url, {})
      .then(handleStatus)
      .then(() => {
        if (user !== undefined && userIdToDelete !== undefined) {
          const url = `${
            state.config.values.authorisationServiceUrl
          }/setUserStatus?id=${user.email}&status=disabled`;
          httpPostEmptyResponse(url, {}).then(handleStatus);
          selectRow(userIdToDelete);
          performUserSearch(state);
          toggleAlertVisibility(true, "User has been deleted");
        } else {
          console.error("No access to user or user id!");
        }
      })
      // .catch(error => handleErrors(error)); 
  }, [selectRow, performUserSearch, toggleAlertVisibility]);

  const changePassword = useCallback(
    (changePasswordRequest: ChangePasswordRequest) => {
      const state:GlobalStoreState = store.getState();
      hideChangePasswordErrorMessage();
      const url = `${ state.config.values.authenticationServiceUrl }/changePassword/`;
      const {
        password,
        oldPassword,
        email,
        redirectUrl
      } = changePasswordRequest;
      httpPostJsonResponse(url, {
        body: JSON.stringify({ newPassword: password , oldPassword, email })
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
      const state:GlobalStoreState = store.getState();
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
    const state:GlobalStoreState = store.getState();
    const url = `${state.config.values.userServiceUrl}/me`;
    httpGetJson(url, {})
      .then(handleStatus)
      .then(users => users[0])
      .then(user => {
        changePassword(user.email);
      });
  }, [changePassword]);

  const submitPasswordChangeRequest = useCallback(
    //FIXME: formikbag types
    (formData: any, formikBag: FormikBag<any, any>) => {
      const state:GlobalStoreState  = store.getState();
      const { setSubmitting } = formikBag;
      const url = `${state.config.values.authenticationServiceUrl}/reset/${
        formData.email
      }`;
      httpGetJson(url, {}).then(() => {
        setSubmitting(false);
        push("/confirmPasswordResetEmail");
      });
    },
    []
  );

  const fetchUser = useCallback(
    (userId: String) => {
      const state:GlobalStoreState = store.getState();
      const url = `${state.config.values.userServiceUrl}/${userId}`;
      httpGetJson(url)
        .then(handleStatus)
        .then(users => users[0])
        .then(user => {
          showCreateLoader(false);
          saveUserBeingEdited(user);
        })
        // .catch(error => handleErrors(error)); 
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
    fetchUser
  } as Api;
};

export default useApi;

function handleStatus(response: any) {
  //FIXME improve this type
  if (response.status === 200) {
    return Promise.resolve(response);
  } else if (response.status === 409) {
    return Promise.reject(
      new HttpError(
        response.status,
        "This user already exists - please use a different email address."
      )
    );
  } else {
    return Promise.reject(new HttpError(response.status, response.statusText));
  }
}
