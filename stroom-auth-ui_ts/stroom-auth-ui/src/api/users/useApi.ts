import { useContext, useCallback } from "react";
import { StoreContext } from "redux-react-hook";
import { useActionCreators } from "./redux";
import useHttpClient from "../useHttpClient";

import {handleErrors, getBody, getJsonBody} from '../../modules/fetchFunctions';
import {useApi as useUserSearchApi} from '../userSearch';
import {ChangePasswordRequest, ResetPasswordRequest} from './types';
import {push} from 'react-router-redux';

import {HttpError} from '../../ErrorTypes';
import { FormikBag } from 'formik';

//FIXME: make a type for editedUser
interface Api{
    saveChanges:(editedUser:any) => void;
    createUser: (editedUser:any) => void;
    deleteSelectedUser: () => void;
    changePasswordForCurrentUser: () => void;
    resetPassword: (resetPasswordRequest:ResetPasswordRequest) => void;
    changePassword: (changePasswordRequest:ChangePasswordRequest) => void;
    submitPasswordChangeRequest: (formData:any, formikBag:FormikBag<any, any>) => void;
    fetchUser:(userId:String) => void;
}
// TODO: all the useCallback functions in one function is disgusting. The functions need splitting out.
export const useApi = (): Api => {
    const store = useContext(StoreContext);

    const {performUserSearch, changeSelectedRow} = useUserSearchApi();

    const { httpPutJsonResponse } = useHttpClient();
    const { toggleIsSaving , saveUserBeingEdited, toggleAlertVisibility} = useActionCreators();
    const saveChanges = useCallback(
        (editedUser) => {
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
              force_password_change,
            } = editedUser;

            const url = `${store.config.userServiceUrl}/${id}`;
            httpPutJsonResponse(url, {
                body: JSON.stringify({
                    email,
                    password,
                    first_name,
                    last_name,
                    comments,
                    state,
                    never_expires,
                    force_password_change,
                })
            }).then(handleStatus).then(response => {
                saveUserBeingEdited(undefined);
                push('/userSearch');
                toggleAlertVisibility(true, 'User has been updated');
                toggleIsSaving(false);
            })
            .catch(error => {
                toggleIsSaving(false);
                handleErrors(error, jwsToken); //FIXME: needs dispatch, needs updating
            })

        }, [toggleIsSaving, saveUserBeingEdited, push, toggleAlertVisibility, toggleIsSaving]
    );

    const { httpPostJsonResponse } = useHttpClient();
    const { showCreateLoader} = useActionCreators();
    const createUser = useCallback(newUser => {
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
        force_password_change,
      } = newUser;
  
      showCreateLoader(true);
      
      const url = store.config.userServiceUrl;
      httpPostJsonResponse(url, {
        body: JSON.stringify({
          email,
          password,
          first_name,
          last_name,
          comments,
          state,
          never_expires,
          force_password_change,
        }),
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
          const url = `${store.config.authorisationServiceUrl}/createUser?id=${email}`;
          httpPostJsonResponse(url, {
          })
            .then(handleStatus)
            .then(newUserId => {
              showCreateLoader(false);
              push('/userSearch');
              toggleAlertVisibility(true, 'User has been created');
              toggleIsSaving(false);
            })
            .catch(error => {
              handleErrors(error, jwsToken);//FIXME as above
            });
        })
        .catch(error => {
          handleErrors(error, jwsToken);// FIXME, as above
          toggleIsSaving(false);
        })
    }, [toggleIsSaving, showCreateLoader, toggleAlertVisibility]);






    const { httpDeleteJsonResponse, httpPostEmptyResponse} = useHttpClient();
    const deleteSelectedUser = useCallback(() => {
          const idToken = store.authentication.idToken;
          const userIdToDelete = store.userSearch.selectedUserRowId;
          const user = store.userSearch.results.find(
            result => result.id === userIdToDelete,
          );
          const url = `${store.config.userServiceUrl}/${userIdToDelete}`;
        httpDeleteJsonResponse(url,{})
            .then(handleStatus)
            .then(getBody)
            .then(() => {
                const url = `${store.config.authorisationServiceUrl}/setUserStatus?id=${user.email}&status=disabled`;
                httpPostEmptyResponse(url,{})
                    .then(handleStatus);
              changeSelectedRow(userIdToDelete);
              performUserSearch(idToken);
              toggleAlertVisibility(true, 'User has been deleted');
            })
            .catch(error => handleErrors(error, idToken));//FIXME as above
      }, [changeSelectedRow, performUserSearch, toggleAlertVisibility]
    )






    const { showChangePasswordErrorMessage, hideChangePasswordErrorMessage} = useActionCreators();
      const changePassword = useCallback((changePasswordRequest: ChangePasswordRequest) => {
          hideChangePasswordErrorMessage();
            const url = `${store.config.authenticationServiceUrl}/changePassword/`;
            const {newPassword, oldPassword, email, redirectUrl} = changePasswordRequest;
            httpPostJsonResponse(url, {
            body: JSON.stringify({newPassword, oldPassword, email}),
            })
            .then(getJsonBody)
            .then(response => {
              if (response.changeSucceeded) {
                // If we successfully changed the password then we want to redirect if there's a redirection URL
                if (redirectUrl !== undefined) {
                  window.location.href = redirectUrl;
                } else {
                  toggleAlertVisibility(true, 'Your password has been changed');
                }
              } else {
                let errorMessage = [];
                if (response.failedOn.includes('BAD_OLD_PASSWORD')) {
                  errorMessage.push('Your new old password is not correct');
                }
                if (response.failedOn.includes('COMPLEXITY')) {
                  errorMessage.push(
                    'Your new password does not meet the complexity requirements',
                  );
                }
                if (response.failedOn.includes('REUSE')) {
                  errorMessage.push('You may not reuse your previous password');
                }
                if (response.failedOn.includes('LENGTH')) {
                  errorMessage.push('Your new password is too short');
                }
                showChangePasswordErrorMessage(errorMessage);
              }
            });
        }, [hideChangePasswordErrorMessage, toggleAlertVisibility, showChangePasswordErrorMessage])



       const resetPassword = useCallback((resetPasswordRequest:ResetPasswordRequest) => {
          const newPassword = resetPasswordRequest.password;
          const stroomUiUrl = store.config.stroomUiUrl;
            const url = `${store.config.authenticationServiceUrl}/resetPassword/`;
            httpPostJsonResponse(url, {body: JSON.stringify({newPassword})})
            .then(getJsonBody)
            .then(response => {
              if (response.changeSucceeded) {
                window.location.href = stroomUiUrl;
              } else {
                let errorMessage = [];
                if (response.failedOn.includes('COMPLEXITY')) {
                  errorMessage.push(
                    'Your new password does not meet the complexity requirements',
                  );
                }
                if (response.failedOn.includes('LENGTH')) {
                  errorMessage.push('Your new password is too short');
                }
                showChangePasswordErrorMessage(errorMessage);
              }
            });
        }, [showChangePasswordErrorMessage]);





    const { httpGetJson} = useHttpClient();
      const changePasswordForCurrentUser = () => {
          const url = `${store.config.userServiceUrl}/me`;
          httpGetJson(url, {})
            .then(handleStatus)
            .then(getJsonBody)
            .then(users => users[0])
            .then(user => {
              changePassword(user.email);
            });
        };



        //FIXME: formikbag types
    const submitPasswordChangeRequest = useCallback((formData:any, formikBag:FormikBag<any, any>) => {
        const {setSubmitting} = formikBag;
         const url = `${store.config.authenticationServiceUrl}/reset/${formData.email}`;
         httpGetJson(url, {})
         .then(() => {
           setSubmitting(false);
           push('/confirmPasswordResetEmail');
         });
       }, []);
     



       const fetchUser = useCallback((userId:String) => {
         const url = `${store.config.userServiceUrl}/${userId}`;
         httpGetJson(url)
            .then(handleStatus)
            .then(getJsonBody)
            .then(users => users[0])
            .then(user => {
              showCreateLoader(false);
              saveUserBeingEdited(user);
            })
            .catch(error => handleErrors(error )); //FIXME: as above
        }, [showCreateLoader, saveUserBeingEdited]);






    return { 
      submitPasswordChangeRequest, 
      saveChanges, 
      createUser, 
      deleteSelectedUser, 
      changePasswordForCurrentUser , 
      changePassword, 
      fetchUser,
      resetPassword};
 }

 export default useApi;

function handleStatus(response: any) {//FIXME improve this type
    if (response.status === 200) {
      return Promise.resolve(response);
    } else if (response.status === 409) {
      return Promise.reject(
        new HttpError(
          response.status,
          'This user already exists - please use a different email address.',
        ),
      );
    } else {
      return Promise.reject(new HttpError(response.status, response.statusText));
    }
  }
  