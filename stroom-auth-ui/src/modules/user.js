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

export const attemptCreate = (name, password, jwsToken) => {
  return dispatch => {
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
          name,
          password
        })
      })
      .then(handleStatus)
      .then(result => result.text())
      .then(whatsThisGoingToBe => {
        dispatch(showCreateLoader(false))
        //TODO dispatch the ending action to disable the spinner
        console.log(whatsThisGoingToBe)
      })
      .catch(error => handleErrors(error, dispatch))
    
    //TODO dispatch somewhere in the above. Should save the token just in case.
  }
}

function handleStatus(response) {
  if(response.status === 200){
    return Promise.resolve(response)
  } else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}

function handleErrors(error, dispatch) {
  dispatch(showCreateLoader(false))
  if(error.status === 401){
    //TODO: Consider logging the user out here - their token might be invalid.
    dispatch(errorAdd(error.status, 'Could not authentication. Please try logging in again.'))
  }
  else { 
    dispatch(errorAdd(error.status, error.message))
  }
}