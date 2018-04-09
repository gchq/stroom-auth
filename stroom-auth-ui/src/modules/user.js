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

import { initialize } from 'redux-form'
import { push } from 'react-router-redux'
import dateFormat from 'dateformat'

import { HttpError } from '../ErrorTypes'
import { handleErrors, getBody, getJsonBody } from './fetchFunctions'
import { performUserSearch, changeSelectedRow } from './userSearch'

export const CREATE_REQUEST = 'user/CREATE_REQUEST'
export const CREATE_RESPONSE = 'user/CREATE_RESPONSE'
export const SHOW_CREATE_LOADER = 'user/SHOW_CREATE_LOADER'
export const SAVE_USER_TO_EDIT_FORM = 'user/SAVE_USER_TO_EDIT_FORM'
export const CHANGE_VISIBLE_CONTAINER = 'user/CHANGE_VISIBLE_CONTAINER'
export const TOGGLE_ALERT_VISIBILITY = 'user/TOGGLE_ALERT_VISIBILITY'
export const SHOW_CHANGE_PASSWORD_ERROR_MESSAGE = 'user/SHOW_CHANGE_PASSWORD_ERROR_MESSAGE'
export const HIDE_CHANGE_PASSWORD_ERROR_MESSAGE = 'user/HIDE_CHANGE_PASSWORD_ERROR_MESSAGE'

const initialState = {
  user: '',
  password: '',
  showCreateLoader: false,
  alertText: '',
  showAlert: false,
  changePasswordErrorMessage: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REQUEST:
      return {
        ...state
        // TODO mark something as 'creating'
      }
    case CREATE_RESPONSE:
      return {
        ...state
        // TODO change creating to 'created' or something similar
      }
    case SHOW_CREATE_LOADER:
      return {
        ...state,
        showCreateLoader: action.showCreateLoader
      }

    case SAVE_USER_TO_EDIT_FORM:
      return {
        ...state,
        userBeingEdited: action.user
      }

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

    case SHOW_CHANGE_PASSWORD_ERROR_MESSAGE:
      return {
        ...state,
        changePasswordErrorMessage: action.message
      }

    case HIDE_CHANGE_PASSWORD_ERROR_MESSAGE:
      return {
        ...state,
        changePasswordErrorMessage: ''
      }

    default:
      return state
  }
}

export function showCreateLoader (showCreateLoader) {
  return {
    type: SHOW_CREATE_LOADER,
    showCreateLoader
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

function showChangePasswordErrorMessage (message) {
  return {
    type: SHOW_CHANGE_PASSWORD_ERROR_MESSAGE,
    message
  }
}

function hideChangePasswordErrorMessage () {
  return {
    type: HIDE_CHANGE_PASSWORD_ERROR_MESSAGE
  }
}

function handleStatus (response) {
  if (response.status === 200) {
    return Promise.resolve(response)
  } else if (response.status === 409) {
    return Promise.reject(new HttpError(response.status, 'This user already exists - please use a different email address.'))
  } else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}

function formatDate (dateString) {
  const dateFormatString = 'ddd mmm d yyyy, hh:MM:ss'
  return dateString ? dateFormat(dateString, dateFormatString) : ''
}

export const saveChanges = (editedUser) => {
  return (dispatch, getState) => {
    const jwsToken = getState().authentication.idToken
    const { id, email, password, first_name, last_name, comments, state } = editedUser

    fetch(`${getState().config.userServiceUrl}/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwsToken
      },
      method: 'put',
      mode: 'cors',
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
        comments,
        state
      })
    })
    .then(handleStatus)
    .then(() => {
      dispatch(push(`/user/${id}`))
      dispatch(toggleAlertVisibility('User has been updated'))
    })
    .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

export const createUser = (newUser) => {
  return (dispatch, getState) => {
    const jwsToken = getState().authentication.idToken
    const { email, password, first_name, last_name, comments, state } = newUser

    dispatch(showCreateLoader(true))

    fetch(getState().config.userServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwsToken
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
        comments,
        state
      })
    })
      .then(handleStatus)
      .then(getBody)
      .then(newUserId => {
        dispatch(showCreateLoader(false))
        dispatch(push(`/user/${newUserId}`))
        dispatch(toggleAlertVisibility('User has been created'))
      })
      .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

export const fetchUser = (userId) => {
  return (dispatch, getState) => {
    const jwsToken = getState().authentication.idToken
    // TODO: remove any errors
    // TODO: show loading spinner
    fetch(`${getState().config.userServiceUrl}/${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwsToken
      },
      method: 'get',
      mode: 'cors'
    })
    .then(handleStatus)
    .then(getJsonBody)
    .then(getUser)
    .then(modifyDataForDisplay)
    .then(user => {
      dispatch(showCreateLoader(false))
      // Use the redux-form action creator to re-initialize the form with this user
      dispatch(initialize('UserEditForm', user))
    })
    .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

export const deleteSelectedUser = (userId) => {
  return (dispatch, getState) => {
    const jwsToken = getState().authentication.idToken
    const userIdToDelete = getState().userSearch.selectedUserRowId
    fetch(`${getState().config.userServiceUrl}/${userIdToDelete}`, {
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
      dispatch(changeSelectedRow(userId))
      dispatch(performUserSearch(jwsToken))
      dispatch(toggleAlertVisibility('User has been deleted'))
    })
    .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

export const changePasswordForCurrentUser = () => {
  return (dispatch, getState) => {
    fetch(`${getState().config.userServiceUrl}/me`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'get',
      mode: 'cors'
    })
    .then(handleStatus)
    .then(getJsonBody)
    .then(getUser)
    .then(user => {
      dispatch(changePassword(user.email))
    })
  }
}

export const changePassword = () => {
  return (dispatch, getState) => {
    dispatch(hideChangePasswordErrorMessage())

    const form = getState().form.ChangePasswordForm
    const email = form.values.email
    const oldPassword = form.values.oldPassword
    const newPassword = form.values.newPassword
    const newPasswordConfirmation = form.values.newPasswordConfirmation
    const redirectUrl = form.values.redirectUrl

    if (newPassword !== newPasswordConfirmation) {
      dispatch(showChangePasswordErrorMessage('The new passwords do not match!'))
    } else {
      fetch(`${getState().config.authenticationServiceUrl}/changePassword/`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'post',
        mode: 'cors',
        body: JSON.stringify({newPassword, oldPassword, email})
      })
      .then(handleStatus)
      .then(() => {
        // We'll redirect if we have a redirect URL. Otherwise we'll show a message confirming the password has been changed
        if (redirectUrl) {
          // TODO: Maybe show a message with a delay.
          window.location.href = redirectUrl
        } else {
          dispatch(toggleAlertVisibility('Your password has been changed'))
        }
      })
      .catch(error => {
        if (error.status === 401) {
          dispatch(showChangePasswordErrorMessage('The old password you supplied is not valid!'))
        }
      })
    }
  }
}

export const submitPasswordChangeRequest = (formData) => {
  return (dispatch, getState) => {
    const authenticationServiceUrl = `${getState().config.authenticationServiceUrl}/reset/${formData.emailAddress}`
    const jwsToken = getState().authentication.idToken
    fetch(authenticationServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwsToken
      },
      method: 'get',
      mode: 'cors'
    })
    .then(handleStatus)
    .then(() => {
      dispatch(push('/confirmPasswordResetEmail'))
    })
    .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

function getUser (user) {
  // TODO check that there is a user and throw an error if there isn't one
  return user[0]
}

function modifyDataForDisplay (user) {
  if (!user.last_login) {
    user.last_login = 'Never logged in'
  } else {
    user.last_login = formatDate(user.last_login)
  }

  if (!user.updated_on) {
    user.updated_on = 'Never been updated'
  } else {
    user.updated_on = formatDate(user.updated_on)
  }

  if (!user.updated_by_user) {
    user.updated_by_user = 'Never been updated'
  }

  user.created_on = formatDate(user.created_on)

  return user
}
