import { requestWasUnauthorized } from './login'

export function handleErrors(error, dispatch) {
  if(error.status === 401){
    dispatch(requestWasUnauthorized(true))
    // dispatch(errorAdd(error.status, 'Could not authenticate. Please try logging in again.'))
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