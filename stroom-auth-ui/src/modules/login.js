import { push } from 'react-router-redux'
import { HttpError } from '../ErrorTypes'
import { SubmissionError } from 'redux-form'

export const EMAIL_CHANGE = 'login/EMAIL_CHANGE'
export const PASSWORD_CHANGE = 'login/PASSWORD_CHANGE'
export const TOKEN_CHANGE = 'login/TOKEN_CHANGE'
export const TOKEN_DELETE = 'login/TOKEN_DELETE'
export const SHOW_LOADER = 'login/SHOW_LOADER'
export const SHOW_UNAUTHORIZED_DIALOG = 'login/SHOW_UNAUTHORIZED_DIALOG'

const initialState = {
  token: '',
  showLoader: false,
  showUnauthorizedDialog: false
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
  localStorage.removeItem('token')
  return dispatch => {
    dispatch(deleteToken())
  }
}

export function showLoader(showLoader){
  return {
    type: SHOW_LOADER,
    showLoader
  }
}

export const checkForRememberMeToken = (dispatch) => {
  const token = localStorage.getItem('token')
  if(token){
      dispatch(changeToken(token))
  }
}

export const requestWasUnauthorized = (showUnauthorizedDialog) => {
  return {
    type: SHOW_UNAUTHORIZED_DIALOG,
    showUnauthorizedDialog
  }
}

export const handleSessionTimeout = () => {
  return dispatch => { 
    dispatch(logout())
    dispatch(requestWasUnauthorized(false))
  }
}

export const login = (credentials) => {
  return dispatch => {
    const { email, password, rememberMe } = credentials

    // We want to show a preloader while we're making the request. We turn it off when we receive a response or catch an error.
    dispatch(showLoader(true))

    var loginServiceUrl = process.env.REACT_APP_LOGIN_URL
    // Call the authentication service to get a token.
    // If successful we re-direct to Stroom, otherwise we display a message.
    // It's essential we return the promise, otherwise any errors we get won't be handled.
    return fetch(loginServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        email,
        password
      })
    })
      .then(handleStatus)
      .then(getBody)
      //TODO restore referrer
      // .then(jwsToken => processToken(jwsToken, dispatch, referrer))
      .then(jwsToken => processToken(jwsToken, dispatch, rememberMe, null))
  }
}

function handleStatus(response) {
  if(response.status === 200){
    return Promise.resolve(response)
  } 
  else if(response.status === 401 ){
    throw new SubmissionError({password: 'Bad credentials'})
  } else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}

function getBody(response) {
  return response.text()
}

function processToken(token, dispatch, rememberMe, referrer){
  if(rememberMe){
    const existingToken = localStorage.getItem('token')
    if(existingToken !== token) {
      localStorage.setItem('token', token)
    }
  }
  else {
    localStorage.removeItem('token')
  }

  dispatch(changeToken(token))
  dispatch(showLoader(false))        
  if(referrer === "stroom"){
    //TODO use authorisation header
    var loginUrl = process.env.REACT_APP_STROOM_UI_URL + '/?token=' + token
    window.location.href = loginUrl
  }
  else if(!referrer) {
    dispatch(push('/'))
  }
  else {
    dispatch(push(referrer))
  }
}
