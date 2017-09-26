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

import { HttpError } from '../ErrorTypes'
import { handleErrors, getBody } from './fetchFunctions'
import { performTokenSearch, changeSelectedRow } from './tokenSearch'
import { performUserSearch } from './userSearch'

export const CHANGE_VISIBLE_CONTAINER = 'token/CHANGE_VISIBLE_CONTAINER'
export const TOGGLE_ALERT_VISIBILITY = 'token/TOGGLE_ALERT_VISIBILITY'
export const UPDATE_MATCHING_AUTO_COMPLETE_RESULTS = 'token/UPDATE_MATCHING_AUTO_COMPLETE_RESULTS'
export const CLOSE_TOKEN_CREATED_DIALOG = 'token/CLOSE_TOKEN_CREATED_DIALOGUE'
export const SHOW_TOKEN_CREATED_DIALOG = 'token/SHOW_TOKEN_CREATED_DIALOGUE'

const initialState = {
  showAlert: false,
  alertText: '',
  matchingAutoCompleteResults: [],
  showTokenCreatedDialog: false,
  newlyCreatedToken: '',
  newlyCreatedTokenUser: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_VISIBLE_CONTAINER:
      return {
        ...state,
        show: action.show
      }

    case TOGGLE_ALERT_VISIBILITY:
      const showAlert = !state.showAlert
      return {
        ...state,
        showAlert: showAlert,
        alertText: action.alertText
      }

    case UPDATE_MATCHING_AUTO_COMPLETE_RESULTS:
      return {
        ...state,
        matchingAutoCompleteResults: action.matchingAutoCompleteResults
      }

    case SHOW_TOKEN_CREATED_DIALOG:
      return {
        ...state,
        showTokenCreatedDialog: true,
        newlyCreatedToken: action.newlyCreatedToken,
        newlyCreatedTokenUser: action.newlyCreatedTokenUser
      }

    case CLOSE_TOKEN_CREATED_DIALOG:
      return {
        ...state,
        showTokenCreatedDialog: false,
        newlyCreatedToken: '',
        newlyCreatedTokenUser: ''
      }

    default:
      return state
  }
}

export function changeVisibleContainer (container) {
  return {
    type: CHANGE_VISIBLE_CONTAINER,
    show: container
  }
}

export function toggleAlertVisibility (alertText) {
  return {
    type: TOGGLE_ALERT_VISIBILITY,
    alertText: alertText
  }
}

export const deleteSelectedToken = (tokenId) => {
  return (dispatch, getState) => {
    const jwsToken = getState().login.token
    const tokenIdToDelete = getState().tokenSearch.selectedTokenRowId
    const tokenServiceUrl = process.env.REACT_APP_TOKEN_URL + '/' + tokenIdToDelete
    fetch(tokenServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwsToken
      },
      method: 'delete',
      mode: 'cors'
    })
        .then(handleStatus)
        .then(getBody)
        .then(() => {
          dispatch(changeSelectedRow(tokenId))
          dispatch(performTokenSearch(jwsToken))
          dispatch(toggleAlertVisibility('Token has been deleted'))
        })
        .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

export const createToken = (newToken) => {
  return (dispatch, getState) => {
    const jwsToken = getState().login.token
    const { email } = newToken

    // TODO wire this in
    // dispatch(showCreateLoader(true))

    const tokenServiceUrl = process.env.REACT_APP_TOKEN_URL
    fetch(tokenServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwsToken
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        userEmail: email,
        tokenType: 'api',
        enabled: true
      })
    })
        .then(handleStatus)
        .then(getBody)
        .then((body) => {
          // TODO wire this in
          // dispatch(showCreateLoader(false))
          dispatch({
            type: SHOW_TOKEN_CREATED_DIALOG,
            newlyCreatedToken: body,
            newlyCreatedTokenUser: email
          })
        })
        .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

export function userAutoCompleteChange (autocompleteText, securityToken) {
  return (dispatch, getState) => {
    performUserSearch(securityToken)
    let matchingAutoCompleteResults = []
    const autoCompleteSuggestionLimit = 10 // We want to avoid having a vast drop-down box
    getState().userSearch.results.forEach(result => {
      if (result.email.indexOf(autocompleteText) !== -1 &&
        matchingAutoCompleteResults.length <= autoCompleteSuggestionLimit) {
        matchingAutoCompleteResults.push(result.email)
      }
    })
    dispatch({
      type: UPDATE_MATCHING_AUTO_COMPLETE_RESULTS,
      matchingAutoCompleteResults
    })
  }
}

export function handleTokenCreatedDialogClose () {
  return (dispatch) => dispatch({
    type: CLOSE_TOKEN_CREATED_DIALOG
  })
}

function handleStatus (response) {
  if (response.status === 200) {
    return Promise.resolve(response)
  } else if (response.status === 409) {
    return Promise.reject(new HttpError(response.status, 'This token already exists!'))
  } else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}
