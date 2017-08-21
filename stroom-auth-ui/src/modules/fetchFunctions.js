import { requestWasUnauthorized } from './login'
import jwtDecode from 'jwt-decode'
import { push } from 'react-router-redux'

export function handleErrors(error, dispatch, token) {
  if(error.status === 401){

    const decodedToken = jwtDecode(token)
    const now = new Date().getTime() / 1000
    const expiredToken = decodedToken.exp <= now
    if(expiredToken){
      //TODO rename this to 'requestExpiredToken'
      dispatch(requestWasUnauthorized(true))  
    }
    else {
      // If it's not expired then that means this user is genuinely unauthorised
      dispatch(push('/unauthorised'))
    }  
  }
  else { 
    // dispatch(errorAdd(error.status, error.message))
  }
}

export function getBody(response) {
  return response.text()
}

export function getJsonBody(response) {
  return response.json()
}