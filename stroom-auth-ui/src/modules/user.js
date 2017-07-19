import { push } from 'react-router-redux'
import { HttpError } from '../ErrorTypes'

export const CREATE_REQUEST = 'user/CREATE_REQUEST'
export const CREATE_RESPONSE = 'user/CREATE_RESPONSE'
export const SHOW_CREATE_LOADER = 'user/SHOW_CREATE_LOADER'
export const ERROR_ADD = 'user/ERROR_ADD'
export const ERROR_REMOVE = 'user/ERROR_REMOVE'

const initialState = {
  user: '',
  password: '',
  showCreateLoader: false,
  errorStatus: -1,
  errorText: '',
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

export const attemptCreate = (email, password, first_name, last_name, comments, state, jwsToken) => {
  return dispatch => {
    // We're re-attempting a login so we should remove any old errors
    dispatch(errorRemove())

    dispatch(showCreateLoader(true))


    var userServiceUrl = process.env.REACT_APP_USER_URL
    // Call the authentication service to get a token.
    // If successful we re-direct to Stroom, otherwise we display a message.
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
    
    //TODO dispatch somewhere in the above. Should save the token just in case.
  }
}

export const saveChanges = (email, password, jwsToken) => {
  return dispatch => {
    console.log("TODO: save changes")
  }
}

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