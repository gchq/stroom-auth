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

import { SubmissionError } from 'redux-form'

import Cookies from 'cookies-js'

import { HttpError } from '../ErrorTypes'

export const EMAIL_CHANGE = 'login/EMAIL_CHANGE'
export const PASSWORD_CHANGE = 'login/PASSWORD_CHANGE'
export const TOKEN_CHANGE = 'login/TOKEN_CHANGE'
export const TOKEN_DELETE = 'login/TOKEN_DELETE'
export const SHOW_LOADER = 'login/SHOW_LOADER'
export const SHOW_UNAUTHORIZED_DIALOG = 'login/SHOW_UNAUTHORIZED_DIALOG'
export const CHANGE_LOGGED_IN_USER = 'login/CHANGE_LOGGED_IN_USER'
export const SET_REDIRECT_URL = 'login/SET_REDIRECT_URL'
export const SET_CLIENT_ID = 'login/SET_CLIENT_ID'
export const SET_SESSION_ID = 'login/SET_SESSION_ID'

const initialState = {
  token: '',
  showLoader: false,
  showUnauthorizedDialog: false,
  loggedInUserEmail: undefined
}

export default (state = initialState, action) => {
  switch (action.type) {
    case EMAIL_CHANGE:
      return {
        ...state,
        email: action.email
      }

    case TOKEN_CHANGE:
      return {
        ...state,
        token: action.token
      }
    case TOKEN_DELETE:
      return {
        ...state,
        token: ''
      }
    case SHOW_LOADER:
      return {
        ...state,
        showLoader: action.showLoader
      }

    case SHOW_UNAUTHORIZED_DIALOG:
      return {
        ...state,
        showUnauthorizedDialog: action.showUnauthorizedDialog
      }

    case CHANGE_LOGGED_IN_USER:
      return {
        ...state,
        loggedInUserEmail: action.userEmail
      }

    case SET_REDIRECT_URL:
      return {
        ...state,
        redirectUrl: action.redirectUrl
      }

    case SET_CLIENT_ID:
      return {
        ...state,
        clientId: action.clientId
      }

    case SET_SESSION_ID:
      return {
        ...state,
        sessionId: action.sessionId
      }

    default:
      return state
  }
}

export function changeToken (token) {
  return {
    type: TOKEN_CHANGE,
    token: token
  }
}

export function deleteToken () {
  return {
    type: TOKEN_DELETE
  }
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userEmail')
  return dispatch => {
    dispatch(deleteToken())
    dispatch(storeLoggedInUser(undefined))
  }
}

export function showLoader (showLoader) {
  return {
    type: SHOW_LOADER,
    showLoader
  }
}

export const checkForRememberMeToken = (dispatch) => {
  const token = localStorage.getItem('token')
  const userEmail = localStorage.getItem('userEmail')

  if (userEmail) {
    dispatch(storeLoggedInUser(userEmail))
  }
  if (token) {
    dispatch(changeToken(token))
  }
}

export const requestWasUnauthorized = (showUnauthorizedDialog) => {
  return {
    type: SHOW_UNAUTHORIZED_DIALOG,
    showUnauthorizedDialog
  }
}

export function storeLoggedInUser (userEmail) {
  return {
    type: CHANGE_LOGGED_IN_USER,
    userEmail
  }
}

export const handleSessionTimeout = () => {
  return dispatch => {
    dispatch(logout())
    dispatch(requestWasUnauthorized(false))
  }
}

/** This is the URL to redirect to after logging in, e.g. Stroom's location. */
export const changeRedirectUrl = (redirectUrl) => {
  return {
    type: SET_REDIRECT_URL,
    redirectUrl
  }
}

/** This is the client ID of the relying party that originally requested authentication, e.g. Stroom. */
export const changeClientIdUrl = (clientId) => {
  return {
    type: SET_CLIENT_ID,
    clientId
  }
}

export const changeSessionId = (sessionId) => {
  return {
    type: SET_SESSION_ID,
    sessionId
  }
}

export const login = (credentials) => {
  return (dispatch, getState) => {
    const { email, password, rememberMe } = credentials

    // We want to show a preloader while we're making the request. We turn it off when we receive a response or catch an error.
    dispatch(showLoader(true))

    const loginServiceUrl = process.env.REACT_APP_LOGIN_URL
    const redirectUrl = getState().login.redirectUrl
    const clientId = getState().login.clientId

    // We need to post the sessionId in the credentials, otherwise the
    // authenticationService will have no way of marking the session as valid.
    const sessionId = Cookies.get('sessionId')

    try {
      // Call the authentication service to get a token.
      // If successful we re-direct to Stroom, otherwise we display a message.
      // It's essential we return the promise, otherwise any errors we get won't be handled.
      return fetch(loginServiceUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include', // This should include the cookies
        method: 'post',
        mode: 'cors',
        body: JSON.stringify({
          email,
          password,
          sessionId,
          requestingClientId: clientId
        })
      })
        .then(handleStatus)
        .then(getBody)
        .then(accessCode => {
          window.location.href = `${redirectUrl}/?accessCode=${accessCode}`
        })
    } catch (err) {
      console.log("TODO: Couldn't get a session ID - handle it somehow. Probably redirect to Stroom?")
    }
  }
}

function handleStatus (response) {
  if (response.status === 200) {
    return Promise.resolve(response)
  } else if (response.status === 401) {
    throw new SubmissionError({password: 'Invalid login'})
  } else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}

function getBody (response) {
  return response.text()
}
