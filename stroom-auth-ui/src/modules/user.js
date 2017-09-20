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
import dateFormat from 'dateformat'

import { relativePush } from '../relativePush'
import { HttpError } from '../ErrorTypes'
import { handleErrors, getBody, getJsonBody } from './fetchFunctions'
import { performUserSearch, changeSelectedRow } from './userSearch'

export const CREATE_REQUEST = 'user/CREATE_REQUEST'
export const CREATE_RESPONSE = 'user/CREATE_RESPONSE'
export const SHOW_CREATE_LOADER = 'user/SHOW_CREATE_LOADER'
export const SAVE_USER_TO_EDIT_FORM = 'user/SAVE_USER_TO_EDIT_FORM'
export const CHANGE_VISIBLE_CONTAINER = 'user/CHANGE_VISIBLE_CONTAINER'
export const TOGGLE_ALERT_VISIBILITY = 'user/TOGGLE_ALERT_VISIBILITY'

const initialState = {
  user: '',
  password: '',
  showCreateLoader: false,
  alertText: '',
  showAlert: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REQUEST:
      return {
        ...state,
        //TODO mark something as 'creating'
      }
    case CREATE_RESPONSE:
      return {
        ...state
        //TODO change creating to 'created' or something similar
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

    default:
      return state
  }
}

export function showCreateLoader(showCreateLoader){
  return {
    type: SHOW_CREATE_LOADER,
    showCreateLoader
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

function handleStatus(response) {
  if(response.status === 200){
    return Promise.resolve(response)
  } else if(response.status === 409) {
    return Promise.reject(new HttpError(response.status, 'This user already exists - please use a different email address.'))
  }
  else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}

function formatDate(dateString) {
  const dateFormatString = 'ddd mmm d yyyy, hh:MM:ss'
  return dateString ? dateFormat(dateString, dateFormatString) : ''
}

export const saveChanges = (editedUser) => {
  return (dispatch, getState) => {
     const jwsToken = getState().login.token
  const { id, email, password, first_name, last_name, comments, state } = editedUser

  var userServiceUrl = `${process.env.REACT_APP_USER_URL}/${id}`
  fetch(userServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + jwsToken
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
      dispatch(relativePush(`/user/${id}`))
      dispatch(toggleAlertVisibility('User has been updated'))
    })
    .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

export const createUser  = (newUser) => {
  return (dispatch, getState) => {

    const jwsToken = getState().login.token
    const { email, password, first_name, last_name, comments, state } = newUser

    dispatch(showCreateLoader(true))

    var userServiceUrl = process.env.REACT_APP_USER_URL
    fetch(userServiceUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization' : 'Bearer ' + jwsToken
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
        dispatch(relativePush(`/user/${newUserId}`))
        dispatch(toggleAlertVisibility('User has been created'))
      })
      .catch(error => handleErrors(error, dispatch, jwsToken))
    
  }
}

export const fetchUser = (userId) => {
  return (dispatch, getState) => {
    const jwsToken = getState().login.token
    //TODO: remove any errors
    //TODO: show loading spinner
    var userServiceUrl = process.env.REACT_APP_USER_URL + "/" + userId
    fetch(userServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + jwsToken
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
      dispatch(initialize("UserEditForm", user))
    })
    .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}


export const deleteSelectedUser = (userId) => {
  return (dispatch, getState) => {
    const jwsToken = getState().login.token
    const userIdToDelete = getState().userSearch.selectedUserRowId
    var userServiceUrl = process.env.REACT_APP_USER_URL + "/" + userIdToDelete
    fetch(userServiceUrl, {
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
    .then(user => {
      dispatch(changeSelectedRow(userId))
      dispatch(performUserSearch(jwsToken))
      dispatch(toggleAlertVisibility("User has been deleted"))
    })
    .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

export const changePasswordForCurrentUser = () => {
  return (dispatch, getState) => {
    const jwsToken = getState().login.token
    var userServiceUrl = process.env.REACT_APP_USER_URL + "/me"
    fetch(userServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + jwsToken
      },
      method: 'get',
      mode: 'cors'
    })
    .then(handleStatus)
    .then(getJsonBody)
    .then(getUser)
    .then(user => {
      dispatch(changePassword(user.id))
    })
    .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

export const changePassword = (userId) => {
  return (dispatch, getState) => {
    const userServiceUrl = `${process.env.REACT_APP_USER_URL}/${userId}`
    const jwsToken = getState().login.token
    const newPassword = getState().form.ChangePasswordForm.values.password
    fetch(userServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + jwsToken
      },
      method: 'put',
      mode: 'cors',
      body: JSON.stringify({
        password: newPassword
      })
    })
    .then(handleStatus)
    .then(() => {
      dispatch(toggleAlertVisibility("Your password has been changed"))
    })
    .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

export const submitPasswordChangeRequest = (formData) => {
  return (dispatch, getState) => {
    const userServiceUrl = `${process.env.REACT_APP_AUTHENTICATION_URL}/reset/${formData.emailAddress}`
    const jwsToken = getState().login.token
    fetch(userServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + jwsToken
      },
      method: 'get',
      mode: 'cors'
    })
    .then(handleStatus)
    .then(() => {
      dispatch(relativePush('/confirmPasswordResetEmail'))
    })
    .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

function getUser(user) {
  //TODO check that there is a user and throw an error if there isn't one
  return user[0]
}

function modifyDataForDisplay(user) {
  if(!user.last_login){
    user.last_login = "Never logged in"
  }
  else {
    user.last_login = formatDate(user.last_login)
  }

  if(!user.updated_on){
    user.updated_on = "Never been updated"
  }
  else {
    user.updated_on = formatDate(user.updated_on)
  }

  if(!user.updated_by_user) {
    user.updated_by_user = "Never been updated"
  }

  user.created_on = formatDate(user.created_on)

  return user
}