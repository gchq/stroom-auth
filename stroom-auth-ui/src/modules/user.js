import { push } from 'react-router-redux'
import { HttpError } from '../ErrorTypes'
import { initialize } from 'redux-form'

export const CREATE_REQUEST = 'user/CREATE_REQUEST'
export const CREATE_RESPONSE = 'user/CREATE_RESPONSE'
export const SHOW_CREATE_LOADER = 'user/SHOW_CREATE_LOADER'
export const ERROR_ADD = 'user/ERROR_ADD'
export const ERROR_REMOVE = 'user/ERROR_REMOVE'
export const SAVE_USER_TO_EDIT_FORM = 'user/SAVE_USER_TO_EDIT_FORM'
export const CHANGE_VISIBLE_CONTAINER = 'user/CHANGE_VISIBLE_CONTAINER'

const initialState = {
  user: '',
  password: '',
  showCreateLoader: false,
  errorStatus: -1,
  errorText: ''
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

    case ERROR_ADD:
      return {
        ...state,
        errorStatus: action.status,
        errorText: action.text
      }
    case ERROR_REMOVE:
      return {
        ...state,
        errorStatus: -1,
        errorText: ''
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

export function errorAdd(status, text){
  return {
    type: ERROR_ADD,
    status,
    text
  }
}

export function errorRemove(){
  return {
    type: ERROR_REMOVE
  }
}

export function changeVisibleContainer(container) {
  return {
    type: CHANGE_VISIBLE_CONTAINER,
    show: container
  }
}

// export const attemptCreate = (email, password, first_name, last_name, comments, state, jwsToken) => {
//   return dispatch => {
//     // We're re-attempting a login so we should remove any old errors
//     dispatch(errorRemove())

//     dispatch(showCreateLoader(true))


//     var userServiceUrl = process.env.REACT_APP_USER_URL
//     // Call the authentication service to get a token.
//     // If successful we re-direct to Stroom, otherwise we display a message.
//     fetch(userServiceUrl, {
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization' : 'Bearer ' + jwsToken
//         },
//         method: 'post',
//         mode: 'cors',
//         body: JSON.stringify({
//           email,
//           password,
//           first_name,
//           last_name,
//           comments,
//           state
//         })
//       })
//       .then(handleStatus)
//       .then(getBody)
//       .then(newUserId => {
//         dispatch(showCreateLoader(false))
//         dispatch(push(`/user/${newUserId}`))
//       })
//       .catch(error => handleErrors(error, dispatch))
    
//     //TODO dispatch somewhere in the above. Should save the token just in case.
//   }
// }

export const loadUser = (userId, jwsToken) => {
  return dispatch => {
    //TODO load the user and put it into the store
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

function getBody(response) {
  return response.text()
}

function getJsonBody(response) {
  return response.json()
}

function handleErrors(error, dispatch) {
  dispatch(showCreateLoader(false))
  if(error.status === 401){
    //TODO: Consider logging the user out here - their token might be invalid.
    dispatch(errorAdd(error.status, 'Could not authenticate. Please try logging in again.'))
  }
  else { 
    dispatch(errorAdd(error.status, error.message))
  }
}

export const saveChanges = (editedUser) => {
  return (dispatch, getState) => {
     const jwsToken = getState().login.token
  const { id, email, password, first_name, last_name, comments, state } = editedUser
    // We're re-attempting a login so we should remove any old errors
  dispatch(errorRemove())

  dispatch(showCreateLoader(true))

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
    .then(getBody)
    .then(() => {
      dispatch(showCreateLoader(false))
      dispatch(push(`/user/${id}`))
    })
    .catch(error => handleErrors(error, dispatch))
  }
}

export const createUser  = (newUser) => {
  return (dispatch, getState) => {

    const jwsToken = getState().login.token
    const { email, password, first_name, last_name, comments, state } = newUser
      // We're re-attempting a login so we should remove any old errors
    dispatch(errorRemove())

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