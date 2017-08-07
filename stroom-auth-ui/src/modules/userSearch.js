import { HttpError } from '../ErrorTypes'
import { handleErrors, getJsonBody } from './fetchFunctions'

export const SHOW_SEARCH_LOADER = 'userSearch/SHOW_SEARCH_LOADER'
export const ERROR_ADD = 'userSearch/ERROR_ADD'
export const ERROR_REMOVE = 'userSearch/ERROR_REMOVE'
export const UPDATE_RESULTS = 'userSearch/UPDATE_RESULTS'

const initialState = {
  users: [],
  showSearchLoader: false,
  errorStatus: -1,
  errorText: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
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

    case SHOW_SEARCH_LOADER:
      return {
        ...state,
        showSearchLoader: action.showSearchLoader
      }

    case UPDATE_RESULTS:
      return {
        ...state,
        results: action.results
      }

    default:
      return state
  }
}

export function showSearchLoader(showSearchLoader){
  return {
    type: SHOW_SEARCH_LOADER,
    showSearchLoader
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

export function updateResults(results){
  return {
    type: UPDATE_RESULTS,
    results
  }
}

export const performUserSearch = (jwsToken) => {
  return dispatch => {
    dispatch(errorRemove())
    dispatch(showSearchLoader(true))

    var userSearchUrl = process.env.REACT_APP_USER_URL + '/?fromEmail=&usersPerPage=100&orderBy=id'
    fetch(userSearchUrl, {
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
    .then(data => {
      dispatch(showSearchLoader(false))
      dispatch(updateResults(data))
    })
    .catch(error => handleErrors(error, dispatch))    
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
