import { push } from 'react-router-redux'
import { HttpError } from '../ErrorTypes'

export const USERNAME_CHANGE = 'login/USERNAME_CHANGE'
export const PASSWORD_CHANGE = 'login/PASSWORD_CHANGE'
export const TOKEN_CHANGE = 'login/TOKEN_CHANGE'
export const TOKEN_DELETE = 'login/TOKEN_DELETE'
export const ERROR_ADD = 'login/ERROR_ADD'
export const ERROR_REMOVE = 'login/ERROR_REMOVE'

const initialState = {
  token: '',
  errorStatus: '',
  errorText: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case USERNAME_CHANGE:
      return {
        ...state,
        username: action.username
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
    case ERROR_ADD:
      return {
        ...state,
        errorStatus: action.status,
        errorText: action.text
      }
    case ERROR_REMOVE:
      return {
        ...state,
        errorStatus: '',
        errorText: ''
      }
    default:
      return state
  }
}

export function changeToken(token) {
  return {
    type: TOKEN_CHANGE,
    token: token
  }
}

export function deleteToken() {
  return {
    type: TOKEN_DELETE
  }
}

export const logout = () => {
    return dispatch => {
      dispatch(deleteToken())
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

export const attempLogin = (username, password, referrer) => {
  return dispatch => {
    // We're re-attempting a login so we should remove any old errors
    dispatch(errorRemove())

    var loginServiceUrl = process.env.REACT_APP_LOGIN_URL
    // Call the authentication service to get a token.
    // If successful we re-direct to Stroom, otherwise we display a message.
    fetch(loginServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        username,
        password
      })
    })
      .then(handleStatus)
      .then(getBody)
      .then(jwsToken => processToken(jwsToken, dispatch, referrer))
      .catch(error => handleErrors(error, dispatch))
  }
}

function handleStatus(response) {
  if(response.status === 200){
    return Promise.resolve(response)
  } else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}

function getBody(response) {
  return response.text()
}

function processToken(token, dispatch, referrer){
  dispatch(changeToken(token))        
        if(referrer === "stroom"){
          //TODO use authorisation header
          var loginUrl = process.env.REACT_APP_STROOM_UI_URL + '/?token=' + token
          window.location.href = loginUrl
        }
        else if(referrer === "") {
          dispatch(push('/'))
        }
        else {
          dispatch(push(referrer))
        }
}

function handleErrors(error, dispatch) {
  if(error.status === 401){
    dispatch(errorAdd(error.status, 'Those credentials are not valid. Please try again.'))
  }
  else { 
    dispatch(errorAdd(error.status, error.message))
  }
}
