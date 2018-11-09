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
import {
  performTokenSearch,
  changeSelectedRow,
} from './tokenSearch';
import {performUserSearch} from './userSearch';

export const CHANGE_VISIBLE_CONTAINER = 'token/CHANGE_VISIBLE_CONTAINER';
export const TOGGLE_ALERT_VISIBILITY = 'token/TOGGLE_ALERT_VISIBILITY';
export const UPDATE_MATCHING_AUTO_COMPLETE_RESULTS =
  'token/UPDATE_MATCHING_AUTO_COMPLETE_RESULTS';
export const CHANGE_READ_CREATED_TOKEN = 'token/CHANGE_READ_CREATED_TOKEN';
export const SHOW_ERROR_MESSAGE = 'token/SHOW_ERROR_MESSAGE';
export const HIDE_ERROR_MESSAGE = 'token/HIDE_ERROR_MESSAGE';
export const TOGGLE_STATE = 'token/TOGGLE_STATE';

const initialState = {
  showAlert: false,
  alertText: '',
  matchingAutoCompleteResults: [],
  errorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
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

    case UPDATE_MATCHING_AUTO_COMPLETE_RESULTS:
      return {
        ...state,
        matchingAutoCompleteResults: action.matchingAutoCompleteResults,
      };

    case CHANGE_READ_CREATED_TOKEN:
      return {
        ...state,
        lastReadToken: action.lastReadToken,
      };

    case SHOW_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.message,
      };

    case HIDE_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: '',
      };
    case TOGGLE_STATE:
      return {
        ...state,
        lastReadToken: {
          ...state.lastReadToken,
          enabled: !state.lastReadToken.enabled,
        },
      };
    default:
      return state;
  }
};

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

function showCreateError(message) {
  return {
    type: SHOW_ERROR_MESSAGE,
    message,
  };
}

function hideCreateError() {
  return {
    type: HIDE_ERROR_MESSAGE,
  };
}

function toggleState() {
  return {
    type: TOGGLE_STATE,
  };
}

export const deleteSelectedToken = tokenId => {
  return (dispatch, getState) => {
    const jwsToken = getState().authentication.idToken;
    const tokenIdToDelete = getState().tokenSearch.selectedTokenRowId;
    fetch(`${getState().config.tokenServiceUrl}/${tokenIdToDelete}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwsToken,
      },
      method: 'delete',
      mode: 'cors',
    })
      .then(handleStatus)
      .then(getBody)
      .then(() => {
        dispatch(changeSelectedRow(tokenId));
        dispatch(performTokenSearch(jwsToken));
        dispatch(toggleAlertVisibility('Token has been deleted'));
      })
      .catch(error => handleErrors(error, dispatch, jwsToken));
  };
};

export const createToken = (email, setSubmitting) => {
  return (dispatch, getState) => {
    dispatch(hideCreateError());
    const jwsToken = getState().authentication.idToken;

    fetch(getState().config.tokenServiceUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwsToken,
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        userEmail: email,
        tokenType: 'api',
        enabled: true,
      }),
    })
      .then(handleStatus)
      .then(getJsonBody)
      .then(newToken => {
        dispatch(push(`/token/${newToken.id}`));
        setSubmitting(false);
      })
      .catch(error => {
        handleErrors(error, dispatch, jwsToken);
        if (error.status === 400) {
          dispatch(
            showCreateError(
              'There is no such user! Please select one from the dropdown.',
            ),
          );
        }
      });
  };
};

export const fetchApiKey = apiKeyId => {
  return (dispatch, getState) => {
    const jwsToken = getState().authentication.idToken;
    // TODO: remove any errors
    // TODO: show loading spinner
    fetch(`${getState().config.tokenServiceUrl}/${apiKeyId}`, {
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
      .then(apiKey => {
        dispatch({
          type: CHANGE_READ_CREATED_TOKEN,
          lastReadToken: apiKey,
        });
      })
      .catch(error => handleErrors(error, dispatch, jwsToken));
  };
};

export function userAutoCompleteChange(autocompleteText, securityToken) {
  return (dispatch, getState) => {
    performUserSearch(securityToken);
    let matchingAutoCompleteResults = [];
    const autoCompleteSuggestionLimit = 10; // We want to avoid having a vast drop-down box
    getState().userSearch.results.forEach(result => {
      if (
        result.email.indexOf(autocompleteText) !== -1 &&
        matchingAutoCompleteResults.length <= autoCompleteSuggestionLimit
      ) {
        matchingAutoCompleteResults.push(result.email);
      }
    });
    dispatch({
      type: UPDATE_MATCHING_AUTO_COMPLETE_RESULTS,
      matchingAutoCompleteResults,
    });
  };
}

function handleStatus(response) {
  if (response.status === 200) {
    return Promise.resolve(response);
  } else if (response.status === 409) {
    return Promise.reject(
      new HttpError(response.status, 'This token already exists!'),
    );
  } else {
    return Promise.reject(new HttpError(response.status, response.statusText));
  }
}

export function toggleEnabledState() {
  return (dispatch, getState) => {
    const tokenId = getState().token.lastReadToken.id;
    const nextState = getState().token.lastReadToken.enabled ? 'false' : 'true';
    const securityToken = getState().authentication.idToken;
    fetch(
      `${
        getState().config.tokenServiceUrl
      }/${tokenId}/state/?enabled=${nextState}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + securityToken,
        },
        method: 'get',
        mode: 'cors',
      },
    )
      .then(handleStatus)
      .then(() => {
        dispatch(toggleState());
      })
      .catch(() => {
        dispatch(
          toggleAlertVisibility('Unable to change the state of this token!'),
        );
        // TODO Display snackbar with an error message
      });
  };
}
