import { useContext, useCallback } from "react";
import { StoreContext } from "redux-react-hook";
import { useActionCreators } from "./redux";
import useHttpClient from "../useHttpClient";

import {
  handleErrors,
  getBody,
  getJsonBody
} from "../../modules/fetchFunctions";
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
  const store: GlobalStoreState = useContext(StoreContext);

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
      toggleIsSaving(true);
      const jwsToken = store.authentication.idToken;
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

      const url = `${store.config.values.userServiceUrl}/${id}`;
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
          handleErrors(error, jwsToken); //FIXME: needs dispatch, needs updating
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
      toggleIsSaving(true);
      const jwsToken = store.authentication.idToken;
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

      const url = store.config.values.userServiceUrl;
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
        .then(getBody)
        .then(newUserId => {
          //   createAuthorisationUser(email, dispatch);
          toggleIsSaving(true);
          /**
           * This function creates a user within Stroom. This avoids the problem of creating
           * a user here but that user having to log into Stroom before permissions
           * can be assigned to them.
           */
          const url = `${
            store.config.values.authorisationServiceUrl
          }/createUser?id=${email}`;
          httpPostJsonResponse(url, {})
            .then(handleStatus)
            .then(newUserId => {
              showCreateLoader(false);
              push("/userSearch");
              toggleAlertVisibility(true, "User has been created");
              toggleIsSaving(false);
            })
            .catch(error => {
              handleErrors(error, jwsToken); //FIXME as above
            });
        })
        .catch(error => {
          handleErrors(error, jwsToken); // FIXME, as above
          toggleIsSaving(false);
        });
    },
    [toggleIsSaving, showCreateLoader, toggleAlertVisibility]
  );

  const deleteSelectedUser = useCallback(() => {
    const userIdToDelete = store.userSearch.selectedUserRowId;
    const user = store.userSearch.results.find(
      result => result.id === userIdToDelete
    );
    const url = `${store.config.values.userServiceUrl}/${userIdToDelete}`;
    httpDeleteJsonResponse(url, {})
      .then(handleStatus)
      .then(getBody)
      .then(() => {
        if (user !== undefined && userIdToDelete !== undefined) {
          const url = `${
            store.config.values.authorisationServiceUrl
          }/setUserStatus?id=${user.email}&status=disabled`;
          httpPostEmptyResponse(url, {}).then(handleStatus);
          selectRow(userIdToDelete);
          performUserSearch();
          toggleAlertVisibility(true, "User has been deleted");
        } else {
          console.error("No access to user or user id!");
        }
      })
      .catch(error => handleErrors(error)); //FIXME as above
  }, [selectRow, performUserSearch, toggleAlertVisibility]);

  const changePassword = useCallback(
    (changePasswordRequest: ChangePasswordRequest) => {
      hideChangePasswordErrorMessage();
      const url = `${
        store.config.values.authenticationServiceUrl
      }/changePassword/`;
      const {
        newPassword,
        oldPassword,
        email,
        redirectUrl
      } = changePasswordRequest;
      httpPostJsonResponse(url, {
        body: JSON.stringify({ newPassword, oldPassword, email })
      })
        .then(getJsonBody)
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
      const newPassword = resetPasswordRequest.password;
      const stroomUiUrl = store.config.values.stroomUiUrl;
      const url = `${
        store.config.values.authenticationServiceUrl
      }/resetPassword/`;
      httpPostJsonResponse(url, { body: JSON.stringify({ newPassword }) })
        .then(getJsonBody)
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
    const url = `${store.config.values.userServiceUrl}/me`;
    httpGetJson(url, {})
      .then(handleStatus)
      .then(getJsonBody)
      .then(users => users[0])
      .then(user => {
        changePassword(user.email);
      });
  }, [changePassword]);

  const submitPasswordChangeRequest = useCallback(
    //FIXME: formikbag types
    (formData: any, formikBag: FormikBag<any, any>) => {
      const { setSubmitting } = formikBag;
      const url = `${store.config.values.authenticationServiceUrl}/reset/${
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
      const url = `${store.config.values.userServiceUrl}/${userId}`;
      httpGetJson(url)
        .then(handleStatus)
        .then(getJsonBody)
        .then(users => users[0])
        .then(user => {
          showCreateLoader(false);
          saveUserBeingEdited(user);
        })
        .catch(error => handleErrors(error)); //FIXME: as above
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
