
/*
 * Copyright 2017 Crown Copyright
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

import {push} from 'react-router-redux';

import {HttpError} from '../ErrorTypes';
import {handleErrors, getBody, getJsonBody} from './fetchFunctions';
import {performUserSearch, changeSelectedRow} from './userSearch';

export const TOGGLE_RESET_IS_SUBMITTING = 'password/TOGGLE_RESET_IS_SUBMITTING';

const initialState = {
    isSubmitting: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
      case TOGGLE_RESET_IS_SUBMITTING:
      return {
        ...state,
          isSubmitting: !state.isSubmitting,
      };

    default:
      return state;
  }
};

export function toggleResetIsSubmitting() {
  return {
    type: TOGGLE_RESET_IS_SUBMITTING
  };
}

//export const changePasswordForCurrentUser = () => {
//  return (dispatch, getState) => {
//    fetch(`${getState().config.userServiceUrl}/me`, {
//      headers: {
//        Accept: 'application/json',
//        'Content-Type': 'application/json',
//      },
//      method: 'get',
//      mode: 'cors',
//    })
//      .then(handleStatus)
//      .then(getJsonBody)
//      .then(getUser)
//      .then(user => {
//        dispatch(changePassword(user.email));
//      });
//  };
//};
//
//export const changePassword = values => {
//  return (dispatch, getState) => {
//    dispatch(hideChangePasswordErrorMessage());
//
//    const email = values.email;
//    const oldPassword = values.oldPassword;
//    const newPassword = values.password;
//
//    fetch(`${getState().config.authenticationServiceUrl}/changePassword/`, {
//      headers: {
//        Accept: 'application/json',
//        'Content-Type': 'application/json',
//      },
//      method: 'post',
//      mode: 'cors',
//      body: JSON.stringify({newPassword, oldPassword, email}),
//    })
//      .then(getJsonBody)
//      .then(response => {
//        if (response.changeSucceeded) {
//          dispatch(toggleAlertVisibility('Your password has been changed'));
//        } else {
//          let errorMessage = [];
//          if (response.failedOn.includes('BAD_OLD_PASSWORD')) {
//            errorMessage.push('Your new old password is not correct');
//          }
//          if (response.failedOn.includes('COMPLEXITY')) {
//            errorMessage.push(
//              'Your new password does not meet the complexity requirements',
//            );
//          }
//          if (response.failedOn.includes('REUSE')) {
//            errorMessage.push('You may not reuse your previous password');
//          }
//          if (response.failedOn.includes('LENGTH')) {
//            errorMessage.push('Your new password is too short');
//          }
//          dispatch(showChangePasswordErrorMessage(errorMessage));
//        }
//      });
//  };
//};
//
//export const resetPassword = values => {
//  return (dispatch, getState) => {
//    const oldPassword = values.oldPassword;
//    const newPassword = values.password;
//    const jwsToken = getState().login.token;
//
//    fetch(`${getState().config.authenticationServiceUrl}/resetPassword/`, {
//      headers: {
//        Accept: 'application/json',
//        'Content-Type': 'application/json',
//        Authorization: 'Bearer ' + jwsToken,
//      },
//      method: 'post',
//      mode: 'cors',
//      body: JSON.stringify({newPassword, oldPassword}),
//    })
//      .then(getJsonBody)
//      .then(response => {
//        if (response.changeSucceeded) {
//          dispatch(toggleAlertVisibility('Your password has been changed'));
//        } else {
//          let errorMessage = [];
//          if (response.failedOn.includes('COMPLEXITY')) {
//            errorMessage.push(
//              'Your new password does not meet the complexity requirements',
//            );
//          }
//          if (response.failedOn.includes('LENGTH')) {
//            errorMessage.push('Your new password is too short');
//          }
//          dispatch(showChangePasswordErrorMessage(errorMessage));
//        }
//      });
//  };
//};
//
//export const submitPasswordChangeRequest = formData => {
//  return (dispatch, getState) => {
//    const authenticationServiceUrl = `${
//      getState().config.authenticationServiceUrl
//    }/reset/${formData.email}`;
//    const jwsToken = getState().authentication.idToken;
//    fetch(authenticationServiceUrl, {
//      headers: {
//        Accept: 'application/json',
//        'Content-Type': 'application/json',
//        Authorization: 'Bearer ' + jwsToken,
//      },
//      method: 'get',
//      mode: 'cors',
//    }).then(() => {
//      dispatch(push('/confirmPasswordResetEmail'));
//    });
//  };
//};
