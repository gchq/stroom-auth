import { push } from 'react-router-redux'
import { HttpError } from '../ErrorTypes'
import { initialize } from 'redux-form'

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
  showCreateLoader: false
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
      dispatch(push(`/user/${id}`))
      dispatch(toggleAlertVisibility('User has been updated'))
    })
    .catch(error => handleErrors(error, dispatch))
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
        dispatch(push(`/user/${newUserId}`))
        dispatch(toggleAlertVisibility('Your changes have been saved'))
      })
      .catch(error => handleErrors(error, dispatch))
    
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
    .catch(error => handleErrors(error, dispatch))
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
    })
    .catch(error => handleErrors(error, dispatch))
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
    .catch(error => handleErrors(error, dispatch))
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
    .catch(error => handleErrors(error, dispatch))
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
  if(!user.updated_on){
    user.updated_on = "Never been updated"
  }
  if(!user.updated_by_user) {
    user.updated_by_user = "Never been updated"
  }
  return user
}