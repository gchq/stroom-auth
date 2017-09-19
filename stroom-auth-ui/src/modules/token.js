import { HttpError } from '../ErrorTypes'
import { handleErrors, getBody } from './fetchFunctions'
import { performTokenSearch, changeSelectedRow } from './tokenSearch'
import { performUserSearch } from './userSearch'

export const CHANGE_VISIBLE_CONTAINER = 'token/CHANGE_VISIBLE_CONTAINER'
export const TOGGLE_ALERT_VISIBILITY = 'token/TOGGLE_ALERT_VISIBILITY'
export const UPDATE_MATCHING_AUTO_COMPLETE_RESULTS = 'token/UPDATE_MATCHING_AUTO_COMPLETE_RESULTS'


const initialState = {
  showAlert: false,
  alertText: '',
  matchingAutoCompleteResults: []
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

    default:
      return state
  }
}

export function changeVisibleContainer(container) {
  return {
    type: CHANGE_VISIBLE_CONTAINER,
    show: container
  }
}

export function toggleAlertVisibility(alertText) {
  return {
    type: TOGGLE_ALERT_VISIBILITY,
    alertText: alertText
  }
}

export const deleteSelectedToken = (tokenId) => {
  return (dispatch, getState) => {
    const jwsToken = getState().login.token
    const tokenIdToDelete = getState().tokenSearch.selectedTokenRowId
    var tokenServiceUrl = process.env.REACT_APP_TOKEN_URL + "/" + tokenIdToDelete
    fetch(tokenServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + jwsToken
      },
      method: 'delete',
      mode: 'cors'
    })
        .then(handleStatus)
        .then(getBody)
        .then(token => {
          dispatch(changeSelectedRow(tokenId))
          dispatch(performTokenSearch(jwsToken, ))
          dispatch(toggleAlertVisibility("Token has been deleted"))
        })
        .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

export const createToken = (newToken) => {
  return (dispatch, getState) => {
    const jwsToken = getState().login.token
    const { email } = newToken

    //TODO wire this in
    // dispatch(showCreateLoader(true))

    var tokenServiceUrl = process.env.REACT_APP_TOKEN_URL
    fetch(tokenServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + jwsToken
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        user_email:email,
        token_type: 'api'
      })
    })
        .then(handleStatus)
        .then(getBody)
        .then(newTokenId => {
          //TODO wire this in
          // dispatch(showCreateLoader(false))
          //TODO get a destination for displaying the token
          // dispatch(relativePush(`/user/${newUserId}`))
          dispatch(toggleAlertVisibility('Token has been created'))
        })
        .catch(error => handleErrors(error, dispatch, jwsToken))

  }
}


export function userAutoCompleteChange(autocompleteText, securityToken, param2){
  return (dispatch, getState) => {
    performUserSearch(securityToken)
    var matchingAutoCompleteResults = []
    var autoCompleteSuggestionLimit = 10; // We want to avoid having a vast drop-down box
    getState().userSearch.results.filter(result => {
      if(result.email.indexOf(autocompleteText) !== -1
        && matchingAutoCompleteResults.length <= autoCompleteSuggestionLimit){
        matchingAutoCompleteResults.push(result.email)
      }
    })
    dispatch({
      type: UPDATE_MATCHING_AUTO_COMPLETE_RESULTS,
      matchingAutoCompleteResults
    })
  }
}


function handleStatus(response) {
  if(response.status === 200){
    return Promise.resolve(response)
  } else if(response.status === 409) {
    return Promise.reject(new HttpError(response.status, 'This token already exists!'))
  }
  else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}


