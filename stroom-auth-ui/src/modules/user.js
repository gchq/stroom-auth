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

export const CREATE_REQUEST = 'user/CREATE_REQUEST';
export const CREATE_RESPONSE = 'user/CREATE_RESPONSE';
export const SHOW_CREATE_LOADER = 'user/SHOW_CREATE_LOADER';
export const SAVE_USER_BEING_EDITED = 'user/SAVE_USER_BEING_EDITED';
export const CHANGE_VISIBLE_CONTAINER = 'user/CHANGE_VISIBLE_CONTAINER';
export const TOGGLE_ALERT_VISIBILITY = 'user/TOGGLE_ALERT_VISIBILITY';
export const SHOW_CHANGE_PASSWORD_ERROR_MESSAGE =
  'user/SHOW_CHANGE_PASSWORD_ERROR_MESSAGE';
export const HIDE_CHANGE_PASSWORD_ERROR_MESSAGE =
  'user/HIDE_CHANGE_PASSWORD_ERROR_MESSAGE';
export const CLEAR_USER_BEING_EDITED = 'user/CLEAR_USER_BEING_EDITED';
export const TOGGLE_IS_SAVING = 'user/TOGGLE_IS_SAVING';

const initialState = {
  user: '',
  password: '',
  showCreateLoader: false,
  alertText: '',
  showAlert: false,
  changePasswordErrorMessage: [],
  isSaving: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REQUEST:
      return {
        ...state,
        // TODO mark something as 'creating'
      };
    case CREATE_RESPONSE:
      return {
        ...state,
        // TODO change creating to 'created' or something similar
      };
    case SHOW_CREATE_LOADER:
      return {
        ...state,
        showCreateLoader: action.showCreateLoader,
      };

    case SAVE_USER_BEING_EDITED:
      return {
        ...state,
        userBeingEdited: action.user,
      };

    case CLEAR_USER_BEING_EDITED:
      return {
        ...state,
        userBeingEdited: undefined,
      };

    case CHANGE_VISIBLE_CONTAINER:
      return {
        ...state,
        show: action.show,
      };

    case TOGGLE_ALERT_VISIBILITY:
      const showAlert = !state.showAlert;
      return {
        ...state,
        showAlert: showAlert,
        alertText: action.alertText,
      };

    case SHOW_CHANGE_PASSWORD_ERROR_MESSAGE:
      return {
        ...state,
        changePasswordErrorMessage: action.message,
      };

    case HIDE_CHANGE_PASSWORD_ERROR_MESSAGE:
      return {
        ...state,
        changePasswordErrorMessage: [],
      };

    case TOGGLE_IS_SAVING:
      return {
        ...state,
        isSaving: !state.isSaving,
      };

    default:
      return state;
  }
};

export function showCreateLoader(showCreateLoader) {
  return {
    type: SHOW_CREATE_LOADER,
    showCreateLoader,
  };
}

export function changeVisibleContainer(container) {
  return {
    type: CHANGE_VISIBLE_CONTAINER,
    show: container,
  };
}

export function toggleAlertVisibility(alertText) {
  return {
    type: TOGGLE_ALERT_VISIBILITY,
    alertText: alertText,
  };
}

function showChangePasswordErrorMessage(message) {
  return {
    type: SHOW_CHANGE_PASSWORD_ERROR_MESSAGE,
    message,
  };
}

function hideChangePasswordErrorMessage() {
  return {
    type: HIDE_CHANGE_PASSWORD_ERROR_MESSAGE,
  };
}

function saveUserBeingEdited(user) {
  return {
    type: SAVE_USER_BEING_EDITED,
    user,
  };
}

function toggleIsSaving() {
  return {type: TOGGLE_IS_SAVING};
}

export function clearUserBeingEdited() {
  return {
    type: CLEAR_USER_BEING_EDITED,
  };
}

function handleStatus(response) {
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

export const saveChanges = editedUser => {
  return (dispatch, getState) => {
    dispatch(toggleIsSaving());
    const jwsToken = getState().authentication.idToken;
    const {
      id,
      email,
      password,
      first_name,
      last_name,
      comments,
      state,
      never_expires,
    } = editedUser;

    fetch(`${getState().config.userServiceUrl}/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwsToken,
      },
      method: 'put',
      mode: 'cors',
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
        comments,
        state,
        never_expires,
      }),
    })
      .then(handleStatus)
      .then(() => {
        dispatch(saveUserBeingEdited(undefined));
        dispatch(push('/userSearch'));
        dispatch(toggleAlertVisibility('User has been updated'));
        dispatch(toggleIsSaving());
      })
      .catch(error => {
        dispatch(toggleIsSaving());
        handleErrors(error, dispatch, jwsToken);
      });
  };
};

export const createUser = newUser => {
  return (dispatch, getState) => {
    dispatch(toggleIsSaving());
    const jwsToken = getState().authentication.idToken;
    const {
      email,
      password,
      first_name,
      last_name,
      comments,
      state,
      never_expires,
    } = newUser;

    dispatch(showCreateLoader(true));

    fetch(getState().config.userServiceUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwsToken,
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
        comments,
        state,
        never_expires,
      }),
    })
      .then(handleStatus)
      .then(getBody)
      .then(newUserId => {
        dispatch(createAuthorisationUser(email, dispatch));
        dispatch(toggleIsSaving());
      })
      .catch(error => {
        handleErrors(error, dispatch, jwsToken);
        dispatch(toggleIsSaving());
      });
  };
};

/**
 * This function creates a user within Stroom. This avoids the problem of creating
 * a user here but that user having to log into Stroom before permissions
 * can be assigned to them.
 */
const createAuthorisationUser = email => {
  return (dispatch, getState) => {
    dispatch(toggleIsSaving());
    const jwsToken = getState().authentication.idToken;
    fetch(
      `${getState().config.authorisationServiceUrl}/createUser?id=${email}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwsToken,
        },
        method: 'post',
        mode: 'cors',
      },
    )
      .then(handleStatus)
      .then(newUserId => {
        dispatch(showCreateLoader(false));
        dispatch(push('/userSearch'));
        dispatch(toggleAlertVisibility('User has been created'));
        dispatch(toggleIsSaving());
      })
      .catch(error => {
        handleErrors(error, dispatch, jwsToken);
      });
  };
};

export const fetchUser = userId => {
  return (dispatch, getState) => {
    const jwsToken = getState().authentication.idToken;
    fetch(`${getState().config.userServiceUrl}/${userId}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwsToken,
      },
      method: 'get',
      mode: 'cors',
    })
      .then(handleStatus)
      .then(getJsonBody)
      .then(getUser)
      .then(user => {
        dispatch(showCreateLoader(false));
        dispatch(saveUserBeingEdited(user));
      })
      .catch(error => handleErrors(error, dispatch, jwsToken));
  };
};

// TODO: This should happen in the service, not here.
const disableAuthorisationUser = (email, idToken, authorisationServiceUrl) => {
  fetch(
    `${authorisationServiceUrl}/setUserStatus?userId=${email}&status=disabled`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
      method: 'get',
      mode: 'cors',
    },
  ).then(handleStatus);
};

export const deleteSelectedUser = () => {
  return (dispatch, getState) => {
    const state = getState();
    const idToken = state.authentication.idToken;
    const userIdToDelete = state.userSearch.selectedUserRowId;
    const user = state.userSearch.results.find(
      result => result.id === userIdToDelete,
    );
    console.log({user});
    fetch(`${state.config.userServiceUrl}/${userIdToDelete}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
      method: 'delete',
      mode: 'cors',
    })
      .then(handleStatus)
      .then(getBody)
      .then(() => {
        disableAuthorisationUser(
          user.email,
          idToken,
          getState().config.authorisationServiceUrl,
        );
        dispatch(changeSelectedRow(userIdToDelete));
        dispatch(performUserSearch(idToken));
        dispatch(toggleAlertVisibility('User has been deleted'));
      })
      .catch(error => handleErrors(error, dispatch, idToken));
  };
};

export const changePasswordForCurrentUser = () => {
  return (dispatch, getState) => {
    fetch(`${getState().config.userServiceUrl}/me`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'get',
      mode: 'cors',
    })
      .then(handleStatus)
      .then(getJsonBody)
      .then(getUser)
      .then(user => {
        dispatch(changePassword(user.email));
      });
  };
};

export const changePassword = values => {
  return (dispatch, getState) => {
    dispatch(hideChangePasswordErrorMessage());

    const email = values.email;
    const oldPassword = values.oldPassword;
    const newPassword = values.password;

    fetch(`${getState().config.authenticationServiceUrl}/changePassword/`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({newPassword, oldPassword, email}),
    })
      .then(getJsonBody)
      .then(response => {
        if (response.changeSucceeded) {
          dispatch(toggleAlertVisibility('Your password has been changed'));
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
          dispatch(showChangePasswordErrorMessage(errorMessage));
        }
      });
  };
};

export const resetPassword = values => {
  return (dispatch, getState) => {
    const newPassword = values.password;
    const jwsToken = getState().login.token;

    fetch(`${getState().config.authenticationServiceUrl}/resetPassword/`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwsToken,
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({newPassword}),
    })
      .then(getJsonBody)
      .then(response => {
        if (response.changeSucceeded) {
          dispatch(toggleAlertVisibility('Your password has been changed'));
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
          dispatch(showChangePasswordErrorMessage(errorMessage));
        }
      });
  };
};

export const submitPasswordChangeRequest = (formData, {setSubmitting}) => {
  return (dispatch, getState) => {
    const authenticationServiceUrl = `${
      getState().config.authenticationServiceUrl
    }/reset/${formData.email}`;
    const jwsToken = getState().authentication.idToken;
    fetch(authenticationServiceUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwsToken,
      },
      method: 'get',
      mode: 'cors',
    }).then(() => {
      setSubmitting(false);
      dispatch(push('/confirmPasswordResetEmail'));
    });
  };
};

function getUser(user) {
  // TODO check that there is a user and throw an error if there isn't one
  return user[0];
}
